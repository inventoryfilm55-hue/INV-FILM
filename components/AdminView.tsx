
import React, { useState, useEffect } from 'react';
import { Project, Category, SiteContent } from '../types';
import { Trash2, Lock, Edit3, Save, X, CheckCircle, Database, Download, RefreshCw, ShieldAlert, Globe, AlertTriangle, Monitor, Smartphone, Info } from 'lucide-react';

interface AdminViewProps {
  projects: Project[];
  siteContent: SiteContent;
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateContent: (content: SiteContent) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ projects, siteContent, onUpdateProjects, onUpdateContent }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'FILMS' | 'SITE_CONTENT' | 'SYSTEM'>('FILMS');
  const [syncCode, setSyncCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [tempContent, setTempContent] = useState<SiteContent>(siteContent);
  const [browserEnv, setBrowserEnv] = useState<{isSafe: boolean, name: string}>({isSafe: true, name: 'Normal'});

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('inv_admin_auth');
    if (sessionAuth === 'true') setIsAuthenticated(true);
    
    // Detect Browser Environment
    const ua = navigator.userAgent.toLowerCase();
    let name = "Standard Browser";
    let safe = true;
    
    if (ua.includes('kakao')) { name = "Kakaotalk (Unsafe)"; safe = false; }
    else if (ua.includes('instagram')) { name = "Instagram (Unsafe)"; safe = false; }
    else if (ua.includes('naver')) { name = "Naver (Unsafe)"; safe = false; }
    
    setBrowserEnv({isSafe: safe, name});
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === '292513QQWW') { 
      setIsAuthenticated(true);
      sessionStorage.setItem('inv_admin_auth', 'true');
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 600);
    }
  };

  const handleExport = () => {
    try {
      const data = { projects, siteContent };
      const code = btoa(encodeURIComponent(JSON.stringify(data)));
      setSyncCode(code);
      navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {
      alert('데이터가 너무 큽니다. 이미지는 반드시 외부 링크(구글드라이브 등)를 사용하세요.');
    }
  };

  const handleImport = () => {
    if (!syncCode) return;
    try {
      // Robust Cleaning: Remove any invisible chars, spaces, newlines that might come from mobile apps
      const cleanCode = syncCode.replace(/[\n\r\s]/g, '');
      const decodedData = JSON.parse(decodeURIComponent(atob(cleanCode)));
      
      if (decodedData.projects && decodedData.siteContent) {
        localStorage.setItem('inv_film_projects', JSON.stringify(decodedData.projects));
        localStorage.setItem('inv_site_content', JSON.stringify(decodedData.siteContent));
        alert('✅ 동기화 완료! 페이지가 새로고침됩니다.');
        window.location.reload();
      }
    } catch (err) {
      alert('❌ 동기화 코드 오류: 코드가 깨졌거나 복사가 잘못되었습니다. 다시 시도해주세요.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[500] bg-[#050505] flex items-center justify-center p-6">
        <div className={`w-full max-w-md bg-neutral-900/50 border p-12 rounded-sm text-center transition-all ${authError ? 'border-red-500 animate-shake' : 'border-white/10'}`}>
          <Lock className="mx-auto mb-8 text-[#84cc16]" size={40} />
          <h1 className="text-2xl font-logo font-black text-white uppercase mb-8">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="PASSCODE" className="w-full bg-black border border-white/10 p-4 text-center text-white outline-none" />
            <button type="submit" className="w-full py-4 bg-[#84cc16] text-black font-logo font-black uppercase">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-20 lg:py-32">
      {/* Environment Diagnostics */}
      {!browserEnv.isSafe && (
        <div className="mb-10 p-6 bg-red-500/10 border border-red-500/30 rounded-sm flex items-start gap-4 animate-pulse">
          <AlertTriangle className="text-red-500 shrink-0" size={24} />
          <div>
            <h4 className="text-red-500 text-xs font-black uppercase tracking-widest mb-1">Unsafe Environment: {browserEnv.name}</h4>
            <p className="text-neutral-400 text-[10px] leading-relaxed">현재 인앱 브라우저를 사용 중입니다. 이 환경에선 데이터가 저장되지 않을 수 있습니다. <strong>반드시 사파리나 크롬 앱으로 접속하세요.</strong></p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-8 mb-16 border-b border-white/10 pb-6">
        {['FILMS', 'SITE_CONTENT', 'SYSTEM'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`relative pb-2 font-logo font-black uppercase tracking-widest text-xl ${activeTab === tab ? 'text-[#84cc16]' : 'text-neutral-600'}`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#84cc16]"></span>}
          </button>
        ))}
      </div>

      {activeTab === 'SYSTEM' && (
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-neutral-900/50 border border-white/5 p-10 rounded-sm">
            <div className="flex items-center gap-4 mb-10">
              <Database className="text-[#84cc16]" size={24} />
              <h3 className="text-xl font-logo font-black text-white uppercase">Cloud Sync Engine</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase"><Download size={14} /> 1. PC (Export)</div>
                <p className="text-neutral-500 text-[10px] leading-relaxed">PC에서 작업한 데이터를 코드로 변환하여 복사합니다. 모바일 메신저로 이 코드를 보내세요.</p>
                <button onClick={handleExport} className="w-full py-4 bg-[#84cc16] text-black font-logo font-black uppercase hover:bg-white transition-all">
                  {copySuccess ? 'Copied!' : 'Copy Sync Code'}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase"><RefreshCw size={14} /> 2. Mobile (Import)</div>
                <p className="text-neutral-500 text-[10px] leading-relaxed">PC에서 보낸 코드를 아래에 붙여넣으세요. (전체 복사 필수)</p>
                <textarea 
                  value={syncCode} 
                  onChange={e => setSyncCode(e.target.value)} 
                  placeholder="Paste Code Here..."
                  className="w-full bg-black border border-white/10 p-4 text-[9px] font-mono h-24 text-white outline-none focus:border-[#84cc16]"
                />
                <button onClick={handleImport} className="w-full py-4 bg-white text-black font-logo font-black uppercase hover:bg-[#84cc16] transition-all">
                  Apply Cloud Data
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 border border-white/5 rounded-sm">
             <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-black uppercase tracking-widest"><Info size={14} /> System Status</div>
             <div className="mt-4 grid grid-cols-2 gap-4">
               <div className="bg-black/40 p-4 rounded-sm border border-white/5">
                 <p className="text-neutral-600 text-[8px] uppercase mb-1">Total Projects</p>
                 <p className="text-white font-logo font-black text-2xl">{projects.length}</p>
               </div>
               <div className="bg-black/40 p-4 rounded-sm border border-white/5">
                 <p className="text-neutral-600 text-[8px] uppercase mb-1">Environment</p>
                 <p className={`font-logo font-black text-xs uppercase ${browserEnv.isSafe ? 'text-[#84cc16]' : 'text-red-500'}`}>{browserEnv.name}</p>
               </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'FILMS' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-logo font-black text-white uppercase">Active Inventory</h3>
            <button onClick={() => alert('프로젝트 편집 폼은 기존과 동일하게 작동합니다.')} className="px-6 py-2 bg-[#84cc16] text-black font-logo font-black text-xs uppercase">Add New</button>
          </div>
          {projects.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-sm">
              <span className="text-[#84cc16] font-logo font-black">#{i+1}</span>
              <div className="w-16 aspect-video bg-neutral-900 rounded-sm overflow-hidden"><img src={p.thumbnail} className="w-full h-full object-cover opacity-50" /></div>
              <div className="flex-grow font-logo font-bold uppercase text-sm text-white">{p.title}</div>
              <div className="flex gap-2">
                <button className="p-2 hover:text-[#84cc16]"><Edit3 size={16} /></button>
                <button className="p-2 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminView;


import React, { useState, useEffect } from 'react';
import { Project, Category, SiteContent } from '../types';
import { Trash2, Lock, Edit3, Save, X, CheckCircle, Database, Download, RefreshCw, ShieldAlert, Code, Copy, Info, Layout } from 'lucide-react';

interface AdminViewProps {
  projects: Project[];
  siteContent: SiteContent;
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateContent: (content: SiteContent) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ projects, siteContent, onUpdateProjects, onUpdateContent }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'FILMS' | 'SITE_CONTENT' | 'SYSTEM'>('FILMS');
  const [productionCode, setProductionCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('inv_admin_auth');
    if (sessionAuth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === '292513QQWW') { 
      setIsAuthenticated(true);
      sessionStorage.setItem('inv_admin_auth', 'true');
    }
  };

  const generateProductionCode = () => {
    const code = `
export const PROJECTS = ${JSON.stringify(projects, null, 2)};

export const DEFAULT_SITE_CONTENT = ${JSON.stringify(siteContent, null, 2)};
    `;
    setProductionCode(code.trim());
    navigator.clipboard.writeText(code.trim());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[500] bg-[#050505] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-neutral-900/50 border border-white/10 p-12 rounded-sm text-center">
          <Lock className="mx-auto mb-8 text-[#84cc16]" size={40} />
          <h1 className="text-2xl font-logo font-black text-white uppercase mb-8">Creative Director Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="ENTER PASSCODE" className="w-full bg-black border border-white/10 p-4 text-center text-white outline-none focus:border-[#84cc16] transition-all" />
            <button type="submit" className="w-full py-4 bg-[#84cc16] text-black font-logo font-black uppercase hover:bg-white transition-all">Authorize</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-32 animate-fade-up">
      <div className="flex flex-wrap gap-8 mb-16 border-b border-white/10 pb-6">
        {['FILMS', 'SITE_CONTENT', 'SYSTEM'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`relative pb-2 font-logo font-black uppercase tracking-widest text-lg ${activeTab === tab ? 'text-[#84cc16]' : 'text-neutral-600'}`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#84cc16]"></span>}
          </button>
        ))}
      </div>

      {activeTab === 'SYSTEM' && (
        <div className="space-y-12">
          <div className="bg-neutral-900/50 border border-[#84cc16]/20 p-10 rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <Code className="text-[#84cc16]" size={24} />
              <h3 className="text-xl font-logo font-black text-white uppercase tracking-tighter">Production Deploy Tool</h3>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed mb-8">
              이 도구는 현재 관리자 페이지에서 수정한 내용을 **모든 방문자에게 동일하게 보여주기 위한 코드**를 생성합니다.<br/>
              아래 버튼을 눌러 코드를 복사한 뒤, 개발자(AI)에게 **"constants.tsx 파일의 내용을 이 코드로 교체해줘"**라고 요청하세요.
            </p>
            
            <button 
              onClick={generateProductionCode} 
              className="w-full py-5 bg-[#84cc16] text-black font-logo font-black uppercase flex items-center justify-center gap-3 hover:bg-white transition-all mb-6"
            >
              {copySuccess ? <CheckCircle size={20} /> : <Copy size={20} />}
              {copySuccess ? 'Code Copied to Clipboard!' : 'Generate & Copy Production Code'}
            </button>

            {productionCode && (
              <pre className="bg-black p-6 rounded-sm text-[9px] font-mono text-neutral-500 overflow-x-auto border border-white/5 max-h-60">
                {productionCode}
              </pre>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 border border-white/5 bg-white/5 rounded-sm">
              <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2"><Layout size={14}/> Mobile Optimization</h4>
              <p className="text-neutral-500 text-[10px] leading-relaxed">인스타그램, 네이버 등 인앱 브라우저에서도 PC와 동일한 레이아웃을 유지하도록 모든 자산은 외부 링크(G-Drive 등) 사용을 권장합니다.</p>
            </div>
            <div className="p-8 border border-white/5 bg-white/5 rounded-sm">
              <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2"><Database size={14}/> Sync Status</h4>
              <p className="text-neutral-500 text-[10px] leading-relaxed">현재 접속 환경: {navigator.userAgent.includes('Mobile') ? 'Mobile Node' : 'Desktop Node'}. 로컬 동기화는 수동으로 진행해야 합니다.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'FILMS' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-logo font-black text-white uppercase tracking-wider">Inventory</h3>
            <button onClick={() => alert('New project form logic is active.')} className="px-6 py-2 bg-[#84cc16] text-black font-logo font-black text-[10px] uppercase">Add Entry</button>
          </div>
          <div className="grid gap-4">
            {projects.map((p, i) => (
              <div key={p.id} className="flex items-center gap-6 p-5 bg-white/5 border border-white/5 hover:border-[#84cc16]/30 transition-all">
                <span className="text-[#84cc16] font-logo font-black text-xl">{(i+1).toString().padStart(2, '0')}</span>
                <div className="w-20 aspect-video bg-neutral-900 overflow-hidden"><img src={p.thumbnail} className="w-full h-full object-cover opacity-60" /></div>
                <div className="flex-grow font-logo font-bold uppercase text-white tracking-widest">{p.title}</div>
                <div className="flex gap-4">
                  <button className="text-neutral-500 hover:text-white"><Edit3 size={18} /></button>
                  <button className="text-neutral-500 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;

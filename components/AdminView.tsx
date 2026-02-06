
import React, { useState, useEffect, useRef } from 'react';
import { Project, Category, AspectRatio, SiteContent } from '../types';
import { Trash2, Lock, ArrowRight, Edit3, Save, X, Image as ImageIcon, CheckCircle, ChevronUp, ChevronDown, Monitor, Smartphone, AlertCircle, Upload, Plus, RefreshCw, Link as LinkIcon, Globe, ShieldAlert, WifiOff, Home, PlusCircle, MinusCircle, GripVertical, Copy, Download, Database } from 'lucide-react';

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
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({});
  const [syncCode, setSyncCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [tempContent, setTempContent] = useState<SiteContent>(siteContent);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('inv_admin_auth');
    if (sessionAuth === 'true') setIsAuthenticated(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTempContent(siteContent);
  }, [siteContent]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const MASTER_KEY = '292513QQWW';
    if (passcode.trim().toUpperCase() === MASTER_KEY) { 
      setIsAuthenticated(true);
      sessionStorage.setItem('inv_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 600);
    }
  };

  const handleExport = () => {
    try {
      const data = { projects, siteContent };
      const jsonString = JSON.stringify(data);
      // Use Unicode safe encoding
      const code = btoa(encodeURIComponent(jsonString));
      setSyncCode(code);
      navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert('데이터가 너무 큽니다. 이미지 파일 업로드 대신 구글 드라이브 링크를 사용해주세요.');
    }
  };

  const handleImport = () => {
    if (!syncCode) return;
    
    try {
      const decodedString = decodeURIComponent(atob(syncCode.trim()));
      const decoded = JSON.parse(decodedString);
      
      if (decoded.projects && decoded.siteContent) {
        // [IMPORTANT] Forced Direct Storage Write before state update and reload
        // This ensures the data is physically saved even if the browser reloads immediately.
        try {
          localStorage.setItem('inv_film_projects', JSON.stringify(decoded.projects));
          localStorage.setItem('inv_site_content', JSON.stringify(decoded.siteContent));
          
          alert('✅ 클라우드 데이터 동기화 성공! 페이지를 새로고침하여 적용합니다.');
          window.location.reload();
        } catch (storageErr) {
          console.error(storageErr);
          alert('❌ 저장 공간 부족: 모바일 브라우저의 저장 용량을 초과했습니다. 이미지를 파일 업로드 대신 구글 드라이브 링크로 교체한 후 다시 시도해주세요.');
        }
      } else {
        throw new Error('Format Error');
      }
    } catch (err) {
      alert('❌ 유효하지 않은 동기화 코드입니다. 코드가 끝까지 복사되었는지 확인해주세요.');
    }
  };

  const convertGDriveUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    const regex = /(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/;
    const match = url.match(regex);
    if (match && match[1]) return `https://lh3.googleusercontent.com/d/${match[1]}`;
    return url;
  };

  const saveProject = () => {
    const finalThumbnail = projectFormData.thumbnail ? convertGDriveUrl(projectFormData.thumbnail) : '';
    if (editingProjectId) {
      const updated = projects.map(p => p.id === editingProjectId ? { ...p, ...projectFormData, thumbnail: finalThumbnail } as Project : p);
      onUpdateProjects(updated);
      setEditingProjectId(null);
    } else {
      const newP = { ...projectFormData, id: Date.now().toString(), thumbnail: finalThumbnail } as Project;
      onUpdateProjects([newP, ...projects]);
      setIsAdding(false);
    }
    setProjectFormData({});
  };

  const saveSiteContent = () => {
    onUpdateContent(tempContent);
    alert('Site content updated.');
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newProjects = [...projects];
    const item = newProjects[draggedIndex];
    newProjects.splice(draggedIndex, 1);
    newProjects.splice(index, 0, item);
    setDraggedIndex(index);
    onUpdateProjects(newProjects);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[500] bg-[#050505] flex items-center justify-center p-6">
        <div className={`w-full max-w-md bg-neutral-900/50 border p-12 rounded-sm text-center shadow-2xl relative transition-all ${authError ? 'border-red-500 animate-shake' : 'border-white/10'}`}>
          <div className={`mb-10 inline-flex items-center justify-center w-20 h-20 rounded-full bg-black border text-[#84cc16] ${authError ? 'border-red-500 text-red-500' : 'border-white/10'}`}><Lock size={32} /></div>
          <h1 className="text-3xl font-logo font-black text-white uppercase mb-2">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="ENTER PASSCODE" className="w-full bg-black border border-white/10 p-5 text-center text-white tracking-[0.5em] font-bold outline-none" autoFocus />
            <button type="submit" className="w-full py-5 bg-[#84cc16] text-black font-logo font-black uppercase hover:bg-white transition-all">Authorize</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32 animate-fade-up">
      <div className="mb-12 p-6 bg-amber-500/10 border border-amber-500/30 rounded-sm flex items-start gap-5">
        <ShieldAlert className="text-amber-500 shrink-0 mt-1" size={24} />
        <div className="space-y-2">
          <h4 className="text-amber-500 text-sm font-black uppercase tracking-widest">⚠️ 중요: 모바일 동기화 가이드</h4>
          <p className="text-neutral-400 text-[11px] leading-relaxed tracking-wider">
            모바일 브라우저는 저장 공간(5MB)이 매우 협소합니다. <br/>
            이미지를 **파일 업로드(Base64)**로 등록하면 동기화 코드가 너무 커져서 모바일에서 저장이 되지 않습니다. <br/>
            반드시 모든 이미지는 **구글 드라이브 공유 링크**를 사용하여 등록해주시기 바랍니다.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 border-b border-white/10 pb-8">
        <div className="flex flex-wrap gap-8">
          {['FILMS', 'SITE_CONTENT', 'SYSTEM'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`relative pb-4 transition-all ${activeTab === tab ? 'text-white' : 'text-white/20 hover:text-white/40'}`}>
              <span className="text-3xl md:text-5xl font-logo font-black tracking-tighter uppercase">{tab.replace('_', ' ')}</span>
              {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#84cc16]"></span>}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'FILMS' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-logo font-bold text-white uppercase tracking-wider">Inventory Archive</h3>
            <button onClick={() => { setIsAdding(!isAdding); setEditingProjectId(null); }} className="px-8 py-4 bg-[#84cc16] text-black font-logo font-black uppercase hover:bg-white transition-all">
              {isAdding ? 'Close' : '+ New'}
            </button>
          </div>

          {(isAdding || editingProjectId) && (
            <div className="bg-white/5 border border-[#84cc16]/30 mb-12 p-10 animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2"><label className="text-[10px] text-neutral-500 font-bold uppercase">Title</label><input className="w-full bg-black border border-white/10 p-4 text-white" value={projectFormData.title || ''} onChange={e => setProjectFormData({...projectFormData, title: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-[10px] text-neutral-500 font-bold uppercase">Client</label><input className="w-full bg-black border border-white/10 p-4 text-white" value={projectFormData.client || ''} onChange={e => setProjectFormData({...projectFormData, client: e.target.value})} /></div>
                <div className="space-y-2 md:col-span-2"><label className="text-[10px] text-[#84cc16] font-bold uppercase">Thumbnail (Recommended: G-Drive URL)</label><input className="w-full bg-black border border-[#84cc16]/50 p-4 text-white" value={projectFormData.thumbnail || ''} onChange={e => setProjectFormData({...projectFormData, thumbnail: e.target.value})} placeholder="https://drive.google.com/file/d/..." /></div>
                <div className="space-y-2"><label className="text-[10px] text-neutral-500 font-bold uppercase">YouTube Link</label><input className="w-full bg-black border border-white/10 p-4 text-white" value={projectFormData.videoUrl || ''} onChange={e => setProjectFormData({...projectFormData, videoUrl: e.target.value})} /></div>
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-500 font-bold uppercase">Category</label>
                  <select className="w-full bg-black border border-white/10 p-4 text-white" value={projectFormData.category || 'BRANDED CONTENT'} onChange={e => setProjectFormData({...projectFormData, category: e.target.value as Category})}>
                    <option value="BRANDED CONTENT">BRANDED CONTENT</option><option value="AI-STUDIO">AI-STUDIO</option><option value="INTERVIEW">INTERVIEW</option><option value="MAKING">MAKING</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-12 pt-10 border-t border-white/5">
                <button onClick={saveProject} className="flex-grow py-5 bg-[#84cc16] text-black font-logo font-black uppercase hover:bg-white transition-all">Save Project</button>
                <button onClick={() => { setIsAdding(false); setEditingProjectId(null); }} className="px-8 py-5 bg-white/5 text-white border border-white/10"><X size={18} /></button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {projects.map((p, index) => (
              <div key={p.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={() => setDraggedIndex(null)} className="group flex items-center gap-6 px-6 py-4 bg-white/5 border border-white/5 hover:border-[#84cc16]/30 transition-all cursor-move">
                <div className="min-w-[40px] font-logo font-black text-2xl text-[#84cc16]">{(index + 1).toString().padStart(2, '0')}</div>
                <div className="w-20 aspect-video bg-neutral-900 border border-white/5 overflow-hidden"><img src={convertGDriveUrl(p.thumbnail)} referrerPolicy="no-referrer" className="w-full h-full object-cover" /></div>
                <div className="flex-grow"><h4 className="text-white font-logo font-bold uppercase">{p.title}</h4></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingProjectId(p.id); setProjectFormData(p); setIsAdding(false); window.scrollTo({top: 0, behavior:'smooth'}); }} className="p-3 bg-white/5 text-white hover:bg-[#84cc16] hover:text-black transition-all"><Edit3 size={18} /></button>
                  <button onClick={() => { if(window.confirm('Delete?')) onUpdateProjects(projects.filter(item => item.id !== p.id)) }} className="p-3 bg-white/5 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'SITE_CONTENT' && (
        <div className="space-y-20">
          <div className="bg-white/5 border border-white/10 p-10">
            <h4 className="text-white font-logo font-black text-2xl mb-12 uppercase">Directors Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4"><label className="text-[10px] text-neutral-500 font-bold uppercase">Name</label><input className="w-full bg-black border border-white/10 p-5 text-white" value={tempContent.directors.name} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, name: e.target.value}})} /></div>
              <div className="space-y-4 md:col-span-2"><label className="text-[10px] text-neutral-500 font-bold uppercase">Manifesto</label><textarea className="w-full bg-black border border-white/10 p-5 text-white h-32" value={tempContent.directors.manifesto} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, manifesto: e.target.value}})} /></div>
            </div>
            <button onClick={saveSiteContent} className="mt-12 px-12 py-5 bg-[#84cc16] text-black font-logo font-black uppercase">Publish Changes</button>
          </div>
        </div>
      )}

      {activeTab === 'SYSTEM' && (
        <div className="animate-fade-up">
          <div className="bg-neutral-900/50 border border-[#84cc16]/20 p-12 rounded-sm max-w-4xl mx-auto">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 bg-[#84cc16] rounded-full flex items-center justify-center text-black shadow-lg"><Database size={32} /></div>
              <div><h3 className="text-3xl font-logo font-black text-white uppercase">Sync Engine</h3><p className="text-[10px] text-[#84cc16] font-black uppercase tracking-widest">Cross-Device Inventory Transfer</p></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white"><Download size={18} className="text-[#84cc16]" /><span className="text-sm font-bold uppercase">1. Export (PC)</span></div>
                <p className="text-neutral-500 text-xs leading-relaxed">PC에서 작업한 모든 내용을 하나의 텍스트 코드로 추출합니다. 복사된 코드를 모바일로 전달하세요.</p>
                <button onClick={handleExport} className="w-full py-5 bg-[#84cc16] text-black font-logo font-black uppercase hover:bg-white transition-all flex items-center justify-center gap-3">
                  {copySuccess ? <CheckCircle size={20} /> : <Copy size={20} />} {copySuccess ? 'Copied!' : 'Copy Sync Code'}
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white"><RefreshCw size={18} className="text-[#84cc16]" /><span className="text-sm font-bold uppercase">2. Import (Mobile)</span></div>
                <p className="text-neutral-500 text-xs leading-relaxed">전달받은 코드를 아래에 붙여넣으세요. 모바일 브라우저에 즉시 강제 저장됩니다.</p>
                <textarea value={syncCode} onChange={e => setSyncCode(e.target.value)} placeholder="Paste Code..." className="w-full bg-black border border-white/10 p-5 text-white text-[10px] font-mono h-32 outline-none focus:border-[#84cc16]" />
                <button onClick={handleImport} disabled={!syncCode} className="w-full py-5 bg-white text-black font-logo font-black uppercase hover:bg-[#84cc16] transition-all disabled:opacity-20 flex items-center justify-center gap-3">Apply Cloud Sync</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;

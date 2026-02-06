
import React, { useState, useEffect, useRef } from 'react';
import { Project, Category, AspectRatio, SiteContent } from '../types';
import { Trash2, Lock, ArrowRight, Edit3, Save, X, Image as ImageIcon, CheckCircle, ChevronUp, ChevronDown, Monitor, Smartphone, AlertCircle, Upload, Plus, RefreshCw, Link as LinkIcon, Globe, ShieldAlert, WifiOff, Home, PlusCircle, MinusCircle, GripVertical, Code, Copy } from 'lucide-react';

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
  const [thumbMode, setThumbMode] = useState<'FILE' | 'URL'>('URL');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [tempContent, setTempContent] = useState<SiteContent>(siteContent);
  const [productionCode, setProductionCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

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
    if (passcode.trim().toUpperCase() === '292513QQWW') { 
      setIsAuthenticated(true);
      sessionStorage.setItem('inv_admin_auth', 'true');
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 600);
    }
  };

  const handleExportCode = () => {
    const code = `
export const PROJECTS = ${JSON.stringify(projects, null, 2)};

export const DEFAULT_SITE_CONTENT = ${JSON.stringify(siteContent, null, 2)};
    `;
    setProductionCode(code.trim());
    navigator.clipboard.writeText(code.trim());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
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

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[500] bg-[#050505] flex items-center justify-center p-6">
        <div className={`w-full max-w-md bg-neutral-900/50 border p-12 rounded-sm text-center shadow-2xl relative transition-all ${authError ? 'border-red-500 animate-shake' : 'border-white/10'}`}>
          <Lock className="mx-auto mb-8 text-[#84cc16]" size={40} />
          <h1 className="text-2xl font-logo font-black text-white uppercase mb-8">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="ENTER PASSCODE" className="w-full bg-black border border-white/10 p-4 text-center text-white outline-none focus:border-[#84cc16]" />
            <button type="submit" className="w-full py-4 bg-[#84cc16] text-black font-logo font-black uppercase hover:bg-white transition-all">Authorize</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-20 lg:py-32 animate-fade-up">
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
          <div className="bg-neutral-900/50 border border-[#84cc16]/20 p-10 rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <Code className="text-[#84cc16]" size={24} />
              <h3 className="text-xl font-logo font-black text-white uppercase tracking-tighter">Production Publish Engine</h3>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed mb-10">
              현재 관리자 페이지에서 수정하신 모든 내용은 디렉터님의 브라우저에만 저장되어 있습니다.<br/>
              **모든 방문자(인스타그램, 네이버 포함)**에게 똑같이 보여주려면 아래 코드를 생성하여 제게 전달해주세요.
            </p>
            
            <button 
              onClick={handleExportCode} 
              className="w-full py-5 bg-[#84cc16] text-black font-logo font-black uppercase flex items-center justify-center gap-3 hover:bg-white transition-all mb-6"
            >
              {copySuccess ? <CheckCircle size={20} /> : <Copy size={20} />}
              {copySuccess ? 'Code Copied!' : 'Generate Production Code'}
            </button>

            {productionCode && (
              <div className="space-y-4">
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">이 코드를 전체 복사하여 제게 전달해주세요:</p>
                <pre className="bg-black p-6 rounded-sm text-[9px] font-mono text-neutral-500 overflow-x-auto border border-white/5 max-h-60">
                  {productionCode}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'FILMS' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-logo font-black text-white uppercase tracking-wider">Project Inventory</h3>
            <button onClick={() => setIsAdding(!isAdding)} className="px-6 py-2 bg-[#84cc16] text-black font-logo font-black text-xs uppercase">{isAdding ? 'Close' : 'Add New'}</button>
          </div>
          
          {(isAdding || editingProjectId) && (
            <div className="bg-white/5 border border-[#84cc16]/30 p-10 mb-10 space-y-8 animate-fade-up">
              <input className="w-full bg-black border border-white/10 p-4 text-white" placeholder="Title" value={projectFormData.title || ''} onChange={e => setProjectFormData({...projectFormData, title: e.target.value})} />
              <input className="w-full bg-black border border-white/10 p-4 text-white" placeholder="Thumbnail URL (G-Drive)" value={projectFormData.thumbnail || ''} onChange={e => setProjectFormData({...projectFormData, thumbnail: e.target.value})} />
              <input className="w-full bg-black border border-white/10 p-4 text-white" placeholder="YouTube Embed URL" value={projectFormData.videoUrl || ''} onChange={e => setProjectFormData({...projectFormData, videoUrl: e.target.value})} />
              <div className="flex gap-4">
                <button onClick={saveProject} className="flex-grow py-4 bg-[#84cc16] text-black font-logo font-black uppercase tracking-widest">Save Film</button>
                <button onClick={() => { setIsAdding(false); setEditingProjectId(null); }} className="px-6 py-4 border border-white/10 text-white"><X size={20}/></button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {projects.map((p, i) => (
              <div key={p.id} className="flex items-center gap-6 p-5 bg-white/5 border border-white/5 hover:border-[#84cc16]/30 transition-all">
                <span className="text-[#84cc16] font-logo font-black text-xl">{(i+1).toString().padStart(2, '0')}</span>
                <div className="w-20 aspect-video bg-neutral-900 overflow-hidden"><img src={convertGDriveUrl(p.thumbnail)} className="w-full h-full object-cover opacity-60" /></div>
                <div className="flex-grow font-logo font-bold uppercase text-white tracking-widest">{p.title}</div>
                <div className="flex gap-4">
                  <button onClick={() => { setEditingProjectId(p.id); setProjectFormData(p); setIsAdding(false); }} className="text-neutral-500 hover:text-white transition-colors"><Edit3 size={18} /></button>
                  <button onClick={() => onUpdateProjects(projects.filter(item => item.id !== p.id))} className="text-neutral-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'SITE_CONTENT' && (
        <div className="bg-white/5 border border-white/10 p-10 space-y-10">
          <div className="space-y-4">
             <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Director Name</label>
             <input className="w-full bg-black border border-white/10 p-4 text-white" value={tempContent.directors.name} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, name: e.target.value}})} />
          </div>
          <div className="space-y-4">
             <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Manifesto</label>
             <textarea className="w-full bg-black border border-white/10 p-4 text-white h-32" value={tempContent.directors.manifesto} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, manifesto: e.target.value}})} />
          </div>
          <button onClick={() => onUpdateContent(tempContent)} className="w-full py-5 bg-[#84cc16] text-black font-logo font-black uppercase tracking-widest">Update Site Content</button>
        </div>
      )}
    </div>
  );
};

export default AdminView;

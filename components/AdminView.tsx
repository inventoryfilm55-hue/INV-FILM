
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
  
  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Project State
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({});
  const [thumbMode, setThumbMode] = useState<'FILE' | 'URL'>('FILE');
  const [imageLoadError, setImageLoadError] = useState(false);
  
  // System Sync State
  const [syncCode, setSyncCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Site Content State
  const [tempContent, setTempContent] = useState<SiteContent>(siteContent);
  
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
    const cleanInput = passcode.trim().toUpperCase();
    const MASTER_KEY = '292513QQWW';

    if (cleanInput === MASTER_KEY) { 
      setIsAuthenticated(true);
      sessionStorage.setItem('inv_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
      setTimeout(() => {
        setAuthError(false);
        setPasscode('');
      }, 600);
    }
  };

  const handleExport = () => {
    const data = { projects, siteContent };
    const code = btoa(encodeURIComponent(JSON.stringify(data)));
    setSyncCode(code);
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleImport = () => {
    try {
      if (!syncCode) return;
      const decoded = JSON.parse(decodeURIComponent(atob(syncCode)));
      if (decoded.projects && decoded.siteContent) {
        onUpdateProjects(decoded.projects);
        onUpdateContent(decoded.siteContent);
        alert('데이터 동기화 완료. 페이지를 새로고침합니다.');
        window.location.reload();
      } else {
        throw new Error('Invalid format');
      }
    } catch (err) {
      alert('유효하지 않은 동기화 코드입니다.');
    }
  };

  const convertGDriveUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    const regex = /(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
  };

  const isGDriveLink = (url: string | undefined) => {
    if (!url) return false;
    return url.includes('drive.google.com') || url.includes('googleusercontent.com');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  const handleVideoUrlChange = (val: string) => {
    const cleanUrl = getYouTubeEmbedUrl(val);
    setProjectFormData({...projectFormData, videoUrl: cleanUrl});
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const processFile = (file: File) => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`${file.name}의 용량이 너무 큽니다. 2MB 이하의 이미지를 권장합니다.`);
      }
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    };

    if (type === 'thumbnail') {
      processFile(files[0] as File).then(base64 => {
        setProjectFormData(prev => ({ ...prev, thumbnail: base64 }));
        setImageLoadError(false);
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newProjects = [...projects];
    const itemToMove = newProjects[draggedIndex];
    newProjects.splice(draggedIndex, 1);
    newProjects.splice(index, 0, itemToMove);
    
    setDraggedIndex(index);
    onUpdateProjects(newProjects);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const startEditing = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectFormData(project);
    setThumbMode(project.thumbnail?.startsWith('data:') ? 'FILE' : 'URL');
    setIsAdding(false);
    setImageLoadError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveProject = () => {
    const finalThumbnail = projectFormData.thumbnail ? convertGDriveUrl(projectFormData.thumbnail) : '';
    
    if (editingProjectId) {
      const updatedProjects = projects.map(p => p.id === editingProjectId ? { ...p, ...projectFormData, thumbnail: finalThumbnail } as Project : p);
      onUpdateProjects(updatedProjects);
      setEditingProjectId(null);
    } else {
      const newProject = {
        ...projectFormData,
        id: Date.now().toString(),
        thumbnail: finalThumbnail,
        category: projectFormData.category || 'BRANDED CONTENT',
        aspectRatio: projectFormData.aspectRatio || '16:9',
        gallery: projectFormData.gallery || [],
        director: projectFormData.director || 'INV-FILM',
        year: projectFormData.year || new Date().getFullYear().toString(),
        description: projectFormData.description || ''
      } as Project;
      onUpdateProjects([newProject, ...projects]);
      setIsAdding(false);
    }
    setProjectFormData({});
  };

  const saveSiteContent = () => {
    const normalizedContent = {
      ...tempContent,
      about: {
        ...tempContent.about,
        img1: convertGDriveUrl(tempContent.about.img1),
        img2: convertGDriveUrl(tempContent.about.img2)
      }
    };
    onUpdateContent(normalizedContent);
    alert('Site content updated successfully.');
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[500] bg-[#050505] flex items-center justify-center p-6">
        <div className={`w-full max-w-md bg-neutral-900/50 border p-12 rounded-sm text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative transition-all duration-300 ${authError ? 'border-red-500 animate-shake' : 'border-white/10'}`}>
          <div className={`mb-10 inline-flex items-center justify-center w-20 h-20 rounded-full bg-black border text-[#84cc16] transition-colors ${authError ? 'border-red-500 text-red-500' : 'border-white/10'}`}>
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-logo font-black text-white tracking-tighter uppercase mb-2">Admin Access</h1>
          <p className="text-[10px] text-neutral-500 tracking-[0.3em] uppercase mb-10 font-bold">INV-FILM SECURE SYSTEM</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="ENTER PASSCODE" className={`w-full bg-black border p-5 text-center text-white tracking-[0.5em] font-bold outline-none transition-all ${authError ? 'border-red-500 text-red-500' : 'border-white/10 focus:border-[#84cc16]'}`} autoFocus />
            <button type="submit" className={`w-full py-5 font-logo font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${authError ? 'bg-red-500 text-white' : 'bg-[#84cc16] text-black hover:bg-white'}`}>Authorize <ArrowRight size={18} /></button>
          </form>
          <button onClick={() => window.location.href = '/'} className="mt-12 text-[10px] text-neutral-600 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors font-bold"><Home size={12} /> Exit to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32 animate-fade-up">
      {/* System Warning Banner */}
      <div className="mb-12 p-6 bg-amber-500/10 border border-amber-500/30 rounded-sm flex items-start gap-5">
        <ShieldAlert className="text-amber-500 shrink-0 mt-1" size={24} />
        <div className="space-y-2">
          <h4 className="text-amber-500 text-sm font-black uppercase tracking-widest">데이터 저장소 안내</h4>
          <p className="text-neutral-400 text-[11px] leading-relaxed tracking-wider">
            현재 수정하시는 모든 내용은 **이 브라우저(로컬 저장소)**에만 저장됩니다. <br/>
            PC에서 수정한 내용을 모바일에서 보시려면 [SYSTEM SYNC] 탭에서 동기화 코드를 복사하여 모바일에 붙여넣어 주세요.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start lg:items-center mb-16 gap-8 border-b border-white/10 pb-8">
        <div className="flex flex-wrap gap-8 md:gap-12">
          {['FILMS', 'SITE_CONTENT', 'SYSTEM'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`group relative pb-4 transition-all ${activeTab === tab ? 'text-white' : 'text-white/20 hover:text-white/40'}`}>
              <span className="text-3xl md:text-5xl lg:text-6xl font-logo font-black tracking-tighter uppercase">{tab.replace('_', ' ')}</span>
              {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#84cc16] shadow-[0_0_15px_#84cc16]"></span>}
            </button>
          ))}
        </div>
        
        {activeTab === 'SITE_CONTENT' && (
          <button onClick={saveSiteContent} className="px-12 py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(132,204,22,0.3)]">
            <Save size={20} /> Publish All Changes
          </button>
        )}
      </div>

      {activeTab === 'FILMS' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-logo font-bold text-white uppercase tracking-wider">Project Management</h3>
            <button onClick={() => { setIsAdding(!isAdding); setEditingProjectId(null); setProjectFormData({}); setImageLoadError(false); }} className="px-8 py-4 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all">
              {isAdding ? 'Close Form' : '+ New Project'}
            </button>
          </div>

          {(isAdding || editingProjectId) && (
            <div className="bg-white/5 border border-[#84cc16]/30 mb-12 animate-in slide-in-from-top duration-500 overflow-hidden rounded-sm p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Title</label><input className="w-full bg-black border border-white/10 p-4 text-white outline-none" value={projectFormData.title || ''} onChange={e => setProjectFormData({...projectFormData, title: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Client</label><input className="w-full bg-black border border-white/10 p-4 text-white outline-none" value={projectFormData.client || ''} onChange={e => setProjectFormData({...projectFormData, client: e.target.value})} /></div>
                  <div className="space-y-2 md:col-span-2"><label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Main Thumbnail (G-Drive Link)</label><input className="w-full bg-black border border-white/10 p-4 text-white outline-none" value={projectFormData.thumbnail || ''} onChange={e => setProjectFormData({...projectFormData, thumbnail: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">YouTube Link</label><input className="w-full bg-black border border-white/10 p-4 text-white outline-none" value={projectFormData.videoUrl || ''} onChange={e => handleVideoUrlChange(e.target.value)} /></div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Category</label>
                    <select className="w-full bg-black border border-white/10 p-4 text-white outline-none" value={projectFormData.category || 'BRANDED CONTENT'} onChange={e => setProjectFormData({...projectFormData, category: e.target.value as Category})}>
                      <option value="BRANDED CONTENT">BRANDED CONTENT</option><option value="AI-STUDIO">AI-STUDIO</option><option value="INTERVIEW">INTERVIEW</option><option value="MAKING">MAKING</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-end gap-4 mt-12 pt-10 border-t border-white/5">
                  <button onClick={saveProject} className="flex-grow py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(132,204,22,0.2)]"><Save size={18} /> Update Inventory</button>
                  <button onClick={() => { setIsAdding(false); setEditingProjectId(null); }} className="px-8 py-5 bg-white/5 text-white hover:bg-white/10 border border-white/10"><X size={18} /></button>
                </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {projects.map((p, index) => (
              <div key={p.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className="group flex items-center gap-6 px-6 py-4 bg-white/5 border border-white/5 hover:border-[#84cc16]/30 transition-all cursor-move">
                <div className="flex flex-col items-center justify-center px-4 border-r border-white/5 h-full min-w-[80px]">
                  <GripVertical size={16} className="text-neutral-700 mb-2 group-hover:text-[#84cc16]" />
                  <span className="font-logo font-black text-3xl text-[#84cc16]">#{ (index + 1).toString().padStart(2, '0') }</span>
                </div>
                <div className="w-24 aspect-video bg-neutral-900 border border-white/5 overflow-hidden shrink-0"><img src={convertGDriveUrl(p.thumbnail)} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60 group-hover:opacity-100" /></div>
                <div className="flex-grow">
                  <h4 className="text-white font-logo font-bold text-lg uppercase">{p.title}</h4>
                  <p className="text-neutral-500 text-[10px] font-bold tracking-[0.3em] uppercase">{p.client} — {p.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => startEditing(p)} className="p-3 bg-white/5 text-white hover:bg-[#84cc16] hover:text-black transition-all"><Edit3 size={18} /></button>
                  <button onClick={() => { if(window.confirm('Delete?')) onUpdateProjects(projects.filter(item => item.id !== p.id)) }} className="p-3 bg-white/5 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'SITE_CONTENT' && (
        <div className="space-y-20 animate-in fade-in slide-in-from-bottom-10 pb-20">
          <div className="bg-white/5 border border-white/10 rounded-sm p-10">
            <h4 className="text-white font-logo font-black text-2xl mb-12 uppercase flex items-center gap-4"><span className="w-8 h-[2px] bg-[#84cc16]"></span> Directors View Editor</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4"><label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Lead Name</label><input className="w-full bg-black border border-white/10 p-5 text-white outline-none" value={tempContent.directors.name} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, name: e.target.value}})} /></div>
              <div className="space-y-4 md:col-span-2"><label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Manifesto</label><textarea className="w-full bg-black border border-white/10 p-5 text-white outline-none h-32" value={tempContent.directors.manifesto} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, manifesto: e.target.value}})} /></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SYSTEM' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10">
          <div className="bg-neutral-900/50 border border-[#84cc16]/20 p-12 rounded-sm max-w-4xl mx-auto">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 bg-[#84cc16] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(132,204,22,0.3)]">
                <Database size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-logo font-black text-white tracking-tighter uppercase">Inventory Sync Tool</h3>
                <p className="text-[10px] text-[#84cc16] font-black tracking-[0.4em] uppercase">Cross-Device Synchronization</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white mb-2">
                  <Download size={18} className="text-[#84cc16]" />
                  <span className="text-sm font-bold uppercase tracking-widest">Step 1: Export (From PC)</span>
                </div>
                <p className="text-neutral-500 text-xs leading-relaxed tracking-wide">
                  PC에서 작업한 모든 내용을 하나의 텍스트 코드로 추출합니다. 복사된 코드를 모바일로 보내주세요.
                </p>
                <button onClick={handleExport} className="w-full py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-3">
                  {copySuccess ? <CheckCircle size={20} /> : <Copy size={20} />}
                  {copySuccess ? 'Code Copied!' : 'Export Sync Code'}
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white mb-2">
                  <RefreshCw size={18} className="text-[#84cc16]" />
                  <span className="text-sm font-bold uppercase tracking-widest">Step 2: Import (On Mobile)</span>
                </div>
                <p className="text-neutral-500 text-xs leading-relaxed tracking-wide">
                  PC에서 복사한 코드를 아래에 붙여넣어 모바일의 로컬 저장소를 즉시 업데이트합니다.
                </p>
                <textarea value={syncCode} onChange={e => setSyncCode(e.target.value)} placeholder="Paste Sync Code Here..." className="w-full bg-black border border-white/10 p-5 text-white text-[10px] font-mono h-32 focus:border-[#84cc16] outline-none" />
                <button onClick={handleImport} disabled={!syncCode} className="w-full py-5 bg-white text-black font-logo font-black tracking-widest uppercase hover:bg-[#84cc16] transition-all disabled:opacity-20 flex items-center justify-center gap-3">
                  Apply Cloud Sync
                </button>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-white/5 text-center">
               <p className="text-[9px] text-neutral-700 font-bold uppercase tracking-[0.5em]">Inventory System v4.0 — Local Node Active</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;

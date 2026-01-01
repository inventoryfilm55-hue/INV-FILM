
import React, { useState, useEffect, useRef } from 'react';
import { Project, Category, AspectRatio, SiteContent } from '../types';
import { Trash2, Lock, ArrowRight, Edit3, Save, X, Image as ImageIcon, CheckCircle, ChevronUp, ChevronDown, Monitor, Smartphone, AlertCircle, Upload, Plus, RefreshCw, Link as LinkIcon, Globe } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'FILMS' | 'SITE_CONTENT'>('FILMS');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({});
  const [thumbMode, setThumbMode] = useState<'FILE' | 'URL'>('FILE');
  const [isGDriveConverted, setIsGDriveConverted] = useState(false);
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('inv_admin_auth');
    if (sessionAuth === 'true') setIsAuthenticated(true);
  }, []);

  // Google Drive Link Converter
  const convertGDriveUrl = (url: string): string => {
    if (!url) return '';
    const regex = /\/file\/d\/([^/]+)\//;
    const match = url.match(regex);
    if (match && match[1]) {
      setIsGDriveConverted(true);
      setTimeout(() => setIsGDriveConverted(false), 3000);
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '292513QQWW') { 
      setIsAuthenticated(true);
      sessionStorage.setItem('inv_admin_auth', 'true');
    } else {
      setAuthError(true);
      setPasscode('');
      setTimeout(() => setAuthError(false), 2000);
    }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'gallery') => {
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
      });
    } else {
      const promises = Array.from(files).map(file => processFile(file as File));
      Promise.all(promises).then(newImages => {
        setProjectFormData(prev => ({
          ...prev,
          gallery: [...(prev.gallery || []), ...newImages]
        }));
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setProjectFormData(prev => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index)
    }));
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;
    onUpdateProjects(newProjects);
  };

  const startEditing = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectFormData(project);
    setThumbMode(project.thumbnail?.startsWith('data:') ? 'FILE' : 'URL');
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveProject = () => {
    if (editingProjectId) {
      const updatedProjects = projects.map(p => p.id === editingProjectId ? { ...p, ...projectFormData } as Project : p);
      onUpdateProjects(updatedProjects);
      setEditingProjectId(null);
    } else {
      const newProject = {
        ...projectFormData,
        id: Date.now().toString(),
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

  const isValidYoutube = projectFormData.videoUrl?.includes('youtube.com/embed/');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fade-up">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-12 rounded-sm text-center shadow-2xl relative">
          <div className="mb-10 inline-flex items-center justify-center w-20 h-20 rounded-full bg-black border border-white/10 text-[#84cc16]">
            <Lock size={32} className={authError ? 'animate-shake text-red-500' : ''} />
          </div>
          <h1 className="text-3xl font-logo font-black text-white tracking-tighter uppercase mb-10">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="ENTER PASSCODE" className="w-full bg-black border border-white/10 p-5 text-center text-white tracking-[0.5em] font-bold focus:border-[#84cc16] outline-none transition-all" autoFocus />
            <button type="submit" className="w-full py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-3">Authorize <ArrowRight size={18} /></button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start lg:items-center mb-16 gap-8 border-b border-white/10 pb-8">
        <div className="flex gap-12">
          <button onClick={() => setActiveTab('FILMS')} className={`group relative pb-4 transition-all ${activeTab === 'FILMS' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}>
            <span className="text-4xl md:text-6xl font-logo font-black tracking-tighter uppercase">Films</span>
            {activeTab === 'FILMS' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#84cc16] shadow-[0_0_15px_#84cc16]"></span>}
          </button>
          <button onClick={() => setActiveTab('SITE_CONTENT')} className={`group relative pb-4 transition-all ${activeTab === 'SITE_CONTENT' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}>
            <span className="text-4xl md:text-6xl font-logo font-black tracking-tighter uppercase">Content</span>
            {activeTab === 'SITE_CONTENT' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#84cc16] shadow-[0_0_15px_#84cc16]"></span>}
          </button>
        </div>
      </div>

      {activeTab === 'FILMS' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-logo font-bold text-white uppercase tracking-wider">Project Management</h3>
            <button 
              onClick={() => { setIsAdding(!isAdding); setEditingProjectId(null); setProjectFormData({}); }} 
              className="px-8 py-4 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all"
            >
              {isAdding ? 'Close Form' : '+ New Project'}
            </button>
          </div>

          {(isAdding || editingProjectId) && (
             <div className="bg-white/5 border border-[#84cc16]/30 mb-12 animate-in slide-in-from-top duration-500 overflow-hidden rounded-sm">
               <div className="grid grid-cols-1 xl:grid-cols-12">
                 <div className="xl:col-span-8 p-10 border-r border-white/5">
                   <h4 className="text-[#84cc16] font-logo font-black text-xl mb-8 uppercase">
                     {editingProjectId ? 'Edit Project' : 'Create New Project'}
                   </h4>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                       <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Title</label>
                       <input className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" value={projectFormData.title || ''} onChange={e => setProjectFormData({...projectFormData, title: e.target.value})} placeholder="Project Title" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Client</label>
                       <input className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" value={projectFormData.client || ''} onChange={e => setProjectFormData({...projectFormData, client: e.target.value})} placeholder="Client Name" />
                     </div>
                     
                     <div className="space-y-2">
                       <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center justify-between">
                         YouTube Link
                         {isValidYoutube ? (
                           <span className="text-[8px] text-[#84cc16] font-black flex items-center gap-1"><CheckCircle size={10}/> VALID EMBED</span>
                         ) : (
                           <span className="text-[8px] text-neutral-500">AUTO-CONVERT READY</span>
                         )}
                       </label>
                       <input 
                         className={`w-full bg-black border p-4 text-white focus:border-[#84cc16] outline-none transition-colors ${isValidYoutube ? 'border-[#84cc16]/30' : 'border-white/10'}`}
                         value={projectFormData.videoUrl || ''}
                         onChange={e => handleVideoUrlChange(e.target.value)} 
                         placeholder="Paste any YouTube link here" 
                       />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Category</label>
                        <select className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" value={projectFormData.category || 'BRANDED CONTENT'} onChange={e => setProjectFormData({...projectFormData, category: e.target.value as Category})}>
                          <option value="BRANDED CONTENT">BRANDED CONTENT</option>
                          <option value="AI-STUDIO">AI-STUDIO</option>
                          <option value="INTERVIEW">INTERVIEW</option>
                          <option value="MAKING">MAKING</option>
                        </select>
                     </div>

                     <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Main Thumbnail</label>
                          <div className="flex gap-2">
                            <button onClick={() => setThumbMode('FILE')} className={`px-3 py-1 text-[8px] font-black tracking-widest uppercase rounded-sm border transition-all ${thumbMode === 'FILE' ? 'bg-[#84cc16] text-black border-[#84cc16]' : 'bg-transparent text-neutral-500 border-white/10'}`}><Upload size={10} className="inline mr-1" /> File</button>
                            <button onClick={() => setThumbMode('URL')} className={`px-3 py-1 text-[8px] font-black tracking-widest uppercase rounded-sm border transition-all ${thumbMode === 'URL' ? 'bg-[#84cc16] text-black border-[#84cc16]' : 'bg-transparent text-neutral-500 border-white/10'}`}><LinkIcon size={10} className="inline mr-1" /> URL</button>
                          </div>
                        </div>

                        {thumbMode === 'FILE' ? (
                          <div 
                            onClick={() => thumbnailInputRef.current?.click()}
                            className={`w-full h-48 border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden relative
                              ${projectFormData.thumbnail ? 'border-[#84cc16]/50 bg-black' : 'border-white/10 bg-black/50 hover:border-[#84cc16]/50 hover:bg-[#84cc16]/5'}
                            `}
                          >
                            <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnail')} />
                            
                            {projectFormData.thumbnail && projectFormData.thumbnail.startsWith('data:') ? (
                              <>
                                <img src={projectFormData.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Preview" />
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                  <RefreshCw size={24} className="text-[#84cc16]" />
                                  <span className="text-[10px] text-[#84cc16] font-black tracking-widest uppercase">Change File</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <Upload size={32} className="text-neutral-700" />
                                <div className="text-center">
                                  <p className="text-[11px] text-white font-bold tracking-widest uppercase mb-1">Select Local File</p>
                                  <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Auto-converted to Data URL</p>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative">
                              <input 
                                className="w-full bg-black border border-white/10 p-5 pr-32 text-white focus:border-[#84cc16] outline-none text-sm placeholder:text-neutral-700" 
                                value={projectFormData.thumbnail && !projectFormData.thumbnail.startsWith('data:') ? projectFormData.thumbnail : ''} 
                                onChange={e => setProjectFormData({...projectFormData, thumbnail: convertGDriveUrl(e.target.value)})} 
                                placeholder="Paste Image URL or G-Drive Link" 
                              />
                              {isGDriveConverted && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#84cc16]/20 text-[#84cc16] px-3 py-1.5 rounded-sm border border-[#84cc16]/30 animate-fade-in">
                                  <Globe size={12} className="animate-pulse" />
                                  <span className="text-[8px] font-black tracking-widest uppercase">G-DRIVE CONVERTED</span>
                                </div>
                              )}
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 text-[9px] text-neutral-500 font-bold tracking-widest uppercase flex items-center gap-3">
                              <AlertCircle size={14} className="text-[#84cc16]" />
                              <span>Google Drive links are now automatically converted to direct images. Just paste the share link!</span>
                            </div>
                          </div>
                        )}
                     </div>

                     <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Layout Ratio</label>
                        <div className="flex gap-4">
                          <button onClick={() => setProjectFormData({...projectFormData, aspectRatio: '16:9'})} className={`flex-1 py-4 border flex items-center justify-center gap-3 transition-all ${projectFormData.aspectRatio === '16:9' || !projectFormData.aspectRatio ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}><Monitor size={16} /> Landscape (16:9)</button>
                          <button onClick={() => setProjectFormData({...projectFormData, aspectRatio: '9:16'})} className={`flex-1 py-4 border flex items-center justify-center gap-3 transition-all ${projectFormData.aspectRatio === '9:16' ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}><Smartphone size={16} /> Portrait (9:16)</button>
                        </div>
                     </div>
                   </div>

                   <div className="mt-10 pt-10 border-t border-white/5">
                      <div className="flex items-center justify-between mb-6">
                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Visual Stills (Gallery)</label>
                        <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'gallery')} />
                        <button onClick={() => galleryInputRef.current?.click()} className="px-6 py-3 bg-[#84cc16]/10 text-[#84cc16] hover:bg-[#84cc16] hover:text-black transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-[#84cc16]/30">
                          <Plus size={14}/> Add Gallery Images
                        </button>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {projectFormData.gallery?.map((img, idx) => (
                          <div key={idx} className="aspect-square relative group bg-neutral-900 border border-white/5 overflow-hidden">
                            <img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                            <button onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 p-1.5 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={10}/></button>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="flex items-end gap-4 mt-12">
                     <button onClick={saveProject} className="flex-grow py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2"><Save size={18} /> Save Project</button>
                     <button onClick={() => { setIsAdding(false); setEditingProjectId(null); }} className="px-8 py-5 bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10"><X size={18} /></button>
                   </div>
                 </div>

                 <div className="xl:col-span-4 bg-black/40 p-10 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] mb-8">Grid Preview</p>
                    <div className={`relative bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 group ${projectFormData.aspectRatio === '9:16' ? 'w-[180px] aspect-[9/16]' : 'w-full max-w-[400px] aspect-video'}`}>
                      {projectFormData.thumbnail ? <img src={projectFormData.thumbnail} className="w-full h-full object-cover opacity-60" alt="Preview" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="text-neutral-800" size={48} /></div>}
                      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-4 opacity-0 hover:opacity-100 transition-opacity">
                        <h5 className="text-black font-logo font-black text-sm uppercase leading-tight mb-2">{projectFormData.title || 'TITLE'}</h5>
                        <p className="text-black/40 text-[8px] font-bold tracking-widest uppercase mb-4">{projectFormData.client || 'CLIENT'}</p>
                        <div className="px-4 py-2 border border-black text-black text-[8px] font-black uppercase">Explore Film</div>
                      </div>
                    </div>
                 </div>
               </div>
             </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {projects.map((p, index) => (
              <div key={p.id} className="group flex flex-col md:flex-row items-center gap-6 px-6 py-4 bg-white/5 border border-white/5 hover:border-[#84cc16]/30 transition-all">
                <div className="flex flex-row md:flex-col gap-2">
                  <button onClick={() => moveProject(index, 'up')} disabled={index === 0} className="p-1.5 text-white/20 hover:text-[#84cc16] disabled:opacity-0 transition-colors"><ChevronUp size={20} /></button>
                  <button onClick={() => moveProject(index, 'down')} disabled={index === projects.length - 1} className="p-1.5 text-white/20 hover:text-[#84cc16] disabled:opacity-0 transition-colors"><ChevronDown size={20} /></button>
                </div>
                <div className={`w-full md:w-32 bg-neutral-900 overflow-hidden ${p.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                  <img src={p.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={p.title} />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                    <h4 className="text-white font-logo font-bold text-lg uppercase tracking-tight">{p.title}</h4>
                    <span className="text-[8px] px-2 py-0.5 bg-white/10 text-white/40 font-black rounded-sm">{p.aspectRatio}</span>
                  </div>
                  <p className="text-neutral-500 text-[10px] font-bold tracking-[0.3em] uppercase">{p.client} — {p.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => startEditing(p)} className="p-3 bg-white/5 text-white hover:bg-[#84cc16] hover:text-black transition-all rounded-sm"><Edit3 size={18} /></button>
                  <button onClick={() => { if(window.confirm('Delete this project?')) onUpdateProjects(projects.filter(item => item.id !== p.id)) }} className="p-3 bg-white/5 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10">
          <div className="text-center pt-10 border-t border-white/5"><p className="text-[#84cc16] text-[10px] font-bold tracking-[0.4em] uppercase animate-pulse">시스템: 모든 데이터는 입력 즉시 브라우저 저장소에 동기화됩니다.</p></div>
        </div>
      )}
    </div>
  );
};

export default AdminView;

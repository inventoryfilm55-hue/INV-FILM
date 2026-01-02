
import React, { useState, useEffect, useRef } from 'react';
import { Project, Category, AspectRatio, SiteContent } from '../types';
import { Trash2, Lock, ArrowRight, Edit3, Save, X, Image as ImageIcon, CheckCircle, ChevronUp, ChevronDown, Monitor, Smartphone, AlertCircle, Upload, Plus, RefreshCw, Link as LinkIcon, Globe, ShieldAlert, WifiOff, Home, PlusCircle, MinusCircle } from 'lucide-react';

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
  
  // Project State
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({});
  const [thumbMode, setThumbMode] = useState<'FILE' | 'URL'>('FILE');
  const [imageLoadError, setImageLoadError] = useState(false);
  
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

  // Improved G-Drive Image Resolver using the robust lh3 proxy
  const convertGDriveUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    
    // Regular expression to catch IDs from various G-Drive link formats
    const regex = /(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      // Use lh3.googleusercontent.com which is the most reliable way to bypass browser CORS/Referrer issues for <img> tags
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
    // Normalize images in site content using the robust resolver
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
            <div className="relative">
              <input 
                type="password" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                placeholder="ENTER PASSCODE" 
                className={`w-full bg-black border p-5 text-center text-white tracking-[0.5em] font-bold outline-none transition-all ${authError ? 'border-red-500 text-red-500' : 'border-white/10 focus:border-[#84cc16]'}`} 
                autoFocus 
              />
              {authError && <p className="absolute -bottom-6 left-0 w-full text-[9px] text-red-500 font-black tracking-widest uppercase">Invalid passcode. access denied.</p>}
            </div>
            <button 
              type="submit" 
              className={`w-full py-5 font-logo font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${authError ? 'bg-red-500 text-white' : 'bg-[#84cc16] text-black hover:bg-white'}`}
            >
              {authError ? 'Authorize' : 'Authorize'} <ArrowRight size={18} />
            </button>
          </form>

          <button 
            onClick={() => window.location.href = '/'}
            className="mt-12 text-[10px] text-neutral-600 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors font-bold"
          >
            <Home size={12} /> Exit to Home
          </button>
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
        
        {activeTab === 'SITE_CONTENT' && (
          <button 
            onClick={saveSiteContent}
            className="px-12 py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(132,204,22,0.3)]"
          >
            <Save size={20} /> Publish All Changes
          </button>
        )}
      </div>

      {activeTab === 'FILMS' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-logo font-bold text-white uppercase tracking-wider">Project Management</h3>
            <button 
              onClick={() => { setIsAdding(!isAdding); setEditingProjectId(null); setProjectFormData({}); setImageLoadError(false); }} 
              className="px-8 py-4 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all"
            >
              {isAdding ? 'Close Form' : '+ New Project'}
            </button>
          </div>

          {(isAdding || editingProjectId) && (
             <div className="bg-white/5 border border-[#84cc16]/30 mb-12 animate-in slide-in-from-top duration-500 overflow-hidden rounded-sm">
               <div className="grid grid-cols-1 xl:grid-cols-12">
                 <div className="xl:col-span-8 p-10 border-r border-white/5">
                   <h4 className="text-[#84cc16] font-logo font-black text-xl mb-8 uppercase flex items-center gap-3">
                     {editingProjectId ? <Edit3 size={20}/> : <Plus size={20}/>}
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
                       <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Director</label>
                       <input className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" value={projectFormData.director || ''} onChange={e => setProjectFormData({...projectFormData, director: e.target.value})} placeholder="Director Name" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Production Year</label>
                       <input className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" value={projectFormData.year || ''} onChange={e => setProjectFormData({...projectFormData, year: e.target.value})} placeholder="e.g. 2024" />
                     </div>
                     
                     <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Main Thumbnail</label>
                          <div className="flex gap-2">
                            <button onClick={() => setThumbMode('FILE')} className={`px-4 py-1.5 text-[9px] font-black tracking-widest uppercase rounded-sm border transition-all ${thumbMode === 'FILE' ? 'bg-[#84cc16] text-black border-[#84cc16]' : 'bg-transparent text-neutral-500 border-white/10 hover:border-white/30'}`}><Upload size={12} className="inline mr-1" /> File</button>
                            <button onClick={() => setThumbMode('URL')} className={`px-4 py-1.5 text-[9px] font-black tracking-widest uppercase rounded-sm border transition-all ${thumbMode === 'URL' ? 'bg-[#84cc16] text-black border-[#84cc16]' : 'bg-transparent text-neutral-500 border-white/10 hover:border-white/30'}`}><LinkIcon size={12} className="inline mr-1" /> URL</button>
                          </div>
                        </div>

                        {thumbMode === 'FILE' ? (
                          <div 
                            onClick={() => thumbnailInputRef.current?.click()}
                            className={`w-full h-56 border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden relative
                              ${projectFormData.thumbnail ? 'border-[#84cc16]/50 bg-black' : 'border-white/10 bg-black/50 hover:border-[#84cc16]/50 hover:bg-[#84cc16]/5'}
                            `}
                          >
                            <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnail')} />
                            {projectFormData.thumbnail && projectFormData.thumbnail.startsWith('data:') ? (
                              <img src={projectFormData.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" alt="Preview" />
                            ) : null}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                              {projectFormData.thumbnail ? <RefreshCw size={24} className="text-[#84cc16]" /> : <Upload size={32} className="text-neutral-700" />}
                              <span className="text-[10px] text-white font-black tracking-widest uppercase">{projectFormData.thumbnail ? 'Change File' : 'Upload Frame'}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative">
                              <input 
                                className={`w-full bg-black border p-5 pr-40 text-white focus:border-[#84cc16] outline-none text-sm placeholder:text-neutral-700 transition-colors ${imageLoadError ? 'border-red-500/50' : 'border-white/10'}`}
                                value={projectFormData.thumbnail && !projectFormData.thumbnail.startsWith('data:') ? projectFormData.thumbnail : ''} 
                                onChange={e => {
                                  setProjectFormData({...projectFormData, thumbnail: e.target.value});
                                  setImageLoadError(false);
                                }} 
                                placeholder="Paste Google Drive link here" 
                              />
                              {isGDriveLink(projectFormData.thumbnail) && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#84cc16]/20 text-[#84cc16] px-3 py-1.5 rounded-sm border border-[#84cc16]/30">
                                  <Globe size={12} className="animate-pulse" />
                                  <span className="text-[8px] font-black tracking-widest uppercase">SECURED LINK</span>
                                </div>
                              )}
                            </div>
                            <div className="p-4 bg-black/50 border border-white/5 rounded-sm text-[9px] text-neutral-500 uppercase leading-relaxed tracking-widest">
                               <p className="flex items-center gap-2 text-white mb-1"><AlertCircle size={10} className="text-[#84cc16]"/> G-DRIVE 다이렉트 엔진 활성화</p>
                               lh3 서버를 경유하여 이미지를 직접 불러옵니다. 공유 설정을 "모든 사용자"로 변경해 주세요.
                            </div>
                          </div>
                        )}
                     </div>

                     <div className="space-y-2">
                       <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">YouTube Link</label>
                       <input className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" value={projectFormData.videoUrl || ''} onChange={e => handleVideoUrlChange(e.target.value)} placeholder="YouTube URL" />
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
                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Grid Ratio</label>
                        <div className="flex gap-4">
                          <button onClick={() => setProjectFormData({...projectFormData, aspectRatio: '16:9'})} className={`flex-1 py-4 border flex items-center justify-center gap-3 transition-all ${projectFormData.aspectRatio === '16:9' || !projectFormData.aspectRatio ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}><Monitor size={16} /> 16:9</button>
                          <button onClick={() => setProjectFormData({...projectFormData, aspectRatio: '9:16'})} className={`flex-1 py-4 border flex items-center justify-center gap-3 transition-all ${projectFormData.aspectRatio === '9:16' ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}><Smartphone size={16} /> 9:16</button>
                        </div>
                     </div>
                   </div>

                   <div className="flex items-end gap-4 mt-12 pt-10 border-t border-white/5">
                     <button onClick={saveProject} className="flex-grow py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(132,204,22,0.2)]"><Save size={18} /> Update Film Inventory</button>
                     <button onClick={() => { setIsAdding(false); setEditingProjectId(null); setImageLoadError(false); }} className="px-8 py-5 bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10"><X size={18} /></button>
                   </div>
                 </div>

                 {/* Real-time Preview */}
                 <div className="xl:col-span-4 bg-black/60 p-12 flex flex-col items-center justify-center text-center">
                    <div className={`relative bg-neutral-900 border shadow-2xl overflow-hidden transition-all duration-700 ${imageLoadError ? 'border-red-500/40' : 'border-white/10'} ${projectFormData.aspectRatio === '9:16' ? 'w-[180px] aspect-[9/16]' : 'w-full aspect-video'}`}>
                      {projectFormData.thumbnail ? (
                        <img 
                          src={convertGDriveUrl(projectFormData.thumbnail)} 
                          onLoad={() => setImageLoadError(false)}
                          onError={() => setImageLoadError(true)}
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoadError ? 'opacity-0' : 'opacity-80 hover:opacity-100'}`} 
                          alt="Preview" 
                        />
                      ) : null}
                      
                      {(!projectFormData.thumbnail || imageLoadError) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black">
                          {imageLoadError ? <WifiOff size={40} className="text-red-500 mb-4" /> : <ImageIcon size={40} className="text-neutral-800 mb-4" />}
                          <h6 className={`${imageLoadError ? 'text-red-500' : 'text-neutral-700'} font-logo font-black text-xs uppercase mb-2`}>{imageLoadError ? 'Link Error' : 'No Image'}</h6>
                          <p className="text-white/20 text-[8px] uppercase tracking-widest leading-relaxed">
                            {imageLoadError ? '드라이브 공유 설정이\n"모두"인지 확인하세요' : '영상 프레임 대기 중'}
                          </p>
                        </div>
                      )}
                    </div>
                 </div>
               </div>
             </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {projects.map((p, index) => {
              const displayThumbnail = convertGDriveUrl(p.thumbnail);
              const sequenceNumber = (index + 1).toString().padStart(2, '0');
              return (
                <div key={p.id} className="group flex flex-col md:flex-row items-center gap-6 px-6 py-4 bg-white/5 border border-white/5 hover:border-[#84cc16]/30 transition-all relative">
                  
                  {/* Sequence Position Badge */}
                  <div className="flex flex-col items-center justify-center px-4 border-r border-white/5 h-full">
                    <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Pos</span>
                    <span className="font-logo font-black text-3xl text-[#84cc16]">#{sequenceNumber}</span>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2">
                    <button onClick={() => moveProject(index, 'up')} disabled={index === 0} className="p-1.5 text-white/20 hover:text-[#84cc16] disabled:opacity-0 transition-colors"><ChevronUp size={20} /></button>
                    <button onClick={() => moveProject(index, 'down')} disabled={index === projects.length - 1} className="p-1.5 text-white/20 hover:text-[#84cc16] disabled:opacity-0 transition-colors"><ChevronDown size={20} /></button>
                  </div>

                  <div className={`w-full md:w-32 bg-neutral-900 border border-white/5 relative overflow-hidden ${p.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                    <img src={displayThumbnail} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={p.title} />
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                      <h4 className="text-white font-logo font-bold text-lg uppercase tracking-tight">{p.title}</h4>
                      <span className="text-[8px] px-2 py-0.5 bg-white/10 text-white/40 font-black rounded-sm">{p.aspectRatio}</span>
                    </div>
                    <p className="text-neutral-500 text-[10px] font-bold tracking-[0.3em] uppercase">{p.client} — {p.category}</p>
                    <p className="text-[#84cc16]/40 text-[9px] font-black tracking-[0.2em] uppercase mt-1">Dir. {p.director} • {p.year}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => startEditing(p)} className="p-3 bg-white/5 text-white hover:bg-[#84cc16] hover:text-black transition-all rounded-sm"><Edit3 size={18} /></button>
                    <button onClick={() => { if(window.confirm('Delete this project?')) onUpdateProjects(projects.filter(item => item.id !== p.id)) }} className="p-3 bg-white/5 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm"><Trash2 size={18} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-20 animate-in fade-in slide-in-from-bottom-10 pb-20">
          {/* Directors Section Editor */}
          <div className="bg-white/5 border border-white/10 rounded-sm p-10">
            <h4 className="text-white font-logo font-black text-2xl mb-12 uppercase flex items-center gap-4">
              <span className="w-8 h-[2px] bg-[#84cc16]"></span>
              Directors View Editor
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">First Name</label>
                <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={tempContent.directors.name} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, name: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Last Name</label>
                <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={tempContent.directors.subName} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, subName: e.target.value}})} />
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Manifesto</label>
                <textarea className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none h-32" value={tempContent.directors.manifesto} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, manifesto: e.target.value}})} />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Process Title</label>
                <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={tempContent.directors.processTitle} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, processTitle: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Process Description</label>
                <textarea className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none h-32" value={tempContent.directors.processDesc} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, processDesc: e.target.value}})} />
              </div>

              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Core Disciplines (Tags)</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {tempContent.directors.disciplines.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-sm group">
                      <span className="text-white text-xs font-bold uppercase tracking-widest">{d}</span>
                      <button onClick={() => setTempContent({...tempContent, directors: {...tempContent.directors, disciplines: tempContent.directors.disciplines.filter((_, idx) => idx !== i)}})} className="text-neutral-500 hover:text-red-500 transition-colors"><MinusCircle size={14}/></button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const val = prompt('Enter new discipline:');
                      if(val) setTempContent({...tempContent, directors: {...tempContent.directors, disciplines: [...tempContent.directors.disciplines, val]}});
                    }}
                    className="flex items-center gap-2 bg-[#84cc16]/10 border border-[#84cc16]/30 px-4 py-2 rounded-sm text-[#84cc16] hover:bg-[#84cc16] hover:text-black transition-all"
                  >
                    <PlusCircle size={14}/> <span className="text-[10px] font-black uppercase tracking-widest">Add New</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* About Section Editor */}
          <div className="bg-white/5 border border-white/10 rounded-sm p-10">
            <h4 className="text-white font-logo font-black text-2xl mb-12 uppercase flex items-center gap-4">
              <span className="w-8 h-[2px] bg-[#84cc16]"></span>
              About Us Editor
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Headline</label>
                <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none text-2xl font-bold" value={tempContent.about.headline} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, headline: e.target.value}})} />
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Description Part 1</label>
                <textarea className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none h-32" value={tempContent.about.description1} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, description1: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Description Part 2</label>
                <textarea className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none h-32" value={tempContent.about.description2} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, description2: e.target.value}})} />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Image 1 URL (Google Drive Supported)</label>
                <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={tempContent.about.img1} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, img1: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Image 2 URL (Google Drive Supported)</label>
                <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={tempContent.about.img2} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, img2: e.target.value}})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:col-span-2">
                <div className="space-y-4">
                  <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Philosophy</label>
                  <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={tempContent.about.philosophy} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, philosophy: e.target.value}})} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Production Hub</label>
                  <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={tempContent.about.hub} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, hub: e.target.value}})} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Innovation Label</label>
                  <input className="w-full bg-black border border-white/10 p-5 text-[#84cc16] focus:border-[#84cc16] outline-none font-bold" value={tempContent.about.innovation} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, innovation: e.target.value}})} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-10 border-t border-white/5">
             <p className="text-[#84cc16] text-[10px] font-bold tracking-[0.4em] uppercase animate-pulse">시스템: 입력하신 정보는 상단의 Publish 버튼을 눌러야 최종 반영됩니다.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;

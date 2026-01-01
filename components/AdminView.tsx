
import React, { useState, useEffect } from 'react';
import { Project, Category, AspectRatio, SiteContent } from '../types';
import { Trash2, Lock, ArrowRight, Edit3, Save, X, Image as ImageIcon, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';

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
  
  // Project editing state
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({});

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('inv_admin_auth');
    if (sessionAuth === 'true') setIsAuthenticated(true);
  }, []);

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

  const handleUpdateSiteContent = (path: string, value: any) => {
    const keys = path.split('.');
    const newContent = JSON.parse(JSON.stringify(siteContent));
    let current = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onUpdateContent(newContent);
  };

  // Move Project Logic
  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;
    
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;
    
    onUpdateProjects(newProjects);
  };

  // Project management handlers
  const startEditing = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectFormData(project);
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
        year: projectFormData.year || new Date().getFullYear().toString()
      } as Project;
      onUpdateProjects([newProject, ...projects]);
      setIsAdding(false);
    }
    setProjectFormData({});
  };

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
      {/* Tab Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start lg:items-center mb-16 gap-8 border-b border-white/10 pb-8">
        <div className="flex gap-12">
          <button 
            onClick={() => setActiveTab('FILMS')} 
            className={`group relative pb-4 transition-all ${activeTab === 'FILMS' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
          >
            <span className="text-4xl md:text-6xl font-logo font-black tracking-tighter uppercase">Films</span>
            {activeTab === 'FILMS' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#84cc16] shadow-[0_0_15px_#84cc16]"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('SITE_CONTENT')} 
            className={`group relative pb-4 transition-all ${activeTab === 'SITE_CONTENT' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
          >
            <span className="text-4xl md:text-6xl font-logo font-black tracking-tighter uppercase">Content</span>
            {activeTab === 'SITE_CONTENT' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#84cc16] shadow-[0_0_15px_#84cc16]"></span>}
          </button>
        </div>
        <div className="flex items-center gap-3 bg-[#84cc16]/10 px-4 py-2 rounded-full border border-[#84cc16]/20">
          <CheckCircle size={14} className="text-[#84cc16]" />
          <span className="text-[10px] font-black tracking-widest text-[#84cc16] uppercase">System Online</span>
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
             <div className="bg-white/5 p-10 border border-[#84cc16]/30 mb-12 animate-in slide-in-from-top duration-500">
               <h4 className="text-[#84cc16] font-logo font-black text-xl mb-8 uppercase">
                 {editingProjectId ? 'Edit Project' : 'Create New Project'}
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Title</label>
                   <input className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" value={projectFormData.title || ''} onChange={e => setProjectFormData({...projectFormData, title: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Client</label>
                   <input className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" value={projectFormData.client || ''} onChange={e => setProjectFormData({...projectFormData, client: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Thumbnail URL</label>
                   <input className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" value={projectFormData.thumbnail || ''} onChange={e => setProjectFormData({...projectFormData, thumbnail: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Video Embed URL</label>
                   <input className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" value={projectFormData.videoUrl || ''} onChange={e => setProjectFormData({...projectFormData, videoUrl: e.target.value})} />
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
                 <div className="flex items-end gap-4">
                   <button onClick={saveProject} className="flex-grow py-4 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2">
                     <Save size={18} /> Save Changes
                   </button>
                   <button onClick={() => { setIsAdding(false); setEditingProjectId(null); }} className="px-6 py-4 bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10">
                     <X size={18} />
                   </button>
                 </div>
               </div>
             </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {projects.map((p, index) => (
              <div key={p.id} className="group flex flex-col md:flex-row items-center gap-6 px-6 py-4 bg-white/5 border border-white/5 hover:border-[#84cc16]/30 transition-all">
                {/* Reorder Controls */}
                <div className="flex flex-row md:flex-col gap-2">
                  <button 
                    onClick={() => moveProject(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-white/20 hover:text-[#84cc16] disabled:opacity-0 transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp size={20} />
                  </button>
                  <button 
                    onClick={() => moveProject(index, 'down')}
                    disabled={index === projects.length - 1}
                    className="p-1.5 text-white/20 hover:text-[#84cc16] disabled:opacity-0 transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className="w-full md:w-32 aspect-video bg-neutral-900 overflow-hidden">
                  <img src={p.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={p.title} />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h4 className="text-white font-logo font-bold text-lg uppercase tracking-tight">{p.title}</h4>
                  <p className="text-neutral-500 text-[10px] font-bold tracking-[0.3em] uppercase">{p.client} — {p.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => startEditing(p)}
                    className="p-3 bg-white/5 text-white hover:bg-[#84cc16] hover:text-black transition-all rounded-sm"
                    title="Edit Film Info"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Delete this project?')) {
                        onUpdateProjects(projects.filter(item => item.id !== p.id))
                      }
                    }} 
                    className="p-3 bg-white/5 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm"
                    title="Delete Film"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Directors Section Editor */}
            <div className="space-y-12 bg-white/5 p-8 border border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-3xl font-logo font-black text-white uppercase">Directors Page</h3>
                <div className="flex-grow h-[1px] bg-[#84cc16]/30"></div>
              </div>
              <div className="grid gap-8">
                <div>
                  <label className="text-[10px] font-bold text-[#84cc16] tracking-widest uppercase mb-3 block">Director Name</label>
                  <div className="flex gap-4">
                    <input className="w-1/2 bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={siteContent.directors.name} onChange={e => handleUpdateSiteContent('directors.name', e.target.value)} placeholder="Main Name" />
                    <input className="w-1/2 bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={siteContent.directors.subName} onChange={e => handleUpdateSiteContent('directors.subName', e.target.value)} placeholder="Sub Name" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#84cc16] tracking-widest uppercase mb-3 block">Manifesto (Core Quote)</label>
                  <textarea rows={4} className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none leading-relaxed" value={siteContent.directors.manifesto} onChange={e => handleUpdateSiteContent('directors.manifesto', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-3 block">Process Headline</label>
                     <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={siteContent.directors.processTitle} onChange={e => handleUpdateSiteContent('directors.processTitle', e.target.value)} />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-3 block">Technology Headline</label>
                     <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={siteContent.directors.techTitle} onChange={e => handleUpdateSiteContent('directors.techTitle', e.target.value)} />
                   </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-3 block">Technology Description</label>
                  <textarea rows={3} className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none leading-relaxed" value={siteContent.directors.techDesc} onChange={e => handleUpdateSiteContent('directors.techDesc', e.target.value)} />
                </div>
              </div>
            </div>

            {/* About Section Editor */}
            <div className="space-y-12 bg-white/5 p-8 border border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-3xl font-logo font-black text-white uppercase">About Page</h3>
                <div className="flex-grow h-[1px] bg-[#84cc16]/30"></div>
              </div>
              <div className="grid gap-8">
                <div>
                  <label className="text-[10px] font-bold text-[#84cc16] tracking-widest uppercase mb-3 block">Main Headline</label>
                  <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none" value={siteContent.about.headline} onChange={e => handleUpdateSiteContent('about.headline', e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#84cc16] tracking-widest uppercase mb-3 block">Description Paragraphs</label>
                  <textarea rows={3} className="w-full bg-black border border-white/10 p-5 text-white mb-4 focus:border-[#84cc16] outline-none leading-relaxed" value={siteContent.about.description1} onChange={e => handleUpdateSiteContent('about.description1', e.target.value)} placeholder="Paragraph 1" />
                  <textarea rows={3} className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none leading-relaxed" value={siteContent.about.description2} onChange={e => handleUpdateSiteContent('about.description2', e.target.value)} placeholder="Paragraph 2" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-3 block">Image 1 (Photo URL)</label>
                    <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none mb-3" value={siteContent.about.img1} onChange={e => handleUpdateSiteContent('about.img1', e.target.value)} />
                    <div className="aspect-video bg-black border border-white/5 flex items-center justify-center overflow-hidden">
                      {siteContent.about.img1 ? <img src={siteContent.about.img1} className="w-full h-full object-cover" /> : <ImageIcon className="text-neutral-800" />}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-3 block">Image 2 (Photo URL)</label>
                    <input className="w-full bg-black border border-white/10 p-5 text-white focus:border-[#84cc16] outline-none mb-3" value={siteContent.about.img2} onChange={e => handleUpdateSiteContent('about.img2', e.target.value)} />
                    <div className="aspect-video bg-black border border-white/5 flex items-center justify-center overflow-hidden">
                      {siteContent.about.img2 ? <img src={siteContent.about.img2} className="w-full h-full object-cover" /> : <ImageIcon className="text-neutral-800" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center pt-10 border-t border-white/5">
            <p className="text-[#84cc16] text-[10px] font-bold tracking-[0.4em] uppercase animate-pulse">시스템: 모든 데이터는 입력 즉시 브라우저 저장소에 동기화됩니다.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
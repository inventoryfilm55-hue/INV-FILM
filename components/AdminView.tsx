
import React, { useState, useEffect } from 'react';
import { Project, Category, AspectRatio } from '../types';
import { Plus, Trash2, List, FileVideo, Image as ImageIcon, Lock, ShieldCheck, ArrowRight, GripVertical, Monitor, Smartphone, Download, Upload, Copy, Check } from 'lucide-react';

interface AdminViewProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ projects, onUpdateProjects }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    category: 'BRANDED CONTENT',
    aspectRatio: '16:9',
    gallery: []
  });

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('inv_admin_auth');
    if (sessionAuth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '292513QQWW') { 
      setIsAuthenticated(true);
      sessionStorage.setItem('inv_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
      setPasscode('');
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  const categories: Category[] = ['BRANDED CONTENT', 'INTERVIEW', 'MAKING', 'AI-STUDIO'];

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.title || 'Untitled',
      category: formData.category as Category,
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1364&auto=format&fit=crop',
      videoUrl: formData.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      client: formData.client || 'N/A',
      director: formData.director || 'INV-FILM',
      year: formData.year || new Date().getFullYear().toString(),
      description: formData.description || '',
      gallery: formData.gallery || [],
      aspectRatio: formData.aspectRatio as AspectRatio
    };

    onUpdateProjects([newProject, ...projects]);
    setIsAdding(false);
    setFormData({ category: 'BRANDED CONTENT', aspectRatio: '16:9', gallery: [] });
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to remove this cinematic inventory?')) {
      onUpdateProjects(projects.filter(p => p.id !== id));
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    navigator.clipboard.writeText(dataStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert('프로젝트 데이터가 클립보드에 복사되었습니다! constants.tsx 파일의 PROJECTS 변수에 붙여넣으세요.');
  };

  const importData = () => {
    const data = prompt('가져올 프로젝트 JSON 데이터를 붙여넣으세요:');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          onUpdateProjects(parsed);
          alert('데이터를 성공적으로 가져왔습니다.');
        }
      } catch (e) {
        alert('잘못된 데이터 형식입니다.');
      }
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newProjects = [...projects];
    const item = newProjects.splice(draggedItemIndex, 1)[0];
    newProjects.splice(index, 0, item);
    setDraggedItemIndex(index);
    onUpdateProjects(newProjects);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fade-up">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-sm text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#84cc16]/10 rounded-full blur-3xl"></div>
          <div className="mb-10 inline-flex items-center justify-center w-20 h-20 rounded-full bg-black border border-white/10 text-[#84cc16]">
            <Lock size={32} className={authError ? 'animate-shake text-red-500' : ''} />
          </div>
          <h2 className="text-[10px] font-bold tracking-[0.6em] uppercase text-white/40 mb-2">Security Protocol</h2>
          <h1 className="text-3xl font-logo font-black text-white tracking-tighter uppercase mb-10">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="ENTER PASSCODE"
              className={`w-full bg-black border ${authError ? 'border-red-500' : 'border-white/10'} p-5 text-center text-white tracking-[0.5em] font-bold focus:border-[#84cc16] outline-none transition-all`}
              autoFocus
            />
            <button type="submit" className="w-full py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-3">
              Authorize <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.6em] uppercase text-[#84cc16] mb-4 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#84cc16]"></span>
            Authenticated Session <ShieldCheck size={14} />
          </h2>
          <h1 className="text-6xl md:text-8xl font-logo font-black tracking-tighter text-white uppercase leading-none">ADMIN <br/> PANEL</h1>
        </div>
        <div className="flex flex-wrap gap-4 justify-end">
          <div className="flex bg-white/5 p-1 rounded-sm border border-white/5">
            <button onClick={exportData} className="p-4 text-white/40 hover:text-[#84cc16] transition-all flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
              {copied ? <Check size={16} /> : <Copy size={16} />} Export
            </button>
            <div className="w-[1px] bg-white/10 my-2"></div>
            <button onClick={importData} className="p-4 text-white/40 hover:text-blue-400 transition-all flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
              <Upload size={16} /> Import
            </button>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-12 py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:brightness-110 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(132,204,22,0.3)]"
          >
            {isAdding ? <List size={20} /> : <Plus size={20} />}
            {isAdding ? 'View List' : 'Add New Film'}
          </button>
        </div>
      </div>

      {isAdding ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7">
            <form onSubmit={handleAddProject} className="space-y-10 bg-white/5 p-10 backdrop-blur-md border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Film Title</label>
                  <input required className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" placeholder="SAMSUNG - THE ALLIANCE" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Client</label>
                  <input className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none" placeholder="SAMSUNG GALAXY" value={formData.client || ''} onChange={e => setFormData({...formData, client: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Category</label>
                  <select className="w-full bg-black border border-white/10 p-4 text-white outline-none appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Year</label>
                  <input className="w-full bg-black border border-white/10 p-4 text-white outline-none" placeholder="2024" value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Aspect Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setFormData({...formData, aspectRatio: '16:9'})} className={`flex items-center justify-center gap-2 py-4 border text-[10px] font-bold tracking-widest transition-all ${formData.aspectRatio === '16:9' ? 'bg-[#84cc16] text-black border-[#84cc16]' : 'bg-black text-white/40 border-white/10'}`}>
                      <Monitor size={14} /> 16:9
                    </button>
                    <button type="button" onClick={() => setFormData({...formData, aspectRatio: '9:16'})} className={`flex items-center justify-center gap-2 py-4 border text-[10px] font-bold tracking-widest transition-all ${formData.aspectRatio === '9:16' ? 'bg-[#84cc16] text-black border-[#84cc16]' : 'bg-black text-white/40 border-white/10'}`}>
                      <Smartphone size={14} /> 9:16
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Thumbnail URL</label>
                <input required className="w-full bg-black border border-white/10 p-4 text-white outline-none text-sm" placeholder="Image URL" value={formData.thumbnail || ''} onChange={e => setFormData({...formData, thumbnail: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Video URL</label>
                <input required className="w-full bg-black border border-white/10 p-4 text-white outline-none text-sm" placeholder="https://www.youtube.com/embed/..." value={formData.videoUrl || ''} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-6 bg-white text-black font-logo font-black tracking-widest uppercase hover:bg-[#84cc16] transition-all">Publish to Inventory</button>
            </form>
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Live Preview</p>
              <div className={`relative overflow-hidden bg-neutral-900 border border-white/10 ${formData.aspectRatio === '9:16' ? 'aspect-[9/16] w-64 mx-auto' : 'aspect-video w-full'}`}>
                {formData.thumbnail && <img src={formData.thumbnail} className="w-full h-full object-cover" />}
                <div className="absolute bottom-6 left-6">
                  <p className="text-white font-logo font-black text-2xl uppercase tracking-tighter">{formData.title || 'TITLE'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-12 py-4 text-[10px] font-bold tracking-[0.4em] uppercase text-white/20 border-b border-white/5">
            <div className="col-span-1">Order</div>
            <div className="col-span-4 lg:col-span-5">Project Details</div>
            <div className="col-span-2 text-center">Ratio</div>
            <div className="col-span-2 text-center">Category</div>
            <div className="col-span-1 text-center">Year</div>
            <div className="col-span-2 lg:col-span-1 text-right">Actions</div>
          </div>
          <div className="space-y-2">
            {projects.map((project, index) => (
              <div key={project.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={() => setDraggedItemIndex(null)} className={`grid grid-cols-12 gap-4 px-6 py-6 items-center bg-white/5 hover:bg-white/10 transition-all border border-white/5 cursor-move ${draggedItemIndex === index ? 'opacity-20 scale-95' : 'opacity-100'}`}>
                <div className="col-span-1 flex items-center justify-center text-white/10"><GripVertical size={20} /></div>
                <div className="col-span-4 lg:col-span-5 flex items-center gap-6">
                  <div className={`h-12 bg-neutral-800 border border-white/10 overflow-hidden ${project.aspectRatio === '9:16' ? 'w-8' : 'w-20'}`}>
                    <img src={project.thumbnail} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <h4 className="text-white font-logo font-bold text-sm lg:text-lg tracking-tight uppercase leading-none mb-1">{project.title}</h4>
                    <p className="text-white/30 text-[9px] font-bold tracking-widest uppercase">{project.client}</p>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-[9px] font-black tracking-widest uppercase border ${project.aspectRatio === '9:16' ? 'text-[#84cc16] border-[#84cc16]/30 bg-[#84cc16]/5' : 'text-blue-400 border-blue-400/30 bg-blue-400/5'}`}>
                    {project.aspectRatio === '9:16' ? <Smartphone size={12} /> : <Monitor size={12} />} {project.aspectRatio}
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase bg-black/40 px-3 py-1 border border-white/5">{project.category}</span>
                </div>
                <div className="col-span-1 text-center text-white/30 font-bold text-xs tracking-widest">{project.year}</div>
                <div className="col-span-2 lg:col-span-1 text-right">
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }} className="p-3 text-white/20 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
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

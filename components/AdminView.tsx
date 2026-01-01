
import React, { useState, useEffect } from 'react';
import { Project, Category, AspectRatio } from '../types';
import { Plus, Trash2, List, FileVideo, Image as ImageIcon, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

interface AdminViewProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ projects, onUpdateProjects }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    category: 'BRANDED CONTENT',
    aspectRatio: '16:9',
    gallery: []
  });

  // Basic session persistence for the current browser tab
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('inv_admin_auth');
    if (sessionAuth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default secret passcode - in a real app this would be an env variable or server-side check
    if (passcode === 'INV2024') { 
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

    onUpdateProjects([...projects, newProject]);
    setIsAdding(false);
    setFormData({ category: 'BRANDED CONTENT', aspectRatio: '16:9', gallery: [] });
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to remove this cinematic inventory?')) {
      onUpdateProjects(projects.filter(p => p.id !== id));
    }
  };

  // --- Authentication Gate UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fade-up">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-sm text-center shadow-2xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#84cc16]/10 rounded-full blur-3xl"></div>
          
          <div className="mb-10 inline-flex items-center justify-center w-20 h-20 rounded-full bg-black border border-white/10 text-[#84cc16] shadow-[0_0_30px_rgba(132,204,22,0.1)]">
            <Lock size={32} className={authError ? 'animate-shake text-red-500' : ''} />
          </div>
          
          <h2 className="text-[10px] font-bold tracking-[0.6em] uppercase text-white/40 mb-2">Security Protocol</h2>
          <h1 className="text-3xl font-logo font-black text-white tracking-tighter uppercase mb-10">Admin Access</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="ENTER PASSCODE"
                className={`w-full bg-black border ${authError ? 'border-red-500' : 'border-white/10'} p-5 text-center text-white tracking-[0.5em] font-bold focus:border-[#84cc16] outline-none transition-all`}
                autoFocus
              />
              {authError && <p className="text-[9px] text-red-500 font-bold tracking-widest uppercase mt-3">Invalid Access Key</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-3"
            >
              Authorize <ArrowRight size={18} />
            </button>
          </form>
          
          <p className="mt-12 text-[9px] text-white/20 font-bold tracking-widest uppercase">
            Restricted to INV-FILM Directorship
          </p>
        </div>
        
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  // --- Authenticated Dashboard UI ---
  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.6em] uppercase text-[#84cc16] mb-4 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#84cc16]"></span>
            Authenticated Session <ShieldCheck size={14} />
          </h2>
          <h1 className="text-6xl md:text-8xl font-logo font-black tracking-tighter text-white uppercase leading-none">
            ADMIN <br/> PANEL
          </h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              sessionStorage.removeItem('inv_admin_auth');
              setIsAuthenticated(false);
            }}
            className="px-8 py-5 border border-white/10 text-white/40 font-logo font-bold tracking-widest uppercase hover:text-white hover:border-white transition-all"
          >
            Logout
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-12 py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest uppercase hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(132,204,22,0.2)]"
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
                  <input 
                    required
                    className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none transition-colors"
                    placeholder="e.g. SAMSUNG - THE ALLIANCE"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Client</label>
                  <input 
                    className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none transition-colors"
                    placeholder="e.g. SAMSUNG GALAXY"
                    value={formData.client || ''}
                    onChange={e => setFormData({...formData, client: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Category</label>
                  <select 
                    className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none transition-colors appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Year</label>
                  <input 
                    className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none transition-colors"
                    placeholder="2024"
                    value={formData.year || ''}
                    onChange={e => setFormData({...formData, year: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Aspect Ratio</label>
                  <select 
                    className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none transition-colors appearance-none"
                    value={formData.aspectRatio}
                    onChange={e => setFormData({...formData, aspectRatio: e.target.value as AspectRatio})}
                  >
                    <option value="16:9">Landscape (16:9)</option>
                    <option value="9:16">Portrait (9:16)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Thumbnail URL</label>
                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-black flex items-center justify-center text-[#84cc16] border border-white/10">
                      <ImageIcon size={20} />
                   </div>
                   <input 
                    required
                    className="flex-1 bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none transition-colors text-sm"
                    placeholder="Unsplash or Image URL"
                    value={formData.thumbnail || ''}
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">YouTube/Vimeo Embed URL</label>
                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-black flex items-center justify-center text-[#84cc16] border border-white/10">
                      <FileVideo size={20} />
                   </div>
                   <input 
                    required
                    className="flex-1 bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none transition-colors text-sm"
                    placeholder="https://www.youtube.com/embed/..."
                    value={formData.videoUrl || ''}
                    onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Project Description</label>
                <textarea 
                  rows={4}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:border-[#84cc16] outline-none transition-colors resize-none"
                  placeholder="Tell the story behind this production..."
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-white text-black font-logo font-black tracking-widest uppercase hover:bg-[#84cc16] transition-all"
              >
                Publish to Inventory
              </button>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Live Preview (Thumbnail)</p>
              <div className={`relative overflow-hidden bg-neutral-900 border border-white/10 ${formData.aspectRatio === '9:16' ? 'aspect-[9/16] w-64 mx-auto' : 'aspect-video w-full'}`}>
                {formData.thumbnail ? (
                  <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/10">
                    <ImageIcon size={48} />
                    <span className="text-[10px] mt-4 font-bold tracking-widest">NO IMAGE</span>
                  </div>
                )}
                <div className="absolute bottom-6 left-6">
                  <p className="text-white font-logo font-black text-2xl uppercase tracking-tighter">
                    {formData.title || 'YOUR PROJECT TITLE'}
                  </p>
                  <p className="text-[#84cc16] text-[10px] font-bold tracking-[0.3em] uppercase">
                    {formData.client || 'CLIENT NAME'}
                  </p>
                </div>
              </div>
              <div className="p-8 border border-white/5 bg-white/5 italic text-white/40 text-sm leading-relaxed">
                "Adding a new project will instantly update the public 'Work' grid and preserve the data in your browser's local cache."
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] font-bold tracking-[0.4em] uppercase text-white/20 border-b border-white/5">
            <div className="col-span-5 lg:col-span-6">Project Details</div>
            <div className="col-span-3 lg:col-span-2 text-center">Category</div>
            <div className="col-span-2 text-center">Year</div>
            <div className="col-span-2 lg:col-span-2 text-right">Actions</div>
          </div>
          {projects.map(project => (
            <div key={project.id} className="grid grid-cols-12 gap-4 px-6 py-6 items-center bg-white/5 hover:bg-white/10 transition-colors group border border-white/5">
              <div className="col-span-5 lg:col-span-6 flex items-center gap-6">
                <div className="w-20 h-12 bg-neutral-800 border border-white/10 overflow-hidden hidden md:block">
                  <img src={project.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div>
                  <h4 className="text-white font-logo font-bold text-sm lg:text-lg tracking-tight uppercase leading-none mb-1">{project.title}</h4>
                  <p className="text-white/30 text-[9px] font-bold tracking-widest uppercase">{project.client}</p>
                </div>
              </div>
              <div className="col-span-3 lg:col-span-2 text-center">
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase bg-black/40 px-3 py-1 border border-white/5">
                  {project.category}
                </span>
              </div>
              <div className="col-span-2 text-center text-white/30 font-bold text-xs tracking-widest">
                {project.year}
              </div>
              <div className="col-span-2 lg:col-span-2 text-right">
                <button 
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-3 text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/10">
              <p className="text-white/20 font-logo font-bold tracking-widest uppercase">No cinematic records found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminView;

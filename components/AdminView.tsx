
import React, { useState, useEffect, useRef } from 'react';
import { Project, Category, AspectRatio, SiteContent } from '../types';
import { Trash2, Lock, ArrowRight, Edit3, Save, X, Image as ImageIcon, CheckCircle, ChevronUp, ChevronDown, Monitor, Smartphone, AlertCircle, Upload, Plus, RefreshCw, Link as LinkIcon, Globe, ShieldAlert, WifiOff, Home, PlusCircle, MinusCircle, GripVertical, Code, Copy, ExternalLink, MessageSquare, Share2 } from 'lucide-react';

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
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({});
  const [tempContent, setTempContent] = useState<SiteContent>(siteContent);
  const [productionCode, setProductionCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [urlCopySuccess, setUrlCopySuccess] = useState(false);

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

  const handleCopySiteUrl = () => {
    const siteUrl = "https://www.inventoryfilm.com";
    navigator.clipboard.writeText(siteUrl);
    setUrlCopySuccess(true);
    setTimeout(() => setUrlCopySuccess(false), 2000);
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
      const newP = { 
        ...projectFormData, 
        id: Date.now().toString(), 
        thumbnail: finalThumbnail,
        gallery: projectFormData.gallery || [] 
      } as Project;
      onUpdateProjects([newP, ...projects]);
      setIsAdding(false);
    }
    setProjectFormData({});
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingProjectId(null);
    setProjectFormData({});
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[500] bg-[#050505] flex items-center justify-center p-6">
        <div className={`w-full max-w-md bg-neutral-900/50 border p-12 rounded-sm text-center shadow-2xl transition-all ${authError ? 'border-red-500 animate-shake' : 'border-white/10'}`}>
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

  const categories: Category[] = ['BRANDED CONTENT', 'INTERVIEW', 'MAKING', 'AI-STUDIO'];

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-20 lg:py-32 animate-fade-up">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-12 mb-16 border-b border-white/10 pb-6">
        {['FILMS', 'SITE_CONTENT', 'SYSTEM'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`relative pb-2 font-logo font-black uppercase tracking-widest text-2xl ${activeTab === tab ? 'text-[#84cc16]' : 'text-neutral-600'}`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#84cc16]"></span>}
          </button>
        ))}
      </div>

      {/* SYSTEM TAB */}
      {activeTab === 'SYSTEM' && (
        <div className="max-w-4xl space-y-12 animate-fade-up pb-40">
          {/* Site Integration */}
          <div className="bg-neutral-900/50 border border-white/10 p-10 rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <LinkIcon className="text-[#84cc16]" size={24} />
              <h3 className="text-xl font-logo font-black text-white uppercase tracking-tighter">Site Integration</h3>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-grow">
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-2">Production URL</p>
                <div className="text-white font-mono text-sm bg-black p-4 border border-white/5 flex items-center justify-between">
                  https://www.inventoryfilm.com
                  <button onClick={handleCopySiteUrl} className="text-[#84cc16] hover:text-white transition-colors">
                    {urlCopySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cache Busting Section */}
          <div className="bg-neutral-900/50 border border-white/10 p-10 rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <RefreshCw className="text-[#84cc16]" size={24} />
              <h3 className="text-xl font-logo font-black text-white uppercase tracking-tighter">Cache Clearing Tools</h3>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed mb-8">
              도메인 연결 후 카카오톡이나 네이버에 주소를 보냈을 때 예전 이미지가 뜬다면, 아래 도구들을 사용해 해당 플랫폼의 기억을 지워야 합니다.<br/>
              <b>방법:</b> 사이트 URL을 복사한 후, 아래 링크를 열어 "URL" 입력창에 붙여넣고 초기화(제출)를 누르세요.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://developers.kakao.com/tool/clear/og" target="_blank" className="flex items-center justify-between p-6 bg-yellow-400/5 border border-yellow-400/20 text-yellow-500 hover:bg-yellow-400/10 transition-all group">
                <div className="flex items-center gap-4">
                  <MessageSquare size={20} />
                  <span className="font-bold tracking-widest uppercase text-xs">Kakao Cache Tool</span>
                </div>
                <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="https://searchadvisor.naver.com/" target="_blank" className="flex items-center justify-between p-6 bg-green-500/5 border border-green-500/20 text-green-500 hover:bg-green-500/10 transition-all group">
                <div className="flex items-center gap-4">
                  <Globe size={20} />
                  <span className="font-bold tracking-widest uppercase text-xs">Naver Search Advisor</span>
                </div>
                <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Sync Tool Section */}
          <div className="bg-neutral-900/50 border border-[#84cc16]/20 p-10 rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <Code className="text-[#84cc16]" size={24} />
              <h3 className="text-xl font-logo font-black text-white uppercase tracking-tighter">Production Sync Tool</h3>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed mb-10">
              디렉터님이 PC에서 수정한 내용을 인스타그램/네이버 방문자에게 똑같이 보여주려면 이 도구가 필요합니다.<br/>
              아래 버튼을 눌러 생성된 코드를 저(AI)에게 전달하고 **"이 코드로 constants.tsx를 업데이트해줘"**라고 요청하세요.
            </p>
            <button onClick={handleExportCode} className="w-full py-5 bg-[#84cc16] text-black font-logo font-black uppercase flex items-center justify-center gap-3 hover:bg-white transition-all mb-6">
              {copySuccess ? <CheckCircle size={20} /> : <Copy size={20} />}
              {copySuccess ? 'Code Copied!' : 'Generate Sync Code'}
            </button>
            {productionCode && (
              <pre className="bg-black p-6 rounded-sm text-[9px] font-mono text-neutral-500 overflow-x-auto border border-white/5 max-h-60">
                {productionCode}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* FILMS TAB */}
      {activeTab === 'FILMS' && (
        <div className="space-y-12 animate-fade-up">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-logo font-black text-white uppercase tracking-wider">Inventory</h3>
            <button onClick={() => setIsAdding(!isAdding)} className="px-8 py-3 bg-[#84cc16] text-black font-logo font-black text-sm uppercase hover:bg-white transition-all">
              {isAdding ? 'Close' : 'Add New Film'}
            </button>
          </div>

          {/* Project Form */}
          {(isAdding || editingProjectId) && (
            <div className="bg-white/5 border border-[#84cc16]/30 p-10 mb-16 space-y-8 animate-fade-up rounded-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Title</label>
                  <input className="w-full bg-black border border-white/10 p-4 text-white" value={projectFormData.title || ''} onChange={e => setProjectFormData({...projectFormData, title: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Category</label>
                  <select className="w-full bg-black border border-white/10 p-4 text-white appearance-none" value={projectFormData.category || 'BRANDED CONTENT'} onChange={e => setProjectFormData({...projectFormData, category: e.target.value as Category})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Thumbnail (GDrive Link)</label>
                  <input className="w-full bg-black border border-white/10 p-4 text-white" value={projectFormData.thumbnail || ''} onChange={e => setProjectFormData({...projectFormData, thumbnail: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">YouTube URL</label>
                  <input className="w-full bg-black border border-white/10 p-4 text-white" value={projectFormData.videoUrl || ''} onChange={e => setProjectFormData({...projectFormData, videoUrl: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={saveProject} className="flex-grow py-5 bg-[#84cc16] text-black font-logo font-black uppercase tracking-widest hover:bg-white transition-all">Save Project</button>
                <button onClick={cancelEdit} className="px-8 py-5 border border-white/10 text-white hover:border-white transition-all">Cancel</button>
              </div>
            </div>
          )}

          {/* Project List */}
          <div className="grid gap-4">
            {projects.map((p, i) => (
              <div key={p.id} className="flex items-center gap-6 p-5 bg-white/5 border border-white/5 hover:border-[#84cc16]/30 transition-all rounded-sm group">
                <span className="text-[#84cc16] font-logo font-black text-xl w-10">{(i+1).toString().padStart(2, '0')}</span>
                <div className="w-24 aspect-video bg-neutral-900 overflow-hidden flex-shrink-0">
                  <img src={convertGDriveUrl(p.thumbnail)} className="w-full h-full object-cover opacity-60" />
                </div>
                <div className="flex-grow">
                  <div className="font-logo font-black uppercase text-white tracking-widest text-lg">{p.title}</div>
                  <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{p.category}</div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => { setEditingProjectId(p.id); setProjectFormData(p); setIsAdding(false); }} className="p-3 text-neutral-500 hover:text-white"><Edit3 size={20} /></button>
                  <button onClick={() => { if(confirm('Delete?')) onUpdateProjects(projects.filter(item => item.id !== p.id)) }} className="p-3 text-neutral-500 hover:text-red-500"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SITE CONTENT TAB */}
      {activeTab === 'SITE_CONTENT' && (
        <div className="max-w-4xl space-y-12 animate-fade-up">
          {/* About Section Management */}
          <div className="bg-white/5 border border-white/10 p-10 space-y-10 rounded-sm">
            <h3 className="text-xl font-logo font-black text-[#84cc16] uppercase tracking-widest border-b border-white/5 pb-6">About Page Management</h3>
            
            <div className="space-y-4">
              <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Main Headline</label>
              <input className="w-full bg-black border border-white/10 p-4 text-white" value={tempContent.about.headline} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, headline: e.target.value}})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Hero Background (IMG 1)</label>
                <div className="relative group">
                   <input className="w-full bg-black border border-white/10 p-4 text-white" value={tempContent.about.img1} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, img1: e.target.value}})} placeholder="Paste Link or G-Drive URL" />
                   <div className="mt-2 text-[9px] text-neutral-500 uppercase tracking-widest italic">* 이 이미지가 전체 배경이 됩니다.</div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Secondary Image (IMG 2)</label>
                <input className="w-full bg-black border border-white/10 p-4 text-white" value={tempContent.about.img2} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, img2: e.target.value}})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Description Part 1</label>
                <textarea className="w-full bg-black border border-white/10 p-4 text-white h-32" value={tempContent.about.description1} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, description1: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Description Part 2</label>
                <textarea className="w-full bg-black border border-white/10 p-4 text-white h-32" value={tempContent.about.description2} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, description2: e.target.value}})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Philosophy</label>
                <input className="w-full bg-black border border-white/10 p-4 text-white" value={tempContent.about.philosophy} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, philosophy: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Hub</label>
                <input className="w-full bg-black border border-white/10 p-4 text-white" value={tempContent.about.hub} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, hub: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Innovation</label>
                <input className="w-full bg-black border border-white/10 p-4 text-white" value={tempContent.about.innovation} onChange={e => setTempContent({...tempContent, about: {...tempContent.about, innovation: e.target.value}})} />
              </div>
            </div>

            <button onClick={() => onUpdateContent(tempContent)} className="w-full py-6 bg-[#84cc16] text-black font-logo font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_10px_30px_rgba(132,204,22,0.2)]">Update Global Content</button>
          </div>

          {/* Directors Management */}
          <div className="bg-white/5 border border-white/10 p-10 space-y-10 rounded-sm">
            <h3 className="text-xl font-logo font-black text-[#84cc16] uppercase tracking-widest border-b border-white/5 pb-6">Directors Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Director Name</label>
                <input className="w-full bg-black border border-white/10 p-4 text-white" value={tempContent.directors.name} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, name: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Sub Name</label>
                <input className="w-full bg-black border border-white/10 p-4 text-white" value={tempContent.directors.subName} onChange={e => setTempContent({...tempContent, directors: {...tempContent.directors, subName: e.target.value}})} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;

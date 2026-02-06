
import React, { useState, useEffect } from 'react';
import { Category, Project, SynopsisResponse, View, SiteContent } from './types';
import { PROJECTS as INITIAL_PROJECTS, DEFAULT_SITE_CONTENT } from './constants';
import Header from './components/Header';
import SubNav from './components/SubNav';
import ProjectGrid from './components/ProjectGrid';
import ProjectModal from './components/ProjectModal';
import AICreativeLab from './components/AICreativeLab';
import RequestModal from './components/RequestModal';
import DirectorsView from './components/DirectorsView';
import AboutView from './components/AboutView';
import AdminView from './components/AdminView';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [initialRequestData, setInitialRequestData] = useState<SynopsisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const normalizeYT = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  useEffect(() => {
    // Merge Strategy: Local Admin Edits vs Baked Constants
    const savedProjects = localStorage.getItem('inv_film_projects');
    const savedContent = localStorage.getItem('inv_site_content');
    
    let finalProjects = INITIAL_PROJECTS;
    let finalContent = DEFAULT_SITE_CONTENT;

    try {
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) finalProjects = parsed;
      }
      if (savedContent) {
        const parsed = JSON.parse(savedContent);
        if (parsed && parsed.directors) finalContent = parsed;
      }
    } catch (e) {
      console.warn("Local storage sync error. Using production defaults.");
    }

    setProjects(finalProjects.map(p => ({ ...p, videoUrl: normalizeYT(p.videoUrl) })));
    setSiteContent(finalContent);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 25;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 600);
      }
      setProgress(currentProgress);
    }, 120);
    
    return () => clearInterval(interval);
  }, []);

  const handleUpdateProjects = (newProjects: Project[]) => {
    const normalized = newProjects.map(p => ({ ...p, videoUrl: normalizeYT(p.videoUrl) }));
    setProjects(normalized);
    localStorage.setItem('inv_film_projects', JSON.stringify(normalized));
  };

  const handleUpdateContent = (newContent: SiteContent) => {
    setSiteContent(newContent);
    localStorage.setItem('inv_site_content', JSON.stringify(newContent));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[1000]">
        <h1 className="font-logo text-6xl md:text-8xl font-black tracking-tighter text-white mb-12 animate-pulse">INV FILM</h1>
        <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
          <div className="absolute top-0 left-0 h-full bg-[#84cc16] transition-all duration-300 shadow-[0_0_15px_#84cc16]" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[70px] lg:pt-[85px] bg-[#050505]">
      <Header 
        onOpenAI={() => setIsAIOpen(true)}
        onOpenRequest={() => setIsRequestOpen(true)}
        setView={setCurrentView}
        currentView={currentView}
      />

      <main>
        {currentView === 'HOME' && (
          <>
            <SubNav activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <ProjectGrid projects={projects} activeCategory={activeCategory} onProjectClick={setSelectedProject} />
          </>
        )}
        {currentView === 'DIRECTORS' && <DirectorsView content={siteContent.directors} />}
        {currentView === 'ABOUT' && <AboutView content={siteContent.about} />}
        {currentView === 'ADMIN' && (
          <AdminView 
            projects={projects} 
            siteContent={siteContent}
            onUpdateProjects={handleUpdateProjects} 
            onUpdateContent={handleUpdateContent}
          />
        )}
      </main>

      <footer className="py-24 border-t border-white/5 mt-20 px-8 md:px-12 bg-black/40">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-16 md:gap-0">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h2 className="font-logo text-3xl font-black text-white">INV FILM</h2>
            <p className="text-[10px] text-neutral-600 font-bold tracking-[0.5em] uppercase">Inventory Archive — 2025</p>
          </div>
          <div className="flex gap-12 text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-500">
            <a href="https://instagram.com/inventory_film" target="_blank" className="hover:text-white transition-colors">Instagram</a>
            <button onClick={() => setCurrentView('ADMIN')} className="hover:text-[#84cc16] transition-colors">Admin Access</button>
          </div>
          <p className="text-[9px] text-neutral-700 font-bold tracking-widest uppercase">© All Rights Reserved. INV-FILM Production.</p>
        </div>
      </footer>
      
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      {isAIOpen && <AICreativeLab onClose={() => setIsAIOpen(false)} onConnectIdea={(idea) => { setInitialRequestData(idea); setIsAIOpen(false); setIsRequestOpen(true); }} />}
      {isRequestOpen && <RequestModal onClose={() => { setIsRequestOpen(false); setInitialRequestData(null); }} initialData={initialRequestData} />}
    </div>
  );
};

export default App;


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

  // Helper to normalize any YT link to embed format
  const normalizeYT = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  // View 전환 시 최상단 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  useEffect(() => {
    // Initial data load
    const savedProjects = localStorage.getItem('inv_film_projects');
    let loadedProjects: Project[] = [];
    
    if (savedProjects) {
      try { 
        const parsed = JSON.parse(savedProjects);
        loadedProjects = Array.isArray(parsed) ? parsed : INITIAL_PROJECTS;
      } catch (e) { 
        loadedProjects = INITIAL_PROJECTS; 
      }
    } else {
      loadedProjects = INITIAL_PROJECTS;
    }

    const fixedProjects = loadedProjects.map(p => ({
      ...p,
      videoUrl: normalizeYT(p.videoUrl)
    }));

    setProjects(fixedProjects);
    localStorage.setItem('inv_film_projects', JSON.stringify(fixedProjects));

    const savedContent = localStorage.getItem('inv_site_content');
    if (savedContent) {
      try { setSiteContent(JSON.parse(savedContent)); } catch (e) { setSiteContent(DEFAULT_SITE_CONTENT); }
    }

    // Loading Progress Simulation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 500);
      }
      setProgress(currentProgress);
    }, 150);
    
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

  const handleConnectIdea = (idea: SynopsisResponse) => {
    setInitialRequestData(idea);
    setIsAIOpen(false);
    setIsRequestOpen(true);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[1000]">
        <div className="text-center w-full max-w-sm px-10">
          <h1 className="font-logo text-6xl md:text-8xl font-black tracking-tighter text-white mb-12">
            INV FILM
          </h1>
          <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-[#84cc16] shadow-[0_0_15px_#84cc16] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[160px] lg:pt-[85px] bg-[#050505]">
      <Header 
        onOpenAI={() => setIsAIOpen(true)}
        onOpenRequest={() => setIsRequestOpen(true)}
        setView={setCurrentView}
        currentView={currentView}
      />

      <main className="relative">
        {currentView === 'HOME' && (
          <>
            <SubNav 
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <ProjectGrid 
              projects={projects} 
              activeCategory={activeCategory} 
              onProjectClick={setSelectedProject}
            />
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

      {/* Restored Footer for Admin and Brand contents */}
      <footer className="py-24 border-t border-white/5 mt-20 px-8 md:px-12 bg-black/20">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-16 md:gap-0">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h2 className="font-logo text-3xl font-black tracking-tighter text-white">INV FILM</h2>
            <p className="text-[10px] text-neutral-600 font-bold tracking-[0.5em] uppercase">Inventory Archive — 2025</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 text-[11px] font-bold tracking-[0.4em] uppercase text-neutral-500">
            <a href="https://instagram.com/inventory_film" target="_blank" className="hover:text-[#84cc16] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#84cc16] transition-colors">Kakao</a>
            <button 
              onClick={() => setCurrentView('ADMIN')} 
              className={`hover:text-[#84cc16] transition-colors ${currentView === 'ADMIN' ? 'text-[#84cc16]' : ''}`}
            >
              Admin Access
            </button>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[9px] text-neutral-700 font-bold tracking-widest uppercase">
              © All Rights Reserved. INV-FILM Production.
            </p>
            <p className="text-[8px] text-neutral-800 font-black tracking-widest uppercase">
              Seoul Hub — Global Vision
            </p>
          </div>
        </div>
      </footer>
      
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      {isAIOpen && <AICreativeLab onClose={() => setIsAIOpen(false)} onConnectIdea={handleConnectIdea} />}
      {isRequestOpen && <RequestModal onClose={() => { setIsRequestOpen(false); setInitialRequestData(null); }} initialData={initialRequestData} />}
    </div>
  );
};

export default App;

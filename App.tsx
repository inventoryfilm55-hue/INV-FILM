
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

  useEffect(() => {
    // Initial data load
    const savedProjects = localStorage.getItem('inv_film_projects');
    if (savedProjects) {
      try { setProjects(JSON.parse(savedProjects)); } catch (e) { setProjects(INITIAL_PROJECTS); }
    } else {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem('inv_film_projects', JSON.stringify(INITIAL_PROJECTS));
    }

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
    setProjects(newProjects);
    localStorage.setItem('inv_film_projects', JSON.stringify(newProjects));
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
    <div className="min-h-screen pt-[160px] lg:pt-[85px]">
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

      <footer className="max-w-[1800px] mx-auto px-12 py-40 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-16">
        <h2 className="font-logo text-4xl font-black tracking-tighter text-white cursor-pointer hover:text-[#84cc16] transition-colors" onClick={() => setCurrentView('HOME')}>INV FILM</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-[12px] font-bold tracking-[0.4em] uppercase text-neutral-600">
          <button onClick={() => setCurrentView('ADMIN')} className="hover:text-white transition-colors">Admin Console</button>
          <a href="https://instagram.com/inventory_film" target="_blank" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Kakao</a>
          <a href="#" className="hover:text-white transition-colors">Vimeo</a>
        </div>
        <p className="text-[11px] font-bold tracking-[0.5em] text-neutral-700 uppercase">
          © 2024 INV-FILM PRODUCTION HOUSE
        </p>
      </footer>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      {isAIOpen && <AICreativeLab onClose={() => setIsAIOpen(false)} onConnectIdea={handleConnectIdea} />}
      {isRequestOpen && <RequestModal onClose={() => { setIsRequestOpen(false); setInitialRequestData(null); }} initialData={initialRequestData} />}
    </div>
  );
};

export default App;
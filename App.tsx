
import React, { useState, useEffect } from 'react';
import { Category, Project, SynopsisResponse, View } from './types';
import { PROJECTS as INITIAL_PROJECTS } from './constants';
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
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [initialRequestData, setInitialRequestData] = useState<SynopsisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize projects from localStorage or constant
  useEffect(() => {
    const savedProjects = localStorage.getItem('inv_film_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem('inv_film_projects', JSON.stringify(INITIAL_PROJECTS));
    }
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('inv_film_projects', JSON.stringify(newProjects));
  };

  const handleConnectIdea = (idea: SynopsisResponse) => {
    setInitialRequestData(idea);
    setIsAIOpen(false);
    setIsRequestOpen(true);
  };

  const handleCloseRequest = () => {
    setIsRequestOpen(false);
    setInitialRequestData(null);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[1000]">
        <div className="text-center">
          <h1 className="font-logo text-6xl font-extrabold tracking-tighter text-white mb-4 animate-pulse uppercase">INV FILM</h1>
          <div className="w-40 h-[1.5px] bg-neutral-900 mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[#84cc16] animate-[loading_1.5s_infinite]"></div>
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[140px] lg:pt-[70px]">
      <Header 
        onOpenAI={() => setIsAIOpen(true)}
        onOpenRequest={() => setIsRequestOpen(true)}
        setView={setCurrentView}
        currentView={currentView}
      />

      <div className="relative">
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

        {currentView === 'DIRECTORS' && <DirectorsView />}
        {currentView === 'ABOUT' && <AboutView />}
        {currentView === 'ADMIN' && (
          <AdminView 
            projects={projects} 
            onUpdateProjects={handleUpdateProjects} 
          />
        )}
      </div>

      <footer className="max-w-[1800px] mx-auto px-10 py-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <h2 className="font-logo text-3xl font-black tracking-tighter text-white cursor-pointer" onClick={() => setCurrentView('HOME')}>INV FILM</h2>
        <div className="flex gap-12 text-[10px] font-bold tracking-[0.4em] uppercase text-neutral-600">
          <button 
            onClick={() => {
              setCurrentView('ADMIN');
              window.scrollTo(0, 0);
            }} 
            className="hover:text-[#84cc16] transition-colors"
          >
            Admin Console
          </button>
          <a href="#" className="hover:text-[#84cc16] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#84cc16] transition-colors">Career</a>
        </div>
        <p className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
          © 2024 INV-FILM PRODUCTION
        </p>
      </footer>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      {isAIOpen && (
        <AICreativeLab 
          onClose={() => setIsAIOpen(false)} 
          onConnectIdea={handleConnectIdea}
        />
      )}

      {isRequestOpen && (
        <RequestModal 
          onClose={handleCloseRequest} 
          initialData={initialRequestData}
        />
      )}
    </div>
  );
};

export default App;

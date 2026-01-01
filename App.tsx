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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial data load
    const savedProjects = localStorage.getItem('inv_film_projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        setProjects(INITIAL_PROJECTS);
      }
    } else {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem('inv_film_projects', JSON.stringify(INITIAL_PROJECTS));
    }
    
    // Forced loading completion
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#030303] flex items-center justify-center z-[1000]">
        <div className="text-center">
          <h1 className="font-logo text-6xl md:text-8xl font-black tracking-tighter text-white animate-pulse">
            INV FILM
          </h1>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-8 h-[1px] bg-white/20"></div>
            <span className="text-[10px] font-bold tracking-[0.5em] text-white/40 uppercase">Loading Experience</span>
            <div className="w-8 h-[1px] bg-white/20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[140px] lg:pt-[70px] bg-[#030303]">
      {/* Custom Cursor */}
      <div 
        className="fixed w-4 h-4 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999] hidden lg:block"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
      ></div>

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

        {currentView === 'DIRECTORS' && <DirectorsView />}
        {currentView === 'ABOUT' && <AboutView />}
        {currentView === 'ADMIN' && (
          <AdminView 
            projects={projects} 
            onUpdateProjects={handleUpdateProjects} 
          />
        )}
      </main>

      <footer className="max-w-[1800px] mx-auto px-10 py-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <h2 className="font-logo text-3xl font-black tracking-tighter text-white cursor-pointer" onClick={() => setCurrentView('HOME')}>INV FILM</h2>
        <div className="flex gap-12 text-[10px] font-bold tracking-[0.4em] uppercase text-neutral-600">
          <button onClick={() => setCurrentView('ADMIN')} className="hover:text-white transition-colors">Admin Console</button>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Vimeo</a>
        </div>
        <p className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
          © 2024 INV-FILM PRODUCTION
        </p>
      </footer>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {isAIOpen && (
        <AICreativeLab 
          onClose={() => setIsAIOpen(false)} 
          onConnectIdea={handleConnectIdea}
        />
      )}

      {isRequestOpen && (
        <RequestModal 
          onClose={() => {
            setIsRequestOpen(false);
            setInitialRequestData(null);
          }} 
          initialData={initialRequestData}
        />
      )}
    </div>
  );
};

export default App;
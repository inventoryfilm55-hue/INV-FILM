
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
    // 뷰 변경 시 최상단으로 이동 (부드럽게)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  useEffect(() => {
    // 데이터 로드 및 로딩 애니메이션
    const initData = () => {
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
        console.warn("Storage sequence interrupted, reverting to production manifest.");
      }

      setProjects(finalProjects.map(p => ({ ...p, videoUrl: normalizeYT(p.videoUrl) })));
      setSiteContent(finalContent);
    };

    initData();

    // 로딩 진행바 로직
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 25;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        // 완료 후 약간의 여운을 주고 해제
        setTimeout(() => setIsLoading(false), 800);
      }
      setProgress(currentProgress);
    }, 150);
    
    // 만약 어떤 이유로든 로딩이 너무 길어지면 강제 해제 (안전 장치)
    const safetyTimeout = setTimeout(() => setIsLoading(false), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
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
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[1000] animate-fade-in">
        <div className="relative mb-16">
          <h1 className="font-logo text-5xl md:text-7xl font-black tracking-[-0.05em] text-white animate-pulse">INV FILM</h1>
          <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-white/5"></div>
        </div>
        <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-[#84cc16] transition-all duration-500 ease-out shadow-[0_0_15px_#84cc16]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-8 text-[8px] font-bold tracking-[0.5em] text-neutral-600 uppercase animate-pulse">Initializing Digital Inventory</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[160px] lg:pt-[85px] bg-[#050505] selection:bg-[#84cc16] selection:text-black">
      <Header 
        onOpenAI={() => setIsAIOpen(true)}
        onOpenRequest={() => setIsRequestOpen(true)}
        setView={setCurrentView}
        currentView={currentView}
      />

      <main className="animate-fade-in duration-1000">
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

      <footer className="py-32 border-t border-white/5 mt-20 px-8">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-16 md:gap-0">
          <div className="text-center md:text-left">
            <h2 className="font-logo text-3xl font-black text-white mb-4">INV FILM</h2>
            <p className="text-[9px] text-neutral-600 font-bold tracking-[0.3em] uppercase">Cinematic Production House</p>
          </div>
          
          <div className="flex flex-col items-center gap-8">
             <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              <a href="https://instagram.com/inventory_film" target="_blank" className="hover:text-[#84cc16] transition-colors">Instagram</a>
              <a href="https://pf.kakao.com/_xxxx" target="_blank" className="hover:text-[#84cc16] transition-colors">KakaoTalk</a>
              <button onClick={() => setCurrentView('ADMIN')} className="hover:text-white transition-colors">Admin</button>
            </div>
            <p className="text-[9px] text-neutral-800 font-bold tracking-widest uppercase italic">© 2025 INV-FILM. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      {isAIOpen && <AICreativeLab onClose={() => setIsAIOpen(false)} onConnectIdea={(idea) => { setInitialRequestData(idea); setIsAIOpen(false); setIsRequestOpen(true); }} />}
      {isRequestOpen && <RequestModal onClose={() => { setIsRequestOpen(false); setInitialRequestData(null); }} initialData={initialRequestData} />}
    </div>
  );
};

export default App;

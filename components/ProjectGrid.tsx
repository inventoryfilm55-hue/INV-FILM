
import React from 'react';
import { Project, Category } from '../types';

interface ProjectGridProps {
  projects: Project[];
  activeCategory: Category;
  onProjectClick: (project: Project) => void;
}

const resolveThumbnail = (url: string) => {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  
  const driveIdMatch = url.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=w1600`; 
  }
  return url;
};

// Reusable Project Card Component
const ProjectCard: React.FC<{ project: Project; index: number; onProjectClick: (project: Project) => void }> = ({ project, index, onProjectClick }) => {
  const isVertical = project.aspectRatio === '9:16';
  
  return (
      <div
          onClick={() => onProjectClick(project)}
          className="relative group cursor-pointer animate-fade-up flex flex-col w-full mb-12 lg:mb-0"
          style={{ animationDelay: `${index * 0.05}s` }}
      >
          {/* Image Container */}
          <div className={`relative overflow-hidden bg-neutral-900 transition-all duration-700 w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
              <img
                  src={resolveThumbnail(project.thumbnail)}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) lg:group-hover:scale-105 opacity-90 lg:group-hover:opacity-100"
              />
              
              {/* 
                  Desktop Only Overlay: 
                  @media (hover: hover) 구문을 통해 실제 마우스가 있는 환경에서만 동작하도록 제한 
              */}
              <div className="hidden lg:flex absolute inset-0 bg-black/85 opacity-0 transition-all duration-500 flex-col items-center justify-center p-8 lg:p-16 text-center backdrop-blur-[12px] pointer-events-none lg:pointer-events-auto"
                   style={{ 
                     // Only show on devices that support hover (Mouse)
                     opacity: 'var(--overlay-opacity, 0)'
                   }}
              >
                {/* CSS Variable injected via inline style for tailwind group-hover logic alternative if needed, 
                    but here we'll use a standard tailwind class that's wrapped in hover media query in index.html if possible.
                    For simplicity, we'll use a direct CSS approach in the parent. */}
                <style dangerouslySetInnerHTML={{ __html: `
                  @media (hover: hover) {
                    .group:hover .desktop-overlay { opacity: 1 !important; }
                    .group:hover .desktop-content { transform: translateY(0) !important; }
                  }
                `}} />
                
                <div className="desktop-overlay absolute inset-0 bg-black/85 opacity-0 transition-opacity duration-500"></div>
                
                <div className="desktop-content w-full max-w-full flex flex-col items-center translate-y-6 transition-all duration-700 relative z-10">
                    <p className="text-[#84cc16] text-[max(8px,0.5vw)] font-black tracking-[0.6em] uppercase mb-5">
                        {project.category}
                    </p>
                    
                    <h3 className="text-white font-logo font-black text-[clamp(1.25rem,7vw,3.5rem)] md:text-[clamp(2rem,3.5vw,4.5rem)] leading-[0.9] tracking-tighter uppercase mb-8 break-words hyphens-auto text-balance w-full overflow-hidden">
                        {project.title}
                    </h3>
                    
                    <div className="w-12 lg:w-20 h-[1px] bg-white/20 mb-8"></div>
                    
                    <p className="text-white/40 text-[max(8px,0.6vw)] font-bold tracking-[0.4em] uppercase whitespace-nowrap">
                        Dir. {project.director} — {project.year}
                    </p>
                </div>
              </div>

              {/* AI Badge */}
              {project.category === 'AI-STUDIO' && (
                  <div className="absolute top-4 right-4 bg-[#84cc16] text-black text-[7px] font-black tracking-[0.1em] px-2 py-1 rounded-sm uppercase lg:group-hover:opacity-0 transition-opacity pointer-events-none z-10">
                      AI CORE
                  </div>
              )}
          </div>

          {/* 
              Mobile & Tablet Info Block: 
              터치 기기이거나 호버가 없는 환경에서 항상 보이도록 설정
          */}
          <div className="lg:hidden mt-5 px-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[#84cc16] text-[9px] font-black tracking-[0.3em] uppercase">
                {project.category}
              </p>
              <p className="text-white/30 text-[9px] font-bold tracking-[0.2em] uppercase">
                {project.year}
              </p>
            </div>
            <h3 className="text-white font-logo font-black text-2xl leading-tight tracking-tighter uppercase">
              {project.title}
            </h3>
            <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
              Dir. {project.director}
            </p>
          </div>
      </div>
  );
};

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, activeCategory, onProjectClick }) => {
  const filteredProjects = activeCategory === 'ALL' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const leftColumn = filteredProjects.filter((_, i) => i % 2 === 0);
  const rightColumn = filteredProjects.filter((_, i) => i % 2 === 1);

  return (
    <main className="max-w-[2400px] mx-auto px-0.5 md:px-1 py-1 pb-1">
      {/* Mobile-only view for small phones (Single Column) */}
      <div className="flex flex-col gap-4 md:hidden mb-12">
        {filteredProjects.map((project, idx) => (
          <ProjectCard key={project.id} project={project} index={idx} onProjectClick={onProjectClick} />
        ))}
      </div>

      {/* Desktop & Tablet View (Two Columns) */}
      <div className="hidden md:flex gap-1 items-start">
        <div className="flex-1 flex flex-col gap-1 lg:gap-1">
          {leftColumn.map((project) => (
             <ProjectCard key={project.id} project={project} index={filteredProjects.indexOf(project)} onProjectClick={onProjectClick} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-1 lg:gap-1">
          {rightColumn.map((project) => (
             <ProjectCard key={project.id} project={project} index={filteredProjects.indexOf(project)} onProjectClick={onProjectClick} />
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-neutral-700 font-logo font-black text-2xl uppercase tracking-[0.5em] animate-pulse">
            Empty Inventory
          </p>
        </div>
      )}
    </main>
  );
};

export default ProjectGrid;


import React from 'react';
import { Project, Category } from '../types';

interface ProjectGridProps {
  projects: Project[];
  activeCategory: Category;
  onProjectClick: (project: Project) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, activeCategory, onProjectClick }) => {
  const filteredProjects = activeCategory === 'ALL' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  // Robust G-Drive Resolver using lh3 proxy
  const resolveThumbnail = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    
    const driveIdMatch = url.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/);
    if (driveIdMatch && driveIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=w1600`; 
    }
    return url;
  };

  return (
    <main className="max-w-[2400px] mx-auto px-0.5 md:px-1 py-1 pb-1">
      <div className="columns-1 md:columns-2 gap-0.5 md:gap-1 space-y-0.5 md:space-y-1">
        {filteredProjects.map((project, idx) => {
          const isVertical = project.aspectRatio === '9:16';
          
          return (
            <div
              key={project.id}
              onClick={() => onProjectClick(project)}
              className="break-inside-avoid relative group cursor-pointer animate-fade-up flex flex-col mb-0.5 md:mb-1"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className={`relative overflow-hidden bg-neutral-900 transition-all duration-700 w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
                <img
                  src={resolveThumbnail(project.thumbnail)}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                
                {/* Clean Responsive Overlay - Without 'VIEW FILM' button */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 md:p-12 text-center backdrop-blur-[8px]">
                  <div className="w-full max-w-[90%] flex flex-col items-center translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                    
                    <p className="text-[#84cc16] text-[max(8px,0.6vw)] font-black tracking-[0.5em] uppercase mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      {project.category}
                    </p>
                    
                    {/* Title with Responsive Fluid Scaling to prevent cutting */}
                    <h3 className="text-white font-logo font-black text-[clamp(24px,6vw,90px)] leading-[0.85] tracking-tighter uppercase mb-6 break-words w-full">
                      {project.title}
                    </h3>
                    
                    <div className="w-16 h-[1px] bg-white/20 mb-6 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-200"></div>
                    
                    <p className="text-white/40 text-[max(9px,0.7vw)] font-bold tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity delay-300">
                      Directed by {project.director} — {project.year}
                    </p>
                  </div>
                </div>

                {/* Subtle AI Indicator */}
                {project.category === 'AI-STUDIO' && (
                  <div className="absolute top-4 right-4 bg-[#84cc16] text-black text-[7px] font-black tracking-[0.1em] px-2 py-1 rounded-sm uppercase group-hover:opacity-0 transition-opacity pointer-events-none">
                    AI CORE
                  </div>
                )}
              </div>
            </div>
          );
        })}
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

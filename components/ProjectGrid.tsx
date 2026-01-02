
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
    <main className="max-w-[2400px] mx-auto px-6 md:px-12 py-12">
      {/* 
          Masonry Layout:
          - columns-1 for mobile, columns-2 for desktop.
          - break-inside-avoid ensures projects don't split across columns.
          - Gap between columns is controlled by gap-x.
      */}
      <div className="columns-1 md:columns-2 gap-x-12 md:gap-x-20 space-y-24 md:space-y-32">
        {filteredProjects.map((project, idx) => {
          const isVertical = project.aspectRatio === '9:16';
          
          return (
            <div
              key={project.id}
              onClick={() => onProjectClick(project)}
              className="break-inside-avoid relative group cursor-pointer animate-fade-up flex flex-col mb-24 md:mb-40"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              {/* Thumbnail Container */}
              <div className={`relative overflow-hidden bg-neutral-900 border border-white/5 transition-all duration-700 group-hover:border-[#84cc16]/30 w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
                <img
                  src={resolveThumbnail(project.thumbnail)}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105 opacity-70 group-hover:opacity-100"
                />
                
                {/* Premium Overlay Effect */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-12 text-center backdrop-blur-[2px]">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <p className="text-[#84cc16] text-[9px] font-black tracking-[0.6em] uppercase mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      INV-FILM INVENTORY
                    </p>
                    <h3 className="text-white font-logo font-black text-2xl md:text-5xl tracking-tighter uppercase mb-6 leading-none">
                      {project.title}
                    </h3>
                    <div className="w-10 h-[1.5px] bg-[#84cc16] mx-auto mb-10 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-200"></div>
                    <div className="inline-block px-10 py-4 border border-white text-white text-[10px] font-black tracking-[0.5em] uppercase hover:bg-white hover:text-black transition-all">
                      Open Film
                    </div>
                  </div>
                </div>

                {project.category === 'AI-STUDIO' && (
                  <div className="absolute top-6 right-6 bg-[#84cc16] text-black text-[8px] font-black tracking-[0.2em] px-3 py-1.5 rounded-sm uppercase group-hover:opacity-0 transition-opacity shadow-[0_0_20px_rgba(132,204,22,0.4)]">
                    AI CORE
                  </div>
                )}
              </div>
              
              {/* Project Info - Replicated from Director's provided image */}
              <div className="mt-8 flex justify-between items-start px-1">
                <div className="space-y-3">
                  <h4 className="text-white font-logo font-black text-xl md:text-3xl lg:text-4xl tracking-tight uppercase leading-none group-hover:text-[#84cc16] transition-colors duration-500">
                    {project.title}
                  </h4>
                  <p className="text-neutral-600 text-[10px] font-bold tracking-[0.3em] uppercase">
                    Directed by {project.director} — {project.year}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-[10px] font-black tracking-[0.2em] text-[#84cc16] uppercase mb-1.5">
                    {project.category}
                  </span>
                  <span className="block text-[9px] font-bold tracking-widest text-white/10 uppercase">
                    Format {project.aspectRatio}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-neutral-700 font-logo font-black text-2xl uppercase tracking-[0.5em] animate-pulse">
            No projects in this archive
          </p>
        </div>
      )}
    </main>
  );
};

export default ProjectGrid;

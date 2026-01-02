
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
      return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=w1920`;
    }
    return url;
  };

  return (
    <main className="max-w-[2400px] mx-auto px-4 md:px-8 py-12">
      {/* 
          Clean Grid System:
          - Standard 2-column grid ensures horizontal alignment.
          - Clear vertical grouping of image and its meta info.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 md:gap-y-32">
        {filteredProjects.map((project, idx) => {
          const isVertical = project.aspectRatio === '9:16';
          
          return (
            <div
              key={project.id}
              onClick={() => onProjectClick(project)}
              className="relative group cursor-pointer animate-fade-up flex flex-col"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Thumbnail Container */}
              <div className={`relative overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-[#84cc16]/30 w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
                <img
                  src={resolveThumbnail(project.thumbnail)}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105 opacity-70 group-hover:opacity-100"
                />
                
                {/* Premium Overlay Effect */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-12 text-center backdrop-blur-[2px]">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <p className="text-[#84cc16] text-[10px] font-black tracking-[0.6em] uppercase mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      INV-FILM INVENTORY
                    </p>
                    <h3 className={`text-white font-logo font-black tracking-tighter uppercase mb-6 leading-none ${isVertical ? 'text-3xl md:text-5xl' : 'text-3xl md:text-5xl'}`}>
                      {project.title}
                    </h3>
                    <div className="w-12 h-[2px] bg-[#84cc16] mx-auto mb-10 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-200"></div>
                    <div className="inline-block px-12 py-5 border border-white text-white text-[11px] font-black tracking-[0.5em] uppercase hover:bg-white hover:text-black transition-all">
                      View Film
                    </div>
                  </div>
                </div>
                
                {/* Brand Label (Top Left) */}
                <div className="absolute top-8 left-8 group-hover:opacity-0 transition-opacity duration-300">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black tracking-[0.4em] text-white uppercase">
                      {project.client}
                    </span>
                    <div className="w-6 h-[1px] bg-[#84cc16]/50"></div>
                  </div>
                </div>

                {project.category === 'AI-STUDIO' && (
                  <div className="absolute top-8 right-8 bg-[#84cc16] text-black text-[9px] font-black tracking-[0.2em] px-4 py-1.5 rounded-sm uppercase group-hover:opacity-0 transition-opacity shadow-[0_0_20px_rgba(132,204,22,0.4)]">
                    AI CORE
                  </div>
                )}
              </div>
              
              {/* Project Info - Strictly tied to its thumbnail */}
              <div className="mt-8 flex justify-between items-start px-1 group-hover:opacity-20 transition-opacity duration-500">
                <div className="space-y-3">
                  <h4 className="text-white font-logo font-bold text-xl md:text-2xl tracking-tight uppercase leading-none">
                    {project.title}
                  </h4>
                  <p className="text-neutral-500 text-[10px] font-bold tracking-[0.3em] uppercase">
                    Directed by {project.director} — {project.year}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black tracking-[0.2em] text-[#84cc16] uppercase mb-1">
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

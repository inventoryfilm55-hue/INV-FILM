
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
      // Fetching high resolution by default for larger grid items
      return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=w1920`;
    }
    return url;
  };

  return (
    <main className="max-w-[2400px] mx-auto px-4 md:px-8 py-12">
      {/* 
          Using a 2-column masonry approach for maximum visual weight.
          This makes 16:9 frames appear as large cinematic banners 
          while 9:16 frames create vertical rhythm between them.
      */}
      <div className="columns-1 md:columns-2 gap-6 space-y-8">
        {filteredProjects.map((project, idx) => (
          <div
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="break-inside-avoid relative group cursor-pointer animate-fade-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`relative overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-[#84cc16]/30 ${project.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
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
                    Inventory Film Presents
                  </p>
                  <h3 className="text-white font-logo font-black text-3xl md:text-5xl tracking-tighter uppercase mb-6 leading-none">
                    {project.title}
                  </h3>
                  <div className="w-12 h-[2px] bg-[#84cc16] mx-auto mb-10 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-200"></div>
                  <div className="inline-block px-12 py-5 border border-white text-white text-[11px] font-black tracking-[0.5em] uppercase hover:bg-white hover:text-black transition-all">
                    View Film
                  </div>
                </div>
              </div>
              
              {/* Category Badge - visible when not hovered */}
              <div className="absolute top-8 left-8 flex flex-col items-start gap-1 group-hover:opacity-0 transition-opacity duration-300">
                <span className="text-[9px] font-black tracking-[0.4em] text-white/40 uppercase">
                  {project.client}
                </span>
                <div className="h-[1px] w-6 bg-[#84cc16]"></div>
              </div>

              {project.category === 'AI-STUDIO' && (
                <div className="absolute top-8 right-8 bg-[#84cc16] text-black text-[9px] font-black tracking-[0.2em] px-4 py-1.5 rounded-sm uppercase group-hover:opacity-0 transition-opacity shadow-[0_0_20px_rgba(132,204,22,0.4)]">
                  AI CORE
                </div>
              )}
            </div>
            
            {/* Project Info - Visible beneath for accessibility & context */}
            <div className="mt-6 flex justify-between items-end px-2 group-hover:opacity-20 transition-opacity duration-500">
              <div className="space-y-1">
                <h4 className="text-white font-logo font-bold text-lg tracking-tight uppercase leading-none">
                  {project.title}
                </h4>
                <p className="text-neutral-500 text-[10px] font-bold tracking-[0.3em] uppercase">
                  Directed by {project.director} — {project.year}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[9px] font-black tracking-[0.2em] text-[#84cc16] uppercase mb-1">
                  {project.category}
                </span>
                <span className="block text-[8px] font-bold tracking-widest text-white/10 uppercase">
                  Format {project.aspectRatio}
                </span>
              </div>
            </div>
          </div>
        ))}
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

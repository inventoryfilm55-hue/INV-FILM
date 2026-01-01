
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

  return (
    <main className="max-w-full mx-auto px-1 md:px-2 py-2">
      <div className="columns-1 md:columns-2 xl:columns-3 gap-2 space-y-2">
        {filteredProjects.map((project, idx) => (
          <div
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="break-inside-avoid relative group cursor-pointer animate-fade-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className={`relative overflow-hidden bg-black/40 backdrop-blur-md border border-white/5 ${project.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105 opacity-70 group-hover:opacity-100"
              />
              
              {/* Cinematic Hover Overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-black font-logo font-black text-xl md:text-3xl tracking-tighter uppercase mb-2">
                  {project.title}
                </h3>
                <p className="text-black/60 text-[10px] font-bold tracking-[0.3em] uppercase">
                  {project.client}
                </p>
                <div className="mt-10 px-8 py-3 border border-black text-black text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-black hover:text-white transition-colors">
                  View Film
                </div>
              </div>
              
              {/* AI Badge */}
              {project.category === 'AI-STUDIO' && (
                <div className="absolute top-4 right-4 bg-[#84cc16] text-black text-[9px] font-black tracking-widest px-3 py-1 rounded-sm uppercase group-hover:opacity-0 transition-opacity shadow-[0_0_15px_rgba(132,204,22,0.4)]">
                  AI CORE
                </div>
              )}
            </div>
            
            <div className="p-3 flex justify-between items-start group-hover:opacity-0 transition-opacity duration-300">
              <div>
                <h3 className="text-white font-bold text-[11px] tracking-widest uppercase mb-0.5">
                  {project.title}
                </h3>
                <p className="text-white/30 text-[9px] font-bold tracking-widest uppercase">
                  {project.client}
                </p>
              </div>
              <span className="text-white/10 text-[9px] font-bold tracking-widest uppercase text-right">
                {project.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ProjectGrid;

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
    <main className="max-w-full mx-auto px-1 md:px-2 py-4">
      <div className="columns-1 md:columns-2 xl:columns-3 gap-3 space-y-3">
        {filteredProjects.map((project, idx) => (
          <div
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="break-inside-avoid relative group cursor-pointer animate-fade-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className={`relative overflow-hidden bg-black/60 backdrop-blur-md border border-white/5 ${project.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110 opacity-60 group-hover:opacity-100"
              />
              
              {/* Cinematic Hover Overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-black font-logo font-black text-2xl md:text-4xl tracking-tighter uppercase mb-4 leading-none">
                  {project.title}
                </h3>
                <p className="text-black/50 text-[11px] font-bold tracking-[0.4em] uppercase mb-8">
                  {project.client}
                </p>
                <div className="px-10 py-4 border-2 border-black text-black text-[12px] font-black tracking-[0.4em] uppercase hover:bg-black hover:text-white transition-all transform group-hover:translate-y-0 translate-y-4">
                  Explore Film
                </div>
              </div>
              
              {/* AI Badge */}
              {project.category === 'AI-STUDIO' && (
                <div className="absolute top-6 right-6 bg-[#84cc16] text-black text-[10px] font-black tracking-[0.2em] px-4 py-1.5 rounded-sm uppercase group-hover:opacity-0 transition-opacity shadow-[0_0_20px_rgba(132,204,22,0.5)]">
                  AI CORE
                </div>
              )}
            </div>
            
            <div className="p-5 flex justify-between items-start group-hover:opacity-0 transition-opacity duration-300">
              <div>
                <h3 className="text-white font-bold text-[13px] tracking-[0.15em] uppercase mb-1.5">
                  {project.title}
                </h3>
                <p className="text-white/20 text-[10px] font-bold tracking-[0.25em] uppercase">
                  {project.client}
                </p>
              </div>
              <span className="text-white/10 text-[10px] font-bold tracking-[0.3em] uppercase text-right mt-1">
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
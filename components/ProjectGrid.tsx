
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

const ProjectCard: React.FC<{ project: Project; index: number; onProjectClick: (project: Project) => void }> = ({ project, index, onProjectClick }) => {
  const isVertical = project.aspectRatio === '9:16';
  
  return (
    <div
      onClick={() => onProjectClick(project)}
      className="relative group cursor-pointer animate-fade-up flex flex-col w-full mb-10 lg:mb-0"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className={`relative overflow-hidden bg-neutral-900 transition-all duration-700 w-full rounded-sm ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
        <img
          src={resolveThumbnail(project.thumbnail)}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-[2000ms] lg:group-hover:scale-105 opacity-90 lg:group-hover:opacity-100"
          loading="lazy"
        />
        
        {/* Desktop Hover Info */}
        <div className="hidden lg:flex absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-all duration-500 flex-col items-center justify-center p-12 text-center backdrop-blur-md">
          <p className="text-[#84cc16] text-[10px] font-black tracking-[0.6em] uppercase mb-4">{project.category}</p>
          <h3 className="text-white font-logo font-black text-4xl leading-tight tracking-tighter uppercase mb-6 break-words px-4">{project.title}</h3>
          <div className="w-12 h-[1px] bg-white/20 mb-6"></div>
          <p className="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase">Dir. {project.director} — {project.year}</p>
        </div>

        {/* AI Badge */}
        {project.category === 'AI-STUDIO' && (
          <div className="absolute top-4 right-4 bg-[#84cc16] text-black text-[7px] font-black tracking-widest px-2 py-1 rounded-sm uppercase z-10">AI CORE</div>
        )}
      </div>

      {/* Mobile/Tablet Info (Always visible on touch devices) */}
      <div className="lg:hidden mt-4 px-2 space-y-1">
        <div className="flex items-center justify-between text-[#84cc16] text-[9px] font-black tracking-widest uppercase opacity-80">
          <span>{project.category}</span>
          <span className="text-white/30">{project.year}</span>
        </div>
        <h3 className="text-white font-logo font-black text-xl leading-tight tracking-tighter uppercase">{project.title}</h3>
        <p className="text-white/40 text-[9px] font-bold tracking-widest uppercase">Dir. {project.director}</p>
      </div>
    </div>
  );
};

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, activeCategory, onProjectClick }) => {
  const filteredProjects = activeCategory === 'ALL' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <main className="max-w-[2400px] mx-auto px-4 md:px-6 lg:px-1 py-1 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-1">
        {filteredProjects.map((project, idx) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={idx} 
            onProjectClick={onProjectClick} 
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-60 text-center">
          <p className="text-neutral-800 font-logo font-black text-xl uppercase tracking-[0.5em] animate-pulse">Inventory Empty</p>
        </div>
      )}
    </main>
  );
};

export default ProjectGrid;


import React from 'react';
import { Project } from '../types';
import { X, User, Calendar, Briefcase } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const getForcedEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (videoId) {
      const origin = window.location.origin;
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-700">
      <div className="max-w-[1600px] mx-auto min-h-screen py-10 md:py-24 px-4 md:px-20 relative flex flex-col items-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="fixed top-6 right-6 md:top-10 md:right-10 text-white/30 hover:text-[#84cc16] transition-all z-[210] p-2 hover:rotate-90 duration-300"
        >
          <X size={32} md:size={40} strokeWidth={1.5} />
        </button>

        {/* Video Player */}
        <div className={`w-full bg-neutral-900 mb-12 md:mb-24 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm relative transition-all duration-700
          ${project.aspectRatio === '9:16' ? 'max-w-[600px] aspect-[9/16]' : 'max-w-[1500px] aspect-video'}
        `}>
          <iframe
            src={getForcedEmbedUrl(project.videoUrl)}
            className="absolute inset-0 w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={project.title}
          ></iframe>
        </div>

        {/* Project Content */}
        <div className="max-w-[1200px] w-full space-y-24 animate-fade-up pb-40">
          
          <div className="text-center space-y-12">
            <div className="space-y-6 px-4">
              <p className="text-[#84cc16] text-[10px] md:text-[13px] font-black tracking-[0.7em] uppercase">Inventory Archive</p>
              {/* text-balance for perfect line distribution in modal title */}
              <h2 className="font-logo text-white font-black text-[clamp(2.5rem,9vw,8.5rem)] leading-[0.85] tracking-tighter uppercase break-keep text-balance w-full">
                {project.title}
              </h2>
            </div>
            
            <div className="w-24 h-[1px] bg-white/10 mx-auto"></div>
            
            <p className="text-neutral-400 leading-relaxed text-base md:text-xl font-light max-w-2xl mx-auto px-4">
              {project.description || "A cinematic journey produced by INV-FILM. Every frame is an inventory of human emotion and visual precision."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 md:py-20 border-y border-white/5">
            <div className="flex flex-col items-center gap-5 text-center group">
              <Briefcase size={22} className="text-[#84cc16]/50 group-hover:text-[#84cc16] transition-colors" />
              <div>
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-black mb-2">Client Entity</p>
                <p className="text-white font-logo tracking-[0.2em] text-lg md:text-2xl uppercase">{project.client}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-5 text-center group">
              <User size={22} className="text-[#84cc16]/50 group-hover:text-[#84cc16] transition-colors" />
              <div>
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-black mb-2">Direction</p>
                <p className="text-white font-logo tracking-[0.2em] text-lg md:text-2xl uppercase">{project.director}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-5 text-center group">
              <Calendar size={22} className="text-[#84cc16]/50 group-hover:text-[#84cc16] transition-colors" />
              <div>
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-black mb-2">Production Year</p>
                <p className="text-white font-logo tracking-[0.2em] text-lg md:text-2xl uppercase">{project.year}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

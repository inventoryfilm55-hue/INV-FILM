
import React from 'react';
import { Project } from '../types';
import { X, User, Calendar, Briefcase } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  // 100% Reliability: Extract only the ID and reconstruct the URL
  const getForcedEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Regular expression to extract the 11-character YouTube video ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (videoId) {
      const origin = window.location.origin;
      // Reconstruct using the official embed format only
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`;
    }
    
    // Fallback if regex fails (should not happen with standard YT links)
    return url;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-[1400px] mx-auto min-h-screen py-10 px-6 lg:px-20 relative">
        <button 
          onClick={onClose}
          className="fixed top-8 right-8 text-neutral-500 hover:text-white transition-colors z-[210]"
        >
          <X size={32} />
        </button>

        {/* Video Player Section */}
        <div className={`w-full bg-neutral-900 mb-12 shadow-2xl overflow-hidden rounded-sm relative ${project.aspectRatio === '9:16' ? 'max-w-[450px] mx-auto aspect-[9/16]' : 'aspect-video'}`}>
          <iframe
            src={getForcedEmbedUrl(project.videoUrl)}
            className="absolute inset-0 w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={project.title}
          ></iframe>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h2 className="font-logo text-4xl font-bold text-white mb-4 tracking-tighter uppercase">{project.title}</h2>
              <div className="w-20 h-[2px] bg-[#84cc16] mb-8"></div>
              <p className="text-neutral-400 leading-relaxed text-sm">
                {project.description || "Cinematic branded content produced by INV-FILM. Highlighting precision in visual storytelling and technical excellence."}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <Briefcase size={16} className="text-[#84cc16]" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Client</p>
                  <p className="text-white font-logo tracking-widest text-lg group-hover:text-[#84cc16] transition-colors">{project.client}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <User size={16} className="text-[#84cc16]" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Director</p>
                  <p className="text-white font-logo tracking-widest text-lg group-hover:text-[#84cc16] transition-colors">{project.director}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <Calendar size={16} className="text-[#84cc16]" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Year</p>
                  <p className="text-white font-logo tracking-widest text-lg group-hover:text-[#84cc16] transition-colors">{project.year}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-logo text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-8 font-bold">Visual Stills</h3>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {project.gallery && project.gallery.length > 0 ? project.gallery.map((img, i) => (
                <div key={i} className="break-inside-avoid overflow-hidden rounded-sm bg-neutral-900 group">
                  <img
                    src={img}
                    alt={`Still ${i}`}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )) : (
                <div className="p-20 border border-white/5 text-neutral-800 text-center uppercase text-[10px] font-black tracking-widest">
                  No additional stills available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

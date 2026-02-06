
import React from 'react';
import { SiteContent } from '../types';

interface AboutViewProps {
  content: SiteContent['about'];
}

const AboutView: React.FC<AboutViewProps> = ({ content }) => {
  const resolveImg = (url: string) => {
    if (!url) return '';
    const driveIdMatch = url.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/);
    if (driveIdMatch && driveIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
    }
    return url;
  };

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(content.videoBg || '');

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Background Layer: Video or Image */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-[2]"></div> {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505] z-[3]"></div>
        
        {videoId ? (
          <div className="absolute inset-0 w-full h-full scale-110 lg:scale-[1.3]">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`}
              className="w-full h-full border-none pointer-events-none"
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : (
          <img 
            src={resolveImg(content.img1)} 
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom" 
            alt="Hero Background" 
          />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Section 1: Hero Text */}
        <section className="min-h-screen flex flex-col justify-center px-8 md:px-20 lg:px-32">
          <div className="max-w-[1400px]">
            <h2 className="text-[10px] md:text-[12px] font-bold tracking-[0.8em] uppercase text-[#84cc16] mb-12 animate-fade-up">
              Brand Identity
            </h2>
            <h1 className="text-6xl md:text-[8vw] font-heading font-black tracking-tighter text-white uppercase leading-[0.85] animate-fade-up">
              {content.headline.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h1>
            
            <div className="mt-20 flex flex-col md:flex-row gap-16 md:gap-32 animate-fade-up" style={{animationDelay: '0.4s'}}>
              <div className="max-w-xl space-y-8">
                <p className="text-white/60 text-lg md:text-2xl font-light leading-relaxed">
                  {content.description1}
                </p>
                <div className="w-20 h-[1px] bg-[#84cc16]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Detailed Narrative */}
        <section className="bg-black/80 backdrop-blur-3xl border-t border-white/5 py-40 px-8 md:px-20 lg:px-32">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-7 space-y-12">
               <p className="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase">The Vision</p>
               <p className="text-white/80 text-xl md:text-3xl font-light leading-relaxed italic">
                 "{content.description2}"
               </p>
            </div>
            
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] bg-neutral-900 overflow-hidden border border-white/10 rounded-sm">
                <img src={resolveImg(content.img2)} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-1000" />
              </div>
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto mt-40 grid grid-cols-1 sm:grid-cols-3 gap-16 border-t border-white/5 pt-20">
            <div className="space-y-4">
              <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Core Philosophy</p>
              <p className="text-white font-logo font-black text-lg tracking-widest uppercase">{content.philosophy}</p>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Global Hub</p>
              <p className="text-white font-logo font-black text-lg tracking-widest uppercase">{content.hub}</p>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Tech Innovation</p>
              <p className="text-[#84cc16] font-logo font-black text-lg tracking-widest uppercase">{content.innovation}</p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AboutView;

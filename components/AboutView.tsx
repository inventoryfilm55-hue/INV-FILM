
import React from 'react';
import { SiteContent } from '../types';

interface AboutViewProps {
  content: SiteContent['about'];
}

const AboutView: React.FC<AboutViewProps> = ({ content }) => {
  // G-Drive Link Resolver helper
  const resolveImg = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    const driveIdMatch = url.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/);
    if (driveIdMatch && driveIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
    }
    return url;
  };

  return (
    <div className="relative min-h-screen bg-[#050505] animate-fade-in">
      {/* Cinematic Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[85vh] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505] z-10"></div>
        <img 
          src={resolveImg(content.img1)} 
          className="w-full h-full object-cover opacity-50 scale-105 animate-slow-zoom" 
          alt="Background" 
        />
      </div>

      <div className="relative z-20 max-w-[1800px] mx-auto px-6 md:px-12 pt-40 md:pt-80 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-end">
          <div className="lg:col-span-8">
            <h2 className="text-[10px] font-bold tracking-[0.6em] uppercase text-[#84cc16] mb-8 animate-fade-up">Inventory Film</h2>
            <h3 className="text-6xl md:text-[9vw] font-heading font-black tracking-tighter mb-12 text-white uppercase leading-[0.85] animate-fade-up">
              {content.headline}
            </h3>
          </div>
          
          <div className="lg:col-span-4 pb-4">
             <div className="aspect-[4/5] bg-neutral-900 overflow-hidden border border-white/10 rounded-sm shadow-2xl animate-fade-up" style={{animationDelay: '0.2s'}}>
                <img src={resolveImg(content.img2)} className="w-full h-full object-cover grayscale opacity-70 hover:opacity-100 transition-all duration-1000" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mt-32">
          <div className="lg:col-span-6 space-y-10 text-white/50 text-lg md:text-xl font-light leading-relaxed animate-fade-up" style={{animationDelay: '0.4s'}}>
            <p className="border-l-2 border-[#84cc16] pl-8">{content.description1}</p>
            <p className="pl-8">{content.description2}</p>
          </div>
          
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-12 self-end animate-fade-up" style={{animationDelay: '0.6s'}}>
            <div className="space-y-4">
              <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Philosophy</p>
              <p className="text-white font-logo font-bold text-sm tracking-widest uppercase">{content.philosophy}</p>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Hub</p>
              <p className="text-white font-logo font-bold text-sm tracking-widest uppercase">{content.hub}</p>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Innovation</p>
              <p className="text-[#84cc16] font-logo font-bold text-sm tracking-widest uppercase">{content.innovation}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AboutView;

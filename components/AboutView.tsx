
import React from 'react';
import { SiteContent } from '../types';

interface AboutViewProps {
  content: SiteContent['about'];
}

const AboutView: React.FC<AboutViewProps> = ({ content }) => {
  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-32 animate-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 mb-12">Inventory Film</h2>
          <h3 className="text-7xl md:text-8xl font-heading font-black tracking-tighter mb-16 text-white uppercase leading-[0.9]">
            {content.headline}
          </h3>
          <div className="space-y-8 text-white/50 max-w-md">
            <p className="text-sm leading-relaxed">{content.description1}</p>
            <p className="text-sm leading-relaxed">{content.description2}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="w-1/2 aspect-[3/4] bg-neutral-900/50 rounded-[12px] overflow-hidden border border-white/5">
             <img src={content.img1} className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 transition-opacity duration-700" />
          </div>
          <div className="w-1/2 aspect-[3/4] bg-neutral-900/50 rounded-[12px] overflow-hidden mt-12 border border-white/5">
             <img src={content.img2} className="w-full h-full object-cover grayscale opacity-40 hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>
      </div>

      <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-10">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-4">Core Philosophy</p>
          <p className="text-white font-logo font-bold text-lg uppercase">{content.philosophy}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-4">Production Hub</p>
          <p className="text-white font-logo font-bold text-lg uppercase">{content.hub}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-4">Innovation</p>
          <p className="text-[#84cc16] font-logo font-bold text-lg uppercase">{content.innovation}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
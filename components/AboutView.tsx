
import React from 'react';

const AboutView: React.FC = () => {
  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-32 animate-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 mb-12">Inventory Film</h2>
          <h3 className="text-7xl md:text-8xl font-heading font-black tracking-tighter mb-16 text-white">
            WE CRAFT <br/> VISUAL <br/> NARRATIVES <br/> FOR <br/> THE BOLD.
          </h3>
          <div className="space-y-8 text-white/50 max-w-md">
            <p className="text-sm leading-relaxed">
              Founded with the vision to bridge the gap between commercial efficiency and cinematic art, INV-FILM has become the primary destination for global brands seeking distinctive visual identities.
            </p>
            <p className="text-sm leading-relaxed">
              We believe every frame is an inventory of human emotion, technical precision, and cultural zeitgeist. From Samsung to Genesis, our portfolio reflects a commitment to the "Bold" aesthetic—high contrast, precise lines, and emotional weight.
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="w-1/2 aspect-[3/4] bg-neutral-900/50 rounded-[12px] overflow-hidden border border-white/5">
             <img src="https://images.unsplash.com/photo-1492691523567-6170c81efad1?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 transition-opacity duration-700" />
          </div>
          <div className="w-1/2 aspect-[3/4] bg-neutral-900/50 rounded-[12px] overflow-hidden mt-12 border border-white/5">
             <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-40 hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>
      </div>

      <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-10">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-4">Core Philosophy</p>
          <p className="text-white font-logo font-bold text-lg">PRECISION IN CHAOS</p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-4">Production Hub</p>
          <p className="text-white font-logo font-bold text-lg">SEOUL & BEYOND</p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-4">Innovation</p>
          <p className="text-[#84cc16] font-logo font-bold text-lg">NEURAL CINEMA LABS</p>
        </div>
      </div>
    </div>
  );
};

export default AboutView;

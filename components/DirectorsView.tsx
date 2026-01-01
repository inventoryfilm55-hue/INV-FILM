
import React from 'react';

const DirectorsView: React.FC = () => {
  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32 animate-fade-up">
      {/* Hero Section - Text Only */}
      <section className="mb-48">
        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-bold tracking-[0.8em] uppercase text-[#84cc16] mb-4 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#84cc16]"></span>
            Lead Creative Director
          </h2>
          <div className="relative">
            <h1 className="text-[12vw] font-logo font-black tracking-tighter text-white leading-[0.8] uppercase select-none">
              JUNG <br/> JUNE
            </h1>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 hidden lg:block">
              <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/10 [writing-mode:vertical-rl]">
                ESTABLISHED MMXXIV — SEOUL BASED
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Manifesto Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-64 border-t border-white/5 pt-20">
        <div className="lg:col-span-5">
          <p className="text-white/20 text-[11px] font-bold tracking-[0.4em] uppercase mb-12">Manifesto</p>
          <h3 className="text-4xl md:text-5xl font-heading font-black text-white leading-tight mb-8">
            "WE DON'T JUST RECORD MOMENTS. WE INVENTORY THE ESSENCE OF HUMAN EMOTION THROUGH LIGHT AND SHADOW."
          </h3>
          <div className="w-20 h-1 bg-[#84cc16]"></div>
        </div>
        
        <div className="lg:col-span-7 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">Process</p>
              <p className="text-white/60 leading-relaxed text-lg font-light">
                Jung June operates at the intersection of cinematic tradition and digital evolution. His process involves a rigorous deconstruction of brand DNA to find the singular visual hook that resonates on a subconscious level.
              </p>
            </div>
            <div>
              <p className="text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">Technology</p>
              <p className="text-white/60 leading-relaxed text-lg font-light">
                Utilizing state-of-the-art optical tools and proprietary AI-driven pre-visualization, he bridges the gap between impossible imagination and physical reality.
              </p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-12 border border-white/5">
            <p className="text-[#84cc16] text-[10px] font-bold tracking-[0.4em] uppercase mb-8">Core Disciplines</p>
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              {['Cinematic Storytelling', 'Automotive Art', 'Luxury Branding', 'Abstract Narratives', 'AI-Enhanced Vision', 'Futuristic Minimalism'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#84cc16]"></div>
                  <span className="text-white font-logo font-bold text-sm tracking-widest uppercase">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Large Statement Section */}
      <section className="relative py-40 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <span className="text-[40vw] font-logo font-black leading-none text-white whitespace-nowrap">VISION</span>
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h4 className="text-2xl md:text-4xl text-white/90 font-light leading-snug italic px-6">
            "In every frame, there is a story waiting to be told. My goal is to find that story and bring it to life with the precision of a craftsman and the heart of a poet."
          </h4>
          <p className="mt-12 text-[10px] font-bold tracking-[0.5em] uppercase text-[#84cc16]">— JUNG JUNE, EXECUTIVE DIRECTOR</p>
        </div>
      </section>

      {/* Stats / Accolades - Textual Design */}
      <section className="mt-64 grid grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-4">
          <p className="text-[6rem] font-logo font-black text-white leading-none">12+</p>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Years of Industry Excellence</p>
        </div>
        <div className="space-y-4">
          <p className="text-[6rem] font-logo font-black text-[#84cc16] leading-none">500</p>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Global Campaign Deliveries</p>
        </div>
        <div className="space-y-4">
          <p className="text-[6rem] font-logo font-black text-white leading-none">∞</p>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Commitment to Innovation</p>
        </div>
        <div className="space-y-4">
          <p className="text-[6rem] font-logo font-black text-white/10 leading-none">ONE</p>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Uncompromising Vision</p>
        </div>
      </section>

      {/* Footer Quote */}
      <div className="mt-64 pt-20 border-t border-white/5 text-right">
        <p className="text-white/10 font-logo text-8xl font-black uppercase tracking-tighter hover:text-[#84cc16]/20 transition-colors duration-1000 select-none">
          INV-FILM DIRECTED BY JUNE
        </p>
      </div>
    </div>
  );
};

export default DirectorsView;

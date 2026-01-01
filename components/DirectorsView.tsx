
import React from 'react';
import { SiteContent } from '../types';

interface DirectorsViewProps {
  content: SiteContent['directors'];
}

const DirectorsView: React.FC<DirectorsViewProps> = ({ content }) => {
  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32 animate-fade-up">
      <section className="mb-48">
        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-bold tracking-[0.8em] uppercase text-[#84cc16] mb-4 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#84cc16]"></span>
            Lead Creative Director
          </h2>
          <div className="relative">
            <h1 className="text-[12vw] font-logo font-black tracking-tighter text-white leading-[0.8] uppercase select-none">
              {content.name} <br/> {content.subName}
            </h1>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-64 border-t border-white/5 pt-20">
        <div className="lg:col-span-5">
          <p className="text-white/20 text-[11px] font-bold tracking-[0.4em] uppercase mb-12">Manifesto</p>
          <h3 className="text-4xl md:text-5xl font-heading font-black text-white leading-tight mb-8">
            "{content.manifesto}"
          </h3>
          <div className="w-20 h-1 bg-[#84cc16]"></div>
        </div>
        
        <div className="lg:col-span-7 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">{content.processTitle}</p>
              <p className="text-white/60 leading-relaxed text-lg font-light">{content.processDesc}</p>
            </div>
            <div>
              <p className="text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">{content.techTitle}</p>
              <p className="text-white/60 leading-relaxed text-lg font-light">{content.techDesc}</p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-12 border border-white/5">
            <p className="text-[#84cc16] text-[10px] font-bold tracking-[0.4em] uppercase mb-8">Core Disciplines</p>
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              {content.disciplines.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#84cc16]"></div>
                  <span className="text-white font-logo font-bold text-sm tracking-widest uppercase">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-64 grid grid-cols-2 lg:grid-cols-4 gap-12">
        {content.stats.map((stat, i) => (
          <div key={i} className="space-y-4">
            <p className="text-[6rem] font-logo font-black text-white leading-none">{stat.value}</p>
            <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">{stat.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DirectorsView;
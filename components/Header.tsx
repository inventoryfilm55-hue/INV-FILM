
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  onOpenAI: () => void;
  onOpenRequest: () => void;
  setView: (view: View) => void;
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ onOpenAI, onOpenRequest, setView, currentView }) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md z-[100] border-b border-white/5 h-[70px] lg:h-[85px] transition-all duration-300">
      <div className="max-w-[1800px] mx-auto h-full px-6 md:px-12 flex items-center justify-between relative">
        
        {/* Logo - Always visible and centered on mobile if needed, but here kept clean */}
        <div className="z-10">
          <button 
            onClick={() => setView('HOME')} 
            className="font-logo text-2xl md:text-3xl font-black tracking-[-0.06em] text-white hover:text-[#84cc16] transition-all duration-500"
          >
            INV FILM
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-12 text-[11px] font-bold tracking-[0.3em] uppercase text-white">
          <button onClick={() => setView('HOME')} className={`hover:text-[#84cc16] transition-colors ${currentView === 'HOME' ? 'text-white' : 'text-white/30'}`}>Work</button>
          <button onClick={() => setView('DIRECTORS')} className={`hover:text-[#84cc16] transition-colors ${currentView === 'DIRECTORS' ? 'text-white' : 'text-white/30'}`}>Directors</button>
          <button onClick={() => setView('ABOUT')} className={`hover:text-[#84cc16] transition-colors ${currentView === 'ABOUT' ? 'text-white' : 'text-white/30'}`}>About</button>
          <button onClick={onOpenRequest} className="text-white/30 hover:text-[#84cc16] transition-colors">Contact</button>
        </nav>

        {/* Mobile Navigation & AI Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenAI} 
            className="flex items-center gap-2 text-[#84cc16] bg-[#84cc16]/10 px-4 py-2 rounded-full border border-[#84cc16]/20 transition-all active:scale-95"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse"></span>
            <span className="font-black text-[10px] md:text-[12px] uppercase tracking-tighter">AI Lab</span>
          </button>
          
          {/* Mobile Menu Icon or Simple View Switcher */}
          <div className="lg:hidden flex gap-4 text-[10px] font-black text-white/40 uppercase tracking-widest">
            <button onClick={() => setView('HOME')} className={currentView === 'HOME' ? 'text-white' : ''}>Work</button>
            <button onClick={() => setView('DIRECTORS')} className={currentView === 'DIRECTORS' ? 'text-white' : ''}>Dir</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


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
    <header className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-3xl z-[100] border-b border-white/5 h-[160px] lg:h-[85px] transition-all duration-300">
      <div className="max-w-[1800px] mx-auto h-full px-8 md:px-12 flex flex-col lg:flex-row items-center justify-center lg:justify-between py-6 lg:py-0 relative">
        
        {/* Logo - Centered at top on Mobile/Tablet, Absolute Center on Desktop */}
        <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 mb-8 lg:mb-0">
          <button 
            onClick={() => setView('HOME')} 
            className="font-logo text-4xl md:text-4xl font-black tracking-[-0.06em] whitespace-nowrap text-white hover:text-[#84cc16] transition-all duration-500 scale-110 lg:scale-100 lg:hover:scale-110"
          >
            INV FILM
          </button>
        </div>

        {/* Navigation Wrapper */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full lg:w-full gap-6 sm:gap-0 lg:gap-0">
          
          {/* Left Nav */}
          <nav className="flex items-center justify-center gap-8 md:gap-12 text-[12px] md:text-[13px] font-bold tracking-[0.25em] uppercase text-white lg:flex-1 lg:justify-start order-2 lg:order-1">
            <button 
              onClick={() => setView('HOME')} 
              className={`hover:text-[#84cc16] transition-colors ${currentView === 'HOME' ? 'text-white' : 'text-white/30'}`}
            >
              Work
            </button>
            <button 
              onClick={() => setView('DIRECTORS')} 
              className={`hover:text-[#84cc16] transition-colors ${currentView === 'DIRECTORS' ? 'text-white' : 'text-white/30'}`}
            >
              Directors
            </button>
            <button 
              onClick={() => setView('ABOUT')} 
              className={`hover:text-[#84cc16] transition-colors ${currentView === 'ABOUT' ? 'text-white' : 'text-white/30'}`}
            >
              About
            </button>
            <button 
              onClick={onOpenRequest} 
              className="text-white/30 hover:text-[#84cc16] transition-colors whitespace-nowrap"
            >
              Contact
            </button>
          </nav>

          {/* Right Nav */}
          <nav className="flex items-center justify-center gap-6 md:gap-8 text-[12px] md:text-[13px] font-bold tracking-[0.25em] uppercase text-white lg:flex-1 lg:justify-end order-1 lg:order-3">
            <div className="hidden xl:flex items-center gap-6">
              <a href="https://instagram.com/inventory_film" target="_blank" className="text-white/30 hover:text-white transition-opacity">Instagram</a>
              <a href="#" className="text-white/30 hover:text-white transition-opacity">Kakao</a>
            </div>
            <button 
              onClick={onOpenAI} 
              className="flex items-center gap-3 text-[#84cc16] hover:brightness-125 transition-all group bg-white/5 lg:bg-white/5 px-6 py-2.5 rounded-full border border-white/10 shadow-[0_0_20px_rgba(132,204,22,0.15)]"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] shadow-[0_0_12px_#84cc16] animate-pulse"></span>
              <span className="font-black tracking-tighter capitalize normal-case text-[14px] md:text-[15px]">AI Studio</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;
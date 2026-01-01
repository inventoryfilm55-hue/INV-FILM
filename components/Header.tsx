
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
    <header className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-2xl z-[100] border-b border-white/10 h-[140px] lg:h-[70px] transition-all duration-300">
      <div className="max-w-[1800px] mx-auto h-full px-6 md:px-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between py-4 lg:py-0 relative">
        
        {/* Logo - Centered at top on Mobile/Tablet, Absolute Center on Desktop */}
        <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 mb-6 lg:mb-0">
          <button 
            onClick={() => setView('HOME')} 
            className="font-logo text-3xl md:text-3xl font-extrabold tracking-[-0.08em] whitespace-nowrap text-white hover:text-[#84cc16] transition-colors"
          >
            INV FILM
          </button>
        </div>

        {/* Navigation Wrapper - Below Logo on Mobile/Tablet */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full lg:w-full gap-4 sm:gap-0 lg:gap-0">
          
          {/* Left Nav (Work, Directors, About, Contact) */}
          <nav className="flex items-center justify-center gap-6 md:gap-8 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white lg:flex-1 lg:justify-start order-2 lg:order-1">
            <button 
              onClick={() => setView('HOME')} 
              className={`hover:text-[#84cc16] transition-colors ${currentView === 'HOME' ? 'text-white' : 'text-white/40'}`}
            >
              Work
            </button>
            <button 
              onClick={() => setView('DIRECTORS')} 
              className={`hover:text-[#84cc16] transition-colors ${currentView === 'DIRECTORS' ? 'text-white' : 'text-white/40'}`}
            >
              Directors
            </button>
            <button 
              onClick={() => setView('ABOUT')} 
              className={`hover:text-[#84cc16] transition-colors ${currentView === 'ABOUT' ? 'text-white' : 'text-white/40'}`}
            >
              About
            </button>
            <button 
              onClick={onOpenRequest} 
              className="text-white/40 hover:text-[#84cc16] transition-colors whitespace-nowrap"
            >
              Contact
            </button>
          </nav>

          {/* Right Nav (Socials & AI Studio) */}
          <nav className="flex items-center justify-center gap-6 md:gap-8 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white lg:flex-1 lg:justify-end order-1 lg:order-3">
            <a href="https://instagram.com/inventory_film" target="_blank" className="text-white/40 hover:text-white transition-opacity hidden xl:block">Instagram</a>
            <a href="#" className="text-white/40 hover:text-white transition-opacity hidden xl:block">Kakao</a>
            <button 
              onClick={onOpenAI} 
              className="flex items-center gap-2 text-[#84cc16] hover:brightness-125 transition-all group bg-white/5 lg:bg-transparent px-5 py-2 lg:p-0 rounded-full border border-white/10 lg:border-none shadow-[0_0_15px_rgba(132,204,22,0.1)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#84cc16] shadow-[0_0_10px_#84cc16] animate-pulse"></span>
              <span className="font-extrabold tracking-tight capitalize normal-case text-[12px] md:text-[13px]">AI Studio</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;

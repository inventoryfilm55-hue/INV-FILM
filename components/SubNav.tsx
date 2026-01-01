
import React from 'react';
import { Category } from '../types';

interface SubNavProps {
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
}

const SubNav: React.FC<SubNavProps> = ({ activeCategory, onCategoryChange }) => {
  const categories: Category[] = ['ALL', 'AI-STUDIO', 'BRANDED CONTENT', 'INTERVIEW', 'MAKING'];

  return (
    <div className="w-full bg-transparent border-b border-white/5 sticky top-[140px] lg:top-[70px] z-[90] py-6 backdrop-blur-sm transition-all duration-300">
      <div className="max-w-[1800px] mx-auto px-6 md:px-10 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-6 md:gap-8 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all relative pb-1
                ${activeCategory === cat ? 'text-white' : 'text-white/20 hover:text-[#84cc16]'}
              `}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#84cc16] shadow-[0_0_12px_#84cc16]"></span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SubNav;

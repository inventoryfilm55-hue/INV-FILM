import React from 'react';
import { Category } from '../types';

interface SubNavProps {
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
}

const SubNav: React.FC<SubNavProps> = ({ activeCategory, onCategoryChange }) => {
  const categories: Category[] = ['ALL', 'AI-STUDIO', 'BRANDED CONTENT', 'INTERVIEW', 'MAKING'];

  return (
    <div className="w-full bg-transparent border-b border-white/5 sticky top-[160px] lg:top-[85px] z-[90] py-8 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-[1800px] mx-auto px-8 md:px-12 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-8 md:gap-12 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`text-[12px] font-bold tracking-[0.3em] uppercase transition-all relative pb-2
                ${activeCategory === cat ? 'text-white' : 'text-white/25 hover:text-[#84cc16]'}
              `}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#84cc16] shadow-[0_0_15px_rgba(132,204,22,0.8)]"></span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SubNav;
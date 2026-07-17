import React from 'react';
import { NavItem, ViewMode } from '../types';

interface NavigationProps {
  currentMode: ViewMode;
  onNavigate: (mode: ViewMode) => void;
}

const ITEMS: NavItem[] = [
  { label: 'ТЕКСТЫ', mode: ViewMode.HOME },
  { label: 'ФОТОГРАФИЯ', mode: ViewMode.GALLERY },
];

export const Navigation: React.FC<NavigationProps> = ({ currentMode, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 mix-blend-difference text-white">
      <div 
        className="font-sans font-bold text-2xl tracking-tighter cursor-pointer hover:scale-105 transition-transform"
        onClick={() => onNavigate(ViewMode.HOME)}
      >
        ДИМА КОЗЛОВ
      </div>
      <div className="flex gap-8">
        {ITEMS.map((item) => (
          <button
            key={item.mode}
            onClick={() => onNavigate(item.mode)}
            className={`font-mono text-sm tracking-widest hover:line-through decoration-absurd-red decoration-2 ${
              currentMode === item.mode ? 'underline underline-offset-4 decoration-white' : ''
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
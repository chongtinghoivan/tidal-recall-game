import React from 'react';
import { Treasure } from '../types';

interface TreasureCardProps {
  treasure: Treasure;
  onClick: (id: string) => void;
  disabled: boolean;
}

export const TreasureCard: React.FC<TreasureCardProps> = ({ treasure, onClick, disabled }) => {
  return (
    <button
      onClick={() => onClick(treasure.id)}
      disabled={disabled}
      className={`
        group relative flex flex-col items-center justify-center 
        aspect-square rounded-2xl 
        border border-white/10 shadow-lg 
        transition-all duration-300 ease-out
        ${treasure.color}
        hover:scale-105 hover:bg-white/20 hover:border-white/30 hover:shadow-cyan-500/20
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-label={`Select ${treasure.name}`}
    >
      <span className="text-4xl md:text-5xl filter drop-shadow-md select-none transition-transform duration-300 group-hover:-translate-y-1">
        {treasure.emoji}
      </span>
      <span className="absolute bottom-2 text-xs font-medium text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {treasure.name}
      </span>
    </button>
  );
};

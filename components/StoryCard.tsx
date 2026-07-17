import React from 'react';
import { Story, Photo } from '../types';

interface StoryCardProps {
  story: Story;
  onClick: (story: Story) => void;
  index: number;
  photo: Photo;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick, index, photo }) => {
  // More organic rotation
  const rotateClass = index % 3 === 0 ? 'rotate-1' : index % 3 === 1 ? '-rotate-1' : 'rotate-2';
  
  return (
    <div 
      onClick={() => onClick(story)}
      className={`
        group relative cursor-pointer border-b-2 border-r-2 border-ink p-8 md:p-12 transition-all duration-500
        bg-paper hover:bg-ink hover:text-paper hover:border-transparent hover:shadow-[8px_8px_0px_0px_rgba(255,59,48,1)]
        ${rotateClass} hover:rotate-0 hover:z-10 transform
      `}
    >
      <div className="absolute top-4 right-4 font-sans font-bold text-xs tracking-widest opacity-40 group-hover:text-absurd-red group-hover:opacity-100 transition-opacity">
        {story.date.toUpperCase()}
      </div>
      
      <div className="mb-6 overflow-hidden rounded-sm border border-ink/10 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.25)] group-hover:shadow-[6px_6px_0px_0px_rgba(255,59,48,0.9)] transition-shadow duration-500">
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full h-48 md:h-56 object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-500"
          loading="lazy"
        />
      </div>

      <h3 className="font-serif text-4xl md:text-6xl font-bold mb-4 leading-[0.9] group-hover:translate-x-4 transition-transform duration-500">
        {story.title}
      </h3>
      
      <p className="font-mono text-xs md:text-sm leading-loose opacity-70 line-clamp-4 group-hover:opacity-90 max-w-md">
        {story.excerpt}
      </p>
      
      <div className="mt-6 font-mono text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
        {photo.caption}
      </div>
    </div>
  );
};
import React from 'react';
import { Story, Photo } from '../types';
import { PHOTOS } from '../constants';

interface ReadingReaderProps {
  story: Story;
  onClose: () => void;
}

export const ReadingReader: React.FC<ReadingReaderProps> = ({ story, onClose }) => {
  const associatedPhoto = story.associatedImageId ? PHOTOS.find(p => p.id === story.associatedImageId) : null;

  return (
    <div className="fixed inset-0 z-40 bg-paper overflow-y-auto animate-in fade-in duration-300">
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 z-[60] font-sans text-xl border-2 border-ink px-4 py-2 hover:bg-absurd-red hover:text-white transition-colors"
      >
        ЗАКРЫТЬ
      </button>

      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center">
        <h1 className="font-serif text-5xl md:text-8xl text-center mb-12 selection-invert">
          {story.title}
        </h1>
        
        {associatedPhoto && (
          <div className="w-full mb-12 relative grayscale hover:grayscale-0 transition-all duration-700">
             <img 
               src={associatedPhoto.url} 
               alt={story.title}
               className="w-full h-auto max-h-[60vh] object-contain object-center"
             />
             <p className="text-center font-mono text-xs mt-2 italic text-gray-500">{associatedPhoto.caption}</p>
          </div>
        )}

        <div className="prose prose-lg md:prose-xl font-mono leading-loose text-justify max-w-2xl selection-invert">
          {story.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 indent-8">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-20 border-t border-ink pt-8 w-full text-center">
           <p className="font-sans uppercase text-sm tracking-widest text-gray-400">Конец рассказа</p>
           <div className="text-4xl mt-2 text-absurd-red">***</div>
        </div>
      </div>
    </div>
  );
};
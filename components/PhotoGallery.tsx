import React, { useState } from 'react';
import { Photo } from '../types';

interface PhotoGalleryProps {
  photos: Photo[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 pb-24">
      <h2 className="font-sans text-9xl md:text-[12rem] font-bold leading-none opacity-5 fixed top-20 left-0 -z-10 select-none pointer-events-none">
        ФОТО
      </h2>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {photos.map((photo) => (
          <div 
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="break-inside-avoid relative group cursor-zoom-in"
          >
            <img 
              src={photo.url} 
              alt={photo.caption} 
              className="w-full h-auto grayscale group-hover:grayscale-0 transition duration-300 border border-ink"
            />
            <div className="absolute bottom-0 left-0 bg-ink text-white p-2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity z-20">
              {photo.caption}
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <img 
            src={selectedPhoto.url} 
            alt={selectedPhoto.caption}
            className="max-w-full max-h-[90vh] shadow-2xl" 
          />
           <p className="absolute bottom-8 text-white font-mono bg-black px-4 py-1">
            {selectedPhoto.caption}
          </p>
        </div>
      )}
    </div>
  );
};
import React, { useState, useMemo, useEffect } from 'react';
import { ViewMode, Story } from './types';
import { STORIES, PHOTOS } from './constants';
import { Navigation } from './components/Navigation';
import { StoryCard } from './components/StoryCard';
import { ReadingReader } from './components/ReadingReader';
import { PhotoGallery } from './components/PhotoGallery';
import { Sponsor } from './components/Sponsor';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.HOME);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(18);

  const filteredStories = useMemo(() => {
    return STORIES.filter(story => 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const visibleStories = useMemo(() => filteredStories.slice(0, visibleCount), [filteredStories, visibleCount]);

  useEffect(() => {
    setVisibleCount(18);
  }, [searchTerm]);

  const handleStoryClick = (story: Story) => {
    setCurrentStory(story);
    setViewMode(ViewMode.STORY_DETAIL);
  };

  const closeReader = () => {
    setCurrentStory(null);
    setViewMode(ViewMode.HOME);
  };

  const getPhotoForStory = (story: Story) => {
    const direct = PHOTOS.find(p => p.id === story.associatedImageId);
    if (direct) return direct;
    const hash = story.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const index = hash % PHOTOS.length;
    return PHOTOS[index];
  };

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.HOME:
        return (
          <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[90rem] mx-auto">
            <header className="mb-24 mt-12 md:mt-24 relative">
               {/* Abstract decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 border-4 border-absurd-red rounded-full opacity-20 animate-float" />
              <div className="absolute -left-10 top-20 w-4 h-40 bg-ink opacity-10 rotate-12" />

              <h1 className="font-serif text-7xl md:text-[10rem] font-bold leading-[0.8] tracking-tight mb-12 mix-blend-multiply">
                <span className="block hover:translate-x-8 transition-transform duration-700 cursor-default">ДИМА</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-ink to-absurd-red ml-12 md:ml-32 hover:-translate-x-8 transition-transform duration-700 cursor-default">КОЗЛОВ</span>
              </h1>
              
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-t-4 border-ink pt-8">
                <p className="font-sans text-xl md:text-3xl font-bold uppercase tracking-tight max-w-xl">
                  Осторожная, злая собака. <br/>
                  <span className="text-absurd-red">Абсурд. Депрессия. Юмор.</span>
                </p>
                
                <p className="font-mono text-xs md:text-sm max-w-xs text-right opacity-70">
                  Выставка текстов и образов. Пожалуйста, не кормите смыслы, они и так толстые.
                </p>
              </div>
            </header>

            <div className="mb-20 sticky top-24 z-30 bg-paper/80 backdrop-blur-md py-6 border-b border-ink">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="ПОИСК СЮЖЕТА..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-ink border-none font-sans font-bold text-4xl md:text-6xl uppercase focus:outline-none placeholder:text-gray-300 placeholder:opacity-50"
                />
                <span className="absolute right-0 bottom-2 font-mono text-xs tracking-widest bg-ink text-white px-2 py-1">
                  {filteredStories.length} ОБЪЕКТОВ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 pb-10">
              {visibleStories.length > 0 ? (
                visibleStories.map((story, index) => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    onClick={handleStoryClick}
                    index={index}
                    photo={getPhotoForStory(story)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-32 border-2 border-dashed border-gray-300">
                  <p className="font-serif text-5xl text-gray-300">Пустота тоже результат.</p>
                </div>
              )}
            </div>

            {visibleStories.length < filteredStories.length && (
              <div className="flex justify-center pb-20">
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 18, filteredStories.length))}
                  className="px-10 py-4 border-2 border-ink bg-paper hover:bg-ink hover:text-paper font-mono text-xs uppercase tracking-widest transition-colors"
                >
                  Показать ещё ({filteredStories.length - visibleStories.length})
                </button>
              </div>
            )}
          </div>
        );
      case ViewMode.STORY_DETAIL:
        return currentStory ? (
          <ReadingReader story={currentStory} onClose={closeReader} />
        ) : null;
      case ViewMode.GALLERY:
        return <PhotoGallery photos={PHOTOS} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-paper min-h-screen text-ink overflow-x-hidden relative">
      <Navigation currentMode={viewMode === ViewMode.STORY_DETAIL ? ViewMode.HOME : viewMode} onNavigate={setViewMode} />
      
      <main className="fade-in relative z-10">
        {renderContent()}
      </main>

      {viewMode !== ViewMode.STORY_DETAIL && <Sponsor />}
    </div>
  );
};

export default App;
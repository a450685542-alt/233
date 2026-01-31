import React, { useState, useEffect } from 'react';
import { Photo, ViewMode } from './types';
import WelcomeUpload from './components/WelcomeUpload';
import RandomMemory from './components/RandomMemory';
import OnThisDay from './components/OnThisDay';
import Favorites from './components/Favorites';
import { Shuffle, CalendarHeart, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.UPLOAD);

  // Process uploaded files
  const handleFilesSelected = (files: FileList) => {
    const newPhotos: Photo[] = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        file,
        // In a real app we would parse EXIF data here. 
        // For this demo, we use lastModified as a proxy for date taken.
        date: new Date(file.lastModified),
        isFavorite: false
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    if (newPhotos.length > 0) {
      setPhotos(prev => [...prev, ...newPhotos]);
      setViewMode(ViewMode.RANDOM);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setPhotos(prev => prev.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const handleDelete = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.url); // Cleanup memory
      }
      return prev.filter(p => p.id !== id);
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach(photo => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  if (viewMode === ViewMode.UPLOAD) {
    return <WelcomeUpload onFilesSelected={handleFilesSelected} />;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* View Container */}
      <main className="flex-1 overflow-hidden relative">
        {viewMode === ViewMode.RANDOM && (
          <RandomMemory 
            photos={photos} 
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        )}
        {viewMode === ViewMode.ON_THIS_DAY && (
          <OnThisDay 
            photos={photos} 
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        )}
        {viewMode === ViewMode.FAVORITES && (
          <Favorites 
            photos={photos} 
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="h-20 bg-zinc-900/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-6 pb-2 z-50 absolute bottom-0 w-full">
        <button
          onClick={() => setViewMode(ViewMode.RANDOM)}
          className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${
            viewMode === ViewMode.RANDOM ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Shuffle className={viewMode === ViewMode.RANDOM ? 'fill-current' : ''} size={24} strokeWidth={viewMode === ViewMode.RANDOM ? 2.5 : 2} />
          <span className="text-[10px] font-medium tracking-wide">随机</span>
        </button>

        <button
          onClick={() => setViewMode(ViewMode.ON_THIS_DAY)}
          className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${
            viewMode === ViewMode.ON_THIS_DAY ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <CalendarHeart className={viewMode === ViewMode.ON_THIS_DAY ? 'fill-current' : ''} size={24} strokeWidth={viewMode === ViewMode.ON_THIS_DAY ? 2.5 : 2} />
          <span className="text-[10px] font-medium tracking-wide">那年今日</span>
        </button>

        <button
          onClick={() => setViewMode(ViewMode.FAVORITES)}
          className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${
            viewMode === ViewMode.FAVORITES ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Heart className={viewMode === ViewMode.FAVORITES ? 'fill-current' : ''} size={24} strokeWidth={viewMode === ViewMode.FAVORITES ? 2.5 : 2} />
          <span className="text-[10px] font-medium tracking-wide">收藏</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
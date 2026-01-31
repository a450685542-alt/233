import React, { useState, useEffect, useCallback } from 'react';
import { Photo, AnalysisState } from '../types';
import { RefreshCw, Sparkles, Calendar, Clock, ChevronRight, Heart, Trash2 } from 'lucide-react';
import { analyzePhotoMemory } from '../services/geminiService';

interface RandomMemoryProps {
  photos: Photo[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

const RandomMemory: React.FC<RandomMemoryProps> = ({ photos, onToggleFavorite, onDelete }) => {
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisState>({ loading: false, text: null, error: null });

  const pickRandomPhoto = useCallback(() => {
    if (photos.length === 0) {
      setCurrentPhoto(null);
      return;
    }
    setIsAnimating(true);
    
    // Small delay to allow exit animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * photos.length);
      setCurrentPhoto(photos[randomIndex]);
      setAnalysis({ loading: false, text: null, error: null });
      setIsAnimating(false);
    }, 300);
  }, [photos]);

  // Handle case where current photo is deleted externally or init
  useEffect(() => {
    if (!currentPhoto && photos.length > 0) {
      pickRandomPhoto();
    } else if (currentPhoto && !photos.find(p => p.id === currentPhoto.id)) {
      // Current photo was removed, pick a new one immediately
      pickRandomPhoto();
    }
  }, [photos, currentPhoto, pickRandomPhoto]);

  // Update current photo ref if properties (like isFavorite) change
  useEffect(() => {
    if (currentPhoto) {
      const updated = photos.find(p => p.id === currentPhoto.id);
      if (updated && updated !== currentPhoto) {
        setCurrentPhoto(updated);
      }
    }
  }, [photos, currentPhoto]);

  const handleGeminiAnalysis = async () => {
    if (!currentPhoto) return;
    
    setAnalysis({ loading: true, text: null, error: null });
    try {
      const result = await analyzePhotoMemory(currentPhoto.file);
      setAnalysis({ loading: false, text: result, error: null });
    } catch (e) {
      setAnalysis({ loading: false, text: null, error: "唤醒失败，请重试。" });
    }
  };

  const handleDelete = () => {
    if (currentPhoto && window.confirm("确定删除这段记忆吗？")) {
      onDelete(currentPhoto.id);
      // pickRandomPhoto is handled by the useEffect above
    }
  };

  if (photos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500">
        未加载照片。
      </div>
    );
  }

  if (!currentPhoto) return null;

  const dateStr = currentPhoto.date.toLocaleDateString('zh-CN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeStr = currentPhoto.date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col bg-zinc-950">
      {/* Immersive Background (Blurred) */}
      <div 
        className="absolute inset-0 z-0 opacity-40 blur-3xl scale-125 transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${currentPhoto.url})`, 
          backgroundPosition: 'center', 
          backgroundSize: 'cover' 
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pb-24">
        
        {/* Photo Card */}
        <div 
          className={`
            relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl 
            transition-all duration-500 ease-in-out bg-zinc-900 ring-1 ring-white/10 group
            ${isAnimating ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}
          `}
        >
          <img 
            src={currentPhoto.url} 
            alt="Random Memory" 
            className="w-full h-full object-cover"
          />

          {/* Overlay Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => onToggleFavorite(currentPhoto.id)}
              className="p-3 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-colors border border-white/10"
            >
              <Heart 
                size={20} 
                className={`transition-colors ${currentPhoto.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
              />
            </button>
          </div>
          
          {/* AI Overlay if active */}
          {(analysis.loading || analysis.text) && (
            <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-md p-4 border-t border-white/10 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-start gap-3">
                <Sparkles className={`w-5 h-5 text-indigo-400 mt-1 ${analysis.loading ? 'animate-pulse' : ''}`} />
                <p className="text-sm font-light text-zinc-100 leading-relaxed italic">
                  {analysis.loading ? "正在唤醒记忆细节..." : analysis.text}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Metadata & Controls */}
        <div className={`mt-8 space-y-6 w-full max-w-md ${isAnimating ? 'opacity-0' : 'opacity-100 transition-opacity duration-500 delay-100'}`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium uppercase tracking-wider">
                <Calendar size={14} />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <Clock size={12} />
                <span>{timeStr}</span>
              </div>
            </div>
            
            <button 
              onClick={handleDelete}
              className="p-2 -mr-2 text-zinc-600 hover:text-red-400 transition-colors"
              title="删除回忆"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
             <button 
                onClick={handleGeminiAnalysis}
                disabled={analysis.loading || !!analysis.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-sm transition-colors border border-white/5 disabled:opacity-50"
             >
                <Sparkles size={16} />
                <span>AI 回忆</span>
             </button>

             <button 
                onClick={pickRandomPhoto}
                className="group flex items-center gap-2 pr-4 pl-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
             >
                <span>下一段记忆</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomMemory;
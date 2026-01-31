import React, { useMemo, useState } from 'react';
import { Photo } from '../types';
import { CalendarDays, AlertCircle, X, Heart, Trash2 } from 'lucide-react';

interface OnThisDayProps {
  photos: Photo[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

const OnThisDay: React.FC<OnThisDayProps> = ({ photos, onToggleFavorite, onDelete }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const memories = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();

    return photos.filter(photo => {
      const pDate = photo.date;
      return (
        pDate.getMonth() === currentMonth &&
        pDate.getDate() === currentDay &&
        pDate.getFullYear() !== currentYear
      );
    });
  }, [photos]);

  const todayStr = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });

  // Update selected photo reference if the underlying photo changes (e.g. favorite toggle)
  const currentSelected = selectedPhoto ? photos.find(p => p.id === selectedPhoto.id) || null : null;

  const handleDelete = (id: string) => {
    if (window.confirm("确定删除这段记忆吗？")) {
      onDelete(id);
      setSelectedPhoto(null);
    }
  };

  // Empty State
  if (memories.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-zinc-950 text-zinc-100">
        <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
          <CalendarDays className="w-10 h-10 text-zinc-600" />
        </div>
        <h2 className="text-2xl font-light mb-2">未找到回忆</h2>
        <p className="text-zinc-500 max-w-xs leading-relaxed">
          看来您在往年的<span className="text-indigo-400 font-medium">{todayStr}</span>没有留下记录。
        </p>
        <p className="mt-8 text-sm text-zinc-600 border-t border-zinc-900 pt-4 w-full max-w-[200px]">
          今天去创造新的回忆吧！
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-zinc-950 overflow-y-auto no-scrollbar p-4 pb-24">
      <div className="mb-6 mt-2 px-2">
        <h1 className="text-3xl font-light text-zinc-100">{todayStr}</h1>
        <p className="text-zinc-500 text-sm mt-1">历史上的今天，您留下了 {memories.length} 段回忆。</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {memories.map((photo) => (
          <div 
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800"
          >
            <img 
              src={photo.url} 
              alt="Memory" 
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {photo.isFavorite && (
              <div className="absolute top-2 right-2">
                <Heart size={14} className="fill-red-500 text-red-500 drop-shadow-md" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <span className="text-white text-xs font-medium">
                {photo.date.getFullYear()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {currentSelected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="max-w-3xl w-full flex flex-col items-center gap-4">
            <div className="relative">
              <img 
                src={currentSelected.url} 
                alt="Detail" 
                className="max-h-[70vh] max-w-full rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => onToggleFavorite(currentSelected.id)}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur text-white transition-colors"
                >
                  <Heart size={20} className={currentSelected.isFavorite ? 'fill-red-500 text-red-500' : ''} />
                </button>
                <button
                  onClick={() => handleDelete(currentSelected.id)}
                  className="p-2 rounded-full bg-black/50 hover:bg-red-900/50 backdrop-blur text-white transition-colors hover:text-red-400"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xl font-light text-white">
                {currentSelected.date.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnThisDay;
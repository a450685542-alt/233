import React, { useRef, useState } from 'react';
import { FolderOpen, Image as ImageIcon, ShieldCheck, FolderSearch, Images } from 'lucide-react';

interface WelcomeUploadProps {
  onFilesSelected: (files: FileList) => void;
}

const WelcomeUpload: React.FC<WelcomeUploadProps> = ({ onFilesSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFolderClick = () => {
    folderInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-zinc-950 text-zinc-100">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-light tracking-tight mb-2 font-serif italic">MemoryLane</h1>
          <p className="text-zinc-400">您的个人专属时光胶囊。</p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-3xl p-8 transition-all duration-300
            flex flex-col items-center justify-center gap-6
            ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900/20'}
          `}
        >
          <div className="space-y-2">
             <div className="flex justify-center">
                <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800">
                    <FolderOpen className="w-6 h-6 text-zinc-400" />
                </div>
             </div>
             <p className="text-sm text-zinc-500">
               将照片拖放到此处
             </p>
          </div>

          <div className="w-full space-y-3">
             <button 
                onClick={handleFileClick}
                className="w-full group flex items-center justify-between px-4 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all hover:border-zinc-700"
             >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Images size={20} />
                    </div>
                    <div className="text-left">
                        <span className="block font-medium text-zinc-200">选择照片</span>
                        <span className="text-xs text-zinc-500">挑选特定图片</span>
                    </div>
                </div>
             </button>

             <button 
                onClick={handleFolderClick}
                className="w-full group flex items-center justify-between px-4 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all hover:border-zinc-700"
             >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                        <FolderSearch size={20} />
                    </div>
                    <div className="text-left">
                        <span className="block font-medium text-zinc-200">扫描相册 / 文件夹</span>
                        <span className="text-xs text-zinc-500">一次性导入整个目录</span>
                    </div>
                </div>
             </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-600 bg-zinc-900/50 py-2 px-4 rounded-full">
          <ShieldCheck size={14} />
          <span>本地处理，不上传云端。</span>
        </div>

        {/* Standard File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
          multiple
          accept="image/*"
          className="hidden"
        />

        {/* Directory/Folder Input */}
        <input
          type="file"
          ref={folderInputRef}
          onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
          className="hidden"
          {...{ webkitdirectory: "", mozdirectory: "", directory: "" } as any}
        />
      </div>
    </div>
  );
};

export default WelcomeUpload;
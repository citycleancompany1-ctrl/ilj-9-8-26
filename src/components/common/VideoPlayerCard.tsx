import React, { useState } from 'react';
import { Play, ExternalLink, X, Film } from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '../../utils/mediaUpload';

interface VideoPlayerCardProps {
  id: string;
  title: string;
  youtubeUrl: string;
  duration?: string;
  description?: string;
  badge?: string;
  onDelete?: () => void;
  className?: string;
}

export const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({
  title,
  youtubeUrl,
  duration,
  description,
  badge,
  onDelete,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const activeEmbedUrl = getYouTubeEmbedUrl(youtubeUrl, true) || youtubeUrl;
  const thumbnailUrl = getYouTubeThumbnail(youtubeUrl);

  const handleOpenPlay = () => {
    setIsPlaying(true);
  };

  return (
    <>
      <div className={`bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col group ${className}`}>
        
        {/* Video Thumbnail / Player Container */}
        <div className="relative aspect-video bg-slate-900 w-full overflow-hidden">
          {isPlaying ? (
            <iframe
              src={activeEmbedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div 
              onClick={handleOpenPlay}
              className="w-full h-full cursor-pointer relative group-hover:scale-105 transition-transform duration-300"
            >
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-orange-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>

              {duration && (
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                  {duration}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
          <div>
            {badge && (
              <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">
                {badge}
              </span>
            )}
            <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-orange-600 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
            <button
              onClick={() => setShowModal(true)}
              className="font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wider flex items-center gap-1"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>

            <a
              href={youtubeUrl.startsWith('http') ? youtubeUrl : `https://www.youtube.com/watch?v=${youtubeUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-slate-900 flex items-center gap-1"
              title="Open directly on YouTube"
            >
              <span className="text-[10px]">YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {onDelete && (
            <div className="pt-2">
              <button
                onClick={onDelete}
                className="w-full py-1 text-center text-xs font-bold text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Delete Video
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Lightbox / Fullscreen Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="p-4 bg-slate-900 flex items-center justify-between text-white">
              <h3 className="font-bold text-sm truncate">{title}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeEmbedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useEffect } from 'react';
import { X, Sparkles, ExternalLink, CheckCircle2 } from 'lucide-react';

export interface CardDetailModalData {
  title: string;
  description: string;
  sectionName?: string;
  subtitle?: string;
  badge?: string;
  stat?: string;
  imageUrl?: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionUrl?: string;
  onAction?: () => void;
}

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CardDetailModalData | null;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <div
      id="card-detail-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="card-detail-modal-container"
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
              {data.icon || <Sparkles className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 block truncate">
                {data.sectionName || 'Details & Overview'}
              </span>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white font-['Outfit',sans-serif] truncate">
                {data.title}
              </h3>
            </div>
          </div>

          {/* Close (X) Button */}
          <button
            id="close-card-detail-x-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close details popup"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 text-slate-800 flex-1 bg-gray-50/50">
          {/* Optional Image */}
          {data.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video w-full bg-gray-100 shadow-2xs">
              <img
                src={data.imageUrl}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2">
            {data.badge && (
              <span className="text-[10px] font-bold text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-md">
                {data.badge}
              </span>
            )}
            {data.stat && (
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md">
                {data.stat}
              </span>
            )}
            {data.subtitle && (
              <span className="text-xs text-gray-500 font-medium">
                {data.subtitle}
              </span>
            )}
          </div>

          {/* Full Title (untruncated) */}
          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
            {data.title}
          </h2>

          {/* Full Description (untruncated, formatted) */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
          {data.actionText && (data.actionUrl || data.onAction) ? (
            data.actionUrl ? (
              <a
                href={data.actionUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{data.actionText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => {
                  data.onAction?.();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>{data.actionText}</span>
              </button>
            )
          ) : (
            <div className="text-[11px] text-gray-400">
              Click close or press Esc
            </div>
          )}

          <button
            id="close-card-detail-bottom-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ml-auto flex items-center gap-1.5 active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Close (बंद करें)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

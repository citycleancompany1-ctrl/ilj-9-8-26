import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { Shop, FloatingButtonsConfig } from '../../types';
import { getWhatsAppDirectUrl } from '../../utils/mediaUpload';
import { getDefaultFloatingButtons } from '../../utils/sectionDefaults';
import { SupportedLanguage, getTranslation } from '../../utils/shopTranslations';

interface FloatingActionButtonsProps {
  shop: Shop;
  currentLanguage: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
  hasBottomCartBar?: boolean;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  shop,
  currentLanguage,
  hasBottomCartBar = false,
}) => {
  // Extract config with fallback defaults
  const config: FloatingButtonsConfig = getDefaultFloatingButtons(shop.floatingButtons);

  // If master disabled, do not render
  if (!config.enabled) {
    return null;
  }

  // Only Call and WhatsApp are supported for sticky action buttons
  const isWhatsappActive = config.whatsapp !== false;
  const isCallActive = config.call !== false;

  if (!isWhatsappActive && !isCallActive) {
    return null;
  }

  // 1. Phone Call Direct Link
  const handlePhoneCall = () => {
    const phone = shop.phone || shop.whatsapp || '7087033009';
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  // 2. WhatsApp Direct Link resolution
  const handleWhatsAppClick = () => {
    const rawNumber = shop.whatsapp || shop.phone || '7087033009';
    const message = `Hello ${shop.businessName}! I am visiting your official website (${window.location.host}) and would like to inquire about your products & services.`;
    const waUrl = getWhatsAppDirectUrl(rawNumber, message);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      id="vendor-floating-actions-container"
      className={`fixed ${hasBottomCartBar ? 'bottom-20 sm:bottom-24' : 'bottom-5 sm:bottom-6'} right-3.5 sm:right-5 z-40 flex flex-col items-end gap-2.5 pointer-events-auto transition-all duration-300`}
    >
      {/* 1. DIRECT CALL NOW STICKY BUTTON */}
      {isCallActive && (
        <div className="flex items-center gap-2 group">
          <span className="hidden sm:group-hover:inline-flex bg-slate-900/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap backdrop-blur-xs transition-opacity animate-in fade-in duration-150 border border-white/10">
            {getTranslation('floating.call', currentLanguage, 'Call Store')}
          </span>
          <button
            id="floating-btn-call"
            type="button"
            onClick={handlePhoneCall}
            title={`Call ${shop.phone || shop.whatsapp || 'Store'}`}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-white cursor-pointer relative"
          >
            <Phone className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-xs" />
            <span className="sr-only">Call Store Now</span>
          </button>
        </div>
      )}

      {/* 2. WHATSAPP CHAT STICKY BUTTON */}
      {isWhatsappActive && (
        <div className="flex items-center gap-2 group">
          <span className="hidden sm:group-hover:inline-flex bg-slate-900/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap backdrop-blur-xs transition-opacity animate-in fade-in duration-150 border border-white/10">
            {getTranslation('floating.whatsapp', currentLanguage, 'WhatsApp Chat')}
          </span>
          <button
            id="floating-btn-whatsapp"
            type="button"
            onClick={handleWhatsAppClick}
            title="Chat on WhatsApp"
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-white cursor-pointer relative animate-pulse hover:animate-none"
          >
            <MessageCircle className="w-6 h-6 sm:w-6.5 sm:h-6.5 fill-white drop-shadow-xs" />
            <span className="sr-only">Chat on WhatsApp</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { MessageCircle, Phone, Globe, MapPin, X, Check, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { Shop, FloatingButtonsConfig } from '../../types';
import { getWhatsAppDirectUrl } from '../../utils/mediaUpload';
import { getDefaultFloatingButtons } from '../../utils/sectionDefaults';
import { SUPPORTED_LANGUAGES, SupportedLanguage, getTranslation } from '../../utils/shopTranslations';
import { applyGoogleTranslation } from '../../utils/googleTranslate';

interface FloatingActionButtonsProps {
  shop: Shop;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  hasBottomCartBar?: boolean;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  shop,
  currentLanguage,
  onSelectLanguage,
  hasBottomCartBar = false,
}) => {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Extract config with fallback defaults
  const config: FloatingButtonsConfig = getDefaultFloatingButtons(shop.floatingButtons);

  // If master disabled, do not render
  if (!config.enabled) {
    return null;
  }

  // Check if at least one button is enabled
  const hasAnyActive = config.whatsapp || config.call || config.language || config.googleLocation;
  if (!hasAnyActive) {
    return null;
  }

  // 1. Google Maps URL resolution
  const handleOpenGoogleMaps = () => {
    let mapsUrl = shop.googleMapsUrl?.trim();
    if (!mapsUrl || !mapsUrl.startsWith('http')) {
      const query = `${shop.businessName}, ${shop.address}, ${shop.city}, ${shop.state} ${shop.pincode || ''}`;
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  // 2. WhatsApp Direct Link resolution
  const handleWhatsAppClick = () => {
    const rawNumber = shop.whatsapp || shop.phone || '7087033009';
    const message = `Namaste ${shop.businessName}! I am visiting your official website (${window.location.host}) and would like to inquire about your products & services.`;
    const waUrl = getWhatsAppDirectUrl(rawNumber, message);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // 3. Phone Call Direct Link
  const handlePhoneCall = () => {
    const phone = shop.phone || shop.whatsapp || '7087033009';
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      {/* FLOATING CIRCLE BUTTONS STACK (BOTTOM RIGHT) */}
      <div 
        id="vendor-floating-actions-container"
        className={`fixed ${hasBottomCartBar ? 'bottom-20 sm:bottom-22' : 'bottom-4'} right-3 sm:right-4 z-40 flex flex-col items-end gap-1.5 pointer-events-auto transition-all duration-300`}
      >
        {/* BUTTONS STACK (WHEN NOT COLLAPSED) */}
        {!isCollapsed && (
          <div className="flex flex-col items-end gap-1.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">

            {/* 1. GOOGLE LOCATION (MAP PIN) CIRCLE BUTTON */}
            {config.googleLocation && (
              <div className="flex items-center gap-1.5 group">
                <span className="hidden group-hover:inline-flex bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
                  {getTranslation('floating.location', currentLanguage, 'Google Map')}
                </span>
                <button
                  id="floating-btn-google-location"
                  type="button"
                  onClick={handleOpenGoogleMaps}
                  title="Google Maps Location"
                  className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-108 active:scale-95 border-2 border-white cursor-pointer relative"
                >
                  <MapPin className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 drop-shadow-xs" />
                  <span className="sr-only">Google Maps Location</span>
                </button>
              </div>
            )}

            {/* 2. MULTI-LANGUAGE SELECTOR CIRCLE BUTTON */}
            {config.language && (
              <div className="flex items-center gap-1.5 group">
                <span className="hidden group-hover:inline-flex bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
                  {getTranslation('floating.language', currentLanguage, 'Language / भाषा')}
                </span>
                <button
                  id="floating-btn-multilanguage"
                  type="button"
                  onClick={() => setShowLanguageModal(true)}
                  title="Select Language / भाषा चुनें"
                  className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-108 active:scale-95 border-2 border-white cursor-pointer relative"
                >
                  <Globe className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 drop-shadow-xs" />
                  {/* Mini Badge for active language */}
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[7px] px-1 py-0 rounded-full border border-white shadow-xs">
                    {currentLangObj.shortLabel}
                  </span>
                  <span className="sr-only">Multi-language Switcher</span>
                </button>
              </div>
            )}

            {/* 3. DIRECT CALL NOW CIRCLE BUTTON */}
            {config.call && (
              <div className="flex items-center gap-1.5 group">
                <span className="hidden group-hover:inline-flex bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
                  {getTranslation('floating.call', currentLanguage, 'Call Store')}
                </span>
                <button
                  id="floating-btn-call"
                  type="button"
                  onClick={handlePhoneCall}
                  title={`Call ${shop.phone}`}
                  className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-108 active:scale-95 border-2 border-white cursor-pointer relative"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 drop-shadow-xs" />
                  <span className="sr-only">Call Store Now</span>
                </button>
              </div>
            )}

            {/* 4. WHATSAPP CHAT CIRCLE BUTTON */}
            {config.whatsapp && (
              <div className="flex items-center gap-1.5 group">
                <span className="hidden group-hover:inline-flex bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
                  {getTranslation('floating.whatsapp', currentLanguage, 'WhatsApp Chat')}
                </span>
                <button
                  id="floating-btn-whatsapp"
                  type="button"
                  onClick={handleWhatsAppClick}
                  title="Chat on WhatsApp"
                  className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-108 active:scale-95 border-2 border-white cursor-pointer relative animate-pulse hover:animate-none"
                >
                  <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white drop-shadow-xs" />
                  <span className="sr-only">Chat on WhatsApp</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* MINIMIZE / EXPAND TOGGLE CHIP (Sleek Bottom Indicator) */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-slate-900/80 hover:bg-slate-950 text-white text-[8.5px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-white/20 backdrop-blur-xs transition-all cursor-pointer opacity-75 hover:opacity-100"
          title={isCollapsed ? 'Expand Quick Action Buttons' : 'Minimize Buttons'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-2 h-2 text-amber-400" />
              <span>Quick Help</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-2 h-2 text-gray-300" />
              <span>Hide</span>
            </>
          )}
        </button>
      </div>

      {/* MULTI-LANGUAGE SELECTION MODAL */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 text-slate-900 shadow-2xl relative border border-gray-200 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {getTranslation('lang.selectTitle', currentLanguage, 'Select Language / भाषा चुनें')}
                  </h3>
                  <p className="text-[10.5px] text-gray-500">
                    {getTranslation('lang.selectSubtitle', currentLanguage, 'Choose your preferred language for this store')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Selection Grid */}
            <div className="grid grid-cols-2 gap-2.5 py-4">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      applyGoogleTranslation(lang.code);
                      onSelectLanguage(lang.code);
                      setShowLanguageModal(false);
                    }}
                    className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 notranslate" translate="no">
                      <span className="text-xl leading-none shrink-0">{lang.flag}</span>
                      <span className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                        {lang.nativeName}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Language Notice & Close */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="text-[11px] text-gray-500 flex items-center gap-1.5 notranslate" translate="no">
                <span>{getTranslation('lang.active', currentLanguage, 'सक्रिय भाषा')}:</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md text-xs">
                  {currentLangObj.nativeName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {getTranslation('floating.close', currentLanguage, 'ठीक है')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

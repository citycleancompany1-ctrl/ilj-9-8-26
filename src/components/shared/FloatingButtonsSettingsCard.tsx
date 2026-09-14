import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Sliders, 
  Sparkles
} from 'lucide-react';
import { FloatingButtonsConfig } from '../../types';
import { getDefaultFloatingButtons } from '../../utils/sectionDefaults';

interface FloatingButtonsSettingsCardProps {
  floatingButtons?: FloatingButtonsConfig;
  googleMapsUrl?: string;
  onUpdate: (updatedConfig: FloatingButtonsConfig, googleMapsUrl?: string) => void;
  shopName?: string;
}

export const FloatingButtonsSettingsCard: React.FC<FloatingButtonsSettingsCardProps> = ({
  floatingButtons,
  googleMapsUrl = '',
  onUpdate,
  shopName = 'Dukaan',
}) => {
  const [config, setConfig] = useState<FloatingButtonsConfig>(() => getDefaultFloatingButtons(floatingButtons));
  const [mapsUrl] = useState(googleMapsUrl);

  // Sync if prop updates
  React.useEffect(() => {
    setConfig(getDefaultFloatingButtons(floatingButtons));
  }, [floatingButtons]);

  const handleToggle = (key: keyof FloatingButtonsConfig) => {
    const updated: FloatingButtonsConfig = {
      ...config,
      [key]: !config[key],
    };
    setConfig(updated);
    onUpdate(updated, mapsUrl);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* CARD HEADER */}
      <div className="p-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-white font-['Outfit',sans-serif]">
                Sticky Quick Action Buttons (Call & WhatsApp)
              </h3>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                config.enabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-gray-700 text-gray-300 border-gray-600'
              }`}>
                {config.enabled ? 'ACTIVE ON WEBSITE' : 'DISABLED'}
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              Website ke bottom-right corner me customer ke liye Direct Call aur WhatsApp Chat ke sticky buttons.
            </p>
          </div>
        </div>

        {/* Master ON/OFF Switch */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="text-xs font-bold text-gray-300">Master Switch:</span>
          <button
            type="button"
            onClick={() => handleToggle('enabled')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              config.enabled ? 'bg-emerald-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                config.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-5 sm:p-6 space-y-6">
        
        {/* GRID OF THE 2 STICKY BUTTON CONTROLS (CALL & WHATSAPP) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* 1. DIRECT CALL STICKY BUTTON */}
          <div className={`p-4 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
            config.call && config.enabled
              ? 'border-blue-500/50 bg-blue-50/40 shadow-xs'
              : 'border-gray-200 bg-gray-50/60 opacity-75'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md border-2 border-white">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">Direct Call Button</h4>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    config.call && config.enabled
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {config.call && config.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Grahak ke phone ka dialer seedha dukaan ke mobile number ke sath open hota hai.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={!config.enabled}
              onClick={() => handleToggle('call')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.call && config.enabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  config.call && config.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. WHATSAPP CHAT STICKY BUTTON */}
          <div className={`p-4 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
            config.whatsapp && config.enabled
              ? 'border-emerald-500/50 bg-emerald-50/40 shadow-xs'
              : 'border-gray-200 bg-gray-50/60 opacity-75'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md border-2 border-white">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">WhatsApp Chat Button</h4>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    config.whatsapp && config.enabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {config.whatsapp && config.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  1-Click me customer ke phone me aapke WhatsApp number par direct chat start ho jati hai.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={!config.enabled}
              onClick={() => handleToggle('whatsapp')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.whatsapp && config.enabled ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  config.whatsapp && config.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

        {/* LIVE VISUAL PREVIEW OF THE STICKY BUTTONS */}
        <div className="p-4 bg-gradient-to-br from-slate-100 to-indigo-50/50 rounded-2xl border border-dashed border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start text-xs font-bold text-indigo-950">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Live Website Preview (Sticky Bottom-Right Corner)</span>
            </div>
            <p className="text-[11px] text-gray-600">
              {shopName} website par bottom-right me sirf yeh dono sticky buttons dikhayi denge:
            </p>
          </div>

          {/* Mini Mockup Screen Corner */}
          <div className="bg-slate-950 p-3 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center gap-2">
            {config.enabled ? (
              <>
                {config.call && (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                )}
                {config.whatsapp && (
                  <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md border-2 border-white animate-pulse">
                    <MessageCircle className="w-5.5 h-5.5 fill-white" />
                  </div>
                )}
                {!config.whatsapp && !config.call && (
                  <span className="text-[10px] text-gray-400 italic px-2 py-1">Dono Buttons OFF</span>
                )}
              </>
            ) : (
              <span className="text-[10px] text-red-400 font-bold px-2 py-1">Master Disabled (OFF)</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

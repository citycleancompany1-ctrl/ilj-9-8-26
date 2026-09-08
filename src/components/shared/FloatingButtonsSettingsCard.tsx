import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Globe, 
  MapPin, 
  Check, 
  Sliders, 
  ExternalLink, 
  Sparkles,
  CheckCircle2,
  AlertCircle
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
  const [mapsUrl, setMapsUrl] = useState(googleMapsUrl);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync if prop updates
  React.useEffect(() => {
    setConfig(getDefaultFloatingButtons(floatingButtons));
  }, [floatingButtons]);

  React.useEffect(() => {
    setMapsUrl(googleMapsUrl);
  }, [googleMapsUrl]);

  const handleToggle = (key: keyof FloatingButtonsConfig) => {
    const updated: FloatingButtonsConfig = {
      ...config,
      [key]: !config[key],
    };
    setConfig(updated);
    setHasUnsavedChanges(true);
    onUpdate(updated, mapsUrl);
  };

  const handleSaveMapsUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(config, mapsUrl);
    setHasUnsavedChanges(false);
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
                Bottom-Right Floating Circle Buttons (क्विक एक्शन बटन)
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
              Website ke bottom-right corner me WhatsApp, Direct Call, Multi-Language aur Google Map ke circle buttons ko ON/OFF karein.
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
        
        {/* GRID OF THE 4 CIRCLE BUTTON CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* 1. WHATSAPP CIRCLE BUTTON */}
          <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
            config.whatsapp && config.enabled
              ? 'border-emerald-500/50 bg-emerald-50/40 shadow-xs'
              : 'border-gray-200 bg-gray-50/60 opacity-75'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md border-2 border-white">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">1. WhatsApp Button</h4>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    config.whatsapp && config.enabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {config.whatsapp && config.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Grahak 1-click me aapke WhatsApp number par chat shuru kar sakte hain. Order aur inquiry ke liye sabse zyada use hone wala feature.
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

          {/* 2. DIRECT CALL CIRCLE BUTTON */}
          <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
            config.call && config.enabled
              ? 'border-blue-500/50 bg-blue-50/40 shadow-xs'
              : 'border-gray-200 bg-gray-50/60 opacity-75'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md border-2 border-white">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">2. Phone Call Button</h4>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    config.call && config.enabled
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {config.call && config.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Grahak ke phone ka dialer seedha dukaan ke primary mobile number ke sath khulega. Fast verbal inquiry ke liye behtar.
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

          {/* 3. MULTI-LANGUAGE SELECTOR CIRCLE BUTTON */}
          <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
            config.language && config.enabled
              ? 'border-indigo-500/50 bg-indigo-50/40 shadow-xs'
              : 'border-gray-200 bg-gray-50/60 opacity-75'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md border-2 border-white relative">
                <Globe className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[8px] font-black px-1 rounded-full">
                  अ/A
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">3. Multi-Language Button</h4>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    config.language && config.enabled
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {config.language && config.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Grahak apni marzi se Hindi, English, Hinglish, Gujarati, Marathi, Bengali, Tamil, Telugu bhasha chun sakte hain.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={!config.enabled}
              onClick={() => handleToggle('language')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.language && config.enabled ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  config.language && config.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. GOOGLE MAPS LOCATION CIRCLE BUTTON */}
          <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
            config.googleLocation && config.enabled
              ? 'border-red-500/50 bg-red-50/40 shadow-xs'
              : 'border-gray-200 bg-gray-50/60 opacity-75'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md border-2 border-white">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">4. Google Location Button</h4>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    config.googleLocation && config.enabled
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {config.googleLocation && config.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Grahak Google Maps par dukaan ki exact location aur GPS navigation 1-click me open kar sakte hain.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={!config.enabled}
              onClick={() => handleToggle('googleLocation')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.googleLocation && config.enabled ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  config.googleLocation && config.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

        {/* GOOGLE MAPS URL CONFIGURATION FIELD */}
        <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Dukaan Google Maps Share Link (Optional)</span>
            </div>
            {mapsUrl && (
              <a 
                href={mapsUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <p className="text-[11px] text-gray-500">
            Agar aapne Google Maps par dukaan register ki hai toh uska share link yahan paste karein (e.g. <code>https://maps.app.goo.gl/...</code>). Agar link khali hoga, toh dukaan ke address aur city ke sath Google Maps search auto-open hoga.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={mapsUrl}
              onChange={(e) => {
                setMapsUrl(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="https://maps.app.goo.gl/..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleSaveMapsUrl}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Save Link
            </button>
          </div>
        </div>

        {/* LIVE VISUAL PREVIEW OF THE CIRCLE BUTTONS */}
        <div className="p-4 bg-gradient-to-br from-slate-100 to-indigo-50/50 rounded-2xl border border-dashed border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start text-xs font-bold text-indigo-950">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Live Website Preview (Bottom-Right Corner)</span>
            </div>
            <p className="text-[11px] text-gray-600">
              Yeh buttons live {shopName} website par isi tarah floating stack me dikhayi denge:
            </p>
          </div>

          {/* Mini Mockup Screen Corner */}
          <div className="bg-slate-950 p-2.5 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center gap-1.5">
            {config.enabled ? (
              <>
                {config.googleLocation && (
                  <div className="w-7.5 h-7.5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                )}
                {config.language && (
                  <div className="w-7.5 h-7.5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md border-2 border-white relative">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[6px] font-black px-1 rounded-full">
                      अ
                    </span>
                  </div>
                )}
                {config.call && (
                  <div className="w-7.5 h-7.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                )}
                {config.whatsapp && (
                  <div className="w-8.5 h-8.5 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md border-2 border-white animate-pulse">
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </div>
                )}
                {!config.whatsapp && !config.call && !config.language && !config.googleLocation && (
                  <span className="text-[10px] text-gray-400 italic px-2 py-1">All 4 Buttons OFF</span>
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

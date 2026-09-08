import React, { useState } from 'react';
import {
  Palette,
  Check,
  Sparkles,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  ExternalLink,
  Wand2,
} from 'lucide-react';
import { Shop } from '../../types';
import { INDIAN_LAYOUT_THEMES, IndianTheme, getThemeById } from '../../data/indianThemes';
import { ThemeLivePreviewModal } from '../modals/ThemeLivePreviewModal';

interface WebsiteThemesManagerProps {
  shop: Shop;
  onUpdateShop: (updated: Shop) => void;
  onPreviewShop?: () => void;
  showToast: (msg: string) => void;
}

export const WebsiteThemesManager: React.FC<WebsiteThemesManagerProps> = ({
  shop,
  onUpdateShop,
  onPreviewShop,
  showToast,
}) => {
  const currentThemeId = shop.themeId || shop.templateId || 'bharat-royal';
  const [selectedThemeId, setSelectedThemeId] = useState<string>(currentThemeId);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [previewModalTheme, setPreviewModalTheme] = useState<IndianTheme | null>(null);
  const [livePreviewTheme, setLivePreviewTheme] = useState<IndianTheme | null>(null);

  const activeTheme = getThemeById(currentThemeId);

  // Apply Theme Handler
  const handleApplyTheme = (theme: IndianTheme) => {
    const updatedShop: Shop = {
      ...shop,
      themeId: theme.id,
      templateId: theme.id, // keep templateId in sync
      updatedAt: new Date().toISOString(),
    };

    onUpdateShop(updatedShop);
    setSelectedThemeId(theme.id);
    showToast(`🎉 "${theme.name} (${theme.hindiName})" Theme successfully live ho gayi hai! 100% Free.`);
  };

  const filteredThemes = INDIAN_LAYOUT_THEMES.filter((theme) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'HERITAGE') {
      return ['bharat-royal', 'kashi-heritage', 'ayodhya-divine'].includes(theme.id);
    }
    if (filterCategory === 'MODERN') {
      return ['deccan-neo', 'himalaya-pure', 'bombay-modern'].includes(theme.id);
    }
    if (filterCategory === 'FESTIVE') {
      return ['utsav-vibrant', 'jaipur-haveli'].includes(theme.id);
    }
    if (filterCategory === 'NATURAL') {
      return ['kerala-palms', 'ganga-serene'].includes(theme.id);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-7 border border-amber-500/30 shadow-xl relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-amber-400">
          <Palette className="w-56 h-56" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                10 Indian Layout Themes • 100% FREE
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" /> No Coding Required
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Website Themes & Animated Layouts
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Apni dukaan ke liye khas Bharat ke rangon aur sanskriti se prerit <strong>10 unique themes</strong>. Har theme me alag rang, typography, card shapes aur eye-catching animations shamil hain jo aapke customers ko aakarshit karengi.
            </p>
          </div>

          {/* Active Theme Highlight Card */}
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-4 shrink-0 shadow-lg min-w-[260px] space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>Currently Live Theme</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                {activeTheme.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-black text-sm text-white">{activeTheme.name}</div>
                <div className="text-[11px] text-amber-300 font-bold">{activeTheme.hindiName}</div>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 truncate">
              {activeTheme.animationLabel}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => setLivePreviewTheme(activeTheme)}
                className="py-2 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Open Interactive Responsive Theme Previewer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              {onPreviewShop && (
                <button
                  type="button"
                  onClick={onPreviewShop}
                  className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer border border-slate-700"
                  title="Open live public URL in current tab"
                >
                  <ExternalLink className="w-3 h-3 text-gray-300" />
                  <span>Live Link</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories / Filter Pill Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800/80 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase shrink-0 mr-1">
            Filter Themes:
          </span>
          {[
            { id: 'ALL', label: 'All 10 Themes' },
            { id: 'HERITAGE', label: 'Royal & Heritage (3)' },
            { id: 'MODERN', label: 'Modern & Tech (3)' },
            { id: 'FESTIVE', label: 'Festive & Boutique (2)' },
            { id: 'NATURAL', label: 'Nature & Wellness (2)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-800/80 text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. THEMES GRID (10 UNIQUE THEMES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredThemes.map((theme, idx) => {
          const isCurrentlyActive = currentThemeId === theme.id;

          return (
            <div
              key={theme.id}
              className={`bg-white rounded-2xl border-2 transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl ${
                isCurrentlyActive
                  ? 'border-amber-500 ring-2 ring-amber-400/30'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Card Header with Color & Badges */}
              <div className="p-5 pb-3 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-gray-400">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                        {theme.name}
                      </h3>
                    </div>
                    <div className="text-xs font-bold text-amber-700 flex items-center gap-1">
                      <span>{theme.hindiName}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[11px] text-gray-500 font-normal">{theme.tagline}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                      FREE ₹0
                    </span>
                    {isCurrentlyActive && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3 h-3" /> Live
                      </span>
                    )}
                  </div>
                </div>

                {/* ANIMATED PREVIEW MINI-CONTAINER - CLICKABLE FOR LIVE PREVIEW */}
                <div
                  onClick={() => setLivePreviewTheme(theme)}
                  className={`rounded-xl p-3 border transition-all relative overflow-hidden ${theme.cardBorder} ${theme.cardRadius} bg-gradient-to-br ${theme.bgGradient} cursor-pointer hover:ring-2 hover:ring-amber-400 group/box`}
                  title="Click for full interactive live preview"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${theme.accentBadgeBg} flex items-center gap-1`}>
                      <Eye className="w-2.5 h-2.5" />
                      <span>{theme.animationLabel}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {theme.previewColorSwatches.map((c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Simulated Store Mockup Bar */}
                  <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-gray-100 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800 truncate">{shop.businessName}</span>
                      <span className="font-mono font-black text-amber-700">₹999</span>
                    </div>
                    {/* Themed Mock Button with active animation class */}
                    <button
                      type="button"
                      className={`w-full py-1.5 px-2 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 ${theme.buttonGradient} ${theme.animationClass}`}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Live Animated Button</span>
                    </button>
                  </div>
                  
                  {/* Subtle hover prompt */}
                  <div className="mt-1.5 text-[9px] text-center font-bold text-slate-600 bg-white/70 py-0.5 rounded">
                    ⚡ Tap to Open Interactive Live Preview
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  {theme.description}
                </p>

                {/* Recommended Categories */}
                <div className="text-[11px] text-gray-500 bg-gray-50 rounded-lg p-2 border border-gray-100">
                  <span className="font-bold text-slate-700">Best Suited For: </span>
                  <span>{theme.categoryFit}</span>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {theme.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1 text-[11px] text-slate-700">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLivePreviewTheme(theme)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  title="Test on Mobile, Tablet & Desktop"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-700" />
                  <span>Live Preview</span>
                </button>

                {isCurrentlyActive ? (
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs cursor-default"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied ✓</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApplyTheme(theme)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-98 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Apply Free</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. INSPECT THEME MODAL */}
      {previewModalTheme && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in">
            {/* Modal Header */}
            <div
              className={`p-5 text-white flex items-center justify-between bg-gradient-to-r ${previewModalTheme.headerGradient}`}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  {previewModalTheme.animationLabel}
                </span>
                <h3 className="text-xl font-black mt-1 font-['Outfit',sans-serif]">
                  {previewModalTheme.name} ({previewModalTheme.hindiName})
                </h3>
                <p className="text-xs text-white/80">{previewModalTheme.tagline}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalTheme(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-gray-50">
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Visual Palette & Colors
                </span>
                <div className="flex items-center gap-3">
                  {previewModalTheme.previewColorSwatches.map((col, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-10 h-10 rounded-xl shadow-xs border border-gray-200"
                        style={{ backgroundColor: col }}
                      />
                      <span className="text-[10px] font-mono text-gray-500 font-bold">{col}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Theme Details
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {previewModalTheme.description}
                </p>
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-700 mb-1">Theme Features:</div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {previewModalTheme.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <span className="font-bold">Cost to Merchant: ₹0 (100% Free Forever)</span>
                <span className="font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded">All Features Included</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const targetTheme = previewModalTheme;
                  setPreviewModalTheme(null);
                  setLivePreviewTheme(targetTheme);
                }}
                className="px-4 py-2 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Full Interactive Preview</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewModalTheme(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-slate-800 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleApplyTheme(previewModalTheme);
                    setPreviewModalTheme(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Apply "{previewModalTheme.name}" Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FULL INTERACTIVE LIVE STORE PREVIEW MODAL */}
      {livePreviewTheme && (
        <ThemeLivePreviewModal
          isOpen={!!livePreviewTheme}
          onClose={() => setLivePreviewTheme(null)}
          initialTheme={livePreviewTheme}
          shop={shop}
          onApplyTheme={handleApplyTheme}
        />
      )}
    </div>
  );
};

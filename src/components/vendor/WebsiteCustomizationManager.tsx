import React, { useState, useMemo, useEffect } from 'react';
import {
  Palette,
  Layout,
  Image as ImageIcon,
  MessageCircle,
  ShieldCheck,
  ToggleLeft,
  Check,
  Upload,
  Trash2,
  ExternalLink,
  Sparkles,
  Save,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Clock,
  MapPin,
  HelpCircle,
  Sliders,
  CheckCircle2,
  Layers,
  ArrowRight,
  Share2,
  Globe,
  Plus
} from 'lucide-react';
import { Shop, FloatingButtonsConfig, ShopSectionsConfig } from '../../types';
import { INDIAN_LAYOUT_THEMES, IndianTheme, getThemeById } from '../../data/indianThemes';
import { fileToBase64 } from '../../utils/mediaUpload';
import { FloatingButtonsSettingsCard } from '../shared/FloatingButtonsSettingsCard';
import { getShopTerminology } from '../../utils/categoryTerminology';
import { getDefaultSectionsConfig } from '../../utils/sectionDefaults';

export type CustomizationTab = 'themes' | 'header' | 'banners' | 'floating' | 'footer' | 'visibility';

interface WebsiteCustomizationManagerProps {
  shop: Shop;
  onUpdateShop: (updated: Shop) => void;
  onPreviewShop?: () => void;
  showToast: (msg: string) => void;
  initialTab?: CustomizationTab;
}

export const WebsiteCustomizationManager: React.FC<WebsiteCustomizationManagerProps> = ({
  shop,
  onUpdateShop,
  onPreviewShop,
  showToast,
  initialTab = 'themes',
}) => {
  const [activeTab, setActiveTab] = useState<CustomizationTab>(initialTab);
  const [localShop, setLocalShop] = useState<Shop>(shop);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync if parent shop changes (only if different shop or incoming is strictly newer)
  useEffect(() => {
    if (shop) {
      const incomingTime = new Date(shop.updatedAt || 0).getTime();
      const localTime = new Date(localShop.updatedAt || 0).getTime();
      if (shop.id !== localShop.id || incomingTime > localTime) {
        setLocalShop(shop);
      }
    }
  }, [shop]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const terminology = useMemo(() => getShopTerminology(localShop), [localShop]);
  const activeTheme = useMemo(
    () => getThemeById(localShop.themeId || localShop.templateId || 'bharat-royal'),
    [localShop.themeId, localShop.templateId]
  );

  const handleSave = (updated?: Shop) => {
    setIsSaving(true);
    const toSave = updated || localShop;
    const finalShop = {
      ...toSave,
      updatedAt: new Date().toISOString(),
    };
    setLocalShop(finalShop);
    onUpdateShop(finalShop);
    setHasChanges(false);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Website Customization safalta se save ho gaya! ✅');
    }, 400);
  };

  const handleVisitStore = () => {
    handleSave(localShop);
    if (onPreviewShop) {
      onPreviewShop();
    }
  };

  const updateField = <K extends keyof Shop>(field: K, value: Shop[K]) => {
    const updated = {
      ...localShop,
      [field]: value,
      updatedAt: new Date().toISOString(),
    };
    setLocalShop(updated);
    setHasChanges(true);
    onUpdateShop(updated);
  };

  // Logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file, 400, 400);
      updateField('logoUrl', base64);
      showToast('Store Logo update aur save ho gaya! 📸');
    } catch {
      alert('Logo upload mein samasya aayi.');
    } finally {
      e.target.value = '';
    }
  };

  // Desktop Banner upload
  const handleDesktopBannerUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file, 1000, 500);
      const current = [...(localShop.desktopBanners || localShop.banners || [])];
      while (current.length <= index) current.push('');
      current[index] = base64;
      const updated = {
        ...localShop,
        desktopBanners: current,
        banners: current,
        updatedAt: new Date().toISOString(),
      };
      setLocalShop(updated);
      setHasChanges(true);
      onUpdateShop(updated);
      showToast(`Desktop Banner #${index + 1} safalta se save ho gaya! 📸`);
    } catch {
      alert('Banner upload error');
    } finally {
      e.target.value = '';
    }
  };

  // Mobile Banner upload
  const handleMobileBannerUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file, 600, 800);
      const current = [...(localShop.mobileBanners || [])];
      while (current.length <= index) current.push('');
      current[index] = base64;
      const updated = {
        ...localShop,
        mobileBanners: current,
        updatedAt: new Date().toISOString(),
      };
      setLocalShop(updated);
      setHasChanges(true);
      onUpdateShop(updated);
      showToast(`Mobile Banner #${index + 1} safalta se save ho gaya! 📸`);
    } catch {
      alert('Banner upload error');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveDesktopBanner = (index: number) => {
    const current = [...(localShop.desktopBanners || localShop.banners || [])];
    current.splice(index, 1);
    const updated = {
      ...localShop,
      desktopBanners: current,
      banners: current,
      updatedAt: new Date().toISOString(),
    };
    setLocalShop(updated);
    setHasChanges(true);
    onUpdateShop(updated);
    showToast(`Desktop Banner #${index + 1} hata diya gaya.`);
  };

  const handleRemoveMobileBanner = (index: number) => {
    const current = [...(localShop.mobileBanners || [])];
    current.splice(index, 1);
    const updated = {
      ...localShop,
      mobileBanners: current,
      updatedAt: new Date().toISOString(),
    };
    setLocalShop(updated);
    setHasChanges(true);
    onUpdateShop(updated);
    showToast(`Mobile Banner #${index + 1} hata diya gaya.`);
  };

  // Section visibility toggle
  const handleToggleSectionVisibility = (sectionKey: keyof ShopSectionsConfig) => {
    const currentConfig = localShop.sectionsConfig || getDefaultSectionsConfig();
    const sectionObj = currentConfig[sectionKey];
    if (!sectionObj) return;

    const updatedConfig: ShopSectionsConfig = {
      ...currentConfig,
      [sectionKey]: {
        ...sectionObj,
        enabled: !sectionObj.enabled,
      },
    };

    const updated = {
      ...localShop,
      sectionsConfig: updatedConfig,
    };
    setLocalShop(updated);
    setHasChanges(true);
    onUpdateShop(updated);
  };

  // Default trust badges if none exist
  const trustBadgesList = localShop.trustBadges || [
    { id: 'b1', title: '100% Genuine Utpad', subtitle: 'Purity & Quality Guaranteed', icon: 'ShieldCheck' },
    { id: 'b2', title: 'Direct Store Rate', subtitle: 'No Middleman Commission', icon: 'CheckCircle2' },
    { id: 'b3', title: 'Fast WhatsApp Seva', subtitle: 'Direct Merchant Support', icon: 'MessageCircle' },
    { id: 'b4', title: 'Surakshit UPI Payment', subtitle: 'PhonePe, GPay, Paytm Accepted', icon: 'Sparkles' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-indigo-400">
          <Palette className="w-56 h-56" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Live Website Customizer
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3" /> No Coding Required
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Website Customization (वेबसाइट कस्टमाइज़ेशन)
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Apni dukaan ki website ka visual look, themes, branding colors, top announcement bar, header, hero banner, floating action buttons aur footer trust badges asani se customize karein.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onPreviewShop && (
              <button
                type="button"
                onClick={handleVisitStore}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                title="Live storefront preview"
              >
                <ExternalLink className="w-4 h-4 text-orange-400" />
                <span>Visit Store</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-600/20 ${
                hasChanges
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white ring-2 ring-orange-400 animate-pulse'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : hasChanges ? 'Save Changes *' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Notice: Preserved layout discipline */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Product & Catalog Grid Style and Section Layout Flow are locked and preserved automatically.</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">Shop ID: {localShop.shopId}</span>
        </div>
      </div>

      {/* 2. NAVIGATION TABS STRIP */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'themes', label: 'Themes & Brand Colors', icon: Palette, badge: '10 Themes' },
          { id: 'header', label: 'Header & Top Bar', icon: Layout },
          { id: 'banners', label: 'Hero Banner & Media', icon: ImageIcon },
          { id: 'floating', label: 'Floating Buttons', icon: MessageCircle, badge: 'WhatsApp/Call' },
          { id: 'footer', label: 'Footer & Trust Badges', icon: ShieldCheck },
          { id: 'visibility', label: 'Section Visibility', icon: ToggleLeft, badge: '19 Sections' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as CustomizationTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/20 ring-1 ring-orange-400/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT PANELS */}

      {/* ======================================================== */}
      {/* TAB 1: THEMES & BRAND COLORS */}
      {/* ======================================================== */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          {/* Active Theme Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md shrink-0"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                {activeTheme.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Currently Active Theme:</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                  {activeTheme.name} <span className="text-orange-600 text-sm font-bold">({activeTheme.hindiName})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeTheme.description}</p>
              </div>
            </div>

            {onPreviewShop && (
              <button
                type="button"
                onClick={handleVisitStore}
                className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center shrink-0"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Theme</span>
              </button>
            )}
          </div>

          {/* 10 Indian Layout Themes Grid */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                1. Select Layout Theme (10 Indian Cultural Layouts - 100% Free)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Khas Bharat ke alag-alag kshetron se prerit layouts. Koi bhi theme select karein aur instant live karein.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {INDIAN_LAYOUT_THEMES.map((thm) => {
                const isSelected = (localShop.themeId || localShop.templateId || 'bharat-royal') === thm.id;
                return (
                  <div
                    key={thm.id}
                    onClick={() => {
                      const updated = {
                        ...localShop,
                        themeId: thm.id,
                        templateId: thm.id,
                      };
                      setLocalShop(updated);
                      setHasChanges(true);
                      onUpdateShop(updated);
                      showToast(`"${thm.name}" theme chuni gayi! Live store par turant update ho gaya.`);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 select-none ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 shadow-sm ring-1 ring-orange-400'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-black text-white text-[11px] shadow-xs"
                          style={{ backgroundColor: thm.primaryColor }}
                        >
                          {thm.name.slice(0, 1)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 font-['Outfit',sans-serif]">{thm.name}</h4>
                          <span className="text-[10px] font-bold text-orange-600">{thm.hindiName}</span>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="p-1 rounded-full bg-orange-600 text-white shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Select</span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2">{thm.description}</p>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
                      <span className="text-[10px] text-slate-400 font-semibold">Palette:</span>
                      <span className="w-3.5 h-3.5 rounded-full shadow-2xs" style={{ backgroundColor: thm.primaryColor }} />
                      <span className="w-3.5 h-3.5 rounded-full shadow-2xs" style={{ backgroundColor: thm.accentColor }} />
                      <span className="w-3.5 h-3.5 rounded-full shadow-2xs border border-gray-200" style={{ backgroundColor: thm.accentBadgeBg }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Palette, Font & Button Shapes */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                2. Brand Color Palette & Styling
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Buttons, highlights aur badges ke liye primary color choose karein.
              </p>
            </div>

            {/* Color swatches */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Brand Accent Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {[
                  { id: 'saffron', name: 'Saffron Gold', bg: 'bg-amber-500', hex: '#f59e0b' },
                  { id: 'emerald', name: 'Emerald Green', bg: 'bg-emerald-600', hex: '#059669' },
                  { id: 'royal', name: 'Royal Indigo', bg: 'bg-indigo-600', hex: '#4f46e5' },
                  { id: 'rose', name: 'Jaipuri Rose', bg: 'bg-rose-600', hex: '#e11d48' },
                  { id: 'gold', name: 'Warm Marigold', bg: 'bg-yellow-500', hex: '#eab308' },
                  { id: 'maroon', name: 'Vedic Maroon', bg: 'bg-red-800', hex: '#991b1b' },
                ].map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => updateField('colorTheme', col.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      localShop.colorTheme === col.id
                        ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900 shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${col.bg} shrink-0 shadow-xs`} />
                    <span className="truncate">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font & Button Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Typography Style (Font)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'outfit', label: 'Outfit (Modern)' },
                    { id: 'sans', label: 'Sans (Clean)' },
                    { id: 'serif', label: 'Serif (Classic)' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updateField('fontStyle', f.id as any)}
                      className={`py-2 px-2.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                        (localShop.fontStyle || 'outfit') === f.id
                          ? 'border-orange-600 bg-orange-50 text-orange-700 font-black'
                          : 'border-gray-200 text-slate-700 hover:bg-gray-50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Button Corner Shape
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'rounded', label: 'Rounded (8px)' },
                    { id: 'pill', label: 'Pill (Curved)' },
                    { id: 'sharp', label: 'Sharp (Square)' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => updateField('buttonStyle', b.id as any)}
                      className={`py-2 px-2.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                        (localShop.buttonStyle || 'rounded') === b.id
                          ? 'border-orange-600 bg-orange-50 text-orange-700 font-black'
                          : 'border-gray-200 text-slate-700 hover:bg-gray-50'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Catalog Mode / Hide Prices Toggle */}
            <div className="pt-2 border-t border-gray-100">
              <div
                onClick={() => {
                  const nextVal = !localShop.hideAllPrices;
                  const updated: Shop = {
                    ...localShop,
                    hideAllPrices: nextVal,
                    isCatalogOnly: nextVal,
                    websiteMode: nextVal ? ('CATALOG' as any) : ('ECOMMERCE' as any),
                  };
                  setLocalShop(updated);
                  setHasChanges(true);
                  onUpdateShop(updated);
                  showToast(nextVal ? 'Catalogue Mode ON: Prices hide ho gaye!' : 'Online Store Mode ON: Prices dikhenge!');
                }}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  localShop.hideAllPrices
                    ? 'bg-amber-100/80 border-amber-500 ring-2 ring-amber-400/40'
                    : 'bg-amber-50/50 border-amber-200 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      localShop.hideAllPrices ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <span>Catalogue Mode (Hide All Prices)</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          localShop.hideAllPrices ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-900'
                        }`}
                      >
                        {localShop.hideAllPrices ? 'ACTIVE' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Sabhi products ki price chhupa kar WhatsApp "Price on Request / कीमत पूछें" inquiry button dikhayein.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={Boolean(localShop.hideAllPrices)}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    const updated: Shop = {
                      ...localShop,
                      hideAllPrices: nextVal,
                      isCatalogOnly: nextVal,
                      websiteMode: nextVal ? ('CATALOG' as any) : ('ECOMMERCE' as any),
                    };
                    setLocalShop(updated);
                    setHasChanges(true);
                    onUpdateShop(updated);
                  }}
                  className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: HEADER & TOP BAR */}
      {/* ======================================================== */}
      {activeTab === 'header' && (
        <div className="space-y-6">
          {/* Top Announcement Bar Customization */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  1. Top Announcement / Notice Bar (वेबसाइट का सबसे ऊपर का नोटिस बार)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Offers, discounts, festive greetings ya delivery notification ko website ke sabse upar dikhayein.
                </p>
              </div>

              {/* Toggle Switch */}
              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                <span className="text-xs font-bold text-slate-600">
                  {localShop.announcementBar?.enabled ? 'Active' : 'Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={Boolean(localShop.announcementBar?.enabled)}
                  onChange={(e) => {
                    const current = localShop.announcementBar || {
                      enabled: false,
                      text: '⚡ Special Offer: Direct Store Discount on WhatsApp Orders | Free Local Delivery!',
                      bgColor: '#ea580c',
                    };
                    updateField('announcementBar', {
                      ...current,
                      enabled: e.target.checked,
                    });
                  }}
                  className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Live Preview of Announcement Bar */}
            {localShop.announcementBar?.enabled && (
              <div
                className="p-2.5 rounded-xl text-xs font-bold text-center text-white flex items-center justify-center gap-2 shadow-xs transition-colors"
                style={{ backgroundColor: localShop.announcementBar.bgColor || '#ea580c' }}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{localShop.announcementBar.text || 'Apna announcement text yahan type karein...'}</span>
              </div>
            )}

            {/* Announcement Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Announcement Text (संदेश)
                </label>
                <input
                  type="text"
                  value={localShop.announcementBar?.text || ''}
                  onChange={(e) => {
                    const current = localShop.announcementBar || {
                      enabled: true,
                      text: '',
                      bgColor: '#ea580c',
                    };
                    updateField('announcementBar', {
                      ...current,
                      text: e.target.value,
                    });
                  }}
                  placeholder="e.g. ⚡ Festival Dhamaka: Flat 10% Off On Orders Above ₹999 | Free Delivery"
                  className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Bar Background Color
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { name: 'Orange', hex: '#ea580c' },
                    { name: 'Emerald', hex: '#059669' },
                    { name: 'Indigo', hex: '#4f46e5' },
                    { name: 'Amber', hex: '#d97706' },
                    { name: 'Dark', hex: '#0f172a' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        const current = localShop.announcementBar || {
                          enabled: true,
                          text: 'Special store announcement',
                          bgColor: c.hex,
                        };
                        updateField('announcementBar', {
                          ...current,
                          bgColor: c.hex,
                        });
                      }}
                      className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer ${
                        (localShop.announcementBar?.bgColor || '#ea580c') === c.hex
                          ? 'border-slate-900 scale-110 shadow-xs'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Business Name, Tagline & Logo */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                2. Store Branding, Logo & Tagline
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Website ke header me display hone wala logo, dukan ka naam aur tagline.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
              {/* Logo Preview & Upload */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                <label className="block text-xs font-bold text-slate-700">Store Logo</label>
                <div className="relative group">
                  <img
                    src={localShop.logoUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                    alt={localShop.businessName}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-orange-500/40 shadow-sm bg-white p-1"
                  />
                  <label className="absolute inset-0 bg-black/50 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[10px] font-bold">
                    <Upload className="w-5 h-5 mb-1" />
                    <span>Upload Logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
                <label className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Image</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>

              {/* Business Name & Tagline Inputs */}
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Store Business Name (दुकान / ब्रांड का नाम)
                  </label>
                  <input
                    type="text"
                    value={localShop.businessName || ''}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    className="w-full text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Store Tagline / Slogan (स्लोगन या टैगलाइन)
                  </label>
                  <input
                    type="text"
                    value={localShop.tagline || ''}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    placeholder="e.g. Bharat's Trusted Traditional Store • 100% Direct Price"
                    className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Header Quick Phone
                    </label>
                    <input
                      type="text"
                      value={localShop.phone || ''}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Header Working Hours
                    </label>
                    <input
                      type="text"
                      value={localShop.workingHours || ''}
                      onChange={(e) => updateField('workingHours', e.target.value)}
                      placeholder="e.g. 9:00 AM - 9:00 PM (Daily)"
                      className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: HERO BANNER & MEDIA */}
      {/* ======================================================== */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Master Hero Banner Toggle */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Hero Banner Slider Carousel (प्रमोशनल बैनर स्लाइडर)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Website ke top par chalne wala banner slider. Isko ON ya OFF kar sakte hain.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <span className="text-xs font-bold text-slate-600">
                {localShop.heroBannerEnabled !== false ? 'ON (Active)' : 'OFF (Hidden)'}
              </span>
              <input
                type="checkbox"
                checked={localShop.heroBannerEnabled !== false}
                onChange={(e) => updateField('heroBannerEnabled', e.target.checked)}
                className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Desktop Banners (Up to 4) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Desktop Hero Banners (Maximum 4 Slides)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Computer aur laptop screen ke liye wide horizontal banners (Recommended: 1920 x 600 px).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((idx) => {
                const bannerList = localShop.desktopBanners || localShop.banners || [];
                const img = bannerList[idx];

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col justify-between gap-2.5 relative group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Slide #{idx + 1}</span>
                      {img ? (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">Empty</span>
                      )}
                    </div>

                    <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-200 border border-gray-300 relative flex items-center justify-center">
                      {img ? (
                        <img src={img} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-gray-400 p-2">
                          <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span className="text-[10px]">No banner</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <label className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-gray-200 text-[11px] font-bold text-center cursor-pointer transition-colors">
                        <Upload className="w-3 h-3 inline mr-1" />
                        <span>{img ? 'Replace' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleDesktopBannerUpload(idx, e)}
                          className="hidden"
                        />
                      </label>
                      {img && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDesktopBanner(idx)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                          title="Remove Banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Banners (Up to 3) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Mobile Responsive Banners (स्मार्टफोन बैनर)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mobile users ke liye square ya vertical banners (Recommended: 800 x 800 px).
                </p>
              </div>

              {/* Use Desktop on Mobile Toggle */}
              <label className="flex items-center gap-2 cursor-pointer shrink-0 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                <input
                  type="checkbox"
                  checked={Boolean(localShop.useDesktopBannerOnMobile)}
                  onChange={(e) => updateField('useDesktopBannerOnMobile', e.target.checked)}
                  className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-orange-900">Use Desktop Banner on Mobile</span>
              </label>
            </div>

            {!localShop.useDesktopBannerOnMobile && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {[0, 1, 2].map((idx) => {
                  const mobileList = localShop.mobileBanners || [];
                  const img = mobileList[idx];

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col justify-between gap-2.5 relative group"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Mobile Slide #{idx + 1}</span>
                        {img ? (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Empty</span>
                        )}
                      </div>

                      <div className="w-full h-36 rounded-xl overflow-hidden bg-gray-200 border border-gray-300 relative flex items-center justify-center">
                        {img ? (
                          <img src={img} alt={`Mobile Banner ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-gray-400 p-2">
                            <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                            <span className="text-[10px]">No mobile banner</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <label className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-gray-200 text-[11px] font-bold text-center cursor-pointer transition-colors">
                          <Upload className="w-3 h-3 inline mr-1" />
                          <span>{img ? 'Replace' : 'Upload'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMobileBannerUpload(idx, e)}
                            className="hidden"
                          />
                        </label>
                        {img && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMobileBanner(idx)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                            title="Remove Banner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Banner Title & Subtitle Override */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Banner Heading & Subtitle Overlays
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Headline / Banner Title
                </label>
                <input
                  type="text"
                  value={localShop.bannerTitle || ''}
                  onChange={(e) => updateField('bannerTitle', e.target.value)}
                  placeholder="e.g. Welcome to Our Official Digital Store"
                  className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Subtitle / Promo Tagline
                </label>
                <input
                  type="text"
                  value={localShop.bannerSubtitle || ''}
                  onChange={(e) => updateField('bannerSubtitle', e.target.value)}
                  placeholder="e.g. Pure Quality • Direct Merchant Guarantee • Instant WhatsApp Order"
                  className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: FLOATING ACTION BUTTONS */}
      {/* ======================================================== */}
      {activeTab === 'floating' && (
        <div className="space-y-6">
          <FloatingButtonsSettingsCard
            floatingButtons={localShop.floatingButtons}
            googleMapsUrl={localShop.googleMapsUrl}
            shopName={localShop.businessName}
            onUpdate={(updatedButtons, updatedMapsUrl) => {
              const updated = {
                ...localShop,
                floatingButtons: updatedButtons,
                googleMapsUrl: updatedMapsUrl !== undefined ? updatedMapsUrl : localShop.googleMapsUrl,
              };
              setLocalShop(updated);
              setHasChanges(true);
              showToast('Floating Circle Action Buttons update ho gaye!');
            }}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: FOOTER & TRUST BADGES */}
      {/* ======================================================== */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          {/* Trust Badges */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                1. Store Trust Badges & Guarantees (भरोसे के बैज)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customer trust badhane ke liye 4 prumukh guarantees jo website par dikhai deti hain.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {trustBadgesList.map((badge, bIdx) => (
                <div key={badge.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                      #{bIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={badge.title}
                      onChange={(e) => {
                        const updatedBadges = [...trustBadgesList];
                        updatedBadges[bIdx] = { ...updatedBadges[bIdx], title: e.target.value };
                        updateField('trustBadges', updatedBadges);
                      }}
                      className="flex-1 text-xs font-bold bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-orange-500 focus:outline-hidden"
                    />
                  </div>
                  <input
                    type="text"
                    value={badge.subtitle || ''}
                    onChange={(e) => {
                      const updatedBadges = [...trustBadgesList];
                      updatedBadges[bIdx] = { ...updatedBadges[bIdx], subtitle: e.target.value };
                      updateField('trustBadges', updatedBadges);
                    }}
                    placeholder="Sub-description"
                    className="w-full text-[11px] text-slate-600 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer About & Copyright */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                2. Footer About Description & Copyright Notice
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Website ke bottom footer section me aane wali jankari.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Footer Short About Story (संक्षिप्त परिचय)
              </label>
              <textarea
                rows={3}
                value={localShop.aboutStory || ''}
                onChange={(e) => updateField('aboutStory', e.target.value)}
                placeholder="A brief 2-3 line description of your store and dedication to customers..."
                className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Established Year (स्थापना वर्ष)
                </label>
                <input
                  type="text"
                  value={localShop.establishedYear || '2024'}
                  onChange={(e) => updateField('establishedYear', e.target.value)}
                  className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Store Email in Footer
                </label>
                <input
                  type="email"
                  value={localShop.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Social Media Links (सोशल मीडिया हैंडल्स)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500">Instagram Handle/URL:</span>
                  <input
                    type="text"
                    value={localShop.socialLinks?.instagram || ''}
                    onChange={(e) =>
                      updateField('socialLinks', {
                        ...(localShop.socialLinks || {}),
                        instagram: e.target.value,
                      })
                    }
                    placeholder="https://instagram.com/yourshop"
                    className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 mt-1 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500">Facebook Page URL:</span>
                  <input
                    type="text"
                    value={localShop.socialLinks?.facebook || ''}
                    onChange={(e) =>
                      updateField('socialLinks', {
                        ...(localShop.socialLinks || {}),
                        facebook: e.target.value,
                      })
                    }
                    placeholder="https://facebook.com/yourshop"
                    className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 mt-1 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500">YouTube Channel URL:</span>
                  <input
                    type="text"
                    value={localShop.socialLinks?.youtube || ''}
                    onChange={(e) =>
                      updateField('socialLinks', {
                        ...(localShop.socialLinks || {}),
                        youtube: e.target.value,
                      })
                    }
                    placeholder="https://youtube.com/@yourshop"
                    className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 mt-1 focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: SECTION VISIBILITY (SHOW / HIDE) */}
      {/* ======================================================== */}
      {activeTab === 'visibility' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Modular Website Sections Visibility (19 Sections)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kisi bhi section ko website par ON (Show) ya OFF (Hide) karein. Layout flow aur grid styling waise hi surakshit rahenge.
              </p>
            </div>

            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0 self-start sm:self-center">
              Grid Style & Order Preserved
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(
              [
                { key: 'heroBanner', label: terminology.sections.heroBanner.name, desc: 'Top promotional slides' },
                { key: 'hero', label: terminology.sections.hero.name, desc: 'Store hero heading & action' },
                { key: 'about', label: terminology.sections.about.name, desc: 'Store history & merchant story' },
                { key: 'features', label: terminology.sections.features.name, desc: 'Why choose us & trust points' },
                { key: 'category', label: terminology.sections.category.name, desc: 'Photo categories carousel' },
                { key: 'services', label: terminology.sections.services.name, desc: 'Store service offerings' },
                { key: 'products', label: terminology.sections.products.name, desc: 'Product items showcase' },
                { key: 'courses', label: terminology.sections.courses.name, desc: 'Training courses & batches' },
                { key: 'videos', label: terminology.sections.videos.name, desc: 'YouTube reels & video guides' },
                { key: 'offers', label: terminology.sections.offers.name, desc: 'Discounts & coupon banners' },
                { key: 'gallery', label: terminology.sections.gallery.name, desc: 'Photo gallery grid' },
                { key: 'portfolio', label: terminology.sections.portfolio.name, desc: 'Work portfolio & projects' },
                { key: 'team', label: terminology.sections.team.name, desc: 'Store staff & team members' },
                { key: 'faq', label: terminology.sections.faq.name, desc: 'Questions & answers' },
                { key: 'cta', label: terminology.sections.cta.name, desc: 'Direct WhatsApp call-to-action' },
                { key: 'contact', label: terminology.sections.contact.name, desc: 'Phone, map & contact form' },
                { key: 'socialMedia', label: terminology.sections.socialMedia.name, desc: 'Social channels strip' },
                { key: 'blog', label: terminology.sections.blog.name, desc: 'Helpful articles & news' },
                { key: 'footer', label: terminology.sections.footer.name, desc: 'Bottom links & copyright' },
              ] as Array<{ key: keyof ShopSectionsConfig; label: string; desc: string }>
            ).map((sec) => {
              const secConfig = localShop.sectionsConfig || getDefaultSectionsConfig();
              const isEnabled = secConfig[sec.key]?.enabled !== false;

              return (
                <div
                  key={sec.key}
                  onClick={() => handleToggleSectionVisibility(sec.key)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                    isEnabled
                      ? 'border-gray-200 bg-white hover:border-orange-300 shadow-2xs'
                      : 'border-gray-100 bg-gray-50/80 opacity-60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isEnabled ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      <h4 className="text-xs font-black text-slate-900 truncate font-['Outfit',sans-serif]">
                        {sec.label}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate ml-4 mt-0.5">{sec.desc}</p>
                  </div>

                  <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggleSectionVisibility(sec.key)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

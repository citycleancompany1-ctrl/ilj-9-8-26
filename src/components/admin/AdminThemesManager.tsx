import React, { useState } from 'react';
import {
  Palette,
  Plus,
  Edit2,
  Trash2,
  Check,
  Eye,
  Sparkles,
  Search,
  Filter,
  Layers,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Save,
  X,
} from 'lucide-react';
import { IndianTheme, INDIAN_LAYOUT_THEMES, IndianThemeLayoutArchetype } from '../../data/indianThemes';
import { PlatformState } from '../../types';

interface AdminThemesManagerProps {
  state: PlatformState;
  onUpdateState: (newState: PlatformState) => void;
}

const ARCHETYPES: { id: IndianThemeLayoutArchetype; label: string; badge: string }[] = [
  { id: 'royal-palace', label: 'Arch Pedestal & Golden Medallions', badge: '🏛️ Grand Palace Architecture' },
  { id: 'sacred-ghat', label: 'Sandstone Split-Ghat & Khata-Bahi Cards', badge: '🪔 Split Ghat & Bahi-Khata' },
  { id: 'jharokha-boutique', label: 'Ornate Arched Portals & Silk Ribbon Grid', badge: '🪟 Rajasthani Jharokha Boutique' },
  { id: 'flowing-river', label: 'Wave Dividers & Ripple Water-Droplet Cards', badge: '🌊 Sacred River Ripples' },
  { id: 'cyber-terminal', label: 'Dark Neon Matrix & Glowing Cyber Traces', badge: '⚡ Bengaluru Neo-Tech Terminal' },
  { id: 'mandir-gopuram', label: 'Tiered Shikhara Pillars & Aarti Diya Frames', badge: '🚩 Gopuram Temple Architecture' },
  { id: 'glacier-minimal', label: 'Frosted Glass Cards & Pure Serac Borders', badge: '🏔️ Himalayan Glacier Glass' },
  { id: 'carnival-bazaar', label: 'Mela Stripes & Halwai Motichoor Badges', badge: '🎪 Vibrant Mela Bazaar' },
  { id: 'backwater-retreat', label: 'Floating Lily-Pad Cards & Ayurvedic Borders', badge: '🌴 Kerala Ayurvedic Retreat' },
  { id: 'runway-chic', label: 'Dual-Tone Asymmetric Cards & Haute Grid', badge: '💎 Runway Haute Couture' },
];

const ANIMATION_TYPES = [
  { id: 'shimmer-gold', label: '✨ 24K Gold Shimmer Pulse', class: 'animate-pulse ring-2 ring-amber-400/40' },
  { id: 'spiritual-diya', label: '🪔 Auspicious Diya Flicker', class: 'shadow-orange-300 shadow-md' },
  { id: 'palace-bloom', label: '🌸 Royal Jharokha Bloom', class: 'shadow-rose-300 shadow-md' },
  { id: 'water-wave', label: '🌊 Serene Ganga Waves', class: 'shadow-cyan-200 shadow-md' },
  { id: 'neon-pulse', label: '⚡ Cyber Neon Glow', class: 'ring-2 ring-emerald-400 shadow-emerald-400/30' },
  { id: 'surya-radiance', label: '☀️ Surya Bhagwan Radiance', class: 'ring-2 ring-yellow-400/60' },
  { id: 'frost-breeze', label: '❄️ Glacier Crystal Shimmer', class: 'ring-1 ring-sky-300/50' },
  { id: 'confetti-bounce', label: '🎉 Utsav Festive Spark', class: 'shadow-pink-300 shadow-md' },
  { id: 'leaf-sway', label: '🍃 Ayurvedic Palm Sway', class: 'shadow-emerald-200 shadow-md' },
  { id: 'cosmo-glide', label: '✨ Runway Magnetic Glide', class: 'hover:scale-[1.02] transition-all' },
];

export const AdminThemesManager: React.FC<AdminThemesManagerProps> = ({
  state,
  onUpdateState,
}) => {
  const currentThemes: IndianTheme[] =
    state.themes && state.themes.length > 0 ? state.themes : INDIAN_LAYOUT_THEMES;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'CUSTOM'>('ALL');
  const [editingTheme, setEditingTheme] = useState<IndianTheme | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<IndianTheme | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Form State for Add / Edit
  const [formTheme, setFormTheme] = useState<Partial<IndianTheme>>({
    id: '',
    name: '',
    hindiName: '',
    tagline: '',
    description: '',
    categoryFit: '',
    layoutArchetype: 'royal-palace',
    primaryColor: '#D97706',
    secondaryColor: '#B45309',
    accentColor: '#F59E0B',
    cardRadius: 'rounded-xl',
    animationType: 'shimmer-gold',
    features: ['Custom Mobile Layout', 'Brand Colors', '1-Click WhatsApp Ordering'],
    isActive: true,
    isCustom: true,
  });

  const [featuresInput, setFeaturesInput] = useState('Custom Mobile Layout, Brand Colors, 1-Click WhatsApp Ordering');

  // TOGGLE ACTIVE / INACTIVE
  const handleToggleThemeStatus = (themeId: string) => {
    const updated = currentThemes.map((t) => {
      if (t.id === themeId) {
        const nextStatus = t.isActive === false ? true : false;
        return { ...t, isActive: nextStatus, updatedAt: new Date().toISOString() };
      }
      return t;
    });

    onUpdateState({ ...state, themes: updated });
    const target = updated.find((t) => t.id === themeId);
    showToast(`Theme "${target?.name}" status set to: ${target?.isActive !== false ? 'ACTIVE (Live for Vendors)' : 'INACTIVE (Hidden from Vendors)'}`);
  };

  // OPEN CREATE MODAL
  const handleOpenCreateModal = () => {
    const newId = `theme_custom_${Date.now().toString(36)}`;
    setFormTheme({
      id: newId,
      name: '',
      hindiName: '',
      tagline: '',
      description: '',
      categoryFit: 'Retail, Fashion & Lifestyle',
      layoutArchetype: 'royal-palace',
      primaryColor: '#2563EB',
      secondaryColor: '#1D4ED8',
      accentColor: '#3B82F6',
      cardRadius: 'rounded-xl',
      animationType: 'cosmo-glide',
      features: ['Modern Clean Typography', 'Fast High-Contrast Layout', '0% UPI Payment Ready'],
      isActive: true,
      isCustom: true,
    });
    setFeaturesInput('Modern Clean Typography, Fast High-Contrast Layout, 0% UPI Payment Ready');
    setIsNewModalOpen(true);
  };

  // OPEN EDIT MODAL
  const handleOpenEditModal = (theme: IndianTheme) => {
    setEditingTheme(theme);
    setFormTheme({ ...theme });
    setFeaturesInput((theme.features || []).join(', '));
  };

  // SAVE THEME (ADD OR EDIT)
  const handleSaveTheme = () => {
    if (!formTheme.name?.trim() || !formTheme.primaryColor) {
      showToast('⚠️ Kripya Theme Name aur Primary Color zaroor dalein.');
      return;
    }

    const matchedArch = ARCHETYPES.find((a) => a.id === formTheme.layoutArchetype) || ARCHETYPES[0];
    const matchedAnim = ANIMATION_TYPES.find((a) => a.id === formTheme.animationType) || ANIMATION_TYPES[0];

    const parsedFeatures = featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const themeToSave: IndianTheme = {
      id: formTheme.id || `theme_${Date.now().toString(36)}`,
      name: formTheme.name.trim(),
      hindiName: formTheme.hindiName?.trim() || formTheme.name.trim(),
      tagline: formTheme.tagline?.trim() || `${formTheme.name} Theme for Local Stores`,
      description: formTheme.description?.trim() || 'Modern digital catalogue layout theme.',
      categoryFit: formTheme.categoryFit?.trim() || 'All Business Categories',
      layoutArchetype: matchedArch.id,
      layoutLabel: matchedArch.label,
      layoutDescription: `${matchedArch.label} styling with custom brand colors.`,
      layoutBadge: matchedArch.badge,
      primaryColor: formTheme.primaryColor || '#D97706',
      secondaryColor: formTheme.secondaryColor || '#B45309',
      accentColor: formTheme.accentColor || '#F59E0B',
      bgGradient: formTheme.bgGradient || 'from-slate-50 via-gray-50 to-white',
      headerGradient: formTheme.headerGradient || 'from-slate-950 via-slate-900 to-slate-950 text-white',
      cardBorder: formTheme.cardBorder || 'border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-md',
      cardRadius: formTheme.cardRadius || 'rounded-xl',
      accentBadgeBg: formTheme.accentBadgeBg || 'bg-amber-100 text-amber-900 border border-amber-300',
      buttonGradient: formTheme.buttonGradient || 'bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-95 text-white',
      animationType: matchedAnim.id as any,
      animationLabel: matchedAnim.label,
      animationClass: matchedAnim.class,
      previewColorSwatches: [
        formTheme.primaryColor || '#D97706',
        formTheme.secondaryColor || '#B45309',
        formTheme.accentColor || '#F59E0B',
        '#F3F4F6',
      ],
      features: parsedFeatures.length > 0 ? parsedFeatures : ['Mobile First Layout', 'Direct WhatsApp Orders'],
      isFree: true,
      isActive: formTheme.isActive !== false,
      isCustom: formTheme.isCustom ?? true,
      updatedAt: new Date().toISOString(),
    };

    let updatedThemes: IndianTheme[];
    if (editingTheme) {
      updatedThemes = currentThemes.map((t) => (t.id === themeToSave.id ? themeToSave : t));
      showToast(`✅ Theme "${themeToSave.name}" successfully update ho gayi!`);
    } else {
      updatedThemes = [themeToSave, ...currentThemes];
      showToast(`🎉 New Theme "${themeToSave.name}" add ho gayi aur Vendor Dashboard me available hai!`);
    }

    onUpdateState({ ...state, themes: updatedThemes });
    setIsNewModalOpen(false);
    setEditingTheme(null);
  };

  // DELETE THEME
  const handleDeleteTheme = (themeId: string) => {
    const theme = currentThemes.find((t) => t.id === themeId);
    if (!window.confirm(`Kya aap Theme "${theme?.name}" delete karna chahte hain?`)) {
      return;
    }

    const filtered = currentThemes.filter((t) => t.id !== themeId);
    onUpdateState({ ...state, themes: filtered });
    showToast(`🗑️ Theme "${theme?.name}" delete ho gayi.`);
  };

  // RESET TO DEFAULT 10 THEMES
  const handleResetToDefaults = () => {
    if (!window.confirm('Kya aap sabhi themes ko system default 10 Indian Themes par reset karna chahte hain?')) {
      return;
    }
    onUpdateState({ ...state, themes: INDIAN_LAYOUT_THEMES });
    showToast('🔄 Themes reset to official 10 Indian Layout Themes.');
  };

  // FILTER LOGIC
  const filteredThemes = currentThemes.filter((theme) => {
    const matchesSearch =
      theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.categoryFit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'ACTIVE') return theme.isActive !== false;
    if (filterStatus === 'INACTIVE') return theme.isActive === false;
    if (filterStatus === 'CUSTOM') return Boolean(theme.isCustom);
    return true;
  });

  const activeCount = currentThemes.filter((t) => t.isActive !== false).length;
  const customCount = currentThemes.filter((t) => t.isCustom).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-amber-500/50 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-2xl p-6 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-amber-400">
          <Palette className="w-56 h-56" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              Centralized Theme & Template Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Theme & Template Management System
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Super Admin yahan se themes create, edit, activate ya deactivate kar sakte hain. Active themes <strong>turant Vendor Dashboard me live ho jaati hain</strong> jahan se vendors 1-click me apne store par apply kar sakte hain.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Theme
            </button>

            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset to 10 Default Indian Themes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Themes</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{currentThemes.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active for Vendors</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{activeCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Deactivated / Hidden</span>
          <p className="text-2xl font-black text-gray-500 mt-1">{currentThemes.length - activeCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Custom Admin Themes</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">{customCount}</p>
        </div>
      </div>

      {/* Controls: Search & Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search theme name, hindi name, category..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'ACTIVE', 'INACTIVE', 'CUSTOM'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setFilterStatus(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                filterStatus === filter
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter === 'ALL' && `All (${currentThemes.length})`}
              {filter === 'ACTIVE' && `Active (${activeCount})`}
              {filter === 'INACTIVE' && `Inactive (${currentThemes.length - activeCount})`}
              {filter === 'CUSTOM' && `Custom (${customCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredThemes.map((theme) => {
          const isActive = theme.isActive !== false;
          return (
            <div
              key={theme.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'border-gray-200 shadow-sm hover:shadow-md'
                  : 'border-gray-300 bg-gray-50/70 opacity-80'
              }`}
            >
              <div>
                {/* Header Card Strip */}
                <div
                  className="p-4 text-white flex items-center justify-between"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                  }}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-base font-black truncate">{theme.name}</h4>
                      <span className="text-xs font-semibold opacity-90">({theme.hindiName})</span>
                    </div>
                    <p className="text-[11px] opacity-80 truncate">{theme.tagline}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {theme.isCustom ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/20 text-white border border-white/30">
                        Custom
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-black/20 text-white">
                        Preset
                      </span>
                    )}
                  </div>
                </div>

                {/* Theme Card Body */}
                <div className="p-4 space-y-3">
                  {/* Archetype & Category */}
                  <div className="space-y-1">
                    <span className="inline-block text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {theme.layoutBadge || '🏛️ Architecture Layout'}
                    </span>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {theme.description}
                    </p>
                  </div>

                  {/* Color Swatches */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Color Palette & Accents
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-6 h-6 rounded-md shadow-xs border border-white"
                        style={{ backgroundColor: theme.primaryColor }}
                        title={`Primary: ${theme.primaryColor}`}
                      />
                      <div
                        className="w-6 h-6 rounded-md shadow-xs border border-white"
                        style={{ backgroundColor: theme.secondaryColor }}
                        title={`Secondary: ${theme.secondaryColor}`}
                      />
                      <div
                        className="w-6 h-6 rounded-md shadow-xs border border-white"
                        style={{ backgroundColor: theme.accentColor }}
                        title={`Accent: ${theme.accentColor}`}
                      />
                      <span className="text-[11px] font-mono text-gray-500 ml-1">
                        {theme.primaryColor}
                      </span>
                    </div>
                  </div>

                  {/* Best Fit For */}
                  <div className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="font-bold text-slate-800">Best for: </span>
                    <span className="line-clamp-1">{theme.categoryFit}</span>
                  </div>

                  {/* Features tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(theme.features || []).slice(0, 3).map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Action Controls */}
              <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                {/* Active / Inactive Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleThemeStatus(theme.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300'
                  }`}
                  title={isActive ? 'Click to Deactivate' : 'Click to Activate'}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Active (Live)
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-gray-500" />
                      Deactivated
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewTheme(theme)}
                    className="p-1.5 bg-white hover:bg-gray-100 text-slate-700 border border-gray-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    title="Live Preview Theme"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(theme)}
                    className="p-1.5 bg-white hover:bg-gray-100 text-slate-700 border border-gray-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    title="Edit Theme Settings"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {theme.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTheme(theme.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      title="Delete Custom Theme"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT THEME MODAL */}
      {(isNewModalOpen || editingTheme) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-600" />
                {editingTheme ? `Edit Theme: ${editingTheme.name}` : 'Create New Theme & Template'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsNewModalOpen(false);
                  setEditingTheme(null);
                }}
                className="text-gray-400 hover:text-gray-600 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Row 1: English & Hindi Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Theme Name (English)*
                  </label>
                  <input
                    type="text"
                    value={formTheme.name || ''}
                    onChange={(e) => setFormTheme({ ...formTheme, name: e.target.value })}
                    placeholder="e.g. Surat Diamond"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hindi Name (हिंदी नाम)*
                  </label>
                  <input
                    type="text"
                    value={formTheme.hindiName || ''}
                    onChange={(e) => setFormTheme({ ...formTheme, hindiName: e.target.value })}
                    placeholder="e.g. सूरत डायमंड"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formTheme.tagline || ''}
                  onChange={(e) => setFormTheme({ ...formTheme, tagline: e.target.value })}
                  placeholder="e.g. Shimmering Jewels & Luxury Diamond Shine"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formTheme.description || ''}
                  onChange={(e) => setFormTheme({ ...formTheme, description: e.target.value })}
                  placeholder="Describe the aesthetic and appeal of this theme..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category Fit */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recommended For (Categories)
                </label>
                <input
                  type="text"
                  value={formTheme.categoryFit || ''}
                  onChange={(e) => setFormTheme({ ...formTheme, categoryFit: e.target.value })}
                  placeholder="e.g. Jewellery, Silk Sarees, Boutiques, Electronics"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Archetype & Animation Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Layout Archetype
                  </label>
                  <select
                    value={formTheme.layoutArchetype || 'royal-palace'}
                    onChange={(e) =>
                      setFormTheme({ ...formTheme, layoutArchetype: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    {ARCHETYPES.map((arch) => (
                      <option key={arch.id} value={arch.id}>
                        {arch.badge}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Animation Effect
                  </label>
                  <select
                    value={formTheme.animationType || 'shimmer-gold'}
                    onChange={(e) =>
                      setFormTheme({ ...formTheme, animationType: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    {ANIMATION_TYPES.map((anim) => (
                      <option key={anim.id} value={anim.id}>
                        {anim.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Controls */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">
                  Color Scheme Palette
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formTheme.primaryColor || '#D97706'}
                        onChange={(e) => setFormTheme({ ...formTheme, primaryColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formTheme.primaryColor || '#D97706'}
                        onChange={(e) => setFormTheme({ ...formTheme, primaryColor: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 mb-1">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formTheme.secondaryColor || '#B45309'}
                        onChange={(e) => setFormTheme({ ...formTheme, secondaryColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formTheme.secondaryColor || '#B45309'}
                        onChange={(e) => setFormTheme({ ...formTheme, secondaryColor: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 mb-1">Accent Glow Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formTheme.accentColor || '#F59E0B'}
                        onChange={(e) => setFormTheme({ ...formTheme, accentColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formTheme.accentColor || '#F59E0B'}
                        onChange={(e) => setFormTheme({ ...formTheme, accentColor: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Features list */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Features (Comma-separated)
                </label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="e.g. Royal Borders, Diya Glow, Mobile First Cart"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="theme_active_toggle"
                  checked={formTheme.isActive !== false}
                  onChange={(e) => setFormTheme({ ...formTheme, isActive: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="theme_active_toggle" className="font-bold text-slate-800 cursor-pointer">
                  Make Theme Immediately Active for All Vendors in Vendor Dashboard
                </label>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsNewModalOpen(false);
                  setEditingTheme(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTheme}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                {editingTheme ? 'Update Theme' : 'Create & Publish Theme'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE THEME PREVIEW MODAL */}
      {previewTheme && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Theme Preview: {previewTheme.name} ({previewTheme.hindiName})
                </h3>
                <span className="text-xs text-gray-500">{previewTheme.layoutBadge}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTheme(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Mock Store Showcase with Theme Colors Applied */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Header */}
              <div
                className="p-4 text-white flex items-center justify-between"
                style={{
                  background: `linear-gradient(135deg, ${previewTheme.primaryColor}, ${previewTheme.secondaryColor})`,
                }}
              >
                <div>
                  <h4 className="font-black text-sm">Lala Ji Royal Sweets & Boutique</h4>
                  <p className="text-[11px] opacity-80">Godowlia Chauraha, Varanasi</p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-black"
                  style={{
                    backgroundColor: previewTheme.accentColor,
                    color: '#000',
                  }}
                >
                  Verified Store
                </span>
              </div>

              {/* Hero Banner Mock */}
              <div className="p-5 bg-gradient-to-b from-amber-50/50 to-white text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  Special Festive Offer • 20% Off
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  Shuddh Desi Ghee Sweets & Dry Fruits
                </h2>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Mobile se 1-click me order karein aur WhatsApp par instant confirmation paayein.
                </p>

                <div className="pt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-white font-black text-xs rounded-xl shadow-xs"
                    style={{
                      backgroundColor: previewTheme.primaryColor,
                    }}
                  >
                    Order on WhatsApp
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-slate-800 font-bold text-xs rounded-xl"
                  >
                    View Catalog
                  </button>
                </div>
              </div>

              {/* Sample Product Card Mock */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-xs"
                      style={{ backgroundColor: previewTheme.primaryColor }}
                    >
                      KG
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Kaju Katli Special</h5>
                      <span className="text-xs font-bold text-emerald-700">₹850 / kg</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                    style={{ backgroundColor: previewTheme.secondaryColor }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewTheme(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

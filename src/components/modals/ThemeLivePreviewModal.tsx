import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  X,
  Sparkles,
  Check,
  ShoppingBag,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Wand2,
  ExternalLink,
  ChevronRight,
  Plus,
  QrCode,
  Store
} from 'lucide-react';
import { Shop, ProductItem, CartItem } from '../../types';
import { IndianTheme, INDIAN_LAYOUT_THEMES } from '../../data/indianThemes';
import { INITIAL_SHOPS } from '../../data/initialData';
import { formatINR } from '../../utils/mediaUpload';
import {
  ThemedHeroSection,
  ThemedTrustStrip,
  ThemedProductCatalogue,
} from '../shop/ThemedStorefrontEngine';

interface ThemeLivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTheme: IndianTheme;
  shop?: Shop;
  onApplyTheme?: (theme: IndianTheme) => void;
  onOpenAuth?: (tab?: 'LOGIN' | 'REGISTER') => void;
}

export const ThemeLivePreviewModal: React.FC<ThemeLivePreviewModalProps> = ({
  isOpen,
  onClose,
  initialTheme,
  shop,
  onApplyTheme,
  onOpenAuth,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<IndianTheme>(initialTheme);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [mockCartCount, setMockCartCount] = useState<number>(1);
  const [previewCartAlert, setPreviewCartAlert] = useState<string | null>(null);

  // Sync state if initialTheme changes
  React.useEffect(() => {
    setSelectedTheme(initialTheme);
  }, [initialTheme]);

  if (!isOpen) return null;

  // Use shop provided or fallback to authentic sample shop
  const activeShop: Shop = shop || INITIAL_SHOPS[0];
  const products: ProductItem[] = activeShop.products?.length
    ? activeShop.products.slice(0, 6)
    : [
        {
          id: 'prev_1',
          name: 'Shuddh Desi Ghee (1 Litre Pack)',
          price: 650,
          originalPrice: 750,
          description: '100% Traditional pure cow ghee with rich aroma and golden texture.',
          inStock: true,
          unit: '1 Litre',
          type: 'PRODUCT',
          imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop&q=80',
        },
        {
          id: 'prev_2',
          name: 'Royal Basmati Rice (5 KG Premium)',
          price: 490,
          originalPrice: 580,
          description: 'Long grain, aged aromatic rice perfect for special occasions & biryani.',
          inStock: true,
          unit: '5 KG',
          type: 'PRODUCT',
          imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
        },
        {
          id: 'prev_3',
          name: 'Handmade Kashmiri Saffron (1 Gram)',
          price: 320,
          originalPrice: 400,
          description: 'A-grade original red strands directly sourced from Pampore farms.',
          inStock: true,
          unit: '1 Gram',
          type: 'PRODUCT',
          imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
        },
        {
          id: 'prev_4',
          name: 'Organic Whole Spices Combo (400g)',
          price: 260,
          originalPrice: 320,
          description: 'Cardamom, Cloves, Black Pepper & Cinnamon curated aroma box.',
          inStock: true,
          unit: 'Combo Pack',
          type: 'PRODUCT',
          imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80',
        },
      ];

  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setMockCartCount((c) => c + 1);
    setPreviewCartAlert(`Added "${product.name}" to cart!`);
    setTimeout(() => {
      setPreviewCartAlert(null);
    }, 2500);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.product.id !== productId);
    });
    setMockCartCount((c) => Math.max(0, c - 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4 animate-in fade-in">
      
      {/* 1. TOP MODAL CONTROLS & THEME SWITCHER */}
      <div className="w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-2xl p-3 sm:p-4 mb-2 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-white">
        
        {/* Left: Theme Info & Current State */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md text-sm shrink-0 border border-white/20"
            style={{ backgroundColor: selectedTheme.primaryColor }}
          >
            {selectedTheme.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white font-['Outfit',sans-serif]">
                {selectedTheme.name}
              </span>
              <span className="text-xs font-bold text-amber-400">({selectedTheme.hindiName})</span>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {selectedTheme.layoutBadge}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                FREE ₹0
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="text-amber-300 font-bold">{selectedTheme.layoutLabel}:</span>
              <span className="truncate max-w-[280px]">{selectedTheme.layoutDescription}</span>
              <span className="text-gray-500">•</span>
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                {selectedTheme.animationLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Responsive Device Switcher */}
        <div className="flex items-center justify-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 self-center">
          <button
            type="button"
            onClick={() => setDeviceView('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceView === 'mobile'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-slate-700/60'
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceView('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceView === 'tablet'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-slate-700/60'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceView('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceView === 'desktop'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-white hover:bg-slate-700/60'
            }`}
            title="Desktop View (Fluid Full Width)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 justify-end">
          {onApplyTheme && (
            <button
              type="button"
              onClick={() => {
                onApplyTheme(selectedTheme);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Apply Theme Free</span>
            </button>
          )}

          {!onApplyTheme && onOpenAuth && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth('REGISTER');
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Build Store With This Theme</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. THEME HORIZONTAL QUICK SELECTOR TABS */}
      <div className="w-full max-w-6xl bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 mb-2 overflow-x-auto flex items-center gap-2 text-xs scrollbar-thin">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Switch Theme:
        </span>
        {INDIAN_LAYOUT_THEMES.map((th) => {
          const isSelected = th.id === selectedTheme.id;
          return (
            <button
              key={th.id}
              type="button"
              onClick={() => setSelectedTheme(th)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-300 shadow-xs'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/50 shrink-0"
                style={{ backgroundColor: th.primaryColor }}
              />
              <span className="text-[10px] opacity-90">{th.layoutBadge}</span>
              <span>{th.name}</span>
              <span className="text-[10px] opacity-75">({th.hindiName})</span>
            </button>
          );
        })}
      </div>

      {/* 3. SIMULATED DEVICE PREVIEW CANVAS */}
      <div className="w-full max-w-6xl flex-1 max-h-[78vh] overflow-hidden flex items-center justify-center p-1 sm:p-2">
        
        {/* Container Sizing based on deviceView */}
        <div
          className={`h-full w-full bg-white transition-all duration-300 overflow-hidden shadow-2xl flex flex-col ${
            deviceView === 'mobile'
              ? 'max-w-[390px] rounded-[36px] border-[8px] border-slate-800 ring-2 ring-slate-700'
              : deviceView === 'tablet'
              ? 'max-w-[768px] rounded-[24px] border-[6px] border-slate-800 ring-2 ring-slate-700'
              : 'max-w-full rounded-xl border border-slate-700'
          }`}
        >
          {/* Mobile Chassis Top Notch / Speaker (if mobile view) */}
          {deviceView === 'mobile' && (
            <div className="bg-slate-900 py-1.5 px-4 flex items-center justify-between text-white text-[10px] font-bold select-none shrink-0">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Browser Address Bar for Tablet / Desktop */}
          {deviceView !== 'mobile' && (
            <div className="bg-slate-100 border-b border-gray-200 py-1.5 px-4 flex items-center gap-2 select-none shrink-0 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="bg-white border border-gray-300 rounded-md px-3 py-0.5 text-[11px] text-gray-500 flex-1 max-w-sm font-mono truncate">
                https://indianlalaji.com/?shop={activeShop.shopId}&theme={selectedTheme.id}
              </div>
              <div className="text-[11px] text-emerald-700 font-bold ml-auto flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Official Store</span>
              </div>
            </div>
          )}

          {/* Toast Notification inside preview */}
          {previewCartAlert && (
            <div className="bg-emerald-600 text-white text-xs font-bold text-center py-2 px-4 shadow-md transition-all animate-in slide-in-from-top shrink-0 flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{previewCartAlert}</span>
            </div>
          )}

          {/* 4. SCROLLABLE STOREFRONT CONTENT RENDERED IN THE SELECTED INDIAN THEME */}
          <div
            className={`flex-1 overflow-y-auto bg-gradient-to-b ${selectedTheme.bgGradient} text-slate-900 scrollbar-thin`}
          >
            {/* Top Store Banner */}
            <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                  {selectedTheme.name}
                </span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-gray-300 hidden sm:inline">Direct Store Pricing</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-emerald-300 font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>100% Direct WhatsApp Booking</span>
              </div>
            </div>

            {/* Store Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                {activeShop.logoUrl ? (
                  <img
                    src={activeShop.logoUrl}
                    alt={activeShop.businessName}
                    className="w-9 h-9 rounded-xl object-cover border border-gray-200 shadow-2xs"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-2xs text-sm"
                    style={{ backgroundColor: selectedTheme.primaryColor }}
                  >
                    {activeShop.businessName.slice(0, 1)}
                  </div>
                )}
                <div>
                  <h1 className="font-black text-xs sm:text-sm text-slate-900 leading-tight flex items-center gap-1 font-['Outfit',sans-serif]">
                    <span>{activeShop.businessName}</span>
                    <span className="text-emerald-600" title="Verified">✓</span>
                  </h1>
                  <p className="text-[10px] text-gray-500 truncate max-w-[180px] sm:max-w-xs">
                    {activeShop.tagline || 'Apki Apni Vishwasniya Dukaan'}
                  </p>
                </div>
              </div>

              {/* Cart / WhatsApp Actions */}
              <div className="flex items-center gap-2">
                <div className="relative bg-gray-100 hover:bg-gray-200 p-2 rounded-xl text-slate-800 transition-colors cursor-pointer">
                  <ShoppingBag className="w-4 h-4" />
                  {mockCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {mockCartCount}
                    </span>
                  )}
                </div>

                <a
                  href={`tel:${activeShop.phone}`}
                  onClick={(e) => e.preventDefault()}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Call Store"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              </div>
            </div>

            {/* ARCHETYPE LAYOUT ANNOUNCEMENT BANNER */}
            <div className="bg-slate-900 border-b border-amber-500/30 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-white">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">🏛️ Layout Structure:</span>
                <span className="font-extrabold text-white bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded text-[11px]">
                  {selectedTheme.layoutBadge} {selectedTheme.layoutLabel}
                </span>
              </div>
              <span className="text-[11px] text-gray-300 font-medium">{selectedTheme.layoutDescription}</span>
            </div>

            {/* 1. DISTINCT THEMED HERO BANNER ACCORDING TO ARCHETYPE */}
            <ThemedHeroSection
              theme={selectedTheme}
              shop={activeShop}
              onExploreProducts={() => {}}
            />

            {/* 2. DISTINCT THEMED TRUST STRIP ACCORDING TO ARCHETYPE */}
            <ThemedTrustStrip theme={selectedTheme} shop={activeShop} />

            {/* 3. DISTINCT THEMED PRODUCT CATALOGUE ACCORDING TO ARCHETYPE */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 font-['Outfit',sans-serif] flex items-center gap-2">
                    <span>{selectedTheme.name} Specialities</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                      {products.length} Items
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Arranged in <strong>{selectedTheme.layoutLabel}</strong> layout format
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-900 text-white flex items-center gap-1">
                    <span>{selectedTheme.layoutBadge}</span>
                    <span>{selectedTheme.layoutLabel}</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${selectedTheme.accentBadgeBg}`}>
                    {selectedTheme.animationLabel}
                  </span>
                </div>
              </div>

              <ThemedProductCatalogue
                theme={selectedTheme}
                shop={activeShop}
                products={products}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
              />
            </div>

            {/* STORE FOOTER WITH ADDRESS & UPI */}
            <div className="bg-slate-900 text-white p-6 border-t border-slate-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h4 className="font-black text-sm text-white font-['Outfit',sans-serif]">
                    {activeShop.businessName}
                  </h4>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                    <span>{activeShop.address}, {activeShop.city}, {activeShop.state}</span>
                  </p>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Official Verified LalaJi Merchant</span>
                </div>
              </div>

              <div className="text-[10px] text-gray-500 text-center">
                Powered by IndianLalaJi.com • Live Theme: {selectedTheme.name} ({selectedTheme.hindiName}) • 100% Free
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

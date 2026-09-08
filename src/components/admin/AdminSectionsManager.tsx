import React, { useState } from 'react';
import { 
  Sliders, 
  Power, 
  Check, 
  Save, 
  Store, 
  Sparkles, 
  Globe, 
  Eye, 
  Layers, 
  Video, 
  QrCode, 
  Tag, 
  MessageSquare, 
  Info, 
  HelpCircle, 
  Star, 
  Image, 
  Clock, 
  MapPin, 
  PhoneCall, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Shop, PlatformState, MainWebsiteSectionsConfig, ShopSectionsConfig, FloatingButtonsConfig } from '../../types';
import { savePlatformConfigToFirestore, saveShopToFirestore } from '../../services/firebase';
import { FloatingButtonsSettingsCard } from '../shared/FloatingButtonsSettingsCard';

interface AdminSectionsManagerProps {
  state: PlatformState;
  onUpdateState: (newState: PlatformState) => void;
  showToast: (msg: string) => void;
}

export const AdminSectionsManager: React.FC<AdminSectionsManagerProps> = ({
  state,
  onUpdateState,
  showToast,
}) => {
  // Main Homepage Sections State
  const defaultMainSections: MainWebsiteSectionsConfig = {
    heroBanner: true,
    aboutStorySlider: true,
    videoTutorials: true,
    liveStoresShowcase: true,
    whyChooseUs: true,
    pricingPlan: true,
    adminPaymentQr: true,
    bottomCtaBanner: true,
  };

  const [mainSections, setMainSections] = useState<MainWebsiteSectionsConfig>(
    state.mainWebsiteSectionsConfig || defaultMainSections
  );

  // Vendor Website Sections Controller State
  const [selectedShopId, setSelectedShopId] = useState<string>(
    state.shops[0]?.shopId || ''
  );

  const selectedShop = state.shops.find(s => s.shopId === selectedShopId) || state.shops[0];

  // Helper to toggle main website section
  const handleToggleMainSection = (key: keyof MainWebsiteSectionsConfig) => {
    setMainSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Save Main Website Sections to State & Firestore
  const handleSaveMainSections = () => {
    const updatedState: PlatformState = {
      ...state,
      mainWebsiteSectionsConfig: mainSections,
    };
    onUpdateState(updatedState);
    savePlatformConfigToFirestore({ mainWebsiteSectionsConfig: mainSections });
    showToast('Main website homepage sections updated successfully!');
  };

  // Toggle Vendor Store Section
  const handleToggleVendorSection = (sectionKey: keyof ShopSectionsConfig) => {
    if (!selectedShop) return;
    const currentConfig = selectedShop.sectionsConfig || {};
    const currentSection = (currentConfig as any)[sectionKey] || { enabled: true };
    const updatedSection = {
      ...currentSection,
      enabled: !currentSection.enabled,
    };

    const updatedConfig: ShopSectionsConfig = {
      ...currentConfig,
      [sectionKey]: updatedSection,
    };

    const updatedShop: Shop = {
      ...selectedShop,
      sectionsConfig: updatedConfig,
    };

    saveShopToFirestore(updatedShop);
    const updatedShops = state.shops.map(s => s.shopId === selectedShop.shopId ? updatedShop : s);
    onUpdateState({ ...state, shops: updatedShops });
    showToast(`Section '${String(sectionKey)}' updated for ${selectedShop.businessName}`);
  };

  // Update Floating Action Buttons for Selected Vendor
  const handleUpdateVendorFloatingButtons = (updatedButtons: FloatingButtonsConfig, updatedMapsUrl?: string) => {
    if (!selectedShop) return;
    const updatedShop: Shop = {
      ...selectedShop,
      floatingButtons: updatedButtons,
      googleMapsUrl: updatedMapsUrl !== undefined ? updatedMapsUrl : selectedShop.googleMapsUrl,
      updatedAt: new Date().toISOString(),
    };
    saveShopToFirestore(updatedShop);
    const updatedShops = state.shops.map(s => s.shopId === selectedShop.shopId ? updatedShop : s);
    onUpdateState({ ...state, shops: updatedShops });
    showToast(`Floating buttons (WhatsApp, Call, Language, Map) updated for ${selectedShop.businessName}!`);
  };

  // 8 Main Website Sections definitions
  const mainSectionItems = [
    {
      key: 'heroBanner' as keyof MainWebsiteSectionsConfig,
      title: '1. Editorial Hero Section',
      subtitle: 'Main heading, badge, CTA buttons (Build Store / Live Stores), and mobile interactive showcase mock.',
      icon: Sparkles,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
    },
    {
      key: 'aboutStorySlider' as keyof MainWebsiteSectionsConfig,
      title: '2. About Platform & Photo Story Slider',
      subtitle: 'Mission, vision, and high-definition photo slider highlighting local Indian shopkeepers.',
      icon: Image,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      key: 'videoTutorials' as keyof MainWebsiteSectionsConfig,
      title: '3. Video Tutorials Showcase',
      subtitle: '4 video guides embedding YouTube demos on how to register, upload photos, and receive WhatsApp orders.',
      icon: Video,
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    {
      key: 'liveStoresShowcase' as keyof MainWebsiteSectionsConfig,
      title: '4. Live Client Stores & Category Filter Showcase',
      subtitle: 'Grid of published stores with category tabs (Featured, Retail, Fashion, Food, Services).',
      icon: Store,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      key: 'adminPaymentQr' as keyof MainWebsiteSectionsConfig,
      title: '5. Direct Admin UPI QR Payment & Account Activation',
      subtitle: 'Official IndianLalaJi Paytm/PhonePe QR code, UPI ID copy, and direct activation instructions.',
      icon: QrCode,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      key: 'whyChooseUs' as keyof MainWebsiteSectionsConfig,
      title: '6. Store Categories by Business Type',
      subtitle: 'Showcases customized card designs for Kirana, Fashion, Restaurants, Electronics, and Beauty.',
      icon: Layers,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      key: 'pricingPlan' as keyof MainWebsiteSectionsConfig,
      title: '7. Single 1-Year All-In-One Pricing Package',
      subtitle: 'The master ₹1,499 annual plan card with 12 feature bullet points, savings badge, and direct order modal.',
      icon: Tag,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      key: 'bottomCtaBanner' as keyof MainWebsiteSectionsConfig,
      title: '8. Customer Testimonials & Bottom Call to Action',
      subtitle: 'Verified vendor testimonial quote and fast register strip for visitors.',
      icon: MessageSquare,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
    },
  ];

  // Vendor 16 Page Builder Sections list
  const vendorSectionItems: { key: keyof ShopSectionsConfig; label: string; desc: string; icon: any }[] = [
    { key: 'hero', label: '1. Store Hero Banner', desc: 'Shop logo, banner image, business name, and main CTA button.', icon: Sparkles },
    { key: 'about', label: '2. About Store & Owner Story', desc: 'About text story, established year, and founder photo.', icon: Info },
    { key: 'features', label: '3. Store Highlights & Badges', desc: 'Key business advantages (e.g. 100% Pure, Home Delivery).', icon: CheckCircle2 },
    { key: 'products', label: '4. Products & Goods Catalogue', desc: 'Grid of products with price, stock, images, and WhatsApp add-to-cart.', icon: Store },
    { key: 'services', label: '5. Services & Appointment Booking', desc: 'Service items with hourly/session rates and inquiry forms.', icon: Clock },
    { key: 'videos', label: '6. Store Video Guides & Reels', desc: 'Embedded YouTube video demos and store video tours.', icon: Video },
    { key: 'benefits', label: '7. Customer Benefits & Guarantees', desc: 'Quality assurance, instant refunds, and hygiene badges.', icon: Star },
    { key: 'testimonials', label: '8. Customer Reviews & Ratings', desc: 'Star ratings and testimonials left by verified buyers.', icon: Star },
    { key: 'offers', label: '9. Festival Offers & Coupon Deals', desc: 'Promotional discount banners and coupon code strips.', icon: Tag },
    { key: 'portfolio', label: '10. Portfolio / Photo Showcase', desc: 'Showcase photos of previous client work, shop interior, and inventory.', icon: Image },
    { key: 'team', label: '11. Founders & Store Team', desc: 'Team member photos, designations, and certifications.', icon: Info },
    { key: 'faq', label: '12. Frequently Asked Questions (FAQ)', desc: 'Store policies, payment methods, delivery areas, and return terms.', icon: HelpCircle },
    { key: 'pricing', label: '13. Special Combos & Packages', desc: 'Discounted bundles and seasonal festival packages.', icon: Tag },
    { key: 'cta', label: '14. High-Conversion Call to Action', desc: 'Bold banner compelling shoppers to call or message immediately.', icon: Sparkles },
    { key: 'contact', label: '15. Direct Contact & Calling Box', desc: 'Phone, WhatsApp, email, and customer inquiry form.', icon: PhoneCall },
    { key: 'blog', label: '16. Tips, Updates & Announcements', desc: 'Helpful merchant guides, news, and new arrival notices.', icon: Globe },
  ];

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: MAIN PLATFORM WEBSITE SECTIONS (HOMEPAGE) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-sm uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" /> Main Website Landing Page
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
              Main Website Homepage Sections (Live ON / OFF Controls)
            </h2>
            <p className="text-xs text-gray-500">
              Yahan se aap IndianLalaJi.com ke main homepage ke sabhi 8 sections ko aasaani se live ON ya OFF kar sakte hain.
            </p>
          </div>

          <button
            id="save-homepage-sections-btn"
            onClick={handleSaveMainSections}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save Homepage Sections</span>
          </button>
        </div>

        {/* 8 Homepage Section Cards with Toggle Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainSectionItems.map((item) => {
            const Icon = item.icon;
            const isEnabled = mainSections[item.key] !== false;

            return (
              <div
                key={item.key}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isEnabled
                    ? 'bg-white border-gray-200 shadow-xs'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isEnabled
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {isEnabled ? '🟢 Active' : '🔴 Hidden'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.subtitle}</p>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => handleToggleMainSection(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isEnabled
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* SECTION 2: VENDOR WEBSITE SECTIONS CONTROLLER */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-sm uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" /> Vendor Websites Controller
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
              Vendor Website 16-Sections Manager
            </h2>
            <p className="text-xs text-gray-500">
              Kisi bhi vendor ki website select karein aur uske individual 16 sections (Products, Services, Gallery, Reviews etc.) ko ON/OFF karein.
            </p>
          </div>

          {/* Shop Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Store:</span>
            <select
              value={selectedShopId}
              onChange={(e) => setSelectedShopId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white font-bold text-xs text-slate-900 focus:ring-2 focus:ring-orange-500"
            >
              {state.shops.map((s) => (
                <option key={s.shopId} value={s.shopId}>
                  {s.businessName} ({s.shopId}) - {s.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedShop ? (
          <div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-blue-900">Managing Sections for:</span>
                <strong className="text-slate-900 font-black">{selectedShop.businessName}</strong>
                <span className="font-mono text-orange-600 font-bold">({selectedShop.shopId})</span>
              </div>
              <span className="text-[11px] text-blue-800 font-medium">
                URL: /shop/{selectedShop.shopId}
              </span>
            </div>

            {/* DEDICATED FLOATING ACTION CIRCLE BUTTONS CONTROLLER (WHATSAPP, CALL, MULTI-LANGUAGE, GOOGLE LOCATION) */}
            <div className="mb-6">
              <FloatingButtonsSettingsCard
                floatingButtons={selectedShop.floatingButtons}
                googleMapsUrl={selectedShop.googleMapsUrl}
                onUpdate={handleUpdateVendorFloatingButtons}
                shopName={selectedShop.businessName}
              />
            </div>

            {/* 16 Vendor Sections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {vendorSectionItems.map((sec) => {
                const Icon = sec.icon;
                const shopCfg = selectedShop.sectionsConfig || {};
                const isEnabled = (shopCfg as any)[sec.key]?.enabled !== false;

                return (
                  <div
                    key={sec.key}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                      isEnabled
                        ? 'bg-white border-gray-200 shadow-xs'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-bold text-xs text-slate-900">{sec.label}</h4>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isEnabled ? 'ON' : 'OFF'}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                      {sec.desc}
                    </p>

                    <button
                      onClick={() => handleToggleVendorSection(sec.key)}
                      className={`w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isEnabled
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                      }`}
                    >
                      Toggle {isEnabled ? 'OFF' : 'ON'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-gray-500">
            No vendor store registered yet.
          </div>
        )}

      </div>

    </div>
  );
};

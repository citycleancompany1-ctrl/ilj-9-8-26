import React, { useState } from 'react';
import { 
  Sparkles, 
  Store, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  ShieldCheck, 
  Zap, 
  QrCode, 
  ShoppingBag, 
  Layers, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Eye,
  Star,
  Users,
  Building,
  Check,
  Tag,
  Copy,
  Mail,
  HeartHandshake
} from 'lucide-react';
import { Shop, PricingPackage, TutorialVideo, MainWebsiteSectionsConfig } from '../../types';
import { BUSINESS_CATEGORIES } from '../../data/initialData';
import { formatINR, getWhatsAppDirectUrl } from '../../utils/mediaUpload';
import { VideoPlayerCard } from '../common/VideoPlayerCard';
import { PackageOrderModal } from '../modals/PackageOrderModal';

interface HomePageProps {
  shops: Shop[];
  pricingPackages: PricingPackage[];
  tutorialVideos: TutorialVideo[];
  platformHeroHeading?: string;
  platformHeroSubheading?: string;
  platformAboutStory?: string;
  platformAboutPhotos?: string[];
  customerCarePhone?: string;
  customerCareWhatsapp?: string;
  customerCareEmail?: string;
  adminPaymentQrUrl?: string;
  adminUpiId?: string;
  adminAccountHolder?: string;
  mainWebsiteSectionsConfig?: MainWebsiteSectionsConfig;
  onNavigate: (view: string, shopId?: string) => void;
  onOpenAuth: (tab?: 'LOGIN' | 'REGISTER' | 'ADMIN') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  shops,
  pricingPackages,
  tutorialVideos,
  platformHeroHeading = 'LAUNCH YOUR STORE WEBSITE IN 2 MINUTES.',
  platformHeroSubheading = 'Build a professional digital storefront directly from your mobile phone. Fast, modern, and effortless. Accept direct WhatsApp orders, collect direct UPI payments, and get your own unique Shop ID.',
  platformAboutStory,
  platformAboutPhotos,
  customerCarePhone = '7087033009',
  customerCareWhatsapp = '7087033009',
  customerCareEmail = 'info@indianlalaji.com',
  adminPaymentQrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=upi://pay?pa=7087033009@paytm&pn=IndianLalaJi%20Official&cu=INR',
  adminUpiId = '7087033009@paytm',
  adminAccountHolder = 'IndianLalaJi Platform (R. K. Mehra)',
  mainWebsiteSectionsConfig,
  onNavigate,
  onOpenAuth,
}) => {
  const [activeSliderIdx, setActiveSliderIdx] = useState(0);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('FEATURED');
  const [selectedPackageToOrder, setSelectedPackageToOrder] = useState<PricingPackage | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const defaultSliderImages = [
    {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
      title: 'Take Your Retail & Grocery Store Online',
      desc: 'Upload photos from your phone, set prices, and share your live digital store directly on WhatsApp.',
    },
    {
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80',
      title: 'Boutiques & Fashion Apparel Showcase',
      desc: 'Create an elegant digital catalogue for ethnic wear, bridal attire, and designer collections without coding.',
    },
    {
      url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1000&auto=format&fit=crop&q=80',
      title: 'Restaurants, Cafes & Sweet Shops',
      desc: 'Receive customer orders with integrated zero-fee UPI payment QR codes and customer reviews.',
    },
    {
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&auto=format&fit=crop&q=80',
      title: 'Home Services, Cleaning & Salons',
      desc: 'Manage customer bookings and direct service inquiries directly from your mobile vendor dashboard.',
    },
  ];

  const sliderPhotos = platformAboutPhotos && platformAboutPhotos.length > 0
    ? platformAboutPhotos.map((url, idx) => ({
        url,
        title: `IndianLalaJi Platform Showcase #${idx + 1}`,
        desc: 'Verified Indian local store storefront and digital product catalogue.',
      }))
    : defaultSliderImages;

  // Filter published & featured stores
  const publishedShops = shops.filter((s) => s.status === 'PUBLISHED');
  const featuredShops = publishedShops.filter((s) => s.isFeaturedInShowcase);

  let filteredStores: Shop[] = [];
  if (activeCategoryTab === 'FEATURED') {
    filteredStores = featuredShops.length > 0 ? featuredShops.slice(0, 6) : publishedShops.slice(0, 6);
  } else if (activeCategoryTab === 'ALL') {
    filteredStores = publishedShops.slice(0, 6);
  } else {
    filteredStores = publishedShops
      .filter((s) => s.category.toLowerCase().includes(activeCategoryTab.toLowerCase()))
      .slice(0, 6);
  }

  const handleCopyAdminUpi = () => {
    navigator.clipboard.writeText(adminUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const sections: MainWebsiteSectionsConfig = mainWebsiteSectionsConfig || {
    heroBanner: true,
    aboutStorySlider: true,
    videoTutorials: true,
    liveStoresShowcase: true,
    whyChooseUs: true,
    pricingPlan: true,
    adminPaymentQr: true,
    bottomCtaBanner: true,
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#FCF9F5]">
      
      {/* 1. EDITORIAL HERO SECTION */}
      {sections.heroBanner && (
        <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-16 bg-white border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Hero Column: Editorial Typography */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-[10px] font-black tracking-[0.2em] px-3.5 py-1.5 rounded-sm uppercase">
                <span>Digital Catalogue SaaS</span>
                <span>•</span>
                <span>Mobile First</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[0.95] font-['Outfit',sans-serif]">
                {platformHeroHeading}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                {platformHeroSubheading}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
                <button
                  id="hero-create-store-cta"
                  onClick={() => onOpenAuth('REGISTER')}
                  className="w-full sm:w-auto text-xs sm:text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 rounded-sm shadow-md shadow-orange-500/20 uppercase tracking-wider transition-all flex items-center justify-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-orange-200" />
                  <span>CREATE STORE FREE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-explore-stores-btn"
                  onClick={() => onNavigate('stores')}
                  className="w-full sm:w-auto text-xs sm:text-sm font-bold border-2 border-slate-900 text-slate-900 px-6 py-3 hover:bg-slate-900 hover:text-white transition-colors uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4 text-orange-600" />
                  <span>EXPLORE LIVE STORES</span>
                </button>
              </div>

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
                <div className="flex items-center gap-3.5 p-3.5 border border-gray-200 rounded-xl bg-gray-50/80">
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-lg shadow-xs shrink-0">
                    📱
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900 uppercase tracking-wide">Mobile-First Dashboard</p>
                    <p className="text-[11px] text-gray-500">Upload photos & prices directly from phone.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-3.5 border border-gray-200 rounded-xl bg-gray-50/80">
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-lg shadow-xs shrink-0">
                    🚀
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900 uppercase tracking-wide">Instant Shop ID</p>
                    <p className="text-[11px] text-gray-500">Get clean URL (e.g. /shop/SHP01234454).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Editorial Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl opacity-20 blur-xl"></div>
                
                {/* Visual Phone Frame */}
                <div className="relative bg-slate-950 rounded-[36px] p-3 border-4 border-slate-800 shadow-2xl">
                  <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>
                  
                  {/* Internal Mockup Screen */}
                  <div className="bg-[#FCF9F5] rounded-[24px] overflow-hidden border border-gray-200">
                    <div className="bg-orange-600 text-white p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white text-orange-600 font-black text-xs flex items-center justify-center">
                          LJ
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">Shree Lala Ji Store</div>
                          <div className="text-[9px] text-orange-200">SHP01234454 • UP</div>
                        </div>
                      </div>
                      <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded font-bold">LIVE</span>
                    </div>

                    <div className="p-3 space-y-2.5">
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                          alt="Store Demo"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Direct UPI Active
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="bg-white p-2 rounded-md border border-gray-200 shadow-2xs text-center">
                          <div className="text-[10px] font-bold text-slate-800">Desi Ghee (1kg)</div>
                          <div className="text-xs font-black text-orange-600">₹650</div>
                        </div>
                        <div className="bg-white p-2 rounded-md border border-gray-200 shadow-2xs text-center">
                          <div className="text-[10px] font-bold text-slate-800">Basmati Rice (5kg)</div>
                          <div className="text-xs font-black text-orange-600">₹420</div>
                        </div>
                      </div>

                      <div className="bg-emerald-600 text-white py-2 px-3 rounded-md text-center text-xs font-bold shadow-xs flex items-center justify-center gap-1">
                        <span>Direct WhatsApp Order</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* 2. ABOUT US & PLATFORM STORY */}
      {sections.aboutStorySlider && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Story Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-sm uppercase tracking-[0.2em]">
                <Building className="w-3.5 h-3.5" /> Our Mission & Vision
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight uppercase">
                Why We Built <span className="text-orange-600">IndianLalaJi.com</span>
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed">
                {platformAboutStory || "Local business owners across India do not need complex enterprise software, heavy commissions, or technical barriers. What they need is an intuitive, beautiful digital storefront they can manage in 2 minutes right from their phones—allowing customers to place orders directly on WhatsApp with zero intermediary fees."}
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom Visual Design & Color Palettes for Every Business</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Public Storefronts Protected with Super Admin Verification</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Customer Inquiries & Real-Time Leads Box</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenAuth('REGISTER')}
                  className="px-5 py-2.5 rounded-sm bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span>Start Your Store Now</span>
                  <ChevronRight className="w-4 h-4 text-orange-400" />
                </button>
              </div>
            </div>

            {/* Right Slider / Showcase */}
            <div className="lg:col-span-7">
              <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 group bg-slate-900">
                <div className="relative h-64 sm:h-96 w-full">
                  <img
                    src={sliderPhotos[activeSliderIdx % sliderPhotos.length].url}
                    alt={sliderPhotos[activeSliderIdx % sliderPhotos.length].title}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] font-black text-orange-300 uppercase tracking-widest mb-1">
                      Case #{activeSliderIdx + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif]">
                      {sliderPhotos[activeSliderIdx % sliderPhotos.length].title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-lg">
                      {sliderPhotos[activeSliderIdx % sliderPhotos.length].desc}
                    </p>
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                  <button
                    onClick={() => setActiveSliderIdx((prev) => (prev === 0 ? sliderPhotos.length - 1 : prev - 1))}
                    className="p-2 rounded-sm bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveSliderIdx((prev) => (prev === sliderPhotos.length - 1 ? 0 : prev + 1))}
                    className="p-2 rounded-sm bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Slider Indicator Dots */}
                <div className="absolute top-4 right-4 flex gap-1.5 z-10">
                  {sliderPhotos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSliderIdx(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSliderIdx === idx ? 'w-6 bg-orange-400' : 'w-2 bg-white/50'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* 3. VIDEO SHOWCASE SECTION (Uses VideoPlayerCard for Flawless Playback) */}
      {sections.videoTutorials && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1 text-[10px] font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-sm uppercase tracking-[0.2em]">
            <Play className="w-3.5 h-3.5 fill-orange-700" /> Video Guides & Tutorials
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight uppercase">
            Watch & Learn: <span className="text-orange-600">Video Tutorials</span>
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            4 step-by-step video guides to start, manage, and scale your digital store website on IndianLalaJi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tutorialVideos.slice(0, 4).map((vid, index) => (
            <VideoPlayerCard
              key={vid.id}
              id={vid.id}
              title={vid.title}
              youtubeUrl={vid.youtubeUrl}
              duration={vid.duration}
              description={vid.description}
              badge={`Tutorial #${index + 1}`}
            />
          ))}
        </div>
      </section>
      )}

      {/* 4. LIVE CLIENT STORES SHOWCASE WITH FEATURED FILTER */}
      {sections.liveStoresShowcase && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-sm uppercase tracking-[0.2em] mb-2">
              <Store className="w-3.5 h-3.5" /> Live Stores Showcase
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight uppercase">
              Recent Stores Built On <span className="text-orange-600">IndianLalaJi.com</span>
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Admin verified live stores actively accepting orders on WhatsApp & UPI.
            </p>
          </div>

          {/* Category & Featured Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveCategoryTab('FEATURED')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                activeCategoryTab === 'FEATURED'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-400'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>★ Featured Showcase ({featuredShops.length})</span>
            </button>
            <button
              onClick={() => setActiveCategoryTab('ALL')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategoryTab === 'ALL'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'
              }`}
            >
              All Stores ({publishedShops.length})
            </button>
            <button
              onClick={() => setActiveCategoryTab('Retail')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategoryTab === 'Retail'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'
              }`}
            >
              Retail & Kirana
            </button>
            <button
              onClick={() => setActiveCategoryTab('Clothing')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategoryTab === 'Clothing'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'
              }`}
            >
              Boutique
            </button>
            <button
              onClick={() => setActiveCategoryTab('Cleaning')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategoryTab === 'Cleaning'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'
              }`}
            >
              Services
            </button>
          </div>
        </div>

        {/* Store Cards: Image + Name + Owner + 2-line Description + Action Buttons */}
        {filteredStores.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No stores found in this category.</p>
            <button
              onClick={() => setActiveCategoryTab('ALL')}
              className="text-xs font-bold text-orange-600 uppercase underline"
            >
              View All Stores
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group p-4"
              >
                {/* Store Card Top Banner Image with Aspect 16/9 */}
                <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={shop.banners[0] || shop.logoUrl}
                    alt={shop.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Shop ID Pill */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white text-[9px] font-black text-slate-900 rounded uppercase tracking-wider shadow-xs border border-gray-100">
                    {shop.shopId}
                  </div>

                  {/* State Tag & Featured Badge */}
                  <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                    {shop.isFeaturedInShowcase && (
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                        <span>★ FEATURED</span>
                      </span>
                    )}
                    <span className="bg-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                      {shop.state}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-base uppercase tracking-tight text-slate-900 truncate">
                      {shop.businessName}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Owner: {shop.vendorName}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mt-1">
                      {shop.tagline || shop.aboutStory}
                    </p>
                  </div>

                  {/* Action Buttons: VIEW STORE & WHATSAPP */}
                  <div className="pt-3 border-t border-gray-100 flex gap-2">
                    <button
                      id={`view-store-btn-${shop.shopId}`}
                      onClick={() => onNavigate(`shop/${shop.shopId}`, shop.shopId)}
                      className="flex-1 text-[10px] font-bold uppercase tracking-wider py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors text-center"
                    >
                      VIEW STORE
                    </button>
                    <a
                      href={getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `Namaste ${shop.businessName} ji!`)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-[10px] font-bold uppercase tracking-wider py-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded transition-colors text-center"
                    >
                      WHATSAPP
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Stores CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => onNavigate('stores')}
            className="px-6 py-3 rounded-sm border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
          >
            <span>VIEW ALL SHOWCASE STORES</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
      )}

      {/* 5. OFFICIAL ADMIN PAYMENT QR & UPI BANNER */}
      {sections.adminPaymentQr && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-orange-600/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm border border-orange-500/30">
                <QrCode className="w-3.5 h-3.5" /> Official Platform Payment QR
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] tracking-tight uppercase">
                Direct UPI QR Payment <span className="text-orange-500">& 1-Year Store Activation</span>
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Scan the official IndianLalaJi QR code from PhonePe, GPay, Paytm, or BHIM to pay for your 1-Year package without any intermediary fees.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer Care & Support</div>
                  <a href={`tel:${customerCarePhone}`} className="text-sm font-bold text-orange-400 flex items-center gap-1.5 mt-0.5 hover:underline">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>+91 {customerCarePhone}</span>
                  </a>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Official WhatsApp Desk</div>
                  <a
                    href={getWhatsAppDirectUrl(customerCareWhatsapp, 'Namaste IndianLalaJi! Need help with store setup')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5 hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>+91 {customerCareWhatsapp}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* QR Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white text-slate-900 p-5 rounded-2xl shadow-2xl border border-gray-200 text-center space-y-3 w-full max-w-xs">
                <div className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-50 py-1 rounded">
                  Official Direct UPI QR Code
                </div>

                <div className="w-48 h-48 mx-auto bg-gray-50 rounded-xl border-2 border-dashed border-orange-300 p-2 flex items-center justify-center">
                  <img
                    src={adminPaymentQrUrl}
                    alt="Official Payment QR"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Account Holder</div>
                  <div className="text-xs font-bold text-slate-900">{adminAccountHolder}</div>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={adminUpiId}
                    className="w-full px-2.5 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono font-bold text-slate-800 text-center"
                  />
                  <button
                    onClick={handleCopyAdminUpi}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold flex items-center gap-1 shrink-0 hover:bg-black transition-colors"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Done' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* 6. BUSINESS CATEGORIES */}
      {sections.whyChooseUs && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1 text-[10px] font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-sm uppercase tracking-[0.2em]">
            <Layers className="w-3.5 h-3.5" /> Supported Categories
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight uppercase">
            Stores by <span className="text-orange-600">Business Category</span>
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            Choose your business type. Every category features customized layouts, product cards, and direct WhatsApp ordering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BUSINESS_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded uppercase tracking-wider">
                    Category #{idx + 1}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Ready to Launch</span>
                </div>
                
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {cat.name}
                </h3>
                
                <p className="text-xs text-gray-500 leading-relaxed">
                  Includes tailored product cards, category filters, WhatsApp cart strip, UPI payment popup, and location map.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => onNavigate('stores')}
                  className="py-2 px-3 text-center text-xs font-bold uppercase tracking-wider text-slate-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  Explore Stores
                </button>
                <button
                  onClick={() => onOpenAuth('REGISTER')}
                  className="py-2 px-3 text-center text-xs font-bold uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 rounded transition-colors shadow-xs"
                >
                  Build Store
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* 7. PRICING PLANS (1-Year Single Master Plan) */}
      {sections.pricingPlan && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-sm uppercase tracking-[0.2em]">
            <Tag className="w-3.5 h-3.5" /> 1-Year All-In-One Plan
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight uppercase">
            Simple 1-Year Plan For <span className="text-orange-600">Every Business</span>
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            All features are included for a full year (365 days) with zero hidden fees. Includes WhatsApp ordering, direct UPI payments, and high-speed hosting.
          </p>
        </div>

        {(() => {
          const singlePkg = (pricingPackages && pricingPackages.length > 0) ? pricingPackages[0] : {
            id: 'pkg_annual_master',
            name: '1-Year Official LalaJi Store Plan',
            originalPrice: 4999,
            price: 1499,
            period: 'Per Year (1 Year Validity - 365 Days)',
            badge: '1-YEAR ALL-IN-ONE PLAN 🇮🇳',
            description: 'Complete mobile-first digital store solution with 1-Year validity, WhatsApp order engine, direct UPI QR, photo gallery, videos, and full vendor dashboard.',
            features: [
              '1 Full Year (365 Days) Store Hosting & Live Validity',
              'Dedicated Unique Shop Link (e.g. indianlalaji.com/?shop=SHP01234454)',
              'Unlimited Products & Services Showcase',
              '1-Click WhatsApp Direct Ordering & Cart System',
              'Direct UPI QR Code Payment Setup',
              'Up to 8 YouTube Video Tutorials & Demos Embeds',
              'HD Photo Gallery with Full Masonry Showcase',
              'Dynamic Theme & Color Palette Switcher',
              '24/7 Mobile Vendor Dashboard (Live Price, Stock & Description Updates)',
              'Customer Inquiries, Leads Box & Direct Calling',
              'Admin Verified Official Store Badge & Google Maps Location',
              'Priority Phone & WhatsApp Customer Support (7087033009)',
            ],
            isPopular: true,
          };

          return (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative bg-white border-2 border-orange-600 shadow-xl">
                {singlePkg.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-sm shadow-md whitespace-nowrap">
                    {singlePkg.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif] uppercase tracking-tight">
                      {singlePkg.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {singlePkg.description}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="py-3.5 border-y border-gray-100 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit',sans-serif]">
                        {formatINR(singlePkg.price)}
                      </span>
                      <span className="text-sm text-gray-400 line-through font-semibold">
                        {formatINR(singlePkg.originalPrice)}
                      </span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        SAVE {Math.round(((singlePkg.originalPrice - singlePkg.price) / singlePkg.originalPrice) * 100)}%
                      </span>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      {singlePkg.period}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-2">
                    {singlePkg.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setSelectedPackageToOrder(singlePkg)}
                    className="w-full py-3.5 rounded-sm font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 active:scale-[0.99]"
                  >
                    <span>Order 1-Year Store Plan Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[11px] text-gray-400 mt-2">
                    Instant activation with direct UPI payment & WhatsApp setup.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </section>
      )}

      {/* 8. CUSTOMER TESTIMONIALS */}
      {sections.bottomCtaBanner && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-1 text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-400" />
                ))}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] tracking-tight uppercase">
                “Receiving 15+ New Customer Orders Daily on WhatsApp”
              </h2>
              <p className="text-gray-300 text-sm italic">
                “We used to think building an e-commerce website was complicated and expensive. With IndianLalaJi, we uploaded product photos from our mobile phone in just 2 minutes and our store link went live immediately. Customers now send their carts directly to our WhatsApp!”
              </p>
              <div className="pt-2">
                <div className="font-bold text-orange-400 text-sm uppercase tracking-wider">Ramesh Chand Gupta</div>
                <div className="text-xs text-gray-400">Lala Ji Mega Kirana Store, Varanasi (UP)</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 1-Package Order Modal */}
      <PackageOrderModal
        isOpen={!!selectedPackageToOrder}
        onClose={() => setSelectedPackageToOrder(null)}
        selectedPackage={selectedPackageToOrder}
        adminPaymentQrUrl={adminPaymentQrUrl}
        adminUpiId={adminUpiId}
        adminAccountHolder={adminAccountHolder}
        adminPhone={customerCarePhone}
        adminWhatsapp={customerCareWhatsapp}
        onProceedToRegister={(pkg) => {
          setSelectedPackageToOrder(null);
          onOpenAuth('REGISTER');
        }}
      />

    </div>
  );
};

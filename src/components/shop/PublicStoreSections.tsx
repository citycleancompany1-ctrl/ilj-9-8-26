import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  Clock,
  ShoppingBag,
  Plus,
  Minus,
  Briefcase,
  Layers,
  Award,
  Users,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  Tag,
  Check,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  ArrowUpRight,
  X,
  Copy,
  Share2,
  Play,
  Maximize2,
  Image as ImageIcon,
  SlidersHorizontal,
  Camera,
  MessageCircle,
  Send,
} from 'lucide-react';
import {
  Shop,
  ShopSectionsConfig,
  HeroBannerSectionConfig,
  HeroSectionConfig,
  AboutSectionConfig,
  FeaturesSectionConfig,
  ServicesSectionConfig,
  CoursesSectionConfig,
  HowItWorksSectionConfig,
  BenefitsSectionConfig,
  TestimonialsSectionConfig,
  PricingSectionConfig,
  OffersSectionConfig,
  OfferBannerItem,
  PortfolioSectionConfig,
  GallerySectionConfig,
  VideoSectionConfig,
  VideoItem,
  TeamSectionConfig,
  FaqSectionConfig,
  CtaSectionConfig,
  ContactSectionConfig,
  SocialMediaSectionConfig,
  BlogSectionConfig,
  BlogPostItem,
  FooterSectionConfig,
  ProductItem,
  CartItem,
} from '../../types';
import { getWhatsAppDirectUrl, formatINR, getYouTubeEmbedUrl } from '../../utils/mediaUpload';
import { StoreItemsCarouselSection } from './StoreItemsCarouselSection';
import { CardDetailModal, CardDetailModalData } from '../modals/CardDetailModal';

// ==========================================
// 0. HERO BANNER SLIDER (STANDALONE SECTION)
// ==========================================
export const HeroBannerRenderer: React.FC<{
  config?: HeroBannerSectionConfig;
  shop: Shop;
}> = ({ config, shop }) => {
  const isEnabled = config ? config.enabled !== false : shop.heroBannerEnabled !== false;
  if (!isEnabled) return null;

  // 1. DESKTOP BANNERS (Strictly up to 4 banners)
  const rawDesktopBanners = (shop.desktopBanners && shop.desktopBanners.filter(Boolean).length > 0)
    ? shop.desktopBanners.filter(Boolean)
    : (shop.banners && shop.banners.filter(Boolean).length > 0)
      ? shop.banners.filter(Boolean)
      : [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=1600&auto=format&fit=crop&q=80',
        ];
  const desktopBanners = rawDesktopBanners.slice(0, 4);

  // 2. MOBILE BANNERS
  // USER REQUIREMENT:
  // "Checkbox ON karte hi Mobile ka uploaded banner completely ignore/hide hoga, aur mobile par sirf Desktop banner show hoga. Checkbox OFF ho to existing separate mobile-banner system chalega."
  const useDesktopOnMobile = Boolean(
    config?.useDesktopBannerOnMobile ?? shop.useDesktopBannerOnMobile ?? shop.sectionsConfig?.heroBanner?.useDesktopBannerOnMobile
  );

  const rawMobileBanners = useDesktopOnMobile
    ? desktopBanners
    : (shop.mobileBanners && shop.mobileBanners.filter(Boolean).length > 0)
      ? shop.mobileBanners.filter(Boolean)
      : [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=1000&fit=crop&q=80',
          'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&h=1000&fit=crop&q=80',
        ];
  const mobileBanners = rawMobileBanners.slice(0, useDesktopOnMobile ? 4 : 3);

  // Desktop Carousel State
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [isDesktopPaused, setIsDesktopPaused] = useState(false);

  // Mobile Carousel State
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isMobilePaused, setIsMobilePaused] = useState(false);

  // Touch Swipe for Mobile Carousel
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Desktop Auto-Slide (every 4.5 seconds)
  useEffect(() => {
    if (desktopBanners.length <= 1 || isDesktopPaused) return;
    const interval = setInterval(() => {
      setDesktopIndex((prev) => (prev + 1) % desktopBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [desktopBanners.length, isDesktopPaused]);

  // Mobile Auto-Slide (every 4.0 seconds)
  useEffect(() => {
    if (mobileBanners.length <= 1 || isMobilePaused) return;
    const interval = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % mobileBanners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [mobileBanners.length, isMobilePaused]);

  const handlePrevDesktop = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDesktopIndex((prev) => (prev - 1 + desktopBanners.length) % desktopBanners.length);
  };

  const handleNextDesktop = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDesktopIndex((prev) => (prev + 1) % desktopBanners.length);
  };

  const handlePrevMobile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMobileIndex((prev) => (prev - 1 + mobileBanners.length) % mobileBanners.length);
  };

  const handleNextMobile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMobileIndex((prev) => (prev + 1) % mobileBanners.length);
  };

  // Mobile Touch Handlers for swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsMobilePaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsMobilePaused(false);
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      setMobileIndex((prev) => (prev + 1) % mobileBanners.length);
    } else if (distance < -minSwipeDistance) {
      setMobileIndex((prev) => (prev - 1 + mobileBanners.length) % mobileBanners.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div id="hero-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* A) DESKTOP BANNER SLIDER (hidden md:block) - Up to 4 banners */}
      <div 
        className="hidden md:block relative rounded-2xl lg:rounded-3xl overflow-hidden border border-gray-200/90 shadow-xs bg-slate-100 group w-full"
        onMouseEnter={() => setIsDesktopPaused(true)}
        onMouseLeave={() => setIsDesktopPaused(false)}
      >
        <div className="relative w-full">
          {desktopBanners.map((imgUrl, idx) => {
            const isActive = idx === desktopIndex;
            return (
              <div
                key={`desk-slide-${idx}`}
                className={`w-full transition-opacity duration-500 ease-in-out ${
                  isActive ? 'relative opacity-100 z-10' : 'absolute inset-0 opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${shop.businessName} Desktop Banner ${idx + 1}`}
                  className="w-full h-auto block select-none"
                  loading="eager"
                />
              </div>
            );
          })}
        </div>

        {/* Desktop Controls: Left & Right Arrows */}
        {desktopBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevDesktop}
              aria-label="Previous Desktop Banner"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md backdrop-blur-md flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-slate-900" />
            </button>

            <button
              type="button"
              onClick={handleNextDesktop}
              aria-label="Next Desktop Banner"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md backdrop-blur-md flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-slate-900" />
            </button>

            {/* Slide Counter Badge */}
            <div className="absolute top-4 right-4 z-20 bg-slate-950/70 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-xs">
              Banner {desktopIndex + 1} / {desktopBanners.length}
            </div>

            {/* Bottom Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              {desktopBanners.map((_, idx) => (
                <button
                  key={`desk-dot-${idx}`}
                  type="button"
                  onClick={() => setDesktopIndex(idx)}
                  className={`transition-all rounded-full cursor-pointer ${
                    idx === desktopIndex
                      ? 'w-7 h-2.5 bg-orange-500 shadow-xs'
                      : 'w-2.5 h-2.5 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Go to Desktop Banner ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* B) MOBILE BANNER SLIDER (block md:hidden) */}
      <div 
        className="block md:hidden relative rounded-2xl overflow-hidden border border-gray-200 shadow-xs bg-slate-100 w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full">
          {mobileBanners.map((imgUrl, idx) => {
            const isActive = idx === mobileIndex;
            return (
              <div
                key={`mob-slide-${idx}`}
                className={`w-full transition-opacity duration-500 ease-in-out ${
                  isActive ? 'relative opacity-100 z-10' : 'absolute inset-0 opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${shop.businessName} Mobile Banner ${idx + 1}`}
                  className="w-full h-auto block select-none"
                  loading="eager"
                />
              </div>
            );
          })}
        </div>

        {/* Mobile Slide Counter Badge */}
        {mobileBanners.length > 1 && (
          <div className="absolute top-2.5 right-2.5 z-20 bg-slate-950/75 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20 shadow-xs">
            Banner {mobileIndex + 1} / {mobileBanners.length}
          </div>
        )}

        {/* Mobile Navigation Controls */}
        {mobileBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevMobile}
              aria-label="Previous Banner"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 text-slate-900 shadow-xs backdrop-blur-md flex items-center justify-center cursor-pointer border border-gray-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNextMobile}
              aria-label="Next Banner"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 text-slate-900 shadow-xs backdrop-blur-md flex items-center justify-center cursor-pointer border border-gray-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom Dots Indicator */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              {mobileBanners.map((_, idx) => (
                <button
                  key={`mob-dot-${idx}`}
                  type="button"
                  onClick={() => setMobileIndex(idx)}
                  className={`transition-all rounded-full cursor-pointer ${
                    idx === mobileIndex
                      ? 'w-5 h-2 bg-orange-500 shadow-xs'
                      : 'w-2 h-2 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Go to Mobile Banner ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 1. HERO SECTION (STORE PROFILE & HEADLINE)
// ==========================================
export const HeroSectionRenderer: React.FC<{
  config: HeroSectionConfig;
  shop: Shop;
  onCtaClick?: () => void;
  renderBannerSeparately?: boolean;
}> = ({ config, shop, onCtaClick, renderBannerSeparately = false }) => {
  if (!config.enabled) return null;

  const handleCta = () => {
    if (config.ctaLink === 'whatsapp') {
      window.open(
        getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `Namaste ${shop.businessName}! I am interested in your products/services.`),
        '_blank'
      );
    } else if (config.ctaLink.startsWith('#')) {
      const el = document.querySelector(config.ctaLink);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (config.ctaLink) {
      window.open(config.ctaLink, '_blank');
    } else if (onCtaClick) {
      onCtaClick();
    }
  };

  const handleSecondaryCta = () => {
    window.open(
      getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `Namaste! I would like to chat with ${shop.vendorName}.`),
      '_blank'
    );
  };

  const showInternalBanner = !renderBannerSeparately && (
    shop.sectionsConfig?.heroBanner ? shop.sectionsConfig.heroBanner.enabled !== false : shop.heroBannerEnabled !== false
  );

  return (
    <section 
      id="hero" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6"
    >
      {/* If banner is not rendered as its own section above, render it here when enabled */}
      {showInternalBanner && (
        <HeroBannerRenderer config={shop.sectionsConfig?.heroBanner} shop={shop} />
      )}

      {/* =========================================================================
          2. STORE PROFILE HEADER SECTION (Placed right under Hero Banner Slider)
          ========================================================================= */}
      <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white rounded-2xl sm:rounded-3xl border border-orange-200/90 p-5 sm:p-8 lg:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left: Store Identity, Badges, Headline, Description & CTA Buttons */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Top Merchant Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-950 border border-orange-200 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>{config.badge || '★ Verified Local Merchant 🇮🇳'}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Direct Store</span>
              </span>
            </div>

            {/* Store Identification Bar */}
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={shop.logoUrl}
                  alt={shop.businessName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-orange-300 shadow-xs bg-white"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-xs" title="Verified Store">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 font-['Outfit',sans-serif] truncate">
                  {shop.businessName}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-0.5">
                  <span className="font-mono font-bold text-orange-600 text-[11px]">{shop.shopId}</span>
                  {shop.city && (
                    <>
                      <span>•</span>
                      <span className="truncate">{shop.city}{shop.state ? `, ${shop.state}` : ''}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Main Headline & Subheading */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-950 font-['Outfit',sans-serif] leading-tight">
                {config.heading}
              </h1>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl font-medium">
                {config.subheading}
              </p>
            </div>

            {/* Action CTA Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCta}
                className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{config.ctaText || 'Explore Products & Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSecondaryCta}
                className="px-5 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold uppercase tracking-wider text-xs sm:text-sm rounded-xl border border-emerald-300 shadow-2xs flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>{config.secondaryCtaText || 'WhatsApp Direct Chat'}</span>
              </button>
            </div>

            {/* Trust Badges Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-[11px] text-slate-800 border-t border-orange-200/60">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine Quality</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <Zap className="w-4 h-4 text-orange-600" />
                <span>Direct 0% UPI Rates</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Express Local Delivery</span>
              </span>
            </div>

          </div>

          {/* Right: Live Store Snapshot Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-orange-200/90 p-5 sm:p-6 shadow-md space-y-4">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Store Status & Services
                </span>
                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                  Verified Merchant
                </span>
              </div>

              {/* Status & Key Attributes */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-100 shadow-2xs">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Live Status</div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Open Now</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 shadow-2xs">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Store Rating</div>
                  <div className="flex items-center gap-1 text-amber-900 font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>4.9 / 5.0 (Verified)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Working Hours</div>
                  <div className="text-slate-800 font-semibold text-[11px] mt-0.5 truncate">
                    {shop.workingHours || '9:00 AM - 9:00 PM'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 shadow-2xs">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Direct Payment</div>
                  <div className="text-blue-800 font-mono text-[11px] font-bold mt-0.5 truncate">
                    0% UPI QR Scan
                  </div>
                </div>
              </div>

              {/* Quick Action Button inside Card */}
              <button
                type="button"
                onClick={handleCta}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-101"
              >
                <span>Browse Products & Services</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ==========================================
// 2. ABOUT SECTION
// ==========================================
export const AboutSectionRenderer: React.FC<{
  config: AboutSectionConfig;
  shop: Shop;
}> = ({ config, shop }) => {
  if (!config.enabled) return null;

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: About Image with Badges */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-gray-100 relative group">
              <img
                src={config.imageUrl || shop.aboutPhotoUrl || shop.banners?.[0] || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800'}
                alt={config.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating Experience Badge */}
              {config.yearsOfExperience && (
                <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 shadow-lg">
                  <div className="text-[10px] font-black uppercase tracking-wider text-orange-400">Store Trust</div>
                  <div className="text-sm sm:text-base font-black font-['Outfit',sans-serif]">{config.yearsOfExperience}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Text & Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
              <Award className="w-3.5 h-3.5" /> About Proprietor & Store
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
              {config.title}
            </h2>

            {config.subtitle && (
              <p className="text-xs sm:text-sm font-semibold text-orange-600 uppercase tracking-wide">
                {config.subtitle}
              </p>
            )}

            {config.storyHeading && (
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                {config.storyHeading}
              </h3>
            )}

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {config.description}
            </p>

            {/* Highlights bullet list */}
            {config.highlights && config.highlights.length > 0 && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {config.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Contact quick call action */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${shop.phone}`}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-all hover:scale-101"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
                <span>Call Store: {shop.phone}</span>
              </a>
              <a
                href={getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `Namaste! I would like to inquire about ${shop.businessName}.`)}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-xs transition-all hover:scale-101"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

// ==========================================
// 3. WHY CHOOSE US / KEY FEATURES SECTION
// ==========================================
export const FeaturesSectionRenderer: React.FC<{
  config: FeaturesSectionConfig;
}> = ({ config }) => {
  if (!config.enabled || !config.items || config.items.length === 0) return null;

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const [activeDesktopSlide, setActiveDesktopSlide] = useState(0);
  const [cardModalData, setCardModalData] = useState<CardDetailModalData | null>(null);

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const totalItems = config.items.length;

  // Mobile scroll handler: 2 items visible + 10% peek of 3rd item
  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const { scrollLeft, clientWidth } = mobileScrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    if (slideWidth > 0) {
      const index = Math.round(scrollLeft / slideWidth);
      setActiveMobileSlide(Math.min(Math.max(0, index), totalItems - 1));
    }
  };

  const scrollMobileToSlide = (idx: number) => {
    if (!mobileScrollRef.current) return;
    const { clientWidth } = mobileScrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    mobileScrollRef.current.scrollTo({
      left: idx * slideWidth,
      behavior: 'smooth',
    });
    setActiveMobileSlide(idx);
  };

  const mobileSlidePrev = () => {
    scrollMobileToSlide(Math.max(0, activeMobileSlide - 1));
  };

  const mobileSlideNext = () => {
    scrollMobileToSlide(Math.min(totalItems - 1, activeMobileSlide + 1));
  };

  // Desktop scroll handler: 4 items visible + 10% peek of 5th item
  const handleDesktopScroll = () => {
    if (!desktopScrollRef.current) return;
    const { scrollLeft, clientWidth } = desktopScrollRef.current;
    // 4 items visible + 10% peek of 5th card with 16px gap
    const slideWidth = (clientWidth - 48) / 4.15 + 16;
    if (slideWidth > 0) {
      const index = Math.round(scrollLeft / slideWidth);
      setActiveDesktopSlide(Math.min(Math.max(0, index), totalItems - 1));
    }
  };

  const scrollDesktopToSlide = (idx: number) => {
    if (!desktopScrollRef.current) return;
    const { clientWidth } = desktopScrollRef.current;
    const slideWidth = (clientWidth - 48) / 4.15 + 16;
    desktopScrollRef.current.scrollTo({
      left: idx * slideWidth,
      behavior: 'smooth',
    });
    setActiveDesktopSlide(idx);
  };

  const desktopSlidePrev = () => {
    scrollDesktopToSlide(Math.max(0, activeDesktopSlide - 1));
  };

  const desktopSlideNext = () => {
    scrollDesktopToSlide(Math.min(totalItems - 1, activeDesktopSlide + 1));
  };

  return (
    <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <CheckCircle2 className="w-3.5 h-3.5" /> Why Choose Us
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {config.title || 'Why Choose Us'}
        </h2>
        {config.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
        )}
      </div>

      {/* Desktop View (sm and up) */}
      <div className="hidden sm:block">
        {totalItems <= 4 || isExpanded ? (
          /* Grid View: when items are 4 or less, or when user expanded */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in duration-300">
            {config.items.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() =>
                  setCardModalData({
                    title: item.title,
                    description: item.description,
                    sectionName: config.title || 'Why Choose Us',
                    badge: `#0${idx + 1}`,
                    icon: <Sparkles className="w-5 h-5 text-orange-600" />,
                  })
                }
                className="bg-white rounded-2xl border border-gray-200 p-5 lg:p-6 shadow-xs hover:shadow-md hover:border-orange-300 transition-all group space-y-3 cursor-pointer flex flex-col justify-between"
                title="Click to view full details"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 font-mono">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Carousel View (>= 5 items): 4 cards visible + ~10% peek of 5th card */
          <div className="relative">
            <div
              ref={desktopScrollRef}
              onScroll={handleDesktopScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x [&::-webkit-scrollbar]:hidden"
            >
              {config.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() =>
                    setCardModalData({
                      title: item.title,
                      description: item.description,
                      sectionName: config.title || 'Why Choose Us',
                      badge: `#0${idx + 1}`,
                      icon: <Sparkles className="w-5 h-5 text-orange-600" />,
                    })
                  }
                  className="w-[calc((100%-48px)/4.15)] min-w-[calc((100%-48px)/4.15)] max-w-[calc((100%-48px)/4.15)] snap-start shrink-0 flex-none bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md hover:border-orange-300 transition-all group space-y-3 cursor-pointer flex flex-col justify-between"
                  title="Click to view full details"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 font-mono">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Navigation Arrows & Dots */}
            <div className="flex items-center justify-between mt-4 px-1">
              <div className="flex items-center gap-1.5">
                {config.items.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollDesktopToSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeDesktopSlide === idx
                        ? 'w-6 bg-orange-600'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={desktopSlidePrev}
                  disabled={activeDesktopSlide === 0}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                  aria-label="Previous features"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={desktopSlideNext}
                  disabled={activeDesktopSlide >= totalItems - 4}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                  aria-label="Next features"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop View All Button - Only shown when total items > 7 */}
        {totalItems > 7 && (
          <div className="flex justify-center pt-6 sm:pt-8">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>{isExpanded ? 'Collapse to Slider' : `View All Features (${totalItems})`}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-orange-600" /> : <ChevronDown className="w-4 h-4 text-orange-600" />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile View (sm:hidden) - Slider / Expand Logic */}
      <div className="sm:hidden">
        {isExpanded ? (
          /* Expanded View: 2-column grid showing all features */
          <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-300">
            {config.items.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() =>
                  setCardModalData({
                    title: item.title,
                    description: item.description,
                    sectionName: config.title || 'Why Choose Us',
                    badge: `#0${idx + 1}`,
                    icon: <Sparkles className="w-5 h-5 text-orange-600" />,
                  })
                }
                className="bg-white rounded-xl border border-gray-200 p-3 shadow-xs space-y-2 flex flex-col justify-between cursor-pointer hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">
                    0{idx + 1}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
                <span className="text-[9px] text-orange-600 font-bold uppercase tracking-wider block pt-1">
                  Tap to read full →
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Mobile Slider View: 2 items visible + ~10% peek of next card */
          <div>
            <div
              ref={mobileScrollRef}
              onScroll={handleMobileScroll}
              className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x [&::-webkit-scrollbar]:hidden"
            >
              {config.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() =>
                    setCardModalData({
                      title: item.title,
                      description: item.description,
                      sectionName: config.title || 'Why Choose Us',
                      badge: `#0${idx + 1}`,
                      icon: <Sparkles className="w-5 h-5 text-orange-600" />,
                    })
                  }
                  className={`bg-white rounded-xl border border-gray-200 p-3 shadow-xs space-y-2 snap-start shrink-0 flex-none transition-all flex flex-col justify-between cursor-pointer hover:border-orange-300 ${
                    totalItems >= 3
                      ? 'w-[calc((100%-20px)/2.15)] min-w-[calc((100%-20px)/2.15)] max-w-[calc((100%-20px)/2.15)]'
                      : totalItems === 2
                      ? 'w-[calc((100%-10px)/2)] min-w-[calc((100%-10px)/2)]'
                      : 'w-full min-w-full'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-[9px] text-orange-600 font-bold uppercase tracking-wider block pt-0.5">
                    Tap to read full →
                  </span>
                </div>
              ))}
            </div>

            {/* Slider Navigation & Dots (if more than 2 items) */}
            {totalItems > 2 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {config.items.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollMobileToSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeMobileSlide === idx
                          ? 'w-5 bg-orange-600'
                          : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={mobileSlidePrev}
                    disabled={activeMobileSlide === 0}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Previous feature"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={mobileSlideNext}
                    disabled={activeMobileSlide === totalItems - 1}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Next feature"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View All Button: Only shown when total features >= 4 on mobile */}
        {totalItems >= 4 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>{isExpanded ? 'Collapse to Slider' : `View All (${totalItems})`}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-orange-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-orange-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Card Content Modal Popup */}
      <CardDetailModal
        isOpen={Boolean(cardModalData)}
        onClose={() => setCardModalData(null)}
        data={cardModalData}
      />
    </section>
  );
};

// ==========================================
// 4. SERVICES SECTION (Product Card Visual Style)
// ==========================================
export const ServicesSectionRenderer: React.FC<{
  config?: ServicesSectionConfig;
  shop: Shop;
  catalogServices?: ProductItem[];
  cart?: CartItem[];
  onAddToCart?: (product: ProductItem) => void;
  onRemoveFromCart?: (productId: string) => void;
  onBookService?: (serviceName: string) => void;
  onSelectService?: (serviceProduct: ProductItem) => void;
}> = ({
  config,
  shop,
  catalogServices = [],
  cart = [],
  onAddToCart,
  onRemoveFromCart,
  onBookService,
  onSelectService,
}) => {
  // If explicitly disabled in config, don't show
  if (config && !config.enabled) return null;

  // Filter unique verified services created by merchant
  const seenTitles = new Set<string>();
  const uniqueServices: ProductItem[] = [];
  catalogServices.forEach((p) => {
    const key = p.name.trim().toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      uniqueServices.push(p);
    }
  });

  if (uniqueServices.length === 0) return null;

  return (
    <StoreItemsCarouselSection
      id="services"
      title={config?.title || 'Our Services'}
      subtitle={config?.subtitle || 'Book verified expert services directly with zero middleman fee.'}
      badgeText="Professional Services"
      isService={true}
      items={uniqueServices}
      shop={shop}
      cart={cart}
      onAddToCart={onAddToCart || (() => {})}
      onRemoveFromCart={onRemoveFromCart || (() => {})}
      onSelectItem={(serviceProd) => {
        if (onSelectService) onSelectService(serviceProd);
      }}
    />
  );
};

// ==========================================
// COURSES SECTION (Rendered from Store's Courses Catalogue)
// ==========================================
export const CoursesSectionRenderer: React.FC<{
  config?: CoursesSectionConfig;
  shop: Shop;
  catalogCourses?: ProductItem[];
  cart?: CartItem[];
  onAddToCart?: (product: ProductItem) => void;
  onRemoveFromCart?: (productId: string) => void;
  onSelectCourse?: (courseProduct: ProductItem) => void;
}> = ({
  config,
  shop,
  catalogCourses = [],
  cart = [],
  onAddToCart,
  onRemoveFromCart,
  onSelectCourse,
}) => {
  // If explicitly disabled in config, don't show
  if (config && !config.enabled) return null;

  // Filter unique verified courses created by merchant
  const seenTitles = new Set<string>();
  const uniqueCourses: ProductItem[] = [];
  catalogCourses.forEach((p) => {
    const key = p.name.trim().toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      uniqueCourses.push(p);
    }
  });

  if (uniqueCourses.length === 0) return null;

  return (
    <StoreItemsCarouselSection
      id="courses"
      title={config?.title || 'Our Courses & Training'}
      subtitle={config?.subtitle || 'Skill-up karein hamare practical batches aur certified courses ke sath.'}
      badgeText={config?.badge || 'Courses & Training 🎓'}
      isCourse={true}
      itemType="COURSE"
      items={uniqueCourses}
      shop={shop}
      cart={cart}
      onAddToCart={onAddToCart || (() => {})}
      onRemoveFromCart={onRemoveFromCart || (() => {})}
      onSelectItem={(courseProd) => {
        if (onSelectCourse) onSelectCourse(courseProd);
      }}
    />
  );
};

// ==========================================
// 6. HOW IT WORKS SECTION
// ==========================================
export const HowItWorksSectionRenderer: React.FC<{
  config: HowItWorksSectionConfig;
}> = ({ config }) => {
  if (!config.enabled || !config.steps || config.steps.length === 0) return null;

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/30 rounded-3xl border border-indigo-100 p-4 sm:p-10 shadow-xs">
        
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
            <Layers className="w-3.5 h-3.5" /> Simple 3-Step Process
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="text-xs sm:text-sm text-gray-600">{config.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {config.steps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs relative space-y-3 group hover:border-indigo-300 transition-all"
            >
              {/* Step Number Circle */}
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                {step.stepNumber || idx + 1}
              </div>

              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                {step.title}
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// ==========================================
// 7. BENEFITS SECTION
// ==========================================
export const BenefitsSectionRenderer: React.FC<{
  config: BenefitsSectionConfig;
}> = ({ config }) => {
  if (!config.enabled || !config.items || config.items.length === 0) return null;

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [cardModalData, setCardModalData] = useState<CardDetailModalData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalItems = config.items.length;
  const displayedDesktopItems = isExpanded ? config.items : config.items.slice(0, 4);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    // 2 items visible + 10% peek of 3rd item + 10px gap
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    if (slideWidth > 0) {
      const index = Math.round(scrollLeft / slideWidth);
      setActiveSlide(Math.min(Math.max(0, index), totalItems - 1));
    }
  };

  const scrollToSlide = (idx: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    scrollRef.current.scrollTo({
      left: idx * slideWidth,
      behavior: 'smooth',
    });
    setActiveSlide(idx);
  };

  const slidePrev = () => {
    scrollToSlide(Math.max(0, activeSlide - 1));
  };

  const slideNext = () => {
    scrollToSlide(Math.min(totalItems - 1, activeSlide + 1));
  };

  return (
    <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <Star className="w-3.5 h-3.5" /> Customer Value & Perks
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {config.title}
        </h2>
        {config.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
        )}
      </div>

      {/* Desktop Grid Layout (sm and up) */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayedDesktopItems.map((b, idx) => (
          <div
            key={b.id || idx}
            onClick={() =>
              setCardModalData({
                title: b.title,
                description: b.description,
                sectionName: config.title || 'Customer Value & Perks',
                stat: b.stat,
                badge: `Perk #${idx + 1}`,
                icon: <ShieldCheck className="w-5 h-5 text-yellow-600" />,
              })
            }
            className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs hover:shadow-md hover:border-yellow-400 transition-all space-y-3 cursor-pointer flex flex-col justify-between"
            title="Click to view full details"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-100 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                {b.stat && (
                  <span className="text-[10px] font-black text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                    {b.stat}
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                {b.title}
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                {b.description}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-yellow-700 uppercase tracking-wider">
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View (sm:hidden) - Slider / Expand Logic */}
      <div className="sm:hidden">
        {isExpanded ? (
          /* Expanded View: 2-column grid showing all benefits */
          <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-300">
            {config.items.map((b, idx) => (
              <div
                key={b.id || idx}
                onClick={() =>
                  setCardModalData({
                    title: b.title,
                    description: b.description,
                    sectionName: config.title || 'Customer Value & Perks',
                    stat: b.stat,
                    badge: `Perk #${idx + 1}`,
                    icon: <ShieldCheck className="w-5 h-5 text-yellow-600" />,
                  })
                }
                className="bg-white rounded-xl border border-gray-200 p-3 shadow-xs space-y-2 flex flex-col justify-between cursor-pointer hover:border-yellow-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-100 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1">
                    {b.stat && (
                      <span className="text-[9px] font-black text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
                        {b.stat}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-gray-400 font-mono">
                      0{idx + 1}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] line-clamp-1">
                    {b.title}
                  </h3>
                  <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-3">
                    {b.description}
                  </p>
                </div>
                <span className="text-[9px] text-yellow-700 font-bold uppercase tracking-wider block pt-1">
                  Tap to read full →
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Mobile Slider View: 2 items visible + ~10% peek of next card */
          <div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x [&::-webkit-scrollbar]:hidden"
            >
              {config.items.map((b, idx) => (
                <div
                  key={b.id || idx}
                  onClick={() =>
                    setCardModalData({
                      title: b.title,
                      description: b.description,
                      sectionName: config.title || 'Customer Value & Perks',
                      stat: b.stat,
                      badge: `Perk #${idx + 1}`,
                      icon: <ShieldCheck className="w-5 h-5 text-yellow-600" />,
                    })
                  }
                  className={`bg-white rounded-xl border border-gray-200 p-3 shadow-xs space-y-2 snap-start shrink-0 flex-none transition-all flex flex-col justify-between cursor-pointer hover:border-yellow-300 ${
                    totalItems >= 3
                      ? 'w-[calc((100%-20px)/2.15)] min-w-[calc((100%-20px)/2.15)] max-w-[calc((100%-20px)/2.15)]'
                      : totalItems === 2
                      ? 'w-[calc((100%-10px)/2)] min-w-[calc((100%-10px)/2)]'
                      : 'w-full min-w-full'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-100 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1">
                      {b.stat && (
                        <span className="text-[9px] font-black text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
                          {b.stat}
                        </span>
                      )}
                      <span className="text-[9px] font-black text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] line-clamp-1">
                      {b.title}
                    </h3>
                    <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-3">
                      {b.description}
                    </p>
                  </div>
                  <span className="text-[9px] text-yellow-700 font-bold uppercase tracking-wider block pt-0.5">
                    Tap to read full →
                  </span>
                </div>
              ))}
            </div>

            {/* Slider Navigation & Dots (if more than 2 items) */}
            {totalItems > 2 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {config.items.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeSlide === idx
                          ? 'w-5 bg-yellow-600'
                          : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={slidePrev}
                    disabled={activeSlide === 0}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Previous benefit"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={slideNext}
                    disabled={activeSlide === totalItems - 1}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Next benefit"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View All Button: Only shown when total benefits exceed design capacity (> 4) */}
        {totalItems > 4 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-yellow-50 text-slate-800 hover:text-yellow-800 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>{isExpanded ? 'Collapse to Slider' : `View All (${totalItems})`}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-yellow-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-yellow-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Desktop View All Button - Only shown when total benefits exceed design capacity (> 4) */}
      {totalItems > 4 && (
        <div className="hidden sm:flex justify-center pt-6 sm:pt-8">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-yellow-50 text-slate-800 hover:text-yellow-800 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-yellow-600" />
            <span>{isExpanded ? 'Show Less Benefits' : `View All Benefits (${totalItems})`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-yellow-600" /> : <ChevronDown className="w-4 h-4 text-yellow-600" />}
          </button>
        </div>
      )}

      {/* Card Content Modal Popup */}
      <CardDetailModal
        isOpen={Boolean(cardModalData)}
        onClose={() => setCardModalData(null)}
        data={cardModalData}
      />
    </section>
  );
};

// ==========================================
// 8. TESTIMONIALS SECTION (Carousel + View More Modal)
// ==========================================
export const TestimonialsSectionRenderer: React.FC<{
  config: TestimonialsSectionConfig;
  shop?: Shop;
}> = ({ config, shop }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!config.enabled || !config.items || config.items.length === 0) return null;

  const totalReviews = config.items.length;

  // Auto-slide carousel every 5 seconds (only when not expanded)
  useEffect(() => {
    if (totalReviews <= 1 || isPaused || isExpanded) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % totalReviews);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalReviews, isPaused, isExpanded]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentReviewIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentReviewIndex((prev) => (prev + 1) % totalReviews);
  };

  // Get sliding window of reviews (1 for mobile, 2 for tablet, 3 for desktop)
  const visibleReviews = [
    config.items[currentReviewIndex % totalReviews],
    config.items[(currentReviewIndex + 1) % totalReviews],
    config.items[(currentReviewIndex + 2) % totalReviews],
  ].filter(Boolean);

  return (
    <section 
      id="testimonials" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
            <MessageSquare className="w-3.5 h-3.5" /> Customer Reviews & Ratings
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
          )}
        </div>

        {/* Carousel Navigation Buttons */}
        {!isExpanded && totalReviews > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Review"
              className="w-10 h-10 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-gray-200 shadow-xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-xs font-mono font-bold text-gray-500 px-1">
              {(currentReviewIndex % totalReviews) + 1} / {totalReviews}
            </div>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Review"
              className="w-10 h-10 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-gray-200 shadow-xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Reviews Content: Inline Expanded Grid OR Carousel */}
      {isExpanded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {config.items.map((review, idx) => (
            <div
              key={`expanded-rev-${review.id || idx}`}
              className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                  "{review.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                {review.avatarUrl ? (
                  <img
                    src={review.avatarUrl}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs">
                    {review.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">
                    {review.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span>{review.location}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Reviews Carousel Cards (1 on mobile, 2 on tablet, 3 on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleReviews.map((review, idx) => {
              // Hide 2nd item on small screens, hide 3rd item on tablet
              const visibilityClass = idx === 0 
                ? 'block' 
                : idx === 1 
                  ? 'hidden md:flex' 
                  : 'hidden lg:flex';

              return (
                <div
                  key={`carousel-rev-${review.id || idx}-${currentReviewIndex}`}
                  className={`${visibilityClass} bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs hover:shadow-md hover:border-rose-300 transition-all flex-col justify-between space-y-4 animate-in fade-in duration-300`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(review.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed line-clamp-4">
                      "{review.text}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                    {review.avatarUrl ? (
                      <img
                        src={review.avatarUrl}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs">
                        {review.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">
                        {review.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span>{review.location}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Dots for Carousel */}
          {totalReviews > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-6">
              {config.items.map((_, dotIdx) => (
                <button
                  key={`rev-dot-${dotIdx}`}
                  type="button"
                  onClick={() => setCurrentReviewIndex(dotIdx)}
                  className={`transition-all rounded-full cursor-pointer ${
                    dotIdx === (currentReviewIndex % totalReviews)
                      ? 'w-6 h-2 bg-rose-600'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to review ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* VIEW ALL BUTTON - Only rendered if reviews quantity strictly exceeds 3 */}
      {totalReviews > 3 && (
        <div className="text-center pt-8">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-6 py-3 bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 font-black uppercase tracking-wider text-xs rounded-xl shadow-xs inline-flex items-center gap-2.5 transition-all hover:scale-102 cursor-pointer active:scale-95"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{isExpanded ? 'Show Less Reviews' : `View All Customer Reviews (${totalReviews})`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-rose-600" /> : <ArrowRight className="w-4 h-4 text-rose-600" />}
          </button>
        </div>
      )}
    </section>
  );
};

// ==========================================
// 9. OUR OFFERS & DEALS SECTION (1-2 BANNERS)
// ==========================================
export const OffersSectionRenderer: React.FC<{
  config?: OffersSectionConfig;
  shop: Shop;
}> = ({ config, shop }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileActiveOffer, setMobileActiveOffer] = useState(0);
  const mobileOffersScrollRef = useRef<HTMLDivElement>(null);

  if (!config || !config.enabled || !config.banners || config.banners.length === 0) return null;

  const validBanners = config.banners.filter((b) => b.imageUrl || b.title);
  if (validBanners.length === 0) return null;

  const totalOffers = validBanners.length;
  const displayedDesktopBanners = isExpanded ? validBanners : validBanners.slice(0, 4);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.clientWidth > 0) {
      const slideWidth = (el.clientWidth - 20) / 2.15 + 10;
      const idx = Math.round(el.scrollLeft / slideWidth);
      setMobileActiveOffer(Math.max(0, Math.min(validBanners.length - 1, idx)));
    }
  };

  const scrollToOfferIdx = (idx: number) => {
    if (mobileOffersScrollRef.current) {
      const slideWidth = (mobileOffersScrollRef.current.clientWidth - 20) / 2.15 + 10;
      mobileOffersScrollRef.current.scrollTo({
        left: idx * slideWidth,
        behavior: 'smooth',
      });
      setMobileActiveOffer(idx);
    }
  };

  const slidePrevOffer = () => {
    scrollToOfferIdx(Math.max(0, mobileActiveOffer - 1));
  };

  const slideNextOffer = () => {
    scrollToOfferIdx(Math.min(totalOffers - 1, mobileActiveOffer + 1));
  };

  return (
    <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Exclusive Deals & Discounts
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {config.title || 'Special Offers & Deals'}
        </h2>
        {config.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
        )}
      </div>

      {/* 1. DESKTOP VIEW: STANDARD 2-COLUMN GRID */}
      <div className={`hidden md:grid gap-6 ${displayedDesktopBanners.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {displayedDesktopBanners.map((banner, idx) => {
          const whatsappMsg = `Namaste ${shop.businessName}! I want to claim your offer: "${banner.title || 'Special Offer'}"${banner.couponCode ? ` (Coupon: ${banner.couponCode})` : ''}.`;
          const claimUrl = banner.buttonLink && banner.buttonLink !== 'whatsapp'
            ? banner.buttonLink
            : getWhatsAppDirectUrl(shop.whatsapp || shop.phone, whatsappMsg);

          return (
            <div
              key={banner.id || idx}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative"
            >
              {banner.imageUrl && (
                <div className="relative aspect-21/9 sm:aspect-16/7 bg-slate-100 overflow-hidden">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Special Offer'}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  {banner.badge && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-md">
                      {banner.badge}
                    </div>
                  )}
                  {banner.validUntil && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                      {banner.validUntil}
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                    {banner.title || 'Special Discount Offer'}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {banner.subtitle}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {banner.couponCode ? (
                    <div className="flex items-center gap-2 bg-orange-50 border border-dashed border-orange-300 px-3 py-1.5 rounded-sm">
                      <span className="text-[10px] uppercase font-bold text-orange-700">Code:</span>
                      <span className="font-mono font-black text-xs text-orange-900 tracking-wider">
                        {banner.couponCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(banner.couponCode!)}
                        className="text-orange-600 hover:text-orange-800 p-0.5 transition-colors cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedCode === banner.couponCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ) : <div />}

                  <a
                    href={claimUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{banner.buttonText || 'Claim Offer on WhatsApp'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. MOBILE VIEW: 2 CARDS PER VIEW WITH 10% PEEK */}
      <div className="block md:hidden">
        {!isExpanded ? (
          <div>
            {/* Mobile Slider: 2 CARDS PER VIEW + 10% PEEK */}
            <div
              ref={mobileOffersScrollRef}
              onScroll={handleMobileScroll}
              className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x [&::-webkit-scrollbar]:hidden"
            >
              {validBanners.map((banner, idx) => {
                const whatsappMsg = `Namaste ${shop.businessName}! I want to claim your offer: "${banner.title || 'Special Offer'}"${banner.couponCode ? ` (Coupon: ${banner.couponCode})` : ''}.`;
                const claimUrl = banner.buttonLink && banner.buttonLink !== 'whatsapp'
                  ? banner.buttonLink
                  : getWhatsAppDirectUrl(shop.whatsapp || shop.phone, whatsappMsg);

                return (
                  <div
                    key={`mob-slider-banner-${banner.id || idx}`}
                    className={`flex-none snap-start bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative ${
                      totalOffers >= 3
                        ? 'w-[calc((100%-20px)/2.15)] min-w-[calc((100%-20px)/2.15)] max-w-[calc((100%-20px)/2.15)]'
                        : totalOffers === 2
                        ? 'w-[calc((100%-10px)/2)] min-w-[calc((100%-10px)/2)]'
                        : 'w-full min-w-full'
                    }`}
                  >
                    {banner.imageUrl && (
                      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title || 'Special Offer'}
                          className="w-full h-full object-cover"
                        />
                        {banner.badge && (
                          <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs">
                            {banner.badge}
                          </div>
                        )}
                        {banner.validUntil && (
                          <div className="absolute top-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[8px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
                            {banner.validUntil}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] line-clamp-1">
                          {banner.title || 'Special Offer'}
                        </h3>
                        {banner.subtitle && (
                          <p className="text-[10px] text-gray-500 line-clamp-1">
                            {banner.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                        {banner.couponCode && (
                          <div className="flex items-center justify-between bg-orange-50 border border-dashed border-orange-300 px-2 py-1 rounded-md">
                            <span className="text-[9px] uppercase font-bold text-orange-700">Code:</span>
                            <span className="font-mono font-black text-[10px] text-orange-900">
                              {banner.couponCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(banner.couponCode!)}
                              className="text-orange-600 hover:text-orange-800 p-0.5 transition-colors cursor-pointer"
                              title="Copy Code"
                            >
                              {copiedCode === banner.couponCode ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}

                        <a
                          href={claimUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[10px] rounded-lg shadow-xs flex items-center justify-center gap-1 transition-colors active:scale-95"
                        >
                          <span>{banner.buttonText || 'Claim Offer'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dots & Nav Indicator when > 2 offers */}
            {totalOffers > 2 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {validBanners.map((_, i) => (
                    <button
                      key={`mob-offer-dot-${i}`}
                      type="button"
                      onClick={() => scrollToOfferIdx(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        mobileActiveOffer === i ? 'w-5 bg-rose-600' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to offer ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={slidePrevOffer}
                    disabled={mobileActiveOffer === 0}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Previous offer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={slideNextOffer}
                    disabled={mobileActiveOffer === totalOffers - 1}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Next offer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mobile Expanded View: 2-column grid displaying all offers */
          <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-300">
            {validBanners.map((banner, idx) => {
              const whatsappMsg = `Namaste ${shop.businessName}! I want to claim your offer: "${banner.title || 'Special Offer'}"${banner.couponCode ? ` (Coupon: ${banner.couponCode})` : ''}.`;
              const claimUrl = banner.buttonLink && banner.buttonLink !== 'whatsapp'
                ? banner.buttonLink
                : getWhatsAppDirectUrl(shop.whatsapp || shop.phone, whatsappMsg);

              return (
                <div
                  key={`mob-grid-banner-${banner.id || idx}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between group relative"
                >
                  {banner.imageUrl && (
                    <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title || 'Special Offer'}
                        className="w-full h-full object-cover"
                      />
                      {banner.badge && (
                        <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs">
                          {banner.badge}
                        </div>
                      )}
                      {banner.validUntil && (
                        <div className="absolute top-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[8px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
                          {banner.validUntil}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] line-clamp-1">
                        {banner.title || 'Special Offer'}
                      </h3>
                      {banner.subtitle && (
                        <p className="text-[10px] text-gray-500 line-clamp-1">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                      {banner.couponCode && (
                        <div className="flex items-center justify-between bg-orange-50 border border-dashed border-orange-300 px-2 py-1 rounded-md">
                          <span className="text-[9px] uppercase font-bold text-orange-700">Code:</span>
                          <span className="font-mono font-black text-[10px] text-orange-900">
                            {banner.couponCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(banner.couponCode!)}
                            className="text-orange-600 hover:text-orange-800 p-0.5 transition-colors cursor-pointer"
                            title="Copy Code"
                          >
                            {copiedCode === banner.couponCode ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}

                      <a
                        href={claimUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[10px] rounded-lg shadow-xs flex items-center justify-center gap-1 transition-colors active:scale-95"
                      >
                        <span>{banner.buttonText || 'Claim Offer'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button: Only shown when total offers exceed design capacity (> 4) */}
        {totalOffers > 4 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>{isExpanded ? 'Collapse to Slider' : `View All (${totalOffers})`}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-rose-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-rose-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Desktop View All Button - Only shown when total offers exceed design capacity (> 4) */}
      {totalOffers > 4 && (
        <div className="hidden md:flex justify-center pt-6 sm:pt-8">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>{isExpanded ? 'Show Less Offers' : `View All Offers (${totalOffers})`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-rose-600" /> : <ChevronDown className="w-4 h-4 text-rose-600" />}
          </button>
        </div>
      )}
    </section>
  );
};

// ==========================================
// 9b. PRICING SECTION (Legacy compatibility)
// ==========================================
export const PricingSectionRenderer: React.FC<{
  config?: PricingSectionConfig;
  shop: Shop;
}> = ({ config, shop }) => {
  if (!config || !config.enabled || !config.plans || config.plans.length === 0) return null;

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <Tag className="w-3.5 h-3.5" /> Transparent Rates
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {config.title}
        </h2>
        {config.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {config.plans.map((plan, idx) => (
          <div
            key={plan.id || idx}
            className={`rounded-2xl p-4 sm:p-6 transition-all flex flex-col justify-between relative ${
              plan.isPopular
                ? 'bg-slate-900 text-white shadow-xl border-2 border-orange-500 ring-2 ring-orange-500/20'
                : 'bg-white text-slate-900 border border-gray-200 shadow-xs hover:shadow-md'
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                ★ MOST POPULAR ★
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight font-['Outfit',sans-serif]">
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-orange-500">{plan.price}</span>
                  <span className={`text-xs ${plan.isPopular ? 'text-gray-400' : 'text-gray-500'}`}>
                    / {plan.period}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start gap-2 text-xs">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <a
                href={getWhatsAppDirectUrl(
                  shop.whatsapp || shop.phone,
                  `Namaste! I would like to order/inquire about plan: "${plan.name}" (${plan.price}) at ${shop.businessName}.`
                )}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-sm text-center flex items-center justify-center gap-1.5 transition-colors ${
                  plan.isPopular
                    ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-black text-white'
                }`}
              >
                <span>{plan.buttonText || 'Choose Plan'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ==========================================
// 10. PORTFOLIO / GALLERY SECTION
// ==========================================
export const PortfolioSectionRenderer: React.FC<{
  config: PortfolioSectionConfig;
}> = ({ config }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!config.enabled || !config.items || config.items.length === 0) return null;

  const totalProjects = config.items.length;
  const displayedItems = isExpanded ? config.items : config.items.slice(0, 4);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    if (slideWidth > 0) {
      const index = Math.round(scrollLeft / slideWidth);
      setActiveSlide(Math.min(Math.max(0, index), totalProjects - 1));
    }
  };

  const scrollToSlide = (idx: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    scrollRef.current.scrollTo({
      left: idx * slideWidth,
      behavior: 'smooth',
    });
    setActiveSlide(idx);
  };

  const slidePrev = () => {
    scrollToSlide(Math.max(0, activeSlide - 1));
  };

  const slideNext = () => {
    scrollToSlide(Math.min(totalProjects - 1, activeSlide + 1));
  };

  return (
    <section id="portfolio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-cyan-100 text-cyan-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <Award className="w-3.5 h-3.5" /> Work Showcase & Gallery
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {config.title}
        </h2>
        {config.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
        )}
      </div>

      {/* 1. DESKTOP VIEW: STANDARD GRID (UP TO 4 ITEMS OR EXPANDED) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in duration-300">
        {displayedItems.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => setActiveImage(item.imageUrl)}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer relative"
          >
            <div className="aspect-4/3 overflow-hidden bg-gray-100 relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>View Photo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="p-3.5 space-y-1">
              {item.category && (
                <div className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider">
                  {item.category}
                </div>
              )}
              <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-[11px] text-gray-500 line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. MOBILE VIEW: 2 ITEMS PROPERLY VISIBLE + 10% PEEK SLIDER (OR EXPANDED 2-COL GRID) */}
      <div className="block md:hidden">
        {!isExpanded ? (
          /* Mobile Slider */
          <div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x [&::-webkit-scrollbar]:hidden"
            >
              {config.items.map((item, idx) => (
                <div
                  key={`mob-slider-port-${item.id || idx}`}
                  onClick={() => setActiveImage(item.imageUrl)}
                  className={`flex-none snap-start group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between ${
                    totalProjects >= 3
                      ? 'w-[calc((100%-20px)/2.15)] min-w-[calc((100%-20px)/2.15)] max-w-[calc((100%-20px)/2.15)]'
                      : totalProjects === 2
                      ? 'w-[calc((100%-10px)/2)] min-w-[calc((100%-10px)/2)]'
                      : 'w-full min-w-full'
                  }`}
                >
                  <div className="aspect-4/3 overflow-hidden bg-gray-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[9px] font-bold text-white flex items-center gap-0.5">
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 space-y-1">
                    {item.category && (
                      <div className="text-[9px] font-bold text-cyan-700 uppercase tracking-wider truncate">
                        {item.category}
                      </div>
                    )}
                    <h3 className="text-xs font-black text-slate-900 truncate">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-[10px] text-gray-500 line-clamp-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Navigation & Dots (if more than 2 items) */}
            {totalProjects > 2 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {config.items.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeSlide === idx
                          ? 'w-5 bg-cyan-600'
                          : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={slidePrev}
                    disabled={activeSlide === 0}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Previous project"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={slideNext}
                    disabled={activeSlide === totalProjects - 1}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Next project"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mobile Expanded View: 2-column grid showing all items */
          <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-300">
            {config.items.map((item, idx) => (
              <div
                key={`mob-grid-port-${item.id || idx}`}
                onClick={() => setActiveImage(item.imageUrl)}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between"
              >
                <div className="aspect-4/3 overflow-hidden bg-gray-100 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[9px] font-bold text-white flex items-center gap-0.5">
                      <span>View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1">
                  {item.category && (
                    <div className="text-[9px] font-bold text-cyan-700 uppercase tracking-wider truncate">
                      {item.category}
                    </div>
                  )}
                  <h3 className="text-xs font-black text-slate-900 truncate">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[10px] text-gray-500 line-clamp-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button: Only shown when total projects exceed design capacity (> 4) */}
        {totalProjects > 4 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-cyan-50 text-slate-800 hover:text-cyan-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>{isExpanded ? 'Collapse to Slider' : `View All (${totalProjects})`}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-cyan-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-cyan-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Desktop View All Button - Only shown when total projects exceed design capacity (> 4) */}
      {totalProjects > 4 && (
        <div className="hidden md:flex justify-center pt-6 sm:pt-8">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-cyan-50 text-slate-800 hover:text-cyan-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <Award className="w-4 h-4 text-cyan-600" />
            <span>{isExpanded ? 'Show Less Projects' : `View All Projects (${totalProjects})`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-600" /> : <ChevronDown className="w-4 h-4 text-cyan-600" />}
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <img src={activeImage} alt="Gallery Full" className="w-full h-full object-contain" />
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

// ==========================================
// 10B. MASONRY GALLERY SECTION (With View More Lightbox)
// ==========================================
export const GallerySectionRenderer: React.FC<{
  config?: GallerySectionConfig;
  shop: Shop;
}> = ({ config, shop }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // High-resolution curated store photos (up to 15 images)
  const fallbackPhotos = [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=800',
    'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=800',
    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800',
    'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=800',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
  ];

  // Specific image rules: Maximum 15 photos allowed, initially 12 visible
  const MAX_ALLOWED_IMAGES = 15;
  const INITIAL_VISIBLE_COUNT = 12;

  // Resolve gallery photos: combine shop gallery images or fallback, capped at 15
  const rawPhotos = shop.galleryImages && shop.galleryImages.filter(Boolean).length > 0
    ? shop.galleryImages.filter(Boolean)
    : fallbackPhotos;

  // Cap total allowed photos to 15
  const allPhotos = (rawPhotos.length < MAX_ALLOWED_IMAGES
    ? [...rawPhotos, ...fallbackPhotos.filter((p) => !rawPhotos.includes(p)).slice(0, MAX_ALLOWED_IMAGES - rawPhotos.length)]
    : rawPhotos).slice(0, MAX_ALLOWED_IMAGES);

  const totalPhotos = allPhotos.length;
  const displayedPhotos = isExpanded ? allPhotos : allPhotos.slice(0, INITIAL_VISIBLE_COUNT);

  const title = config?.title || 'Store Photo Gallery';
  const subtitle = config?.subtitle || 'Hamari dukaan, taaza stock aur shandar collection ka photo showcase';

  // Desktop aspect ratios for staggered columns
  const desktopAspectClasses = [
    'aspect-[3/4]',
    'aspect-square',
    'aspect-[4/5]',
    'aspect-[16/11]',
    'aspect-[3/4]',
    'aspect-square',
    'aspect-[4/3]',
    'aspect-[4/5]',
  ];

  // Mobile flexible 3 / 2 rows grouping
  const mobileRows: { photos: { url: string; globalIdx: number; aspect: string }[]; isThree: boolean }[] = [];
  let pIdx = 0;
  let takeThree = true;

  while (pIdx < displayedPhotos.length) {
    const remaining = displayedPhotos.length - pIdx;
    let count = takeThree ? 3 : 2;
    // Smart split: if 4 remaining, take 2 then 2 to avoid single orphaned item
    if (remaining === 4) {
      count = 2;
    } else if (remaining < count) {
      count = remaining;
    }

    const rowItems = displayedPhotos.slice(pIdx, pIdx + count).map((url, offset) => {
      const gIdx = pIdx + offset;
      let aspect = 'aspect-square';
      if (count === 3) {
        // In 3-image row: middle item slightly taller or variation
        aspect = offset === 1 ? 'aspect-[4/5]' : 'aspect-square';
      } else if (count === 2) {
        // In 2-image row: wide cinematic / 4:3 balance
        aspect = offset === 0 ? 'aspect-[16/11]' : 'aspect-[4/3]';
      } else {
        aspect = 'aspect-[21/9]';
      }
      return { url, globalIdx: gIdx, aspect };
    });

    mobileRows.push({
      photos: rowItems,
      isThree: rowItems.length === 3,
    });

    pIdx += count;
    takeThree = !takeThree;
  }

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handlePrevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + allPhotos.length) % allPhotos.length);
    }
  };

  const handleNextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allPhotos.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allPhotos.length) % allPhotos.length : null));
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allPhotos.length : null));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, allPhotos.length]);

  return (
    <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-cyan-100 text-cyan-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <Camera className="w-3.5 h-3.5 text-cyan-700" /> Store Photo Gallery (Masonry Style)
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* 1. MOBILE MASONRY GRID (Flexible 3 / 2 images per row) */}
      <div className="block md:hidden space-y-2 sm:space-y-2.5">
        {mobileRows.map((row, rIdx) => (
          <div
            key={`mob-gal-row-${rIdx}`}
            className={
              row.isThree
                ? 'grid grid-cols-3 gap-2 sm:gap-2.5'
                : row.photos.length === 2
                ? 'grid grid-cols-2 gap-2 sm:gap-2.5'
                : 'grid grid-cols-1 gap-2'
            }
          >
            {row.photos.map((item) => (
              <div
                key={`mob-masonry-photo-${item.globalIdx}`}
                onClick={() => handleOpenLightbox(item.globalIdx)}
                className="group relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs hover:shadow-md transition-all duration-300 active:scale-97 cursor-pointer"
              >
                <div className={`w-full ${item.aspect} overflow-hidden relative`}>
                  <img
                    src={item.url}
                    alt={`${shop.businessName} Gallery Photo ${item.globalIdx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Overlay & High-Res Cue */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-2">
                    <span className="text-[9px] font-black text-cyan-300 font-mono">
                      #{item.globalIdx + 1}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-xs flex items-center justify-center text-white">
                      <Maximize2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 2. DESKTOP MASONRY GRID (Responsive Columns) */}
      <div className="hidden md:block columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {displayedPhotos.map((photoUrl, idx) => {
          const aspect = desktopAspectClasses[idx % desktopAspectClasses.length];
          return (
            <div
              key={`desktop-masonry-photo-${idx}`}
              onClick={() => handleOpenLightbox(idx)}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs hover:shadow-xl hover:border-cyan-400 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-full ${aspect} overflow-hidden relative`}>
                <img
                  src={photoUrl}
                  alt={`${shop.businessName} Gallery Photo ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay & Hover Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <span className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-xs">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                      Photo Showcase
                    </span>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <span>View High-Res Photo #{idx + 1}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW ALL BUTTON - Only shown when total photos strictly exceed INITIAL_VISIBLE_COUNT */}
      {totalPhotos > INITIAL_VISIBLE_COUNT && (
        <div className="text-center pt-6 sm:pt-8">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-6 py-2.5 sm:py-3 bg-white hover:bg-cyan-50 text-cyan-950 border border-cyan-300 font-black uppercase tracking-wider text-xs rounded-xl shadow-xs inline-flex items-center gap-2.5 transition-all hover:scale-102 cursor-pointer active:scale-95"
          >
            <ImageIcon className="w-4 h-4 text-cyan-600" />
            <span>{isExpanded ? 'Show Less Photos' : `View All Photos (${totalPhotos})`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-600" /> : <ChevronDown className="w-4 h-4 text-cyan-600" />}
          </button>
        </div>
      )}

      {/* LIGHTBOX FULLSCREEN MODAL */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div 
            className="w-full max-w-5xl flex items-center justify-between text-white pb-3 border-b border-white/20 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-400 font-mono">
                Photo {lightboxIndex + 1} of {allPhotos.length}
              </span>
              <span className="hidden sm:inline text-xs text-white/70">• {shop.businessName}</span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo Center Container with Next/Prev Arrows */}
          <div 
            className="relative w-full max-w-5xl flex-1 flex items-center justify-center py-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handlePrevLightbox}
              className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/30 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={allPhotos[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10 select-none animate-in zoom-in-95 duration-200"
            />

            <button
              type="button"
              onClick={handleNextLightbox}
              className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/30 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnail Strip */}
          <div 
            className="w-full max-w-5xl flex items-center justify-center gap-2 overflow-x-auto py-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {allPhotos.map((thumbUrl, idx) => (
              <button
                key={`thumb-${idx}`}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  idx === lightboxIndex
                    ? 'border-cyan-400 scale-105 shadow-md'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={thumbUrl} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

// ==========================================
// 10C. VIDEO SECTION (4 Videos Desktop Grid + Mobile Carousel + View More Modal)
// ==========================================
export const VideoSectionRenderer: React.FC<{
  shop: Shop;
  config?: VideoSectionConfig;
}> = ({ shop, config }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fallbackVideos: VideoItem[] = [
    {
      id: 'vid-demo-1',
      title: 'Dukaan Tour & Premium Stock Showcase',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'
    },
    {
      id: 'vid-demo-2',
      title: 'Taaza Collection & Direct WhatsApp Ordering Guide',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800'
    },
    {
      id: 'vid-demo-3',
      title: 'Customer Reviews & Quality Testing Process',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800'
    },
    {
      id: 'vid-demo-4',
      title: 'Fast Dispatch & 0% UPI QR Payment Walkthrough',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800'
    },
  ];

  const rawVideos = shop.videos && shop.videos.length > 0 ? shop.videos : fallbackVideos;
  // Ensure we have 4 videos for the desktop 4-column layout
  const allVideos = rawVideos.length < 4
    ? [...rawVideos, ...fallbackVideos.slice(0, 4 - rawVideos.length)]
    : rawVideos;

  const totalVideos = allVideos.length;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    if (slideWidth > 0) {
      const index = Math.round(scrollLeft / slideWidth);
      setActiveSlide(Math.min(Math.max(0, index), totalVideos - 1));
    }
  };

  const scrollToSlide = (idx: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    scrollRef.current.scrollTo({
      left: idx * slideWidth,
      behavior: 'smooth',
    });
    setActiveSlide(idx);
  };

  const slidePrev = () => {
    scrollToSlide(Math.max(0, activeSlide - 1));
  };

  const slideNext = () => {
    scrollToSlide(Math.min(totalVideos - 1, activeSlide + 1));
  };

  // Desktop takes 4 videos in collapsed state
  const desktopVideos = isExpanded ? allVideos : allVideos.slice(0, 4);

  return (
    <section id="videos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <Play className="w-3.5 h-3.5 text-red-600 fill-red-600" /> Video Demonstration & Highlights
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {config?.title || 'Store Videos & Customer Tutorials'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          {config?.subtitle || 'Dukaan ki live video dekhein, taaza stock samjhein aur asaani se order karein'}
        </p>
      </div>

      {/* 1. DESKTOP VIEW: 4-COLUMN RESPONSIVE GRID */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {desktopVideos.map((vid, idx) => {
          const embedUrl = getYouTubeEmbedUrl(vid.youtubeUrl) || vid.youtubeUrl;
          return (
            <div
              key={`desktop-video-${vid.id || idx}`}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-red-300 transition-all flex flex-col justify-between"
            >
              <div className="aspect-16/9 bg-slate-900 overflow-hidden relative">
                {embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be') ? (
                  <iframe
                    src={embedUrl}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                    <Play className="w-10 h-10 text-red-500 fill-red-500" />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Video #{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Verified Store
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-black uppercase text-slate-900 line-clamp-2">
                  {vid.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. MOBILE VIEW: 2 ITEMS VISIBLE + ~10% PEEK SLIDER (OR EXPANDED 2-COL GRID) */}
      <div className="block md:hidden">
        {!isExpanded ? (
          /* Mobile Slider: 2 items properly visible + ~10% peek of next item */
          <div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x [&::-webkit-scrollbar]:hidden"
            >
              {allVideos.map((vid, idx) => {
                return (
                  <div
                    key={`mob-slider-vid-${vid.id || idx}`}
                    onClick={() => setSelectedVideo(vid)}
                    className={`flex-none snap-start bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group ${
                      totalVideos >= 3
                        ? 'w-[calc((100%-20px)/2.15)] min-w-[calc((100%-20px)/2.15)] max-w-[calc((100%-20px)/2.15)]'
                        : totalVideos === 2
                        ? 'w-[calc((100%-10px)/2)] min-w-[calc((100%-10px)/2)]'
                        : 'w-full min-w-full'
                    }`}
                  >
                    <div className="aspect-16/10 bg-slate-900 overflow-hidden relative">
                      {vid.thumbnailUrl ? (
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900" />
                      )}
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-bold text-white bg-black/75 px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="p-2.5 space-y-1">
                      <h3 className="text-xs font-black uppercase text-slate-900 line-clamp-2">
                        {vid.title}
                      </h3>
                      <p className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                        <span>Watch Video</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider Navigation & Dots (if more than 2 items) */}
            {totalVideos > 2 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {allVideos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeSlide === idx
                          ? 'w-5 bg-red-600'
                          : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={slidePrev}
                    disabled={activeSlide === 0}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Previous video"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={slideNext}
                    disabled={activeSlide === totalVideos - 1}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Next video"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mobile Expanded View: 2-column grid showing all videos */
          <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-300">
            {allVideos.map((vid, idx) => (
              <div
                key={`mob-grid-vid-${vid.id || idx}`}
                onClick={() => setSelectedVideo(vid)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="aspect-16/10 bg-slate-900 overflow-hidden relative">
                  {vid.thumbnailUrl ? (
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900" />
                  )}
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold text-white bg-black/75 px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                </div>

                <div className="p-2.5 space-y-1">
                  <h3 className="text-xs font-black uppercase text-slate-900 line-clamp-2">
                    {vid.title}
                  </h3>
                  <p className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                    <span>Watch Video</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button: Only shown when total videos exceed design capacity (> 4) */}
        {totalVideos > 4 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>{isExpanded ? 'Collapse to Slider' : `View All (${totalVideos})`}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-red-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-red-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Desktop View All Button - Only shown when total videos exceed design capacity (> 4) */}
      {totalVideos > 4 && (
        <div className="hidden md:flex justify-center pt-6 sm:pt-8">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <Play className="w-4 h-4 text-red-600 fill-red-600" />
            <span>{isExpanded ? 'Show Less Videos' : `View All Videos & Tutorials (${totalVideos})`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-red-600" /> : <ChevronDown className="w-4 h-4 text-red-600" />}
          </button>
        </div>
      )}

      {/* Video Player Modal for Mobile Tap */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-3 bg-slate-800 text-white flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold truncate pr-4">{selectedVideo.title}</h4>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white p-1 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="aspect-16/9 w-full bg-black">
              {(() => {
                const embedUrl = getYouTubeEmbedUrl(selectedVideo.youtubeUrl) || selectedVideo.youtubeUrl;
                return embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be') ? (
                  <iframe
                    src={`${embedUrl}?autoplay=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xs">
                    Unable to load video stream
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// ==========================================
// 10D. CONTACT US SOCIAL MEDIA CONNECT BLOCK
// ==========================================
export const ContactSocialMediaBlock: React.FC<{
  shop: Shop;
}> = ({ shop }) => {
  const social = shop.socialLinks || {};

  const socialChannels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Chat',
      label: 'Direct 1-on-1 Chat',
      handle: shop.whatsapp || shop.phone || '+91 98765 43210',
      url: getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `Namaste ${shop.businessName}! I would like to connect with your store.`),
      icon: PhoneCall,
      color: 'bg-emerald-500 text-white hover:bg-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      label: 'Follow Store Reels & Posts',
      handle: social.instagram ? (social.instagram.includes('instagram.com/') ? `@${social.instagram.split('instagram.com/')[1].replace('/', '')}` : social.instagram) : '@shahi_handicrafts',
      url: social.instagram?.startsWith('http') ? social.instagram : `https://instagram.com/${(social.instagram || 'shahi_handicrafts').replace('@', '')}`,
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white hover:opacity-90',
      badgeBg: 'bg-pink-50 text-pink-800 border-pink-200',
      dotColor: 'bg-pink-500',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      label: 'Official Store Page',
      handle: 'Shahi Handicrafts Official',
      url: social.facebook?.startsWith('http') ? social.facebook : 'https://facebook.com',
      icon: Facebook,
      color: 'bg-blue-600 text-white hover:bg-blue-700',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      dotColor: 'bg-blue-600',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      label: 'Watch Stock & Product Videos',
      handle: 'Shahi Handicrafts Channel',
      url: social.youtube?.startsWith('http') ? social.youtube : 'https://youtube.com',
      icon: Youtube,
      color: 'bg-red-600 text-white hover:bg-red-700',
      badgeBg: 'bg-red-50 text-red-800 border-red-200',
      dotColor: 'bg-red-600',
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      label: 'News & Announcements',
      handle: social.twitter ? (social.twitter.startsWith('@') ? social.twitter : `@${social.twitter}`) : '@ShahiHandicrafts',
      url: social.twitter?.startsWith('http') ? social.twitter : `https://twitter.com/${(social.twitter || 'ShahiHandicrafts').replace('@', '')}`,
      icon: Twitter,
      color: 'bg-slate-900 text-white hover:bg-black',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
      dotColor: 'bg-slate-900',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      label: 'Business & Wholesale Network',
      handle: social.linkedin || 'Shahi Handicrafts Emporium',
      url: social.linkedin?.startsWith('http') ? social.linkedin : 'https://linkedin.com',
      icon: Linkedin,
      color: 'bg-sky-700 text-white hover:bg-sky-800',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
      dotColor: 'bg-sky-700',
    },
    {
      id: 'maps',
      name: 'Google Maps',
      label: 'Store Location & Directions',
      handle: `${shop.address || 'Bapu Bazaar'}, ${shop.city}`,
      url: `https://maps.google.com/?q=${encodeURIComponent(`${shop.businessName} ${shop.address} ${shop.city}`)}`,
      icon: MapPin,
      color: 'bg-amber-600 text-white hover:bg-amber-700',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-600',
    },
    {
      id: 'phone',
      name: 'Direct Phone Call',
      label: 'Instant Support Helpline',
      handle: shop.phone || '+91 98765 43210',
      url: `tel:${shop.phone || '+919876543210'}`,
      icon: Phone,
      color: 'bg-orange-600 text-white hover:bg-orange-700',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
      dotColor: 'bg-orange-600',
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-orange-200/90 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
            <Share2 className="w-3.5 h-3.5" /> Social Media & Online Profiles
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Connect With Us Across Social Media
          </h3>
          <p className="text-xs text-gray-500">
            Humein social media par follow karein aur naye products ke updates paayein
          </p>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Accounts
        </span>
      </div>

      {/* 1. MOBILE VIEW: Social Media icons in a single horizontal line */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-center gap-3 overflow-x-auto py-2 px-1 flex-nowrap scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {socialChannels.map((chan) => {
            const IconComp = chan.icon;
            return (
              <a
                key={`mob-contact-social-${chan.id}`}
                href={chan.url}
                target="_blank"
                rel="noreferrer"
                aria-label={chan.name}
                title={chan.name}
                className={`flex-none w-12 h-12 rounded-2xl ${chan.color} flex items-center justify-center shadow-md active:scale-90 hover:scale-105 transition-transform cursor-pointer`}
              >
                <IconComp className="w-6 h-6 text-white" />
              </a>
            );
          })}
        </div>
      </div>

      {/* 2. DESKTOP VIEW: Social Buttons Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {socialChannels.map((chan) => {
          const IconComp = chan.icon;
          return (
            <a
              key={`social-chan-${chan.id}`}
              href={chan.url}
              target="_blank"
              rel="noreferrer"
              className="group p-4 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between gap-3 bg-white"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-xl ${chan.color} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                    {chan.name}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    {chan.handle}
                  </div>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-orange-50 text-gray-400 group-hover:text-orange-600 flex items-center justify-center shrink-0 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 15. SOCIAL MEDIA SECTION (Dedicated Storefront Section)
// ==========================================
export const SocialMediaSectionRenderer: React.FC<{
  config?: SocialMediaSectionConfig;
  shop: Shop;
}> = ({ config, shop }) => {
  if (config && config.enabled === false) return null;

  const instagramUrl = config?.instagram || shop.socialLinks?.instagram || '';
  const facebookUrl = config?.facebook || shop.socialLinks?.facebook || '';
  const youtubeUrl = config?.youtube || shop.socialLinks?.youtube || '';
  const whatsappUrl = config?.whatsapp || (shop.whatsapp ? `https://wa.me/91${shop.whatsapp.replace(/\D/g, '')}` : `https://wa.me/91${shop.phone?.replace(/\D/g, '') || ''}`);
  const twitterUrl = config?.twitter || shop.socialLinks?.twitter || '';
  const linkedinUrl = config?.linkedin || shop.socialLinks?.linkedin || '';
  const telegramUrl = config?.telegram || '';

  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Direct',
      label: 'Fast Support & Chat',
      handle: `+91 ${shop.whatsapp || shop.phone || 'Store Hotline'}`,
      url: whatsappUrl,
      icon: MessageCircle,
      color: 'bg-emerald-600 text-white',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      label: 'Photos & Reels Updates',
      handle: instagramUrl ? `@${shop.businessName.toLowerCase().replace(/\s+/g, '_')}` : '@instagram',
      url: instagramUrl || 'https://instagram.com',
      icon: Instagram,
      color: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
      badgeBg: 'bg-pink-50 text-pink-800 border-pink-200',
    },
    {
      id: 'facebook',
      name: 'Facebook Page',
      label: 'Community & Customer Reviews',
      handle: facebookUrl ? `${shop.businessName}` : 'Facebook Page',
      url: facebookUrl || 'https://facebook.com',
      icon: Facebook,
      color: 'bg-blue-600 text-white',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      id: 'youtube',
      name: 'YouTube Channel',
      label: 'Video Demos & Tutorials',
      handle: youtubeUrl ? `${shop.businessName} TV` : 'YouTube Channel',
      url: youtubeUrl || 'https://youtube.com',
      icon: Youtube,
      color: 'bg-red-600 text-white',
      badgeBg: 'bg-red-50 text-red-800 border-red-200',
    },
    ...(twitterUrl ? [{
      id: 'twitter',
      name: 'Twitter / X',
      label: 'Latest Tweets & Alerts',
      handle: `@${shop.businessName.toLowerCase().replace(/\s+/g, '')}`,
      url: twitterUrl,
      icon: Twitter,
      color: 'bg-slate-900 text-white',
      badgeBg: 'bg-slate-50 text-slate-800 border-slate-200',
    }] : []),
    ...(linkedinUrl ? [{
      id: 'linkedin',
      name: 'LinkedIn',
      label: 'Professional Network',
      handle: `${shop.businessName}`,
      url: linkedinUrl,
      icon: Linkedin,
      color: 'bg-blue-700 text-white',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    }] : []),
    ...(telegramUrl ? [{
      id: 'telegram',
      name: 'Telegram Channel',
      label: 'Direct Channel & Deals',
      handle: `${shop.businessName}`,
      url: telegramUrl,
      icon: Send,
      color: 'bg-sky-500 text-white',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    }] : []),
  ];

  return (
    <section id="social-media" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 scroll-mt-20">
      <div className="bg-white rounded-3xl border border-orange-200/90 p-4 sm:p-8 lg:p-10 shadow-sm space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-gray-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
              <Share2 className="w-3.5 h-3.5" /> Social Media & Online Profiles
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
              {config?.title || 'Connect With Us on Social Media'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl">
              {config?.subtitle || 'Humein social media par follow karein aur exclusive offers, naye products aur videos ke taaza updates paayein.'}
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Official Verified Accounts
          </span>
        </div>

        {/* 1. MOBILE VIEW: Social Media icons in a single horizontal line */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto py-2 px-0.5 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-nowrap">
            {channels.map((chan) => {
              const IconComp = chan.icon;
              return (
                <a
                  key={`mob-single-line-social-${chan.id}`}
                  href={chan.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={chan.name}
                  title={chan.name}
                  className={`flex-none w-12 h-12 rounded-2xl ${chan.color} flex items-center justify-center shadow-md active:scale-90 hover:scale-105 transition-transform cursor-pointer`}
                >
                  <IconComp className="w-6 h-6 text-white" />
                </a>
              );
            })}
          </div>
        </div>

        {/* 2. DESKTOP VIEW: Multi-column Card Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {channels.map((chan) => {
            const IconComp = chan.icon;
            return (
              <a
                key={`dedicated-social-${chan.id}`}
                href={chan.url}
                target="_blank"
                rel="noreferrer"
                className="group p-5 rounded-2xl border border-gray-200/90 hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between gap-3.5 bg-gray-50/40 hover:bg-white cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-12 h-12 rounded-xl ${chan.color} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                      {chan.name}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">
                      {chan.handle}
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white group-hover:bg-orange-50 text-gray-400 group-hover:text-orange-600 flex items-center justify-center shrink-0 border border-gray-200 group-hover:border-orange-200 transition-colors shadow-xs">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 11. TEAM SECTION (Image + Position + Name)
// ==========================================
export const TeamSectionRenderer: React.FC<{
  config: TeamSectionConfig;
}> = ({ config }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!config.enabled || !config.members || config.members.length === 0) return null;

  const totalMembers = config.members.length;
  const displayedDesktopMembers = isExpanded ? config.members : config.members.slice(0, 4);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    if (slideWidth > 0) {
      const index = Math.round(scrollLeft / slideWidth);
      setActiveSlide(Math.min(Math.max(0, index), totalMembers - 1));
    }
  };

  const scrollToSlide = (idx: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    scrollRef.current.scrollTo({
      left: idx * slideWidth,
      behavior: 'smooth',
    });
    setActiveSlide(idx);
  };

  const slidePrev = () => {
    scrollToSlide(Math.max(0, activeSlide - 1));
  };

  const slideNext = () => {
    scrollToSlide(Math.min(totalMembers - 1, activeSlide + 1));
  };

  return (
    <section id="team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-fuchsia-100 text-fuchsia-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <Users className="w-3.5 h-3.5" /> Our People
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {config.title}
        </h2>
        {config.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
        )}
      </div>

      {/* 1. DESKTOP VIEW: 4-COLUMN RESPONSIVE GRID */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedDesktopMembers.map((member, idx) => (
          <div
            key={member.id || idx}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition-all text-center space-y-3 group"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-2 border-orange-500 p-1 group-hover:scale-105 transition-transform">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                {member.name}
              </h3>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mt-0.5">
                {member.position}
              </p>
            </div>

            {member.bio && (
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                {member.bio}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 2. MOBILE VIEW: 2 ITEMS VISIBLE + ~10% PEEK SLIDER (OR EXPANDED 2-COL GRID) */}
      <div className="block md:hidden">
        {!isExpanded ? (
          /* Mobile Slider: 2 items properly visible + ~10% peek of next item */
          <div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x [&::-webkit-scrollbar]:hidden"
            >
              {config.members.map((member, idx) => (
                <div
                  key={`mob-slider-team-${member.id || idx}`}
                  className={`flex-none snap-start bg-white rounded-xl border border-gray-200 p-3 shadow-xs text-center space-y-2 flex flex-col items-center justify-between group ${
                    totalMembers >= 3
                      ? 'w-[calc((100%-20px)/2.15)] min-w-[calc((100%-20px)/2.15)] max-w-[calc((100%-20px)/2.15)]'
                      : totalMembers === 2
                      ? 'w-[calc((100%-10px)/2)] min-w-[calc((100%-10px)/2)]'
                      : 'w-full min-w-full'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 p-0.5 group-hover:scale-105 transition-transform shrink-0">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div className="w-full">
                    <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] truncate">
                      {member.name}
                    </h3>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide truncate mt-0.5">
                      {member.position}
                    </p>
                  </div>

                  {member.bio && (
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                      {member.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Slider Navigation & Dots (if more than 2 items) */}
            {totalMembers > 2 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {config.members.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeSlide === idx
                          ? 'w-5 bg-fuchsia-600'
                          : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={slidePrev}
                    disabled={activeSlide === 0}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Previous member"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={slideNext}
                    disabled={activeSlide === totalMembers - 1}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Next member"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mobile Expanded View: 2-column grid showing all members */
          <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-300">
            {config.members.map((member, idx) => (
              <div
                key={`mob-grid-team-${member.id || idx}`}
                className="bg-white rounded-xl border border-gray-200 p-3 shadow-xs text-center space-y-2 flex flex-col items-center justify-between group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 p-0.5 group-hover:scale-105 transition-transform shrink-0">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="w-full">
                  <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] truncate">
                    {member.name}
                  </h3>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide truncate mt-0.5">
                    {member.position}
                  </p>
                </div>

                {member.bio && (
                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View All Button: Only shown when total members exceed design capacity (> 4) */}
        {totalMembers > 4 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-fuchsia-50 text-slate-800 hover:text-fuchsia-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>{isExpanded ? 'Collapse to Slider' : `View All (${totalMembers})`}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-fuchsia-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-fuchsia-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Desktop View All Button - Only shown when total members exceed design capacity (> 4) */}
      {totalMembers > 4 && (
        <div className="hidden md:flex justify-center pt-6 sm:pt-8">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-fuchsia-50 text-slate-800 hover:text-fuchsia-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <Users className="w-4 h-4 text-fuchsia-600" />
            <span>{isExpanded ? 'Show Less Team Members' : `View All Team (${totalMembers})`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-fuchsia-600" /> : <ChevronDown className="w-4 h-4 text-fuchsia-600" />}
          </button>
        </div>
      )}
    </section>
  );
};

// ==========================================
// 12. FAQ SECTION
// ==========================================
export const FaqSectionRenderer: React.FC<{
  config: FaqSectionConfig;
}> = ({ config }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!config.enabled || !config.items || config.items.length === 0) return null;

  const totalItems = config.items.length;
  const displayedItems = isExpanded ? config.items : config.items.slice(0, 4);

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <HelpCircle className="w-3.5 h-3.5" /> Questions & Answers
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {config.title}
        </h2>
        {config.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
        )}
      </div>

      <div className="space-y-3">
        {displayedItems.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.id || idx}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-orange-600"
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-orange-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3 animate-in fade-in duration-150">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* VIEW ALL FAQS BUTTON - Only visible when items strictly exceed 4 */}
      {totalItems > 4 && (
        <div className="text-center pt-6">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-6 py-3 bg-white hover:bg-sky-50 text-sky-950 border border-sky-200 font-black uppercase tracking-wider text-xs rounded-xl shadow-xs inline-flex items-center gap-2.5 transition-all hover:scale-102 cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>{isExpanded ? 'Show Less Questions' : `View All Questions & Answers (${totalItems})`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-sky-600" /> : <ArrowRight className="w-4 h-4 text-sky-600" />}
          </button>
        </div>
      )}
    </section>
  );
};

// ==========================================
// 13. CTA SECTION (Call to Action)
// ==========================================
export const CtaSectionRenderer: React.FC<{
  config: CtaSectionConfig;
  shop: Shop;
}> = ({ config, shop }) => {
  if (!config.enabled) return null;

  const handleAction = () => {
    window.open(
      getWhatsAppDirectUrl(
        shop.whatsapp || shop.phone,
        `Namaste! I would like to place an order from ${shop.businessName} under the current offer.`
      ),
      '_blank'
    );
  };

  return (
    <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-5 sm:p-12 shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          {config.badge && (
            <span className="inline-block bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-xs">
              {config.badge}
            </span>
          )}

          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-['Outfit',sans-serif]">
            {config.title}
          </h2>

          <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
            {config.description}
          </p>

          <div className="pt-3 space-y-3">
            <button
              type="button"
              onClick={handleAction}
              className="px-8 py-3.5 bg-white text-orange-950 hover:bg-orange-50 text-xs sm:text-sm font-black uppercase tracking-wider rounded-2xl shadow-xl inline-flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>{config.buttonText || 'Order on WhatsApp Now'}</span>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-orange-100/90 pt-2 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Direct Store Pricing
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Direct Merchant Guarantee
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-300" /> Fast WhatsApp Response
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 15. BLOG / ARTICLES SECTION
// ==========================================
export const BlogSectionRenderer: React.FC<{
  config: BlogSectionConfig;
  shop?: Shop;
}> = ({ config, shop }) => {
  const [selectedArticle, setSelectedArticle] = useState<BlogPostItem | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!config.enabled || !config.posts || config.posts.length === 0) return null;

  const totalPosts = config.posts.length;
  const displayedDesktopPosts = isExpanded ? config.posts : config.posts.slice(0, 4);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    if (slideWidth > 0) {
      const index = Math.round(scrollLeft / slideWidth);
      setActiveSlide(Math.min(Math.max(0, index), totalPosts - 1));
    }
  };

  const scrollToSlide = (idx: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const slideWidth = (clientWidth - 20) / 2.15 + 10;
    scrollRef.current.scrollTo({
      left: idx * slideWidth,
      behavior: 'smooth',
    });
    setActiveSlide(idx);
  };

  const slidePrev = () => {
    scrollToSlide(Math.max(0, activeSlide - 1));
  };

  const slideNext = () => {
    scrollToSlide(Math.min(totalPosts - 1, activeSlide + 1));
  };

  return (
    <section id="blog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <Award className="w-3.5 h-3.5" /> Latest Articles & Advice
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {config.title}
        </h2>
        {config.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
        )}
      </div>

      {/* 1. DESKTOP VIEW: 4-COLUMN RESPONSIVE GRID */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedDesktopPosts.map((post, idx) => (
          <article
            key={post.id || idx}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {post.imageUrl ? (
                <div className="aspect-16/9 bg-gray-100 overflow-hidden relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                  {post.category && (
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
                      {post.category}
                    </span>
                  )}
                </div>
              ) : null}

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                  {post.readTime && <span>• {post.readTime}</span>}
                  {post.author && <span>• By {post.author}</span>}
                </div>
                <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] group-hover:text-orange-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {post.snippet}
                </p>
              </div>
            </div>

            {/* Interactive "Read Me / Read Full Guide" button */}
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setSelectedArticle(post)}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 transition-colors cursor-pointer group/btn"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* 2. MOBILE VIEW: 2 ITEMS VISIBLE + ~10% PEEK SLIDER (OR EXPANDED 2-COL GRID) */}
      <div className="block md:hidden">
        {!isExpanded ? (
          /* Mobile Slider: 2 items properly visible + ~10% peek of next item */
          <div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x [&::-webkit-scrollbar]:hidden"
            >
              {config.posts.map((post, idx) => (
                <article
                  key={`mob-slider-post-${post.id || idx}`}
                  onClick={() => setSelectedArticle(post)}
                  className={`flex-none snap-start bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer ${
                    totalPosts >= 3
                      ? 'w-[calc((100%-20px)/2.15)] min-w-[calc((100%-20px)/2.15)] max-w-[calc((100%-20px)/2.15)]'
                      : totalPosts === 2
                      ? 'w-[calc((100%-10px)/2)] min-w-[calc((100%-10px)/2)]'
                      : 'w-full min-w-full'
                  }`}
                >
                  <div>
                    {post.imageUrl ? (
                      <div className="aspect-16/10 bg-gray-100 overflow-hidden relative">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform"
                        />
                        {post.category && (
                          <span className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                            {post.category}
                          </span>
                        )}
                      </div>
                    ) : null}

                    <div className="p-2.5 space-y-1">
                      <div className="text-[9px] text-gray-400 truncate">
                        {post.date}
                      </div>
                      <h3 className="text-xs font-black uppercase text-slate-900 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                        {post.snippet}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 pt-0">
                    <span className="text-[10px] font-bold text-orange-600 flex items-center gap-0.5">
                      <span>Read Guide</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* Slider Navigation & Dots (if more than 2 items) */}
            {totalPosts > 2 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {config.posts.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeSlide === idx
                          ? 'w-5 bg-amber-600'
                          : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={slidePrev}
                    disabled={activeSlide === 0}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Previous article"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={slideNext}
                    disabled={activeSlide === totalPosts - 1}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Next article"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mobile Expanded View: 2-column grid showing all blog posts */
          <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-300">
            {config.posts.map((post, idx) => (
              <article
                key={`mob-grid-post-${post.id || idx}`}
                onClick={() => setSelectedArticle(post)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {post.imageUrl ? (
                    <div className="aspect-16/10 bg-gray-100 overflow-hidden relative">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform"
                      />
                      {post.category && (
                        <span className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                          {post.category}
                        </span>
                      )}
                    </div>
                  ) : null}

                  <div className="p-2.5 space-y-1">
                    <div className="text-[9px] text-gray-400 truncate">
                      {post.date}
                    </div>
                    <h3 className="text-xs font-black uppercase text-slate-900 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                      {post.snippet}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 pt-0">
                  <span className="text-[10px] font-bold text-orange-600 flex items-center gap-0.5">
                    <span>Read Guide</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All Button: Only shown when total posts exceed design capacity (> 4) */}
        {totalPosts > 4 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>{isExpanded ? 'Collapse to Slider' : `View All (${totalPosts})`}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-amber-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-amber-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Desktop View All Button - Only shown when total posts exceed design capacity (> 4) */}
      {totalPosts > 4 && (
        <div className="hidden md:flex justify-center pt-6 sm:pt-8">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>{isExpanded ? 'Show Less Articles' : `View All Articles (${totalPosts})`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-amber-600" />}
          </button>
        </div>
      )}

      {/* Reader Modal for Full Article */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            {selectedArticle.imageUrl && (
              <div className="relative aspect-16/8 sm:aspect-16/7 bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              {!selectedArticle.imageUrl && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 pb-1">
                {selectedArticle.category && (
                  <span className="bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedArticle.date}
                </span>
                {selectedArticle.readTime && <span>• {selectedArticle.readTime}</span>}
                {selectedArticle.author && <span>• By {selectedArticle.author}</span>}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif] leading-tight">
                {selectedArticle.title}
              </h2>

              {/* Snippet / Lead */}
              <p className="text-xs sm:text-sm text-slate-700 font-medium italic border-l-3 border-orange-500 pl-3.5 py-1 bg-orange-50/50 rounded-r">
                {selectedArticle.snippet}
              </p>

              {/* Full Content */}
              <div className="pt-2 text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                {selectedArticle.content || selectedArticle.snippet}
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {shop && (
                  <a
                    href={getWhatsAppDirectUrl(
                      shop.whatsapp || shop.phone,
                      `Namaste ${shop.businessName}! I read your guide "${selectedArticle.title}" and have a query.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer text-center"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

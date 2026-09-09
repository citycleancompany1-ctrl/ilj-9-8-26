import React, { useState } from 'react';
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
  ArrowUpRight,
  X,
  Copy,
  Share2
} from 'lucide-react';
import {
  Shop,
  ShopSectionsConfig,
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
  TeamSectionConfig,
  FaqSectionConfig,
  CtaSectionConfig,
  ContactSectionConfig,
  BlogSectionConfig,
  BlogPostItem,
  FooterSectionConfig,
  ProductItem,
  CartItem,
} from '../../types';
import { getWhatsAppDirectUrl, formatINR } from '../../utils/mediaUpload';
import { StoreItemsCarouselSection } from './StoreItemsCarouselSection';

// ==========================================
// 1. HERO SECTION
// ==========================================
export const HeroSectionRenderer: React.FC<{
  config: HeroSectionConfig;
  shop: Shop;
  onCtaClick?: () => void;
}> = ({ config, shop, onCtaClick }) => {
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

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white text-slate-900 shadow-sm min-h-[420px] sm:min-h-[480px] border border-orange-200/80 flex items-center">
        
        {/* Background Image with Light Elegant Atmosphere Overlay */}
        {config.backgroundImage && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={config.backgroundImage}
              alt={config.heading}
              className="w-full h-full object-cover object-center opacity-15 sm:opacity-20 scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50/95 via-orange-50/90 to-white/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-amber-50/50" />
          </div>
        )}

        {/* Hero Main Content */}
        <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Text & Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Top Badge & Verified Merchant Label */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-orange-100/90 text-orange-800 border border-orange-200 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>{config.badge || 'Verified Direct Merchant'}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-100/90 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>0% Commission Direct Store</span>
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-950 font-['Outfit',sans-serif] leading-[1.12]">
              {config.heading}
            </h1>

            {/* Subheading */}
            <p className="text-xs sm:text-base text-slate-700 leading-relaxed max-w-2xl font-normal">
              {config.subheading}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCta}
                className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{config.ctaText || 'Explore Catalog & Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSecondaryCta}
                className="px-5 py-3.5 bg-white hover:bg-emerald-50 text-emerald-800 font-bold uppercase tracking-wider text-xs sm:text-sm rounded-xl border border-emerald-300 shadow-xs flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>{config.secondaryCtaText || 'Direct WhatsApp Inquiry'}</span>
              </button>
            </div>

            {/* Trust Badges Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-[11px] text-slate-700 border-t border-orange-200/80">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine Quality</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <Zap className="w-4 h-4 text-orange-600" />
                <span>Direct 0% UPI Rates</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Express Local Delivery</span>
              </span>
            </div>

          </div>

          {/* Right: Light Store Snapshot Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-orange-200/90 p-6 shadow-lg space-y-4">
              
              {/* Card Header with Logo */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                <img
                  src={shop.logoUrl}
                  alt={shop.businessName}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-orange-300 shadow-sm bg-white shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight truncate font-['Outfit',sans-serif]">
                      {shop.businessName}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-xs text-orange-600 font-mono font-bold mt-0.5">{shop.shopId}</div>
                  <div className="text-[11px] text-gray-600 truncate">{shop.category} • {shop.city}</div>
                </div>
              </div>

              {/* Status & Key Attributes */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Live Status</div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Open Now</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Store Rating</div>
                  <div className="flex items-center gap-1 text-amber-900 font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>4.9 / 5.0 (Verified)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Working Hours</div>
                  <div className="text-slate-800 font-semibold text-[11px] mt-0.5 truncate">
                    {shop.workingHours || '9:00 AM - 9:00 PM'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
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
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 lg:p-12 shadow-xs">
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
// 3. FEATURES SECTION
// ==========================================
export const FeaturesSectionRenderer: React.FC<{
  config: FeaturesSectionConfig;
}> = ({ config }) => {
  if (!config.enabled || !config.items || config.items.length === 0) return null;

  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
          <CheckCircle2 className="w-3.5 h-3.5" /> Key Advantages
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
          {config.title}
        </h2>
        {config.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {config.items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md hover:border-orange-300 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
              {item.title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
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
      <div className="bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/30 rounded-3xl border border-indigo-100 p-6 sm:p-10 shadow-xs">
        
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
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs relative space-y-3 group hover:border-indigo-300 transition-all"
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

  return (
    <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {config.items.map((b, idx) => (
          <div
            key={b.id || idx}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md hover:border-yellow-400 transition-all space-y-3"
          >
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

            <p className="text-xs text-gray-600 leading-relaxed">
              {b.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ==========================================
// 8. TESTIMONIALS SECTION (Name + Text + Location)
// ==========================================
export const TestimonialsSectionRenderer: React.FC<{
  config: TestimonialsSectionConfig;
}> = ({ config }) => {
  if (!config.enabled || !config.items || config.items.length === 0) return null;

  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {config.items.map((review, idx) => (
          <div
            key={review.id || idx}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                "{review.text}"
              </p>
            </div>

            {/* Author info (Name + Location) */}
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

  if (!config || !config.enabled || !config.banners || config.banners.length === 0) return null;

  const validBanners = config.banners.filter((b) => b.imageUrl || b.title);
  if (validBanners.length === 0) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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

      <div className={`grid gap-6 ${validBanners.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {validBanners.map((banner, idx) => {
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
            className={`rounded-2xl p-6 transition-all flex flex-col justify-between relative ${
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

  if (!config.enabled || !config.items || config.items.length === 0) return null;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {config.items.map((item, idx) => (
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
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black"
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
// 11. TEAM SECTION (Image + Position + Name)
// ==========================================
export const TeamSectionRenderer: React.FC<{
  config: TeamSectionConfig;
}> = ({ config }) => {
  if (!config.enabled || !config.members || config.members.length === 0) return null;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {config.members.map((member, idx) => (
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

  if (!config.enabled || !config.items || config.items.length === 0) return null;

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
        {config.items.map((item, idx) => {
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
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl text-center relative overflow-hidden">
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
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> 0% Platform Commission
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

  if (!config.enabled || !config.posts || config.posts.length === 0) return null;

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {config.posts.map((post, idx) => (
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

import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, 
  Store, 
  MapPin, 
  Share2, 
  ShoppingBag, 
  QrCode, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Copy, 
  X, 
  Plus, 
  Minus, 
  ArrowRight, 
  ExternalLink, 
  Play, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Phone,
  Layers,
  Heart,
  Tag,
  Search,
  Check,
  Trash2,
  Lock,
  ArrowUpRight,
  Calendar,
  Award,
  HelpCircle,
  Menu,
  Star,
  FileText,
  Download,
  Smartphone,
  Palette,
  Globe,
} from 'lucide-react';
import { Shop, ProductItem, CartItem, AdvertisementPopup, ShopInquiry } from '../../types';
import { formatINR, getWhatsAppCartMessageUrl, getWhatsAppDirectUrl, getYouTubeEmbedUrl } from '../../utils/mediaUpload';
import { CheckoutInvoiceModal } from './CheckoutInvoiceModal';
import { ShopShareModal } from '../modals/ShopShareModal';
import { updateShopSeoMeta, resetPlatformSeoMeta } from '../../utils/seo';
import { getThemeById } from '../../data/indianThemes';
import { getDefaultSectionsConfig } from '../../utils/sectionDefaults';
import { FloatingActionButtons } from './FloatingActionButtons';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../../utils/shopTranslations';
import { initGoogleTranslate, applyGoogleTranslation } from '../../utils/googleTranslate';
import {
  HeroSectionRenderer,
  AboutSectionRenderer,
  FeaturesSectionRenderer,
  ServicesSectionRenderer,
  CoursesSectionRenderer,
  OffersSectionRenderer,
  PortfolioSectionRenderer,
  TeamSectionRenderer,
  FaqSectionRenderer,
  CtaSectionRenderer,
  SocialMediaSectionRenderer,
  BlogSectionRenderer,
  GallerySectionRenderer,
  VideoSectionRenderer,
} from './PublicStoreSections';
import { StoreItemsCarouselSection } from './StoreItemsCarouselSection';
import { ProductDetailModal } from './ProductDetailModal';

interface PublicShopPageProps {
  shop?: Shop;
  shopId?: string;
  popups: AdvertisementPopup[];
  globalPopupEnabled: boolean;
  onNavigateHome: () => void;
  onOpenVendorLogin: () => void;
  onSubmitInquiry: (inquiry: Omit<ShopInquiry, 'id' | 'date' | 'status'>) => void;
  isVendorOrAdminPreview?: boolean;
}

export const PublicShopPage: React.FC<PublicShopPageProps> = ({
  shop,
  shopId,
  popups,
  globalPopupEnabled,
  onNavigateHome,
  onOpenVendorLogin,
  onSubmitInquiry,
  isVendorOrAdminPreview = false,
}) => {
  // Cart & UI state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<AdvertisementPopup | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPwaInstallModal, setShowPwaInstallModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Language State (Multi-language Support - Default: English)
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [languageToast, setLanguageToast] = useState<SupportedLanguage | null>(null);

  // Initialize Multi-Language Translation System on Mount (Default: English)
  useEffect(() => {
    try {
      if (localStorage.getItem('shop_lang_default_v3') !== 'true') {
        localStorage.setItem('shop_lang_default_v3', 'true');
        localStorage.setItem('shop_preferred_language', 'en');
      }
      const saved = (localStorage.getItem('shop_preferred_language') as SupportedLanguage) || 'en';
      setCurrentLanguage(saved);
      initGoogleTranslate(saved);
    } catch {
      initGoogleTranslate('en');
    }
  }, []);

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    applyGoogleTranslation(lang);
    setLanguageToast(lang);
    try {
      localStorage.setItem('shop_preferred_language', lang);
    } catch {
      // ignore
    }
    setTimeout(() => {
      setLanguageToast(null);
    }, 2800);
  };

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIosPwaGuide, setShowIosPwaGuide] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [pwaInstalledToast, setPwaInstalledToast] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState<'ALL' | 'PRODUCT' | 'SERVICE' | 'IN_STOCK'>('ALL');
  
  // Inquiry form state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custMsg, setCustMsg] = useState('');
  const [custService, setCustService] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const inquirySectionRef = useRef<HTMLDivElement>(null);

  // Store accessibility: accessible as long as shop exists; shows status badge if not yet published
  const isAccessible = Boolean(shop);

  // 16 Modular Website Sections Config (fallback to smart category defaults)
  const sectionsConfig = shop ? (shop.sectionsConfig || getDefaultSectionsConfig(shop)) : null;

  // Popup targeting logic (STEP 30–33)
  useEffect(() => {
    if (!shop || !isAccessible || !globalPopupEnabled) return;

    const eligiblePopup = popups.find((pop) => {
      if (!pop.isEnabled) return false;
      const now = new Date();
      if (pop.startDate && new Date(pop.startDate) > now) return false;
      if (pop.endDate && new Date(pop.endDate) < now) return false;
      if (pop.targetType === 'ALL_PUBLISHED') return true;
      if (pop.targetType === 'CATEGORIES') {
        return pop.targetCategories?.some((cat) => shop.category.toLowerCase().includes(cat.toLowerCase()));
      }
      if (pop.targetType === 'SELECTED_SHOPS') {
        return pop.targetShopIds?.includes(shop.shopId);
      }
      return false;
    });

    if (eligiblePopup) {
      const sessionKey = `popup_seen_${eligiblePopup.id}`;
      if (eligiblePopup.frequency === 'ONCE_PER_SESSION') {
        const hasSeen = sessionStorage.getItem(sessionKey);
        if (!hasSeen) {
          setActivePopup(eligiblePopup);
          sessionStorage.setItem(sessionKey, 'true');
        }
      } else {
        setActivePopup(eligiblePopup);
      }
    }
  }, [shop, isAccessible, globalPopupEnabled, popups]);

  // If Shop Not Found
  if (!shop) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#FCF9F5]">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Shop Not Found (404)</h2>
          <p className="text-xs text-gray-600">
            Shop ID <strong>{shopId}</strong> platform par maujood nahi hai ya remove kar di gayi hai.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm shadow-xs"
          >
            Back to IndianLalaJi Home
          </button>
        </div>
      </div>
    );
  }

  // STEP 6: Security Protection if NOT published
  if (!isAccessible) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#FCF9F5]">
        <div className="max-w-lg w-full bg-white rounded-2xl p-8 border-2 border-orange-300 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-orange-800 bg-orange-50 px-3 py-1 rounded-sm inline-block">
              {shop.shopId}
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
              {shop.businessName}
            </h2>
            <div className="text-xs font-black uppercase tracking-wider text-orange-800">
              Status: {shop.status}
            </div>
          </div>

          <div className="p-4 bg-orange-50/60 rounded-xl text-xs text-orange-950 space-y-2 border border-orange-200 text-left">
            <p className="font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-orange-700" />
              <span>Dukaan Abhi Under Verification Hai:</span>
            </p>
            <p className="text-gray-700">
              IndianLalaJi security rules ke mutabiq yeh public website tabhi open hogi jab Super Admin isko review karke <strong>PUBLISH</strong> kar dega.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenVendorLogin}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm"
            >
              Vendor Login to Edit
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm"
            >
              Explore Live Stores
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cart operations
  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const deleteFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Active Theme / Styling from shop config
  const activeThemeId = shop ? (shop.themeId || shop.templateId || 'bharat-royal') : 'bharat-royal';
  const activeTheme = getThemeById(activeThemeId);

  // PWA beforeinstallprompt & standalone check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      if (isStandalone) {
        setIsAppInstalled(true);
      }

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      const handleInstalled = () => {
        setIsAppInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        setPwaInstalledToast(true);
        setTimeout(() => setPwaInstalledToast(false), 4000);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      window.addEventListener('appinstalled', handleInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('appinstalled', handleInstalled);
      };
    }
  }, []);

  // Sync Dynamic PWA Manifest, Title & Theme Color for THIS specific vendor
  useEffect(() => {
    if (!shop) return;
    document.title = `${shop.businessName} — ${activeTheme.name} Online Store`;

    // Dynamic Manifest for Vendor's specific PWA
    const vendorManifest = {
      id: `/?shop=${encodeURIComponent(shop.shopId)}`,
      name: `${shop.businessName}`,
      short_name: `${shop.businessName.slice(0, 12)}`,
      description: shop.tagline || shop.description || `${shop.businessName} Online Store on IndianLalaJi`,
      start_url: `/?shop=${encodeURIComponent(shop.shopId)}`,
      scope: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: activeTheme.primaryColor || '#EA580C',
      icons: [
        {
          src: shop.logoUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=192',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: shop.logoUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=512',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
    };

    try {
      const blob = new Blob([JSON.stringify(vendorManifest)], { type: 'application/json' });
      const manifestUrl = URL.createObjectURL(blob);
      let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'manifest';
        document.head.appendChild(link);
      }
      link.href = manifestUrl;

      return () => {
        URL.revokeObjectURL(manifestUrl);
      };
    } catch {
      // safe fallback
    }
  }, [shop?.shopId, shop?.businessName, shop?.logoUrl, activeTheme.primaryColor, activeTheme.name]);

  // Auto-trigger PWA install prompt when visited via QR Code scanner (?action=install_pwa)
  useEffect(() => {
    if (typeof window !== 'undefined' && shop) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'install_pwa' || params.get('install') === 'true') {
        const timer = setTimeout(() => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
          } else {
            setShowPwaInstallModal(true);
          }
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [shop?.shopId, deferredPrompt]);

  const handleInstallPwaClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIos) {
        setShowIosPwaGuide(true);
      } else {
        setShowPwaInstallModal(true);
      }
    }
  };

  // Separate products, services, and courses explicitly to avoid duplicates
  const catalogProducts = shop.products.filter((p) => p.type !== 'SERVICE' && p.type !== 'COURSE');
  const catalogServices = shop.products.filter((p) => p.type === 'SERVICE');
  const catalogCourses = shop.products.filter((p) => p.type === 'COURSE');

  // Products filtering (strictly for products section)
  const filteredProducts = catalogProducts.filter((p) => {
    // Type/stock filter
    if (productTypeFilter === 'IN_STOCK' && !p.inStock) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      return matchName || matchDesc || matchCat;
    }
    return true;
  });

  const getCanonicalShopUrl = () => {
    return `${window.location.origin}/?shop=${encodeURIComponent(shop.shopId)}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(shop.upiId || '7087033009@paytm');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Dynamic SEO & OpenGraph Meta updater for shared link
  useEffect(() => {
    if (shop) {
      updateShopSeoMeta(shop);
    }
    return () => {
      resetPlatformSeoMeta();
    };
  }, [shop]);

  const handleCopyShareLink = () => {
    const canonical = getCanonicalShopUrl();
    navigator.clipboard.writeText(canonical);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleBookService = (serviceName: string) => {
    setCustService(serviceName);
    setCustMsg(`Namaste! I am interested in booking: ${serviceName}. Please share availability and details.`);
    inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    onSubmitInquiry({
      shopId: shop.shopId,
      customerName: custName,
      customerPhone: custPhone,
      message: custMsg,
      serviceOrProductRequested: custService || undefined,
    });

    setInquirySubmitted(true);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${shop.businessName} ${shop.address} ${shop.city} ${shop.state} ${shop.pincode}`
  )}`;

  return (
    <div className={`min-h-screen bg-[#FBF9F6] bg-gradient-to-b ${activeTheme.bgGradient} text-slate-900 font-sans pb-0`}>
      
      {/* 1. TOP TRUST & DIRECT MERCHANT ANNOUNCEMENT BAR (LIGHT THEME) */}
      {shop.status !== 'PUBLISHED' && (
        <div className="bg-amber-500 text-slate-900 text-xs py-1.5 px-4 font-bold text-center flex items-center justify-center gap-2">
          <span>⚡ Store Setup Mode ({shop.status}): All products and details are live and visible across all devices.</span>
        </div>
      )}
      <div className="bg-amber-50/90 text-slate-800 text-[11px] py-2 px-4 border-b border-amber-200/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 text-emerald-800 font-bold shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Direct Store</span>
            </span>
            <span className="text-amber-300 hidden sm:inline">•</span>
            <span className="text-slate-700 hidden sm:inline font-medium">0% Extra Commission</span>
            <span className="text-amber-300 hidden md:inline">•</span>
            <span className="text-slate-700 hidden md:inline font-medium">Instant WhatsApp Delivery & Booking</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-slate-700 font-semibold">
            <a 
              href={`tel:${shop.phone}`} 
              className="hover:text-orange-600 flex items-center gap-1 transition-colors"
              title="Call store directly"
            >
              <Phone className="w-3 h-3 text-orange-600" />
              <span className="hidden sm:inline">Call:</span> {shop.phone}
            </a>
            <button 
              onClick={onOpenVendorLogin} 
              className="hover:text-orange-600 flex items-center gap-1 transition-colors pl-2.5 border-l border-amber-300/80 cursor-pointer"
              title="Store Owner Portal"
            >
              <Lock className="w-3 h-3 text-orange-600" />
              <span>Merchant Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN STORE NAVIGATION HEADER BAR */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Shop Logo & Title */}
          <a href="#hero" className="flex items-center gap-3 min-w-0 group">
            <div className="relative shrink-0">
              <img
                src={shop.logoUrl}
                alt={shop.businessName}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-gray-200 bg-white shadow-xs group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-xs" title="Verified Merchant">
                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 truncate font-['Outfit',sans-serif]">
                  {shop.businessName}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" /> 4.9
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                <span className="font-mono font-bold text-orange-600 text-[11px]">{shop.shopId}</span>
                <span className="text-gray-300">•</span>
                <span className="truncate">{shop.category}</span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-700">
            <a href="#hero" className="hover:text-orange-600 transition-colors py-1">
              {getTranslation('nav.home', currentLanguage, 'Home')}
            </a>
            <a href="#about" className="hover:text-orange-600 transition-colors py-1">
              {getTranslation('nav.about', currentLanguage, 'About Us')}
            </a>
            <a href="#products" className="hover:text-orange-600 transition-colors py-1">
              {getTranslation('nav.products', currentLanguage, 'Products')}
            </a>
            <a href="#services" className="hover:text-orange-600 transition-colors py-1">
              {getTranslation('nav.services', currentLanguage, 'Services')}
            </a>
            {catalogCourses.length > 0 && (
              <a href="#courses" className="hover:text-orange-600 transition-colors py-1">
                Courses
              </a>
            )}
            {shop.videos && shop.videos.length > 0 && (
              <a href="#videos" className="hover:text-orange-600 transition-colors py-1">Videos</a>
            )}
            <a href="#contact-inquiry" className="hover:text-orange-600 transition-colors py-1">
              {getTranslation('nav.contact', currentLanguage, 'Contact')}
            </a>
          </nav>

          {/* Actions: UPI Pay, Cart, Call, WhatsApp, Language, Share */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* 0% UPI Payment QR Button */}
            <button
              onClick={() => setShowQrModal(true)}
              className="px-2.5 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 border border-orange-200 transition-all hover:scale-102 cursor-pointer shadow-xs"
              title="0% Direct UPI QR Payment"
            >
              <QrCode className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden sm:inline">0% UPI Pay</span>
            </button>

            {/* Direct WhatsApp Order/Chat */}
            <a
              id="shop-whatsapp-header-btn"
              href={getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `Namaste ${shop.businessName}, maine aapka store dekha!`)}
              target="_blank"
              rel="noreferrer"
              className="px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-102"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Cart Icon with Counter */}
            {shop.ecommerceEnabled && (
              <button
                id="header-cart-btn"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-all shadow-xs hover:scale-105 cursor-pointer"
                title="View Shopping Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}

           {/* Share Link */}
            <button
              id="shop-header-share-btn"
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-slate-900 hover:bg-gray-100 rounded-xl relative cursor-pointer transition-colors"
              title="Share Shop Link / Open Apps"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedUrl && (
                <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50">
                  Link Copied!
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 text-slate-800 hover:bg-gray-100 rounded-xl cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Nav */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider">
              <a 
                href="#hero" 
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 bg-gray-50 rounded-lg hover:bg-orange-50 text-slate-800 hover:text-orange-700"
              >
                {getTranslation('nav.home', currentLanguage, 'Home')}
              </a>
              <a 
                href="#about" 
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 bg-gray-50 rounded-lg hover:bg-orange-50 text-slate-800 hover:text-orange-700"
              >
                {getTranslation('nav.about', currentLanguage, 'About Us')}
              </a>
              <a 
                href="#products" 
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 bg-gray-50 rounded-lg hover:bg-orange-50 text-slate-800 hover:text-orange-700"
              >
                {getTranslation('nav.products', currentLanguage, 'Products')}
              </a>
              <a 
                href="#services" 
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 bg-gray-50 rounded-lg hover:bg-orange-50 text-slate-800 hover:text-orange-700"
              >
                {getTranslation('nav.services', currentLanguage, 'Services')}
              </a>
              {catalogCourses.length > 0 && (
                <a 
                  href="#courses" 
                  onClick={() => setMobileNavOpen(false)}
                  className="p-2.5 bg-gray-50 rounded-lg hover:bg-orange-50 text-slate-800 hover:text-orange-700"
                >
                  Courses
                </a>
              )}
              <a 
                href="#contact-inquiry" 
                onClick={() => setMobileNavOpen(false)}
                className={`${catalogCourses.length > 0 ? '' : 'col-span-2'} p-2.5 bg-gray-50 rounded-lg hover:bg-orange-50 text-slate-800 hover:text-orange-700`}
              >
                {getTranslation('nav.contact', currentLanguage, 'Contact & Inquiry')}
              </a>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onOpenVendorLogin();
                }}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-white" />
                <span>Store Owner / Merchant Login</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* COPIED TOAST */}
      {copiedUrl && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 border border-orange-500 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Shop Link Copied to Clipboard!</span>
        </div>
      )}

      {/* 1. HERO SECTION (ON/OFF & Custom Builder Config) */}
      {sectionsConfig && sectionsConfig.hero.enabled && (
        <HeroSectionRenderer
          config={sectionsConfig.hero}
          shop={shop}
          onCtaClick={() => {
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* 2. ABOUT US SECTION */}
      {sectionsConfig && sectionsConfig.about.enabled && (
        <AboutSectionRenderer config={sectionsConfig.about} shop={shop} />
      )}

      {/* 3. FEATURES SECTION (ON/OFF & Custom Builder Config) */}
      {sectionsConfig && sectionsConfig.features.enabled && (
        <FeaturesSectionRenderer config={sectionsConfig.features} />
      )}

      {/* 4. SERVICES SECTION (Rendered from Store's Services Catalogue) */}
      {catalogServices.length > 0 && (
        <ServicesSectionRenderer
          config={sectionsConfig?.services}
          catalogServices={catalogServices}
          shop={shop}
          cart={cart}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onSelectService={(serviceProd) => setSelectedProduct(serviceProd)}
          onBookService={(serviceName) => {
            setCustService(serviceName);
            inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* 5. PRODUCTS CATALOGUE SECTION */}
      {(!sectionsConfig || sectionsConfig.products.enabled) && catalogProducts.length > 0 && (
        <StoreItemsCarouselSection
          id="products"
          title={getTranslation('nav.products', currentLanguage, 'Store Products')}
          subtitle="Direct store prices with zero platform commission and instant WhatsApp delivery."
          badgeText="Products Catalogue"
          isService={false}
          items={catalogProducts}
          shop={shop}
          cart={cart}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onSelectItem={(prod) => setSelectedProduct(prod)}
          searchPlaceholder={getTranslation('search.placeholder', currentLanguage, 'Search products...')}
        />
      )}

      {/* 6. COURSES SECTION (Rendered from Store's Courses Catalogue) */}
      {catalogCourses.length > 0 && (
        <CoursesSectionRenderer
          config={sectionsConfig?.courses}
          catalogCourses={catalogCourses}
          shop={shop}
          cart={cart}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onSelectCourse={(courseProd) => setSelectedProduct(courseProd)}
        />
      )}

      {/* 7. STORE DEMO VIDEOS */}
      {(!sectionsConfig?.videos || sectionsConfig.videos.enabled) && (
        <VideoSectionRenderer shop={shop} config={sectionsConfig?.videos} />
      )}

      {/* 8. OUR OFFERS & PROMOTIONAL BANNERS */}
      {sectionsConfig && sectionsConfig.offers && sectionsConfig.offers.enabled && (
        <OffersSectionRenderer config={sectionsConfig.offers} shop={shop} />
      )}

      {/* 9. PHOTO GALLERY SECTION */}
      {(!sectionsConfig || !sectionsConfig.gallery || sectionsConfig.gallery.enabled) && (
        <GallerySectionRenderer config={sectionsConfig?.gallery} shop={shop} />
      )}

      {/* 10. PORTFOLIO / WORK SHOWCASE (ON/OFF & Custom Builder Config) */}
      {sectionsConfig && sectionsConfig.portfolio.enabled && (
        <PortfolioSectionRenderer config={sectionsConfig.portfolio} />
      )}

      {/* 11. TEAM SECTION (ON/OFF & Custom Builder Config - Image + Position + Name) */}
      {sectionsConfig && sectionsConfig.team.enabled && (
        <TeamSectionRenderer config={sectionsConfig.team} />
      )}

      {/* 12. FAQ SECTION (ON/OFF & Custom Builder Config) */}
      {sectionsConfig && sectionsConfig.faq.enabled && (
        <FaqSectionRenderer config={sectionsConfig.faq} />
      )}

      {/* 13. CTA SECTION (ON/OFF & Custom Builder Config) */}
      {sectionsConfig && sectionsConfig.cta.enabled && (
        <CtaSectionRenderer config={sectionsConfig.cta} shop={shop} />
      )}

      {/* 14. CONTACT US & CUSTOMER INQUIRY FORM SECTION (ON/OFF & Custom Builder Config) */}
      {(!sectionsConfig || sectionsConfig.contact.enabled) && (
      <section id="contact-inquiry" ref={inquirySectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-8">
        <div className="bg-gradient-to-br from-orange-50/80 via-white to-white rounded-3xl border border-orange-200/80 p-4 sm:p-10 lg:p-12 shadow-sm">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <div className="inline-flex items-center gap-1.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
              <MessageSquare className="w-3.5 h-3.5" /> Direct Merchant Connect
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
              Connect With {shop.businessName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Send your message or service inquiry directly to {shop.vendorName}. It will instantly notify the vendor.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Contact Info Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-6 shadow-xs space-y-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                  <span>Store Coordinates</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Phone Call Helpline</div>
                      <a href={`tel:${shop.phone}`} className="text-gray-600 hover:text-orange-600 font-medium transition-colors">{shop.phone}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">WhatsApp Direct Chat</div>
                      <a 
                        href={getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `Namaste!`)}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gray-600 hover:text-emerald-700 font-medium transition-colors"
                      >
                        {shop.whatsapp || shop.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Store Address</div>
                      <p className="text-gray-600 text-[11px] leading-relaxed mt-0.5">
                        {shop.address}, {shop.city}, {shop.state} - {shop.pincode}
                      </p>
                      <a 
                        href={googleMapsUrl}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] font-bold text-orange-600 hover:underline inline-flex items-center gap-1 mt-1.5"
                      >
                        <span>Open in Google Maps</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Operating Hours</div>
                      <p className="text-gray-600 text-[11px] mt-0.5">{shop.workingHours || '9:00 AM - 9:00 PM (Monday - Sunday)'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">0% UPI Direct Pay ID</div>
                      <p className="font-mono text-gray-800 text-[11px] font-bold mt-0.5">{shop.upiId || '7087033009@paytm'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Inquiry Form */}
            <div className="lg:col-span-7">
              {inquirySubmitted ? (
                <div className="bg-white rounded-2xl border border-emerald-300 p-8 text-center space-y-4 shadow-sm animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">Aapka Sandesh Bhej Diya Gaya Hai!</h4>
                  <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                    Store owner <strong>{shop.vendorName}</strong> aapse jald hi call ya WhatsApp par sampark karenge.
                  </p>
                  <button
                    onClick={() => {
                      setInquirySubmitted(false);
                      setCustName('');
                      setCustPhone('');
                      setCustMsg('');
                      setCustService('');
                    }}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs cursor-pointer transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-200/90 shadow-sm space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                    <span>Send Direct Message / Inquiry</span>
                    <span className="text-[10px] text-gray-400 font-normal">Direct Vendor Inbox</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Aapka Naam (Customer Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amit Sharma"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Mobile Number / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Product ya Service Required (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sofa Cleaning / Special Order / Bulk Rate"
                      value={custService}
                      onChange={(e) => setCustService(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Aapka Sandesh (Message / Inquiry) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Apna sandesh ya sawal yahan likhein..."
                      value={custMsg}
                      onChange={(e) => setCustMsg(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Direct Inquiry to {shop.businessName}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>
      )}

      {/* 15. SOCIAL MEDIA SECTION */}
      {(!sectionsConfig?.socialMedia || sectionsConfig.socialMedia.enabled) && (
        <SocialMediaSectionRenderer config={sectionsConfig?.socialMedia} shop={shop} />
      )}

      {/* 16. BLOG / ARTICLES SECTION (ON/OFF & Custom Builder Config) */}
      {sectionsConfig && sectionsConfig.blog.enabled && (
        <BlogSectionRenderer config={sectionsConfig.blog} shop={shop} />
      )}

      {/* 17. STORE FOOTER WITH VENDOR PAYMENT QR (LIGHT THEME) */}
      {(!sectionsConfig || sectionsConfig.footer.enabled) && (
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 mb-0 pb-0">
        <div className="bg-white text-slate-900 rounded-3xl border border-gray-200/90 p-5 sm:p-10 lg:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          {/* Shop Bio */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <img
                src={shop.logoUrl}
                alt={shop.businessName}
                className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-xs bg-white shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-black uppercase tracking-tight text-slate-950 font-['Outfit',sans-serif] text-sm truncate">
                  {shop.businessName}
                </h4>
                <div className="text-[10px] text-orange-600 font-bold">{shop.category} • Verified Local Merchant</div>
                <div className="font-mono text-slate-500 font-bold text-[10px]">{shop.shopId}</div>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              {shop.tagline || shop.aboutStory || 'Aapki apni bharosemand local dukaan. Behtar quality aur genuine rate ke sath.'}
            </p>
            <div className="text-[11px] text-slate-600 space-y-1.5 pt-1">
              <div><strong className="text-slate-900">Address:</strong> {shop.address}, {shop.city}, {shop.state} - {shop.pincode}</div>
              <div><strong className="text-slate-900">Helpline:</strong> +91 {shop.phone}</div>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h5 className="font-black uppercase tracking-wider text-slate-900 text-xs">Quick Navigation</h5>
            <ul className="space-y-2.5 text-slate-600">
              <li><a href="#hero" className="hover:text-orange-600 transition-colors">Home Showcase</a></li>
              <li><a href="#about" className="hover:text-orange-600 transition-colors">About Proprietor</a></li>
              <li><a href="#products" className="hover:text-orange-600 transition-colors">Products & Catalogue</a></li>
              <li><a href="#contact-inquiry" className="hover:text-orange-600 transition-colors">Direct Inquiry Form</a></li>
              <li>
                <button onClick={() => setShowQrModal(true)} className="hover:text-orange-600 transition-colors cursor-pointer text-left">
                  0% Direct UPI QR Modal
                </button>
              </li>
            </ul>
          </div>

          {/* VENDOR PAYMENT QR PHOTO CARD */}
          <div className="space-y-3 bg-orange-50/70 p-4.5 rounded-2xl border border-orange-200/80">
            <div className="flex items-center gap-1.5 text-orange-950 font-black uppercase tracking-wider text-[11px]">
              <QrCode className="w-4 h-4 text-orange-600" />
              <span>Direct Payment QR</span>
            </div>
            
            {/* Payment QR Photo */}
            <div className="bg-white p-2 rounded-xl border border-orange-200 inline-block shadow-xs">
              <img
                src={shop.paymentQrUrl}
                alt={`${shop.businessName} Payment QR`}
                className="w-32 h-32 object-contain mx-auto rounded-lg"
              />
            </div>

            {/* UPI ID & One-click Copy */}
            <div className="flex items-center justify-between gap-1 bg-white px-3 py-1.5 rounded-xl border border-orange-200 text-[11px]">
              <span className="font-mono font-bold text-slate-900 truncate">{shop.upiId || '7087033009@paytm'}</span>
              <button
                onClick={handleCopyUpi}
                className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-[9px] uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
              >
                {copiedUpi ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <p className="text-[10px] text-slate-600 leading-tight">
              Pay direct via GPay, PhonePe, Paytm, BHIM. 0% Commission direct to vendor bank account.
            </p>
          </div>

          {/* Owner Portal & Platform Link */}
          <div className="space-y-3">
            <h5 className="font-black uppercase tracking-wider text-slate-900 text-xs">Merchant Administration</h5>
            <p className="text-slate-600 text-[11px]">
              Dukaan ke owner hain? Yahan se login karke product, photo ya price edit karein.
            </p>
            <button
              onClick={onOpenVendorLogin}
              className="w-full py-2.5 px-3 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-101 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Merchant Login</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-950 font-bold uppercase tracking-wider text-[11px] rounded-xl border border-orange-200/80 transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-orange-600" />
              <span>IndianLalaJi Platform</span>
            </button>
          </div>

        </div>

        <div className="text-center text-[11px] text-slate-500 pt-4 pb-1.5 sm:pb-2">
          {sectionsConfig?.footer?.copyrightText || `© ${new Date().getFullYear()} ${shop.businessName}. All rights reserved. Verified direct store powered by IndianLalaJi.`}
        </div>
      </footer>
      )}

      {/* 11. SLIDE-OVER CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-4 bg-white text-slate-900 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                <h3 className="font-black uppercase tracking-tight text-base font-['Outfit',sans-serif]">
                  {getTranslation('cart.title', currentLanguage, 'Shopping Cart')} ({totalCartCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-gray-500 hover:text-slate-900 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3 text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-300" />
                  <p className="text-sm font-bold text-slate-700">
                    {getTranslation('cart.empty', currentLanguage, 'Aapka cart abhi khali hai')}
                  </p>
                  <p className="text-xs">Store catalogue se apne manpasand products add karein.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 bg-orange-600 text-white font-bold uppercase tracking-wider text-xs rounded-sm"
                  >
                    Browse Items
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3 justify-between"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {item.product.type === 'SERVICE' && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 leading-none">
                            Service
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                      </div>
                      <div className="text-xs font-black text-orange-600 font-['Outfit',sans-serif]">
                        {formatINR(item.product.price)} × {item.quantity} = {formatINR(item.product.price * item.quantity)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-7 h-7 rounded-sm bg-white border border-gray-300 text-slate-700 flex items-center justify-center hover:bg-gray-100 font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs font-mono">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item.product)}
                        className="w-7 h-7 rounded-sm bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteFromCart(item.product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 ml-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>{getTranslation('cart.subtotal', currentLanguage, 'Items Subtotal')} ({totalCartCount})</span>
                    <span className="font-semibold">{formatINR(totalCartAmount)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Middleman Commission</span>
                    <span>₹0 (0% Extra)</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-gray-200 font-['Outfit',sans-serif]">
                    <span>Total Amount</span>
                    <span className="text-orange-600">{formatINR(totalCartAmount)}</span>
                  </div>
                </div>

                <button
                  id="drawer-checkout-btn"
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="w-full py-3.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Checkout & View Invoice Bill</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    id="drawer-checkout-whatsapp-btn"
                    href={getWhatsAppCartMessageUrl(shop.whatsapp || shop.phone, shop.businessName, cart)}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{getTranslation('cart.checkoutWhatsApp', currentLanguage, 'WhatsApp')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="py-2.5 rounded-sm bg-white hover:bg-gray-100 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-gray-300 shadow-xs cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-orange-600" />
                    <span>0% UPI QR</span>
                  </button>
                </div>

                <div className="text-center">
                  <button
                    onClick={clearCart}
                    className="text-[10px] text-gray-400 hover:text-red-600 font-bold uppercase tracking-wider"
                  >
                    {getTranslation('cart.clear', currentLanguage, 'Clear All Items')}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 12. COMPACT FLOATING CART CAPSULE (TOTAL AMOUNT + CHECK OUT) */}
      {shop.ecommerceEnabled && totalCartCount > 0 && !isCartOpen && !showInvoiceModal && (
        <div 
          id="cart-bottom-capsule-container"
          className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 duration-200 pointer-events-auto max-w-[calc(100vw-1.5rem)] sm:max-w-md w-auto"
        >
          <div 
            id="cart-bottom-capsule"
            className="bg-slate-950/95 text-white pl-3.5 sm:pl-4.5 pr-1.5 sm:pr-2 py-1.5 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center justify-between gap-2.5 sm:gap-4 transition-all overflow-hidden box-border"
          >
            {/* Total Amount with item count */}
            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer text-left bg-transparent border-0 p-0 active:scale-98 transition-transform select-none"
              title="View Bill & Checkout"
            >
              <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-orange-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                {totalCartCount}
              </div>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">Total:</span>
                <span className="text-sm sm:text-base font-black text-white font-['Outfit',sans-serif] tracking-tight whitespace-nowrap">
                  {formatINR(totalCartAmount)}
                </span>
              </div>
            </button>

            {/* Check out button - perfectly contained within capsule boundary */}
            <button
              id="capsule-checkout-btn"
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="h-8 sm:h-8.5 px-3.5 sm:px-4.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span>Check out</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 13. CHECKOUT INVOICE & BILL MODAL (IMAGE GENERATION, DOWNLOAD & WHATSAPP SHARE) */}
      <CheckoutInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        shop={shop}
        cart={cart}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onOpenQrModal={() => setShowQrModal(true)}
      />

           {/* 14. 0% UPI QR PAYMENT MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border-2 border-orange-400 relative animate-in zoom-in-95">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                {shop.businessName}
              </h3>
              <p className="text-xs text-emerald-700 font-bold">Direct 0% Commission UPI QR Code</p>
            </div>

            {/* QR Image */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 inline-block">
              <img
                src={shop.paymentQrUrl}
                alt="UPI QR Code"
                className="w-52 h-52 object-contain mx-auto"
              />
            </div>

            {/* UPI ID & Copy */}
            <div className="p-2.5 bg-gray-100 rounded-sm flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-800 truncate">{shop.upiId || '7087033009@paytm'}</span>
              <button
                onClick={handleCopyUpi}
                className="px-2.5 py-1 bg-white hover:bg-orange-50 text-orange-700 font-bold uppercase tracking-wider rounded-sm border border-gray-200 shrink-0"
              >
                {copiedUpi ? 'Copied! ✓' : 'Copy UPI'}
              </button>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              Google Pay, PhonePe, Paytm ya kisi bhi UPI app se scan karke payment karein aur screenshot WhatsApp par share karein.
            </p>
          </div>
        </div>
      )}

      {/* 15. ADVERTISEMENT POPUP (STEP 30–33) */}
      {activePopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-orange-400 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActivePopup(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black text-white p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-4/3 w-full bg-gray-100">
              <img
                src={activePopup.imageUrl}
                alt={activePopup.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-4 text-center">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                {activePopup.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {activePopup.description}
              </p>

              <div className="pt-2 flex items-center justify-center gap-3">
                <a
                  href={activePopup.buttonUrl || getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `I am interested in offer: ${activePopup.title}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <span>{activePopup.buttonText || 'Claim Offer on WhatsApp'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA IOS INSTALL GUIDE MODAL */}
      {showIosPwaGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-slate-900 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowIosPwaGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-center text-slate-900">
              Install {shop.businessName} on iPhone
            </h3>
            <p className="text-xs text-center text-gray-600 mt-1">
              Safari browser me ye do aasan steps follow karein aur dukaan ka app phone me install karein:
            </p>

            <div className="mt-4 space-y-3 text-xs bg-orange-50/60 p-4 rounded-2xl border border-orange-200">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <span className="font-bold text-slate-900">Tap Share Button</span>
                  <p className="text-gray-600 text-[11px] mt-0.5">
                    Safari ke neeche <strong>Share (⎋)</strong> icon par click karein.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <span className="font-bold text-slate-900">Add to Home Screen</span>
                  <p className="text-gray-600 text-[11px] mt-0.5">
                    Neeche scroll karein aur <strong>"Add to Home Screen" (➕)</strong> chunein.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosPwaGuide(false)}
              className="w-full mt-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Samajh Gaya!
            </button>
          </div>
        </div>
      )}

      {/* PWA INSTALLED TOAST */}
      {pwaInstalledToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-500 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>🎉 {shop.businessName} App successfully installed on your device!</span>
        </div>
      )}

      {/* PWA INSTALL MODAL (Auto-triggered by QR scan ?action=install_pwa or Header button) */}
      {showPwaInstallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-slate-900 shadow-2xl relative animate-in fade-in zoom-in-95 border border-gray-200">
            <button
              onClick={() => setShowPwaInstallModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3">
              {shop.logoUrl ? (
                <img
                  src={shop.logoUrl}
                  alt={shop.businessName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                  {shop.businessName.charAt(0)}
                </div>
              )}

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                  PWA Mobile App
                </span>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mt-1 font-['Outfit',sans-serif]">
                  {shop.businessName}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Apne phone par app ki tarah save karein aur bina browser khole 1-click me order karein!
                </p>
              </div>
            </div>

            {/* Direct 1-Tap button if browser supports native prompt */}
            {deferredPrompt && (
              <button
                type="button"
                onClick={async () => {
                  deferredPrompt.prompt();
                  const choice = await deferredPrompt.userChoice;
                  if (choice?.outcome === 'accepted') {
                    setIsInstallable(false);
                    setShowPwaInstallModal(false);
                  }
                  setDeferredPrompt(null);
                }}
                className="w-full mt-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
              >
                <Smartphone className="w-4 h-4" />
                <span>1-Tap Add To Home Screen</span>
              </button>
            )}

            {/* Step-by-step instructions */}
            <div className="mt-4 space-y-2.5 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                Mobile Me Install Karne Ka Tarika:
              </div>
              
              <div className="flex items-start gap-2.5 text-[11px] text-gray-700">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white font-black flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>Chrome ya browser ke menu <strong>(⋮ / 3 dots)</strong> par click karein.</span>
              </div>

              <div className="flex items-start gap-2.5 text-[11px] text-gray-700">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white font-black flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>Menu me <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> par tap karein.</span>
              </div>

              <div className="flex items-start gap-2.5 text-[11px] text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>Dukaan ka icon aapki phone screen par app ki tarah ban jayega!</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowPwaInstallModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center cursor-pointer transition-colors"
              >
                Theek Hai!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT & SERVICE DETAIL POPUP MODAL */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        shop={shop}
        cart={cart}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onBookService={(serviceName) => {
          setCustService(serviceName);
          inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* DUKAAN DYNAMIC SEO & SOCIAL SHARE CARD MODAL */}
      <ShopShareModal
        shop={shop}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* LANGUAGE SWITCH CONFIRMATION TOAST */}
      {languageToast && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-indigo-400/50 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span className="notranslate" translate="no">
            Bhasha badal di gayi: {SUPPORTED_LANGUAGES.find(l => l.code === languageToast)?.nativeName || languageToast}
          </span>
        </div>
      )}

      {/* 16. BOTTOM RIGHT FLOATING ACTION CIRCLE BUTTONS (WHATSAPP, CALL, MULTI-LANGUAGE, GOOGLE LOCATION) */}
      <FloatingActionButtons
        shop={shop}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        hasBottomCartBar={Boolean(shop.ecommerceEnabled && totalCartCount > 0 && !isCartOpen)}
      />

    </div>
  );
};

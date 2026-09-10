import React, { useState, useMemo } from 'react';
import { 
  Store, 
  Eye, 
  LogOut, 
  PhoneCall, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  Palette, 
  ShoppingBag, 
  Video, 
  QrCode, 
  MessageSquare, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Send,
  HelpCircle,
  Tag,
  Share2,
  Sparkles,
  Phone,
  Mail,
  UserCheck,
  Edit2,
  X,
  Check,
  Calendar,
  GraduationCap,
  ShieldCheck,
  Award,
  Zap,
  Copy,
  FileText,
  Printer,
  Download,
  Building2,
  Layout,
  ArrowRight,
  ArrowLeft,
  User,
  CreditCard,
  Receipt,
  Settings,
  Package,
  Wrench,
  EyeOff,
  Menu,
  Home,
  BarChart3,
  FolderTree,
  Globe,
  Database,
  HardDrive,
  ToggleLeft,
  ToggleRight,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { Shop, ProductItem, VideoItem, ShopInquiry, ProductType, FloatingButtonsConfig, ShopCategory } from '../../types';
import { fileToBase64, formatINR, getWhatsAppDirectUrl, getYouTubeEmbedUrl, formatDisplayDate, calculateDaysRemaining, getOneYearExpiryDate } from '../../utils/mediaUpload';
import { BUSINESS_CATEGORIES } from '../../data/initialData';
import { getCategoryImageByName, getAvailableCategoriesForShop, ensureCustomCategoriesSynced } from '../../utils/categoryUtils';
import { VendorCategoryManager } from './VendorCategoryManager';
import { SubscriptionInvoiceModal } from '../modals/SubscriptionInvoiceModal';
import { DukaanQrStandeeModal } from '../modals/DukaanQrStandeeModal';
import { ShopShareModal } from '../modals/ShopShareModal';
import { WebsiteSectionsManager } from './WebsiteSectionsManager';
import { VendorCustomDomainManager } from './VendorCustomDomainManager';
import { WebsiteThemesManager } from './WebsiteThemesManager';
import { VendorBackupsManager } from './VendorBackupsManager';
import {
  CallAddonView,
  WhatsAppAddonView,
  EmailAddonView,
  PaymentQrAddonView,
  ShopStandeeView,
  WebsiteSwitchView,
  WebsiteVisibilityView,
  AccountSettingsView,
  MyPlanView,
  BillingInvoiceView,
  BillingRenewView,
  SupportHelpView,
  SupportCareView,
  StorageManagerView,
} from './VendorAddonsAndSettingsViews';
import { FloatingButtonsSettingsCard } from '../shared/FloatingButtonsSettingsCard';
import { VendorSidebar } from './VendorSidebar';

interface VendorDashboardProps {
  shop: Shop;
  onUpdateShop: (updated: Shop) => void;
  onLogout: () => void;
  onNavigateToShop: (shopId: string) => void;
  onNavigateHome?: () => void;
  inquiries: ShopInquiry[];
  onUpdateInquiryStatus: (inquiryId: string, status: 'READ' | 'UNREAD' | 'CONVERTED') => void;
  adminPaymentQrUrl?: string;
  adminUpiId?: string;
  adminAccountHolder?: string;
  adminPhone?: string;
  adminWhatsapp?: string;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  shop,
  onUpdateShop,
  onLogout,
  onNavigateToShop,
  onNavigateHome,
  inquiries,
  onUpdateInquiryStatus,
  adminPaymentQrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=upi://pay?pa=7087033009@paytm&pn=IndianLalaJi%20Official&cu=INR',
  adminUpiId = '7087033009@paytm',
  adminAccountHolder = 'IndianLalaJi Platform (R. K. Mehra)',
  adminPhone = '7087033009',
  adminWhatsapp = '7087033009',
}) => {
  // Sidebar and mobile drawer states
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Mobile accordion states
  const [openSection, setOpenSection] = useState<string>('BASIC_DETAILS');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [showAdminQrModal, setShowAdminQrModal] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Local editing state for shop
  const [currentShop, setCurrentShop] = useState<Shop>(() => {
    return shop ? ensureCustomCategoriesSynced(shop) : ({} as Shop);
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isGlobalSaving, setIsGlobalSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  React.useEffect(() => {
    if (shop && (shop.id !== currentShop?.id || shop.updatedAt !== currentShop?.updatedAt)) {
      const syncedShop = ensureCustomCategoriesSynced(shop);
      setCurrentShop((prev) => {
        const incomingCats = syncedShop.customCategories || [];
        const prevCats = prev.customCategories || [];
        const mergedCats = [...incomingCats];
        prevCats.forEach((pc) => {
          if (!mergedCats.some((c) => c.name.toLowerCase() === pc.name.toLowerCase())) {
            mergedCats.push(pc);
          }
        });
        return {
          ...syncedShop,
          customCategories: mergedCats,
        };
      });
    }
  }, [shop]);

  // Split products, services, and courses from shop
  const catalogProducts = (currentShop.products || []).filter((p) => p.type !== 'SERVICE' && p.type !== 'COURSE');
  const catalogServices = (currentShop.products || []).filter((p) => p.type === 'SERVICE');
  const catalogCourses = (currentShop.products || []).filter((p) => p.type === 'COURSE');

  // Dedicated Product addition state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductPrice, setNewProductPrice] = useState<number | string>(199);
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState<number | string>(299);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('1 pc');
  const [newProductImage, setNewProductImage] = useState<string>('https://images.unsplash.com/photo-1542838132-92c53300491e?w=500');
  const [newProductHidePrice, setNewProductHidePrice] = useState(false);

  // Dedicated Service addition state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number | string>(499);
  const [newServiceOriginalPrice, setNewServiceOriginalPrice] = useState<number | string>(799);
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('Per Visit');
  const [newServiceImage, setNewServiceImage] = useState<string>('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500');
  const [newServiceHidePrice, setNewServiceHidePrice] = useState(false);

  // Dedicated Course addition state
  const [newCourseName, setNewCourseName] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState<number | string>(999);
  const [newCourseOriginalPrice, setNewCourseOriginalPrice] = useState<number | string>(1999);
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseDuration, setNewCourseDuration] = useState('30 Days');
  const [newCourseCategory, setNewCourseCategory] = useState('');
  const [newCourseImage, setNewCourseImage] = useState<string>('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500');
  const [newCourseHidePrice, setNewCourseHidePrice] = useState(false);

  // Consolidated categories for select dropdowns (vendor custom + existing items + popular defaults)
  const productCategories = useMemo(() => {
    return getAvailableCategoriesForShop(
      currentShop.customCategories || [],
      currentShop.products || [],
      'PRODUCT'
    );
  }, [currentShop.customCategories, currentShop.products]);

  const serviceCategories = useMemo(() => {
    return getAvailableCategoriesForShop(
      currentShop.customCategories || [],
      currentShop.products || [],
      'SERVICE'
    );
  }, [currentShop.customCategories, currentShop.products]);

  const courseCategories = useMemo(() => {
    return getAvailableCategoriesForShop(
      currentShop.customCategories || [],
      currentShop.products || [],
      'COURSE'
    );
  }, [currentShop.customCategories, currentShop.products]);

  // Product Editing state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductType, setEditProductType] = useState<ProductType>('PRODUCT');
  const [editProductPrice, setEditProductPrice] = useState<number>(0);
  const [editProductOriginalPrice, setEditProductOriginalPrice] = useState<number | string>('');

  // Categories available for the item being edited (Vendor-created + item's existing category)
  const editAvailableCategories = useMemo(() => {
    return getAvailableCategoriesForShop(
      currentShop.customCategories || [],
      currentShop.products || [],
      editProductType
    );
  }, [currentShop.customCategories, currentShop.products, editProductType]);

  // Quick Add Category Modal state
  const [isQuickCatModalOpen, setIsQuickCatModalOpen] = useState(false);
  const [quickCatType, setQuickCatType] = useState<ProductType>('PRODUCT');
  const [quickCatName, setQuickCatName] = useState('');
  const [quickCatImage, setQuickCatImage] = useState('');
  const [editProductDesc, setEditProductDesc] = useState('');
  const [editProductImage, setEditProductImage] = useState<string>('');
  const [editProductInStock, setEditProductInStock] = useState<boolean>(true);
  const [editProductCategory, setEditProductCategory] = useState<string>('');
  const [editProductUnit, setEditProductUnit] = useState<string>('');
  const [editProductHidePrice, setEditProductHidePrice] = useState(false);

  // Video addition state
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // Inquiries filter
  const [inquiryFilter, setInquiryFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');

  const shopInquiries = (inquiries || []).filter((inq) => shop && inq.shopId === shop.shopId);
  const filteredInquiries = shopInquiries.filter((inq) => {
    if (inquiryFilter === 'ALL') return true;
    return inq.status === inquiryFilter;
  });

  // Main Dashboard View Tabs: General Settings vs 16 Website Sections vs Products vs Services vs Courses
  const [activeMainTab, setActiveMainTab] = useState<'SETTINGS' | 'SECTIONS' | 'PRODUCTS' | 'SERVICES' | 'COURSES'>('SETTINGS');

  // Dukaan QR Standee Modal
  const [showStandeeModal, setShowStandeeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [standeeModalTab, setStandeeModalTab] = useState<'STANDEE' | 'QR'>('STANDEE');

  const toggleSection = (sectionId: string) => {
    setOpenSection((prev) => (prev === sectionId ? '' : sectionId));
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const getNavMeta = (nav: string) => {
    switch (nav) {
      case 'dashboard':
        return { title: 'Store Overview Dashboard', category: 'DASHBOARD', desc: 'Main control center, store performance & quick actions' };
      case 'profile':
      case 'profile_business':
        return { title: 'Business Profile & Shop Details', category: 'MY PROFILE', desc: 'Business name, owner, contact, address, logo & timings' };
      case 'profile_validity':
        return { title: '1-Year Store Validity & Annual Subscription', category: 'MY PROFILE', desc: 'Subscription validity, renewal status, benefits & tax invoices' };
      case 'profile_visibility':
        return { title: 'Website Visibility & Storefront Controls', category: 'MY PROFILE', desc: 'Store live/pause status, catalogue vs e-commerce mode & price display' };
      case 'profile_inquiries':
        return { title: 'Form Submission Entries & Customer Leads', category: 'MY PROFILE', desc: 'Manage contact form submissions, customer inquiries & lead followups' };
      case 'section_hero_banner':
        return { title: 'Hero Banner Slider (Desktop & Mobile)', category: 'ALL SECTIONS', desc: 'Upload up to 4 desktop and 3 mobile responsive banners' };
      case 'section_why_choose_us':
        return { title: 'Why Choose Us / Features', category: 'ALL SECTIONS', desc: 'Highlight trust points, fast delivery, quality badges' };
      case 'section_social_media':
        return { title: 'Social Media Links & Handles', category: 'ALL SECTIONS', desc: 'Instagram, YouTube, Facebook, LinkedIn store profiles' };
      case 'settings_account':
        return { title: 'Account Settings & Credentials', category: 'SETTINGS', desc: 'Manage login credentials, password, and registered store mobile' };
      case 'products':
      case 'section_products':
        return { title: 'Products Catalogue & Inventory', category: 'CATALOGUE', desc: 'Physical store items, pricing, inventory & stock status' };
      case 'categories':
      case 'section_categories':
        return { title: 'Category Master (Name + Photo Carousel)', category: 'CATALOGUE', desc: 'Create & manage categories with images for Products, Services & Courses' };
      case 'services':
      case 'section_services':
        return { title: 'Services & Offerings', category: 'CATALOGUE', desc: 'Professional services, consultation fees & bookings' };
      case 'courses':
      case 'section_courses':
        return { title: 'Courses & Training Catalogue', category: 'CATALOGUE', desc: 'Structured courses, coaching batches, syllabus & certification offerings' };
      case 'gallery':
        return { title: 'Banners, Media & Photo Gallery', category: 'WEBSITE', desc: 'Store hero banner, photo gallery & promotional posters' };
      case 'sections':
        return { title: '17 Modular Website Sections Suite', category: 'WEBSITE', desc: 'Turn sections ON/OFF, reorder layout & customize titles' };
      case 'section_hero':
        return { title: 'Hero Banner Section', category: 'WEBSITE SECTIONS', desc: 'Hero heading, subtext, CTA buttons, and background banner' };
      case 'section_about':
        return { title: 'About Store Section', category: 'WEBSITE SECTIONS', desc: 'Store story, owner photo, established year, and about details' };
      case 'section_features':
        return { title: 'Store Key Features', category: 'WEBSITE SECTIONS', desc: 'Highlight trust points, fast delivery, quality badges' };
      case 'section_benefits':
        return { title: 'Why Choose Us / Benefits', category: 'WEBSITE SECTIONS', desc: 'Customer advantages, local trust, and direct guarantees' };
      case 'section_testimonials':
      case 'testimonials':
        return { title: 'Customer Reviews & Testimonials', category: 'WEBSITE SECTIONS', desc: 'Manage customer feedback, ratings and social proof' };
      case 'section_offers':
        return { title: 'Our Offers & Deals Section', category: 'WEBSITE SECTIONS', desc: 'Festival discounts, promo coupons, and seasonal sales' };
      case 'section_videos':
        return { title: 'Store Videos & YouTube Reels', category: 'WEBSITE SECTIONS', desc: 'Product walkthroughs, customer guides, and video showcases' };
      case 'section_portfolio':
        return { title: 'Portfolio & Work Gallery', category: 'WEBSITE SECTIONS', desc: 'Showcase past work, completed projects, and customer photos' };
      case 'section_team':
        return { title: 'Team Members & Staff', category: 'WEBSITE SECTIONS', desc: 'Store experts, customer support executives, and managers' };
      case 'section_faq':
        return { title: 'FAQ Section (सवाल-जवाब)', category: 'WEBSITE SECTIONS', desc: 'Frequently asked questions and instant answers' };
      case 'section_cta':
        return { title: 'Call To Action (CTA)', category: 'WEBSITE SECTIONS', desc: 'High-converting banner to drive WhatsApp chats and calls' };
      case 'section_contact':
        return { title: 'Contact Details & Timings', category: 'WEBSITE SECTIONS', desc: 'Store address, phone, Google Maps, and working hours' };
      case 'section_blog':
        return { title: 'Blog & Articles Section', category: 'WEBSITE SECTIONS', desc: 'Tips, business updates, and helpful articles' };
      case 'section_footer':
        return { title: 'Footer Section & Copyright', category: 'WEBSITE SECTIONS', desc: 'Footer links, quick navigation, social links, and copyright' };
      case 'standee':
      case 'addon_shop_standee':
        return { title: 'Dukaan QR Standee & Posters', category: 'MARKETING', desc: 'Printable A4 counter standee with QR code for customer scanning' };
      case 'addon_call':
        return { title: 'Call Addon Settings', category: 'ADDONS', desc: 'Direct phone calling button, operational timings, and click-to-call' };
      case 'addon_whatsapp':
        return { title: 'WhatsApp Direct Chat Addon', category: 'ADDONS', desc: 'Instant WhatsApp ordering, greeting text, and floating button' };
      case 'addon_email':
        return { title: 'Email Inquiry Addon', category: 'ADDONS', desc: 'Store email address and forward inquiry notifications' };
      case 'addon_payment_qr':
        return { title: 'UPI Payment QR Addon', category: 'ADDONS', desc: 'PhonePe, GPay, Paytm direct UPI payment QR code setup' };
      case 'addon_custom_domain':
        return { title: 'Custom Domain Addon', category: 'ADDONS', desc: 'Link your own www.yourdomain.com with automatic SSL certificate' };
      case 'themes':
      case 'templates':
      case 'addon_templates':
        return { title: '10 Free Website Themes & Templates', category: 'WEBSITE BUILDER', desc: 'Bharat-inspired high-converting themes: Bharat Royal, Kashi Heritage, Deccan Neo, Ayodhya Divine, etc.' };
      case 'addon_website_switch':
        return { title: 'Website Switch (E-Commerce vs Catalogue)', category: 'ADDONS', desc: 'Switch storefront between E-Commerce (with price) and Catalogue (without price)' };
      case 'my-plan':
      case 'billing_plan':
        return { title: 'My 1-Year Platinum Plan', category: 'PLAN & BILLING', desc: 'Active subscription status, validity, renewal date & features included' };
      case 'invoices':
      case 'billing_invoice':
        return { title: 'Official GST Invoices & Receipts', category: 'PLAN & BILLING', desc: 'Official GST-ready printable tax invoices for store subscription' };
      case 'billing_renew':
        return { title: 'Renew Store Subscription', category: 'PLAN & BILLING', desc: 'Renew your 1-Year plan at special merchant discount' };
      case 'payments':
        return { title: 'Admin Payment QR & Bank Transfer', category: 'BILLING', desc: 'Official IndianLalaJi UPI QR code and payment verification' };
      case 'orders':
        return { title: 'WhatsApp Orders & Customer Inquiries', category: 'ORDERS', desc: 'Direct customer inquiries and product order messages' };
      case 'analytics':
        return { title: 'Store Performance & Analytics', category: 'INSIGHTS', desc: 'Live visitor statistics, product inquiries & conversion insights' };
      case 'support_help':
      case 'help':
        return { title: 'Vendor Help Center & Guides', category: 'SUPPORT', desc: 'Step-by-step video guides, tutorial walkthroughs, and FAQs' };
      case 'support_care':
      case 'support':
        return { title: 'Customer Care & 24/7 Helpline', category: 'SUPPORT', desc: 'Direct phone, WhatsApp support, and merchant assistance' };
      case 'settings':
      case 'settings_theme':
        return { title: 'Theme, Colors & Appearance', category: 'SETTINGS', desc: 'Store branding colors, button styling & floating action buttons' };
      case 'settings_domain':
        return { title: 'Custom Domain Setup', category: 'SETTINGS', desc: 'Connect your own www.yourdomain.com with free SSL' };
      case 'settings_backups':
      case 'settings_backup':
        return { title: 'Store Backup & Restore', category: 'SETTINGS', desc: 'Export & download complete store backup and upload to restore' };
      case 'settings_storage':
        return { title: 'Vendor Storage (200 MB Limit)', category: 'SETTINGS', desc: 'Monitor your 200 MB storage usage, media assets, and optimization' };
      default:
        return { title: 'Store Console', category: 'PLATFORM', desc: 'Manage your digital store' };
    }
  };

  const handleSelectNav = (navKey: string) => {
    if (navKey === 'store') {
      onNavigateToShop(currentShop.shopId);
      return;
    }
    if (navKey === 'logout') {
      onLogout();
      return;
    }

    setActiveNav(navKey);
    setIsMobileSidebarOpen(false);

    // Keep activeMainTab and openSection in sync for fallback handlers
    if (navKey === 'sections' || navKey.startsWith('section_') || navKey === 'testimonials') {
      setActiveMainTab('SECTIONS');
    } else if (navKey === 'products' || navKey === 'categories') {
      setActiveMainTab('PRODUCTS');
    } else if (navKey === 'services') {
      setActiveMainTab('SERVICES');
    } else if (navKey === 'courses') {
      setActiveMainTab('COURSES');
    } else if (navKey === 'dashboard') {
      setActiveMainTab('OVERVIEW');
    } else {
      setActiveMainTab('SETTINGS');
      if (navKey === 'profile') setOpenSection('BASIC_DETAILS');
      if (navKey === 'gallery') setOpenSection('MEDIA_BANNERS');
      if (navKey === 'orders') setOpenSection('INQUIRIES');
      if (navKey === 'settings' || navKey === 'settings_theme') setOpenSection('THEME_CUSTOM');
      if (navKey === 'settings_domain') setOpenSection('CUSTOM_DOMAIN');
      if (navKey === 'settings_backups' || navKey === 'settings_backup') setOpenSection('DATA_BACKUPS');
      if (navKey === 'invoices' || navKey === 'billing_invoice') setOpenSection('INVOICES');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveAll = (explicitShop?: Shop) => {
    setIsGlobalSaving(true);
    const dataToSave = explicitShop || currentShop;
    const updated = {
      ...dataToSave,
      updatedAt: new Date().toISOString(),
    };
    setCurrentShop(updated);
    onUpdateShop(updated);
    setHasUnsavedChanges(false);
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setTimeout(() => {
      setIsGlobalSaving(false);
      showToast('Aapki dukaan ke details safaltapoorvak save ho gaye hain! 💾');
    }, 300);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'aboutPhotoUrl' | 'paymentQrUrl' | 'banner' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      if (field === 'banner') {
        const updated = { ...currentShop, banners: [base64, ...currentShop.banners.slice(0, 2)] };
        setCurrentShop(updated);
        handleSaveAll(updated);
      } else if (field === 'gallery') {
        const currentList = currentShop.galleryImages || [];
        if (currentList.length >= 15) {
          showToast('Gallery mein maximum 15 photos allowed hain.');
          return;
        }
        const updated = { ...currentShop, galleryImages: [base64, ...currentList.slice(0, 14)] };
        setCurrentShop(updated);
        handleSaveAll(updated);
        showToast('Photo gallery mein naya photo add ho gaya!');
      } else {
        const updated = { ...currentShop, [field]: base64 };
        setCurrentShop(updated);
        handleSaveAll(updated);
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Kripya valid image file upload karein (PNG / JPG).');
    }
  };

  const handleDesktopBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      const currentList = [...(currentShop.desktopBanners || currentShop.banners || [])];
      while (currentList.length <= index) currentList.push('');
      currentList[index] = base64;
      const updated = {
        ...currentShop,
        desktopBanners: currentList,
        banners: currentList,
      };
      setCurrentShop(updated);
      handleSaveAll(updated);
      showToast(`Desktop Banner #${index + 1} safalta se upload ho gaya!`);
    } catch (err) {
      console.error(err);
      alert('Image upload error');
    }
  };

  const handleRemoveDesktopBanner = (index: number) => {
    const currentList = [...(currentShop.desktopBanners || currentShop.banners || [])];
    if (index < currentList.length) {
      currentList[index] = '';
      while (currentList.length > 0 && !currentList[currentList.length - 1]) {
        currentList.pop();
      }
      const updated = {
        ...currentShop,
        desktopBanners: currentList,
        banners: currentList,
      };
      setCurrentShop(updated);
      handleSaveAll(updated);
      showToast(`Desktop Banner #${index + 1} remove ho gaya.`);
    }
  };

  const handleMobileBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      const currentList = [...(currentShop.mobileBanners || [])];
      while (currentList.length <= index) currentList.push('');
      currentList[index] = base64;
      const updated = {
        ...currentShop,
        mobileBanners: currentList,
      };
      setCurrentShop(updated);
      handleSaveAll(updated);
      showToast(`Mobile Banner #${index + 1} safalta se upload ho gaya!`);
    } catch (err) {
      console.error(err);
      alert('Image upload error');
    }
  };

  const handleRemoveMobileBanner = (index: number) => {
    const currentList = [...(currentShop.mobileBanners || [])];
    if (index < currentList.length) {
      currentList[index] = '';
      while (currentList.length > 0 && !currentList[currentList.length - 1]) {
        currentList.pop();
      }
      const updated = {
        ...currentShop,
        mobileBanners: currentList,
      };
      setCurrentShop(updated);
      handleSaveAll(updated);
      showToast(`Mobile Banner #${index + 1} remove ho gaya.`);
    }
  };

  const handleUpdateFloatingButtonsInDashboard = (updatedButtons: FloatingButtonsConfig, updatedMapsUrl?: string) => {
    const updated = {
      ...currentShop,
      floatingButtons: updatedButtons,
      googleMapsUrl: updatedMapsUrl !== undefined ? updatedMapsUrl : currentShop.googleMapsUrl,
      updatedAt: new Date().toISOString(),
    };
    setCurrentShop(updated);
    handleSaveAll(updated);
    showToast('Floating Action Buttons (WhatsApp, Call, Language, Map) update ho gaye!');
  };

  const handleQuickCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCatName.trim()) return;
    const catName = quickCatName.trim();
    const newCat: ShopCategory = {
      id: `cat_${Date.now()}`,
      name: catName,
      imageUrl: quickCatImage.trim() || getCategoryImageByName(catName, quickCatType),
      type: quickCatType,
    };
    const currentList = currentShop.customCategories || [];
    const updated = {
      ...currentShop,
      customCategories: [...currentList, newCat],
    };
    setCurrentShop(updated);
    handleSaveAll(updated);
    if (quickCatType === 'PRODUCT') setNewProductCategory(catName);
    if (quickCatType === 'SERVICE') setNewServiceCategory(catName);
    if (quickCatType === 'COURSE') setNewCourseCategory(catName);
    if (editingProduct) setEditProductCategory(catName);
    setIsQuickCatModalOpen(false);
    setQuickCatName('');
    setQuickCatImage('');
    showToast(`Nayi category "${catName}" ban gayi aur select ho gayi! ✅`);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const catName = newProductCategory.trim();
    let updatedCustomCats = [...(currentShop.customCategories || [])];
    if (catName && !updatedCustomCats.some((c) => c.name.toLowerCase() === catName.toLowerCase())) {
      updatedCustomCats.push({
        id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: catName,
        type: 'PRODUCT',
        imageUrl: newProductImage || getCategoryImageByName(catName, 'PRODUCT'),
      });
    }

    const newProd: ProductItem = {
      id: `prod_${Date.now()}`,
      name: newProductName.trim(),
      type: 'PRODUCT',
      price: Number(newProductPrice) || 0,
      originalPrice: newProductOriginalPrice ? Number(newProductOriginalPrice) : undefined,
      description: newProductDesc.trim() || 'Genuine quality product with direct merchant guarantee.',
      imageUrl: newProductImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
      inStock: true,
      category: catName || undefined,
      unit: newProductUnit.trim() || '1 pc',
      hidePrice: newProductHidePrice,
    };

    const updated = {
      ...currentShop,
      products: [newProd, ...currentShop.products],
      customCategories: updatedCustomCats,
    };
    setCurrentShop(updated);
    handleSaveAll(updated);

    // Reset inputs
    setNewProductName('');
    setNewProductCategory('');
    setNewProductPrice(199);
    setNewProductOriginalPrice(299);
    setNewProductDesc('');
    setNewProductHidePrice(false);
    showToast('Naya Product catalogue mein add ho gaya! 📦');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const catName = newServiceCategory.trim();
    let updatedCustomCats = [...(currentShop.customCategories || [])];
    if (catName && !updatedCustomCats.some((c) => c.name.toLowerCase() === catName.toLowerCase())) {
      updatedCustomCats.push({
        id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: catName,
        type: 'SERVICE',
        imageUrl: newServiceImage || getCategoryImageByName(catName, 'SERVICE'),
      });
    }

    const newSrv: ProductItem = {
      id: `srv_${Date.now()}`,
      name: newServiceName.trim(),
      type: 'SERVICE',
      price: Number(newServicePrice) || 0,
      originalPrice: newServiceOriginalPrice ? Number(newServiceOriginalPrice) : undefined,
      description: newServiceDesc.trim() || 'Professional store service with direct WhatsApp booking.',
      imageUrl: newServiceImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
      inStock: true,
      category: catName || undefined,
      unit: newServiceDuration.trim() || 'Per Visit',
      hidePrice: newServiceHidePrice,
    };

    const updated = {
      ...currentShop,
      products: [newSrv, ...currentShop.products],
      customCategories: updatedCustomCats,
    };
    setCurrentShop(updated);
    handleSaveAll(updated);

    // Reset inputs
    setNewServiceName('');
    setNewServiceCategory('');
    setNewServicePrice(499);
    setNewServiceOriginalPrice(799);
    setNewServiceDesc('');
    setNewServiceHidePrice(false);
    showToast('Nayi Service catalogue mein add ho gayi! 🛠️');
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    const catName = newCourseCategory.trim();
    let updatedCustomCats = [...(currentShop.customCategories || [])];
    if (catName && !updatedCustomCats.some((c) => c.name.toLowerCase() === catName.toLowerCase())) {
      updatedCustomCats.push({
        id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: catName,
        type: 'COURSE',
        imageUrl: newCourseImage || getCategoryImageByName(catName, 'COURSE'),
      });
    }

    const newCrs: ProductItem = {
      id: `crs_${Date.now()}`,
      name: newCourseName.trim(),
      type: 'COURSE',
      price: Number(newCoursePrice) || 0,
      originalPrice: newCourseOriginalPrice ? Number(newCourseOriginalPrice) : undefined,
      description: newCourseDesc.trim() || 'Structured curriculum with batch enrollment, doubt sessions & certificate.',
      imageUrl: newCourseImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
      inStock: true,
      unit: newCourseDuration.trim() || '30 Days',
      category: catName || undefined,
      hidePrice: newCourseHidePrice,
    };

    const updated = {
      ...currentShop,
      products: [newCrs, ...currentShop.products],
      customCategories: updatedCustomCats,
    };
    setCurrentShop(updated);
    handleSaveAll(updated);

    // Reset inputs
    setNewCourseName('');
    setNewCourseCategory('');
    setNewCoursePrice(999);
    setNewCourseOriginalPrice(1999);
    setNewCourseDesc('');
    setNewCourseHidePrice(false);
    showToast('Naya Course catalogue mein add ho gaya! 🎓');
  };

  const handleDeleteProduct = (prodId: string) => {
    const updated = {
      ...currentShop,
      products: currentShop.products.filter((p) => p.id !== prodId),
    };
    setCurrentShop(updated);
    handleSaveAll(updated);
    showToast('Item remove ho gaya.');
  };

  const handleToggleProductStock = (prodId: string) => {
    const updated = {
      ...currentShop,
      products: currentShop.products.map((p) =>
        p.id === prodId ? { ...p, inStock: !p.inStock } : p
      ),
    };
    setCurrentShop(updated);
    handleSaveAll(updated);
  };

  const handleToggleProductHidePrice = (prodId: string) => {
    const updated = {
      ...currentShop,
      products: currentShop.products.map((p) =>
        p.id === prodId ? { ...p, hidePrice: !p.hidePrice } : p
      ),
    };
    setCurrentShop(updated);
    handleSaveAll(updated);
    const target = updated.products.find((p) => p.id === prodId);
    showToast(target?.hidePrice ? 'Price hide ho gayi! (Price on Request) 👁️❌' : 'Price ab dikhai degi! 👁️✅');
  };

  const handleToggleHideAllPrices = (val: boolean) => {
    const updated: Shop = {
      ...currentShop,
      hideAllPrices: val,
      isCatalogOnly: val,
      websiteMode: val ? 'CATALOG' : 'ECOMMERCE',
      updatedAt: new Date().toISOString(),
    } as any;
    setCurrentShop(updated);
    handleSaveAll(updated);
    showToast(
      val
        ? 'Catalogue Mode Active: Sabhi items ke prices hide ho gaye! (Price on Request active) 👁️❌'
        : 'E-Commerce Mode Active: Sabhi items ke prices ab website par dikhai denge! 👁️✅'
    );
  };

  const handleBulkToggleProductPrices = (type: 'ALL' | 'PRODUCT' | 'SERVICE' | 'COURSE', hide: boolean) => {
    let updatedProducts = [...currentShop.products];
    if (type === 'ALL') {
      updatedProducts = updatedProducts.map((p) => ({ ...p, hidePrice: hide }));
    } else {
      updatedProducts = updatedProducts.map((p) => {
        if (p.type === type) {
          return { ...p, hidePrice: hide };
        }
        return p;
      });
    }

    const updated: Shop = {
      ...currentShop,
      products: updatedProducts,
      ...(type === 'ALL' ? { hideAllPrices: hide } : {}),
      updatedAt: new Date().toISOString(),
    };

    setCurrentShop(updated);
    handleSaveAll(updated);

    const typeLabel =
      type === 'ALL'
        ? 'Sabhi Products, Services aur Courses'
        : type === 'PRODUCT'
        ? 'Sabhi Physical Products'
        : type === 'COURSE'
        ? 'Sabhi Courses & Training'
        : 'Sabhi Services';

    showToast(
      hide
        ? `${typeLabel} ke prices website se hide ho gaye! (Price on Request active) 👁️❌`
        : `${typeLabel} ke prices ab website par dikhai denge! 👁️✅`
    );
  };

  const handleStartEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setEditProductName(prod.name);
    setEditProductType(prod.type || 'PRODUCT');
    setEditProductPrice(prod.price);
    setEditProductOriginalPrice(prod.originalPrice !== undefined ? prod.originalPrice : '');
    setEditProductDesc(prod.description || '');
    setEditProductImage(prod.imageUrl || '');
    setEditProductInStock(prod.inStock !== false);
    setEditProductCategory(prod.category || '');
    setEditProductUnit(prod.unit || '');
    setEditProductHidePrice(Boolean(prod.hidePrice));
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProductName.trim()) return;

    const catName = editProductCategory.trim();
    let updatedCustomCats = [...(currentShop.customCategories || [])];
    if (catName && !updatedCustomCats.some((c) => c.name.toLowerCase() === catName.toLowerCase())) {
      updatedCustomCats.push({
        id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: catName,
        type: editProductType,
        imageUrl: editProductImage || editingProduct.imageUrl || getCategoryImageByName(catName, editProductType),
      });
    }

    const updatedProduct: ProductItem = {
      ...editingProduct,
      name: editProductName.trim(),
      type: editProductType,
      price: Number(editProductPrice) || 0,
      originalPrice: editProductOriginalPrice !== '' ? Number(editProductOriginalPrice) : undefined,
      description: editProductDesc.trim(),
      imageUrl: editProductImage || editingProduct.imageUrl,
      inStock: editProductInStock,
      category: catName || undefined,
      unit: editProductUnit.trim() || undefined,
      hidePrice: editProductHidePrice,
    };

    const updated = {
      ...currentShop,
      products: currentShop.products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)),
      customCategories: updatedCustomCats,
    };

    setCurrentShop(updated);
    handleSaveAll(updated);
    setEditingProduct(null);
    showToast(`${editProductType === 'COURSE' ? 'Course' : editProductType === 'PRODUCT' ? 'Product' : 'Service'} ke changes update ho gaye! ✅`);
  };

  const handleCancelEditProduct = () => {
    setEditingProduct(null);
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim() || currentShop.videos.length >= 8) return;

    const parsedUrl = getYouTubeEmbedUrl(newVideoUrl.trim()) || newVideoUrl.trim();

    const newVid: VideoItem = {
      id: `v_${Date.now()}`,
      title: newVideoTitle.trim() || 'Store Showcase Video',
      youtubeUrl: parsedUrl,
    };

    const updated = {
      ...currentShop,
      videos: [...currentShop.videos, newVid],
    };
    setCurrentShop(updated);
    handleSaveAll(updated);

    setNewVideoTitle('');
    setNewVideoUrl('');
    showToast('YouTube Video link add ho gaya!');
  };

  const handleDeleteVideo = (vidId: string) => {
    const updated = {
      ...currentShop,
      videos: currentShop.videos.filter((v) => v.id !== vidId),
    };
    setCurrentShop(updated);
    handleSaveAll(updated);
  };

  const handleSubmitForReview = () => {
    const updated: Shop = {
      ...currentShop,
      status: 'PENDING_APPROVAL',
      updatedAt: new Date().toISOString(),
    };
    setCurrentShop(updated);
    onUpdateShop(updated);
    showToast('Aapki request Super Admin ko bhej di gayi hai! Verification jald poora hoga.');
  };

  // Status Badge Helper
  const getStatusBadge = () => {
    switch (currentShop.status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>🟢 PUBLISHED (LIVE PUBLIC)</span>
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>🟡 UNDER ADMIN REVIEW</span>
          </span>
        );
      case 'HOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>🔵 ON HOLD</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-900 border border-red-300">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>🔴 CORRECTION REQUIRED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-stone-100 text-stone-700 border border-stone-300">
            <span>📝 DRAFT (EDITING)</span>
          </span>
        );
    }
  };

  if (!shop || !currentShop?.id) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-200 text-center space-y-4 shadow-sm">
        <Store className="w-12 h-12 text-orange-600 mx-auto animate-bounce" />
        <h2 className="text-lg font-bold text-slate-900">Dukaan Data Load Ho Raha Hai...</h2>
        <p className="text-xs text-gray-500">Please wait while shop details are being loaded or register a new store.</p>
        <button
          onClick={onLogout}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-sm text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-slate-900 font-sans">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-5 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-orange-500 animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 1. LEFT FIXED/STICKY SIDEBAR (Desktop: 270px, Mobile: Slide-in Drawer) */}
      <VendorSidebar
        shop={currentShop}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={onLogout}
        onVisitStore={() => onNavigateToShop(currentShop.shopId)}
        unreadInquiriesCount={filteredInquiries.filter((i) => i.status === 'UNREAD').length}
      />

      {/* 2. RIGHT MAIN CONTENT AREA: Remaining screen width */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Header Bar with Mobile Hamburger, Breadcrumbs, & Quick Actions */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Hamburger (Mobile) + Breadcrumb + Verified Status */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                id="vendor-mobile-hamburger-btn"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 -ml-1 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                aria-label="Open sidebar menu"
              >
                <Menu className="w-5 h-5 text-slate-800" />
              </button>

              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <span className="font-black text-xs sm:text-sm tracking-tight text-slate-900 font-['Outfit',sans-serif] uppercase truncate flex items-center gap-1.5">
                  <span className="hidden sm:inline text-orange-600">INDIANLALAJI</span>
                  <span className="hidden sm:inline text-gray-300">/</span>
                  <span className="text-slate-600 font-semibold hidden md:inline">Console</span>
                  <span className="hidden md:inline text-gray-300">/</span>
                  <span className="text-slate-950 truncate font-extrabold">{currentShop.businessName}</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold shrink-0">
                  ID: {currentShop.shopId}
                </span>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>My Store</span>
                </span>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {onNavigateHome && (
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Go to IndianLalaJi Platform Home"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Platform Home</span>
                </button>
              )}

              <button
                type="button"
                id="vendor-header-visit-btn"
                onClick={() => onNavigateToShop(currentShop.shopId)}
                className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Open Live Shop Website"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Visit Store</span>
              </button>

              <button
                type="button"
                id="vendor-header-standee-btn"
                onClick={() => {
                  setStandeeModalTab('STANDEE');
                  setShowStandeeModal(true);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                title="Print Dukaan QR Standee"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standee</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                title="Help Center & Guide"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl w-full mx-auto">

      {/* MOBILE HORIZONTAL NAVIGATION STRIP (Easy one-tap navigation for single page app) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar lg:hidden">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'products', label: 'Products', icon: Package, badge: catalogProducts.length },
          { id: 'services', label: 'Services', icon: Wrench, badge: catalogServices.length },
          { id: 'courses', label: 'Courses', icon: GraduationCap, badge: catalogCourses.length },
          { id: 'gallery', label: 'Gallery', icon: ImageIcon },
          { id: 'sections', label: 'All Sections', icon: Layout },
          { id: 'categories', label: '+ Create Category', icon: FolderTree, badge: currentShop.customCategories?.length || 0 },
          { id: 'themes', label: 'Themes (10)', icon: Palette, badge: '10' },
          { id: 'standee', label: 'QR Standee', icon: QrCode },
          { id: 'orders', label: 'Orders', icon: MessageSquare, badge: filteredInquiries.filter(i => i.status === 'UNREAD').length || undefined },
          { id: 'my-plan', label: 'My Plan', icon: CreditCard },
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'payments', label: 'Payment QR', icon: Receipt },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((pill) => {
          const isPillActive = activeNav === pill.id;
          const PillIcon = pill.icon;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => handleSelectNav(pill.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${
                isPillActive
                  ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white shadow-md shadow-orange-600/30'
                  : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200 shadow-2xs'
              }`}
            >
              <PillIcon className={`w-3.5 h-3.5 ${isPillActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{pill.label}</span>
              {pill.badge !== undefined && (
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  isPillActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-800'
                }`}>
                  {pill.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ACTIVE VIEW BREADCRUMB HEADER (Shown on sub-views, makes single page navigation super clear) */}
      {activeNav !== 'dashboard' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => handleSelectNav('dashboard')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Return to Main Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 font-['Outfit',sans-serif]">
                {getNavMeta(activeNav).category}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit',sans-serif] truncate">
                {getNavMeta(activeNav).title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <button
              type="button"
              onClick={() => onNavigateToShop(currentShop.shopId)}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Open Live Website Preview"
            >
              <Eye className="w-3.5 h-3.5 text-orange-600" />
              <span>Preview Store</span>
            </button>
            <button
              type="button"
              onClick={() => handleSaveAll()}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      )}

      {/* DASHBOARD HOME VIEW (Overview, Stats, 9 Touch-friendly Quick Actions, Standee & Subscription) */}
      {activeNav === 'dashboard' && (
        <div className="space-y-6">
      {/* TOP HEADER: Vendor Name, Shop ID, Visit Website, Logout */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <img
              src={currentShop.logoUrl}
              alt={currentShop.businessName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-gray-200 shadow-sm bg-gray-100"
            />
            <label className="absolute -bottom-1 -right-1 bg-orange-600 text-white p-1 rounded-full cursor-pointer shadow-xs hover:bg-orange-700">
              <Upload className="w-3 h-3" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'logoUrl')}
              />
            </label>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight font-['Outfit',sans-serif]">
                {currentShop.businessName}
              </h1>
              {getStatusBadge()}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-1">
              <span className="font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-sm border border-orange-200">
                Shop ID: {currentShop.shopId}
              </span>
              <span>Owner: <strong>{currentShop.vendorName}</strong></span>
              <span className="hidden sm:inline">•</span>
              <span className="text-gray-500">Registered: +91 {currentShop.phone}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Visit Store, Copy Link, Save Changes, Logout */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
          <button
            id="vendor-visit-live-store-btn"
            onClick={() => onNavigateToShop(currentShop.shopId)}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Visit Website</span>
          </button>

          

          <button
            id="vendor-copy-store-url-btn"
            onClick={() => setShowShareModal(true)}
            className="px-3.5 py-2.5 rounded-sm bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            title="Share Store Website & View SEO Preview Card"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">Share Store</span>
          </button>

          <a
            href="https://wa.me/917087033009?text=Namaste%20IndianLalaJi%20Vendor%20Support"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider text-xs hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            title="Helpline WhatsApp"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Help</span>
          </a>

      </div>
      </div>

      {/* 1-YEAR SUBSCRIPTION & STORE VALIDITY CARD (ACTIVE DATE & EXPIRY DATE) */}
      {(() => {
        const activeDateVal = currentShop.activeDate || currentShop.createdAt?.split('T')[0] || '2026-08-01';
        const expiryDateVal = currentShop.expiryDate || getOneYearExpiryDate(activeDateVal);
        const daysRemaining = calculateDaysRemaining(expiryDateVal);
        const isExpiringSoon = daysRemaining <= 30;
        const isExpired = daysRemaining <= 0;

        return (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Left: Plan Info & Badge */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm shadow-xs">
                    <Award className="w-3 h-3" />
                    <span>{currentShop.planName || '1-Year Official LalaJi Store Plan'}</span>
                  </span>

                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm ${
                    isExpired 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                      : isExpiringSoon 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isExpired ? '🔴 Subscription Expired' : `🟢 Active (${daysRemaining} Days Left)`}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black font-['Outfit',sans-serif] tracking-tight uppercase text-white">
                  1-Year Store Validity & Annual Subscription
                </h3>
                <p className="text-xs text-gray-400 max-w-xl">
                  Aapka store 1 saal (365 Din) ke liye registered hai. Isme unlimited products, direct WhatsApp orders aur UPI QR payments shamil hain.
                </p>
              </div>

              {/* Right: Dates Pill Box */}
              <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-orange-400" />
                    <span>Active Date</span>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white font-mono">
                    {formatDisplayDate(activeDateVal)}
                  </div>
                </div>

                <div className="space-y-0.5 pl-3 border-l border-white/10">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span>Expiry Date</span>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white font-mono">
                    {formatDisplayDate(expiryDateVal)}
                  </div>
                </div>
              </div>

            </div>

            {/* Validity Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-orange-400" />
                  <span>Annual Validity: <strong>{daysRemaining} of 365 Days Remaining</strong></span>
                </span>
                <span className="font-mono text-orange-300 font-bold">
                  {Math.round((daysRemaining / 365) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700/80 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all rounded-full ${
                    isExpired ? 'bg-red-500' : isExpiringSoon ? 'bg-amber-500' : 'bg-gradient-to-r from-orange-500 to-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, (daysRemaining / 365) * 100))}%` }}
                />
              </div>
            </div>

            {/* Quick QR Payment, Invoice & Domain Action */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="text-gray-400 text-[11px]">
                Official Admin UPI Helpline: <strong className="text-white">+91 {adminPhone}</strong>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                              <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-orange-300 hover:text-white border border-slate-700 font-bold uppercase tracking-wider text-[11px] rounded-sm flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-400" />
                  <span>1-Yr Tax Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAdminQrModal(true)}
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-[11px] rounded-sm flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Pay Admin QR (₹1,499)</span>
                </button>
              </div>
            </div>

          </div>
        );
      })()}

      {/* DUKAAN COUNTER QR STANDEE & WEBSITE QR CARD (LIGHT THEME) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-emerald-200 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl shrink-0 shadow-2xs">
              <QrCode className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Counter Standee
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-200">
                  Print Ready A4
                </span>
                <span className="bg-blue-50 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-200">
                  Official Website QR
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-['Outfit',sans-serif] tracking-tight uppercase text-slate-900">
                Dukaan Counter QR Standee & Website QR Code
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Apni dukaan ke cash counter par lagane ke liye <strong>Printable Standee Poster (A4)</strong> aur <strong>Official Website QR Code</strong> ready hai. Customer phone camera se scan karte hi direct aapki online dukaan aur catalogue par pahunch jayenge.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
            <button
              type="button"
              id="dashboard-print-standee-btn"
              onClick={() => {
                setStandeeModalTab('STANDEE');
                setShowStandeeModal(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Standee (A4)</span>
            </button>

            <button
              type="button"
              id="dashboard-view-qrs-btn"
              onClick={() => {
                setStandeeModalTab('QR');
                setShowStandeeModal(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-slate-800 border border-gray-300 font-bold text-xs uppercase tracking-wider shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>View Website QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* ADMIN REVIEW & PAYMENT BANNER IF DRAFT, PENDING, OR REJECTED */}
      {currentShop.status !== 'PUBLISHED' && (
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-400 rounded-2xl p-4 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 font-black uppercase tracking-tight text-slate-900 text-sm sm:text-base">
                <Clock className="w-5 h-5 text-orange-600 shrink-0" />
                <span>
                  {currentShop.status === 'PENDING_APPROVAL' 
                    ? 'STORE तभी LIVE होगा जब आपने अपना PACKAGE BUY करके ADMIN के UPI QR पर PAYMENT कर दिया हो!' 
                    : 'Payment के बाद Shop ID और Screenshot Admin को WhatsApp (+91 7087033009) पर भेजें!'}
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Admin approve karte hi aapki live URL <strong>/shop/{currentShop.shopId}</strong> sabhi ke liye khul jayegi aur aapke registered WhatsApp (+91 {currentShop.phone}) par confirmation message bhej diya jayega.
              </p>

              {/* Admin Contact Number Display */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-orange-200 text-xs text-slate-900 font-bold shadow-xs">
                  <Phone className="w-3.5 h-3.5 text-orange-600" />
                  <span>Admin Call:</span>
                  <a href={`tel:${adminPhone}`} className="text-orange-700 hover:underline font-mono">
                    +91 {adminPhone}
                  </a>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-xs text-slate-900 font-bold shadow-xs">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Admin WhatsApp:</span>
                  <a 
                    href={getWhatsAppDirectUrl(adminWhatsapp, `Namaste Admin! Meri Shop ID ${currentShop.shopId} (${currentShop.businessName}) ke payment verification ke liye contact kar raha hoon.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline font-mono"
                  >
                    +91 {adminWhatsapp}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
              <button
                onClick={() => setShowAdminQrModal(true)}
                className="flex-1 lg:flex-initial px-5 py-3 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <QrCode className="w-4 h-4" />
                <span>Pay Admin (Scan UPI QR)</span>
              </button>

              {currentShop.status !== 'PENDING_APPROVAL' && (
                <button
                  onClick={handleSubmitForReview}
                  className="flex-1 lg:flex-initial px-4 py-3 rounded-sm bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 font-bold uppercase tracking-wider text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  <span>Submit for Review</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* STORE ANALYTICS & PERFORMANCE OVERVIEW SECTION */}
      <div id="section-analytics" className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-['Outfit',sans-serif] uppercase">
                Store Performance & Analytics
              </h3>
              <p className="text-xs text-gray-500">Live website visitors, product inquiries & conversion stats</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Online
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Products</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-['Outfit',sans-serif]">
              {catalogProducts.length}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Active Catalogue</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Services</div>
            <div className="text-xl sm:text-2xl font-black text-purple-700 mt-1 font-['Outfit',sans-serif]">
              {catalogServices.length}
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Services Listed</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Courses</div>
            <div className="text-xl sm:text-2xl font-black text-indigo-700 mt-1 font-['Outfit',sans-serif]">
              {catalogCourses.length}
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">Courses & Training</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">WhatsApp Orders</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 font-['Outfit',sans-serif]">
              {filteredInquiries.length}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {filteredInquiries.filter((i) => i.status === 'UNREAD').length} New Pending
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Plan Validity</div>
            <div className="text-base sm:text-lg font-black text-slate-900 mt-1 truncate font-['Outfit',sans-serif]">
              {currentShop.status === 'PUBLISHED' ? 'Verified Online' : 'Active'}
            </div>
            <div className="text-[11px] text-orange-600 font-semibold mt-0.5">
              {calculateDaysRemaining(currentShop.expiryDate || getOneYearExpiryDate())} Days Remaining
            </div>
          </div>
        </div>
      </div>

      


      </div>
      )}

      {(activeNav === 'categories' || activeNav === 'section_categories') && (
        <VendorCategoryManager
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            handleSaveAll(updated);
          }}
          showToast={showToast}
        />
      )}

      {(activeNav === 'sections' || (activeNav.startsWith('section_') && activeNav !== 'section_categories') || activeNav === 'testimonials') && (
        <WebsiteSectionsManager
          shop={currentShop}
          initialExpandedSection={
            activeNav.startsWith('section_')
              ? activeNav.replace('section_', '')
              : (activeNav === 'testimonials' ? 'testimonials' : undefined)
          }
          onUpdateShop={(updated) => {
            const synced = ensureCustomCategoriesSynced(updated);
            setCurrentShop(synced);
            setHasUnsavedChanges(true);
            onUpdateShop(synced);
          }}
          onPreviewShop={() => onNavigateToShop(currentShop.shopId)}
          onOpenThemes={() => handleSelectNav('themes')}
          onOpenCategories={() => handleSelectNav('categories')}
          onOpenCreateCategory={() => {
            setQuickCatType('PRODUCT');
            setIsQuickCatModalOpen(true);
          }}
          showToast={showToast}
          onAnyChange={() => setHasUnsavedChanges(true)}
        />
      )}

      {activeNav === 'products' && (
        /* DEDICATED PRODUCTS CATALOGUE TAB VIEW */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 border border-slate-700 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
                  <Package className="w-4 h-4" />
                  <span>Products Catalogue & Inventory</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight font-['Outfit',sans-serif]">
                  Physical Store Products ({catalogProducts.length} Items)
                </h2>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                  Apne store ke physical samaan (groceries, clothing, electronics, items) add karein. Yeh products live website ke <strong>Products Showcase</strong> me "Add to Cart" aur "Order on WhatsApp" ke sath dikhte hain.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToShop(currentShop.shopId)}
                className="px-4 py-2.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-all shadow-sm shrink-0 self-start sm:self-center"
              >
                <Eye className="w-4 h-4" />
                <span>View Products on Live Shop</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-700/60">
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                <div className="text-[10px] text-gray-400 font-bold uppercase">Total Products</div>
                <div className="text-xl font-black text-white">{catalogProducts.length}</div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">In Stock</div>
                <div className="text-xl font-black text-emerald-400">
                  {catalogProducts.filter((p) => p.inStock).length}
                </div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                <div className="text-[10px] text-red-400 font-bold uppercase">Out of Stock</div>
                <div className="text-xl font-black text-red-400">
                  {catalogProducts.filter((p) => !p.inStock).length}
                </div>
              </div>
            </div>
          </div>

          {/* Add Product Form */}
          <form onSubmit={handleAddProduct} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add New Physical Product (Naya Samaan Add Karein)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product / Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Desi Cow Ghee (1 Litre Jar) ya Cotton Kurti"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Pack Size / Unit (e.g. 1 kg, 1 pc)
                </label>
                <input
                  type="text"
                  placeholder="1 pc, 1 kg, 500gm, Pack of 2"
                  value={newProductUnit}
                  onChange={(e) => setNewProductUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                />
              </div>
            </div>

            {/* Product Category Dropdown (Select only, no manual typing) */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Product Category (श्रेणी चुनें - सिर्फ Select Karein) *</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setQuickCatType('PRODUCT');
                    setIsQuickCatModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Nayi Category Banayein</span>
                </button>
              </div>

              <select
                value={newProductCategory}
                onChange={(e) => {
                  if (e.target.value === '__NEW__') {
                    setQuickCatType('PRODUCT');
                    setIsQuickCatModalOpen(true);
                  } else {
                    setNewProductCategory(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-emerald-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-900 cursor-pointer"
              >
                <option value="">-- Kripya Category Chunein (Select Category) --</option>
                {productCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name} {cat.isCustom ? '★ (Custom)' : ''}
                  </option>
                ))}
                <option value="__NEW__" className="font-bold text-emerald-700 bg-emerald-50">
                  + Nayi Category Banayein (Create New Category)...
                </option>
              </select>

              {productCategories.length === 0 ? (
                <div className="mt-2 text-[11px] text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Abhi koi product category nahi bani hai. <strong>"+ Nayi Category Banayein"</strong> par click karke Name + Photo daalkar category banayein.
                  </span>
                </div>
              ) : (
                <div className="mt-1.5 text-[10px] text-gray-500 flex items-center justify-between">
                  <span>Category dropdown me total {productCategories.length} vendor categories uplabdh hain.</span>
                  <button
                    type="button"
                    onClick={() => setActiveNav('categories')}
                    className="text-emerald-700 hover:underline font-bold"
                  >
                    Manage All Categories →
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Original MRP (₹) (Discount dikhane ke liye)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 299"
                  value={newProductOriginalPrice}
                  onChange={(e) => setNewProductOriginalPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Photo Upload
                </label>
                <label className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-emerald-50 border border-dashed border-gray-300 hover:border-emerald-500 rounded-sm text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const b = await fileToBase64(f);
                        setNewProductImage(b);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Product Description & Highlights
              </label>
              <input
                type="text"
                placeholder="Product quality, brand details, warranty ya expiry info"
                value={newProductDesc}
                onChange={(e) => setNewProductDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
              />
            </div>

            {/* Hide Price Toggle */}
            <div
              onClick={() => setNewProductHidePrice(!newProductHidePrice)}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                newProductHidePrice
                  ? 'bg-amber-100/90 border-amber-500 shadow-xs ring-2 ring-amber-400/30'
                  : 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${newProductHidePrice ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                    <span>Hide Price / कीमत छुपाएं</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      newProductHidePrice ? 'bg-amber-600 text-white' : 'bg-amber-200/90 text-amber-900'
                    }`}>
                      Price on Request
                    </span>
                    <span className={`text-[10px] font-bold ${newProductHidePrice ? 'text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded' : 'text-gray-500'}`}>
                      {newProductHidePrice ? '✓ ON (Hidden on website)' : 'OFF'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">Website par price chhupakar "Price on Request / कीमत पूछें" WhatsApp inquiry button dikhega</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={newProductHidePrice}
                  onChange={(e) => setNewProductHidePrice(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product to Store Catalogue</span>
              </button>
            </div>
          </form>

          {/* Active Products List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Active Store Products ({catalogProducts.length})
              </h3>
              <span className="text-xs text-gray-500">Live website par display hote hain</span>
            </div>

            {/* PRODUCT PRICES QUICK CONTROLS BAR (HIDE / SHOW ALL) */}
            {catalogProducts.length > 0 && (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-950 font-['Outfit',sans-serif]">
                        Product Prices Quick Controls (दाम छुपाएँ / दिखाएँ)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                        {catalogProducts.filter((p) => p.hidePrice || currentShop.hideAllPrices).length} of {catalogProducts.length} Prices Hidden
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900/80 mt-0.5">
                      Website par sabhi products ke price ko ek click me hide ya unhide karein.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleBulkToggleProductPrices('PRODUCT', true)}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    title="Website se sabhi physical products ke price hide karein"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide All Product Prices</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBulkToggleProductPrices('PRODUCT', false)}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    title="Website par sabhi physical products ke price dikhayein"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show All Product Prices</span>
                  </button>
                </div>
              </div>
            )}

            {catalogProducts.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
                <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="font-bold text-sm text-slate-700">Abhi koi product add nahi hai</p>
                <p className="text-xs text-gray-500 mt-1">Upar diye gaye form se apna pehla physical product add karein.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalogProducts.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all group"
                  >
                    <div>
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 mb-3 border border-gray-100 relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          item.inStock ? 'bg-emerald-600 text-white shadow-xs' : 'bg-red-600 text-white shadow-xs'
                        }`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {item.unit && (
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                            {item.unit}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>

                      <div className="flex items-baseline gap-2 mt-3 flex-wrap">
                        {item.hidePrice || currentShop.hideAllPrices ? (
                          <span className="text-xs font-bold text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                            <EyeOff className="w-3 h-3 text-amber-700" />
                            <span>Price Hidden ({formatINR(item.price)})</span>
                          </span>
                        ) : (
                          <>
                            <span className="text-base font-black text-slate-900">{formatINR(item.price)}</span>
                            {item.originalPrice && (
                              <span className="text-xs line-through text-gray-400 font-semibold">
                                {formatINR(item.originalPrice)}
                              </span>
                            )}
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStock(item.id)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${
                            item.inStock
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {item.inStock ? 'In Stock' : 'Out'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleProductHidePrice(item.id)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border flex items-center gap-1 ${
                            item.hidePrice
                              ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                          title={item.hidePrice ? 'Price hidden. Click to show on website.' : 'Click to hide price (Price on Request)'}
                        >
                          {item.hidePrice ? <EyeOff className="w-3 h-3 text-amber-700" /> : <Eye className="w-3 h-3 text-gray-500" />}
                          <span>{item.hidePrice ? 'Hidden' : 'Hide'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditProduct(item)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-sm border border-gray-200"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm border border-gray-200"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {(activeNav === 'services' || activeMainTab === 'SERVICES') && (
        /* DEDICATED SERVICES CATALOGUE TAB VIEW */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 border border-purple-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-purple-300 text-xs font-black uppercase tracking-wider mb-1">
                  <Wrench className="w-4 h-4" />
                  <span>Services Catalogue & Bookings</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight font-['Outfit',sans-serif]">
                  Store Services & Bookings ({catalogServices.length} Services)
                </h2>
                <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed">
                  Apne store ki sabhi professional services (cleaning, repair, salon, tailoring, consultation) manage karein. Yeh services aapki website ke <strong>Dedicated Services Section (#4)</strong> me direct WhatsApp appointment booking ke sath dikhayi jaati hain.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToShop(currentShop.shopId)}
                className="px-4 py-2.5 rounded-sm bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-all shadow-sm shrink-0 self-start sm:self-center"
              >
                <Eye className="w-4 h-4" />
                <span>View Services on Live Shop</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-purple-800/60">
              <div className="bg-purple-900/40 rounded-xl p-3 border border-purple-800/50">
                <div className="text-[10px] text-purple-300 font-bold uppercase">Total Services</div>
                <div className="text-xl font-black text-white">{catalogServices.length}</div>
              </div>
              <div className="bg-purple-900/40 rounded-xl p-3 border border-purple-800/50">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Available For Booking</div>
                <div className="text-xl font-black text-emerald-400">
                  {catalogServices.filter((s) => s.inStock).length}
                </div>
              </div>
              <div className="bg-purple-900/40 rounded-xl p-3 border border-purple-800/50">
                <div className="text-[10px] text-amber-300 font-bold uppercase">Temporarily Paused</div>
                <div className="text-xl font-black text-amber-300">
                  {catalogServices.filter((s) => !s.inStock).length}
                </div>
              </div>
            </div>
          </div>

          {/* Add Service Form */}
          <form onSubmit={handleAddService} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
              <Plus className="w-4 h-4 text-purple-600" />
              <span>Add New Store Service (Nayi Service Add Karein)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC Deep Cleaning & Service, Bridal Makeup, Laptop Repair"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Duration / Service Terms (e.g. 45 Mins, Per Visit)
                </label>
                <input
                  type="text"
                  placeholder="Per Visit, 1 Hour, Per Room, Per Session"
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-gray-50/50"
                />
              </div>
            </div>

            {/* Service Category Dropdown (Select only, no manual typing) */}
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-purple-600" />
                  <span>Service Category (श्रेणी चुनें - सिर्फ Select Karein) *</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setQuickCatType('SERVICE');
                    setIsQuickCatModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-white hover:bg-purple-100 px-2.5 py-0.5 rounded border border-purple-300 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Nayi Category Banayein</span>
                </button>
              </div>

              <select
                value={newServiceCategory}
                onChange={(e) => {
                  if (e.target.value === '__NEW__') {
                    setQuickCatType('SERVICE');
                    setIsQuickCatModalOpen(true);
                  } else {
                    setNewServiceCategory(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-purple-300 text-xs focus:ring-2 focus:ring-purple-500 bg-white font-medium text-slate-900 cursor-pointer"
              >
                <option value="">-- Kripya Category Chunein (Select Category) --</option>
                {serviceCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name} {cat.isCustom ? '★ (Custom)' : ''}
                  </option>
                ))}
                <option value="__NEW__" className="font-bold text-purple-700 bg-purple-50">
                  + Nayi Category Banayein (Create New Category)...
                </option>
              </select>

              {serviceCategories.length === 0 ? (
                <div className="mt-2 text-[11px] text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Abhi koi service category nahi bani hai. <strong>"+ Nayi Category Banayein"</strong> par click karke Name + Photo daalkar category banayein.
                  </span>
                </div>
              ) : (
                <div className="mt-1.5 text-[10px] text-gray-500 flex items-center justify-between">
                  <span>Category dropdown me total {serviceCategories.length} service categories uplabdh hain.</span>
                  <button
                    type="button"
                    onClick={() => setActiveNav('categories')}
                    className="text-purple-700 hover:underline font-bold"
                  >
                    Manage All Categories →
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Starting Fee / Charge (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-gray-50/50 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Regular Fee (₹) (Strike-through / Discount)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 799"
                  value={newServiceOriginalPrice}
                  onChange={(e) => setNewServiceOriginalPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Service Banner Photo Upload
                </label>
                <label className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-purple-50 border border-dashed border-gray-300 hover:border-purple-500 rounded-sm text-[11px] font-bold uppercase tracking-wider text-purple-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-purple-600" />
                  <span>Choose Service Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const b = await fileToBase64(f);
                        setNewServiceImage(b);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Service Scope & Details (What's included)
              </label>
              <input
                type="text"
                placeholder="Details of what is included in this service package, warranty or expert visiting"
                value={newServiceDesc}
                onChange={(e) => setNewServiceDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-gray-50/50"
              />
            </div>

            {/* Hide Service Price Toggle */}
            <div
              onClick={() => setNewServiceHidePrice(!newServiceHidePrice)}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                newServiceHidePrice
                  ? 'bg-amber-100/90 border-amber-500 shadow-xs ring-2 ring-amber-400/30'
                  : 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${newServiceHidePrice ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                    <span>Hide Price / सर्विस फीस छुपाएं</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      newServiceHidePrice ? 'bg-amber-600 text-white' : 'bg-amber-200/90 text-amber-900'
                    }`}>
                      Price on Request
                    </span>
                    <span className={`text-[10px] font-bold ${newServiceHidePrice ? 'text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded' : 'text-gray-500'}`}>
                      {newServiceHidePrice ? '✓ ON (Hidden on store)' : 'OFF'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">Store par service price chupa kar "Price on Request / कीमत पूछें" WhatsApp booking button dikhega</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={newServiceHidePrice}
                  onChange={(e) => setNewServiceHidePrice(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service to Store Catalogue</span>
              </button>
            </div>
          </form>

          {/* Active Services List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Active Store Services ({catalogServices.length})
              </h3>
              <span className="text-xs text-gray-500">Website Section #4 par display hoti hain</span>
            </div>

            {/* SERVICE PRICES QUICK CONTROLS BAR (HIDE / SHOW ALL) */}
            {catalogServices.length > 0 && (
              <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-950 font-['Outfit',sans-serif]">
                        Service Prices Quick Controls (फीस छुपाएँ / दिखाएँ)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 border border-purple-300">
                        {catalogServices.filter((s) => s.hidePrice || currentShop.hideAllPrices).length} of {catalogServices.length} Fees Hidden
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-900/80 mt-0.5">
                      Website par sabhi services ke charges ko ek click me hide ya unhide karein.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleBulkToggleProductPrices('SERVICE', true)}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    title="Website se sabhi services ke charges hide karein"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide All Service Fees</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBulkToggleProductPrices('SERVICE', false)}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    title="Website par sabhi services ke charges dikhayein"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show All Service Fees</span>
                  </button>
                </div>
              </div>
            )}

            {catalogServices.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
                <Wrench className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="font-bold text-sm text-slate-700">Abhi koi service add nahi hai</p>
                <p className="text-xs text-gray-500 mt-1">Upar diye gaye form se apni pehli store service add karein.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalogServices.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all group"
                  >
                    <div>
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 mb-3 border border-gray-100 relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          item.inStock ? 'bg-purple-600 text-white shadow-xs' : 'bg-amber-600 text-white shadow-xs'
                        }`}>
                          {item.inStock ? 'Available' : 'Paused'}
                        </span>
                        {item.unit && (
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-purple-900/80 text-white text-[10px] font-bold">
                            {item.unit}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>

                      <div className="flex items-baseline gap-2 mt-3 flex-wrap">
                        {item.hidePrice || currentShop.hideAllPrices ? (
                          <span className="text-xs font-bold text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                            <EyeOff className="w-3 h-3 text-amber-700" />
                            <span>Price Hidden ({formatINR(item.price)})</span>
                          </span>
                        ) : (
                          <>
                            <span className="text-base font-black text-purple-700">{formatINR(item.price)}</span>
                            {item.originalPrice && (
                              <span className="text-xs line-through text-gray-400 font-semibold">
                                {formatINR(item.originalPrice)}
                              </span>
                            )}
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                                Save {formatINR(item.originalPrice - item.price)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStock(item.id)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${
                            item.inStock
                              ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                              : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {item.inStock ? 'Available' : 'Paused'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleProductHidePrice(item.id)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border flex items-center gap-1 ${
                            item.hidePrice
                              ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                          title={item.hidePrice ? 'Price hidden. Click to show on website.' : 'Click to hide price (Price on Request)'}
                        >
                          {item.hidePrice ? <EyeOff className="w-3 h-3 text-amber-700" /> : <Eye className="w-3 h-3 text-gray-500" />}
                          <span>{item.hidePrice ? 'Hidden' : 'Hide'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditProduct(item)}
                          className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-sm border border-gray-200"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm border border-gray-200"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {(activeNav === 'courses' || activeMainTab === 'COURSES') && (
        /* DEDICATED COURSES CATALOGUE TAB VIEW */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-indigo-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-black uppercase tracking-wider mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>Courses & Training Programs</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight font-['Outfit',sans-serif]">
                  Store Courses & Batches ({catalogCourses.length} Courses)
                </h2>
                <p className="text-xs text-indigo-200 mt-1 max-w-2xl leading-relaxed">
                  Apne store ke sabhi structured courses, coaching classes, vocational training aur certificate programs manage karein. Yeh courses aapki website ke <strong>Dedicated Courses Section (#6)</strong> me direct WhatsApp batch inquiry aur syllabus details ke sath dikhaye jaate hain.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToShop(currentShop.shopId)}
                className="px-4 py-2.5 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-all shadow-sm shrink-0 self-start sm:self-center"
              >
                <Eye className="w-4 h-4" />
                <span>View Courses on Live Shop</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-indigo-800/60">
              <div className="bg-indigo-900/40 rounded-xl p-3 border border-indigo-800/50">
                <div className="text-[10px] text-indigo-300 font-bold uppercase">Total Courses</div>
                <div className="text-xl font-black text-white">{catalogCourses.length}</div>
              </div>
              <div className="bg-indigo-900/40 rounded-xl p-3 border border-indigo-800/50">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Seats Open / Enrolling</div>
                <div className="text-xl font-black text-emerald-400">
                  {catalogCourses.filter((c) => c.inStock !== false).length}
                </div>
              </div>
              <div className="bg-indigo-900/40 rounded-xl p-3 border border-indigo-800/50">
                <div className="text-[10px] text-amber-300 font-bold uppercase">Batches Full / Closed</div>
                <div className="text-xl font-black text-amber-300">
                  {catalogCourses.filter((c) => c.inStock === false).length}
                </div>
              </div>
            </div>
          </div>

          {/* Add Course Form */}
          <form onSubmit={handleAddCourse} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add New Course / Training Program (Naya Course Add Karein)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Course Title / Program Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Digital Marketing & Ads, Full Stack Web Dev, Spoken English"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Duration / Schedule (e.g. 30 Days, 3 Months, Weekend Batch)
                </label>
                <input
                  type="text"
                  placeholder="30 Days, 3 Months, Weekend Batches, 60 Hours"
                  value={newCourseDuration}
                  onChange={(e) => setNewCourseDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Course Fee / Tuition (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newCoursePrice}
                  onChange={(e) => setNewCoursePrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Regular Fee / MRP (₹, optional strike-through)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 1999"
                  value={newCourseOriginalPrice}
                  onChange={(e) => setNewCourseOriginalPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    Category / Subject (Select Karein) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickCatType('COURSE');
                      setIsQuickCatModalOpen(true);
                    }}
                    className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-0.5 cursor-pointer"
                  >
                    + Nayi Category
                  </button>
                </div>
                <select
                  value={newCourseCategory}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setQuickCatType('COURSE');
                      setIsQuickCatModalOpen(true);
                    } else {
                      setNewCourseCategory(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-900 cursor-pointer"
                >
                  <option value="">-- Kripya Category Chunein --</option>
                  {courseCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name} {cat.isCustom ? '★ (Custom)' : ''}
                    </option>
                  ))}
                  <option value="__NEW__" className="font-bold text-indigo-700 bg-indigo-50">
                    + Nayi Category Banayein (Create New Category)...
                  </option>
                </select>
                {courseCategories.length === 0 && (
                  <p className="text-[10px] text-amber-700 mt-1">
                    Koi course category nahi hai. Click karein <strong>"+ Nayi Category"</strong>.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Course Thumbnail Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newCourseImage}
                  onChange={(e) => setNewCourseImage(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
                />
                <label className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-sm text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewCourseImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Course Curriculum / Description (Syllabus summary, eligibility & benefits)
              </label>
              <textarea
                rows={2}
                placeholder="Comprehensive training with live practicals, doubt clearing sessions, notes PDF and recognized completion certificate."
                value={newCourseDesc}
                onChange={(e) => setNewCourseDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newCourseHidePrice}
                  onChange={(e) => setNewCourseHidePrice(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-700 font-semibold">
                  Hide Fee on Website (Display <strong>"Price / Fees on Request"</strong>)
                </span>
              </label>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Course to Catalogue</span>
              </button>
            </div>
          </form>

          {/* Quick Visibility & Bulk Toggle Bar */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Course Fees Visibility:</span>
              <button
                type="button"
                onClick={() => handleBulkToggleProductPrices('COURSE', true)}
                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                <span>Hide All Course Fees</span>
              </button>
              <button
                type="button"
                onClick={() => handleBulkToggleProductPrices('COURSE', false)}
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>Show All Course Fees</span>
              </button>
            </div>

            <div className="text-xs text-gray-500">
              Showing <strong>{catalogCourses.length}</strong> courses
            </div>
          </div>

          {/* Courses List - Product & Service Card Style */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                All Listed Courses ({catalogCourses.length})
              </h3>
            </div>

            {catalogCourses.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-3">
                <GraduationCap className="w-10 h-10 text-gray-400 mx-auto" />
                <div className="text-sm font-bold text-slate-800">Abhi koi course listed nahi hai</div>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Upar diye gaye form se apna pehla course ya coaching program add karein taaki students online enroll kar sakein.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalogCourses.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-video rounded-xl bg-gray-100 overflow-hidden mb-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          item.inStock !== false ? 'bg-indigo-600 text-white shadow-xs' : 'bg-red-600 text-white shadow-xs'
                        }`}>
                          {item.inStock !== false ? 'Seats Open' : 'Batch Full'}
                        </span>
                        {item.unit && (
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold">
                            {item.unit}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {item.category || 'Course'}
                        </span>
                        <span className="text-[10px] text-gray-400">ID: {item.id.slice(-4)}</span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>

                      <div className="flex items-baseline gap-2 mt-3 flex-wrap">
                        {item.hidePrice || currentShop.hideAllPrices ? (
                          <span className="text-xs font-bold text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                            <EyeOff className="w-3 h-3 text-amber-700" />
                            <span>Fees Hidden ({formatINR(item.price)})</span>
                          </span>
                        ) : (
                          <>
                            <span className="text-base font-black text-indigo-700 font-['Outfit',sans-serif]">
                              {formatINR(item.price)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-xs line-through text-gray-400 font-semibold">
                                {formatINR(item.originalPrice)}
                              </span>
                            )}
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                                Save {formatINR(item.originalPrice - item.price)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStock(item.id)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${
                            item.inStock !== false
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                              : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {item.inStock !== false ? 'Seats Open' : 'Closed'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleProductHidePrice(item.id)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border flex items-center gap-1 ${
                            item.hidePrice
                              ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                          title={item.hidePrice ? 'Fee hidden. Click to show on website.' : 'Click to hide fee (Fees on Request)'}
                        >
                          {item.hidePrice ? <EyeOff className="w-3 h-3 text-amber-700" /> : <Eye className="w-3 h-3 text-gray-500" />}
                          <span>{item.hidePrice ? 'Hidden' : 'Hide'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditProduct(item)}
                          className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-sm border border-gray-200 cursor-pointer"
                          title="Edit Course"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm border border-gray-200 cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeMainTab === 'SETTINGS' && ![
        'addon_call',
        'addon_whatsapp',
        'addon_email',
        'addon_payment_qr',
        'addon_custom_domain',
        'addon_shop_standee',
        'addon_website_switch',
        'profile_visibility',
        'profile_validity',
        'settings_account',
        'billing_plan',
        'billing_invoice',
        'billing_renew',
        'support_help',
        'support_care',
        'settings_backup',
        'settings_storage',
      ].includes(activeNav) && (
        /* GENERAL SETTINGS & COMPLETE ACCORDION */
        <div className="space-y-4">
          {/* GENERAL STORE DETAILS SIDE-BY-SIDE WITH 16 WEBSITE SECTIONS (Hero Container - shown on Settings overview) */}
          {activeNav === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LEFT: General Store Details Summary Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm bg-orange-100 text-orange-800">
                    Store Profile & Details
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                    ID: {currentShop.shopId}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 line-clamp-1 font-['Outfit',sans-serif]">
                  {currentShop.businessName}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                  {currentShop.category} • {currentShop.city}, {currentShop.state}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{currentShop.status === 'PUBLISHED' ? 'Verified Store' : 'Active Store'}</span>
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    {catalogProducts.length} Products
                  </span>
                  <span className="bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                    {catalogServices.length} Services
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleSection('BASIC_DETAILS')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Edit Store Details</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToShop(currentShop.shopId)}
                  className="px-3 py-1.5 rounded-sm bg-slate-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-orange-400" />
                  <span>Preview Shop</span>
                </button>
              </div>
            </div>

            {/* RIGHT: Website Sections Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Layout className="w-3 h-3" />
                    Website Sections Builder
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-sm bg-emerald-500 text-slate-950">
                    15 Modular Sections
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white font-['Outfit',sans-serif]">
                  Complete Modular Sections
                </h3>
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                  Hero • About • Features • Products • Benefits • Reviews • Offers • Videos • Portfolio • Team • FAQ • CTA • Contact • Blog • Footer
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[11px] text-gray-400">
                  Full control over ON/OFF & Content
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectNav('sections')}
                  className="px-3.5 py-1.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Customize Sections</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          )}
          
          {/* SECTION 1: MY WEBSITE DETAILS (Basic, Contact, Location) */}
          {(activeNav === 'profile' || activeNav === 'profile_business' || activeNav === 'settings') && (
          <div id="section-basic-details" className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <button
              onClick={() => toggleSection('BASIC_DETAILS')}
              className="w-full px-5 py-4 bg-gray-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">1. My Website Details (Dukaan Ki Jankari)</h3>
                <p className="text-[11px] text-gray-500">Business name, owner, phone, WhatsApp, address, category</p>
              </div>
            </div>
            {(openSection === 'BASIC_DETAILS' || activeNav === 'profile' || activeNav === 'profile_business') ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {(openSection === 'BASIC_DETAILS' || activeNav === 'profile' || activeNav === 'profile_business') && (
            <div className="p-5 space-y-4 border-t border-gray-100 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Business / Shop Name *</label>
                  <input
                    type="text"
                    value={currentShop.businessName}
                    onChange={(e) => setCurrentShop({ ...currentShop, businessName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    value={currentShop.vendorName}
                    onChange={(e) => setCurrentShop({ ...currentShop, vendorName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Dukaan Ka Tagline / Slogan</label>
                <input
                  type="text"
                  value={currentShop.tagline}
                  onChange={(e) => setCurrentShop({ ...currentShop, tagline: e.target.value })}
                  placeholder="e.g. 100% Shuddh & Taaza Kirana Store"
                  className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Business Category *</label>
                <select
                  value={currentShop.category}
                  onChange={(e) => setCurrentShop({ ...currentShop, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50 font-semibold text-slate-800"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-500 mt-1">Aap apni dukaan ka business category kabhi bhi badal sakte hain.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone Number (Calling) *</label>
                  <input
                    type="tel"
                    value={currentShop.phone}
                    onChange={(e) => setCurrentShop({ ...currentShop, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">WhatsApp Number *</label>
                  <input
                    type="tel"
                    value={currentShop.whatsapp}
                    onChange={(e) => setCurrentShop({ ...currentShop, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={currentShop.email}
                    onChange={(e) => setCurrentShop({ ...currentShop, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Shop Address *</label>
                  <input
                    type="text"
                    value={currentShop.address}
                    onChange={(e) => setCurrentShop({ ...currentShop, address: e.target.value })}
                    placeholder="e.g. Shop No. 12, Main Market, Godowlia"
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">City & State *</label>
                  <input
                    type="text"
                    value={`${currentShop.city}, ${currentShop.state}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      setCurrentShop({
                        ...currentShop,
                        city: parts[0]?.trim() || currentShop.city,
                        state: parts[1]?.trim() || currentShop.state,
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSaveAll()}
                  className="px-6 py-2.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Website Details</span>
                </button>
              </div>
            </div>
          )}
        </div>
        )}

        {/* SECTION 2: 16 WEBSITE SECTIONS BUILDER */}
        {activeNav === 'settings' && (
        <div id="section-website-builder" className="bg-white rounded-2xl border-2 border-orange-300 shadow-xs overflow-hidden">
          <button
            onClick={() => toggleSection('WEBSITE_SECTIONS')}
            className="w-full px-5 py-4 bg-orange-50/50 hover:bg-orange-100/50 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                    2. Website Sections Builder
                  </h3>
                  <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    15 Modular Sections
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Hero, About, Features, Products, Offers, Videos, Portfolio, Team, FAQ, Contact, Blog aur Footer
                </p>
              </div>
            </div>
            {openSection === 'WEBSITE_SECTIONS' ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {openSection === 'WEBSITE_SECTIONS' && (
            <div className="p-5 space-y-4 border-t border-orange-100 animate-in fade-in duration-200">
              <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-black font-['Outfit',sans-serif]">
                    15 Modular Website Sections Suite
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 max-w-xl">
                    Aap apni store website ke har ek section ko apni zaroorat ke anusaar enable ya disable kar sakte hain. Services ko manage karne ke liye dashboard ke direct <strong>Services</strong> tab ka use karein!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMainTab('SECTIONS')}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 shadow-sm shrink-0"
                >
                  <Layout className="w-4 h-4" />
                  <span>Open Full 16 Sections Editor</span>
                </button>
              </div>

              {/* 16 Sections Visual Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  { num: 1, name: 'Hero Banner', icon: '🌟' },
                  { num: 2, name: 'About Store', icon: '🏪' },
                  { num: 3, name: 'Key Features', icon: '⚡' },
                  { num: 4, name: 'Store Services', icon: '🛠️' },
                  { num: 5, name: 'Products Catalog', icon: '📦' },
                  { num: 6, name: 'Why Choose Us', icon: '🛡️' },
                  { num: 7, name: 'Testimonials', icon: '💬' },
                  { num: 8, name: 'Offers & Deals', icon: '🏷️' },
                  { num: 9, name: 'Videos & Reels', icon: '🎬' },
                  { num: 10, name: 'Portfolio / Work', icon: '🖼️' },
                  { num: 11, name: 'Team Members', icon: '👥' },
                  { num: 12, name: 'FAQ Section', icon: '❓' },
                  { num: 13, name: 'Call To Action', icon: '🚀' },
                  { num: 14, name: 'Contact Info', icon: '📞' },
                  { num: 15, name: 'Blog / Articles', icon: '📰' },
                  { num: 16, name: 'Footer & Links', icon: '🌐' },
                ].map((sec) => (
                  <div
                    key={sec.num}
                    onClick={() => setActiveMainTab('SECTIONS')}
                    className="p-2.5 bg-gray-50 hover:bg-orange-50/60 rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer transition-all flex items-center gap-2"
                  >
                    <span className="text-base">{sec.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[10px] text-gray-500 font-mono font-bold">#{sec.num}</div>
                      <div className="font-bold text-slate-800 text-[11px] truncate">{sec.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        )}

        {/* SECTION 3: PRODUCTS CATALOGUE (Physical Items Only) */}
        {activeNav === 'settings' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <button
            onClick={() => toggleSection('PRODUCTS')}
            className="w-full px-5 py-4 bg-gray-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                    3. Products Catalogue ({catalogProducts.length} Items)
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Physical Goods Only
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Physical products, MRP, selling price, pack size/unit, product photo aur in-stock status
                </p>
              </div>
            </div>
            {openSection === 'PRODUCTS' ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {openSection === 'PRODUCTS' && (
            <div className="p-5 space-y-6 border-t border-gray-100 animate-in fade-in duration-200">
              {/* Add New Physical Product Form */}
              <form onSubmit={handleAddProduct} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <div className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Add New Physical Product (Naya Samaan Add Karein)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pure Desi Cow Ghee (1 Litre Jar) ya Cotton Kurti"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Pack Size / Unit (e.g. 1 kg, 1 pc)
                    </label>
                    <input
                      type="text"
                      placeholder="1 pc, 1 kg, 500gm, Pack of 2"
                      value={newProductUnit}
                      onChange={(e) => setNewProductUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                {/* Product Category Dropdown */}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <FolderTree className="w-3 h-3 text-emerald-600" />
                      <span>Product Category (श्रेणी चुनें) *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickCatType('PRODUCT');
                        setIsQuickCatModalOpen(true);
                      }}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>+ Nayi Category Banayein</span>
                    </button>
                  </div>
                  <select
                    value={newProductCategory}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setQuickCatType('PRODUCT');
                        setIsQuickCatModalOpen(true);
                      } else {
                        setNewProductCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-900 cursor-pointer"
                  >
                    <option value="">-- Kripya Category Chunein (Select Category) --</option>
                    {productCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name} {cat.isCustom ? '★ (Custom)' : ''}
                      </option>
                    ))}
                    <option value="__NEW__" className="font-bold text-emerald-700 bg-emerald-50">
                      + Nayi Category Banayein (Create New Category)...
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Original MRP (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newProductOriginalPrice}
                      onChange={(e) => setNewProductOriginalPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Product Photo
                    </label>
                    <label className="w-full px-3 py-2 bg-white border border-dashed border-gray-300 hover:border-emerald-500 rounded-sm text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const b = await fileToBase64(f);
                            setNewProductImage(b);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Short Description (1-2 lines)
                  </label>
                  <input
                    type="text"
                    placeholder="Details about quality, warranty or pack size"
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Products Catalogue</span>
                  </button>
                </div>
              </form>

              {/* Active Products List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Active Physical Products ({catalogProducts.length})
                  </h4>
                  <span className="text-[11px] text-gray-500">Live website ke Products Showcase me dikhte hain</span>
                </div>

                {catalogProducts.length === 0 ? (
                  <div className="p-6 text-center bg-gray-50 rounded-xl border border-gray-200 text-gray-400 text-xs">
                    Koi product add nahi hai. Upar diye gaye form se product add karein.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catalogProducts.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center gap-3 justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              PRODUCT
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.name}</h5>
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="font-bold text-slate-900">{formatINR(item.price)}</span>
                              {item.originalPrice && (
                                <span className="line-through text-gray-400 text-[10px]">
                                  {formatINR(item.originalPrice)}
                                </span>
                              )}
                              {item.unit && (
                                <span className="text-[10px] text-gray-500 font-semibold">• {item.unit}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditProduct(item)}
                            title="Edit Product"
                            className="p-1.5 text-emerald-700 hover:text-white hover:bg-emerald-600 rounded-sm bg-emerald-50 border border-emerald-200 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleProductStock(item.id)}
                            className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                              item.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.inStock ? 'In Stock' : 'Out'}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-sm hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        )}

        {/* SECTION 4: SERVICES CATALOGUE (Store Services & Bookings Only) */}
        {activeNav === 'settings' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <button
            onClick={() => toggleSection('SERVICES')}
            className="w-full px-5 py-4 bg-gray-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                    4. Services Catalogue ({catalogServices.length} Services)
                  </h3>
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Services & Bookings Only
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Store services, consultation fees, duration/terms, service banner aur WhatsApp booking
                </p>
              </div>
            </div>
            {openSection === 'SERVICES' ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {openSection === 'SERVICES' && (
            <div className="p-5 space-y-6 border-t border-gray-100 animate-in fade-in duration-200">
              {/* Add New Service Form */}
              <form onSubmit={handleAddService} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <div className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-purple-600" />
                  <span>Add New Store Service (Nayi Service Add Karein)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AC Deep Cleaning & Service, Bridal Makeup, Laptop Repair"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Duration / Service Terms
                    </label>
                    <input
                      type="text"
                      placeholder="Per Visit, 1 Hour, Per Room, Per Session"
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>
                </div>

                {/* Service Category Dropdown */}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <FolderTree className="w-3 h-3 text-purple-600" />
                      <span>Service Category (श्रेणी चुनें) *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickCatType('SERVICE');
                        setIsQuickCatModalOpen(true);
                      }}
                      className="text-[10px] font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>+ Nayi Category Banayein</span>
                    </button>
                  </div>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setQuickCatType('SERVICE');
                        setIsQuickCatModalOpen(true);
                      } else {
                        setNewServiceCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-white font-medium text-slate-900 cursor-pointer"
                  >
                    <option value="">-- Kripya Category Chunein (Select Category) --</option>
                    {serviceCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name} {cat.isCustom ? '★ (Custom)' : ''}
                      </option>
                    ))}
                    <option value="__NEW__" className="font-bold text-purple-700 bg-purple-50">
                      + Nayi Category Banayein (Create New Category)...
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Starting Fee / Charge (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Regular Fee (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newServiceOriginalPrice}
                      onChange={(e) => setNewServiceOriginalPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Service Photo
                    </label>
                    <label className="w-full px-3 py-2 bg-white border border-dashed border-gray-300 hover:border-purple-500 rounded-sm text-[10px] font-bold uppercase tracking-wider text-purple-800 flex items-center justify-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const b = await fileToBase64(f);
                            setNewServiceImage(b);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Service Scope & Details (What's included)
                  </label>
                  <input
                    type="text"
                    placeholder="Details about what is included, technician arrival time, warranty"
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Services Catalogue</span>
                  </button>
                </div>
              </form>

              {/* Active Services List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Active Store Services ({catalogServices.length})
                  </h4>
                  <span className="text-[11px] text-gray-500">Website Section #4 par display hoti hain</span>
                </div>

                {catalogServices.length === 0 ? (
                  <div className="p-6 text-center bg-gray-50 rounded-xl border border-gray-200 text-gray-400 text-xs">
                    Koi service add nahi hai. Upar diye gaye form se service add karein.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catalogServices.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center gap-3 justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider bg-purple-100 text-purple-800">
                              SERVICE
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.name}</h5>
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="font-bold text-purple-700">{formatINR(item.price)}</span>
                              {item.originalPrice && (
                                <span className="line-through text-gray-400 text-[10px]">
                                  {formatINR(item.originalPrice)}
                                </span>
                              )}
                              {item.unit && (
                                <span className="text-[10px] text-gray-500 font-semibold">• {item.unit}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditProduct(item)}
                            title="Edit Service"
                            className="p-1.5 text-purple-700 hover:text-white hover:bg-purple-600 rounded-sm bg-purple-50 border border-purple-200 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleProductStock(item.id)}
                            className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                              item.inStock ? 'bg-purple-100 text-purple-800' : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {item.inStock ? 'Available' : 'Paused'}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-sm hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        )}

        {/* SECTION 5: BANNERS & MEDIA (Direct file upload) */}
        {(activeNav === 'gallery' || activeNav === 'settings') && (
        <div id="section-media-banners" className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <button
            onClick={() => toggleSection('MEDIA_BANNERS')}
            className="w-full px-5 py-4 bg-gray-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">5. Hero Banners & Photos (Direct Mobile Upload)</h3>
                <p className="text-[11px] text-gray-500">Seedhe gallery se photo upload karein — URL paste karne ki zaroorat nahi!</p>
              </div>
            </div>
            {(openSection === 'MEDIA_BANNERS' || activeNav === 'gallery') ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {(openSection === 'MEDIA_BANNERS' || activeNav === 'gallery') && (
            <div className="p-5 space-y-5 border-t border-gray-100 animate-in fade-in duration-200">
              
              {/* Banner Text settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={currentShop.bannerTitle || ''}
                    onChange={(e) => setCurrentShop({ ...currentShop, bannerTitle: e.target.value })}
                    placeholder="e.g. Shahi Rajasthani Collection"
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Banner Subtitle</label>
                  <input
                    type="text"
                    value={currentShop.bannerSubtitle || ''}
                    onChange={(e) => setCurrentShop({ ...currentShop, bannerSubtitle: e.target.value })}
                    placeholder="e.g. Free delivery on all WhatsApp orders"
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>
              </div>

              {/* 1. Desktop Banners Carousel (Max 4 Banners) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Desktop Hero Carousel Banners (Maximum 4 Banners)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Desktop aur laptop screens ke liye horizontal wide banners (16:9 ya 21:9). Automatically carousel slider mein show honge.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                    Desktop View (Max 4)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((idx) => {
                    const bannerSrc = (currentShop.desktopBanners && currentShop.desktopBanners[idx]) || (idx === 0 ? currentShop.banners?.[0] : '') || '';
                    return (
                      <div key={`desk-banner-${idx}`} className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 space-y-2 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Desktop Banner #{idx + 1}</span>
                            {bannerSrc ? (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Uploaded
                              </span>
                            ) : (
                              <span className="text-[9px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                Empty
                              </span>
                            )}
                          </div>

                          <div className="aspect-16/9 rounded-lg bg-gray-200 overflow-hidden border border-gray-300 relative group flex items-center justify-center">
                            {bannerSrc ? (
                              <img src={bannerSrc} alt={`Desktop Banner ${idx + 1}`} className="w-full h-full object-contain bg-slate-900/5" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                                <ImageIcon className="w-6 h-6 mb-1 text-gray-300" />
                                <span>No Banner</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <label className="cursor-pointer flex-1 py-2 bg-white border border-gray-300 hover:bg-orange-50 text-slate-700 hover:text-orange-700 rounded text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span>{bannerSrc ? `Change #${idx + 1}` : `Upload #${idx + 1}`}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleDesktopBannerUpload(e, idx)}
                            />
                          </label>

                          {bannerSrc && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDesktopBanner(idx)}
                              className="p-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded transition-colors shadow-2xs cursor-pointer"
                              title={`Desktop Banner #${idx + 1} Remove Karein`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Mobile Banners Carousel (Max 3 Banners) */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Mobile Hero Carousel Banners (Maximum 3 Banners)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Smartphones ke liye separate portrait banners (4:5 ya 9:16). Mobile device par sirf ye banners show honge, desktop banners use nahi honge.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                    Mobile View (Max 3)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((idx) => {
                    const bannerSrc = currentShop.mobileBanners?.[idx] || '';
                    return (
                      <div key={`mob-banner-${idx}`} className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 space-y-2 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Mobile Banner #{idx + 1}</span>
                            {bannerSrc ? (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Uploaded
                              </span>
                            ) : (
                              <span className="text-[9px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                Empty
                              </span>
                            )}
                          </div>

                          <div className="aspect-4/5 max-h-48 mx-auto rounded-lg bg-gray-200 overflow-hidden border border-gray-300 relative group flex items-center justify-center">
                            {bannerSrc ? (
                              <img src={bannerSrc} alt={`Mobile Banner ${idx + 1}`} className="w-full h-full object-contain bg-slate-900/5" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                                <ImageIcon className="w-6 h-6 mb-1 text-gray-300" />
                                <span>No Banner</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <label className="cursor-pointer flex-1 py-2 bg-white border border-gray-300 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{bannerSrc ? `Change #${idx + 1}` : `Upload #${idx + 1}`}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleMobileBannerUpload(e, idx)}
                            />
                          </label>

                          {bannerSrc && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMobileBanner(idx)}
                              className="p-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded transition-colors shadow-2xs cursor-pointer"
                              title={`Mobile Banner #${idx + 1} Remove Karein`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Social Media Accounts & Profile Links */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Social Media Accounts & Contact Profiles
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Contact Us section mein clickable social media icons display honge
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Direct Links
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      WhatsApp Number / Link
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={currentShop.socialLinks?.whatsapp || currentShop.whatsapp || ''}
                      onChange={(e) => setCurrentShop({
                        ...currentShop,
                        whatsapp: e.target.value,
                        socialLinks: { ...(currentShop.socialLinks || {}), whatsapp: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Instagram Handle / URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. @shahi_handicrafts"
                      value={currentShop.socialLinks?.instagram || ''}
                      onChange={(e) => setCurrentShop({
                        ...currentShop,
                        socialLinks: { ...(currentShop.socialLinks || {}), instagram: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Facebook Page URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://facebook.com/myshop"
                      value={currentShop.socialLinks?.facebook || ''}
                      onChange={(e) => setCurrentShop({
                        ...currentShop,
                        socialLinks: { ...(currentShop.socialLinks || {}), facebook: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      YouTube Channel / Video
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://youtube.com/@myshop"
                      value={currentShop.socialLinks?.youtube || ''}
                      onChange={(e) => setCurrentShop({
                        ...currentShop,
                        socialLinks: { ...(currentShop.socialLinks || {}), youtube: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Twitter / X Handle
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. @myshop"
                      value={currentShop.socialLinks?.twitter || ''}
                      onChange={(e) => setCurrentShop({
                        ...currentShop,
                        socialLinks: { ...(currentShop.socialLinks || {}), twitter: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      LinkedIn Page URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://linkedin.com/company/myshop"
                      value={currentShop.socialLinks?.linkedin || ''}
                      onChange={(e) => setCurrentShop({
                        ...currentShop,
                        socialLinks: { ...(currentShop.socialLinks || {}), linkedin: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 rounded border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Photo Gallery (Masonry Showcase Photos) */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Store Photo Gallery (Masonry Section Photos)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Store ki dukaan, showcase aur products ke photos upload karein
                    </p>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'gallery')}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {(currentShop.galleryImages || []).map((imgUrl, gIdx) => (
                    <div key={`dash-gal-${gIdx}`} className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative group bg-gray-100">
                      <img src={imgUrl} alt={`Gallery ${gIdx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...currentShop,
                            galleryImages: currentShop.galleryImages.filter((_, i) => i !== gIdx),
                          };
                          setCurrentShop(updated);
                          handleSaveAll(updated);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. About Photo Upload */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  About Us / Owner Photo
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden border border-gray-300">
                    <img
                      src={currentShop.aboutPhotoUrl}
                      alt="About Photo"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <label className="cursor-pointer px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span>Upload About Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'aboutPhotoUrl')}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSaveAll()}
                  className="px-6 py-2.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Media Settings</span>
                </button>
              </div>

            </div>
          )}
        </div>
        )}

        {/* SECTION 4: PAYMENT QR & UPI SETUP */}
        {(activeNav === 'payments' || activeNav === 'settings') && (
        <div id="section-payment-qr" className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <button
            onClick={() => toggleSection('PAYMENT_QR')}
            className="w-full px-5 py-4 bg-gray-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">4. Payment QR Code & UPI Details (Direct UPI)</h3>
                <p className="text-[11px] text-gray-500">Upload PhonePe / Google Pay / Paytm QR code image</p>
              </div>
            </div>
            {(openSection === 'PAYMENT_QR' || activeNav === 'payments') ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {(openSection === 'PAYMENT_QR' || activeNav === 'payments') && (
            <div className="p-5 space-y-4 border-t border-gray-100 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your UPI ID (VPA)</label>
                  <input
                    type="text"
                    value={currentShop.upiId}
                    onChange={(e) => setCurrentShop({ ...currentShop, upiId: e.target.value })}
                    placeholder="e.g. mobile@paytm or shop@okaxis"
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50 font-mono font-bold"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Customers will send payments directly to your linked UPI account without intermediary delays.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-gray-100 p-1.5 border border-gray-300 shrink-0">
                    <img
                      src={currentShop.paymentQrUrl}
                      alt="Payment QR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div>
                    <label className="cursor-pointer px-4 py-2.5 bg-orange-50 border border-orange-300 hover:bg-orange-100 text-orange-900 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4 text-orange-600" />
                      <span>Upload QR Code Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'paymentQrUrl')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSaveAll()}
                  className="px-6 py-2.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Payment QR</span>
                </button>
              </div>
            </div>
          )}
        </div>
        )}

        {/* SECTION 5: YOUTUBE VIDEOS (Up to 8 Videos as requested) */}
        {(activeNav === 'gallery' || activeNav === 'settings') && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <button
            onClick={() => toggleSection('VIDEOS')}
            className="w-full px-5 py-4 bg-gray-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-bold">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                  5. Store Videos & Demos ({currentShop.videos.length}/8 Max)
                </h3>
                <p className="text-[11px] text-gray-500">YouTube video links lagayein taaki customer trust badhe</p>
              </div>
            </div>
            {(openSection === 'VIDEOS' || activeNav === 'gallery') ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {(openSection === 'VIDEOS' || activeNav === 'gallery') && (
            <div className="p-5 space-y-4 border-t border-gray-100 animate-in fade-in duration-200">
              
              {/* Add Video Form */}
              {currentShop.videos.length < 8 ? (
                <form onSubmit={handleAddVideo} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Video Title (e.g. Fresh Stock Testing)"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs bg-white"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      required
                      placeholder="YouTube Video Link (e.g. https://youtu.be/...)"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Video</span>
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-xs text-orange-700 font-semibold">Maximum 8 YouTube videos limit reached.</p>
              )}

              {/* Videos list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentShop.videos.map((vid) => {
                  const embedUrl = getYouTubeEmbedUrl(vid.youtubeUrl) || vid.youtubeUrl;
                  return (
                    <div key={vid.id} className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                        <iframe
                          src={embedUrl}
                          title={vid.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">{vid.title}</div>
                          <div className="text-[10px] text-gray-400 font-mono truncate">{vid.youtubeUrl}</div>
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-sm shrink-0"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
        )}

        {/* SECTION 6: FORM INQUIRIES & LEADS (With Read / Unread filters) */}
        {(activeNav === 'orders' || activeNav === 'profile_inquiries' || activeNav === 'settings') && (
        <div id="section-inquiries" className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <button
            onClick={() => toggleSection('INQUIRIES')}
            className="w-full px-5 py-4 bg-gray-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                  6. Form Inquiries & Customer Leads ({shopInquiries.length} Inquiries)
                </h3>
                <p className="text-[11px] text-gray-500">
                  Grahakon ke contact forms, service bookings aur inquiries ko manage karein
                </p>
              </div>
            </div>
            {(openSection === 'INQUIRIES' || activeNav === 'orders' || activeNav === 'profile_inquiries') ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {(openSection === 'INQUIRIES' || activeNav === 'orders' || activeNav === 'profile_inquiries') && (
            <div className="p-5 space-y-4 border-t border-gray-100 animate-in fade-in duration-200">
              
              {/* Filter Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInquiryFilter('ALL')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    inquiryFilter === 'ALL' ? 'bg-orange-600 text-white shadow-xs' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                  }`}
                >
                  All ({shopInquiries.length})
                </button>
                <button
                  onClick={() => setInquiryFilter('UNREAD')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    inquiryFilter === 'UNREAD' ? 'bg-orange-600 text-white shadow-xs' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                  }`}
                >
                  Unread ({shopInquiries.filter((i) => i.status === 'UNREAD').length})
                </button>
                <button
                  onClick={() => setInquiryFilter('READ')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    inquiryFilter === 'READ' ? 'bg-orange-600 text-white shadow-xs' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                  }`}
                >
                  Read ({shopInquiries.filter((i) => i.status === 'READ').length})
                </button>
              </div>

              {/* Inquiry Items List */}
              {filteredInquiries.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs font-semibold">
                  Abhi koi inquiry nahi aayi hai.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className={`p-4 rounded-xl border transition-all ${
                        inq.status === 'UNREAD'
                          ? 'bg-orange-50/60 border-orange-300'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{inq.customerName}</span>
                          <span className="text-gray-400 text-[10px]">
                            {new Date(inq.date).toLocaleDateString()}
                          </span>
                          {inq.status === 'UNREAD' && (
                            <span className="bg-orange-600 text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                              NEW UNREAD
                            </span>
                          )}
                        </div>

                        {/* Customer Direct Contact Actions */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${inq.customerPhone}`}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                          <a
                            href={getWhatsAppDirectUrl(inq.customerPhone, `Namaste ${inq.customerName}, IndianLalaJi par aapki inquiry mil gayi hai!`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                          >
                            <PhoneCall className="w-3 h-3 text-orange-400" />
                            <span>WhatsApp</span>
                          </a>
                          <button
                            onClick={() => onUpdateInquiryStatus(inq.id, inq.status === 'UNREAD' ? 'READ' : 'UNREAD')}
                            className="text-xs font-bold uppercase tracking-wider text-orange-600 hover:underline px-2"
                          >
                            Mark {inq.status === 'UNREAD' ? 'Read' : 'Unread'}
                          </button>
                        </div>
                      </div>

                      {inq.serviceOrProductRequested && (
                        <div className="text-[11px] text-orange-800 font-semibold mb-1">
                          Item Requested: {inq.serviceOrProductRequested}
                        </div>
                      )}

                      <p className="text-xs text-gray-700 bg-white/80 p-2.5 rounded-lg border border-gray-200/60 leading-relaxed">
                        "{inq.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>
        )}

        {/* SECTION 7: THEME & APPEARANCE CUSTOMIZATION */}
        {(activeNav === 'settings' || activeNav === 'settings_theme') && (
        <div id="section-theme-custom" className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <button
            onClick={() => toggleSection('THEME_CUSTOM')}
            className="w-full px-5 py-4 bg-gray-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">7. Theme Colors & Feature Switches</h3>
                <p className="text-[11px] text-gray-500">Color palette, font style, button shape, E-commerce cart toggle</p>
              </div>
            </div>
            {(openSection === 'THEME_CUSTOM' || activeNav === 'settings' || activeNav === 'settings_theme') ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {(openSection === 'THEME_CUSTOM' || activeNav === 'settings' || activeNav === 'settings_theme') && (
            <div className="p-5 space-y-5 border-t border-gray-100 animate-in fade-in duration-200">
              
              {/* Color Theme Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Store Theme Color</label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'saffron', name: 'Saffron Gold', bg: 'bg-amber-500' },
                    { id: 'emerald', name: 'Emerald Green', bg: 'bg-emerald-600' },
                    { id: 'royal', name: 'Royal Indigo', bg: 'bg-indigo-600' },
                    { id: 'rose', name: 'Jaipuri Rose', bg: 'bg-rose-600' },
                    { id: 'gold', name: 'Warm Marigold', bg: 'bg-yellow-500' },
                    { id: 'maroon', name: 'Vedic Maroon', bg: 'bg-red-800' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setCurrentShop({ ...currentShop, colorTheme: thm.id as any })}
                      className={`p-2.5 rounded-sm border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                        currentShop.colorTheme === thm.id
                          ? 'border-slate-900 bg-gray-50 shadow-xs'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${thm.bg}`} />
                      <span className="truncate">{thm.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles: E-commerce & Service Booking */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900">E-Commerce WhatsApp Cart</div>
                    <div className="text-[11px] text-gray-500">Enable add-to-cart floating strip on products</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentShop.ecommerceEnabled}
                    onChange={(e) => setCurrentShop({ ...currentShop, ecommerceEnabled: e.target.checked })}
                    className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900">Service Booking & Inquiries</div>
                    <div className="text-[11px] text-gray-500">Allow customers to submit booking requests</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentShop.serviceBookingEnabled}
                    onChange={(e) => setCurrentShop({ ...currentShop, serviceBookingEnabled: e.target.checked })}
                    className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                  />
                </div>

                <div
                  onClick={() => handleToggleHideAllPrices(!currentShop.hideAllPrices)}
                  className={`p-4 rounded-xl border sm:col-span-2 flex items-center justify-between cursor-pointer select-none transition-all ${
                    currentShop.hideAllPrices
                      ? 'bg-amber-100/90 border-amber-500 shadow-sm ring-2 ring-amber-400/40'
                      : 'bg-amber-50/60 border-amber-200 hover:border-amber-300 hover:bg-amber-50/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      currentShop.hideAllPrices ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      <EyeOff className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 flex-wrap">
                        <span>Hide All Store Prices / सभी प्रोडक्ट्स की कीमत छुपाएं</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          currentShop.hideAllPrices
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-amber-200/90 text-amber-900'
                        }`}>
                          {currentShop.hideAllPrices ? '✓ ACTIVE (Catalog Mode)' : 'Catalog Mode'}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        Website par sabhi items ki price chhupa kar "Price on Request / कीमत पूछें" WhatsApp inquiry button dikhayega.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                    <span className={`text-[10px] font-bold uppercase hidden sm:inline ${currentShop.hideAllPrices ? 'text-amber-900 font-black' : 'text-gray-500'}`}>
                      {currentShop.hideAllPrices ? 'HIDDEN (ON)' : 'SHOWN (OFF)'}
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(currentShop.hideAllPrices)}
                      onChange={(e) => handleToggleHideAllPrices(e.target.checked)}
                      className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSaveAll()}
                  className="px-6 py-2.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Theme & Features</span>
                </button>
              </div>

            </div>
          )}
        </div>
        )}

        {/* SECTION 8: 16 WEBSITE SECTIONS BUILDER QUICK SHORTCUT */}
        {activeNav === 'settings' && (
        <div id="section-website-builder" className="bg-white rounded-2xl border-2 border-orange-400 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => handleSelectNav('sections')}
            className="w-full px-5 py-4 bg-orange-50/60 hover:bg-orange-100/60 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                    8. Website Sections Builder (Hero, About, Team, FAQ, Offers...)
                  </h3>
                  <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    ON/OFF & Edit
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Customise all 15 modular sections: enable/disable, re-edit texts, add team, testimonials, gallery & banners
                </p>
              </div>
            </div>
            <div className="px-3.5 py-1.5 bg-orange-600 text-white text-xs font-bold uppercase rounded-sm flex items-center gap-1 shadow-xs">
              <span>Open Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
        )}

        {/* SECTION 9: INVOICES & BILLING RECEIPTS */}
        {(activeNav === 'invoices' || activeNav === 'settings') && (
        <div id="section-invoices" className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <button
            onClick={() => toggleSection('INVOICES')}
            className="w-full px-5 py-4 bg-gray-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">9. Invoices & Billing Receipts (1-Year Subscription)</h3>
                <p className="text-[11px] text-gray-500">Official GST-ready printable tax invoices for store subscription</p>
              </div>
            </div>
            {(openSection === 'INVOICES' || activeNav === 'invoices') ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {(openSection === 'INVOICES' || activeNav === 'invoices') && (
            <div className="p-5 sm:p-6 space-y-5 border-t border-gray-100 animate-in fade-in duration-200">
              
              {/* Active Invoice Card */}
              <div id="section-plan-validity" className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-700 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                      Official Tax Invoice & Receipt
                    </div>
                    <div className="text-base sm:text-lg font-black uppercase font-['Outfit',sans-serif] mt-0.5">
                      {currentShop.planName || '1-Year Official LalaJi Store Plan'}
                    </div>
                    <div className="text-xs text-gray-400">
                      Invoice for Store: <strong className="text-white font-mono">{currentShop.shopId}</strong> ({currentShop.businessName})
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Amount Paid</div>
                    <div className="text-2xl font-black text-white font-['Outfit',sans-serif]">
                      {formatINR(currentShop.planPrice || 1499)}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{currentShop.status === 'PUBLISHED' ? 'PAID & VERIFIED' : 'PENDING'}</span>
                    </div>
                  </div>
                </div>

                {/* Dates & Reference Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Active From</div>
                    <div className="text-white font-bold font-mono mt-0.5">{formatDisplayDate(currentShop.activeDate || new Date().toISOString())}</div>
                  </div>

                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Valid Till</div>
                    <div className="text-orange-400 font-bold font-mono mt-0.5">{formatDisplayDate(currentShop.expiryDate || getOneYearExpiryDate())}</div>
                  </div>

                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Validity</div>
                    <div className="text-white font-bold mt-0.5">365 Days (1 Year)</div>
                  </div>

                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Payment Mode</div>
                    <div className="text-white font-bold mt-0.5">Direct UPI QR Code</div>
                  </div>
                </div>

                {/* Actions: View / Print Invoice */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                  <span className="text-[11px] text-gray-400">
                    GSTIN: 03AABCI9823P1Z4 • Computer-generated legal tax invoice
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowInvoiceModal(true)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View & Print Tax Invoice</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
        )}

        {/* DUKAAN COUNTER QR STANDEE VIEW */}
        {activeNav === 'standee' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Dukaan Counter Standee</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  Counter QR Standee (दुकान काउंटर क्यूआर स्टैंडी)
                </h2>
                <p className="text-xs text-gray-500 mt-1 max-w-xl">
                  Ise print karke apni dukaan ke cash counter par lagayein. Grahak QR scan karke aapki poori dukaan ka digital catalogue dekh sakte hain aur UPI se seedha payment bhej sakte hain.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowStandeeModal(true)}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print A4 Standee</span>
                </button>
              </div>
            </div>

            {/* Standee Preview Box */}
            <div className="max-w-md mx-auto bg-gradient-to-b from-orange-600 via-amber-600 to-slate-900 text-white p-6 rounded-3xl shadow-xl text-center space-y-4 border-4 border-amber-300/40">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">
                INDIANLALAJI.COM DIGITAL STORE
              </div>
              <h3 className="text-2xl font-black font-['Outfit',sans-serif] text-white">
                {currentShop.businessName}
              </h3>
              <p className="text-xs text-orange-100 font-medium">
                {currentShop.tagline || 'Aapki Apni Digital Dukaan • 100% Direct Orders'}
              </p>

              <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto my-2">
                <img
                  src={currentShop.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(window.location.origin + '/?shop=' + currentShop.shopId)}`}
                  alt="Shop QR Standee"
                  className="w-48 h-48 object-contain mx-auto"
                />
                <div className="text-[11px] font-black text-slate-900 mt-2 font-mono">
                  SHOP ID: {currentShop.shopId}
                </div>
              </div>

              <div className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                Scan Karein • Catalogue Dekhein • Order Karein
              </div>

              <div className="pt-2 border-t border-white/20 flex items-center justify-center gap-4 text-xs font-medium text-orange-100">
                <span>✓ PhonePe</span>
                <span>✓ Google Pay</span>
                <span>✓ Paytm</span>
                <span>✓ WhatsApp</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowStandeeModal(true)}
                className="px-5 py-2.5 rounded-sm bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-orange-400" />
                <span>Full Standee Modal Kholein</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.location.origin + '/?shop=' + currentShop.shopId;
                  window.open(`https://wa.me/?text=${encodeURIComponent(`Namaste! Hamari dukaan ka digital catalogue yahan dekhein: ${url}`)}`, '_blank');
                }}
                className="px-5 py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share QR on WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* MY PLAN & STORE VALIDITY VIEW */}
        {activeNav === 'my-plan' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>1-Year Active Subscription</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  My Plan & Store Validity
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Your store is active on the 1-Year IndianLalaJi Business Plan with direct payments and unlimited WhatsApp orders included.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-orange-400" />
                <span>Download Tax Invoice</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-2 border border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Current Plan</span>
                <div className="text-xl font-black font-['Outfit',sans-serif]">{currentShop.planName || '1-Year LalaJi Pro Merchant'}</div>
                <div className="text-xs text-gray-300">Annual Fee: {formatINR(currentShop.planPrice || 1499)} (All Inclusive)</div>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Plan Status</span>
                <div className="text-xl font-black text-emerald-950 font-['Outfit',sans-serif]">Active & Published</div>
                <div className="text-xs text-emerald-700">Valid Till: {getOneYearExpiryDate(currentShop.createdAt || '')}</div>
              </div>
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Days Remaining</span>
                <div className="text-xl font-black text-amber-950 font-['Outfit',sans-serif]">{calculateDaysRemaining(currentShop.createdAt || '')} Days</div>
                <div className="text-xs text-amber-700">Direct orders & payments</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Included in Your Plan:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited WhatsApp Orders & Inquiries</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Digital Catalogue (Unlimited Products & Services)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Ready-to-Print Counter QR Standee</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 15 Modular Website Sections (Hero, About, FAQ, Reviews...)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Direct UPI Payments (No 2% PG Cut)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Dedicated Merchant Support Helpline</div>
              </div>
            </div>
          </div>
        )}

        {/* STORE ANALYTICS VIEW */}
        {activeNav === 'analytics' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Real-time Traffic & Performance</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  Store Analytics (स्टोर एनालिटिक्स)
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Aapki website par aane wale grahakon ki sankhya aur WhatsApp enquiry conversion data.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Visits</div>
                <div className="text-2xl font-black text-slate-900 mt-1">1,248</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 18% this week</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">WhatsApp Inquiries</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">{shopInquiries.length + 24}</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Direct chat leads</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Catalogue Views</div>
                <div className="text-2xl font-black text-orange-600 mt-1">890</div>
                <div className="text-[10px] text-gray-500 font-semibold mt-0.5">Product clicks</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Counter QR Scans</div>
                <div className="text-2xl font-black text-purple-600 mt-1">156</div>
                <div className="text-[10px] text-purple-700 font-semibold mt-0.5">Dukaan counter se</div>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM DOMAIN SETUP VIEW */}
        {activeNav === 'settings_domain' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6 animate-in fade-in duration-200">
            <div className="pb-5 border-b border-gray-100">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Custom Domain Setup</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                Apna Custom Domain Lagayein (e.g. www.meridukaan.com)
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Agar aapke paas Godaddy, Namecheap ya Google se liya hua apna domain hai, to use apni IndianLalaJi website se jod sakte hain.
              </p>
            </div>

            <div className="max-w-xl space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Aapka Domain Name (Domain Name Darj Karein)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. myshopname.com"
                    className="flex-1 px-3.5 py-2.5 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      alert('Aapka custom domain request darj ho gaya hai. Humari team 24 ghante me DNS verify karke connect kar degi.');
                    }}
                    className="px-5 py-2.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-xs cursor-pointer"
                  >
                    Connect Domain
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">DNS Configuration Instructions:</div>
                <div className="font-mono text-[11px] text-gray-600 bg-white p-2.5 rounded border border-gray-200">
                  Type: CNAME | Name: www | Value: cname.indianlalaji.com<br />
                  Type: A | Name: @ | Value: 76.76.21.21
                </div>
                <div className="text-[11px] text-gray-500">
                  Domain connect karne me koi pareshani aaye to LalaJi Support WhatsApp par sampark karein.
                </div>
              </div>
            </div>
          </div>
        )}



        {/* SUPPORT & HELP CENTER VIEW */}
        {(activeNav === 'support' || activeNav === 'help') && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6 animate-in fade-in duration-200">
            <div className="pb-5 border-b border-gray-100">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>24x7 Merchant Support</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                IndianLalaJi Support & Help Center (सहायता केंद्र)
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Aapko store chalane me koi bhi pareshani ho, to humari team se seedha sampark karein.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <a
                href="https://wa.me/919876543210?text=Namaste%20IndianLalaJi%20Support!%20Mujhe%20apne%20store%20ke%20liye%20madad%20chahiye."
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-colors flex items-center gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">Direct WhatsApp Helpline</div>
                  <div className="text-xs text-emerald-800 font-bold mt-0.5">+91 98765 43210</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Average reply time: 5 minutes</div>
                </div>
              </a>

              <a
                href="tel:9876543210"
                className="p-5 rounded-2xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 transition-colors flex items-center gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">Phone Call Support</div>
                  <div className="text-xs text-orange-900 font-bold mt-0.5">10:00 AM to 8:00 PM</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Mon - Sat (Hindi & English)</div>
                </div>
              </a>
            </div>

            {/* Quick FAQs */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Aksar Poochhe Jaane Wale Sawal (FAQs)</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-slate-900">Q: WhatsApp orders seedhe mere number par aayenge?</div>
                  <div className="text-gray-600 mt-1">Haan, grahak jaise hi kisi product par click karega, wo seedhe aapke business WhatsApp number par aayega.</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-slate-900">Q: Counter Standee kaise print karein?</div>
                  <div className="text-gray-600 mt-1">Menu se 'QR Standee' par click karein aur 'Print A4 Standee' button dabayein. Regular A4 paper ya photo sheet par print kar sakte hain.</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      )}

      {/* 1. CALL ADDON */}
      {activeNav === 'addon_call' && (
        <CallAddonView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
        />
      )}

      {/* 2. WHATSAPP ADDON */}
      {activeNav === 'addon_whatsapp' && (
        <WhatsAppAddonView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
        />
      )}

      {/* 3. EMAIL ADDON */}
      {activeNav === 'addon_email' && (
        <EmailAddonView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
        />
      )}

      {/* 4. PAYMENT QR ADDON */}
      {activeNav === 'addon_payment_qr' && (
        <PaymentQrAddonView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
        />
      )}

      {/* 5. CUSTOM DOMAIN ADDON */}
      {activeNav === 'addon_custom_domain' && (
        <VendorCustomDomainManager
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          showToast={showToast}
        />
      )}

      {/* 6. THEMES & TEMPLATES ADDON */}
      {activeNav === 'addon_templates' && (
        <WebsiteThemesManager
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onPreviewShop={() => onNavigateToShop(currentShop.shopId)}
          showToast={showToast}
        />
      )}

      {/* 7. SHOP STANDEE */}
      {(activeNav === 'addon_shop_standee' || activeNav === 'standee') && (
        <ShopStandeeView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          onOpenStandeeModal={() => setShowStandeeModal(true)}
          showToast={showToast}
        />
      )}

      {/* 8. WEBSITE SWITCH (E-COMMERCE VS CATALOGUE) */}
      {activeNav === 'addon_website_switch' && (
        <WebsiteSwitchView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            handleSaveAll(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
          onNavigateToShop={() => onNavigateToShop(currentShop.shopId)}
        />
      )}

      {/* 9. MY PLAN & 1-YEAR VALIDITY */}
      {(activeNav === 'billing_plan' || activeNav === 'my-plan' || activeNav === 'profile_validity') && (
        <MyPlanView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          onNavigateTab={(tab) => handleSelectNav(tab)}
          showToast={showToast}
        />
      )}

      {/* 10. BILLING INVOICE */}
      {(activeNav === 'billing_invoice' || activeNav === 'invoices') && (
        <BillingInvoiceView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          onOpenInvoiceModal={() => setShowInvoiceModal(true)}
          showToast={showToast}
        />
      )}

      {/* 11. BILLING RENEW */}
      {activeNav === 'billing_renew' && (
        <BillingRenewView
          shop={currentShop}
          adminPaymentQrUrl={adminPaymentQrUrl}
          adminUpiId={adminUpiId}
          adminPhone={adminPhone}
          adminWhatsapp={adminWhatsapp}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
        />
      )}

      {/* 12. SUPPORT HELP */}
      {(activeNav === 'support_help' || activeNav === 'help') && (
        <SupportHelpView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
        />
      )}

      {/* 13. SUPPORT CARE */}
      {(activeNav === 'support_care' || activeNav === 'support') && (
        <SupportCareView
          shop={currentShop}
          adminPhone={adminPhone}
          adminWhatsapp={adminWhatsapp}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
        />
      )}

      {/* 14. SETTINGS BACKUP */}
      {(activeNav === 'settings_backup' || activeNav === 'settings_backups') && (
        <VendorBackupsManager
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          showToast={showToast}
        />
      )}

      {/* 15. SETTINGS STORAGE (Vendor Storage: 200 MB only) */}
      {activeNav === 'settings_storage' && (
        <StorageManagerView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
        />
      )}

      {/* 16. WEBSITE VISIBILITY VIEW */}
      {activeNav === 'profile_visibility' && (
        <WebsiteVisibilityView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            handleSaveAll(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
          onNavigateToShop={() => onNavigateToShop(currentShop.shopId)}
        />
      )}

      {/* 17. ACCOUNT SETTINGS VIEW */}
      {activeNav === 'settings_account' && (
        <AccountSettingsView
          shop={currentShop}
          onUpdateShop={(updated) => {
            setCurrentShop(updated);
            setHasUnsavedChanges(true);
            onUpdateShop(updated);
          }}
          onMarkDirty={() => setHasUnsavedChanges(true)}
          showToast={showToast}
        />
      )}

      {/* COMPACT FLOATING SAVE BUTTON (BIKUL CHOTA SA BUTTON) */}
      <div
        id="global-sticky-save-bar"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        {hasUnsavedChanges && (
          <button
            type="button"
            onClick={() => {
              setCurrentShop({ ...shop });
              setHasUnsavedChanges(false);
              showToast('Changes discard kar diye.');
            }}
            title="Discard changes"
            className="px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-gray-300 hover:text-white rounded-full text-[11px] font-semibold border border-slate-700 shadow-md backdrop-blur-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span className="hidden sm:inline">Discard</span>
          </button>
        )}

        <button
          type="button"
          id="btn-global-sticky-save"
          onClick={() => handleSaveAll()}
          disabled={isGlobalSaving}
          className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-xs cursor-pointer ${
            hasUnsavedChanges
              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/30 ring-2 ring-orange-300 active:scale-95'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-slate-950/20 active:scale-95'
          }`}
          title={hasUnsavedChanges ? 'Click to Save Changes' : 'All changes saved to live store'}
        >
          {isGlobalSaving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : hasUnsavedChanges ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saved</span>
            </>
          )}
        </button>
      </div>

        </main>
      </div>

      {/* EDIT PRODUCT / SERVICE MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8">
            <div className="px-6 py-4 bg-orange-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Edit {editProductType === 'COURSE' ? 'Course' : editProductType === 'PRODUCT' ? 'Product' : 'Service'} Details
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCancelEditProduct}
                className="p-1 hover:bg-orange-700 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Item / Service / Course Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={editProductType}
                    onChange={(e) => setEditProductType(e.target.value as ProductType)}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-bold"
                  >
                    <option value="PRODUCT">Product (Item)</option>
                    <option value="SERVICE">Service (Booking)</option>
                    <option value="COURSE">Course (Training/Batch)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editProductPrice}
                    onChange={(e) => setEditProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={editProductOriginalPrice}
                    onChange={(e) => setEditProductOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Optional MRP"
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Stock / Availability
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditProductInStock(!editProductInStock)}
                    className={`w-full py-2 px-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      editProductInStock
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editProductInStock ? 'In Stock (Available)' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>

              {/* Category & Unit in Edit Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Category (Select Karein)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickCatType(editProductType);
                        setIsQuickCatModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-orange-600 hover:text-orange-800 underline cursor-pointer"
                    >
                      + Nayi Category
                    </button>
                  </div>
                  <select
                    value={editProductCategory}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setQuickCatType(editProductType);
                        setIsQuickCatModalOpen(true);
                      } else {
                        setEditProductCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-medium text-slate-900 cursor-pointer"
                  >
                    <option value="">
                      {editAvailableCategories.length > 0
                        ? '-- Kripya Category Chunein --'
                        : '-- Pehle Category Banayein --'}
                    </option>
                    {editAvailableCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    <option value="__NEW__" className="font-bold text-orange-600 bg-orange-50">
                      + Nayi Category Banayein...
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Pack Size / Unit / Duration
                  </label>
                  <input
                    type="text"
                    value={editProductUnit}
                    onChange={(e) => setEditProductUnit(e.target.value)}
                    placeholder="e.g. 1 pc, 1 kg, Per Visit, 30 Days"
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                </div>
              </div>

              {/* Hide Price Toggle in Edit Modal */}
              <div
                onClick={() => setEditProductHidePrice(!editProductHidePrice)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                  editProductHidePrice
                    ? 'bg-amber-100/90 border-amber-500 shadow-xs ring-2 ring-amber-400/30'
                    : 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${editProductHidePrice ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span>Hide Price / कीमत छुपाएं</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        editProductHidePrice ? 'bg-amber-600 text-white' : 'bg-amber-200/90 text-amber-900'
                      }`}>
                        Price on Request
                      </span>
                      <span className={`text-[10px] font-bold ${editProductHidePrice ? 'text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded' : 'text-gray-500'}`}>
                        {editProductHidePrice ? '✓ ON (Hidden on website)' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Website par price chupa kar "Price on Request / कीमत पूछें" WhatsApp inquiry button dikhega</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={editProductHidePrice}
                    onChange={(e) => setEditProductHidePrice(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Short Description / Specifications
                </label>
                <textarea
                  rows={2}
                  value={editProductDesc}
                  onChange={(e) => setEditProductDesc(e.target.value)}
                  placeholder="Details about quality, warranty or pack size"
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Item Photo
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-100 p-1 border border-gray-300 shrink-0 overflow-hidden">
                    <img
                      src={editProductImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80'}
                      alt="Product preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-orange-50 border border-orange-300 hover:bg-orange-100 text-orange-900 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors">
                      <Upload className="w-3.5 h-3.5 text-orange-600" />
                      <span>Upload New Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const b = await fileToBase64(f);
                            setEditProductImage(b);
                          }
                        }}
                      />
                    </label>
                    <div>
                      <input
                        type="text"
                        placeholder="Or enter Image URL"
                        value={editProductImage}
                        onChange={(e) => setEditProductImage(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-sm border border-gray-300 text-[11px] bg-gray-50/50 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEditProduct}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Update Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK CATEGORY CREATOR MODAL */}
      {isQuickCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8 animate-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-orange-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  Nayi Category Banayein (Name + Image)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsQuickCatModalOpen(false);
                  setQuickCatName('');
                  setQuickCatImage('');
                }}
                className="p-1 hover:bg-orange-700 rounded-full transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickCreateCategory} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['PRODUCT', 'SERVICE', 'COURSE'] as ProductType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQuickCatType(t)}
                      className={`py-1.5 px-2 rounded-sm text-[11px] font-bold uppercase transition-all ${
                        quickCatType === t
                          ? 'bg-orange-600 text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t === 'PRODUCT' ? 'Product' : t === 'SERVICE' ? 'Service' : 'Course'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name (श्रेणी का नाम) *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    quickCatType === 'PRODUCT'
                      ? 'e.g. Dairy & Ghee, Atta & Rice, Sweets'
                      : quickCatType === 'SERVICE'
                      ? 'e.g. AC Repair, Home Cleaning, Spa'
                      : 'e.g. Spoken English, Web Dev, Yoga Coaching'
                  }
                  value={quickCatName}
                  onChange={(e) => setQuickCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Photo / Icon Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg border border-gray-300 bg-gray-100 overflow-hidden shrink-0">
                    <img
                      src={quickCatImage || (quickCatName ? getCategoryImageByName(quickCatName, quickCatType) : getCategoryImageByName('all', quickCatType))}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="url"
                      placeholder="Image URL or upload below"
                      value={quickCatImage}
                      onChange={(e) => setQuickCatImage(e.target.value)}
                      className="w-full px-2.5 py-1 rounded border border-gray-300 text-[11px] bg-white font-mono"
                    />
                    <label className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-sm text-[10px] font-bold cursor-pointer transition-colors">
                      <Upload className="w-3 h-3 text-gray-600" />
                      <span>Upload Device Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const b = await fileToBase64(f);
                            setQuickCatImage(b);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickCatModalOpen(false);
                    setQuickCatName('');
                    setQuickCatImage('');
                  }}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-sm text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-sm text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Category Banayein & Select Karein</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PAYMENT QR POPUP MODAL */}
      {showAdminQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 my-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header (Clean Light Theme) */}
            <div className="bg-white border-b border-gray-200 text-slate-900 p-5 sm:p-6 relative">
              <button
                onClick={() => setShowAdminQrModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full mb-2 border border-orange-200">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" /> Official 1-Year Store Activation
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-['Outfit',sans-serif] text-slate-900">
                Admin UPI Payment & Activation
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Admin UPI QR par ₹1,499 pay karke screenshot WhatsApp par bhejein aur store live karein.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
              
              {/* Store & Amount Summary */}
              <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded inline-block">
                    Your Store Details
                  </div>
                  <div className="font-bold text-sm text-slate-900 mt-1">
                    {currentShop.businessName} <span className="text-gray-500 font-mono text-xs">({currentShop.shopId})</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Owner: {currentShop.ownerName} • Phone: +91 {currentShop.phone}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Plan Amount</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                    ₹1,499
                  </div>
                  <div className="text-[10px] text-orange-700 font-bold">1-Year Validity</div>
                </div>
              </div>

              {/* QR Code Scan Section */}
              <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-5 border border-gray-200 text-center space-y-3 shadow-inner">
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
                  <QrCode className="w-4 h-4 text-orange-600" />
                  <span>Official Admin Payment UPI QR Code</span>
                </div>

                <div className="inline-block p-3 bg-white rounded-xl border-2 border-orange-500 shadow-md">
                  <img
                    src={adminPaymentQrUrl}
                    alt="Admin Official Payment QR Code"
                    className="w-52 h-52 sm:w-56 sm:h-56 object-contain mx-auto"
                  />
                </div>

                <p className="text-[11px] text-gray-600 font-medium">
                  Scan & Pay via <strong>Google Pay, PhonePe, Paytm, BHIM UPI</strong> or Any Banking App
                </p>
              </div>

              {/* Admin UPI ID & Copy (Clean Light Theme) */}
              <div className="p-3.5 bg-orange-50/80 text-slate-900 rounded-xl space-y-2 border border-orange-200">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>Official Admin UPI ID:</span>
                  <span className="text-orange-800 font-bold text-xs truncate max-w-[200px]">{adminAccountHolder}</span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-lg border border-gray-300">
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 select-all truncate">
                    {adminUpiId}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (adminUpiId) {
                        navigator.clipboard.writeText(adminUpiId);
                        setCopiedUpi(true);
                        setTimeout(() => setCopiedUpi(false), 2500);
                      }
                    }}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy UPI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Admin Helpline Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${adminPhone}`}
                  className="p-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl flex items-center gap-3 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-gray-500">Admin Call Helpline</div>
                    <div className="text-xs font-black text-slate-900 font-mono group-hover:text-orange-600">
                      +91 {adminPhone}
                    </div>
                  </div>
                </a>

                <a
                  href={getWhatsAppDirectUrl(
                    adminWhatsapp || adminPhone,
                    `Namaste Admin Team! Maine 1-Year Store Plan ke liye payment kar diya hai.\n\n` +
                    `*Shop ID:* ${currentShop.shopId}\n` +
                    `*Business Name:* ${currentShop.businessName}\n` +
                    `*Owner:* ${currentShop.ownerName}\n` +
                    `*Phone:* +91 ${currentShop.phone}\n` +
                    `*Amount:* ₹1,499 (1-Year Plan)\n` +
                    `*UPI ID:* ${adminUpiId}\n\n` +
                    `Kripya mera payment verify karke meri website live karein. Payment screenshot attach kiya gaya hai. Dhanyawad!`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl flex items-center gap-3 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-gray-500">Admin WhatsApp</div>
                    <div className="text-xs font-black text-slate-900 font-mono group-hover:text-emerald-600">
                      +91 {adminWhatsapp}
                    </div>
                  </div>
                </a>
              </div>

              {/* Simple Step-by-Step Instructions */}
              <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200 space-y-1.5 text-xs text-slate-800">
                <div className="font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5 text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Payment & Live Activation Process:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-700">
                  <li>Upar diye gaye QR Code ko scan karke <strong>₹1,499</strong> ka payment karein.</li>
                  <li>Payment successful hone ke baad <strong>Payment Screenshot</strong> lein.</li>
                  <li>Neeche <strong>WhatsApp Button</strong> par click karke Admin ko Screenshot aur Shop ID ({currentShop.shopId}) send karein.</li>
                  <li>Admin 5-10 minute me payment verify karke aapka store live kar dega.</li>
                </ol>
              </div>

              {/* WhatsApp Action Button */}
              <div className="pt-2">
                <a
                  href={getWhatsAppDirectUrl(
                    adminWhatsapp || adminPhone,
                    `Namaste Admin Team! Maine 1-Year Store Plan ke liye payment kar diya hai.\n\n` +
                    `*Shop ID:* ${currentShop.shopId}\n` +
                    `*Business Name:* ${currentShop.businessName}\n` +
                    `*Owner:* ${currentShop.ownerName}\n` +
                    `*Phone:* +91 ${currentShop.phone}\n` +
                    `*Amount:* ₹1,499 (1-Year Plan)\n` +
                    `*UPI ID:* ${adminUpiId}\n\n` +
                    `Kripya mera payment verify karke meri website live karein. Payment screenshot attach kiya gaya hai. Dhanyawad!`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm font-black uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Screenshot on WhatsApp (+91 {adminWhatsapp})</span>
                </a>
                <p className="text-center text-[10px] text-gray-500 mt-2">
                  Admin WhatsApp Helpline: +91 {adminWhatsapp} • Quick 10-Minute Store Activation
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 1-YEAR SUBSCRIPTION TAX INVOICE MODAL */}
      <SubscriptionInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        shop={currentShop}
      />

      {/* DUKAAN QR STANDEE & APP SCANNERS MODAL */}
      <DukaanQrStandeeModal
        shop={currentShop}
        isOpen={showStandeeModal}
        onClose={() => setShowStandeeModal(false)}
        initialTab={standeeModalTab}
      />

      {/* SHOP SHARE & SEO SOCIAL CARD MODAL */}
      <ShopShareModal
        shop={currentShop}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onOpenStandeeModal={() => {
          setStandeeModalTab('STANDEE');
          setShowStandeeModal(true);
        }}
      />

      {/* HELP CENTER & GUIDE MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-black uppercase tracking-wider font-['Outfit',sans-serif]">
                  IndianLalaJi Help Center & Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
              <div className="p-3.5 bg-orange-50 rounded-xl border border-orange-200 text-orange-950 space-y-1">
                <p className="font-bold text-sm">Aapka Digital Store Live Hai!</p>
                <p className="text-xs text-orange-900/80">
                  Neeche diye gaye guides se aap apne store ko 5 minute me customize kar sakte hain.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">1. Samaan / Products Kaise Add Karein?</h4>
                  <p className="text-gray-600">
                    Sidebar me <strong>Products</strong> par click karein. Apna item name, photo, price aur unit daalkar "Add Product" karein.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">2. Dukaan Counter Standee Print Kaise Karein?</h4>
                  <p className="text-gray-600">
                    Top header ya sidebar me <strong>QR Standee</strong> button dabayein. "Print Standee (A4)" click karke direct print nikal lein.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">3. Customer WhatsApp Orders Kaha Milenge?</h4>
                  <p className="text-gray-600">
                    Customer jab bhi order karta hai, direct aapke registered WhatsApp number (+91 {currentShop.phone}) par full order list ke sath message aata hai. Aap dashboard ke <strong>WhatsApp Orders</strong> section me bhi sabhi inquiries dekh sakte hain.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">4. Official Admin Support & Helpline</h4>
                  <p className="text-gray-600">
                    Kisi bhi technical sahayata ya payment verification ke liye hamari dedicated team se direct connect karein:
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href={getWhatsAppDirectUrl(
                        adminWhatsapp || adminPhone,
                        `Namaste Support Team! Mujhe mere store (${currentShop.businessName}) ke liye madad chahiye.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Support</span>
                    </a>
                    <a
                      href={`tel:+91${adminPhone}`}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Helpline</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

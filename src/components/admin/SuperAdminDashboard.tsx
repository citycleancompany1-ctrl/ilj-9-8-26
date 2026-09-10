import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Store, 
  Users, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  Tag, 
  Video, 
  Sliders, 
  Search, 
  LogOut, 
  Filter, 
  Sparkles, 
  Megaphone, 
  Power, 
  Calendar,
  ExternalLink,
  PhoneCall,
  Save,
  Upload,
  QrCode,
  Key,
  Copy,
  Check,
  EyeOff,
  X,
  Image,
  Globe,
  Mail,
  Building,
  Info,
  Settings,
  FileText,
  Receipt,
  Link2,
  Download,
  Menu
} from 'lucide-react';
import { Shop, AdvertisementPopup, PricingPackage, TutorialVideo, PlatformLead, PlatformState } from '../../types';
import { fileToBase64, formatINR, generateShopId, getWhatsAppDirectUrl, getYouTubeEmbedUrl, getYouTubeThumbnail, formatDisplayDate, calculateDaysRemaining, getOneYearExpiryDate } from '../../utils/mediaUpload';
import { BUSINESS_CATEGORIES } from '../../data/initialData';
import { generateSecurePassword, hashPassword } from '../../utils/security';
import { deleteShopFromFirestore, savePlatformConfigToFirestore, saveShopToFirestore } from '../../services/firebase';
import { VideoPlayerCard } from '../common/VideoPlayerCard';
import { SubscriptionInvoiceModal } from '../modals/SubscriptionInvoiceModal';
import { AdminBillingManager } from './AdminBillingManager';
import { AdminSectionsManager } from './AdminSectionsManager';
import { AddWebsiteModal } from './AddWebsiteModal';
import { ConnectWebsiteModal } from './ConnectWebsiteModal';
import { DataExportManager } from './DataExportManager';
import { VendorDataExportModal } from './VendorDataExportModal';
import { AdminDomainManagement } from './AdminDomainManagement';
import { AdminSidebar, AdminTabKey } from './AdminSidebar';

interface SuperAdminDashboardProps {
  state: PlatformState;
  onUpdateState: (newState: PlatformState) => void;
  onLogout: () => void;
  onNavigateToShop: (shopId: string) => void;
  onNavigateHome?: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  state,
  onUpdateState,
  onLogout,
  onNavigateToShop,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabKey>('SHOPS');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Website Add & Connect Modals
  const [showAddShopModal, setShowAddShopModal] = useState(false);
  const [connectingDomainShop, setConnectingDomainShop] = useState<Shop | null>(null);
  const [exportingVendorShop, setExportingVendorShop] = useState<Shop | null>(null);
  
  // Filtering states for shops
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [monthFilter, setMonthFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('2026');

  // Popup creation / edit modal state
  const [editingPopup, setEditingPopup] = useState<AdvertisementPopup | null>(null);
  const [showPopupModal, setShowPopupModal] = useState(false);

  // Shop editing modal
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [showPasswordInEdit, setShowPasswordInEdit] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // 1-Year Subscription Tax Invoice viewing state
  const [viewingInvoiceShop, setViewingInvoiceShop] = useState<Shop | null>(null);

  // Vendor deletion confirmation modal state (bypasses window.confirm in iframe)
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);

  // Platform Settings local form state
  const [settingsForm, setSettingsForm] = useState({
    customerCarePhone: state.customerCarePhone || '7087033009',
    customerCareWhatsapp: state.customerCareWhatsapp || '7087033009',
    customerCareEmail: state.customerCareEmail || 'info@indianlalaji.com',
    supportHours: state.supportHours || 'Monday - Saturday 9:00 AM - 8:00 PM',
    adminPaymentQrUrl: state.adminPaymentQrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=upi://pay?pa=7087033009@paytm&pn=IndianLalaJi%20Official&cu=INR',
    adminUpiId: state.adminUpiId || '7087033009@paytm',
    adminAccountHolder: state.adminAccountHolder || 'IndianLalaJi Platform (R. K. Mehra)',
    platformHeroHeading: state.platformHeroHeading || 'LAUNCH YOUR WEBSITE IN 2 MINUTES.',
    platformHeroSubheading: state.platformHeroSubheading || 'Build a professional digital storefront directly from your mobile phone. Simple, fast, and modern. Accept direct WhatsApp orders, collect direct UPI payments, and get your own unique Shop ID.',
    platformAboutStory: state.platformAboutStory || 'IndianLalaJi.com is built specifically for local merchants and growing businesses. We empower retailers with a mobile-friendly store creator where you can upload product photos, set prices, display direct UPI payment QR codes, and take your business digital in 2 minutes.',
    platformAboutPhotos: state.platformAboutPhotos || [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&auto=format&fit=crop&q=80',
    ],
  });

  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // 1 Master Plan state
  const currentPlan = state.pricingPackages[0] || {
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

  const [planForm, setPlanForm] = useState<PricingPackage>(currentPlan);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleSaveMasterPlan = () => {
    const updatedPkgs = [planForm];
    onUpdateState({ ...state, pricingPackages: updatedPkgs });
    savePlatformConfigToFirestore({ pricingPackages: updatedPkgs });
    showToast('1-Year Master Plan & Feature list successfully saved and synced across all pages!');
  };

  // Calculations for KPI Cards
  const totalVendors = state.shops.length;
  const publishedCount = state.shops.filter((s) => s.status === 'PUBLISHED').length;
  const pendingCount = state.shops.filter((s) => s.status === 'PENDING_APPROVAL').length;
  const holdCount = state.shops.filter((s) => s.status === 'HOLD').length;
  const totalViews = state.shops.reduce((acc, s) => acc + (s.viewsCount || 0), 12500);

  // Filtered shops list
  const filteredShops = state.shops.filter((shop) => {
    const matchesStatus = statusFilter === 'ALL' || shop.status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      shop.businessName.toLowerCase().includes(query) ||
      shop.vendorName.toLowerCase().includes(query) ||
      shop.shopId.toLowerCase().includes(query) ||
      shop.phone.includes(query);

    return matchesStatus && matchesSearch;
  });

  // Shop Status Handlers
  const handleUpdateShopStatus = (shopId: string, newStatus: Shop['status']) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedShops = state.shops.map((s) => {
      if (s.shopId === shopId) {
        let updatedInvoices = s.invoices;
        if (newStatus === 'PUBLISHED' && s.invoices && s.invoices.length > 0) {
          updatedInvoices = s.invoices.map((inv) => ({
            ...inv,
            paymentStatus: 'PAID' as const,
            paidAt: inv.paidAt || new Date().toISOString(),
          }));
        }
        const updated: Shop = {
          ...s,
          status: newStatus,
          invoices: updatedInvoices,
          activeDate: (newStatus === 'PUBLISHED' && !s.activeDate) ? todayStr : s.activeDate,
          updatedAt: new Date().toISOString(),
        };
        saveShopToFirestore(updated);
        return updated;
      }
      return s;
    });
    onUpdateState({ ...state, shops: updatedShops });
    if (newStatus === 'PUBLISHED') {
      showToast(`✅ Payment Verified! Store status is now PUBLISHED & LIVE.`);
    } else {
      showToast(`Store status updated to ${newStatus}`);
    }
  };

  const handleVerifyPaymentAndPublish = (shop: Shop) => {
    handleUpdateShopStatus(shop.shopId, 'PUBLISHED');
  };

  const handleToggleFeatured = (shopId: string) => {
    const updatedShops = state.shops.map((s) => {
      if (s.shopId === shopId) {
        const updated = { ...s, isFeaturedInShowcase: !s.isFeaturedInShowcase, updatedAt: new Date().toISOString() };
        saveShopToFirestore(updated);
        return updated;
      }
      return s;
    });
    onUpdateState({ ...state, shops: updatedShops });
    showToast(`Featured showcase status changed.`);
  };

  const handleSaveEditedShop = async (shopToSave: Shop) => {
    await saveShopToFirestore(shopToSave);
    const updatedShops = state.shops.map((s) => (s.shopId === shopToSave.shopId || s.id === shopToSave.id ? shopToSave : s));
    onUpdateState({ ...state, shops: updatedShops });
    showToast(`Dukaan (${shopToSave.businessName}) details update ho gaye!`);
  };

  // Reliable deletion handler (executes after modal confirm)
  const handleConfirmDeleteShop = () => {
    if (!shopToDelete) return;
    const targetShop = shopToDelete;
    deleteShopFromFirestore(targetShop.shopId);
    if (targetShop.id && targetShop.id !== targetShop.shopId) {
      deleteShopFromFirestore(targetShop.id);
    }
    const updatedShops = state.shops.filter((s) => s.shopId !== targetShop.shopId && s.id !== targetShop.id);
    onUpdateState({ ...state, shops: updatedShops });
    setShopToDelete(null);
    showToast(`Dukaan (${targetShop.businessName} - ${targetShop.shopId}) delete ho chuki hai!`);
  };

  // Global Popup Toggle Handler
  const handleToggleGlobalPopup = () => {
    const updated = !state.globalPopupEnabled;
    onUpdateState({ ...state, globalPopupEnabled: updated });
    savePlatformConfigToFirestore({ globalPopupEnabled: updated });
    showToast(`Global advertisement popup is now ${updated ? 'Active' : 'Disabled'}.`);
  };

  // Popup Management Handlers
  const handleSavePopup = (popup: AdvertisementPopup) => {
    let updatedPopups: AdvertisementPopup[];
    const exists = state.popups.some((p) => p.id === popup.id);
    if (exists) {
      updatedPopups = state.popups.map((p) => (p.id === popup.id ? popup : p));
    } else {
      updatedPopups = [popup, ...state.popups];
    }
    onUpdateState({ ...state, popups: updatedPopups });
    savePlatformConfigToFirestore({ popups: updatedPopups });
    setShowPopupModal(false);
    setEditingPopup(null);
    showToast('Popup successfully saved.');
  };

  const handleDeletePopup = (popupId: string) => {
    const updatedPopups = state.popups.filter((p) => p.id !== popupId);
    onUpdateState({ ...state, popups: updatedPopups });
    savePlatformConfigToFirestore({ popups: updatedPopups });
    showToast('Popup removed.');
  };

  const handleTogglePopupEnable = (popupId: string) => {
    const updatedPopups = state.popups.map((p) =>
      p.id === popupId ? { ...p, isEnabled: !p.isEnabled } : p
    );
    onUpdateState({ ...state, popups: updatedPopups });
    savePlatformConfigToFirestore({ popups: updatedPopups });
  };

  // Pricing Package price updater
  const handleUpdatePackagePrice = (pkgId: string, newPrice: number) => {
    const updatedPkgs = state.pricingPackages.map((p) =>
      p.id === pkgId ? { ...p, price: newPrice } : p
    );
    onUpdateState({ ...state, pricingPackages: updatedPkgs });
    savePlatformConfigToFirestore({ pricingPackages: updatedPkgs });
  };

  // Platform Settings Save Handler
  const handleSavePlatformSettings = () => {
    const newState: PlatformState = {
      ...state,
      customerCarePhone: settingsForm.customerCarePhone.trim(),
      customerCareWhatsapp: settingsForm.customerCareWhatsapp.trim(),
      customerCareEmail: settingsForm.customerCareEmail.trim(),
      supportHours: settingsForm.supportHours.trim(),
      adminPaymentQrUrl: settingsForm.adminPaymentQrUrl.trim(),
      adminUpiId: settingsForm.adminUpiId.trim(),
      adminAccountHolder: settingsForm.adminAccountHolder.trim(),
      platformHeroHeading: settingsForm.platformHeroHeading.trim(),
      platformHeroSubheading: settingsForm.platformHeroSubheading.trim(),
      platformAboutStory: settingsForm.platformAboutStory.trim(),
      platformAboutPhotos: settingsForm.platformAboutPhotos,
    };

    onUpdateState(newState);
    savePlatformConfigToFirestore(newState);
    showToast('Platform & Homepage settings successfully updated and synced across all devices!');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-slate-900 font-sans">
      
      {/* 1. Super Admin Dedicated Left Sidebar (Desktop: 270px, Mobile: Slide-in Drawer) */}
      <AdminSidebar
        state={state}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={onLogout}
        onOpenAddWebsite={() => setShowAddShopModal(true)}
        onToggleGlobalPopup={handleToggleGlobalPopup}
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Sticky Top Header Bar with Mobile Hamburger, Breadcrumbs & Quick Actions */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            
            {/* Left: Mobile Hamburger & Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                id="admin-mobile-hamburger-btn"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 -ml-1 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                aria-label="Open admin sidebar menu"
              >
                <Menu className="w-5 h-5 text-slate-800" />
              </button>

              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <span className="font-black text-xs sm:text-sm tracking-tight text-slate-900 font-['Outfit',sans-serif] uppercase truncate flex items-center gap-1.5">
                  <span className="text-orange-600 font-extrabold">INDIANLALAJI</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-slate-600 font-semibold hidden sm:inline">Super Admin</span>
                  <span className="text-gray-300 hidden sm:inline">/</span>
                  <span className="text-slate-950 truncate font-black">
                    {activeTab === 'SHOPS' && 'Vendors & Stores'}
                    {activeTab === 'DOMAINS' && 'Custom Domains & DNS'}
                    {activeTab === 'DATA_EXPORT' && 'Data Export Hub'}
                    {activeTab === 'BILLING' && 'Billing & Website Earnings'}
                    {activeTab === 'SECTIONS' && 'Website Sections'}
                    {activeTab === 'POPUPS' && 'Advertisement Popups'}
                    {activeTab === 'PRICING' && '1-Year Pricing Packages'}
                    {activeTab === 'VIDEOS' && 'Homepage Video Guides'}
                    {activeTab === 'LEADS' && 'Platform Inquiries & Leads'}
                    {activeTab === 'PLATFORM_SETTINGS' && 'Platform Settings'}
                  </span>
                </span>

                <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 shrink-0">
                  MASTER CONTROL
                </span>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Add Store Button */}
              <button
                onClick={() => setShowAddShopModal(true)}
                className="hidden sm:flex px-3 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg text-xs font-black uppercase tracking-wider items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Store</span>
              </button>

              {/* Quick Export Data Hub Shortcut */}
              <button
                onClick={() => setActiveTab('DATA_EXPORT')}
                className={`hidden md:flex px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all items-center gap-1.5 cursor-pointer ${
                  activeTab === 'DATA_EXPORT'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200'
                }`}
                title="Pure Portal, All Vendors & Specific Vendor Data Download Hub"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Hub</span>
              </button>

              {/* Global Popup Master ON/OFF Switch */}
              <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                <span className="hidden xl:inline text-[11px] font-bold uppercase tracking-wider text-slate-700">POPUP:</span>
                <button
                  id="global-popup-toggle-btn"
                  onClick={handleToggleGlobalPopup}
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                    state.globalPopupEnabled
                      ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                      : 'bg-red-600 text-white shadow-xs hover:bg-red-700'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{state.globalPopupEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Exit Admin */}
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 border border-gray-200 cursor-pointer"
                title="Exit Super Admin Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>

          </div>
        </header>

        {/* Dashboard Main Workspace Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">

      {/* KPI METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Vendors</span>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">{totalVendors}</div>
          <div className="text-[11px] text-gray-500">Registered shops</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-['Outfit',sans-serif]">{publishedCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium">Live public URLs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-orange-200 bg-orange-50/30 shadow-xs">
          <div className="flex items-center justify-between text-orange-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-orange-600 animate-spin" />
          </div>
          <div className="text-2xl font-black text-orange-900 font-['Outfit',sans-serif]">{pendingCount}</div>
          <div className="text-[11px] text-orange-800 font-medium">Awaiting approval</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">On Hold / Draft</span>
            <AlertCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">{holdCount + (totalVendors - publishedCount - pendingCount - holdCount)}</div>
          <div className="text-[11px] text-gray-500">Not live yet</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Views</span>
            <Eye className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">{(totalViews).toLocaleString()}</div>
          <div className="text-[11px] text-gray-500">Live catalogue hits</div>
        </div>

      </div>

      {/* Admin Module Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'SHOPS', label: 'Vendors & Stores Management', icon: Store, count: state.shops.length },
          { id: 'DOMAINS', label: '🌐 Custom Domains & DNS Mapping', icon: Globe, count: state.shops.filter(s => Boolean(s.customDomain)).length },
          { id: 'DATA_EXPORT', label: '📥 Data Export & Backups (Pure Portal / All Shops / Specific Vendor)', icon: Download },
          { id: 'BILLING', label: 'Billing & Website Earnings (Day/Month/Year)', icon: Receipt },
          { id: 'SECTIONS', label: 'Website Sections (ON / OFF)', icon: Sliders },
          { id: 'POPUPS', label: 'Advertisement Popups Engine', icon: Megaphone, count: state.popups.length },
          { id: 'PRICING', label: '1-Year Pricing Packages', icon: Tag },
          { id: 'VIDEOS', label: 'Homepage Video Guides (4 Videos)', icon: Video },
          { id: 'LEADS', label: 'Platform Inquiries & Leads', icon: Users, count: state.platformLeads.length },
          { id: 'PLATFORM_SETTINGS', label: 'Homepage & Admin Controls (QR, Phone, About, Photos)', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-sm text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SHOPS & VENDORS MANAGEMENT */}
      {activeTab === 'SHOPS' && (
        <div className="space-y-6">
          
          {/* Filters Bar: Date / Month / Year / Status / Search / + Add Website */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by shop name, owner, phone or SHP ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-sm border border-gray-200 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
              />
            </div>

            {/* Status & Date Filters + Add New Website Button */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-sm border border-gray-200 text-xs font-bold bg-white focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">All Statuses ({state.shops.length})</option>
                <option value="PENDING_APPROVAL">Pending Review ({pendingCount})</option>
                <option value="PUBLISHED">Published Live ({publishedCount})</option>
                <option value="HOLD">On Hold ({holdCount})</option>
                <option value="DRAFT">Draft</option>
              </select>

              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="px-3 py-2 rounded-sm border border-gray-200 text-xs font-bold bg-white"
              >
                <option value="ALL">All Months</option>
                <option value="09">September</option>
                <option value="08">August</option>
                <option value="07">July</option>
                <option value="06">June</option>
              </select>

              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-2 rounded-sm border border-gray-200 text-xs font-bold bg-white"
              >
                <option value="2027">2027</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>

              {/* + ADD NEW WEBSITE / DUKAAN BUTTON */}
              <button
                id="admin-add-website-btn"
                onClick={() => setShowAddShopModal(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider rounded-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Website</span>
              </button>
            </div>

          </div>

          {/* Vendors Table / Cards */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-gray-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Shop ID & Business</th>
                    <th className="py-3.5 px-4">Owner & Contact</th>
                    <th className="py-3.5 px-4">Category & City</th>
                    <th className="py-3.5 px-4">Purchased Price & Plan</th>
                    <th className="py-3.5 px-4">1-Yr Subscription (Active / Expiry)</th>
                    <th className="py-3.5 px-4">Status & Security</th>
                    <th className="py-3.5 px-4">Showcase</th>
                    <th className="py-3.5 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredShops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-orange-50/40 transition-colors">
                      
                      {/* Shop Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={shop.logoUrl}
                            alt={shop.businessName}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-gray-50 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{shop.businessName}</span>
                            </div>
                            <div className="font-mono text-[11px] font-bold text-orange-600">
                              {shop.shopId}
                            </div>
                            {shop.customDomain && (
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-mono">
                                  <Globe className="w-3 h-3 text-emerald-600" />
                                  <span>{shop.customDomain}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Owner & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{shop.vendorName}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <PhoneCall className="w-3 h-3 text-gray-400" />
                          <span>+91 {shop.phone}</span>
                        </div>
                      </td>

                      {/* Category & City */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 truncate max-w-[150px]">{shop.category}</div>
                        <div className="text-[11px] text-gray-400">{shop.city}, {shop.state}</div>
                      </td>

                      {/* Purchased Price & Plan */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-1">
                            <span className="font-mono font-black text-sm text-slate-900">
                              {formatINR(shop.planPrice ?? 1499)}
                            </span>
                            <span className="text-[10px] text-gray-500 font-semibold">/ yr</span>
                          </div>
                          <div className="text-[10px] truncate max-w-[130px] text-gray-500 font-medium" title={shop.planName || '1-Year Official LalaJi Store Plan'}>
                            {shop.planName || '1-Year Official Plan'}
                          </div>
                          <div>
                            {(() => {
                              const activeOfficialRate = state.pricingPackages?.[0]?.price ?? 1499;
                              const boughtRate = shop.planPrice ?? 1499;
                              if (boughtRate === activeOfficialRate) {
                                return (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                    Current Rate
                                  </span>
                                );
                              } else if (boughtRate < activeOfficialRate) {
                                return (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded" title={`Customer purchased at ₹${boughtRate}. Current platform rate is ₹${activeOfficialRate}.`}>
                                    Old Rate (₹{boughtRate})
                                  </span>
                                );
                              } else {
                                return (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded" title={`Customer purchased at ₹${boughtRate}. Current platform rate is ₹${activeOfficialRate}.`}>
                                    Custom / High Rate (₹{boughtRate})
                                  </span>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </td>

                      {/* 1-Yr Subscription & Active / Expiry Dates */}
                      <td className="py-3.5 px-4">
                        {(() => {
                          const activeDateVal = shop.activeDate || shop.createdAt?.split('T')[0] || '2026-08-01';
                          const expiryDateVal = shop.expiryDate || getOneYearExpiryDate(activeDateVal);
                          const daysLeft = calculateDaysRemaining(expiryDateVal);
                          const isExpired = daysLeft <= 0;
                          const isExpiringSoon = daysLeft <= 30;

                          return (
                            <div className="space-y-1">
                              <div className="flex flex-col text-[11px] font-mono font-bold text-slate-800">
                                <span className="text-gray-500 font-sans text-[10px]">Active: <strong className="text-slate-900 font-mono">{formatDisplayDate(activeDateVal)}</strong></span>
                                <span className="text-orange-700 font-sans text-[10px]">Expiry: <strong className="text-orange-950 font-mono">{formatDisplayDate(expiryDateVal)}</strong></span>
                              </div>
                              <div>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                                  isExpired 
                                    ? 'bg-red-100 text-red-800 border border-red-200' 
                                    : isExpiringSoon 
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                }`}>
                                  {isExpired ? '🔴 Expired' : `🟢 ${daysLeft} Days Left`}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Status & Security Badge */}
                      <td className="py-3.5 px-4">
                        <select
                          value={shop.status}
                          onChange={(e) => handleUpdateShopStatus(shop.shopId, e.target.value as any)}
                          className={`w-full px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider border ${
                            shop.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : shop.status === 'PENDING_APPROVAL'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : shop.status === 'HOLD'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : shop.status === 'DRAFT'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : 'bg-gray-100 text-slate-700 border-gray-300'
                          }`}
                        >
                          <option value="DRAFT">📝 DRAFT (Verification Pending)</option>
                          <option value="PENDING_APPROVAL">🟡 PENDING APPROVAL</option>
                          <option value="PUBLISHED">🟢 PUBLISHED (Active)</option>
                          <option value="HOLD">🔵 ON HOLD</option>
                          <option value="REJECTED">🔴 REJECTED</option>
                        </select>
                        {(shop.status === 'DRAFT' || shop.status === 'PENDING_APPROVAL') && (
                          <button
                            type="button"
                            onClick={() => handleVerifyPaymentAndPublish(shop)}
                            className="mt-1.5 w-full inline-flex items-center justify-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-black uppercase tracking-wider shadow-xs cursor-pointer transition-all"
                            title="Verify payment and publish this store immediately"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verify & Publish</span>
                          </button>
                        )}
                      </td>

                      {/* Toggle Showcase on Live Stores */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleFeatured(shop.shopId)}
                          className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                            shop.isFeaturedInShowcase
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {shop.isFeaturedInShowcase ? '★ Featured' : '+ Feature'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setExportingVendorShop(shop)}
                            className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                            title="Download / Export This Vendor Data (JSON / Products CSV / Dossier)"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setViewingInvoiceShop(shop)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-sm"
                            title="View 1-Year Tax Invoice & Receipt"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setConnectingDomainShop(shop)}
                            className={`p-1.5 rounded-sm transition-colors ${
                              shop.customDomain
                                ? 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
                                : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                            }`}
                            title={shop.customDomain ? `Connected Domain: ${shop.customDomain} (Click to Edit)` : "Connect Website / Custom Domain"}
                          >
                            <Globe className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onNavigateToShop(shop.shopId)}
                            className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-sm"
                            title="Preview Storefront"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => setEditingShop(shop)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-sm"
                            title="Edit Vendor Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setShopToDelete(shop)}
                            className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-sm"
                            title="Delete Shop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB: CUSTOM DOMAINS & DNS MANAGEMENT */}
      {activeTab === 'DOMAINS' && (
        <AdminDomainManagement
          state={state}
          onUpdateState={onUpdateState}
          showToast={showToast}
          onNavigateToShop={onNavigateToShop}
        />
      )}

      {/* TAB: DATA EXPORT & BACKUPS (PURE PORTAL / ALL SHOPS / SPECIFIC VENDOR) */}
      {activeTab === 'DATA_EXPORT' && (
        <DataExportManager
          state={state}
          onNavigateToShop={onNavigateToShop}
        />
      )}

      {/* TAB: BILLING & WEBSITE EARNINGS (DAY / MONTH / YEAR FILTERS) */}
      {activeTab === 'BILLING' && (
        <AdminBillingManager
          state={state}
          onUpdateState={onUpdateState}
          onViewInvoice={(shop) => setViewingInvoiceShop(shop)}
          showToast={showToast}
        />
      )}

      {/* TAB: WEBSITE SECTIONS (ON / OFF) */}
      {activeTab === 'SECTIONS' && (
        <AdminSectionsManager
          state={state}
          onUpdateState={onUpdateState}
          showToast={showToast}
        />
      )}

      {/* TAB 2: ADVERTISEMENT POPUP ENGINE (STEP 30 - STEP 33) */}
      {activeTab === 'POPUPS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">Advertisement Popups Engine</h2>
                <span className="text-xs bg-orange-100 text-orange-800 font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                  STEP 30–33 SPEC
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Popups sirf <strong>PUBLISHED</strong> websites par display hote hain (never on Draft/Pending).
              </p>
            </div>

            <button
              onClick={() => {
                setEditingPopup({
                  id: `pop_${Date.now()}`,
                  title: 'Special Promotion Offer',
                  description: 'Claim exclusive discount on WhatsApp orders today!',
                  imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
                  buttonText: 'Order on WhatsApp',
                  buttonUrl: 'https://wa.me/917087033009',
                  startDate: '2026-08-01',
                  endDate: '2026-12-31',
                  frequency: 'ONCE_PER_SESSION',
                  targetType: 'ALL_PUBLISHED',
                  targetCategories: [],
                  targetShopIds: [],
                  isEnabled: true,
                });
                setShowPopupModal(true);
              }}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Popup</span>
            </button>
          </div>

          {/* Popups List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.popups.map((popup) => (
              <div
                key={popup.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-gray-100">
                    <img
                      src={popup.imageUrl}
                      alt={popup.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-wider ${
                        popup.isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-gray-300'
                      }`}>
                        {popup.isEnabled ? 'ENABLED 🟢' : 'DISABLED 🔴'}
                      </span>
                      <span className="bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm backdrop-blur-xs">
                        {popup.frequency}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                      Target: {popup.targetType}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{popup.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{popup.description}</p>
                    
                    <div className="pt-2 text-[11px] text-gray-500 flex items-center gap-4">
                      <span>Start: {popup.startDate}</span>
                      <span>End: {popup.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => handleTogglePopupEnable(popup.id)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider ${
                      popup.isEnabled ? 'bg-gray-200 text-slate-800 hover:bg-gray-300' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {popup.isEnabled ? 'Disable Popup' : 'Enable Popup'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPopup(popup);
                        setShowPopupModal(true);
                      }}
                      className="p-1.5 text-slate-600 hover:text-blue-700 rounded-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePopup(popup.id)}
                      className="p-1.5 text-gray-400 hover:text-red-700 rounded-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: 1-YEAR MASTER PRICING PLAN & FEATURE LIST */}
      {activeTab === 'PRICING' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
                  1-Year Store Plan & Feature List Studio
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Aap yahan se 1-Year Master Plan ka Price, MRP, Validity aur Feature List real-time change kar sakte hain. Changes homepage aur registration modals par turant live ho jayenge.
              </p>
            </div>

            <button
              onClick={handleSaveMasterPlan}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 shadow-md transition-colors shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save 1-Year Plan Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Plan Settings (Price, MRP, Title, Validity) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>Plan Details & Pricing</span>
                <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">1-Year Validity</span>
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Plan Name / Title
                </label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-sm font-bold"
                  placeholder="e.g. 1-Year Official LalaJi Store Plan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Selling Price (₹ / Year)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={planForm.price}
                      onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 rounded-sm border border-gray-300 text-base font-black font-['Outfit',sans-serif] text-orange-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Original MRP (₹ / Year)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={planForm.originalPrice}
                      onChange={(e) => setPlanForm({ ...planForm, originalPrice: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 rounded-sm border border-gray-300 text-base font-bold font-['Outfit',sans-serif] text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Pricing & Historical Price Guarantee Policy */}
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Dynamic Pricing & Historical Price Lock</span>
                </div>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  ✓ <strong>Naye Vendors (New Registrations):</strong> Price update karne ke baad naye registration aur plan buy iss naye rate <strong>(₹{planForm.price})</strong> pe honge, aur unke invoice me yeh new price generate hoga.
                </p>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  ✓ <strong>Purane Customers (Historical Vendors):</strong> Jinhone pehle buy kiya tha, unke invoice aur subscription me vahi original rate locked rahega jo khareedne ke waqt tha.
                </p>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  ✓ <strong>Super Admin Transparency:</strong> Dashboard table me har vendor ke saamne uska exact purchased rate aur badge (Current Rate vs Old Rate) dikhta hai.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Validity Period Text
                </label>
                <input
                  type="text"
                  value={planForm.period}
                  onChange={(e) => setPlanForm({ ...planForm, period: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-semibold"
                  placeholder="Per Year (1 Year Validity - 365 Days)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={planForm.badge || ''}
                  onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-bold text-orange-700 bg-orange-50/50"
                  placeholder="e.g. 1-YEAR ALL-IN-ONE PLAN 🇮🇳"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                  placeholder="Brief summary of what the vendor receives..."
                />
              </div>

            </div>

            {/* Right: Feature List Studio (Add, Remove, Edit) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Feature List ({planForm.features.length} Features)
                </h3>
                <span className="text-[10px] text-gray-500">Live on Store Purchase & Homepage</span>
              </div>

              {/* Add New Feature Item */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newFeatureInput.trim()) {
                      e.preventDefault();
                      setPlanForm({
                        ...planForm,
                        features: [...planForm.features, newFeatureInput.trim()],
                      });
                      setNewFeatureInput('');
                    }
                  }}
                  placeholder="Type new feature (e.g. 500 WhatsApp SMS Credits)..."
                  className="flex-1 px-3 py-2 rounded-sm border border-gray-300 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newFeatureInput.trim()) {
                      setPlanForm({
                        ...planForm,
                        features: [...planForm.features, newFeatureInput.trim()],
                      });
                      setNewFeatureInput('');
                    }
                  }}
                  className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-orange-400" />
                  <span>Add Feature</span>
                </button>
              </div>

              {/* Feature items scrollable list */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {planForm.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2 group hover:bg-orange-50/40 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const updated = [...planForm.features];
                        updated[idx] = e.target.value;
                        setPlanForm({ ...planForm, features: updated });
                      }}
                      className="flex-1 bg-transparent border-none text-xs font-medium text-slate-800 focus:outline-none focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = planForm.features.filter((_, i) => i !== idx);
                        setPlanForm({ ...planForm, features: updated });
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors opacity-80 group-hover:opacity-100"
                      title="Remove feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  Tip: Edit any feature line directly or press Delete to remove.
                </span>
                <button
                  onClick={handleSaveMasterPlan}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Plan</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 4: VIDEOS TUTORIALS (4 Videos) */}
      {activeTab === 'VIDEOS' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">Homepage & Tutorial Videos Setup</h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure 4 YouTube video tutorials to guide vendors on creating their stores. Videos play seamlessly across all devices.
              </p>
            </div>
            <button
              onClick={() => {
                savePlatformConfigToFirestore({ tutorialVideos: state.tutorialVideos });
                showToast('Tutorial videos successfully saved to cloud!');
              }}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save Videos to Cloud</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.tutorialVideos.map((vid, idx) => (
              <div key={vid.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded">
                      Video #{idx + 1}
                    </span>
                    <span className="text-xs text-gray-400 font-mono font-bold">{vid.duration}</span>
                  </div>

                  {/* Interactive Video Preview Card */}
                  <div className="w-full">
                    <VideoPlayerCard
                      id={vid.id}
                      title={vid.title}
                      youtubeUrl={vid.youtubeUrl}
                      duration={vid.duration}
                      description={vid.description}
                      badge={`Tutorial #${idx + 1}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Video Title</label>
                    <input
                      type="text"
                      value={vid.title}
                      onChange={(e) => {
                        const updated = state.tutorialVideos.map((v) =>
                          v.id === vid.id ? { ...v, title: e.target.value } : v
                        );
                        onUpdateState({ ...state, tutorialVideos: updated });
                      }}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Duration (e.g., 2:30)</label>
                      <input
                        type="text"
                        value={vid.duration}
                        onChange={(e) => {
                          const updated = state.tutorialVideos.map((v) =>
                            v.id === vid.id ? { ...v, duration: e.target.value } : v
                          );
                          onUpdateState({ ...state, tutorialVideos: updated });
                        }}
                        className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">YouTube URL or ID</label>
                      <input
                        type="text"
                        value={vid.youtubeUrl}
                        onChange={(e) => {
                          const updated = state.tutorialVideos.map((v) =>
                            v.id === vid.id ? { ...v, youtubeUrl: e.target.value } : v
                          );
                          onUpdateState({ ...state, tutorialVideos: updated });
                        }}
                        className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-mono"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Description / Summary</label>
                    <textarea
                      rows={2}
                      value={vid.description}
                      onChange={(e) => {
                        const updated = state.tutorialVideos.map((v) =>
                          v.id === vid.id ? { ...v, description: e.target.value } : v
                        );
                        onUpdateState({ ...state, tutorialVideos: updated });
                      }}
                      className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PLATFORM LEADS & INQUIRIES */}
      {activeTab === 'LEADS' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">Platform Contact Submissions & Leads</h2>
            <p className="text-xs text-gray-500 mt-1">Users requesting callback or store setup assistance from IndianLalaJi.com</p>
          </div>

          <div className="space-y-3">
            {state.platformLeads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{lead.name}</span>
                    <span className="text-xs text-orange-700 font-semibold uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-sm">{lead.businessCategory}</span>
                    <span className="text-[10px] text-gray-400">{lead.city}</span>
                  </div>
                  <p className="text-xs text-gray-600">"{lead.message}"</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${lead.phone}`}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-gray-600" />
                    <span>{lead.phone}</span>
                  </a>
                  <a
                    href={getWhatsAppDirectUrl(lead.phone, 'Namaste IndianLalaJi')}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PLATFORM & HOMEPAGE MASTER SETTINGS */}
      {activeTab === 'PLATFORM_SETTINGS' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-sm mb-1">
                <Globe className="w-3 h-3" /> Master Platform Configuration
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                Admin, Homepage & Payment QR Settings
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage official support phone, WhatsApp, payment QR photo, UPI ID, homepage headline, About Us story and gallery photos.
              </p>
            </div>

            <button
              onClick={handleSavePlatformSettings}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings to Cloud</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Section 1: Customer Care & Admin Contact */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-slate-900 border-b border-gray-100 pb-3">
                <PhoneCall className="w-4 h-4 text-orange-600" />
                <span>Admin Support & Contact Numbers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Customer Care Phone Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.customerCarePhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, customerCarePhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-bold"
                    placeholder="7087033009"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Customer Care WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.customerCareWhatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, customerCareWhatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-bold text-emerald-700"
                    placeholder="7087033009"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Official Support Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.customerCareEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, customerCareEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                    placeholder="info@indianlalaji.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Support Working Hours
                  </label>
                  <input
                    type="text"
                    value={settingsForm.supportHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportHours: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                    placeholder="Monday - Friday 10:00 AM - 5:00 PM"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Official Payment QR & UPI ID */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-slate-900 border-b border-gray-100 pb-3">
                <QrCode className="w-4 h-4 text-orange-600" />
                <span>Official Admin Payment QR & UPI ID</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Admin Official UPI ID
                  </label>
                  <input
                    type="text"
                    value={settingsForm.adminUpiId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminUpiId: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-mono font-bold"
                    placeholder="7087033009@paytm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.adminAccountHolder}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminAccountHolder: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-bold"
                    placeholder="IndianLalaJi Platform (R. K. Mehra)"
                  />
                </div>
              </div>

              {/* QR Code Photo Upload / URL */}
              <div className="space-y-3 pt-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  Payment QR Code Photo (Shown on 1-Package Order Modal & Homepage)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-28 bg-gray-50 rounded-xl border-2 border-dashed border-orange-300 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-xs">
                    {settingsForm.adminPaymentQrUrl ? (
                      <img
                        src={settingsForm.adminPaymentQrUrl}
                        alt="Admin QR Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <QrCode className="w-10 h-10 text-gray-400" />
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <label className="block">
                      <span className="sr-only">Upload Payment QR Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const b64 = await fileToBase64(file);
                              setSettingsForm({ ...settingsForm, adminPaymentQrUrl: b64 });
                              showToast('Payment QR photo uploaded successfully!');
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                        className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                      />
                    </label>

                    <input
                      type="text"
                      value={settingsForm.adminPaymentQrUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminPaymentQrUrl: e.target.value })}
                      placeholder="Or enter direct QR Image URL..."
                      className="w-full px-3 py-1.5 rounded-sm border border-gray-300 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Homepage Hero Headline & Subheading */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-slate-900 border-b border-gray-100 pb-3">
                <Globe className="w-4 h-4 text-orange-600" />
                <span>Homepage Main Banner / Hero Content</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Main Headline (H1 Display)
                </label>
                <input
                  type="text"
                  value={settingsForm.platformHeroHeading}
                  onChange={(e) => setSettingsForm({ ...settingsForm, platformHeroHeading: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-bold"
                  placeholder="2 MINUTE MEIN WEBSITE LIVE KARO."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Sub-Headline (Supporting Description)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.platformHeroSubheading}
                  onChange={(e) => setSettingsForm({ ...settingsForm, platformHeroSubheading: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs leading-relaxed"
                  placeholder="Apne mobile se banaye professional digital store website..."
                />
              </div>
            </div>

            {/* Section 4: About Us Story & Platform Photos Showcase */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-slate-900 border-b border-gray-100 pb-3">
                <Building className="w-4 h-4 text-orange-600" />
                <span>About Us Story & Platform Photo Gallery</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  About Us Story & Mission Text
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.platformAboutStory}
                  onChange={(e) => setSettingsForm({ ...settingsForm, platformAboutStory: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs leading-relaxed"
                  placeholder="IndianLalaJi.com is built specifically for Indian local vendors..."
                />
              </div>

              {/* Photos Gallery */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    Platform Photos Showcase ({(settingsForm.platformAboutPhotos || []).length} Photos)
                  </label>
                </div>

                {/* Grid of photos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(settingsForm.platformAboutPhotos || []).map((photo, pIdx) => (
                    <div key={pIdx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
                      <img src={photo} alt={`Showcase ${pIdx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (settingsForm.platformAboutPhotos || []).filter((_, idx) => idx !== pIdx);
                          setSettingsForm({ ...settingsForm, platformAboutPhotos: updated });
                        }}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload or Add Photo */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <label className="flex-1">
                    <span className="sr-only">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const b64 = await fileToBase64(file);
                            const updated = [...(settingsForm.platformAboutPhotos || []), b64];
                            setSettingsForm({ ...settingsForm, platformAboutPhotos: updated });
                            showToast('Photo added to gallery!');
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                      className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                    />
                  </label>

                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      placeholder="Or enter Image URL..."
                      value={newPhotoUrlInput}
                      onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-sm border border-gray-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newPhotoUrlInput.trim()) {
                          const updated = [...(settingsForm.platformAboutPhotos || []), newPhotoUrlInput.trim()];
                          setSettingsForm({ ...settingsForm, platformAboutPhotos: updated });
                          setNewPhotoUrlInput('');
                          showToast('Photo URL added!');
                        }
                      }}
                      className="px-3 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-sm hover:bg-orange-700 shrink-0 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Save Bar (Clean Light Theme) */}
          <div className="bg-white border border-gray-200 text-slate-900 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-gray-600">
              Settings changes will immediately sync across all devices, homepage, and pricing modals.
            </div>
            <button
              onClick={handleSavePlatformSettings}
              className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Sync All</span>
            </button>
          </div>
        </div>
      )}

      {/* POPUP EDIT MODAL */}
      {showPopupModal && editingPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Configure Advertisement Popup</h3>
              <button onClick={() => setShowPopupModal(false)} className="text-gray-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Heading *</label>
                <input
                  type="text"
                  value={editingPopup.title}
                  onChange={(e) => setEditingPopup({ ...editingPopup, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={2}
                  value={editingPopup.description}
                  onChange={(e) => setEditingPopup({ ...editingPopup, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Image URL or Base64 *</label>
                <input
                  type="text"
                  value={editingPopup.imageUrl}
                  onChange={(e) => setEditingPopup({ ...editingPopup, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={editingPopup.buttonText}
                    onChange={(e) => setEditingPopup({ ...editingPopup, buttonText: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={editingPopup.buttonUrl}
                    onChange={(e) => setEditingPopup({ ...editingPopup, buttonUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Targeting (STEP 31)</label>
                  <select
                    value={editingPopup.targetType}
                    onChange={(e) => setEditingPopup({ ...editingPopup, targetType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-bold"
                  >
                    <option value="ALL_PUBLISHED">All Published Stores</option>
                    <option value="CATEGORIES">Selected Categories</option>
                    <option value="SELECTED_SHOPS">Selected Shops</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Frequency</label>
                  <select
                    value={editingPopup.frequency}
                    onChange={(e) => setEditingPopup({ ...editingPopup, frequency: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-bold"
                  >
                    <option value="ONCE_PER_SESSION">Once Per Session</option>
                    <option value="ALWAYS">Every Load</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowPopupModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSavePopup(editingPopup)}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs"
              >
                Save Popup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOP EDIT MODAL */}
      {editingShop && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Edit Vendor Store: {editingShop.shopId}</h3>
              <button onClick={() => setEditingShop(null)} className="text-gray-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={editingShop.businessName}
                  onChange={(e) => setEditingShop({ ...editingShop, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={editingShop.vendorName}
                  onChange={(e) => setEditingShop({ ...editingShop, vendorName: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Business Category</label>
                <select
                  value={editingShop.category}
                  onChange={(e) => setEditingShop({ ...editingShop, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs bg-white font-medium"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CONNECTED WEBSITE & CUSTOM DOMAIN */}
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Website Connect & Custom Domain</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Custom Domain
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. www.mydukaan.com"
                      value={editingShop.customDomain || ''}
                      onChange={(e) => setEditingShop({ 
                        ...editingShop, 
                        customDomain: e.target.value,
                        domainConnectStatus: e.target.value.trim() ? (editingShop.domainConnectStatus || 'CONNECTED') : 'NOT_CONNECTED'
                      })}
                      className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Connection Status
                    </label>
                    <select
                      value={editingShop.domainConnectStatus || 'NOT_CONNECTED'}
                      onChange={(e) => setEditingShop({ ...editingShop, domainConnectStatus: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs bg-white font-bold"
                    >
                      <option value="CONNECTED">🟢 CONNECTED</option>
                      <option value="PENDING_DNS">🟡 PENDING_DNS</option>
                      <option value="NOT_CONNECTED">⚪ NOT_CONNECTED</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Connected Website URL (Optional Target)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingShop.connectedWebsiteUrl || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, connectedWebsiteUrl: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* VENDOR LOGIN & PASSWORD RESET SECTION (Clean Light Theme) */}
              <div className="p-3.5 bg-orange-50/70 text-slate-900 rounded-xl space-y-2.5 border border-orange-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-orange-800 uppercase tracking-wider">
                    <Key className="w-4 h-4 text-orange-600" />
                    <span>Vendor Password Management (Admin Override)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newPass = generateSecurePassword();
                      setEditingShop({ ...editingShop, vendorPassword: newPass });
                    }}
                    className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold rounded uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                  >
                    ⚡ Auto Generate
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-700">
                    <span>Registered Email / Username:</span>
                    <span className="font-mono text-orange-700 font-bold">{editingShop.vendorEmail || editingShop.phone}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Vendor Login Password (Set / Change New Password)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showPasswordInEdit ? 'text' : 'password'}
                          value={editingShop.vendorPassword || ''}
                          onChange={(e) => setEditingShop({ ...editingShop, vendorPassword: e.target.value })}
                          placeholder="Enter new unique password"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-orange-500 pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordInEdit(!showPasswordInEdit)}
                          className="absolute right-2 top-2 text-gray-400 hover:text-slate-700"
                        >
                          {showPasswordInEdit ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(editingShop.vendorPassword || '');
                          setCopiedPassword(true);
                          setTimeout(() => setCopiedPassword(false), 2000);
                        }}
                        className="px-2.5 py-1.5 bg-white hover:bg-gray-100 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 border border-gray-300 shadow-xs cursor-pointer"
                        title="Copy Password"
                      >
                        {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px] uppercase">{copiedPassword ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[10px] text-slate-500">
                      Vendor ko naya password WhatsApp par bhejne ke liye:
                    </p>
                    <a
                      href={getWhatsAppDirectUrl(
                        editingShop.phone,
                        `Namaste ${editingShop.vendorName}! Aapke IndianLalaJi Dukaan Portal ka naya login password yeh hai:\n\nShop ID: ${editingShop.shopId}\nLogin ID: ${editingShop.vendorEmail || editingShop.phone}\nPassword: ${editingShop.vendorPassword || ''}\n\nDhanyawad!`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-600 hover:underline font-bold flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Send via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingShop.phone}
                    onChange={(e) => setEditingShop({ ...editingShop, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Status</label>
                  <select
                    value={editingShop.status}
                    onChange={(e) => setEditingShop({ ...editingShop, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-bold"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                    <option value="HOLD">HOLD</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              {/* 1-Year Subscription Validity & Dates (Clean Light Theme) */}
              <div className="p-3.5 bg-slate-50 text-slate-900 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span>1-Year Subscription & Dates</span>
                  </div>
                  {(() => {
                    const activeVal = editingShop.activeDate || editingShop.createdAt?.split('T')[0] || '2026-08-01';
                    const expVal = editingShop.expiryDate || getOneYearExpiryDate(activeVal);
                    const days = calculateDaysRemaining(expVal);
                    return (
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        days <= 0 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {days <= 0 ? 'Expired' : `${days} Days Left`}
                      </span>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Active Date (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      value={editingShop.activeDate || editingShop.createdAt?.split('T')[0] || '2026-08-01'}
                      onChange={(e) => {
                        const newActive = e.target.value;
                        setEditingShop({
                          ...editingShop,
                          activeDate: newActive,
                          expiryDate: getOneYearExpiryDate(newActive),
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-slate-900 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-orange-700 mb-1">
                      Expiry Date (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      value={editingShop.expiryDate || getOneYearExpiryDate(editingShop.activeDate || editingShop.createdAt?.split('T')[0] || '2026-08-01')}
                      onChange={(e) => setEditingShop({ ...editingShop, expiryDate: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Purchased Plan Price (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-xs text-gray-500 font-bold">₹</span>
                      <input
                        type="number"
                        value={editingShop.planPrice ?? 1499}
                        onChange={(e) => setEditingShop({ ...editingShop, planPrice: Number(e.target.value) })}
                        className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-gray-300 bg-white text-slate-900 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={editingShop.planName || '1-Year Official LalaJi Store Plan'}
                      onChange={(e) => setEditingShop({ ...editingShop, planName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-600">
                    Active Platform Rate: ₹{state.pricingPackages?.[0]?.price ?? 1499}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentExp = editingShop.expiryDate || getOneYearExpiryDate(editingShop.activeDate || '2026-08-01');
                      const extended = getOneYearExpiryDate(currentExp);
                      setEditingShop({
                        ...editingShop,
                        expiryDate: extended,
                      });
                    }}
                    className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    +1 Year (Extend 365 Days)
                  </button>
                </div>
              </div>

              {/* Payment QR & UPI Settings */}
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-orange-900 uppercase tracking-wider">
                  <QrCode className="w-4 h-4 text-orange-600" />
                  <span>Vendor Direct Payment QR Code & UPI ID</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Vendor UPI ID</label>
                  <input
                    type="text"
                    value={editingShop.upiId || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, upiId: e.target.value })}
                    placeholder="e.g. 7087033009@paytm"
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs font-mono bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white rounded border border-orange-200 p-1 shrink-0 flex items-center justify-center">
                    {editingShop.paymentQrUrl ? (
                      <img src={editingShop.paymentQrUrl} alt="QR Preview" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer px-3 py-2 bg-white border border-orange-300 hover:bg-orange-100 text-orange-900 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 justify-center shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-orange-600" />
                      <span>Upload / Replace QR Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const b64 = await fileToBase64(file);
                            setEditingShop({ ...editingShop, paymentQrUrl: b64 });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setEditingShop(null)}
                className="px-4 py-2 bg-gray-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  let updatedShopWithHash = { ...editingShop };
                  if (editingShop.vendorPassword) {
                    const hash = await hashPassword(editingShop.vendorPassword, editingShop.shopId);
                    updatedShopWithHash.passwordHash = hash;
                  }
                  await saveShopToFirestore(updatedShopWithHash);
                  const updatedShops = state.shops.map((s) => (s.id === editingShop.id ? updatedShopWithHash : s));
                  onUpdateState({ ...state, shops: updatedShops });
                  setEditingShop(null);
                  showToast('Vendor details updated and synced!');
                }}
                className="px-5 py-2 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs hover:bg-orange-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

        </div>
        {/* End of Dashboard Main Workspace Container */}

      </div>
      {/* End of Main Content Area */}

      {/* VENDOR DELETION CONFIRMATION MODAL */}
      {shopToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                Delete Vendor Store?
              </h3>
              <p className="text-xs text-gray-600">
                Kya aap sure hain ki <strong className="text-slate-900">{shopToDelete.businessName}</strong> (Shop ID: <span className="font-mono font-bold text-orange-600">{shopToDelete.shopId}</span>) ko platform aur database se permanently delete karna chahte hain?
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-[11px] text-red-800 leading-relaxed">
              ⚠️ <strong>Dhyan dein:</strong> Yeh action permanent hai. Vendor ka public link, photo catalogue aur login inactive ho jayenge.
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShopToDelete(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold uppercase tracking-wider text-xs rounded-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteShop}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm transition-colors shadow-md shadow-red-600/20"
              >
                Yes, Delete Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1-YEAR SUBSCRIPTION TAX INVOICE MODAL */}
      <SubscriptionInvoiceModal
        isOpen={!!viewingInvoiceShop}
        onClose={() => setViewingInvoiceShop(null)}
        shop={viewingInvoiceShop}
      />

      {/* SPECIFIC VENDOR DATA EXPORT & DOSSIER MODAL */}
      <VendorDataExportModal
        isOpen={Boolean(exportingVendorShop)}
        onClose={() => setExportingVendorShop(null)}
        shop={exportingVendorShop}
        inquiries={state.inquiries}
        onNavigateToShop={onNavigateToShop}
      />

      {/* + ADD NEW WEBSITE / DUKAAN MODAL */}
      {showAddShopModal && (
        <AddWebsiteModal
          state={state}
          onClose={() => setShowAddShopModal(false)}
          onAddShop={(newShop) => {
            const updatedShops = [newShop, ...state.shops];
            onUpdateState({ ...state, shops: updatedShops });
          }}
          showToast={showToast}
        />
      )}

      {/* CONNECT WEBSITE & CUSTOM DOMAIN MODAL */}
      {connectingDomainShop && (
        <ConnectWebsiteModal
          shop={connectingDomainShop}
          onClose={() => setConnectingDomainShop(null)}
          onUpdateShop={(updatedShop) => {
            const updatedShops = state.shops.map(s => s.shopId === updatedShop.shopId ? updatedShop : s);
            onUpdateState({ ...state, shops: updatedShops });
          }}
          showToast={showToast}
        />
      )}

      {/* FLOATING SUCCESS TOAST */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-orange-500/40 flex items-center gap-2.5 animate-bounce text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

    </div>
  );
};

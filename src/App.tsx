/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './components/pages/HomePage';
import { LiveStoresPage } from './components/pages/LiveStoresPage';
import { TemplatesPage } from './components/pages/TemplatesPage';
import { HowToStartPage } from './components/pages/HowToStartPage';
import { PricingPage } from './components/pages/PricingPage';
import { ContactPage } from './components/pages/ContactPage';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { PublicShopPage } from './components/shop/PublicShopPage';
import { 
  PlatformState, 
  Shop, 
  ShopInquiry, 
  PlatformLead 
} from './types';
import { loadPlatformState, savePlatformState } from './data/initialData';
import { 
  seedFirestoreIfEmpty, 
  subscribeToShops, 
  subscribeToShop,
  subscribeToPlatformConfig, 
  savePlatformStateToFirestore, 
  saveShopToFirestore,
  fetchShopFromFirestore
} from './services/firebase';
import { 
  loadUserSession, 
  saveUserSession, 
  clearUserSession, 
  AuthSession 
} from './services/authSession';
import { ProtectedAccessBanner } from './components/common/ProtectedAccessBanner';
import { updateShopSeoMeta, resetPlatformSeoMeta } from './utils/seo';
import { initGoogleTranslate } from './utils/googleTranslate';

// Custom Domain resolver helper
export const resolveShopFromDomain = (shops: Shop[], rawHostOrDomain?: string | null): Shop | null => {
  if (!rawHostOrDomain) return null;
  const clean = (d: string) =>
    d
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/.*$/, '')
      .replace(/:\d+$/, '');

  const target = clean(rawHostOrDomain);
  if (!target) return null;

  // Standard platform hostnames and dev environments
  const ignoredHosts = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    'indianlalaji.com',
  ];
  if (
    ignoredHosts.includes(target) ||
    target.endsWith('.run.app') ||
    target.endsWith('.web.app') ||
    target.endsWith('.firebaseapp.com') ||
    target.endsWith('.vercel.app')
  ) {
    return null;
  }

  return (
    shops.find((s) => {
      if (!s.customDomain) return false;
      return clean(s.customDomain) === target;
    }) || null
  );
};

export default function App() {
  // Global platform state from localStorage with Firestore real-time sync
  const [platformState, setPlatformState] = useState<PlatformState>(() => loadPlatformState());

  // Load existing persistent session (if logged in before page refresh)
  const initialSession = loadUserSession();

  // Current view state
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeShopId, setActiveShopId] = useState<string | null>(null);

  // Authentication session state
  const [currentRole, setCurrentRole] = useState<'VISITOR' | 'VENDOR' | 'ADMIN'>(initialSession.role);
  const [loggedVendorShopId, setLoggedVendorShopId] = useState<string | null>(initialSession.shopId);

  // Auth modal state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'LOGIN' | 'REGISTER' | 'ADMIN'>('LOGIN');
  const [authPromptNotice, setAuthPromptNotice] = useState<string | null>(null);
  const [prefilledShopId, setPrefilledShopId] = useState<string>('');

  // Real-time Firestore sync & Initial Seeding
  useEffect(() => {
    // 0. Initialize Google Translate with default English or user's preference
    try {
      const savedLang = (localStorage.getItem('shop_preferred_language') as any) || 'en';
      initGoogleTranslate(savedLang);
    } catch {
      initGoogleTranslate('en');
    }

    // 1. Seed cloud database if first time
    seedFirestoreIfEmpty(platformState);

    // 2. Real-time subscription to cloud shops
    const unsubShops = subscribeToShops((cloudShops) => {
      if (cloudShops && cloudShops.length > 0) {
        setPlatformState((prev) => {
          // Cloud shops are primary, but keep any local shops not yet synced to prevent dropping newly registered shops
          const cloudMap = new Map(cloudShops.map((s) => [s.shopId, s]));
          const localOnly = prev.shops.filter((s) => !cloudMap.has(s.shopId));
          const mergedShops = [...localOnly, ...cloudShops];
          const updatedState = { ...prev, shops: mergedShops };
          savePlatformState(updatedState);
          return updatedState;
        });
      }
    });

    // 3. Real-time subscription to cloud platform config
    const unsubConfig = subscribeToPlatformConfig((cloudConfig) => {
      if (cloudConfig) {
        // Enforce single 1-year master plan
        if (cloudConfig.pricingPackages && Array.isArray(cloudConfig.pricingPackages) && cloudConfig.pricingPackages.length > 1) {
          cloudConfig.pricingPackages = [cloudConfig.pricingPackages[0]];
        }
        setPlatformState((prev) => {
          const updatedState = { ...prev, ...cloudConfig };
          savePlatformState(updatedState);
          return updatedState;
        });
      }
    });

    return () => {
      unsubShops();
      unsubConfig();
    };
  }, []);

  // Sync state changes with localStorage and Firestore Cloud
  const handleUpdateState = (newState: PlatformState) => {
    setPlatformState(newState);
    savePlatformState(newState);
    savePlatformStateToFirestore(newState);
  };

  // Sync route on mount / popstate / hashchange & multi-tab storage sync
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname || '';
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash || '';

      // Check for direct login trigger (?action=login&shopId=SHP... or ?login=SHP...)
      const actionParam = searchParams.get('action');
      const loginParam = searchParams.get('login');
      const isLoginAction = actionParam === 'login' || loginParam !== null || hash.includes('login');
      const directShopId = searchParams.get('shopId') || (loginParam && loginParam !== 'true' ? loginParam : '') || '';

      if (isLoginAction) {
        setAuthModalTab('LOGIN');
        if (directShopId) {
          setPrefilledShopId(directShopId);
        }
        setIsAuthOpen(true);
      }

      // 0. Check Custom Domain routing (via URL simulation ?domain=... / ?customDomain=... OR real window.location.hostname)
      const domainParam = searchParams.get('domain') || searchParams.get('customDomain');
      const customDomainShop = resolveShopFromDomain(platformState.shops, domainParam || window.location.hostname);
      if (customDomainShop && !isLoginAction && !path.startsWith('/admin') && !path.startsWith('/vendor-dashboard')) {
        setCurrentView('shop');
        setActiveShopId(customDomainShop.shopId);
        return;
      }

      const shopParam = searchParams.get('shop') || (!isLoginAction ? searchParams.get('shopId') : null) || searchParams.get('id');

      // Check URL search param first (?shop=SHP...)
      if (shopParam && !isLoginAction) {
        setCurrentView('shop');
        setActiveShopId(shopParam);
        return;
      }

      // Check hash route (#/shop/SHP... or #shop=SHP...)
      const matchHashShop = hash.match(/#\/?shop[=\/]([a-zA-Z0-9_-]+)/i) || hash.match(/#([a-zA-Z0-9_-]{5,})/i);
      if (matchHashShop) {
        setCurrentView('shop');
        setActiveShopId(matchHashShop[1]);
        return;
      }

      // Check pathname (/shop/SHP...)
      const matchShop = path.match(/^\/shop\/([a-zA-Z0-9_-]+)/i);
      if (matchShop) {
        setCurrentView('shop');
        setActiveShopId(matchShop[1]);
        return;
      }

      const cleanPath = (path || '').replace(/^\//, '') || 'home';

      // STRICT ROUTE GUARD: Vendor Dashboard
      if (cleanPath === 'vendor-dashboard') {
        const session = loadUserSession();
        if (session.role !== 'VENDOR' || !session.shopId) {
          // Block access, replace history with '/' and prompt login
          window.history.replaceState({}, '', '/');
          setCurrentView('home');
          setCurrentRole('VISITOR');
          setLoggedVendorShopId(null);
          handleOpenAuth('LOGIN', 'Aap logged in nahi hain! Vendor Dashboard access karne ke liye pehle apna Mobile / Shop ID aur Password se Login karein.');
          return;
        }
        setCurrentRole('VENDOR');
        setLoggedVendorShopId(session.shopId);
        setCurrentView('vendor-dashboard');
        return;
      }

      // STRICT ROUTE GUARD: Super Admin Dashboard
      if (cleanPath === 'admin-dashboard') {
        const session = loadUserSession();
        if (session.role !== 'ADMIN') {
          // Block access, replace history with '/' and prompt login
          window.history.replaceState({}, '', '/');
          setCurrentView('home');
          setCurrentRole('VISITOR');
          setLoggedVendorShopId(null);
          handleOpenAuth('ADMIN', 'Super Admin Dashboard access karne ke liye Super Admin credentials se login karein.');
          return;
        }
        setCurrentRole('ADMIN');
        setCurrentView('admin-dashboard');
        return;
      }

      if (cleanPath === 'templates') {
        setCurrentView('stores');
        return;
      }

      if (['home', 'stores', 'how-it-works', 'pricing', 'contact'].includes(cleanPath)) {
        setCurrentView(cleanPath);
      } else {
        // Any root domain or unmapped path always renders the home page cleanly
        setCurrentView('home');
      }
    };

    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === 'INDIANLALAJI_SAAS_STATE_V1') {
        const freshState = loadPlatformState();
        setPlatformState(freshState);
      }
      if (e.key === 'INDIANLALAJI_AUTH_SESSION_V2') {
        const freshSession = loadUserSession();
        setCurrentRole(freshSession.role);
        setLoggedVendorShopId(freshSession.shopId);
        if (freshSession.role === 'VISITOR' && (currentView === 'vendor-dashboard' || currentView === 'admin-dashboard')) {
          window.history.replaceState({}, '', '/');
          setCurrentView('home');
        }
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, [platformState.shops]);

  // Auto-resolve custom domain when shops finish syncing from cloud
  useEffect(() => {
    if (platformState.shops.length > 0 && currentView === 'home' && !activeShopId) {
      const searchParams = new URLSearchParams(window.location.search);
      const domainParam = searchParams.get('domain') || searchParams.get('customDomain');
      const customDomainShop = resolveShopFromDomain(platformState.shops, domainParam || window.location.hostname);
      if (customDomainShop) {
        setCurrentView('shop');
        setActiveShopId(customDomainShop.shopId);
      }
    }
  }, [platformState.shops, currentView, activeShopId]);

  // Navigation handler
  const handleNavigate = (view: string, shopIdParam?: string) => {
    if (view.startsWith('shop/')) {
      const sid = view.split('/')[1] || shopIdParam;
      setActiveShopId(sid || null);
      setCurrentView('shop');
      window.history.pushState({}, '', `?shop=${sid}`);
    } else if (view === 'shop' && shopIdParam) {
      setActiveShopId(shopIdParam);
      setCurrentView('shop');
      window.history.pushState({}, '', `?shop=${shopIdParam}`);
    } else if (view === 'vendor-dashboard') {
      const session = loadUserSession();
      if (session.role !== 'VENDOR' || !session.shopId) {
        handleOpenAuth('LOGIN', 'Vendor Dashboard open karne ke liye kripya pehle Login karein.');
        return;
      }
      setLoggedVendorShopId(session.shopId);
      setActiveShopId(null);
      setCurrentView('vendor-dashboard');
      window.history.pushState({}, '', '/vendor-dashboard');
    } else if (view === 'admin-dashboard') {
      const session = loadUserSession();
      if (session.role !== 'ADMIN') {
        handleOpenAuth('ADMIN', 'Super Admin Dashboard ke liye Admin Login karein.');
        return;
      }
      setActiveShopId(null);
      setCurrentView('admin-dashboard');
      window.history.pushState({}, '', '/admin-dashboard');
    } else {
      setActiveShopId(null);
      setCurrentView(view);
      window.history.pushState({}, '', `/${view === 'home' ? '' : view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Modal openers
  const handleOpenAuth = (tab: 'LOGIN' | 'REGISTER' | 'ADMIN' = 'LOGIN', notice: string | null = null, shopId: string = '') => {
    setAuthModalTab(tab);
    setAuthPromptNotice(notice);
    if (shopId) setPrefilledShopId(shopId);
    setIsAuthOpen(true);
  };

  // Vendor login success
  const handleVendorLoginSuccess = (shopOrEmail: Shop | string, vendorNameParam?: string, shopIdParam?: string) => {
    let targetShopId = '';
    let vendorEmail = '';
    let vendorName = vendorNameParam || '';

    if (typeof shopOrEmail === 'object' && shopOrEmail !== null && 'shopId' in shopOrEmail) {
      targetShopId = shopOrEmail.shopId;
      vendorEmail = shopOrEmail.vendorEmail || '';
      vendorName = shopOrEmail.vendorName || vendorName;
    } else if (shopIdParam) {
      targetShopId = shopIdParam;
    }

    if (!targetShopId && platformState.shops[0]) {
      targetShopId = platformState.shops[0].shopId;
    }

    if (targetShopId) {
      saveUserSession({
        role: 'VENDOR',
        shopId: targetShopId,
        vendorName,
        email: vendorEmail,
        loginAt: Date.now(),
      });
      setCurrentRole('VENDOR');
      setLoggedVendorShopId(targetShopId);
      setAuthPromptNotice(null);
      setCurrentView('vendor-dashboard');
      window.history.pushState({}, '', '/vendor-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Admin login success
  const handleAdminLoginSuccess = () => {
    saveUserSession({
      role: 'ADMIN',
      shopId: null,
      email: 'admin@indianlalaji.com',
      loginAt: Date.now(),
    });
    setCurrentRole('ADMIN');
    setLoggedVendorShopId(null);
    setAuthPromptNotice(null);
    setCurrentView('admin-dashboard');
    window.history.pushState({}, '', '/admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logout - strictly clears session and history
  const handleLogout = () => {
    clearUserSession();
    setCurrentRole('VISITOR');
    setLoggedVendorShopId(null);
    setAuthPromptNotice(null);
    window.history.replaceState({}, '', '/');
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Vendor updates their shop - strictly secured to vendor's own shop
  const handleVendorUpdateShop = async (updatedShop: Shop) => {
    const session = loadUserSession();
    if (session.role !== 'VENDOR' || !session.shopId || session.shopId !== updatedShop.shopId) {
      console.error('[Security] Blocked unauthorized attempt to update shop:', updatedShop.shopId);
      return;
    }
    // 1. Immediately persist this specific shop to Firestore cloud
    await saveShopToFirestore(updatedShop);
    // 2. Update local state & localStorage so this device reflects change immediately
    setPlatformState((prev) => {
      const updatedShops = prev.shops.map((s) =>
        s.id === updatedShop.id || s.shopId === updatedShop.shopId ? updatedShop : s
      );
      const updatedState = { ...prev, shops: updatedShops };
      savePlatformState(updatedState);
      return updatedState;
    });
  };

  // Inquiry submission from Public Store
  const handleSubmitShopInquiry = (inquiryData: Omit<ShopInquiry, 'id' | 'date' | 'status'>) => {
    const newInquiry: ShopInquiry = {
      ...inquiryData,
      id: `inq_${Date.now()}`,
      date: new Date().toISOString(),
      status: 'UNREAD',
    };
    handleUpdateState({
      ...platformState,
      inquiries: [newInquiry, ...platformState.inquiries],
    });
  };

  // Inquiry status updater from Vendor Dashboard
  const handleUpdateInquiryStatus = (inquiryId: string, status: 'READ' | 'UNREAD' | 'CONVERTED') => {
    const updated = platformState.inquiries.map((inq) =>
      inq.id === inquiryId ? { ...inq, status } : inq
    );
    handleUpdateState({ ...platformState, inquiries: updated });
  };

  // Platform Lead submission from Contact Page
  const handleAddPlatformLead = (leadData: Omit<PlatformLead, 'id' | 'date' | 'status'>) => {
    const newLead: PlatformLead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      date: new Date().toISOString(),
      status: 'NEW',
    };
    handleUpdateState({
      ...platformState,
      platformLeads: [newLead, ...platformState.platformLeads],
    });
  };

  // Real-time live subscription for active shop to guarantee instant cross-device product & catalogue sync
  useEffect(() => {
    if (!activeShopId) return;

    // Immediate direct cloud fetch in case shop was just added on another device
    fetchShopFromFirestore(activeShopId).then((fetchedShop) => {
      if (fetchedShop) {
        setPlatformState((prev) => {
          const exists = prev.shops.some((s) => s.shopId === fetchedShop.shopId);
          const updatedShops = exists
            ? prev.shops.map((s) => (s.shopId === fetchedShop.shopId ? fetchedShop : s))
            : [fetchedShop, ...prev.shops];
          const updated = { ...prev, shops: updatedShops };
          savePlatformState(updated);
          return updated;
        });
      }
    });

    // Real-time listener: any product added on mobile will reflect instantly on this device
    const unsubSingle = subscribeToShop(activeShopId, (liveShop) => {
      if (liveShop && liveShop.shopId) {
        setPlatformState((prev) => {
          const exists = prev.shops.some((s) => s.shopId === liveShop.shopId);
          const updatedShops = exists
            ? prev.shops.map((s) => (s.shopId === liveShop.shopId ? liveShop : s))
            : [liveShop, ...prev.shops];
          const updated = { ...prev, shops: updatedShops };
          savePlatformState(updated);
          return updated;
        });
      }
    });

    return () => unsubSingle();
  }, [activeShopId]);

  // Find active shop for shop view or vendor dashboard (Strict: undefined if not logged in)
  const currentVendorShop = loggedVendorShopId
    ? platformState.shops.find(
        (s) => s.shopId === loggedVendorShopId || s.id === loggedVendorShopId
      )
    : undefined;
  const currentPublicShop = activeShopId
    ? platformState.shops.find(
        (s) =>
          s.shopId.toLowerCase() === activeShopId.toLowerCase() ||
          s.id.toLowerCase() === activeShopId.toLowerCase()
      )
    : undefined;

  // Sync Document Title & OpenGraph SEO dynamically for active shop / platform
  useEffect(() => {
    if (currentView === 'shop' && currentPublicShop) {
      updateShopSeoMeta(currentPublicShop);
    } else if (currentView !== 'shop') {
      resetPlatformSeoMeta();
    }
  }, [currentView, currentPublicShop]);

  const isCustomDomainHost = Boolean(
    resolveShopFromDomain(platformState.shops, window.location.hostname)
  );

  const isPublicShopView =
    currentView === 'shop' ||
    isCustomDomainHost ||
    (currentView === 'vendor-dashboard' && currentRole === 'VENDOR' && Boolean(currentVendorShop));

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F5] text-[#1A1A1A] font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Show Platform Navbar only on non-standalone shop & non-vendor-dashboard pages */}
      {!isPublicShopView && (
        <Navbar
          currentRole={currentRole}
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          vendorShopId={loggedVendorShopId}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            shops={platformState.shops}
            tutorialVideos={platformState.tutorialVideos}
            pricingPackages={platformState.pricingPackages}
            platformHeroHeading={platformState.platformHeroHeading}
            platformHeroSubheading={platformState.platformHeroSubheading}
            platformAboutStory={platformState.platformAboutStory}
            platformAboutPhotos={platformState.platformAboutPhotos}
            customerCarePhone={platformState.customerCarePhone}
            customerCareWhatsapp={platformState.customerCareWhatsapp}
            customerCareEmail={platformState.customerCareEmail}
            adminPaymentQrUrl={platformState.adminPaymentQrUrl}
            adminUpiId={platformState.adminUpiId}
            adminAccountHolder={platformState.adminAccountHolder}
            mainWebsiteSectionsConfig={platformState.mainWebsiteSectionsConfig}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'stores' && (
          <LiveStoresPage
            shops={platformState.shops}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'templates' && (
          <LiveStoresPage
            shops={platformState.shops}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowToStartPage
            tutorialVideos={platformState.tutorialVideos}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'pricing' && (
          <PricingPage
            pricingPackages={platformState.pricingPackages}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage onAddLead={handleAddPlatformLead} />
        )}

        {/* Vendor Dashboard (Strictly Protected - Isolated to Own Shop Only) */}
        {currentView === 'vendor-dashboard' && (
          currentRole === 'VENDOR' && currentVendorShop ? (
            <VendorDashboard
              shop={currentVendorShop}
              onUpdateShop={handleVendorUpdateShop}
              onLogout={handleLogout}
              onNavigateToShop={(sid) => handleNavigate('shop', sid)}
              onNavigateHome={() => handleNavigate('home')}
              inquiries={platformState.inquiries.filter((inq) => inq.shopId === currentVendorShop.shopId)}
              onUpdateInquiryStatus={handleUpdateInquiryStatus}
              adminPaymentQrUrl={platformState.adminPaymentQrUrl}
              adminUpiId={platformState.adminUpiId}
              adminAccountHolder={platformState.adminAccountHolder}
              adminPhone={platformState.customerCarePhone}
              adminWhatsapp={platformState.customerCareWhatsapp}
            />
          ) : (
            <ProtectedAccessBanner
              requiredRole="VENDOR"
              onLogin={() => handleOpenAuth('LOGIN', 'Vendor Dashboard open karne ke liye kripya apna Login karein.')}
              onGoHome={() => handleNavigate('home')}
            />
          )
        )}

        {/* Super Admin Dashboard (Strictly Protected) */}
        {currentView === 'admin-dashboard' && (
          currentRole === 'ADMIN' ? (
            <SuperAdminDashboard
              state={platformState}
              onUpdateState={handleUpdateState}
              onLogout={handleLogout}
              onNavigateToShop={(sid) => handleNavigate('shop', sid)}
            />
          ) : (
            <ProtectedAccessBanner
              requiredRole="ADMIN"
              onLogin={() => handleOpenAuth('ADMIN', 'Super Admin Dashboard ke liye Admin credentials se login karein.')}
              onGoHome={() => handleNavigate('home')}
            />
          )
        )}

        {/* Dynamic Public Store Page (/shop/{SHOP_ID}) */}
        {currentView === 'shop' && (
          <PublicShopPage
            shop={currentPublicShop}
            shopId={activeShopId || undefined}
            popups={platformState.popups}
            globalPopupEnabled={platformState.globalPopupEnabled}
            onNavigateHome={() => {
              if (isCustomDomainHost) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                handleNavigate('home');
              }
            }}
            onOpenVendorLogin={() => handleOpenAuth('LOGIN')}
            onSubmitInquiry={handleSubmitShopInquiry}
            isVendorOrAdminPreview={
              currentRole === 'ADMIN' ||
              (currentRole === 'VENDOR' && loggedVendorShopId === currentPublicShop?.shopId)
            }
          />
        )}
      </main>

      {/* Show Platform Footer only on platform pages */}
      {!isPublicShopView && (
        <Footer
          onNavigate={handleNavigate}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Unified Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthPromptNotice(null);
          setPrefilledShopId('');
        }}
        initialTab={authModalTab}
        authPromptNotice={authPromptNotice}
        prefilledShopId={prefilledShopId}
        shops={platformState.shops}
        onRegisterShop={(newShop) => {
          setPlatformState((prev) => {
            const updated = {
              ...prev,
              shops: [newShop, ...prev.shops.filter((s) => s.shopId !== newShop.shopId)],
            };
            savePlatformState(updated);
            return updated;
          });
        }}
        onVendorLoginSuccess={handleVendorLoginSuccess}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}

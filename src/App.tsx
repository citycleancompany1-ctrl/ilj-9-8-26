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
import { DisclaimerPage } from './components/pages/DisclaimerPage';
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
  savePlatformConfigToFirestore,
  saveShopToFirestore,
  fetchShopFromFirestore,
  fetchShopByCustomDomain,
  isCloudQuotaExhausted,
  subscribeToQuotaStatus
} from './services/firebase';
import { 
  findShopByCustomDomain, 
  isPlatformSystemHost, 
  normalizeDomain 
} from './utils/customDomainMatcher';
import { 
  loadUserSession, 
  saveUserSession, 
  clearUserSession, 
  AuthSession 
} from './services/authSession';
import { ProtectedAccessBanner } from './components/common/ProtectedAccessBanner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { updateShopSeoMeta, resetPlatformSeoMeta } from './utils/seo';
import { initGoogleTranslate } from './utils/googleTranslate';
import { ensureShopSafetyDefaults } from './utils/moduleRegistry';

export default function App() {
  // Global platform state from localStorage with Firestore real-time sync
  const [platformState, setPlatformState] = useState<PlatformState>(() => loadPlatformState());

  // Load existing persistent session (if logged in before page refresh)
  const initialSession = loadUserSession();

  // Current view state
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeShopId, setActiveShopId] = useState<string | null>(null);
  const [isShopLoading, setIsShopLoading] = useState<boolean>(false);

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

    // 2. Real-time subscription to cloud shops with smart conflict resolution
    const unsubShops = subscribeToShops((cloudShops) => {
      if (cloudShops && cloudShops.length > 0) {
        setPlatformState((prev) => {
          const currentShops = [...prev.shops];
          const mergedShops = [...currentShops];

          cloudShops.forEach((cloudShop) => {
            const existingIndex = mergedShops.findIndex(
              (s) =>
                (s.shopId && cloudShop.shopId && s.shopId.toLowerCase() === cloudShop.shopId.toLowerCase()) ||
                (s.id && cloudShop.id && s.id.toLowerCase() === cloudShop.id.toLowerCase())
            );

            if (existingIndex >= 0) {
              const localShop = mergedShops[existingIndex];
              const localTime = new Date(localShop.updatedAt || 0).getTime();
              const cloudTime = new Date(cloudShop.updatedAt || 0).getTime();

              // If local shop has equal or newer modifications than cloud snapshot, keep local edits!
              if (localTime >= cloudTime) {
                return;
              }

              // Take authoritative cloud shop data, but preserve any local media if cloud data has empty media
              const cloudAboutPhoto =
                cloudShop.aboutPhotoUrl !== undefined && cloudShop.aboutPhotoUrl !== ''
                  ? cloudShop.aboutPhotoUrl
                  : (cloudShop.sectionsConfig?.about?.imageUrl || localShop.aboutPhotoUrl || localShop.sectionsConfig?.about?.imageUrl || '');

              const resolvedBanners =
                cloudShop.banners && cloudShop.banners.length > 0
                  ? cloudShop.banners
                  : (localShop.banners || []);

              const resolvedDesktopBanners =
                cloudShop.desktopBanners && cloudShop.desktopBanners.length > 0
                  ? cloudShop.desktopBanners
                  : (localShop.desktopBanners || resolvedBanners);

              const resolvedMobileBanners =
                cloudShop.mobileBanners && cloudShop.mobileBanners.length > 0
                  ? cloudShop.mobileBanners
                  : (localShop.mobileBanners || []);

              const resolvedLogo =
                cloudShop.logoUrl || localShop.logoUrl || '';

              const resolvedGallery =
                cloudShop.galleryImages && cloudShop.galleryImages.length > 0
                  ? cloudShop.galleryImages
                  : (localShop.galleryImages || []);

              const localSec = (localShop.sectionsConfig || {}) as Record<string, any>;
              const cloudSec = (cloudShop.sectionsConfig || {}) as Record<string, any>;

              const resolvedPortfolio =
                (cloudSec.portfolio?.items && cloudSec.portfolio.items.length > 0)
                  ? cloudSec.portfolio
                  : (localSec.portfolio || cloudSec.portfolio);

              const resolvedBlog =
                (cloudSec.blog?.posts && cloudSec.blog.posts.length > 0)
                  ? cloudSec.blog
                  : (localSec.blog || cloudSec.blog);

              const resolvedGalleryConfig =
                (cloudSec.gallery?.items && cloudSec.gallery.items.length > 0)
                  ? cloudSec.gallery
                  : (localSec.gallery || cloudSec.gallery);

              const resolvedOffers =
                (cloudSec.offers?.banners && cloudSec.offers.banners.length > 0)
                  ? cloudSec.offers
                  : (localSec.offers || cloudSec.offers);

              mergedShops[existingIndex] = {
                ...cloudShop,
                logoUrl: resolvedLogo,
                banners: resolvedBanners,
                desktopBanners: resolvedDesktopBanners,
                mobileBanners: resolvedMobileBanners,
                galleryImages: resolvedGallery,
                aboutPhotoUrl: cloudAboutPhoto,
                sectionsConfig: {
                  ...localSec,
                  ...cloudSec,
                  about: {
                    ...(localSec.about || {}),
                    ...(cloudSec.about || {}),
                    imageUrl: cloudAboutPhoto,
                  },
                  ...(resolvedPortfolio ? { portfolio: resolvedPortfolio } : {}),
                  ...(resolvedBlog ? { blog: resolvedBlog } : {}),
                  ...(resolvedGalleryConfig ? { gallery: resolvedGalleryConfig } : {}),
                  ...(resolvedOffers ? { offers: resolvedOffers } : {}),
                } as any,
              };
            } else {
              mergedShops.push(cloudShop);
            }
          });

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

  // Cloud quota status state
  const [isQuotaPaused, setIsQuotaPaused] = useState<boolean>(() => isCloudQuotaExhausted());

  useEffect(() => {
    const unsubQuota = subscribeToQuotaStatus((exhausted) => {
      setIsQuotaPaused(exhausted);
    });
    return () => unsubQuota();
  }, []);

  // Sync state changes with localStorage and Firestore Cloud
  const handleUpdateState = (newState: PlatformState) => {
    setPlatformState(newState);
    savePlatformState(newState);
    savePlatformConfigToFirestore(newState);
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

      const rawShopParam = searchParams.get('shop') || (!isLoginAction ? searchParams.get('shopId') : null) || searchParams.get('id');
      const shopParam = rawShopParam ? rawShopParam.trim() : null;
      const cleanPath = (path || '').replace(/^\//, '') || 'home';

      // Check URL search param first (?shop=SHP... or ?shopId=SHP...)
      if (shopParam && !isLoginAction) {
        setCurrentView('shop');
        setActiveShopId(shopParam);
        // Normalize URL if opened with dirty path like /vendor-dashboard?shop=... or /stores?shop=...
        if (cleanPath !== 'home' && cleanPath !== '' && cleanPath !== 'shop') {
          const pageParam = searchParams.get('page');
          const cleanUrl = `/?shop=${encodeURIComponent(shopParam)}${pageParam ? `&page=${encodeURIComponent(pageParam)}` : ''}`;
          window.history.replaceState({}, '', cleanUrl);
        }
        return;
      }

      // Check hash route (#/shop/SHP... or #shop=SHP...)
      const matchHashShop = hash.match(/#\/?shop[=\/]([a-zA-Z0-9_-]+)/i) || hash.match(/#([a-zA-Z0-9_-]{5,})/i);
      if (matchHashShop) {
        const cleanSid = matchHashShop[1].trim();
        setCurrentView('shop');
        setActiveShopId(cleanSid);
        return;
      }

      // Check pathname (/shop/SHP...)
      const matchShop = path.match(/^\/shop\/([a-zA-Z0-9_-]+)/i);
      if (matchShop) {
        const cleanSid = matchShop[1].trim();
        setCurrentView('shop');
        setActiveShopId(cleanSid);
        return;
      }

      // STRICT ROUTE GUARD: Vendor Dashboard
      if (cleanPath === 'vendor-dashboard') {
        const session = loadUserSession();
        if (session.role !== 'VENDOR' || !session.shopId) {
          // Block access, replace history with '/' and prompt login
          window.history.replaceState({}, '', '/');
          setCurrentView('home');
          setCurrentRole('VISITOR');
          setLoggedVendorShopId(null);
          handleOpenAuth('LOGIN', 'You are not logged in! Please sign in with your Mobile / Shop ID and Password to access the Vendor Dashboard.');
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
          handleOpenAuth('ADMIN', 'Please log in with Super Admin credentials to access the Super Admin Dashboard.');
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

      // Check if current hostname is a Client's Custom Domain (e.g. trustedweb.online)
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
      const isSystemHost = isPlatformSystemHost(currentHost);

      if (!isSystemHost && !shopParam && !isLoginAction) {
        // 1. Check in local loaded state
        const matchingShop = findShopByCustomDomain(platformState.shops || [], currentHost);
        if (matchingShop) {
          setCurrentView('shop');
          setActiveShopId(matchingShop.shopId);
          return;
        }

        // 2. Direct asynchronous cloud lookup from Firestore for new/first-time visitors
        fetchShopByCustomDomain(currentHost).then((cloudShop) => {
          if (cloudShop && cloudShop.shopId) {
            setPlatformState((prev) => {
              const exists = prev.shops.some((s) => s.shopId === cloudShop.shopId);
              const updatedShops = exists
                ? prev.shops.map((s) => (s.shopId === cloudShop.shopId ? cloudShop : s))
                : [cloudShop, ...prev.shops];
              const nextState = { ...prev, shops: updatedShops };
              savePlatformState(nextState);
              return nextState;
            });
            setCurrentView('shop');
            setActiveShopId(cloudShop.shopId);
          }
        });
      }

      if (['home', 'stores', 'how-it-works', 'pricing', 'contact', 'disclaimer'].includes(cleanPath)) {
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
  }, []);

  // Navigation handler
  const handleNavigate = (view: string, shopIdParam?: string) => {
    if (view.startsWith('shop/')) {
      const sid = view.split('/')[1] || shopIdParam;
      const cleanSid = (sid || '').trim();
      setActiveShopId(cleanSid || null);
      setCurrentView('shop');
      window.history.pushState({}, '', `/?shop=${encodeURIComponent(cleanSid)}`);
    } else if (view === 'shop' && shopIdParam) {
      const cleanSid = shopIdParam.trim();
      setActiveShopId(cleanSid);
      setCurrentView('shop');
      window.history.pushState({}, '', `/?shop=${encodeURIComponent(cleanSid)}`);
    } else if (view === 'vendor-dashboard') {
      const session = loadUserSession();
      if (session.role !== 'VENDOR' || !session.shopId) {
        handleOpenAuth('LOGIN', 'Please sign in first to access your Vendor Dashboard.');
        return;
      }
      setLoggedVendorShopId(session.shopId);
      setActiveShopId(null);
      setCurrentView('vendor-dashboard');
      window.history.pushState({}, '', '/vendor-dashboard');
    } else if (view === 'admin-dashboard') {
      const session = loadUserSession();
      if (session.role !== 'ADMIN') {
        handleOpenAuth('ADMIN', 'Please sign in with Admin credentials to access the Super Admin Dashboard.');
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
  const handleAdminLoginSuccess = (adminEmail?: string, adminName?: string) => {
    const activeEmail = adminEmail || 'RKMEHRA331996@GMAIL.COM';
    const activeName = adminName || (activeEmail.toLowerCase().includes('pageguru') ? 'Page Guru' : 'R. K. Mehra');
    saveUserSession({
      role: 'ADMIN',
      shopId: null,
      email: activeEmail,
      vendorName: activeName,
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

  // Vendor updates their shop - immediately updates state and persists to cloud
  const handleVendorUpdateShop = async (updatedShop: Shop) => {
    if (!updatedShop || !updatedShop.shopId) return;

    const nowIso = new Date().toISOString();
    const resolvedAboutPhoto =
      updatedShop.aboutPhotoUrl !== undefined && updatedShop.aboutPhotoUrl !== ''
        ? updatedShop.aboutPhotoUrl
        : (updatedShop.sectionsConfig?.about?.imageUrl || '');

    const preparedShop: Shop = {
      ...updatedShop,
      updatedAt: nowIso, // Always assign freshly minted timestamp so local edits take immediate precedence
      aboutPhotoUrl: resolvedAboutPhoto,
      sectionsConfig: updatedShop.sectionsConfig
        ? ({
            ...updatedShop.sectionsConfig,
            about: {
              ...(updatedShop.sectionsConfig.about || {}),
              imageUrl: resolvedAboutPhoto,
            },
          } as any)
        : updatedShop.sectionsConfig,
    };

    // 1. Immediately update local React state & localStorage so this device & front store reflect changes instantly
    setPlatformState((prev) => {
      const updatedShops = prev.shops.map((s) =>
        (s.id && s.id.toLowerCase() === preparedShop.id?.toLowerCase()) ||
        (s.shopId && s.shopId.toLowerCase() === preparedShop.shopId?.toLowerCase())
          ? preparedShop
          : s
      );
      const updatedState = { ...prev, shops: updatedShops };
      savePlatformState(updatedState);
      return updatedState;
    });

    // 2. Persist this specific shop to Firestore cloud
    try {
      await saveShopToFirestore(preparedShop);
    } catch (err) {
      console.warn('[Firestore] Notice while saving updated shop to cloud:', err);
    }
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
    if (!activeShopId) {
      setIsShopLoading(false);
      return;
    }

    const cleanShopId = activeShopId.trim();
    if (!cleanShopId) {
      setIsShopLoading(false);
      return;
    }

    // Check if we already have this shop loaded in memory
    const existingInState = platformState.shops.find(
      (s) =>
        (s.shopId && s.shopId.trim().toLowerCase() === cleanShopId.toLowerCase()) ||
        (s.id && s.id.trim().toLowerCase() === cleanShopId.toLowerCase())
    );

    // If shop is not in memory yet, display smooth loading state while fetching from cloud
    if (!existingInState) {
      setIsShopLoading(true);
    }

    // Immediate direct cloud fetch in case shop was just added or visited directly by URL
    fetchShopFromFirestore(cleanShopId)
      .then((fetchedShop) => {
        if (fetchedShop) {
          const safeShop = ensureShopSafetyDefaults(fetchedShop);
          setPlatformState((prev) => {
            const existingIdx = prev.shops.findIndex(
              (s) =>
                (s.shopId && s.shopId.trim().toLowerCase() === safeShop.shopId.trim().toLowerCase()) ||
                (s.id && s.id.trim().toLowerCase() === safeShop.id?.trim().toLowerCase())
            );

            let updatedShops: Shop[];
            if (existingIdx >= 0) {
              const currentLocal = prev.shops[existingIdx];
              const localTime = new Date(currentLocal.updatedAt || 0).getTime();
              const cloudTime = new Date(safeShop.updatedAt || 0).getTime();
              if (localTime >= cloudTime) {
                return prev; // Retain fresh local edits and media
              }
              updatedShops = [...prev.shops];
              updatedShops[existingIdx] = safeShop;
            } else {
              updatedShops = [safeShop, ...prev.shops];
            }
            const updated = { ...prev, shops: updatedShops };
            savePlatformState(updated);
            return updated;
          });
        }
      })
      .finally(() => {
        setIsShopLoading(false);
      });

    // Real-time listener: any product added on mobile will reflect instantly on this device
    const unsubSingle = subscribeToShop(cleanShopId, (liveShop) => {
      if (liveShop && liveShop.shopId) {
        const safeShop = ensureShopSafetyDefaults(liveShop);
        setPlatformState((prev) => {
          const existingIdx = prev.shops.findIndex(
            (s) =>
              (s.shopId && s.shopId.trim().toLowerCase() === safeShop.shopId.trim().toLowerCase()) ||
              (s.id && s.id.trim().toLowerCase() === safeShop.id?.trim().toLowerCase())
          );
          let updatedShops: Shop[];
          if (existingIdx >= 0) {
            const currentLocal = prev.shops[existingIdx];
            const localTime = new Date(currentLocal.updatedAt || 0).getTime();
            const cloudTime = new Date(safeShop.updatedAt || 0).getTime();
            if (localTime >= cloudTime) {
              return prev; // Retain fresh local edits and media
            }
            updatedShops = [...prev.shops];
            updatedShops[existingIdx] = safeShop;
          } else {
            updatedShops = [safeShop, ...prev.shops];
          }
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
          (s.shopId && s.shopId.trim().toLowerCase() === activeShopId.trim().toLowerCase()) ||
          (s.id && s.id.trim().toLowerCase() === activeShopId.trim().toLowerCase())
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

  const isPublicShopView =
    currentView === 'shop' ||
    (currentView === 'vendor-dashboard' && currentRole === 'VENDOR' && Boolean(currentVendorShop)) ||
    (currentView === 'admin-dashboard' && currentRole === 'ADMIN');

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
        {/* Offline-first persistence notice if Firestore daily quota is paused */}
        {isQuotaPaused && (currentView === 'vendor-dashboard' || currentView === 'admin-dashboard') && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs md:text-sm text-amber-900 text-center font-medium flex items-center justify-center gap-2">
            <span>⚡</span>
            <span>
              <strong>Cloud Sync Notice:</strong> Daily free write quota is paused by cloud provider. 
              <strong> Offline-First Local Storage</strong> is active — all your store updates, catalog changes, and settings are safely preserved.
            </span>
          </div>
        )}

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

        {currentView === 'disclaimer' && (
          <DisclaimerPage onNavigateHome={() => handleNavigate('home')} />
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
              onLogin={() => handleOpenAuth('LOGIN', 'Please sign in to access your Vendor Dashboard.')}
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
              onNavigateHome={() => handleNavigate('home')}
            />
          ) : (
            <ProtectedAccessBanner
              requiredRole="ADMIN"
              onLogin={() => handleOpenAuth('ADMIN', 'Please sign in with Admin credentials to access the Super Admin Dashboard.')}
              onGoHome={() => handleNavigate('home')}
            />
          )
        )}

        {/* Dynamic Public Store Page (/shop/{SHOP_ID}) */}
        {currentView === 'shop' && (
          <ErrorBoundary fallbackTitle="Error Loading Store Website">
            <PublicShopPage
              shop={currentPublicShop}
              shopId={activeShopId || undefined}
              isLoading={isShopLoading}
              popups={platformState.popups}
              globalPopupEnabled={platformState.globalPopupEnabled}
              onNavigateHome={() => handleNavigate('home')}
              onOpenVendorLogin={() => handleOpenAuth('LOGIN')}
              onNavigateToDashboard={() => handleNavigate('vendor-dashboard')}
              onSubmitInquiry={handleSubmitShopInquiry}
              isVendorOrAdminPreview={
                currentRole === 'ADMIN' ||
                (currentRole === 'VENDOR' && loggedVendorShopId === currentPublicShop?.shopId)
              }
            />
          </ErrorBoundary>
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
        pricingPackages={platformState.pricingPackages}
        activePlanPrice={platformState.pricingPackages?.[0]?.price ?? 1499}
        activePlanName={platformState.pricingPackages?.[0]?.name ?? '1-Year Official LalaJi Store Plan'}
        onRegisterShop={(newShop) => {
          handleUpdateState({
            ...platformState,
            shops: [newShop, ...platformState.shops],
          });
        }}
        onVendorLoginSuccess={handleVendorLoginSuccess}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}

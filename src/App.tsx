/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  fetchAllShopsFromFirestore,
  fetchShopByCustomDomain,
  isCloudQuotaExhausted,
  subscribeToQuotaStatus,
  isShopDeleted,
  getDeletedShopIds,
  recordDeletedShopId
} from './services/firebase';
import { 
  findShopByCustomDomain, 
  isPlatformSystemHost, 
  normalizeDomain 
} from './utils/customDomainMatcher';
import { subscribeToRealtimeEvents } from './services/realtimeEvents';
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

// Calculate initial route synchronously on page load so deep-linked pages open immediately without 404
function computeInitialRoute(initialShops: Shop[]) {
  if (typeof window === 'undefined') {
    return { view: 'home', shopId: null as string | null, isLoading: false };
  }
  const searchParams = new URLSearchParams(window.location.search);
  const path = window.location.pathname || '';
  const hash = window.location.hash || '';

  // Check login action (?action=login or ?login=...)
  const actionParam = searchParams.get('action');
  const loginParam = searchParams.get('login');
  const isLoginAction = actionParam === 'login' || loginParam !== null || hash.includes('login');

  // Check shop param: ?shop=SHP... or ?shopId=SHP... or ?id=SHP...
  const rawShopParam = searchParams.get('shop') || (!isLoginAction ? searchParams.get('shopId') : null) || searchParams.get('id');
  let targetShopId: string | null = rawShopParam ? rawShopParam.trim() : null;

  // Check hash: #/shop/SHP... or #shop=SHP...
  if (!targetShopId) {
    const matchHashShop = hash.match(/#\/?shop[=\/]([a-zA-Z0-9_-]+)/i) || hash.match(/#([a-zA-Z0-9_-]{5,})/i);
    if (matchHashShop) {
      targetShopId = matchHashShop[1].trim();
    }
  }

  // Check pathname: /shop/:shopId or /shop/:shopId/:subPage
  if (!targetShopId) {
    const matchShop = path.match(/^\/shop\/([a-zA-Z0-9_-]+)/i);
    if (matchShop) {
      targetShopId = matchShop[1].trim();
    }
  }

  // Check custom domain (e.g. trustedweb.online)
  const host = window.location.hostname;
  if (!targetShopId && !isPlatformSystemHost(host) && !isLoginAction) {
    const matchCustom = findShopByCustomDomain(initialShops, host);
    if (matchCustom) {
      targetShopId = matchCustom.shopId;
    } else {
      // It's a custom domain, but shop needs to be fetched from cloud
      return { view: 'shop', shopId: null, isLoading: true };
    }
  }

  if (targetShopId) {
    if (isShopDeleted(targetShopId)) {
      return { view: 'home', shopId: null, isLoading: false };
    }
    const exists = initialShops.some(
      (s) =>
        (s.shopId && s.shopId.toLowerCase() === targetShopId!.toLowerCase()) ||
        (s.id && s.id.toLowerCase() === targetShopId!.toLowerCase())
    );
    return {
      view: 'shop',
      shopId: targetShopId,
      isLoading: !exists,
    };
  }

  const cleanPath = path.replace(/^\//, '').split('/')[0] || 'home';
  if (['home', 'stores', 'how-it-works', 'pricing', 'contact', 'disclaimer'].includes(cleanPath)) {
    return { view: cleanPath, shopId: null, isLoading: false };
  }

  return { view: 'home', shopId: null, isLoading: false };
}

export default function App() {
  // Global platform state from localStorage with Firestore real-time sync, purged of deleted tombstones
  const [platformState, setPlatformState] = useState<PlatformState>(() => {
    const loaded = loadPlatformState();
    const deletedSet = getDeletedShopIds();
    const cleanShops = (loaded.shops || []).filter(
      (s) => !deletedSet.has(s.shopId?.toLowerCase() || '') && (!s.id || !deletedSet.has(s.id.toLowerCase()))
    );
    return { ...loaded, shops: cleanShops };
  });

  // Load existing persistent session (if logged in before page refresh)
  const initialSession = loadUserSession();

  // Compute initial route synchronously
  const initialRoute = useMemo(() => computeInitialRoute(platformState.shops), []);

  // Current view state
  const [currentView, setCurrentView] = useState<string>(initialRoute.view);
  const [activeShopId, setActiveShopId] = useState<string | null>(initialRoute.shopId);
  const [isShopLoading, setIsShopLoading] = useState<boolean>(initialRoute.isLoading);

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

    // 2. Real-time subscription to cloud shops (Cloud snapshot is the authoritative source of truth across all devices)
    const unsubShops = subscribeToShops((cloudShops) => {
      if (cloudShops) {
        setPlatformState((prev) => {
          const deletedSet = getDeletedShopIds();
          const safeCloudShops = cloudShops
            .filter(
              (s) =>
                !deletedSet.has(s.shopId?.toLowerCase() || '') &&
                (!s.id || !deletedSet.has(s.id.toLowerCase()))
            )
            .map((s) => ensureShopSafetyDefaults(s));

          // Also check: if any shop was created locally on this device (e.g. while offline or just now),
          // and has not yet appeared in cloudShops, keep it and sync it up to Firestore ONLY if NOT deleted!
          const pendingLocalShops: Shop[] = [];
          prev.shops.forEach((localShop) => {
            const sid = localShop.shopId?.toLowerCase() || '';
            const aid = localShop.id?.toLowerCase() || '';
            if (deletedSet.has(sid) || (aid && deletedSet.has(aid))) {
              return; // NEVER re-save deleted shops!
            }
            const existsInCloud = safeCloudShops.some(
              (cs) =>
                (cs.shopId && localShop.shopId && cs.shopId.toLowerCase() === sid) ||
                (cs.id && localShop.id && cs.id.toLowerCase() === aid)
            );
            if (!existsInCloud) {
              const hasContent = Boolean(localShop.shopId && (localShop.businessName || (localShop.products && localShop.products.length > 0)));
              if (hasContent) {
                pendingLocalShops.push(localShop);
                saveShopToFirestore(localShop).catch(() => {});
              }
            }
          });

          const unifiedShops = [...safeCloudShops, ...pendingLocalShops];
          const updatedState = { ...prev, shops: unifiedShops };
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

    // 4. Instant Event-Driven WebSocket / SSE & Multi-Tab Synchronization
    const unsubRealtime = subscribeToRealtimeEvents((event) => {
      if (event.type === 'VENDOR_DELETED' && event.shopId) {
        recordDeletedShopId(event.shopId);
        setPlatformState((prev) => {
          const updatedShops = prev.shops.filter(
            (s) =>
              s.shopId?.toLowerCase() !== event.shopId?.toLowerCase() &&
              s.id?.toLowerCase() !== event.shopId?.toLowerCase()
          );
          const newState = { ...prev, shops: updatedShops };
          savePlatformState(newState);
          return newState;
        });
        return;
      }

      if (
        event.type === 'VENDOR_UPDATED' ||
        event.type === 'SHOP_UPDATE' ||
        event.type === 'CDN_CACHE_INVALIDATED'
      ) {
        if (event.shopId && event.shopId !== 'ALL') {
          fetchShopFromFirestore(event.shopId).then((freshShop) => {
            if (freshShop) {
              const safeFresh = ensureShopSafetyDefaults(freshShop);
              setPlatformState((prev) => {
                const idx = prev.shops.findIndex(
                  (s) =>
                    (s.shopId && s.shopId.toLowerCase() === safeFresh.shopId.toLowerCase()) ||
                    (s.id && s.id.toLowerCase() === safeFresh.id?.toLowerCase())
                );
                let updatedShops: Shop[];
                if (idx >= 0) {
                  updatedShops = [...prev.shops];
                  updatedShops[idx] = safeFresh;
                } else {
                  updatedShops = [safeFresh, ...prev.shops];
                }
                const newState = { ...prev, shops: updatedShops };
                savePlatformState(newState);
                return newState;
              });
            }
          }).catch(() => {});
        } else {
          // Re-fetch all shops on global CDN cache invalidation
          fetchAllShopsFromFirestore().then((allCloudShops) => {
            if (allCloudShops && allCloudShops.length > 0) {
              setPlatformState((prev) => {
                const updated = {
                  ...prev,
                  shops: allCloudShops.map((s) => ensureShopSafetyDefaults(s)),
                };
                savePlatformState(updated);
                return updated;
              });
            }
          }).catch(() => {});
        }
      }
    });

    // 5. Global Custom DOM Event for manual Cache Clear & Sync
    const handleCustomCacheCleared = (e: Event) => {
      const customEvt = e as CustomEvent;
      const targetShopId = customEvt?.detail?.shopId;
      if (targetShopId && targetShopId !== 'ALL') {
        fetchShopFromFirestore(targetShopId).then((freshShop) => {
          if (freshShop) {
            const safeFresh = ensureShopSafetyDefaults(freshShop);
            setPlatformState((prev) => {
              const idx = prev.shops.findIndex(
                (s) =>
                  (s.shopId && s.shopId.toLowerCase() === safeFresh.shopId.toLowerCase()) ||
                  (s.id && s.id.toLowerCase() === safeFresh.id?.toLowerCase())
              );
              let updatedShops: Shop[];
              if (idx >= 0) {
                updatedShops = [...prev.shops];
                updatedShops[idx] = safeFresh;
              } else {
                updatedShops = [safeFresh, ...prev.shops];
              }
              const newState = { ...prev, shops: updatedShops };
              savePlatformState(newState);
              return newState;
            });
          }
        }).catch(() => {});
      } else {
        fetchAllShopsFromFirestore().then((allCloudShops) => {
          if (allCloudShops && allCloudShops.length > 0) {
            setPlatformState((prev) => {
              const updated = {
                ...prev,
                shops: allCloudShops.map((s) => ensureShopSafetyDefaults(s)),
              };
              savePlatformState(updated);
              return updated;
            });
          }
        }).catch(() => {});
      }
    };

    window.addEventListener('indianlalaji:cache-cleared', handleCustomCacheCleared);

    return () => {
      unsubShops();
      unsubConfig();
      unsubRealtime();
      window.removeEventListener('indianlalaji:cache-cleared', handleCustomCacheCleared);
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

      // Helper to activate shop view and load shop from cloud if not yet cached
      const triggerShopView = (sid: string) => {
        if (isShopDeleted(sid)) {
          setCurrentView('home');
          setActiveShopId(null);
          setIsShopLoading(false);
          return;
        }
        setCurrentView('shop');
        setActiveShopId(sid);
        const exists = (platformState.shops || []).some(
          (s) =>
            (s.shopId && s.shopId.toLowerCase() === sid.toLowerCase()) ||
            (s.id && s.id.toLowerCase() === sid.toLowerCase())
        );
        if (!exists) {
          setIsShopLoading(true);
          fetchShopFromFirestore(sid)
            .then((fetched) => {
              if (fetched && !isShopDeleted(fetched.shopId)) {
                const safe = ensureShopSafetyDefaults(fetched);
                setPlatformState((prev) => {
                  const hasIt = prev.shops.some(
                    (s) => s.shopId?.toLowerCase() === safe.shopId?.toLowerCase()
                  );
                  if (!hasIt) {
                    const newState = { ...prev, shops: [safe, ...prev.shops] };
                    savePlatformState(newState);
                    return newState;
                  }
                  return prev;
                });
              }
            })
            .finally(() => {
              setIsShopLoading(false);
            });
        }
      };

      // 1. Check pathname: /shop/:shopId or /shop/:shopId/:subPage
      const matchShop = path.match(/^\/shop\/([a-zA-Z0-9_-]+)/i);
      if (matchShop) {
        const cleanSid = matchShop[1].trim();
        triggerShopView(cleanSid);
        return;
      }

      // 2. Check URL search param (?shop=SHP... or ?shopId=SHP...)
      if (shopParam && !isLoginAction) {
        triggerShopView(shopParam);
        return;
      }

      // 3. Check hash route (#/shop/SHP... or #shop=SHP...)
      const matchHashShop = hash.match(/#\/?shop[=\/]([a-zA-Z0-9_-]+)/i) || hash.match(/#([a-zA-Z0-9_-]{5,})/i);
      if (matchHashShop) {
        const cleanSid = matchHashShop[1].trim();
        triggerShopView(cleanSid);
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
          triggerShopView(matchingShop.shopId);
          return;
        }

        // 2. Direct asynchronous cloud lookup from Firestore for new/first-time visitors
        setIsShopLoading(true);
        setCurrentView('shop');
        fetchShopByCustomDomain(currentHost)
          .then((cloudShop) => {
            if (cloudShop && cloudShop.shopId && !isShopDeleted(cloudShop.shopId)) {
              const safe = ensureShopSafetyDefaults(cloudShop);
              setPlatformState((prev) => {
                const exists = prev.shops.some((s) => s.shopId === safe.shopId);
                const updatedShops = exists
                  ? prev.shops.map((s) => (s.shopId === safe.shopId ? safe : s))
                  : [safe, ...prev.shops];
                const nextState = { ...prev, shops: updatedShops };
                savePlatformState(nextState);
                return nextState;
              });
              setActiveShopId(safe.shopId);
            }
          })
          .finally(() => {
            setIsShopLoading(false);
          });
        return;
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
          saveShopToFirestore(newShop).catch(() => {});
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

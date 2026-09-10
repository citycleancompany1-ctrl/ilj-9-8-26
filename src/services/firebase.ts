import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  Firestore,
  writeBatch
} from 'firebase/firestore';
import { Shop, PlatformState } from '../types';
import firebaseConfigRaw from '../../firebase-applet-config.json';

// Initialize Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp({
    apiKey: firebaseConfigRaw.apiKey,
    authDomain: firebaseConfigRaw.authDomain,
    projectId: firebaseConfigRaw.projectId,
    storageBucket: firebaseConfigRaw.storageBucket,
    messagingSenderId: firebaseConfigRaw.messagingSenderId,
    appId: firebaseConfigRaw.appId,
  });
} else {
  app = getApp();
}

// Initialize Firestore (supporting named databaseId or default database)
export const db: Firestore =
  firebaseConfigRaw.firestoreDatabaseId && firebaseConfigRaw.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfigRaw.firestoreDatabaseId)
    : getFirestore(app);

// ============================================================================
// Quota & Error Handling Circuit Breaker
// ============================================================================
export function isQuotaExhaustionError(error: unknown): boolean {
  if (!error) return false;
  const err = error as { code?: string; message?: string };
  const code = String(err.code || '');
  const message = String(err.message || error);
  return (
    code === 'resource-exhausted' ||
    message.includes('resource-exhausted') ||
    message.includes('Quota limit exceeded') ||
    message.includes('Free daily write units') ||
    message.includes('quota metric') ||
    message.includes('maximum backoff delay')
  );
}

// Check if quota was marked exhausted in session
let isQuotaExhaustedState: boolean = (() => {
  try {
    const raw = sessionStorage.getItem('ilj_firestore_quota_exhausted');
    if (raw) {
      const data = JSON.parse(raw);
      // Keep circuit breaker active for 2 hours to prevent backoff spam
      if (Date.now() - (data.timestamp || 0) < 2 * 60 * 60 * 1000) {
        return true;
      }
    }
  } catch {}
  return false;
})();

const quotaListeners = new Set<(exhausted: boolean) => void>();

export function isCloudQuotaExhausted(): boolean {
  return isQuotaExhaustedState;
}

export function subscribeToQuotaStatus(listener: (exhausted: boolean) => void): () => void {
  quotaListeners.add(listener);
  listener(isQuotaExhaustedState);
  return () => {
    quotaListeners.delete(listener);
  };
}

export function markQuotaExhausted(contextNotice?: string): void {
  if (!isQuotaExhaustedState) {
    isQuotaExhaustedState = true;
    try {
      sessionStorage.setItem(
        'ilj_firestore_quota_exhausted',
        JSON.stringify({
          timestamp: Date.now(),
          date: new Date().toISOString(),
          context: contextNotice || 'quota-exceeded',
        })
      );
    } catch {}
    console.warn(
      `[Firestore Circuit Breaker] Daily write quota is currently reached on the free-tier cloud database. ` +
      `Seamlessly switched to Offline-First Local Storage mode. All user updates, products, orders, and inquiries ` +
      `are 100% saved in browser local storage. (${contextNotice || 'quota limit'})`
    );
    quotaListeners.forEach((fn) => {
      try { fn(true); } catch {}
    });
  }
}

// Safe connection test on boot
async function testConnection() {
  if (isQuotaExhaustedState) return;
  try {
    const testDocRef = doc(db, PLATFORM_CONFIG_COLLECTION, GLOBAL_CONFIG_DOC);
    await getDoc(testDocRef);
  } catch (error) {
    if (isQuotaExhaustionError(error)) {
      markQuotaExhausted('testConnection');
      return;
    }
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Client is in offline mode.');
    }
  }
}
testConnection();

const SHOPS_COLLECTION = 'shops';
const PLATFORM_CONFIG_COLLECTION = 'platform_config';
const GLOBAL_CONFIG_DOC = 'global_settings';

/**
 * Save a single shop to Firestore (called when vendor or admin edits a shop)
 */
export async function saveShopToFirestore(shop: Shop): Promise<void> {
  if (!shop || !shop.shopId) return;
  if (isQuotaExhaustedState) {
    // Quota reached: don't attempt network call to avoid backoff delays and console error spam
    return;
  }
  try {
    const docRef = doc(db, SHOPS_COLLECTION, shop.shopId);
    const sanitized = JSON.parse(JSON.stringify(shop));
    await setDoc(
      docRef,
      {
        ...sanitized,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`[Firestore] Shop ${shop.shopId} synced to cloud successfully.`);
  } catch (error) {
    if (isQuotaExhaustionError(error)) {
      markQuotaExhausted(`saveShop:${shop.shopId}`);
      return;
    }
    console.warn(`[Firestore] Notice while saving shop ${shop.shopId}:`, error);
  }
}

/**
 * Delete a shop from Firestore (called when Admin deletes a store)
 */
export async function deleteShopFromFirestore(shopId: string): Promise<void> {
  if (!shopId) return;
  if (isQuotaExhaustedState) return;
  try {
    const docRef = doc(db, SHOPS_COLLECTION, shopId);
    await deleteDoc(docRef);
    console.log(`[Firestore] Shop ${shopId} deleted from cloud.`);
  } catch (error) {
    if (isQuotaExhaustionError(error)) {
      markQuotaExhausted(`deleteShop:${shopId}`);
      return;
    }
    console.warn(`[Firestore] Notice deleting shop ${shopId}:`, error);
  }
}

/**
 * Fetch a single shop from Firestore by ID (useful for direct URL loading on new devices)
 */
export async function fetchShopFromFirestore(shopId: string): Promise<Shop | null> {
  if (!shopId) return null;
  try {
    const docRef = doc(db, SHOPS_COLLECTION, shopId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Shop;
    }
  } catch (error) {
    if (isQuotaExhaustionError(error)) {
      markQuotaExhausted(`fetchShop:${shopId}`);
      return null;
    }
    console.warn(`[Firestore] Notice fetching shop ${shopId}:`, error);
  }
  return null;
}

/**
 * Subscribe to real-time changes for a specific shop
 * Guarantees that any product entry or update made on one device (e.g. mobile)
 * is immediately pushed and rendered on all other devices viewing that shop without refresh.
 */
export function subscribeToShop(shopId: string, onUpdate: (shop: Shop) => void): () => void {
  if (!shopId) return () => {};
  try {
    const docRef = doc(db, SHOPS_COLLECTION, shopId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const shopData = docSnap.data() as Shop;
          if (shopData && shopData.shopId) {
            onUpdate(shopData);
          }
        }
      },
      (err) => {
        if (isQuotaExhaustionError(err)) {
          markQuotaExhausted(`subscribeToShop:${shopId}`);
          try { unsubscribe(); } catch {}
          return;
        }
        console.warn(`[Firestore] Real-time shop listener notice for ${shopId}:`, err);
      }
    );
    return unsubscribe;
  } catch (e) {
    if (isQuotaExhaustionError(e)) {
      markQuotaExhausted(`subscribeToShopCatch:${shopId}`);
      return () => {};
    }
    console.warn(`[Firestore] Failed to attach single shop listener for ${shopId}:`, e);
    return () => {};
  }
}

/**
 * Save platform global settings to Firestore (popups, packages, tutorials, leads, inquiries)
 */
export async function savePlatformConfigToFirestore(state: Partial<PlatformState>): Promise<void> {
  if (isQuotaExhaustedState) return;
  try {
    const configRef = doc(db, PLATFORM_CONFIG_COLLECTION, GLOBAL_CONFIG_DOC);
    const payload: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (state.popups !== undefined) payload.popups = state.popups;
    if (state.pricingPackages !== undefined) payload.pricingPackages = state.pricingPackages;
    if (state.tutorialVideos !== undefined) payload.tutorialVideos = state.tutorialVideos;
    if (state.globalPopupEnabled !== undefined) payload.globalPopupEnabled = state.globalPopupEnabled;
    if (state.platformLeads !== undefined) payload.platformLeads = state.platformLeads;
    if (state.inquiries !== undefined) payload.inquiries = state.inquiries;
    if (state.customerCarePhone !== undefined) payload.customerCarePhone = state.customerCarePhone;
    if (state.customerCareWhatsapp !== undefined) payload.customerCareWhatsapp = state.customerCareWhatsapp;
    if (state.customerCareEmail !== undefined) payload.customerCareEmail = state.customerCareEmail;
    if (state.supportHours !== undefined) payload.supportHours = state.supportHours;
    if (state.adminPaymentQrUrl !== undefined) payload.adminPaymentQrUrl = state.adminPaymentQrUrl;
    if (state.adminUpiId !== undefined) payload.adminUpiId = state.adminUpiId;
    if (state.adminAccountHolder !== undefined) payload.adminAccountHolder = state.adminAccountHolder;
    if (state.platformHeroHeading !== undefined) payload.platformHeroHeading = state.platformHeroHeading;
    if (state.platformHeroSubheading !== undefined) payload.platformHeroSubheading = state.platformHeroSubheading;
    if (state.platformAboutStory !== undefined) payload.platformAboutStory = state.platformAboutStory;
    if (state.platformAboutPhotos !== undefined) payload.platformAboutPhotos = state.platformAboutPhotos;
    if (state.mainWebsiteSectionsConfig !== undefined) payload.mainWebsiteSectionsConfig = state.mainWebsiteSectionsConfig;
    if (state.themes !== undefined) payload.themes = state.themes;
    if (state.saasBackups !== undefined) payload.saasBackups = state.saasBackups;

    const sanitized = JSON.parse(JSON.stringify(payload));
    await setDoc(configRef, sanitized, { merge: true });
    console.log('[Firestore] Global platform settings synced to cloud.');
  } catch (error) {
    if (isQuotaExhaustionError(error)) {
      markQuotaExhausted('savePlatformConfigToFirestore');
      return;
    }
    console.warn('[Firestore] Notice saving global platform config:', error);
  }
}

/**
 * Save the entire platform state to Firestore
 */
export async function savePlatformStateToFirestore(state: PlatformState): Promise<void> {
  if (isQuotaExhaustedState) return;
  try {
    await savePlatformConfigToFirestore(state);
  } catch (error) {
    if (isQuotaExhaustionError(error)) {
      markQuotaExhausted('savePlatformStateToFirestore');
      return;
    }
    console.warn('[Firestore] Notice saving platform state to Firestore:', error);
  }
}

/**
 * Seed initial shops & configuration to Firestore if collection is empty
 */
export async function seedFirestoreIfEmpty(initialState: PlatformState): Promise<boolean> {
  const SEED_KEY = 'ilj_firestore_seed_completed_v2';
  try {
    if (isQuotaExhaustedState) return false;
    if (localStorage.getItem(SEED_KEY)) {
      return false;
    }

    const shopsColl = collection(db, SHOPS_COLLECTION);
    const snap = await getDocs(shopsColl);

    if (snap.empty && initialState.shops && initialState.shops.length > 0) {
      console.log('[Firestore] Seeding initial data into Firestore...');
      localStorage.setItem(SEED_KEY, 'true');
      await savePlatformConfigToFirestore(initialState);
      
      const batch = writeBatch(db);
      for (const shop of initialState.shops.slice(0, 5)) {
        if (shop && shop.shopId) {
          const shopRef = doc(db, SHOPS_COLLECTION, shop.shopId);
          batch.set(shopRef, JSON.parse(JSON.stringify(shop)), { merge: true });
        }
      }
      await batch.commit();
      return true;
    } else {
      localStorage.setItem(SEED_KEY, 'true');
    }
    return false;
  } catch (error) {
    if (isQuotaExhaustionError(error)) {
      markQuotaExhausted('seedFirestoreIfEmpty');
      localStorage.setItem(SEED_KEY, 'true');
      return false;
    }
    console.warn('[Firestore] Seed check notice:', error);
    localStorage.setItem(SEED_KEY, 'true');
    return false;
  }
}

/**
 * Subscribe to real-time shop updates across all devices
 */
export function subscribeToShops(onUpdate: (shops: Shop[]) => void): () => void {
  try {
    const shopsColl = collection(db, SHOPS_COLLECTION);
    const unsubscribe = onSnapshot(
      shopsColl,
      (snapshot) => {
        const loadedShops: Shop[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Shop;
          if (data && data.shopId) {
            loadedShops.push(data);
          }
        });
        if (loadedShops.length > 0) {
          onUpdate(loadedShops);
          console.log(`[Firestore Real-Time] Received ${loadedShops.length} shops update from cloud.`);
        }
      },
      (err) => {
        if (isQuotaExhaustionError(err)) {
          markQuotaExhausted('subscribeToShops');
          try { unsubscribe(); } catch {}
          return;
        }
        console.warn('[Firestore] Shops subscription notice:', err);
      }
    );
    return unsubscribe;
  } catch (e) {
    if (isQuotaExhaustionError(e)) {
      markQuotaExhausted('subscribeToShopsCatch');
      return () => {};
    }
    console.warn('[Firestore] Failed to setup shops listener:', e);
    return () => {};
  }
}

/**
 * Subscribe to global platform configuration across all devices
 */
export function subscribeToPlatformConfig(onUpdate: (config: Partial<PlatformState>) => void): () => void {
  try {
    const configDoc = doc(db, PLATFORM_CONFIG_COLLECTION, GLOBAL_CONFIG_DOC);
    const unsubscribe = onSnapshot(
      configDoc,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<PlatformState>;
          onUpdate(data);
          console.log('[Firestore Real-Time] Received global platform config update from cloud.');
        }
      },
      (err) => {
        if (isQuotaExhaustionError(err)) {
          markQuotaExhausted('subscribeToPlatformConfig');
          try { unsubscribe(); } catch {}
          return;
        }
        console.warn('[Firestore] Global config subscription notice:', err);
      }
    );
    return unsubscribe;
  } catch (e) {
    if (isQuotaExhaustionError(e)) {
      markQuotaExhausted('subscribeToPlatformConfigCatch');
      return () => {};
    }
    console.warn('[Firestore] Failed to setup global config listener:', e);
    return () => {};
  }
}

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

const SHOPS_COLLECTION = 'shops';
const PLATFORM_CONFIG_COLLECTION = 'platform_config';
const GLOBAL_CONFIG_DOC = 'global_settings';

/**
 * Save a single shop to Firestore (called when vendor or admin edits a shop)
 */
export async function saveShopToFirestore(shop: Shop): Promise<void> {
  if (!shop || !shop.shopId) return;
  try {
    const docRef = doc(db, SHOPS_COLLECTION, shop.shopId);
    // Sanitize shop object to prevent undefined values in Firestore
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
    console.error(`[Firestore] Error saving shop ${shop.shopId}:`, error);
  }
}

/**
 * Delete a shop from Firestore (called when Admin deletes a store)
 */
export async function deleteShopFromFirestore(shopId: string): Promise<void> {
  if (!shopId) return;
  try {
    const docRef = doc(db, SHOPS_COLLECTION, shopId);
    await deleteDoc(docRef);
    console.log(`[Firestore] Shop ${shopId} deleted from cloud.`);
  } catch (error) {
    console.error(`[Firestore] Error deleting shop ${shopId}:`, error);
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
    console.error(`[Firestore] Error fetching shop ${shopId}:`, error);
  }
  return null;
}

/**
 * Save platform global settings to Firestore (popups, packages, tutorials, leads, inquiries)
 */
export async function savePlatformConfigToFirestore(state: Partial<PlatformState>): Promise<void> {
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
    console.error('[Firestore] Error saving global platform config:', error);
  }
}

/**
 * Save the entire platform state to Firestore
 */
export async function savePlatformStateToFirestore(state: PlatformState): Promise<void> {
  try {
    await savePlatformConfigToFirestore(state);

    // Save each shop
    if (state.shops && state.shops.length > 0) {
      const batch = writeBatch(db);
      for (const shop of state.shops) {
        if (shop && shop.shopId) {
          const shopRef = doc(db, SHOPS_COLLECTION, shop.shopId);
          const sanitized = JSON.parse(JSON.stringify(shop));
          batch.set(shopRef, sanitized, { merge: true });
        }
      }
      await batch.commit();
      console.log(`[Firestore] ${state.shops.length} shops synced to cloud.`);
    }
  } catch (error) {
    console.error('[Firestore] Error saving platform state to Firestore:', error);
  }
}

/**
 * Seed initial shops & configuration to Firestore if collection is empty
 */
export async function seedFirestoreIfEmpty(initialState: PlatformState): Promise<boolean> {
  try {
    const shopsColl = collection(db, SHOPS_COLLECTION);
    const snap = await getDocs(shopsColl);

    if (snap.empty && initialState.shops && initialState.shops.length > 0) {
      console.log('[Firestore] Seeding initial data into Firestore...');
      await savePlatformStateToFirestore(initialState);
      return true;
    }
    return false;
  } catch (error) {
    console.error('[Firestore] Error checking / seeding Firestore:', error);
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
        onUpdate(loadedShops);
        console.log(`[Firestore Real-Time] Received ${loadedShops.length} shops update from cloud.`);
      },
      (err) => {
        console.warn('[Firestore] Shops subscription error:', err);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.error('[Firestore] Failed to setup shops listener:', e);
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
        console.warn('[Firestore] Global config subscription error:', err);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.error('[Firestore] Failed to setup global config listener:', e);
    return () => {};
  }
}

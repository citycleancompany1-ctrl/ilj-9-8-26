import { resetQuotaExhausted } from './firebase';
import { triggerCdnInvalidation, publishRealtimeEvent } from './realtimeEvents';

export interface CachePurgeResult {
  success: boolean;
  timestamp: number;
  clearedItems: string[];
  cdnPurged: boolean;
  cdnVersion?: number;
}

const STORAGE_KEY = 'INDIANLALAJI_SAAS_STATE_V1';

/**
 * Global Platform Cache & Synchronization Engine
 * Completely purges stale browser caches, resets localStorage & quota flags,
 * issues instant CDN & Edge purge requests to Node server, and broadcasts real-time
 * invalidation events to ensure immediate reflection of changes.
 */
export async function clearPlatformCache(options?: {
  shopId?: string;
  hardReload?: boolean;
}): Promise<CachePurgeResult> {
  const cleared: string[] = [];
  const targetShopId = options?.shopId;

  // 1. Reset Firestore Quota Circuit Breakers in sessionStorage & in-memory state
  try {
    resetQuotaExhausted();
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('ilj_firestore_quota_exhausted');
      sessionStorage.removeItem('ilj_firestore_seed_completed_v2');
      cleared.push('Cloud Quota Circuit Breaker & Session Flags');
    }
  } catch (e) {
    console.warn('[CacheManager] Error clearing session flags:', e);
  }

  // 2. Clear Browser Cache Storage API (if service worker or cache storage exists)
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cacheNames = await window.caches.keys();
      for (const name of cacheNames) {
        await window.caches.delete(name);
      }
      if (cacheNames.length > 0) {
        cleared.push(`Browser Cache Storage (${cacheNames.length} caches)`);
      }
    } catch (e) {
      console.warn('[CacheManager] CacheStorage deletion notice:', e);
    }
  }

  // 3. Clear Stale LocalStorage Cache so app re-fetches authoritative data from Firestore
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('ilj_firestore_seed_completed_v2');
      cleared.push('Local State Cache (INDIANLALAJI_SAAS_STATE_V1)');
    }
  } catch (e) {
    console.warn('[CacheManager] LocalStorage purge error:', e);
  }

  // 4. Trigger Server CDN and Edge Cache Invalidation via HTTP Headers
  let cdnPurged = false;
  let newCdnVersion: number | undefined;
  try {
    const cdnRes = await triggerCdnInvalidation({
      shopId: targetShopId || 'ALL',
      paths: ['/', targetShopId ? `/shop/${targetShopId}` : '/shop/*'],
    });
    cdnPurged = cdnRes.success;
    newCdnVersion = cdnRes.cdnVersion;
    if (cdnPurged) {
      cleared.push(`Server CDN & Edge Cache (Purged version: ${newCdnVersion})`);
    }
  } catch (e) {
    console.warn('[CacheManager] CDN invalidation notice:', e);
  }

  // 5. Broadcast Event across all active browser tabs and SSE connections
  try {
    await publishRealtimeEvent({
      type: 'CDN_CACHE_INVALIDATED',
      shopId: targetShopId || 'ALL',
      action: 'PURGE_CACHE',
      data: { timestamp: Date.now(), cdnVersion: newCdnVersion },
    });
    cleared.push('Real-time Tab & Device Invalidation Broadcast (SSE + BroadcastChannel)');
  } catch (e) {
    console.warn('[CacheManager] Realtime broadcast notice:', e);
  }

  // 6. Dispatch custom DOM event for instant React component re-rendering
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('indianlalaji:cache-cleared', {
        detail: {
          timestamp: Date.now(),
          shopId: targetShopId,
          cdnVersion: newCdnVersion,
        },
      })
    );
  }

  console.log(`[CacheManager] Platform cache cleared successfully. Items: ${cleared.join(', ')}`);

  // 7. Optional Hard Reload
  if (options?.hardReload && typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.reload();
    }, 400);
  }

  return {
    success: true,
    timestamp: Date.now(),
    clearedItems: cleared,
    cdnPurged,
    cdnVersion: newCdnVersion,
  };
}

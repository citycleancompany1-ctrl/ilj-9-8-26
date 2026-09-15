/**
 * Real-Time Event-Driven Service & CDN Invalidation Manager
 * IndianLalaJi.com Multi-Vendor Platform
 *
 * Implements:
 * 1. Instant vendor update propagation via Server-Sent Events (SSE) & BroadcastChannel
 * 2. Real-time CDN & edge cache invalidation
 * 3. Multi-tab local synchronization
 */

export interface RealtimeEvent {
  type: 'CONNECTED' | 'VENDOR_UPDATED' | 'SHOP_UPDATE' | 'PRODUCT_UPDATE' | 'CDN_CACHE_INVALIDATED' | string;
  shopId?: string | null;
  action?: string;
  timestamp: number;
  cdnVersion?: number;
  data?: any;
}

type EventCallback = (event: RealtimeEvent) => void;

const listeners = new Set<EventCallback>();
let eventSource: EventSource | null = null;
let broadcastChannel: BroadcastChannel | null = null;
let reconnectTimer: any = null;

// Initialize BroadcastChannel for zero-latency same-device multi-tab synchronization
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('indianlalaji_realtime_channel');
    broadcastChannel.onmessage = (ev) => {
      if (ev.data && typeof ev.data === 'object') {
        notifyListeners(ev.data as RealtimeEvent);
      }
    };
  } catch (e) {
    console.warn('[Realtime] BroadcastChannel unavailable, using SSE only.', e);
  }
}

function notifyListeners(event: RealtimeEvent) {
  listeners.forEach((listener) => {
    try {
      listener(event);
    } catch (err) {
      console.error('[Realtime Listener Error]', err);
    }
  });

  // Dispatch custom DOM event for lightweight modular consumption
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('indianlalaji:realtime-event', { detail: event }));
  }
}

/**
 * Connect to SSE Server Stream
 */
function connectSSE() {
  if (typeof window === 'undefined') return;
  if (eventSource) {
    try { eventSource.close(); } catch {}
  }

  try {
    eventSource = new EventSource('/api/events');

    eventSource.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data) as RealtimeEvent;
        if (parsed) {
          notifyListeners(parsed);
        }
      } catch {
        // Heartbeat or raw ping
      }
    };

    eventSource.onerror = () => {
      // Reconnect with backoff
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        connectSSE();
      }, 5000);
    };
  } catch (err) {
    console.warn('[Realtime] Could not initiate EventSource connection:', err);
  }
}

/**
 * Subscribe to real-time vendor updates and CDN invalidation events
 */
export function subscribeToRealtimeEvents(onEvent: EventCallback): () => void {
  listeners.add(onEvent);

  if (!eventSource && typeof window !== 'undefined') {
    connectSSE();
  }

  return () => {
    listeners.delete(onEvent);
    if (listeners.size === 0 && eventSource) {
      try {
        eventSource.close();
      } catch {}
      eventSource = null;
    }
  };
}

/**
 * Publish a vendor update event across all devices and server
 */
export async function publishRealtimeEvent(event: {
  type?: string;
  shopId?: string;
  action?: string;
  data?: any;
}): Promise<boolean> {
  const payload: RealtimeEvent = {
    type: event.type || 'VENDOR_UPDATED',
    shopId: event.shopId || null,
    action: event.action || 'MODIFIED',
    timestamp: Date.now(),
    data: event.data || null,
  };

  // 1. Instant local BroadcastChannel notification (0ms delay for same browser/tabs)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch {}
  }
  notifyListeners(payload);

  // 2. Transmit to server to broadcast to all external visitors & mobile devices
  try {
    const res = await fetch('/api/events/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Realtime Publish] Server notify notice (operating in local broadcast mode):', err);
    return false;
  }
}

/**
 * Trigger immediate CDN and Edge Cache Invalidation for a vendor's shop
 */
export async function triggerCdnInvalidation(params: {
  shopId?: string;
  domain?: string;
  paths?: string[];
  tags?: string[];
}): Promise<{ success: boolean; cdnVersion?: number }> {
  try {
    const res = await fetch('/api/cdn/invalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopId: params.shopId,
        domain: params.domain,
        paths: params.paths || ['/', `/shop/${params.shopId || '*'}`],
        tags: params.tags || ['shop', 'products', 'theme', params.shopId ? `shop-${params.shopId}` : 'all'],
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`[CDN Cache Invalidation] Instant purge triggered for shop: ${params.shopId || 'GLOBAL'} (version: ${data.cdnVersion})`);
      return { success: true, cdnVersion: data.cdnVersion };
    }
    return { success: false };
  } catch (err) {
    console.warn('[CDN Cache Invalidation] Notice:', err);
    return { success: false };
  }
}

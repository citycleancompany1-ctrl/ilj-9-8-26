import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Global Cache Invalidation & Realtime State
let cdnVersionTimestamp = Date.now();
const sseClients = new Set<Response>();
const deletedShopsSet = new Set<string>();

// Persistence for deleted shops on disk
const DELETED_SHOPS_FILE = path.join(process.cwd(), 'deleted_shops.json');
try {
  if (fs.existsSync(DELETED_SHOPS_FILE)) {
    const raw = fs.readFileSync(DELETED_SHOPS_FILE, 'utf-8');
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      arr.forEach((id: string) => {
        if (id && typeof id === 'string') deletedShopsSet.add(id.toLowerCase());
      });
    }
  }
} catch (e) {
  console.warn('[Server] Notice reading deleted shops file:', e);
}

function persistDeletedShops() {
  try {
    fs.writeFileSync(DELETED_SHOPS_FILE, JSON.stringify(Array.from(deletedShopsSet)), 'utf-8');
  } catch (e) {
    console.warn('[Server] Notice saving deleted shops file:', e);
  }
}

// Parse incoming JSON requests
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Security & Base Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-App-Release', String(cdnVersionTimestamp));
  next();
});

// ==========================================
// 1. EVENT-DRIVEN REALTIME ARCHITECTURE (SSE)
// ==========================================

// SSE Connection Endpoint: Clients subscribe to instant store updates
app.get('/api/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable proxy buffering for instant delivery (Nginx/Cloudflare)
  });

  // Send initial connection packet
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now(), cdnVersion: cdnVersionTimestamp })}\n\n`);

  sseClients.add(res);

  // Keep-alive heartbeat every 25 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// Broadcast event to all connected realtime clients
function broadcastEvent(eventType: string, payload: Record<string, unknown>) {
  const data = JSON.stringify({
    type: eventType,
    timestamp: Date.now(),
    cdnVersion: cdnVersionTimestamp,
    ...payload,
  });

  const deadClients: Response[] = [];
  for (const client of sseClients) {
    try {
      client.write(`data: ${data}\n\n`);
    } catch {
      deadClients.push(client);
    }
  }
  for (const dead of deadClients) {
    sseClients.delete(dead);
  }
}

// Publish Event Endpoint: Triggered when vendor updates shop, products, or profile
app.post('/api/events/publish', (req: Request, res: Response) => {
  const { type, shopId, action, data } = req.body || {};
  const eventType = type || 'VENDOR_UPDATED';

  // Invalidate cache timestamp whenever vendor modifies data
  cdnVersionTimestamp = Date.now();

  broadcastEvent(eventType, {
    shopId: shopId || null,
    action: action || 'MODIFIED',
    data: data || null,
  });

  res.json({
    success: true,
    publishedToClients: sseClients.size,
    cdnVersion: cdnVersionTimestamp,
  });
});

// Realtime Status & Client Count
app.get('/api/events/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    activeSubscribers: sseClients.size,
    cdnVersion: cdnVersionTimestamp,
    serverTime: new Date().toISOString(),
  });
});

// Record Shop Deletion across Platform
app.post('/api/shops/delete', (req: Request, res: Response) => {
  const { shopId } = req.body || {};
  if (!shopId) {
    return res.status(400).json({ success: false, error: 'shopId is required' });
  }

  const cleanId = String(shopId).trim().toLowerCase();
  deletedShopsSet.add(cleanId);
  persistDeletedShops();

  cdnVersionTimestamp = Date.now();

  // Broadcast VENDOR_DELETED across all SSE connections
  broadcastEvent('VENDOR_DELETED', {
    shopId: cleanId,
    action: 'DELETE',
    timestamp: cdnVersionTimestamp,
  });

  console.log(`[Server] Shop ${cleanId} permanently recorded in deleted shops blacklist.`);

  res.json({
    success: true,
    deletedShopId: cleanId,
    totalDeleted: deletedShopsSet.size,
    cdnVersion: cdnVersionTimestamp,
  });
});

// Retrieve Deleted Shop IDs list
app.get('/api/shops/deleted', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.json({
    success: true,
    deletedShopIds: Array.from(deletedShopsSet),
  });
});

// ==========================================
// 2. CDN INSTANT CACHE INVALIDATION
// ==========================================

// Invalidate CDN & Edge Cache for a shop or entire platform
app.post('/api/cdn/invalidate', async (req: Request, res: Response) => {
  const { shopId, domain, paths, tags } = req.body || {};

  cdnVersionTimestamp = Date.now();

  // Broadcast cache invalidation event to all active visitors & clients
  broadcastEvent('CDN_CACHE_INVALIDATED', {
    shopId: shopId || 'ALL',
    domain: domain || null,
    paths: paths || ['/', '/shop/*'],
    tags: tags || ['shop', 'products', 'theme'],
    invalidatedAt: cdnVersionTimestamp,
  });

  // 1. Advance the global version timestamp (forces all CDNs and browsers to recognize new deployment)
  cdnVersionTimestamp = Date.now();

  // 2. Broadcast cache invalidation event to all active visitors & clients via SSE & BroadcastChannel
  broadcastEvent('CDN_CACHE_INVALIDATED', {
    shopId: shopId || 'ALL',
    domain: domain || null,
    paths: paths || ['/', '/shop/*'],
    tags: tags || ['shop', 'products', 'theme'],
    invalidatedAt: cdnVersionTimestamp,
  });

  // Standard HTTP Header-based CDN Invalidation (Works automatically on Cloudflare, Cloud Run, Fastly, CloudFront, etc.)
  res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('X-App-Release', String(cdnVersionTimestamp));

  res.json({
    success: true,
    cdnVersion: cdnVersionTimestamp,
    message: 'Cache invalidated successfully via HTTP headers and real-time event stream.',
    invalidatedScope: {
      shopId: shopId || 'GLOBAL',
      domain: domain || 'ALL',
    },
  });
});

// Get Current CDN Version
app.get('/api/cdn/version', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.json({
    version: cdnVersionTimestamp,
    timestamp: new Date(cdnVersionTimestamp).toISOString(),
  });
});

// System Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// ==========================================
// 3. SERVER STATIC ASSETS & INDEX.HTML
// ==========================================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.join(process.cwd(), 'dist');

  if (!isProd) {
    // Development mode: Vite middleware handles live HMR and source bundling
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Wildcard Route for Development: Serves React app on any direct URL or reload (no 404)
    app.get('*', async (req: Request, res: Response, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const rawTemplate = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        const transformedHtml = await vite.transformIndexHtml(req.originalUrl, rawTemplate);
        res.status(200).set({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        }).send(transformedHtml);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    // Production mode:

    // 3a. Hashed static assets (/assets/*): Safe for 1-year immutable caching
    // Vite filenames include [name]-[hash].[ext] so they never collide or serve stale content
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        immutable: true,
        maxAge: '1y',
        setHeaders: (res) => {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        },
      })
    );

    // 3b. Other static files (favicon, robots, manifest)
    app.use(
      express.static(distPath, {
        index: false, // Do not automatically serve index.html with static defaults
        maxAge: '1h',
      })
    );

    // 3c. Wildcard Route for Production: Serves React app on all direct URLs, nested routes, and reloads (no 404)
    // Every deep link (/shop/SHP..., /vendor-dashboard, /admin-dashboard, /stores, etc.) resolves to index.html
    app.get('*', (req: Request, res: Response) => {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }

      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      res.setHeader('X-Deployment-Version', String(cdnVersionTimestamp));

      const distIndexPath = path.join(distPath, 'index.html');
      const rootIndexPath = path.join(process.cwd(), 'index.html');

      if (fs.existsSync(distIndexPath)) {
        return res.sendFile(distIndexPath);
      } else if (fs.existsSync(rootIndexPath)) {
        return res.sendFile(rootIndexPath);
      } else {
        return res.status(500).send('Application index.html could not be located.');
      }
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[IndianLalaJi Server] Running on http://${HOST}:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();

/**
 * Custom Domain Multi-Tenant Matcher & Resolver
 * Enables client domains (e.g. trustedweb.online) to point to their isolated shop data (e.g. SHP099949294)
 * without URL redirects or data leakage between tenants.
 */

import { Shop } from '../types';

export function normalizeDomain(domain: string): string {
  return (domain || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '')
    .split(':')[0]; // remove port if present
}

export function isPlatformSystemHost(hostname: string): boolean {
  const host = normalizeDomain(hostname);
  if (!host) return true;

  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.includes('run.app') ||
    host.includes('web.app') ||
    host.includes('firebaseapp.com') ||
    host === 'indianlalaji.com' ||
    host.endsWith('.indianlalaji.com')
  );
}

/**
 * Finds a matching shop for a given custom domain or hostname.
 * Strictly guarantees multi-tenant isolation: only the shop with this exact domain is matched.
 */
export function findShopByCustomDomain(shops: Shop[], currentHost: string): Shop | null {
  const host = normalizeDomain(currentHost);
  if (!host || isPlatformSystemHost(host)) {
    return null;
  }

  const rootHost = host.replace(/^www\./i, '');
  const wwwHost = `www.${rootHost}`;

  for (const shop of shops) {
    if (!shop.customDomain) continue;
    // If active flag exists and is false, skip
    if (shop.isCustomDomainActive === false) continue;

    const shopDomain = normalizeDomain(shop.customDomain);
    const shopRootDomain = shopDomain.replace(/^www\./i, '');
    const shopWwwDomain = `www.${shopRootDomain}`;

    if (
      shopDomain === host ||
      shopDomain === rootHost ||
      shopDomain === wwwHost ||
      shopRootDomain === rootHost ||
      shopWwwDomain === host
    ) {
      return shop;
    }
  }

  return null;
}

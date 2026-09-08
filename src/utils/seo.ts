/**
 * Dynamic SEO & OpenGraph / Social Share Metadata Helper for IndianLalaJi.
 * Ensures that when a shop link is viewed or shared, the vendor's Shop Name,
 * Title/Tagline, and Logo/Banner image are accurately rendered in the document head
 * and social crawlers.
 */

import { Shop } from '../types';

const DEFAULT_PLATFORM_TITLE = 'IndianLalaJi.com — 2 Minute Mein Website Live Karo';
const DEFAULT_PLATFORM_DESC = 'Multi-Vendor Digital Catalogue SaaS - Indian businesses and local vendors apni professional digital store website mobile se banayein.';
const DEFAULT_PLATFORM_LOGO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=630&fit=crop';

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Helper functions to dynamically extract tenant SEO and OpenGraph attributes.
 */
export function getShopCanonicalUrl(shop: Shop): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/?shop=${encodeURIComponent(shop.shopId)}`;
  }
  return `https://indianlalaji.com/?shop=${encodeURIComponent(shop.shopId)}`;
}

export function getShopDescription(shop: Shop): string {
  if (shop.tagline && shop.tagline.trim()) {
    return shop.tagline.trim();
  }
  if (shop.bannerSubtitle && shop.bannerSubtitle.trim()) {
    return shop.bannerSubtitle.trim();
  }
  if (shop.bannerTitle && shop.bannerTitle.trim()) {
    return shop.bannerTitle.trim();
  }
  if (shop.aboutStory && shop.aboutStory.trim()) {
    return shop.aboutStory.trim().slice(0, 160);
  }
  return `${shop.businessName} ki official digital dukaan. Online catalogue dekhein aur WhatsApp par direct 0% commission par order karein.`;
}

export function getShopOgImage(shop: Shop): string {
  return shop.logoUrl || (shop.banners && shop.banners[0]) || shop.aboutPhotoUrl || DEFAULT_PLATFORM_LOGO;
}

/**
 * Updates the document head with shop-specific SEO, OpenGraph, Twitter, and JSON-LD tags.
 * Follows exact requirements:
 * - Shop Name → dynamically tenant/shop name
 * - Shop Logo → dynamically tenant ka uploaded logo
 * - Shop Website URL → exact canonical tenant URL
 * - Shop short description / tagline
 * - Proper OG Image / preview image
 * - og:title → Shop Name
 * - og:description → Shop ki description
 * - og:image → Shop Logo / configured social sharing image
 * - og:url → Current tenant/shop ka exact URL
 * - og:type → website
 */
export function updateShopSeoMeta(shop: Shop) {
  if (typeof document === 'undefined') return;

  const shopName = shop.businessName || 'Official Store';
  const shopLogo = getShopOgImage(shop);
  const shopUrl = getShopCanonicalUrl(shop);
  const shopDesc = getShopDescription(shop);

  // 1. Document Title
  const shopTitle = shop.tagline ? `${shopName} — ${shop.tagline}` : `${shopName} | Official Online Store`;
  document.title = shopTitle;

  // 2. Standard Description
  setMetaTag('name', 'description', shopDesc);

  // 3. OpenGraph Meta Tags (Strictly user-configured)
  // og:title → Shop Name
  setMetaTag('property', 'og:title', shopName);

  // og:description → Shop ki description
  setMetaTag('property', 'og:description', shopDesc);

  // og:image → Shop Logo / configured social sharing image
  setMetaTag('property', 'og:image', shopLogo);
  setMetaTag('property', 'og:image:secure_url', shopLogo);
  setMetaTag('property', 'og:image:alt', `${shopName} Logo`);
  setMetaTag('property', 'og:image:width', '1200');
  setMetaTag('property', 'og:image:height', '630');

  // og:url → Current tenant/shop ka exact URL
  setMetaTag('property', 'og:url', shopUrl);

  // og:type → website
  setMetaTag('property', 'og:type', 'website');

  // Site name
  setMetaTag('property', 'og:site_name', 'IndianLalaJi.com');

  // 4. Twitter Card Meta
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', shopName);
  setMetaTag('name', 'twitter:description', shopDesc);
  setMetaTag('name', 'twitter:image', shopLogo);

  // 5. Canonical Link
  setLinkTag('canonical', shopUrl);

  // 6. Favicon / App Icon to Shop Logo
  if (shop.logoUrl) {
    setLinkTag('icon', shop.logoUrl);
    setLinkTag('apple-touch-icon', shop.logoUrl);
  }

  // 7. JSON-LD LocalBusiness Schema for Google Search
  let ldJsonScript = document.getElementById('shop-json-ld');
  if (!ldJsonScript) {
    ldJsonScript = document.createElement('script');
    ldJsonScript.id = 'shop-json-ld';
    ldJsonScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(ldJsonScript);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: shopName,
    headline: shop.tagline || shop.bannerTitle || shopName,
    description: shopDesc,
    image: shopLogo,
    logo: shop.logoUrl || shopLogo,
    telephone: shop.phone || shop.whatsapp,
    url: shopUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: shop.address || '',
      addressLocality: shop.city || '',
      addressRegion: shop.state || '',
      postalCode: shop.pincode || '',
      addressCountry: 'IN',
    },
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Online',
  };

  ldJsonScript.textContent = JSON.stringify(structuredData);
}

/**
 * Resets document metadata back to the default IndianLalaJi platform tags.
 */
export function resetPlatformSeoMeta() {
  if (typeof document === 'undefined') return;

  document.title = DEFAULT_PLATFORM_TITLE;
  setMetaTag('name', 'description', DEFAULT_PLATFORM_DESC);
  setMetaTag('property', 'og:title', DEFAULT_PLATFORM_TITLE);
  setMetaTag('property', 'og:description', DEFAULT_PLATFORM_DESC);
  setMetaTag('property', 'og:image', DEFAULT_PLATFORM_LOGO);
  setMetaTag('property', 'og:url', typeof window !== 'undefined' ? window.location.origin : 'https://indianlalaji.com');
  setMetaTag('property', 'og:site_name', 'IndianLalaJi.com');
  setMetaTag('name', 'twitter:title', DEFAULT_PLATFORM_TITLE);
  setMetaTag('name', 'twitter:description', DEFAULT_PLATFORM_DESC);
  setMetaTag('name', 'twitter:image', DEFAULT_PLATFORM_LOGO);

  const ldJsonScript = document.getElementById('shop-json-ld');
  if (ldJsonScript) {
    ldJsonScript.remove();
  }
}

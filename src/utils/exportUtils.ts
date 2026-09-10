import { Shop, PlatformState, PlatformLead, ShopInquiry, ProductItem } from '../types';
import { calculateDaysRemaining, formatDisplayDate, getOneYearExpiryDate } from './mediaUpload';

/**
 * Escapes a cell value for CSV format (RFC 4180 compliant)
 */
function escapeCSV(val: string | number | boolean | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // If string contains comma, quote, or newline, escape double quotes and wrap in quotes
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Initiates a browser download for text/csv or json using Blob
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 300);
}

/**
 * Downloads a structured JSON object
 */
export function downloadJSON(filename: string, data: any): void {
  const jsonStr = JSON.stringify(data, null, 2);
  triggerFileDownload(jsonStr, filename, 'application/json;charset=utf-8;');
}

/**
 * Downloads a CSV file with UTF-8 BOM so Microsoft Excel renders Hindi/special characters cleanly
 */
export function downloadCSV(filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]): void {
  const headerLine = headers.map(escapeCSV).join(',');
  const rowLines = rows.map((r) => r.map(escapeCSV).join(','));
  // \uFEFF is UTF-8 Byte Order Mark (BOM) ensuring Excel displays unicode properly
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
  triggerFileDownload(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * 1. PURE PORTAL MASTER BACKUP (COMPLETE JSON)
 */
export function exportPurePortalCompleteBackup(platformState: PlatformState): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const backupPayload = {
    backupMetadata: {
      platform: 'IndianLalaJi Digital SaaS & E-Commerce Network',
      exportType: 'COMPLETE_PORTAL_MASTER_BACKUP',
      exportedAt: new Date().toISOString(),
      exportedBy: 'Super Admin (R. K. Mehra)',
      version: '3.0.0',
      totalShops: platformState.shops.length,
      totalProducts: platformState.shops.reduce((sum, s) => sum + (s.products?.length || 0), 0),
      totalLeads: platformState.platformLeads?.length || 0,
      totalInquiries: platformState.inquiries?.length || 0,
    },
    platformConfig: {
      customerCarePhone: platformState.customerCarePhone,
      customerCareWhatsapp: platformState.customerCareWhatsapp,
      customerCareEmail: platformState.customerCareEmail,
      supportHours: platformState.supportHours,
      adminUpiId: platformState.adminUpiId,
      adminPaymentQrUrl: platformState.adminPaymentQrUrl,
      globalPopupEnabled: platformState.globalPopupEnabled,
      platformHeroHeading: platformState.platformHeroHeading,
      platformHeroSubheading: platformState.platformHeroSubheading,
      platformAboutStory: platformState.platformAboutStory,
      mainWebsiteSectionsConfig: platformState.mainWebsiteSectionsConfig,
    },
    pricingPackages: platformState.pricingPackages,
    popups: platformState.popups,
    tutorialVideos: platformState.tutorialVideos,
    platformLeads: platformState.platformLeads || [],
    inquiries: platformState.inquiries || [],
    allShops: platformState.shops,
  };

  downloadJSON(`indianlalaji_pure_portal_complete_backup_${dateStr}.json`, backupPayload);
}

/**
 * 2. PURE PORTAL SUMMARY CSV (Executive Overview)
 */
export function exportPurePortalSummaryCSV(platformState: PlatformState): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const headers = [
    'Metric / Parameter',
    'Value / Details',
    'Description'
  ];

  const totalShops = platformState.shops.length;
  const publishedShops = platformState.shops.filter((s) => s.status === 'PUBLISHED').length;
  const pendingShops = platformState.shops.filter((s) => s.status === 'PENDING_APPROVAL').length;
  const holdShops = platformState.shops.filter((s) => s.status === 'HOLD').length;
  const draftShops = platformState.shops.filter((s) => s.status === 'DRAFT').length;
  const totalProducts = platformState.shops.reduce((sum, s) => sum + (s.products?.length || 0), 0);
  const totalViews = platformState.shops.reduce((sum, s) => sum + (s.viewsCount || 0), 0);
  const totalLeads = platformState.platformLeads?.length || 0;
  const totalPopups = platformState.popups?.length || 0;

  // Group by category
  const categoriesMap: Record<string, number> = {};
  platformState.shops.forEach((s) => {
    const cat = s.category || 'General';
    categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
  });
  const categoryBreakdown = Object.entries(categoriesMap)
    .map(([cat, count]) => `${cat}: ${count}`)
    .join(' | ');

  const rows: (string | number)[][] = [
    ['Portal Name', 'IndianLalaJi - Aapki Apni Digital Dukan Platform', 'Master Platform Name'],
    ['Report Export Date', new Date().toLocaleString('en-IN'), 'Current System Date & Time'],
    ['Exported By', 'Super Admin Master Access', 'Authorized platform administrator'],
    ['Total Registered Shops', totalShops, 'Total vendors registered in database'],
    ['Published Live Shops', publishedShops, 'Active live store URLs accessible publicly'],
    ['Pending Approval Shops', pendingShops, 'Stores awaiting review'],
    ['On Hold Shops', holdShops, 'Temporarily suspended or paused stores'],
    ['Draft Stores', draftShops, 'Incomplete setup drafts'],
    ['Total Products & Services Listed', totalProducts, 'Aggregated catalog items across all shops'],
    ['Total Public Storefront Views', totalViews, 'Aggregated hits on vendor web catalogues'],
    ['Total Platform Leads / Enquiries', totalLeads, 'Customer inquiries captured on platform'],
    ['Active Advertisement Popups', totalPopups, 'Promotional popups configured in engine'],
    ['Global Popup Engine Status', platformState.globalPopupEnabled ? 'ENABLED (ON)' : 'DISABLED (OFF)', 'Site-wide master switch'],
    ['Customer Care Contact', platformState.customerCarePhone || '+91 9310000000', 'Official phone support'],
    ['Customer Care WhatsApp', platformState.customerCareWhatsapp || '+91 9310000000', 'Official WhatsApp support'],
    ['Categories Breakdown', categoryBreakdown, 'Distribution of vendors by business category'],
  ];

  downloadCSV(`indianlalaji_portal_master_summary_${dateStr}.csv`, headers, rows);
}

/**
 * 3. ALL VENDOR SHOPS DIRECTORY CSV (All Vendors List)
 */
export function exportAllVendorsDirectoryCSV(shops: Shop[]): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const headers = [
    'Shop ID',
    'Business Name',
    'Vendor / Owner Name',
    'Mobile Phone',
    'WhatsApp Number',
    'Email Address',
    'Category',
    'City',
    'State',
    'Full Address',
    'Pincode',
    'Store Status',
    'Total Products Count',
    'Active Date',
    'Expiry Date (1-Yr)',
    'Days Remaining',
    'Subscription Plan',
    'Custom Domain',
    'Connected Website URL',
    'UPI ID',
    'Total Storefront Views',
    'Featured In Showcase',
    'Template ID',
    'Color Theme',
    'Created At'
  ];

  const rows = shops.map((shop) => {
    const activeDateVal = shop.activeDate || shop.createdAt?.split('T')[0] || '';
    const expiryDateVal = shop.expiryDate || (activeDateVal ? getOneYearExpiryDate(activeDateVal) : '');
    const daysRemaining = expiryDateVal ? calculateDaysRemaining(expiryDateVal) : '';

    return [
      shop.shopId,
      shop.businessName,
      shop.vendorName,
      shop.phone,
      shop.whatsapp,
      shop.vendorEmail || shop.email,
      shop.category,
      shop.city,
      shop.state,
      shop.address,
      shop.pincode,
      shop.status,
      shop.products?.length || 0,
      activeDateVal ? formatDisplayDate(activeDateVal) : '',
      expiryDateVal ? formatDisplayDate(expiryDateVal) : '',
      daysRemaining,
      shop.planName || '1-Year Official LalaJi Store Plan',
      shop.customDomain || 'Not Connected',
      shop.connectedWebsiteUrl || '',
      shop.upiId || '',
      shop.viewsCount || 0,
      shop.isFeaturedInShowcase ? 'YES' : 'NO',
      shop.templateId,
      shop.colorTheme,
      shop.createdAt ? new Date(shop.createdAt).toLocaleDateString('en-IN') : ''
    ];
  });

  downloadCSV(`indianlalaji_all_vendors_directory_${dateStr}.csv`, headers, rows);
}

/**
 * 4. ALL PRODUCTS & SERVICES MASTER CATALOGUE CSV (All Items Across All Vendors)
 */
export function exportAllProductsMasterCSV(shops: Shop[]): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const headers = [
    'Shop ID',
    'Shop Business Name',
    'Shop Category',
    'Shop City',
    'Vendor Phone',
    'Item ID',
    'Product / Service Name',
    'Item Type (PRODUCT/SERVICE/COURSE)',
    'Item Category',
    'Selling Price (INR)',
    'Original MRP (INR)',
    'Discount (INR)',
    'Unit (e.g. 1 pc / 1 kg)',
    'In Stock Status',
    'Hide Price on Web',
    'Description',
    'Image URL'
  ];

  const rows: (string | number)[][] = [];

  shops.forEach((shop) => {
    (shop.products || []).forEach((prod) => {
      const discount = prod.originalPrice && prod.originalPrice > prod.price 
        ? prod.originalPrice - prod.price 
        : 0;

      rows.push([
        shop.shopId,
        shop.businessName,
        shop.category,
        shop.city,
        shop.phone,
        prod.id,
        prod.name,
        prod.type || 'PRODUCT',
        prod.category || 'General',
        prod.price,
        prod.originalPrice || '',
        discount || 0,
        prod.unit || '1 pc',
        prod.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
        prod.hidePrice ? 'HIDDEN' : 'VISIBLE',
        prod.description || '',
        prod.imageUrl || ''
      ]);
    });
  });

  downloadCSV(`indianlalaji_all_products_master_catalogue_${dateStr}.csv`, headers, rows);
}

/**
 * 5. ALL SHOPS BULK JSON
 */
export function exportAllShopsJSON(shops: Shop[]): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const data = {
    exportType: 'ALL_VENDOR_SHOPS_DATA',
    exportedAt: new Date().toISOString(),
    totalShops: shops.length,
    shops: shops
  };
  downloadJSON(`indianlalaji_all_shops_data_${dateStr}.json`, data);
}

/**
 * 6. PLATFORM LEADS & INQUIRIES CSV
 */
export function exportPlatformLeadsCSV(leads: PlatformLead[]): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const headers = [
    'Lead ID',
    'Customer Name',
    'Phone Number',
    'Email Address',
    'City',
    'Interested Business Category',
    'Status',
    'Message',
    'Date Submitted'
  ];

  const rows = leads.map((l) => [
    l.id,
    l.name,
    l.phone,
    l.email || '',
    l.city,
    l.businessCategory || '',
    l.status,
    l.message || '',
    l.date ? new Date(l.date).toLocaleString('en-IN') : ''
  ]);

  downloadCSV(`indianlalaji_platform_leads_${dateStr}.csv`, headers, rows);
}

/**
 * 7. SPECIFIC VENDOR: COMPLETE SHOP JSON BACKUP
 */
export function exportSpecificVendorDataJSON(shop: Shop): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const vendorPayload = {
    exportType: 'SPECIFIC_VENDOR_FULL_STORE_DATA',
    exportedAt: new Date().toISOString(),
    shopId: shop.shopId,
    businessName: shop.businessName,
    vendorName: shop.vendorName,
    phone: shop.phone,
    totalProducts: shop.products?.length || 0,
    shopData: shop
  };

  downloadJSON(`vendor_${shop.shopId}_${shop.businessName.replace(/\s+/g, '_')}_full_data_${dateStr}.json`, vendorPayload);
}

/**
 * 8. SPECIFIC VENDOR: PRODUCTS & SERVICES CATALOGUE CSV
 */
export function exportSpecificVendorProductsCSV(shop: Shop): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const headers = [
    'Item ID',
    'Product / Service Name',
    'Type',
    'Category',
    'Selling Price (INR)',
    'Original MRP (INR)',
    'Discount (INR)',
    'Unit',
    'Stock Status',
    'Hide Price on Web',
    'Description',
    'Image URL'
  ];

  const rows = (shop.products || []).map((prod) => {
    const discount = prod.originalPrice && prod.originalPrice > prod.price 
      ? prod.originalPrice - prod.price 
      : 0;

    return [
      prod.id,
      prod.name,
      prod.type || 'PRODUCT',
      prod.category || 'General',
      prod.price,
      prod.originalPrice || '',
      discount || 0,
      prod.unit || '1 pc',
      prod.inStock ? 'In Stock' : 'Out of Stock',
      prod.hidePrice ? 'Yes (Hidden)' : 'No (Visible)',
      prod.description || '',
      prod.imageUrl || ''
    ];
  });

  downloadCSV(`vendor_${shop.shopId}_products_catalogue_${dateStr}.csv`, headers, rows);
}

/**
 * 9. SPECIFIC VENDOR: INQUIRIES & LEADS CSV
 */
export function exportSpecificVendorInquiriesCSV(shop: Shop, inquiries: ShopInquiry[] = []): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const shopInquiries = inquiries.filter((inq) => inq.shopId === shop.shopId || inq.shopId === shop.id);

  const headers = [
    'Inquiry ID',
    'Customer Name',
    'Customer Phone',
    'Service / Product Requested',
    'Message',
    'Status',
    'Date Submitted'
  ];

  const rows = shopInquiries.map((inq) => [
    inq.id,
    inq.customerName,
    inq.customerPhone,
    inq.serviceOrProductRequested || 'General Inquiry',
    inq.message,
    inq.status,
    inq.date ? new Date(inq.date).toLocaleString('en-IN') : ''
  ]);

  downloadCSV(`vendor_${shop.shopId}_customer_inquiries_${dateStr}.csv`, headers, rows);
}

/**
 * 10. SPECIFIC VENDOR: PRINTABLE TEXT SUMMARY
 */
export function generateSpecificVendorPrintableSummary(shop: Shop): string {
  const activeDateVal = shop.activeDate || shop.createdAt?.split('T')[0] || '';
  const expiryDateVal = shop.expiryDate || (activeDateVal ? getOneYearExpiryDate(activeDateVal) : '');
  const daysLeft = expiryDateVal ? calculateDaysRemaining(expiryDateVal) : 0;

  return `
================================================================================
INDIANLALAJI DIGITAL SAAS PLATFORM - OFFICIAL VENDOR STORE DOSSIER
================================================================================
Generated At: ${new Date().toLocaleString('en-IN')}
Platform: https://indianlalaji.com
Master Admin: R. K. Mehra

STORE & BUSINESS IDENTITY:
--------------------------------------------------------------------------------
Shop ID:              ${shop.shopId}
Business Name:        ${shop.businessName}
Tagline:              ${shop.tagline || 'Aapki Apni Digital Dukan'}
Category:             ${shop.category}
Store Status:         ${shop.status}
Established Year:     ${shop.establishedYear || 'N/A'}
Custom Domain:        ${shop.customDomain || 'Not Connected'}
Showcase Featured:    ${shop.isFeaturedInShowcase ? 'YES' : 'NO'}

VENDOR CONTACT & LOCATION:
--------------------------------------------------------------------------------
Owner / Vendor Name:  ${shop.vendorName}
Mobile Phone:         +91 ${shop.phone}
WhatsApp:             +91 ${shop.whatsapp}
Email:                ${shop.vendorEmail || shop.email}
Store Address:        ${shop.address}
City, State, Pin:     ${shop.city}, ${shop.state} - ${shop.pincode}
Google Maps:          ${shop.googleMapsUrl || 'Not provided'}
Working Hours:        ${shop.workingHours || '10:00 AM - 09:00 PM'}

PAYMENT & UPI CONFIGURATION:
--------------------------------------------------------------------------------
UPI ID:               ${shop.upiId || 'Not Configured'}
Payment QR Image:     ${shop.paymentQrUrl ? 'Configured' : 'Not Configured'}
E-Commerce Checkout:  ${shop.ecommerceEnabled ? 'Direct WhatsApp Cart Ordering Enabled' : 'Disabled'}

SUBSCRIPTION & VALIDITY:
--------------------------------------------------------------------------------
Plan Name:            ${shop.planName || '1-Year Official LalaJi Store Plan'}
Active Date:          ${formatDisplayDate(activeDateVal)}
Expiry Date:          ${formatDisplayDate(expiryDateVal)}
Validity Remaining:   ${daysLeft} Days
Storefront Views:     ${shop.viewsCount || 0} hits

CATALOGUE SUMMARY:
--------------------------------------------------------------------------------
Total Listed Items:   ${shop.products?.length || 0} products / services
Hide All Prices:      ${shop.hideAllPrices ? 'YES (Store-wide Catalog Mode)' : 'NO'}

ITEMIZED PRODUCTS LIST:
${(shop.products || []).map((p, idx) => `
[#${idx + 1}] ${p.name} (${p.type || 'PRODUCT'})
    Price: ₹${p.price} | MRP: ₹${p.originalPrice || p.price} | Unit: ${p.unit || '1 pc'}
    Status: ${p.inStock ? 'In Stock' : 'Out of Stock'} | Category: ${p.category || 'General'}
    Description: ${p.description || 'N/A'}
`).join('')}

================================================================================
END OF VENDOR STORE DOSSIER - CONFIDENTIAL SUPER ADMIN RECORD
================================================================================
`.trim();
}

/**
 * 11. EXPORT SELECTED VENDORS BUNDLE (.JSON)
 * Exports multiple vendor websites selected by Super Admin in a single unified JSON file.
 */
export function exportSelectedVendorsBundleJSON(selectedShops: Shop[], bundleTitle?: string): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const bundlePayload = {
    metadata: {
      platform: 'IndianLalaJi Digital SaaS Network',
      exportType: 'SELECTED_VENDORS_BUNDLE',
      exportedAt: new Date().toISOString(),
      totalVendors: selectedShops.length,
      bundleTitle: bundleTitle || `Selected Vendors (${selectedShops.length})`,
      platformVersion: 'v2.0',
    },
    shops: selectedShops,
  };

  const filename = `indianlalaji_selected_vendors_${selectedShops.length}_${dateStr}.json`;
  downloadJSON(filename, bundlePayload);
}

/**
 * 12. EXPORT CUSTOM DOMAIN VENDORS BUNDLE (.JSON)
 * Directly filters and exports all shops that have a custom domain configured.
 */
export function exportCustomDomainVendorsBundleJSON(allShops: Shop[]): void {
  const domainShops = allShops.filter((s) => Boolean(s.customDomain));
  const dateStr = new Date().toISOString().slice(0, 10);
  const bundlePayload = {
    metadata: {
      platform: 'IndianLalaJi Digital SaaS Network',
      exportType: 'CUSTOM_DOMAIN_VENDORS_VAULT',
      exportedAt: new Date().toISOString(),
      totalVendors: domainShops.length,
      description: 'Dedicated backup of all vendors having custom domain & DNS configurations',
      platformVersion: 'v2.0',
    },
    shops: domainShops,
  };

  const filename = `indianlalaji_custom_domain_vendors_${domainShops.length}_${dateStr}.json`;
  downloadJSON(filename, bundlePayload);
}

/**
 * Helper to parse and validate any vendor bundle JSON
 */
export function parseVendorsBundleJSON(jsonString: string): {
  success: boolean;
  shops: Shop[];
  metadata?: any;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    let shopsList: Shop[] = [];

    if (Array.isArray(parsed)) {
      shopsList = parsed;
    } else if (Array.isArray(parsed.shops)) {
      shopsList = parsed.shops;
    } else if (parsed.data && Array.isArray(parsed.data.shops)) {
      shopsList = parsed.data.shops;
    } else if (parsed.shopId && parsed.businessName) {
      // Single shop JSON
      shopsList = [parsed];
    } else if (parsed.data && parsed.data.shopId) {
      // Single shop wrapped in backup
      shopsList = [parsed.data];
    } else {
      return {
        success: false,
        shops: [],
        error: 'Invalid file format! Expected an array of shops or a vendor backup JSON.',
      };
    }

    // Validate each shop has shopId
    const validShops = shopsList.filter((s) => s && typeof s.shopId === 'string' && s.shopId.length > 0);
    if (validShops.length === 0) {
      return {
        success: false,
        shops: [],
        error: 'No valid vendor shop records found in this file.',
      };
    }

    return {
      success: true,
      shops: validShops,
      metadata: parsed.metadata || null,
    };
  } catch (err) {
    return {
      success: false,
      shops: [],
      error: 'Failed to parse JSON file. Please check file validity.',
    };
  }
}


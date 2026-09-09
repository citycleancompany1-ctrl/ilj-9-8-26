import { ProductItem, ShopCategory, ProductType, Shop } from '../types';
import { CategoryBarItem } from '../components/shop/StoreCategoryBar';

export const CATEGORY_IMAGE_PRESETS: Record<string, string> = {
  // Groceries & Food
  grains: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=240&q=80',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=240&q=80',
  dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=240&q=80',
  ghee: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=240&q=80',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=240&q=80',
  spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=240&q=80',
  masala: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=240&q=80',
  herbs: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=240&q=80',
  atta: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=240&q=80',
  flour: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=240&q=80',
  oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=240&q=80',
  kirana: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=240&q=80',
  grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=240&q=80',
  mithai: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=240&q=80',
  sweets: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=240&q=80',
  namkeen: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=240&q=80',
  snacks: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=240&q=80',
  tea: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=240&q=80',
  chai: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=240&q=80',
  beverages: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=240&q=80',
  combo: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=240&q=80',
  puja: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=240&q=80',
  festival: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=240&q=80',
  household: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=240&q=80',

  // Clothing & Fashion
  poshak: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=240&q=80',
  rajputi: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=240&q=80',
  saree: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=240&q=80',
  sarees: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=240&q=80',
  fashion: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=240&q=80',
  clothing: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=240&q=80',
  kurti: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=240&q=80',
  suits: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=240&q=80',
  lehenga: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=240&q=80',
  bridal: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=240&q=80',
  tailoring: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=240&q=80',
  stitching: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=240&q=80',
  boutique: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=240&q=80',
  jewellery: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=240&q=80',
  bangles: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=240&q=80',

  // Services
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=240&q=80',
  home: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=240&q=80',
  upholstery: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=240&q=80',
  sofa: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=240&q=80',
  service: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=240&q=80',
  services: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=240&q=80',
  repair: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=240&q=80',
  mobile: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=240&q=80',
  electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=240&q=80',
  accessories: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=240&q=80',
  pest: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=240&q=80',
  electrician: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=240&q=80',
  plumbing: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=240&q=80',
  beauty: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=240&q=80',
  salon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=240&q=80',
  delivery: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=240&q=80',

  // Courses & Training
  training: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=240&q=80',
  course: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=240&q=80',
  courses: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=240&q=80',
  skill: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=240&q=80',
  vocational: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=240&q=80',
  coaching: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=240&q=80',
  computer: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=240&q=80',
  design: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=240&q=80',
  business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=240&q=80',
  marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=240&q=80',
};

/**
 * Resolves a representative image for a category name based on presets or fallback.
 */
export function getCategoryImageByName(categoryName: string, fallbackUrl?: string): string {
  const lower = (categoryName || '').toLowerCase();
  for (const [kw, url] of Object.entries(CATEGORY_IMAGE_PRESETS)) {
    if (lower.includes(kw)) return url;
  }
  return fallbackUrl || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=240&q=80';
}

/**
 * Extracts unique categories from a list of products/services/courses,
 * counts items in each category, and resolves a representative image.
 * Gives first priority to vendor-defined categories in shop.customCategories.
 */
export function extractStoreCategories(
  items: ProductItem[],
  customCategories?: ShopCategory[] | Record<string, string>,
  itemType?: ProductType
): CategoryBarItem[] {
  const result: CategoryBarItem[] = [];
  const processedNames = new Set<string>();

  // 1. If customCategories is an array of ShopCategory objects (vendor-created categories)
  if (Array.isArray(customCategories) && customCategories.length > 0) {
    // Filter vendor categories matching current itemType (or 'ALL' / undefined)
    const matchingCustomCats = customCategories.filter((cat) => {
      if (!cat.name) return false;
      if (!cat.type || cat.type === 'ALL') return true;
      if (!itemType) return true;
      return cat.type === itemType;
    });

    matchingCustomCats.forEach((cat) => {
      const lowerName = cat.name.trim().toLowerCase();
      if (processedNames.has(lowerName)) return;
      processedNames.add(lowerName);

      // Count items matching this category
      const count = items.filter((it) => {
        const itCat = (it.category || '').trim().toLowerCase();
        return itCat === lowerName;
      }).length;

      let img = cat.imageUrl;
      if (!img || img.trim() === '') {
        // Look for image from matching item or preset
        const matchingItem = items.find(
          (it) => (it.category || '').trim().toLowerCase() === lowerName && it.imageUrl
        );
        img = matchingItem?.imageUrl || getCategoryImageByName(cat.name);
      }

      result.push({
        id: cat.id || `cat-${lowerName.replace(/[^a-z0-9]/g, '-')}`,
        name: cat.name.trim(),
        imageUrl: img,
        count: count,
      });
    });
  }

  // 2. Also check items for any category that wasn't explicitly defined in customCategories
  const customImagesMap: Record<string, string> =
    !Array.isArray(customCategories) && typeof customCategories === 'object'
      ? (customCategories as Record<string, string>)
      : {};

  const dynamicCategoryMap = new Map<
    string,
    {
      name: string;
      items: ProductItem[];
      firstImageUrl?: string;
    }
  >();

  items.forEach((item) => {
    const rawCategory = item.category?.trim();
    const catName =
      rawCategory ||
      (item.type === 'COURSE'
        ? 'Courses & Training'
        : item.type === 'SERVICE'
        ? 'Services'
        : 'General Products');

    const lower = catName.toLowerCase();
    if (processedNames.has(lower)) {
      // Already handled by customCategories
      return;
    }

    if (!dynamicCategoryMap.has(catName)) {
      dynamicCategoryMap.set(catName, {
        name: catName,
        items: [],
        firstImageUrl: item.imageUrl,
      });
    }

    const entry = dynamicCategoryMap.get(catName)!;
    entry.items.push(item);
    if (!entry.firstImageUrl && item.imageUrl) {
      entry.firstImageUrl = item.imageUrl;
    }
  });

  dynamicCategoryMap.forEach((entry, catName) => {
    const lowerName = catName.toLowerCase();
    processedNames.add(lowerName);

    let finalImageUrl = customImagesMap[lowerName];
    if (!finalImageUrl && entry.firstImageUrl) {
      finalImageUrl = entry.firstImageUrl;
    }
    if (!finalImageUrl) {
      finalImageUrl = getCategoryImageByName(catName);
    }

    result.push({
      id: `cat-${lowerName.replace(/[^a-z0-9]/g, '-')}`,
      name: catName,
      imageUrl: finalImageUrl,
      count: entry.items.length,
    });
  });

  return result;
}

export const DEFAULT_PRODUCT_CATEGORIES: string[] = [
  'Grocery & Kirana',
  'Dairy, Ghee & Milk',
  'Atta, Rice & Grains',
  'Spices & Masala',
  'Sweets & Namkeen',
  'Snacks & Beverages',
  'Clothing & Apparel',
  'Footwear & Fashion',
  'Electronics & Mobile',
  'Home & Kitchenware',
  'Beauty & Cosmetics',
  'Puja & Festival Items',
  'Hardware & Electrical',
  'General Store',
];

export const DEFAULT_SERVICE_CATEGORIES: string[] = [
  'AC & Appliance Repair',
  'Deep Home Cleaning',
  'Sofa & Carpet Cleaning',
  'Electrician Services',
  'Plumbing & Sanitation',
  'Beauty, Parlour & Salon',
  'Vehicle & Bike Service',
  'Tailoring & Alterations',
  'Pest Control',
  'Painting & Whitewash',
  'Consultation & Booking',
  'General Services',
];

export const DEFAULT_COURSE_CATEGORIES: string[] = [
  'Skill Training & Vocational',
  'Computer & IT Coding',
  'Spoken English & Communication',
  'Competitive Exam Coaching',
  'Digital Marketing & Social Media',
  'Graphic Design & Video Editing',
  'Beauty, Makeup & Hair Styling',
  'Accounting, Tally & GST',
  'Fitness & Yoga Coaching',
  'School Tuition (Class 1-12)',
  'General Coaching',
];

/**
 * Returns a consolidated, deduplicated list of categories available for a shop and type.
 * Returns ONLY categories created by the vendor in shopCustomCategories (and any existing item categories).
 * Does NOT inject unrequested preset/default categories, respecting the vendor's explicit custom catalog.
 */
export function getAvailableCategoriesForShop(
  shopCustomCategories: ShopCategory[] = [],
  shopProducts: ProductItem[] = [],
  type: ProductType = 'PRODUCT'
): { id: string; name: string; imageUrl: string; isCustom: boolean }[] {
  const result: { id: string; name: string; imageUrl: string; isCustom: boolean }[] = [];
  const seen = new Set<string>();

  // 1. Vendor's custom categories for this type (or ALL)
  (shopCustomCategories || []).forEach((cat) => {
    if (!cat.type || cat.type === 'ALL' || cat.type === type) {
      const lower = cat.name.trim().toLowerCase();
      if (!seen.has(lower) && cat.name.trim()) {
        seen.add(lower);
        result.push({
          id: cat.id,
          name: cat.name.trim(),
          imageUrl: cat.imageUrl || getCategoryImageByName(cat.name, type),
          isCustom: true,
        });
      }
    }
  });

  // 2. Existing items of this type in shop products (ensures no existing item's category is lost)
  (shopProducts || []).forEach((item) => {
    if (item.type === type && item.category && item.category.trim()) {
      const catName = item.category.trim();
      const lower = catName.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        result.push({
          id: `item_cat_${lower.replace(/[^a-z0-9]/g, '_')}`,
          name: catName,
          imageUrl: item.imageUrl || getCategoryImageByName(catName, type),
          isCustom: true,
        });
      }
    }
  });

  return result;
}

/**
 * Ensures all product categories from existing products are synced into customCategories
 * so that categories are never deleted or lost on reload or sync.
 */
export function ensureCustomCategoriesSynced(shop: Shop): Shop {
  if (!shop) return shop;
  const existingList = Array.isArray(shop.customCategories) ? [...shop.customCategories] : [];
  const seen = new Set(existingList.map((c) => (c.name || '').trim().toLowerCase()));
  let modified = false;

  (shop.products || []).forEach((p) => {
    if (p.category && p.category.trim()) {
      const catName = p.category.trim();
      const lower = catName.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        existingList.push({
          id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: catName,
          type: p.type || 'PRODUCT',
          imageUrl: p.imageUrl || getCategoryImageByName(catName, p.type),
        });
        modified = true;
      }
    }
  });

  if (modified || !shop.customCategories) {
    return {
      ...shop,
      customCategories: existingList,
    };
  }
  return shop;
}

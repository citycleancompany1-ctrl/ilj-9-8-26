import { ProductItem } from '../types';
import { CategoryBarItem } from '../components/shop/StoreCategoryBar';

const CATEGORY_IMAGE_PRESETS: Record<string, string> = {
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

  // Clothing & Fashion
  poshak: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=240&q=80',
  rajputi: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=240&q=80',
  saree: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=240&q=80',
  sarees: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=240&q=80',
  fashion: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=240&q=80',
  clothing: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=240&q=80',
  tailoring: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=240&q=80',
  boutique: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=240&q=80',
  jewellery: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=240&q=80',

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
};

/**
 * Extracts unique categories from a list of products/services/courses,
 * counts items in each category, and resolves a representative image.
 */
export function extractStoreCategories(
  items: ProductItem[],
  customCategoryImages?: Record<string, string>
): CategoryBarItem[] {
  if (!items || items.length === 0) return [];

  const categoryMap = new Map<
    string,
    {
      name: string;
      items: ProductItem[];
      firstImageUrl?: string;
    }
  >();

  items.forEach((item) => {
    const rawCategory = item.category?.trim();
    // Default fallback name if item has no category
    const catName =
      rawCategory ||
      (item.type === 'COURSE' ? 'Courses & Training' : item.type === 'SERVICE' ? 'Services' : 'General Products');

    if (!categoryMap.has(catName)) {
      categoryMap.set(catName, {
        name: catName,
        items: [],
        firstImageUrl: item.imageUrl,
      });
    }

    const entry = categoryMap.get(catName)!;
    entry.items.push(item);
    if (!entry.firstImageUrl && item.imageUrl) {
      entry.firstImageUrl = item.imageUrl;
    }
  });

  const result: CategoryBarItem[] = [];

  categoryMap.forEach((entry, catName) => {
    // 1. Check custom images passed by merchant
    let finalImageUrl = customCategoryImages?.[catName.toLowerCase()];

    // 2. Check first product in category having an image
    if (!finalImageUrl && entry.firstImageUrl) {
      finalImageUrl = entry.firstImageUrl;
    }

    // 3. Check preset keywords
    if (!finalImageUrl) {
      const lowerName = catName.toLowerCase();
      for (const [keyword, presetUrl] of Object.entries(CATEGORY_IMAGE_PRESETS)) {
        if (lowerName.includes(keyword)) {
          finalImageUrl = presetUrl;
          break;
        }
      }
    }

    // 4. Default fallback
    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=240&q=80';
    }

    result.push({
      id: `cat-${catName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: catName,
      imageUrl: finalImageUrl,
      count: entry.items.length,
    });
  });

  return result;
}

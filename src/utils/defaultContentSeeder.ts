import { 
  Shop, 
  ProductItem, 
  ReviewItem, 
  ShopSectionsConfig, 
  FeatureItem, 
  ServiceItem,
  TestimonialItem 
} from '../types';
import { getDefaultSectionsConfig } from './sectionDefaults';

export interface SeedStoreInput {
  businessName: string;
  vendorName: string;
  category: string;
  mainCategory?: string;
  subCategory?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
}

export interface SeededContent {
  tagline: string;
  bannerTitle: string;
  bannerSubtitle: string;
  banners: string[];
  desktopBanners: string[];
  mobileBanners: string[];
  logoUrl: string;
  aboutPhotoUrl: string;
  aboutStory: string;
  establishedYear: string;
  colorTheme: 'saffron' | 'rose' | 'emerald' | 'gold' | 'royal' | 'maroon';
  products: ProductItem[];
  services: ServiceItem[];
  features: FeatureItem[];
  faq: Array<{ id: string; question: string; answer: string }>;
  reviews: ReviewItem[];
  testimonials: TestimonialItem[];
  galleryImages: string[];
  trustBadges: Array<{ id: string; title: string; subtitle?: string; icon?: string }>;
  announcementBar: {
    enabled: boolean;
    text: string;
  };
}

export type CategoryArchetype =
  | 'food_dining'
  | 'healthcare'
  | 'education'
  | 'beauty_wellness'
  | 'fashion_clothing'
  | 'jewellery'
  | 'grocery_retail'
  | 'repair_maintenance'
  | 'automotive'
  | 'real_estate'
  | 'fitness_sports'
  | 'digital_it'
  | 'construction_home'
  | 'photography_media'
  | 'travel_hospitality'
  | 'legal_finance'
  | 'pets_veterinary'
  | 'agriculture_farming'
  | 'printing_stationery'
  | 'events_entertainment'
  | 'general_business';

/**
 * Intelligent archetype resolver based on main category and sub category strings
 */
export function detectCategoryArchetype(mainCategory: string = '', subCategory: string = ''): CategoryArchetype {
  const combined = `${mainCategory} ${subCategory}`.toLowerCase();

  if (combined.match(/food|dining|restaurant|cafe|dhaba|fast food|bakery|sweet|mithai|catering|kitchen|tiffin/i)) {
    return 'food_dining';
  }
  if (combined.match(/health|doctor|clinic|dentist|dental|physio|hospital|medical|pharma|pathology|diagnostic|ayurved|homeopath/i)) {
    return 'healthcare';
  }
  if (combined.match(/education|school|college|coaching|tuition|institute|academy|training|computer institute|music academy|dance academy/i)) {
    return 'education';
  }
  if (combined.match(/beauty|wellness|salon|spa|parlour|makeup|hair|barber|skin|nail|tattoo|massage/i)) {
    return 'beauty_wellness';
  }
  if (combined.match(/jewel|gold|silver|diamond|ornament/i)) {
    return 'jewellery';
  }
  if (combined.match(/clothing|fashion|poshak|saree|kurti|suit|boutique|tailor|apparel|textile/i)) {
    return 'fashion_clothing';
  }
  if (combined.match(/grocery|kirana|supermarket|vegetable|fruit|dry fruit|provision|daily needs|ration/i)) {
    return 'grocery_retail';
  }
  if (combined.match(/repair|maintenance|ac service|laptop repair|mobile repair|appliance repair|electrician|plumber/i)) {
    return 'repair_maintenance';
  }
  if (combined.match(/automotive|car|bike|motor|garage|auto|vehicle|tyre|car wash|cab|taxi/i)) {
    return 'automotive';
  }
  if (combined.match(/real estate|property|builder|flat|plot|rent|lease|broker|housing/i)) {
    return 'real_estate';
  }
  if (combined.match(/fitness|gym|sports|yoga|workout|crossfit|martial arts|bodybuilding/i)) {
    return 'fitness_sports';
  }
  if (combined.match(/digital|it|software|website|web design|marketing|seo|graphic|developer|tech/i)) {
    return 'digital_it';
  }
  if (combined.match(/construction|interior|contractor|architect|paint|modular kitchen|building|home decor/i)) {
    return 'construction_home';
  }
  if (combined.match(/photography|photo|video|studio|wedding shoot|cameraman|cinematography/i)) {
    return 'photography_media';
  }
  if (combined.match(/travel|tourism|tour|hotel|resort|homestay|guest house|holiday|pg|hostel/i)) {
    return 'travel_hospitality';
  }
  if (combined.match(/legal|lawyer|advocate|finance|accounting|ca |chartered|tax|gst|loan|insurance/i)) {
    return 'legal_finance';
  }
  if (combined.match(/pet|veterinary|vet |dog|cat|animal/i)) {
    return 'pets_veterinary';
  }
  if (combined.match(/agri|farm|seed|fertilizer|dairy|krishi|plants|nursery/i)) {
    return 'agriculture_farming';
  }
  if (combined.match(/print|stationery|flex|offset|visiting card|banner printing/i)) {
    return 'printing_stationery';
  }
  if (combined.match(/event|entertainment|dj |party|banquet|celebration|wedding planner/i)) {
    return 'events_entertainment';
  }

  return 'general_business';
}

/**
 * Returns rich category-tailored seeds (images, text, products, services, FAQs, reviews, features)
 */
export function getCategorySeedData(
  archetype: CategoryArchetype,
  businessName: string,
  vendorName: string,
  city: string
): SeededContent {
  const bName = businessName.trim() || 'Our Store';
  const vName = vendorName.trim() || 'Merchant';
  const cName = city.trim() || 'Local City';
  const now = Date.now();

  switch (archetype) {
    case 'food_dining':
      return {
        tagline: `Taste the Authentic Flavours of ${cName} — Fresh & Pure Ingredients`,
        bannerTitle: `${bName} — Delicious Food & Dining`,
        bannerSubtitle: `Authentic recipes, fresh daily preparation, and prompt doorstep delivery or dine-in in ${cName}.`,
        colorTheme: 'saffron',
        establishedYear: '2019',
        banners: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
        ],
        desktopBanners: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
        ],
        mobileBanners: [
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        ],
        logoUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80',
        aboutPhotoUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
        aboutStory: `Founded by ${vName}, ${bName} brings the warmest hospitality and authentic culinary creations to ${cName}. Every dish is prepared with 100% fresh spices, hygienic kitchen standards, and uncompromising love for genuine taste. Connect with us directly on WhatsApp for daily specials and party catering.`,
        products: [
          {
            id: `p_${now}_1`,
            name: 'Special Royal Thali / Combo Platter',
            type: 'PRODUCT',
            price: 249,
            originalPrice: 320,
            category: 'Main Course',
            description: 'Rich assorted delicacies served with fresh tandoori breads, fragrant jeera rice, dal makhani, paneer, and dessert.',
            imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'thali',
          },
          {
            id: `p_${now}_2`,
            name: 'Signature Paneer Tikka / Starters',
            type: 'PRODUCT',
            price: 189,
            originalPrice: 240,
            category: 'Starters',
            description: 'Marinated in rich yogurt and freshly ground spices, roasted to smoky perfection in clay oven.',
            imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'plate',
          },
          {
            id: `p_${now}_3`,
            name: 'Artisan Fresh Baked Pizza / Snacks',
            type: 'PRODUCT',
            price: 229,
            originalPrice: 299,
            category: 'Fast Food',
            description: 'Crispy hand-tossed base loaded with fresh farm veggies, rich mozzarella cheese, and secret Italian herb sauce.',
            imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'regular',
          },
          {
            id: `p_${now}_4`,
            name: 'Traditional Gulab Jamun / Dessert Box',
            type: 'PRODUCT',
            price: 120,
            originalPrice: 160,
            category: 'Desserts',
            description: 'Melt-in-mouth hot khoya dumplings soaked in fragrant saffron-cardamom sugar syrup.',
            imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'box',
          },
        ],
        services: [
          {
            id: `srv_${now}_1`,
            title: 'Party & Event Catering',
            description: 'Full-service catering for weddings, birthdays, corporate lunches, and family gatherings.',
            price: 'Starting ₹350/plate',
            duration: 'Custom Menu',
            icon: 'Utensils',
          },
          {
            id: `srv_${now}_2`,
            title: 'Daily Home Tiffin Service',
            description: 'Hygienic, home-style balanced meals delivered daily to your home or office.',
            price: '₹2,400/month',
            duration: 'Daily Delivery',
            icon: 'Clock',
          },
          {
            id: `srv_${now}_3`,
            title: 'Live Table Reservation',
            description: 'Reserve prime family seating in advance with no wait time on WhatsApp.',
            price: 'Complimentary',
            duration: 'Instant Booking',
            icon: 'MessageSquare',
          },
        ],
        features: [
          {
            id: 'feat_1',
            title: '100% Fresh & Hygienic',
            description: 'Prepared strictly with sanitized cooking stations and verified fresh farm produce.',
            icon: 'ShieldCheck',
          },
          {
            id: 'feat_2',
            title: 'Direct WhatsApp Ordering',
            description: 'No middleman app commissions. Get direct kitchen rates and instant order confirmation.',
            icon: 'Zap',
          },
          {
            id: 'feat_3',
            title: 'Hot & Fast Local Delivery',
            description: 'Insulated thermal packing ensures your food arrives piping hot and fresh at your door.',
            icon: 'Clock',
          },
          {
            id: 'feat_4',
            title: 'Pure Desi Ghee & Spices',
            description: 'Authentic regional recipes using traditional cooking techniques and pure ingredients.',
            icon: 'Award',
          },
        ],
        faq: [
          {
            id: 'faq_1',
            question: 'How do I place an order for delivery or pickup?',
            answer: 'Simply click "Order on WhatsApp", add your desired dishes to the cart or message us your address. We confirm within 2 minutes!',
          },
          {
            id: 'faq_2',
            question: 'What is the average delivery time?',
            answer: 'Local orders are prepared fresh and delivered within 30 to 45 minutes across our serviceable radius.',
          },
          {
            id: 'faq_3',
            question: 'Do you take bulk catering orders for events?',
            answer: 'Yes! We cater for parties, poojas, birthdays, and corporate events. Contact us 24-48 hours in advance for customized menus and tasting.',
          },
          {
            id: 'faq_4',
            question: 'What payment modes are accepted?',
            answer: 'You can pay using UPI (GPay, PhonePe, Paytm), Cash on Delivery, or Card on pickup.',
          },
        ],
        reviews: [
          {
            id: `rev_${now}_1`,
            author: 'Rahul Sharma',
            rating: 5,
            city: cName,
            date: '3 days ago',
            comment: 'Mind-blowing taste! Ordered the royal thali and paneer tikka on WhatsApp. Arrived sizzling hot within 30 mins.',
          },
          {
            id: `rev_${now}_2`,
            author: 'Priya Mehra',
            rating: 5,
            city: cName,
            date: '1 week ago',
            comment: 'Best food experience in town. Clean, authentic flavours without excess oil. Very polite service.',
          },
          {
            id: `rev_${now}_3`,
            author: 'Ankit Gupta',
            rating: 5,
            city: cName,
            date: '2 weeks ago',
            comment: 'Booked catering for a 50-person family lunch. Everyone praised the food quality and hygiene. Highly recommended!',
          },
        ],
        testimonials: [
          {
            id: 'test_1',
            name: 'Rahul Sharma',
            location: `${cName} Civil Lines`,
            rating: 5,
            text: 'Mind-blowing taste! The WhatsApp ordering was effortless and food arrived piping hot within 30 mins.',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
          },
          {
            id: 'test_2',
            name: 'Priya Mehra',
            location: `${cName} Central`,
            rating: 5,
            text: 'Clean and authentic flavours. Ordering directly saved us 20% compared to food delivery apps.',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
          },
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
        ],
        trustBadges: [
          { id: 'tb_1', title: 'FSSAI Certified Hygiene', subtitle: 'Strict Quality Inspection', icon: 'ShieldCheck' },
          { id: 'tb_2', title: '30-45 Min Hot Delivery', subtitle: 'Thermal Sealed Packaging', icon: 'Clock' },
          { id: 'tb_3', title: 'Zero App Commissions', subtitle: 'Direct Kitchen Pricing', icon: 'Zap' },
          { id: 'tb_4', title: '100% Pure & Fresh', subtitle: 'Daily Procured Spices', icon: 'Award' },
        ],
        announcementBar: {
          enabled: true,
          text: '🎉 Welcome to our official store! Get 10% instant discount on direct WhatsApp orders today!',
        },
      };

    case 'healthcare':
      return {
        tagline: `Compassionate, Trusted & Modern Healthcare Care in ${cName}`,
        bannerTitle: `${bName} — Advanced Medical & Health Care`,
        bannerSubtitle: `Experienced medical specialists, modern diagnostic equipment, and personalized care for your entire family.`,
        colorTheme: 'royal',
        establishedYear: '2016',
        banners: [
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
        ],
        desktopBanners: [
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
        ],
        mobileBanners: [
          'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
        ],
        logoUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=300&auto=format&fit=crop&q=80',
        aboutPhotoUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80',
        aboutStory: `Led by ${vName} and certified medical practitioners, ${bName} provides patient-centric clinical care in ${cName}. We combine diagnostic precision, gentle consultations, and ethical healthcare practices to safeguard your well-being. Book appointments directly on WhatsApp for zero clinic wait times.`,
        products: [
          {
            id: `p_${now}_1`,
            name: 'Specialist Doctor OPD Consultation',
            type: 'SERVICE',
            price: 500,
            originalPrice: 700,
            category: 'Consultation',
            description: 'Comprehensive physical examination, medical history review, expert diagnosis, and digital prescription.',
            imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'session',
          },
          {
            id: `p_${now}_2`,
            name: 'Full Body Preventive Health Package',
            type: 'SERVICE',
            price: 1499,
            originalPrice: 2800,
            category: 'Diagnostics',
            description: 'Includes Complete Blood Count (CBC), Lipid Profile, Liver Function, Kidney Function, Thyroid & Blood Sugar tests.',
            imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'package',
          },
          {
            id: `p_${now}_3`,
            name: 'Dental Checkup, Scaling & Polishing',
            type: 'SERVICE',
            price: 799,
            originalPrice: 1200,
            category: 'Dental Care',
            description: 'Painless ultrasonic plaque removal, teeth stain polishing, and intraoral camera examination.',
            imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'visit',
          },
          {
            id: `p_${now}_4`,
            name: 'Physiotherapy & Pain Relief Session',
            type: 'SERVICE',
            price: 600,
            originalPrice: 900,
            category: 'Physiotherapy',
            description: 'Targeted physical therapy for back, neck, knee, and joint pain using modern electrotherapy and exercises.',
            imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'session',
          },
        ],
        services: [
          {
            id: `srv_${now}_1`,
            title: 'Online Video Consultation',
            description: 'Consult with specialist doctors from the comfort of your home with digital prescriptions.',
            price: '₹400/call',
            duration: '20 mins',
            icon: 'Video',
          },
          {
            id: `srv_${now}_2`,
            title: 'Home Sample Collection (Lab Tests)',
            description: 'Certified phlebotomists collect blood & urine samples safely at your doorstep.',
            price: 'Free with tests',
            duration: 'Same day',
            icon: 'Clock',
          },
          {
            id: `srv_${now}_3`,
            title: 'Emergency Priority Walk-In',
            description: 'Prompt medical attention for urgent non-critical conditions without delays.',
            price: 'OPD rates',
            duration: 'Immediate',
            icon: 'ShieldCheck',
          },
        ],
        features: [
          {
            id: 'feat_1',
            title: 'Certified MD Specialists',
            description: 'Experienced doctors dedicated to ethical practice and evidence-based medicine.',
            icon: 'Award',
          },
          {
            id: 'feat_2',
            title: 'Digital Reports on WhatsApp',
            description: 'Access diagnostic test reports and prescriptions seamlessly on your phone within hours.',
            icon: 'Zap',
          },
          {
            id: 'feat_3',
            title: 'Hygienic & Sterilized Clinic',
            description: 'Hospital-grade sanitization protocols and single-use disposable equipment.',
            icon: 'ShieldCheck',
          },
          {
            id: 'feat_4',
            title: 'Affordable & Transparent Charges',
            description: 'Honest rates with zero hidden lab fees or unnecessary medical testing.',
            icon: 'Clock',
          },
        ],
        faq: [
          {
            id: 'faq_1',
            question: 'How do I book a clinic or home visit appointment?',
            answer: 'Click "Book on WhatsApp" or use the appointment button. Select your preferred date and time, and our clinic desk confirms instantly.',
          },
          {
            id: 'faq_2',
            question: 'How soon are lab test reports delivered?',
            answer: 'Routine blood test reports are delivered on WhatsApp within 6 to 12 hours. Specialized pathology tests take 24 hours.',
          },
          {
            id: 'faq_3',
            question: 'Is home sample collection available in my locality?',
            answer: 'Yes, we provide home sample collection across all sectors and nearby areas of the city with temperature-controlled sample kits.',
          },
          {
            id: 'faq_4',
            question: 'Can I get repeat prescriptions on WhatsApp?',
            answer: 'For ongoing chronic treatments, existing patients can consult their doctor and receive verified digital refills directly.',
          },
        ],
        reviews: [
          {
            id: `rev_${now}_1`,
            author: 'Dr. S. K. Dwivedi',
            rating: 5,
            city: cName,
            date: '4 days ago',
            comment: 'Exceptional diagnostic care. The doctor explained my condition with immense patience. Clean and modern clinic setup.',
          },
          {
            id: `rev_${now}_2`,
            author: 'Sunita Verma',
            rating: 5,
            city: cName,
            date: '1 week ago',
            comment: 'Booked the full body package. Sample collection was smooth and on time. Received reports on WhatsApp the same evening!',
          },
          {
            id: `rev_${now}_3`,
            author: 'Manoj Bajpayee',
            rating: 5,
            city: cName,
            date: '3 weeks ago',
            comment: 'Very professional dental cleaning. No pain and genuine advice without pushing unnecessary procedures.',
          },
        ],
        testimonials: [
          {
            id: 'test_1',
            name: 'Dr. S. K. Dwivedi',
            location: `${cName} Cantonment`,
            rating: 5,
            text: 'Exceptional diagnostic care. The doctor explained everything with immense patience.',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
          },
          {
            id: 'test_2',
            name: 'Sunita Verma',
            location: `${cName} Model Town`,
            rating: 5,
            text: 'Home sample collection was prompt and reports arrived on WhatsApp the very same evening.',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
          },
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&auto=format&fit=crop&q=80',
        ],
        trustBadges: [
          { id: 'tb_1', title: 'Certified Medical Staff', subtitle: 'Verified Qualifications', icon: 'Award' },
          { id: 'tb_2', title: 'Hospital-Grade Hygiene', subtitle: 'Sterilized Instruments', icon: 'ShieldCheck' },
          { id: 'tb_3', title: 'Digital WhatsApp Reports', subtitle: 'Fast Same-Day Delivery', icon: 'Clock' },
          { id: 'tb_4', title: 'Patient-First Ethics', subtitle: 'Honest Consultations', icon: 'Zap' },
        ],
        announcementBar: {
          enabled: true,
          text: '🩺 Book OPD consultation or preventive health checkup directly on WhatsApp for priority slots!',
        },
      };

    case 'education':
      return {
        tagline: `Empowering Students for Academic & Career Excellence in ${cName}`,
        bannerTitle: `${bName} — Premier Coaching & Learning Centre`,
        bannerSubtitle: `Expert mentor guidance, structured curriculum, regular mock testing, and proven success track record in ${cName}.`,
        colorTheme: 'emerald',
        establishedYear: '2015',
        banners: [
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
        ],
        desktopBanners: [
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
        ],
        mobileBanners: [
          'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
        ],
        logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&auto=format&fit=crop&q=80',
        aboutPhotoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
        aboutStory: `Founded by ${vName}, ${bName} has mentored hundreds of ambitious students in ${cName} towards achieving top scores and competitive milestones. We prioritize individual attention, conceptual clarity, and rigorous revision over rote learning. Connect on WhatsApp to book a free demo session.`,
        products: [
          {
            id: `p_${now}_1`,
            name: 'Comprehensive Board & Foundation Batch (Class 9-12)',
            type: 'COURSE',
            price: 2500,
            originalPrice: 3500,
            category: 'Academic Courses',
            description: 'Subject mastery in Physics, Chemistry, Maths & Biology with chapter-wise notes and weekly test series.',
            imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'month',
          },
          {
            id: `p_${now}_2`,
            name: 'Competitive Exam Fast-Track Crash Course',
            type: 'COURSE',
            price: 6999,
            originalPrice: 9999,
            category: 'Entrance Exams',
            description: 'High-yield problem solving, shortcut formulas, previous 10 years solved papers, and full-length simulated tests.',
            imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'batch',
          },
          {
            id: `p_${now}_3`,
            name: 'Computer & Professional Skills Certification',
            type: 'COURSE',
            price: 3499,
            originalPrice: 5000,
            category: 'Technical Skills',
            description: 'Practical training in Computer Fundamentals, MS Office, Typing, Web Development, and Digital Literacy with certification.',
            imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: '3 months',
          },
          {
            id: `p_${now}_4`,
            name: 'Spoken English & Personality Development',
            type: 'COURSE',
            price: 1999,
            originalPrice: 2800,
            category: 'Language & Soft Skills',
            description: 'Fluency drills, interview grooming, public speaking confidence, and active vocabulary building.',
            imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'batch',
          },
        ],
        services: [
          {
            id: `srv_${now}_1`,
            title: '1-on-1 Personalized Mentoring',
            description: 'Dedicated faculty guidance for doubt clearing and customized study planning.',
            price: '₹500/hr',
            duration: 'Flexible',
            icon: 'GraduationCap',
          },
          {
            id: `srv_${now}_2`,
            title: 'Free 2-Day Demo Classes',
            description: 'Attend live classes to experience our teaching methodology before final admission.',
            price: 'Free',
            duration: '2 Days',
            icon: 'Clock',
          },
          {
            id: `srv_${now}_3`,
            title: 'Monthly Progress & Parent Meetings',
            description: 'Detailed student analytics reports shared with parents every month.',
            price: 'Included',
            duration: 'Monthly',
            icon: 'Award',
          },
        ],
        features: [
          {
            id: 'feat_1',
            title: 'Experienced Faculty',
            description: 'Passionate educators with years of track record producing board and competitive toppers.',
            icon: 'Award',
          },
          {
            id: 'feat_2',
            title: 'Small Batch Sizes',
            description: 'Limited students per classroom ensuring individual doubt-solving and close attention.',
            icon: 'ShieldCheck',
          },
          {
            id: 'feat_3',
            title: 'Printed Study Modules',
            description: 'Curated question banks, concise theory notes, and formula sheets provided to every enrolled student.',
            icon: 'Zap',
          },
          {
            id: 'feat_4',
            title: 'Weekly Performance Tracking',
            description: 'Computerized OMR evaluation and performance scorecards sent directly to parents on WhatsApp.',
            icon: 'Clock',
          },
        ],
        faq: [
          {
            id: 'faq_1',
            question: 'Can my child take a demo class before paying the fee?',
            answer: 'Yes! We offer a 2-day free demo class for all batches. Just message us on WhatsApp to register your student.',
          },
          {
            id: 'faq_2',
            question: 'What are the batch timings?',
            answer: 'We have flexible morning and evening batches designed to avoid clashes with regular school and college hours.',
          },
          {
            id: 'faq_3',
            question: 'Are installment payment options available for fees?',
            answer: 'Yes, fees can be paid in monthly or quarterly installments via UPI, Cash, or Net Banking.',
          },
          {
            id: 'faq_4',
            question: 'How do you help students with backlog or weak topics?',
            answer: 'We hold dedicated weekend revision and doubt-clearing sessions at zero extra charges.',
          },
        ],
        reviews: [
          {
            id: `rev_${now}_1`,
            author: 'Ravi Teja',
            rating: 5,
            city: cName,
            date: '5 days ago',
            comment: 'Scored 94% in my 12th boards! The concepts taught here are so clear that even difficult math chapters became easy.',
          },
          {
            id: `rev_${now}_2`,
            author: 'Mrs. Neha Srivastava (Parent)',
            rating: 5,
            city: cName,
            date: '2 weeks ago',
            comment: 'Very disciplined institute. Teachers give personal attention and regular updates are shared on WhatsApp.',
          },
          {
            id: `rev_${now}_3`,
            author: 'Deepak Yadav',
            rating: 5,
            city: cName,
            date: '1 month ago',
            comment: 'Joined the computer and English course. The practical training boosted my interview confidence tremendously.',
          },
        ],
        testimonials: [
          {
            id: 'test_1',
            name: 'Ravi Teja',
            location: `${cName} Student`,
            rating: 5,
            text: 'Scored 94% in my board exams! The mentors explain every single concept with crystal clarity.',
            avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120',
          },
          {
            id: 'test_2',
            name: 'Mrs. Neha Srivastava',
            location: `${cName} Parent`,
            rating: 5,
            text: 'Disciplined atmosphere and my daughter improved her scores remarkably within 3 months.',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
          },
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=80',
        ],
        trustBadges: [
          { id: 'tb_1', title: 'Proven Board Results', subtitle: 'Over 90% Success Rate', icon: 'Award' },
          { id: 'tb_2', title: 'Free 2-Day Demo', subtitle: 'Zero Obligation Trial', icon: 'Zap' },
          { id: 'tb_3', title: 'Structured Test Series', subtitle: 'Weekly Assessment', icon: 'Clock' },
          { id: 'tb_4', title: 'WhatsApp Doubts Support', subtitle: 'Instant Faculty Assistance', icon: 'ShieldCheck' },
        ],
        announcementBar: {
          enabled: true,
          text: '🎓 Admissions Open for the New Academic Batch! Register for a Free 2-Day Demo Class today.',
        },
      };

    case 'beauty_wellness':
      return {
        tagline: `Look & Feel Your Best — Premium Salon & Spa Experience in ${cName}`,
        bannerTitle: `${bName} — Luxury Beauty & Wellness Lounge`,
        bannerSubtitle: `Certified hair stylists, relaxing spa therapies, radiant skincare, and bridal transformations in ${cName}.`,
        colorTheme: 'rose',
        establishedYear: '2020',
        banners: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
        ],
        desktopBanners: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
        ],
        mobileBanners: [
          'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80',
        ],
        logoUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&auto=format&fit=crop&q=80',
        aboutPhotoUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&auto=format&fit=crop&q=80',
        aboutStory: `Founded by ${vName}, ${bName} brings world-class grooming, hair fashion, and therapeutic wellness to ${cName}. We use international branded cosmetics, hygienic disposable kits, and personalized styling consultations to give you an unforgettable pampering session.`,
        products: [
          {
            id: `p_${now}_1`,
            name: 'Advanced Hair Spa & Keratin Smoothing',
            type: 'SERVICE',
            price: 1499,
            originalPrice: 2500,
            category: 'Hair Care',
            description: 'Deep nourishing hair mask, scalp massage, steam treatment, and frizz-free serum finish for glossy healthy hair.',
            imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'session',
          },
          {
            id: `p_${now}_2`,
            name: 'Radiance Gold Facial & De-Tan Therapy',
            type: 'SERVICE',
            price: 999,
            originalPrice: 1600,
            category: 'Skin Care',
            description: 'Herbal exfoliation, tan removal pack, micro-massage, and gold peel-off mask for an instant luminous glow.',
            imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'session',
          },
          {
            id: `p_${now}_3`,
            name: 'Signature Bridal & Party Makeup Package',
            type: 'SERVICE',
            price: 4999,
            originalPrice: 7500,
            category: 'Makeup',
            description: 'HD Airbrush makeup, designer hairstyling, saree/lehenga draping, eyelashes, and long-lasting waterproof finish.',
            imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'event',
          },
          {
            id: `p_${now}_4`,
            name: 'Gentleman / Unisex Styling & Beard Spa',
            type: 'SERVICE',
            price: 399,
            originalPrice: 600,
            category: 'Grooming',
            description: 'Customized haircut, precision beard shaping, hot towel steam, and scalp relaxation massage.',
            imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'visit',
          },
        ],
        services: [
          {
            id: `srv_${now}_1`,
            title: 'Bridal & Groom Consultation',
            description: 'Pre-wedding skin routines and trial makeup sessions with top stylists.',
            price: 'Free Consultation',
            duration: '30 mins',
            icon: 'Sparkles',
          },
          {
            id: `srv_${now}_2`,
            title: 'At-Home Salon Service',
            description: 'Enjoy salon services in the comfort of your home with sanitized portable equipment.',
            price: 'Starting ₹799',
            duration: 'Doorstep',
            icon: 'Clock',
          },
        ],
        features: [
          {
            id: 'feat_1',
            title: '100% Branded Products',
            description: 'We use genuine L’Oréal, Matrix, O3+, and Mac cosmetics with zero cheap substitutes.',
            icon: 'Award',
          },
          {
            id: 'feat_2',
            title: 'Disposable & Sanitized Kits',
            description: 'Fresh disposable towels, aprons, and sanitized tools used for every single client.',
            icon: 'ShieldCheck',
          },
          {
            id: 'feat_3',
            title: 'Instant WhatsApp Booking',
            description: 'Book your time slot in seconds without annoying salon queue delays.',
            icon: 'Zap',
          },
          {
            id: 'feat_4',
            title: 'Certified Master Stylists',
            description: 'Stylists trained in the latest global hair trends, nail art, and skin therapies.',
            icon: 'Clock',
          },
        ],
        faq: [
          {
            id: 'faq_1',
            question: 'Do I need prior appointment or can I walk in?',
            answer: 'Walk-ins are always welcome, but booking in advance on WhatsApp ensures zero waiting time and dedicated stylist availability.',
          },
          {
            id: 'faq_2',
            question: 'What brands of cosmetics and hair products do you use?',
            answer: 'We exclusively use authorized professional brands like L’Oreal Professional, O3+, Schwarzkopf, and MAC.',
          },
          {
            id: 'faq_3',
            question: 'Do you offer home bridal makeup packages?',
            answer: 'Yes! Our senior makeup artists travel to wedding venues and homes with complete vanity lighting and equipment.',
          },
        ],
        reviews: [
          {
            id: `rev_${now}_1`,
            author: 'Kavita Singh',
            rating: 5,
            city: cName,
            date: '2 days ago',
            comment: 'Had my bridal makeup done here and everyone was stunned! Flawless HD finish that lasted the entire night without creasing.',
          },
          {
            id: `rev_${now}_2`,
            author: 'Aman Chawla',
            rating: 5,
            city: cName,
            date: '1 week ago',
            comment: 'Best haircut and beard groom in town. Hygienic setup and great ambiance.',
          },
        ],
        testimonials: [
          {
            id: 'test_1',
            name: 'Kavita Singh',
            location: cName,
            rating: 5,
            text: 'Flawless makeup that stayed fresh all night! The stylist was wonderful.',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
          },
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&auto=format&fit=crop&q=80',
        ],
        trustBadges: [
          { id: 'tb_1', title: '100% Genuine Brands', subtitle: 'L’Oréal, MAC, O3+', icon: 'Award' },
          { id: 'tb_2', title: 'Single-Use Disposable Kits', subtitle: 'Strict Hygiene', icon: 'ShieldCheck' },
          { id: 'tb_3', title: 'Zero Wait on Booking', subtitle: 'WhatsApp Priority', icon: 'Clock' },
          { id: 'tb_4', title: 'Certified Stylists', subtitle: 'Expert Care', icon: 'Zap' },
        ],
        announcementBar: {
          enabled: true,
          text: '✨ Special Festive Beauty Offer! Flat 20% off on Hair Spa & Facials when booked on WhatsApp.',
        },
      };

    case 'fashion_clothing':
      return {
        tagline: `Step Out in Style — Trendy, Elegant & Festive Fashion in ${cName}`,
        bannerTitle: `${bName} — Designer Apparel & Boutique Collection`,
        bannerSubtitle: `Handpicked ethnic wear, everyday comfortable fashion, and custom tailoring with easy WhatsApp ordering in ${cName}.`,
        colorTheme: 'rose',
        establishedYear: '2021',
        banners: [
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80',
        ],
        desktopBanners: [
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80',
        ],
        mobileBanners: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
        ],
        logoUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop&q=80',
        aboutPhotoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
        aboutStory: `Founded by ${vName}, ${bName} celebrates Indian fashion with a contemporary touch. From hand-embroidered kurtis to regal festive poshak and everyday cotton comfort, we bring high quality fabrics, flawless fitting, and honest pricing to customers in ${cName}.`,
        products: [
          {
            id: `p_${now}_1`,
            name: 'Designer Hand-Embroidered Festive Kurti Set',
            type: 'PRODUCT',
            price: 1299,
            originalPrice: 1899,
            category: 'Ethnic Wear',
            description: 'Pure chanderi silk kurti with intricate threadwork, matching cigarette pants, and organza dupatta.',
            imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'set',
          },
          {
            id: `p_${now}_2`,
            name: 'Pure Georgette Royal Poshak / Saree',
            type: 'PRODUCT',
            price: 2499,
            originalPrice: 3800,
            category: 'Traditional & Bridal',
            description: 'Vibrant gota-patti and zari work traditional attire crafted for weddings, festivals, and family celebrations.',
            imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'piece',
          },
          {
            id: `p_${now}_3`,
            name: 'Premium Breathable Cotton Casual Shirt',
            type: 'PRODUCT',
            price: 799,
            originalPrice: 1200,
            category: 'Mens Wear',
            description: '100% combed breathable cotton with modern slim collar, perfect for both office and weekend casual wear.',
            imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'piece',
          },
        ],
        services: [
          {
            id: `srv_${now}_1`,
            title: 'Custom Boutique Tailoring & Alteration',
            description: 'Get your blouses, suits, and dresses stitched with precision measurements.',
            price: 'Starting ₹350',
            duration: '2-3 days',
            icon: 'Scissors',
          },
        ],
        features: [
          { id: 'feat_1', title: '100% Pure Tested Fabrics', description: 'Color-fast, shrinkage-proof fabrics sourced from authentic weavers.', icon: 'Award' },
          { id: 'feat_2', title: 'Flawless Tailored Fit', description: 'Expert boutique cutting ensuring a graceful silhouette.', icon: 'ShieldCheck' },
          { id: 'feat_3', title: 'WhatsApp Size Assistance', description: 'Send your measurements or photos on WhatsApp for guided sizing.', icon: 'Zap' },
          { id: 'feat_4', title: 'Hassle-Free 7-Day Exchange', description: 'Exchange within 7 days if size is not 100% satisfactory.', icon: 'Clock' },
        ],
        faq: [
          { id: 'faq_1', question: 'How can I choose my correct size?', answer: 'Check our size guide or share your bust/waist measurements on WhatsApp. Our styling team will suggest the exact fit!' },
          { id: 'faq_2', question: 'Can I exchange if the size does not fit?', answer: 'Yes! We offer an instant 7-day doorstep size exchange policy.' },
        ],
        reviews: [
          { id: `rev_${now}_1`, author: 'Sunita Jain', rating: 5, city: cName, date: '3 days ago', comment: 'Loved the kurti set! Fabric is super soft and stitching is immaculate. Arrived within 2 days.' },
        ],
        testimonials: [
          { id: 'test_1', name: 'Sunita Jain', location: cName, rating: 5, text: 'Loved the kurti set! Stitching is neat and fabric is premium.', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
          'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600',
        ],
        trustBadges: [
          { id: 'tb_1', title: '100% Tested Fabrics', subtitle: 'Color Fast Guarantee', icon: 'Award' },
          { id: 'tb_2', title: '7-Day Easy Exchange', subtitle: 'Hassle-Free', icon: 'ShieldCheck' },
          { id: 'tb_3', title: 'Direct WhatsApp Order', subtitle: 'Instant Response', icon: 'Zap' },
        ],
        announcementBar: { enabled: true, text: '👗 New Festive Arrivals! Flat 15% off on your first WhatsApp order.' },
      };

    case 'automotive':
      return {
        tagline: `Reliable Auto Care, Genuine Spares & Precision Service in ${cName}`,
        bannerTitle: `${bName} — Multi-Brand Car & Bike Workshop`,
        bannerSubtitle: `Certified mechanics, computerized engine diagnostics, genuine spares, and transparent job cards in ${cName}.`,
        colorTheme: 'royal',
        establishedYear: '2017',
        banners: [
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop&q=80',
        ],
        desktopBanners: [
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop&q=80',
        ],
        mobileBanners: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
        ],
        logoUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&auto=format&fit=crop&q=80',
        aboutPhotoUrl: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800&auto=format&fit=crop&q=80',
        aboutStory: `Founded by ${vName}, ${bName} is the preferred automobile service partner for car and bike owners in ${cName}. We provide honest vehicle health inspections, OEM authentic spares, and photo-updates on WhatsApp while your vehicle is being serviced.`,
        products: [
          {
            id: `p_${now}_1`,
            name: 'Comprehensive Periodic Car Service Package',
            type: 'SERVICE',
            price: 1899,
            originalPrice: 2800,
            category: 'Car Maintenance',
            description: 'Synthetic engine oil replacement, oil filter change, air filter cleaning, brake inspection, and 40-point full vehicle scan.',
            imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'service',
          },
          {
            id: `p_${now}_2`,
            name: 'High Pressure Foam Wash & Interior Deep Cleaning',
            type: 'SERVICE',
            price: 599,
            originalPrice: 900,
            category: 'Washing & Detailing',
            description: 'Underbody wash, high-gloss snow foam wash, interior vacuuming, dashboard polish, and tyre shine.',
            imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'wash',
          },
          {
            id: `p_${now}_3`,
            name: 'Computerized 3D Wheel Alignment & Balancing',
            type: 'SERVICE',
            price: 450,
            originalPrice: 650,
            category: 'Tyres & Suspension',
            description: 'Digital 3D camera sensor alignment with laser precision to prevent tyre wear and enhance fuel economy.',
            imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: '4 wheels',
          },
        ],
        services: [
          {
            id: `srv_${now}_1`,
            title: 'Doorstep Breakdown & Battery Jumpstart',
            description: 'Stuck with a dead battery or flat tyre? Our quick technician reaches you within 30 mins.',
            price: 'Starting ₹299',
            duration: '30 mins response',
            icon: 'Zap',
          },
        ],
        features: [
          { id: 'feat_1', title: '100% OEM Spares', description: 'Authorized Bosch, Castrol, and genuine brand lubricants and filters.', icon: 'ShieldCheck' },
          { id: 'feat_2', title: 'Live WhatsApp Job Updates', description: 'Receive photos and videos of replaced parts right on WhatsApp.', icon: 'Zap' },
          { id: 'feat_3', title: 'Free Pickup & Drop', description: 'Hassle-free vehicle pickup and drop-off from your home or office.', icon: 'Clock' },
          { id: 'feat_4', title: 'Transparent Upfront Estimates', description: 'Zero work begun without your prior explicit WhatsApp approval.', icon: 'Award' },
        ],
        faq: [
          { id: 'faq_1', question: 'How do I schedule a car service or wash?', answer: 'Click "Book on WhatsApp", share your car model and preferred time slot. We will arrange pickup or reserve your bay.' },
          { id: 'faq_2', question: 'Do you give warranty on spare parts replaced?', answer: 'Yes, all replacement components carry full manufacturer warranties up to 12 months.' },
        ],
        reviews: [
          { id: `rev_${now}_1`, author: 'Vivek Sharma', rating: 5, city: cName, date: '1 week ago', comment: 'Very genuine garage. They sent videos of the old parts and engine oil change. Saved 40% over company showroom rates!' },
        ],
        testimonials: [
          { id: 'test_1', name: 'Vivek Sharma', location: cName, rating: 5, text: 'Transparent billing and excellent workmanship. My car runs smooth as new.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600',
          'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=600',
        ],
        trustBadges: [
          { id: 'tb_1', title: 'Genuine OEM Parts', subtitle: '100% Authentic', icon: 'ShieldCheck' },
          { id: 'tb_2', title: 'WhatsApp Live Photos', subtitle: 'Full Transparency', icon: 'Zap' },
          { id: 'tb_3', title: 'Free Pickup & Drop', subtitle: 'Local Convenience', icon: 'Clock' },
        ],
        announcementBar: { enabled: true, text: '🚗 Pre-Monsoon Vehicle Checkup! Free 20-Point Safety Inspection with every service.' },
      };

    case 'grocery_retail':
    default:
      return {
        tagline: `Quality, Trust & Genuine Prices in ${cName} — Delivered to Your Doorstep`,
        bannerTitle: `${bName} — Official Digital Store`,
        bannerSubtitle: `Shop 100% genuine products, daily essentials, and exclusive deals directly on WhatsApp with fast local delivery in ${cName}.`,
        colorTheme: 'saffron',
        establishedYear: '2018',
        banners: [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80',
        ],
        desktopBanners: [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80',
        ],
        mobileBanners: [
          'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
        ],
        logoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&auto=format&fit=crop&q=80',
        aboutPhotoUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&auto=format&fit=crop&q=80',
        aboutStory: `Founded by ${vName}, ${bName} has been serving families across ${cName} with genuine quality and friendly merchant service. We source directly from trusted manufacturers to bring you wholesale-competitive prices and hassle-free WhatsApp doorstep delivery.`,
        products: [
          {
            id: `p_${now}_1`,
            name: 'Pure Desi Cow Ghee & Dry Fruits Combo Pack',
            type: 'PRODUCT',
            price: 899,
            originalPrice: 1250,
            category: 'Groceries & Essentials',
            description: 'Traditional bilona churned pure cow ghee paired with premium California almonds and jumbo cashews.',
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'combo pack',
          },
          {
            id: `p_${now}_2`,
            name: 'Aged Royal Basmati Rice (5 Kg Pack)',
            type: 'PRODUCT',
            price: 499,
            originalPrice: 650,
            category: 'Staples & Grains',
            description: 'Extra long grain aromatic basmati rice aged for 2 years for royal biryanis and everyday luxury meals.',
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: '5 kg bag',
          },
          {
            id: `p_${now}_3`,
            name: 'Cold Pressed Mustard / Cooking Oil (5 Litre Can)',
            type: 'PRODUCT',
            price: 749,
            originalPrice: 950,
            category: 'Oils & Spices',
            description: 'Kachi Ghani natural extraction retaining essential nutrients, rich pungency, and authentic golden aroma.',
            imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'can',
          },
          {
            id: `p_${now}_4`,
            name: 'Fresh Farm Organic Spices & Masala Assortment',
            type: 'PRODUCT',
            price: 299,
            originalPrice: 420,
            category: 'Spices',
            description: 'Hand-sorted turmeric, coriander, red chilli, and garam masala without artificial colours or preservatives.',
            imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
            inStock: true,
            unit: 'pack of 4',
          },
        ],
        services: [
          {
            id: `srv_${now}_1`,
            title: 'Express Doorstep Delivery',
            description: 'Order by 5 PM and receive items at your doorstep the very same day.',
            price: 'Free above ₹500',
            duration: '2-4 hours',
            icon: 'Clock',
          },
          {
            id: `srv_${now}_2`,
            title: 'Monthly Monthly Grocery Subscription',
            description: 'Send us your monthly grocery list on WhatsApp and get automatic scheduled deliveries.',
            price: 'Extra 5% Discount',
            duration: 'Monthly',
            icon: 'Zap',
          },
        ],
        features: [
          {
            id: 'feat_1',
            title: '100% Genuine & Fresh Stock',
            description: 'Strict quality inspection on every single item before packing and dispatch.',
            icon: 'ShieldCheck',
          },
          {
            id: 'feat_2',
            title: 'Direct Local Store Rates',
            description: 'Save 15-20% compared to third-party delivery apps with direct merchant rates.',
            icon: 'Award',
          },
          {
            id: 'feat_3',
            title: '1-Click WhatsApp Ordering',
            description: 'No complicated registration forms. Chat with us on WhatsApp and your order is confirmed.',
            icon: 'Zap',
          },
          {
            id: 'feat_4',
            title: 'Safe UPI & Cash Payment',
            description: 'Pay on delivery via Cash, Google Pay, PhonePe, or Paytm directly to store QR.',
            icon: 'Clock',
          },
        ],
        faq: [
          {
            id: 'faq_1',
            question: 'How do I place an order?',
            answer: 'Browse our products above, click "Order on WhatsApp", or send your shopping list directly to our WhatsApp number. We pack and confirm right away!',
          },
          {
            id: 'faq_2',
            question: 'Is doorstep delivery available in my area?',
            answer: 'Yes! We deliver across our city and nearby neighborhoods. Orders over ₹500 enjoy free doorstep delivery.',
          },
          {
            id: 'faq_3',
            question: 'Can I return or exchange an item if not satisfied?',
            answer: 'Absolutely. We offer a 100% hassle-free replacement or refund guarantee on all unsealed items.',
          },
          {
            id: 'faq_4',
            question: 'What payment modes do you accept?',
            answer: 'We accept Cash on Delivery as well as all major UPI apps (GPay, PhonePe, Paytm, BHIM) and Cards.',
          },
        ],
        reviews: [
          {
            id: `rev_${now}_1`,
            author: 'Suresh Kumar',
            rating: 5,
            city: cName,
            date: 'Yesterday',
            comment: 'Sent my monthly grocery list on WhatsApp at 10 AM, everything was delivered neatly packed by 1 PM! Great prices.',
          },
          {
            id: `rev_${now}_2`,
            author: 'Meena Sharma',
            rating: 5,
            city: cName,
            date: '3 days ago',
            comment: 'The quality of basmati rice and dry fruits is top notch. Very honest store owner.',
          },
          {
            id: `rev_${now}_3`,
            author: 'Vikram Singh',
            rating: 5,
            city: cName,
            date: '1 week ago',
            comment: 'Super convenient to order directly on WhatsApp. Direct UPI payment was seamless without annoying transaction fees.',
          },
        ],
        testimonials: [
          {
            id: 'test_1',
            name: 'Suresh Kumar',
            location: cName,
            rating: 5,
            text: 'Sent my grocery list on WhatsApp and got everything delivered neatly packed within 3 hours!',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
          },
          {
            id: 'test_2',
            name: 'Meena Sharma',
            location: cName,
            rating: 5,
            text: 'Pristine quality and genuine wholesale rates. We order our monthly groceries exclusively here.',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
          },
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
        ],
        trustBadges: [
          { id: 'tb_1', title: '100% Authentic Quality', subtitle: 'Strict Inspection', icon: 'ShieldCheck' },
          { id: 'tb_2', title: 'Direct Store Pricing', subtitle: 'No App Markups', icon: 'Zap' },
          { id: 'tb_3', title: 'Same-Day Fast Delivery', subtitle: 'Doorstep Service', icon: 'Clock' },
          { id: 'tb_4', title: 'Safe UPI & Cash', subtitle: 'Pay on Delivery', icon: 'Award' },
        ],
        announcementBar: {
          enabled: true,
          text: '🛒 Welcome to our online store! Free doorstep delivery on orders above ₹500.',
        },
      };
  }
}

/**
 * Main Content Seeding Engine:
 * Takes basic business registration details, detects archetype, generates relevant
 * rich content, and returns fully populated Shop defaults.
 */
export function seedStoreWithDefaults(input: SeedStoreInput, baseShop: Partial<Shop> = {}): Partial<Shop> {
  const archetype = detectCategoryArchetype(input.mainCategory || input.category, input.subCategory);
  const seeded = getCategorySeedData(archetype, input.businessName, input.vendorName, input.city || 'Local City');

  const preparedShop: Partial<Shop> = {
    ...baseShop,
    tagline: seeded.tagline,
    bannerTitle: seeded.bannerTitle,
    bannerSubtitle: seeded.bannerSubtitle,
    banners: seeded.banners,
    desktopBanners: seeded.desktopBanners,
    mobileBanners: seeded.mobileBanners,
    logoUrl: seeded.logoUrl,
    aboutPhotoUrl: seeded.aboutPhotoUrl,
    aboutStory: seeded.aboutStory,
    establishedYear: seeded.establishedYear,
    colorTheme: seeded.colorTheme,
    products: seeded.products,
    reviews: seeded.reviews,
    galleryImages: seeded.galleryImages,
    trustBadges: seeded.trustBadges,
    announcementBar: seeded.announcementBar,
  };

  // Generate full 19-section configuration pre-filled with the seeded content
  const baseSectionsConfig = getDefaultSectionsConfig(preparedShop);

  // Inject seeded features, services, faq, testimonials into sectionsConfig
  const enrichedSectionsConfig: ShopSectionsConfig = {
    ...baseSectionsConfig,
    features: {
      ...baseSectionsConfig.features,
      items: seeded.features,
    },
    services: {
      ...baseSectionsConfig.services,
      items: seeded.services,
    },
    faq: {
      ...baseSectionsConfig.faq,
      items: seeded.faq,
    },
    testimonials: {
      ...baseSectionsConfig.testimonials,
      items: seeded.testimonials,
    },
  };

  preparedShop.sectionsConfig = enrichedSectionsConfig;
  return preparedShop;
}

/**
 * Applies category-tailored default content to an existing shop.
 * Useful when a vendor switches categories or wants to reset their store
 * with high-quality sample content.
 */
export function applyCategorySeedToShop(
  shop: Shop,
  options: {
    includeProducts?: boolean;
    includeBanners?: boolean;
    includeAbout?: boolean;
    includeSections?: boolean;
  } = { includeProducts: true, includeBanners: true, includeAbout: true, includeSections: true }
): Shop {
  const seeded = seedStoreWithDefaults(
    {
      businessName: shop.businessName,
      vendorName: shop.vendorName,
      category: shop.category,
      mainCategory: shop.mainCategory,
      subCategory: shop.subCategory,
      city: shop.city,
      state: shop.state,
      phone: shop.phone,
      email: shop.email,
      address: shop.address,
    },
    shop
  ) as Shop;

  const result: Shop = {
    ...shop,
    updatedAt: new Date().toISOString(),
  };

  if (options.includeBanners) {
    result.tagline = seeded.tagline;
    result.bannerTitle = seeded.bannerTitle;
    result.bannerSubtitle = seeded.bannerSubtitle;
    result.banners = seeded.banners;
    result.desktopBanners = seeded.desktopBanners;
    result.mobileBanners = seeded.mobileBanners;
    result.logoUrl = seeded.logoUrl;
    result.colorTheme = seeded.colorTheme;
  }

  if (options.includeAbout) {
    result.aboutStory = seeded.aboutStory;
    result.aboutPhotoUrl = seeded.aboutPhotoUrl;
    result.establishedYear = seeded.establishedYear;
    result.galleryImages = seeded.galleryImages;
  }

  if (options.includeProducts) {
    result.products = seeded.products;
    result.reviews = seeded.reviews;
  }

  if (options.includeSections) {
    result.sectionsConfig = seeded.sectionsConfig;
    result.trustBadges = seeded.trustBadges;
    result.announcementBar = seeded.announcementBar;
  }

  return result;
}

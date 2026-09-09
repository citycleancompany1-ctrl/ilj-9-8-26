import { Shop, ShopSectionsConfig, FloatingButtonsConfig } from '../types';

/**
 * Default configuration for bottom-right floating action buttons
 * (WhatsApp, Call, Multi-Language, Google Location)
 */
export function getDefaultFloatingButtons(existing?: Partial<FloatingButtonsConfig>): FloatingButtonsConfig {
  return {
    enabled: existing?.enabled ?? true,
    whatsapp: existing?.whatsapp ?? true,
    call: existing?.call ?? true,
    language: existing?.language ?? true,
    googleLocation: existing?.googleLocation ?? true,
  };
}

/**
 * Generates smart, high-quality, category-aware default configuration
 * for all 16 website builder sections for a given shop.
 */
export function getDefaultSectionsConfig(shop: Partial<Shop> = {}): ShopSectionsConfig {
  const name = shop.businessName || 'Hamari Digital Dukaan';
  const owner = shop.vendorName || 'Merchant Partner';
  const category = shop.category || 'General Store & Services';
  const city = shop.city || 'Local City';
  const phone = shop.phone || '7087033009';
  const email = shop.email || shop.vendorEmail || 'support@indianlalaji.com';
  const address = shop.address ? `${shop.address}, ${shop.city || ''}` : 'Main Market, City Center';
  const bannerImage = shop.banners?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200';
  const aboutImage = shop.aboutPhotoUrl || shop.logoUrl || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800';

  return {
    // 1. Hero Section
    hero: {
      enabled: true,
      heading: shop.bannerTitle || `${name} — Best Quality & Trust in ${city}`,
      subheading:
        shop.bannerSubtitle ||
        shop.tagline ||
        `Welcome to ${name}. Order authentic ${category} items directly with 0% extra commission, instant WhatsApp confirmation & fastest doorstep service.`,
      ctaText: 'Explore Products & Order',
      ctaLink: '#products',
      secondaryCtaText: 'WhatsApp Direct Chat',
      secondaryCtaLink: 'whatsapp',
      badge: '★ Verified Local Merchant 🇮🇳',
      backgroundImage: bannerImage,
    },

    // 2. About Section
    about: {
      enabled: true,
      title: `About ${name}`,
      subtitle: 'Hamari Pehchan Aur Vishwas Ki Kahani',
      description:
        shop.aboutStory ||
        `${name} aapke shahar mein sabse behtar aur shuddh samaan uplabdh karwata hai. Hamara lakshya har grahak ko imaandari, behtareen quality aur genuine rate provide karna hai. Hum bina kisi teesre bicholiye ke direct aap tak pahunchate hain.`,
      storyHeading: `Founded with dedication by ${owner}`,
      imageUrl: aboutImage,
      yearsOfExperience: shop.establishedYear ? `${new Date().getFullYear() - parseInt(shop.establishedYear, 10) || 5}+ Years` : '10+ Years',
      highlights: [
        '100% Original & Quality Checked',
        'Direct Merchant Guarantee & Support',
        'Transparent Local Indian Pricing',
        'Thousands of Happy Customers Served',
      ],
    },

    // 3. Features Section
    features: {
      enabled: true,
      title: 'Key Features & Why Choose Us',
      subtitle: 'Khas Baatein Jo Hamein Sabse Alag Banati Hain',
      items: [
        {
          id: 'feat_1',
          title: 'Direct Local Sourcing',
          description: 'Hamare sabhi items seedhe authentic aur trusted sources se certified check ke baad aate hain.',
          icon: 'ShieldCheck',
        },
        {
          id: 'feat_2',
          title: '0% Extra Commission',
          description: 'Kisi app ya bicholiye ko koi commission nahi. Aapko milta hai seedha wholesale aur genuine rate.',
          icon: 'Zap',
        },
        {
          id: 'feat_3',
          title: 'Instant WhatsApp Connect',
          description: 'Bina kisi complex checkout ke, 1-click me WhatsApp par store owner se baat karein aur order confirm karein.',
          icon: 'MessageSquare',
        },
        {
          id: 'feat_4',
          title: 'Same Day Quick Fulfillment',
          description: 'Aapke order par turant action liya jata hai aur local priority delivery ya quick pickup provide ki jati hai.',
          icon: 'Clock',
        },
      ],
    },

    // 4. Services Section (Managed via Store Services Catalogue)
    services: {
      enabled: true,
      title: 'Our Dedicated Services',
      subtitle: 'Hamari Vishesh Sevaayein Aapke Liye',
      items: [],
    },

    // Courses Section (Managed via Store Courses Catalogue)
    courses: {
      enabled: true,
      title: 'Our Featured Courses & Training',
      subtitle: 'Skill-up karein hamare structured courses aur practical batches ke sath',
      badge: 'Certified Courses & Training 🎓',
    },

    // 5. Products Section
    products: {
      enabled: true,
      title: 'Our Products & Offerings',
      subtitle: 'Browse our exclusive catalog and order directly on WhatsApp',
      showCategories: true,
    },

    // 6. How It Works (Disabled per user request)
    howItWorks: {
      enabled: false,
      title: 'How It Works (Aasan Tarika)',
      subtitle: 'Sirf 3 Aasan Steps Mein Order Karein',
      steps: [
        {
          id: 'step_1',
          stepNumber: 1,
          title: 'Select Items from Catalog',
          description: 'Hamari digital dukaan se apne pasandeeda items aur quantity select karein.',
        },
        {
          id: 'step_2',
          stepNumber: 2,
          title: '1-Click WhatsApp Order',
          description: '"Order on WhatsApp" button dabayein, aapka pura cart automatic message ban ke tayar ho jayega.',
        },
        {
          id: 'step_3',
          stepNumber: 3,
          title: 'Confirm & 0% UPI Payment',
          description: 'Owner se baat karein, direct QR code scan karke pay karein aur fast delivery receive karein.',
        },
      ],
    },

    // 7. Benefits Section
    benefits: {
      enabled: true,
      title: 'Customer Benefits & Advantages',
      subtitle: 'Hamare Sath Judne Ke Fayde',
      items: [
        {
          id: 'ben_1',
          title: 'Pocket Friendly Prices',
          description: 'Local dukaandar ka vishwas aur online marketplace se 15-20% sasta rate.',
          stat: 'Save 15-20%',
        },
        {
          id: 'ben_2',
          title: 'Fresh & Verified Stock',
          description: 'Har product ki quality testing aur fresh packaging ensure ki jati hai.',
          stat: '100% Fresh',
        },
        {
          id: 'ben_3',
          title: 'Direct Merchant Relation',
          description: 'Kisi bot se nahi, seedhe dukaan ke owner se direct baat aur customer priority.',
          stat: 'Human Touch',
        },
        {
          id: 'ben_4',
          title: 'Secure UPI Payments',
          description: 'PhonePe, Google Pay, Paytm aur BHIM se 0% commission direct transfer.',
          stat: 'Instant & Safe',
        },
      ],
    },

    // 8. Testimonials Section
    testimonials: {
      enabled: true,
      title: 'What Customers Say (Reviews)',
      subtitle: 'Hamare Khush Grahakon Ki Raay',
      items: [
        {
          id: 'test_1',
          name: 'Ramesh Sharma',
          location: city,
          rating: 5,
          text: 'Bahut hi badhiya quality aur fast service! WhatsApp par order diya aur 1 ghante mein saman ghar par deliver ho gaya.',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
        },
        {
          id: 'test_2',
          name: 'Pooja Verma',
          location: `${city} Sector 4`,
          rating: 5,
          text: 'Price bilkul genuine hain aur store owner bahut humble hain. Sabhi items packaging ke sath perfect condition me mile.',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
        },
        {
          id: 'test_3',
          name: 'Amit Patel',
          location: city,
          rating: 5,
          text: 'Local shop se online khareedari ka experience superb raha. 0% UPI payment se seedha payment ho gaya bina kisi extra charge ke.',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
        },
      ],
    },

    // 9. Our Offers & Deals Section (1 or 2 Promotional Banners)
    offers: {
      enabled: true,
      title: 'Special Offers & Deals',
      subtitle: 'Exclusive discounts aur festival offers sirf hamare direct grahakon ke liye',
      banners: [
        {
          id: 'offer_1',
          imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
          title: 'Special Festival Deal - Flat 20% OFF',
          subtitle: 'Use code WELCOME20 on WhatsApp order to claim instant discount!',
          badge: 'FESTIVAL SPECIAL',
          couponCode: 'WELCOME20',
          validUntil: 'Limited Period Deal',
          buttonText: 'Claim Offer on WhatsApp',
        },
        {
          id: 'offer_2',
          imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200',
          title: 'Free Express Doorstep Delivery',
          subtitle: 'Orders above ₹499 get free lightning-fast delivery across the city.',
          badge: 'FREE DELIVERY',
          couponCode: 'FREESHIP',
          validUntil: 'All 7 Days',
          buttonText: 'Order Now on WhatsApp',
        },
      ],
    },

    // 9. Store Videos & Reels Showcase
    videos: {
      enabled: true,
      title: 'Store Videos & Product Demos',
      subtitle: 'Watch our products in action, store tour & customer experiences',
    },

    // 10. Photo Gallery (Masonry Style Showcase)
    gallery: {
      enabled: true,
      title: 'Store Photo Gallery',
      subtitle: 'Hamari dukaan, taaza stock aur authentic photo showcase',
    },

    // 11. Portfolio / Projects
    portfolio: {
      enabled: true,
      title: 'Our Portfolio & Store Gallery',
      subtitle: 'Hamara Kaam, Dukaan Aur Past Deliveries Ka Nazara',
      items: [
        {
          id: 'port_1',
          title: 'Store Front & Display',
          category: 'Retail Showcase',
          imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800',
          description: 'A view of our modern organized retail shelves and fresh arrivals.',
        },
        {
          id: 'port_2',
          title: 'Quality Packing & Dispatch',
          category: 'Order Dispatch',
          imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
          description: 'Hygienic multi-layer packaging to ensure goods arrive in pristine shape.',
        },
        {
          id: 'port_3',
          title: 'Customer Satisfaction',
          category: 'Deliveries',
          imageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800',
          description: 'Serving smiling local families with prompt doorstep satisfaction.',
        },
        {
          id: 'port_4',
          title: 'Festive & Premium Bundles',
          category: 'Special Collections',
          imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
          description: 'Customized gift packs and wholesale bundles curated for every celebration.',
        },
      ],
    },

    // 11. Team Section
    team: {
      enabled: true,
      title: 'Meet Our Dedicated Team',
      subtitle: 'Log Jo Aapke Har Order Ko Kamyab Banate Hain',
      members: [
        {
          id: 'team_1',
          name: owner,
          position: 'Founder & Managing Director',
          imageUrl: aboutImage,
          bio: `Dedicated to bringing high-quality ${category} solutions directly to the community since day one.`,
        },
        {
          id: 'team_2',
          name: 'Sunil Kumar',
          position: 'Operations & Quality Lead',
          imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          bio: 'Supervises stock inspections, packaging protocols, and fast order dispatches.',
        },
        {
          id: 'team_3',
          name: 'Priya Sharma',
          position: 'Customer Relations & WhatsApp Help',
          imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
          bio: 'Always available to assist with product inquiries, delivery coordinates, and feedback.',
        },
      ],
    },

    // 12. FAQ Section
    faq: {
      enabled: true,
      title: 'Frequently Asked Questions (FAQ)',
      subtitle: 'Aapke Sawal, Hamare Jawab',
      items: [
        {
          id: 'faq_1',
          question: 'Delivery kitne samay mein milti hai?',
          answer: 'Local orders aam taur par 1 se 3 ghante ke andar deliver kar diye jaate hain. Urgent delivery ke liye WhatsApp par zaroor batayein.',
        },
        {
          id: 'faq_2',
          question: 'Payment ke kaun se options available hain?',
          answer: 'Aap Cash on Delivery (COD) ya kisi bhi UPI app (Google Pay, PhonePe, Paytm, BHIM) se 0% commission direct QR scan karke pay kar sakte hain.',
        },
        {
          id: 'faq_3',
          question: 'Agar koi saman pasand na aaye ya damaged ho toh kya karein?',
          answer: 'Hamari taraf se 100% replacement guarantee rehti hai. Delivery ke waqt check karke turant replacement ya refund le sakte hain.',
        },
        {
          id: 'faq_4',
          question: 'Kya bulk ya wholesale rate mil sakta hai?',
          answer: 'Haan bilkul! Shaadi, functions ya dukaano ke liye special wholesale rates available hain. Contact form ya WhatsApp par inquiry bhejain.',
        },
      ],
    },

    // 13. Call To Action (CTA) Section
    cta: {
      enabled: true,
      title: `Special Local Customer Discount at ${name}!`,
      description: `Order today via WhatsApp or phone call to enjoy personalized customer care, prompt doorstep fulfillment and zero middleman fee.`,
      buttonText: 'Order on WhatsApp Now',
      buttonLink: 'whatsapp',
      badge: '★ LIMITED TIME OFFER ★',
    },

    // 14. Contact Section
    contact: {
      enabled: true,
      title: 'Contact Us & Send Inquiry',
      subtitle: 'Humse Sampark Karein (Always Ready to Help)',
      showForm: true,
      phone: phone,
      email: email,
      address: address,
      workingHours: shop.workingHours || '9:00 AM - 9:00 PM (All 7 Days Open)',
    },

    // 15. Blog / Articles Section
    blog: {
      enabled: true,
      title: 'Latest News, Tips & Articles',
      subtitle: 'Useful Guides and Updates from Our Store',
      posts: [
        {
          id: 'post_1',
          title: `How to Choose the Best ${category} in ${city}`,
          snippet: 'Key factors to look for when selecting genuine products, checking batch dates and verifying authenticity.',
          content: `Jab aap ${city} mein ${category} ki khareedari karte hain, toh sahi aur genuine product chunna sabse ahem hota hai. Hum aapko kuch zaruri baatein batate hain:

1. Batch & Expiry Date Check: Hamesha product par packaging date aur shelf life verify karein.
2. Direct Merchant Authenticity: Local verified dukaan se lene par aapko seedha bill aur genuine guarantee milti hai.
3. WhatsApp Fast Inquiry: Kisi bhi product ke baare mein query ho toh aap direct dukaan ke owner se baat kar sakte hain.

Hamare paas har ek samaan strict quality check ke baad hi pack kiya jata hai taaki aapko behtareen anubhav mile.`,
          date: 'August 2026',
          readTime: '3 min read',
          imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
          author: owner,
          category: 'Shopping Guide',
        },
        {
          id: 'post_2',
          title: 'Top 5 Tips for Safe Online Ordering via WhatsApp',
          snippet: 'Why ordering directly from local merchants is safer, cheaper, and helps Indian businesses flourish.',
          content: `WhatsApp par order karna aaj kal sabse aasan aur tez tarika ban chuka hai. 

Iske mukhya fayde:
• Direct Human Interaction: Kisi machine ya automated bot se nahi, balki dukaan ke owner se direct baat hoti hai.
• Zero Commission: Online platform fee ya commission nahi lagti, jisse aapko best price milta hai.
• 0% Fee Direct UPI: Aap PhonePe, Google Pay ya Paytm se seedhe dukaan ke verified QR par payment kar sakte hain.
• Instant Photo Verification: Saman dispatch hone se pehle aap product ki photo mangwa kar dekh sakte hain.

Hamari dukaan hamesha aapki suvidha aur suraksha ko pehli priority deti hai.`,
          date: 'July 2026',
          readTime: '4 min read',
          imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600',
          author: 'Team LalaJi',
          category: 'Tips & Tricks',
        },
        {
          id: 'post_3',
          title: 'Proper Storage & Care Guide for Long-Lasting Freshness',
          snippet: 'Simple home hacks to keep your everyday supplies fresh, preserved, and performing at their best.',
          content: `Apne khareede gaye items ko lambe samay tak fresh rakhne ke liye in aasan tips ko follow karein:

1. Dry & Cool Storage: Items ko seedhi dhoop aur nami se door rakhein.
2. Air-Tight Containers: Hawa se bachane ke liye air-tight jars ka upyog karein.
3. Timely Re-Ordering: Samaan khatam hone se 1-2 din pehle WhatsApp par ek message karke advance booking karein taaki dispatch instant ho sake.

Agar aapko kisi bhi item ke upyog ya storage mein salah chahiye, toh hamare helpline number par kisi bhi samay call ya WhatsApp karein.`,
          date: 'June 2026',
          readTime: '2 min read',
          imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600',
          author: owner,
          category: 'Maintenance',
        },
      ],
    },

    // 16. Footer Section
    footer: {
      enabled: true,
      aboutText: `${name} is a proud verified merchant powered by the IndianLalaJi Platform Network. Providing genuine quality and direct 0% commission local commerce across ${city}.`,
      quickLinks: [
        { label: 'Products Catalog', url: '#products' },
        { label: 'About Us', url: '#about' },
        { label: 'Features', url: '#features' },
        { label: 'Customer Reviews', url: '#testimonials' },
        { label: 'FAQ', url: '#faq' },
        { label: 'Contact Us', url: '#contact' },
      ],
      socialLinks: {
        instagram: shop.socialLinks?.instagram || 'https://instagram.com',
        facebook: shop.socialLinks?.facebook || 'https://facebook.com',
        youtube: shop.socialLinks?.youtube || 'https://youtube.com',
      },
      copyrightText: `© ${new Date().getFullYear()} ${name}. All Rights Reserved. Built with IndianLalaJi Digital Dukaan.`,
    },
  };
}

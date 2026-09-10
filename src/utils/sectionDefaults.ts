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
  const name = shop.businessName || 'Our Digital Store';
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
        `Welcome to ${name}. Order authentic ${category} items directly with instant WhatsApp confirmation & fastest doorstep service.`,
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
      subtitle: 'Our Heritage & Story of Trust',
      description:
        shop.aboutStory ||
        `${name} delivers the finest and most authentic goods in ${city}. Our mission is to provide every customer with complete honesty, premium quality, and genuine prices, serving you directly without any third-party intermediaries.`,
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

    // 3. Why Choose Us Section
    features: {
      enabled: true,
      title: 'Why Choose Us',
      subtitle: 'Key Highlights That Set Us Apart',
      items: [
        {
          id: 'feat_1',
          title: 'Direct Local Sourcing',
          description: 'All items are procured directly from authentic and certified sources following strict quality inspections.',
          icon: 'ShieldCheck',
        },
        {
          id: 'feat_2',
          title: 'Direct Store Pricing',
          description: 'No inflated markups or hidden fees. You receive direct store rates and genuine value.',
          icon: 'Zap',
        },
        {
          id: 'feat_3',
          title: 'Instant WhatsApp Connect',
          description: 'No complex checkout flows. Chat with the store owner in 1 click and confirm your order directly on WhatsApp.',
          icon: 'MessageSquare',
        },
        {
          id: 'feat_4',
          title: 'Same Day Quick Fulfillment',
          description: 'Prompt order preparation with prioritized local doorstep delivery or fast counter pickup.',
          icon: 'Clock',
        },
      ],
    },

    // 4. Services Section (Managed via Store Services Catalogue)
    services: {
      enabled: true,
      title: 'Our Dedicated Services',
      subtitle: 'Specialized Offerings & Solutions Tailored for You',
      items: [],
    },

    // Courses Section (Managed via Store Courses Catalogue)
    courses: {
      enabled: true,
      title: 'Our Featured Courses & Training',
      subtitle: 'Skill up with our structured curriculum and practical training sessions',
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
      title: 'How It Works',
      subtitle: 'Order in 3 Simple Steps',
      steps: [
        {
          id: 'step_1',
          stepNumber: 1,
          title: 'Select Items from Catalog',
          description: 'Browse our digital store catalogue and choose your preferred items and quantities.',
        },
        {
          id: 'step_2',
          stepNumber: 2,
          title: '1-Click WhatsApp Order',
          description: 'Click "Order on WhatsApp" to convert your shopping cart into a ready-to-send instant message.',
        },
        {
          id: 'step_3',
          stepNumber: 3,
          title: 'Confirm & Direct UPI Payment',
          description: 'Connect with the store owner, scan the direct UPI QR code, and receive your doorstep delivery.',
        },
      ],
    },

    // Benefits Section (Optional)
    benefits: {
      enabled: false,
      title: 'Customer Benefits & Advantages',
      subtitle: 'Key Advantages of Shopping With Us',
      items: [
        {
          id: 'ben_1',
          title: 'Pocket Friendly Prices',
          description: 'Direct local merchant pricing that is 15-20% more economical than commercial marketplaces.',
          stat: 'Save 15-20%',
        },
        {
          id: 'ben_2',
          title: 'Fresh & Verified Stock',
          description: 'Every product undergoes rigorous quality testing and fresh hygienic packaging.',
          stat: '100% Fresh',
        },
        {
          id: 'ben_3',
          title: 'Direct Merchant Relation',
          description: 'Connect directly with the business owner for dedicated assistance, not automated bots.',
          stat: 'Human Touch',
        },
        {
          id: 'ben_4',
          title: 'Secure UPI Payments',
          description: 'Pay directly with PhonePe, Google Pay, Paytm, or BHIM directly to store QR.',
          stat: 'Instant & Safe',
        },
      ],
    },

    // Testimonials Section (Optional)
    testimonials: {
      enabled: false,
      title: 'What Customers Say (Reviews)',
      subtitle: 'Real Feedback From Our Happy Customers',
      items: [
        {
          id: 'test_1',
          name: 'Ramesh Sharma',
          location: city,
          rating: 5,
          text: 'Outstanding quality and lightning-fast service! Ordered directly on WhatsApp and received everything within an hour.',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
        },
        {
          id: 'test_2',
          name: 'Pooja Verma',
          location: `${city} Sector 4`,
          rating: 5,
          text: 'Completely genuine pricing and the store owner is very courteous. All items arrived in pristine packaging.',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
        },
        {
          id: 'test_3',
          name: 'Amit Patel',
          location: city,
          rating: 5,
          text: 'A fantastic experience buying directly from a trusted local store. Direct UPI payment made checkout seamless with no extra fees.',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
        },
      ],
    },

    // 9. Our Offers & Deals Section (1 or 2 Promotional Banners)
    offers: {
      enabled: true,
      title: 'Special Offers & Deals',
      subtitle: 'Exclusive discounts and seasonal promotions for our direct customers',
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
      subtitle: 'Our storefront, fresh stock, and verified photo showcase',
    },

    // 11. Portfolio / Projects
    portfolio: {
      enabled: true,
      title: 'Our Portfolio & Store Gallery',
      subtitle: 'Our Storefront, Craftsmanship, and Order Deliveries',
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
      subtitle: 'The Dedicated People Behind Every Order',
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
      subtitle: 'Clear Answers to Your Common Questions',
      items: [
        {
          id: 'faq_1',
          question: 'What is the typical delivery timeframe?',
          answer: 'Local orders are typically delivered within 1 to 3 hours. For expedited or scheduled deliveries, please inform us on WhatsApp.',
        },
        {
          id: 'faq_2',
          question: 'What payment options are accepted?',
          answer: 'We accept Cash on Delivery (COD) as well as all major UPI apps (Google Pay, PhonePe, Paytm, BHIM) via direct QR transfer.',
        },
        {
          id: 'faq_3',
          question: 'What if an item is damaged or does not meet expectations?',
          answer: 'We provide a 100% satisfaction guarantee. You can inspect your items on delivery and request an immediate exchange or refund.',
        },
        {
          id: 'faq_4',
          question: 'Do you offer bulk or wholesale pricing?',
          answer: 'Yes! We offer attractive wholesale rates for weddings, festive occasions, and bulk merchant purchases. Reach out via WhatsApp or our inquiry form.',
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
      subtitle: 'Get in Touch (Always Here to Help)',
      showForm: true,
      phone: phone,
      email: email,
      address: address,
      workingHours: shop.workingHours || '9:00 AM - 9:00 PM (All 7 Days Open)',
    },

    // 15. Social Media Section
    socialMedia: {
      enabled: true,
      title: 'Connect With Us on Social Media',
      subtitle: 'Follow our official social channels for announcements and offers',
      instagram: shop.socialLinks?.instagram || 'https://instagram.com',
      facebook: shop.socialLinks?.facebook || 'https://facebook.com',
      youtube: shop.socialLinks?.youtube || 'https://youtube.com',
      whatsapp: `https://wa.me/91${phone.replace(/\D/g, '')}`,
      twitter: shop.socialLinks?.twitter || '',
      linkedin: shop.socialLinks?.linkedin || '',
      telegram: '',
    },

    // 16. Blog / Articles Section
    blog: {
      enabled: true,
      title: 'Latest News, Tips & Articles',
      subtitle: 'Useful Guides and Updates from Our Store',
      posts: [
        {
          id: 'post_1',
          title: `How to Choose the Best ${category} in ${city}`,
          snippet: 'Key factors to look for when selecting genuine products, checking batch dates and verifying authenticity.',
          content: `When purchasing ${category} in ${city}, selecting genuine and fresh products is essential. Here are key recommendations from our team:

1. Batch & Expiry Verification: Always verify manufacturing dates, batch numbers, and shelf life before purchase.
2. Direct Merchant Authenticity: Sourcing from an authentic local merchant ensures genuine warranties and direct customer support.
3. Fast WhatsApp Inquiries: For questions regarding product details or availability, you can consult directly with the store owner.

Every item in our catalogue passes thorough quality checks prior to dispatch to ensure an exceptional customer experience.`,
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
          content: `Ordering via WhatsApp has become the fastest and most convenient shopping channel for local commerce.

Key advantages include:
• Direct Human Interaction: Communicate directly with the business owner rather than automated response bots.
• Direct Store Pricing: No inflated markups, ensuring the most competitive prices.
• Direct UPI: Transfer seamlessly via PhonePe, Google Pay, or Paytm directly to verified store QR codes.
• Live Photo Verification: Request actual product photos prior to dispatch for complete peace of mind.

Our storefront consistently prioritizes customer trust, safety, and rapid service.`,
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
          content: `Follow these practical storage recommendations to preserve product freshness:

1. Dry & Cool Storage: Keep goods shielded from direct sunlight, moisture, and extreme temperatures.
2. Airtight Containers: Use sealed containers to maintain peak aroma and crispness.
3. Timely Re-Ordering: Reorder 1-2 days before running out to guarantee uninterrupted doorstep supply.

Should you need personalized product care advice, reach out to our team at any time via WhatsApp or phone call.`,
          date: 'June 2026',
          readTime: '2 min read',
          imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600',
          author: owner,
          category: 'Maintenance',
        },
      ],
    },

    // 17. Footer Section
    footer: {
      enabled: true,
      aboutText: `${name} is a proud verified merchant powered by the IndianLalaJi Platform Network. Providing genuine quality and authentic local commerce across ${city}.`,
      quickLinks: [
        { label: 'Hero Home', url: '#hero' },
        { label: 'About Us', url: '#about' },
        { label: 'Why Choose Us', url: '#why-choose-us' },
        { label: 'Services', url: '#services' },
        { label: 'Products', url: '#products' },
        { label: 'Courses', url: '#courses' },
        { label: 'Videos', url: '#videos' },
        { label: 'Special Offers', url: '#offers' },
        { label: 'Photo Gallery', url: '#gallery' },
        { label: 'Portfolio', url: '#portfolio' },
        { label: 'Our Team', url: '#team' },
        { label: 'FAQ', url: '#faq' },
        { label: 'Contact Us', url: '#contact-inquiry' },
        { label: 'Social Media', url: '#social-media' },
        { label: 'Blog', url: '#blog' },
      ],
      socialLinks: {
        instagram: shop.socialLinks?.instagram || 'https://instagram.com',
        facebook: shop.socialLinks?.facebook || 'https://facebook.com',
        youtube: shop.socialLinks?.youtube || 'https://youtube.com',
      },
      copyrightText: `© ${new Date().getFullYear()} ${name}. All Rights Reserved. Built with IndianLalaJi Platform.`,
    },
  };
}

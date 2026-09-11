import { Shop, ShopSectionsConfig, FloatingButtonsConfig } from '../types';
import { getShopTerminology } from './categoryTerminology';

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
 * for all 19 website builder sections for a given shop.
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

  const term = getShopTerminology(shop as Shop);

  return {
    // 0. Hero Banner Section (Carousel Slider)
    heroBanner: {
      enabled: shop.heroBannerEnabled !== false,
      title: term.sections.heroBanner.name,
      subtitle: 'Desktop & Mobile carousel banners',
      useDesktopBannerOnMobile: Boolean(shop.useDesktopBannerOnMobile),
    },

    // 1. Hero Section
    hero: {
      enabled: true,
      heading: shop.bannerTitle || `${name} — Best Quality & Trust in ${city}`,
      subheading:
        shop.bannerSubtitle ||
        shop.tagline ||
        `Welcome to ${name}. ${term.sections.hero.defaultSubtitle}`,
      ctaText: term.ctaButtonText,
      ctaLink: '#products',
      secondaryCtaText: 'WhatsApp Direct Chat',
      secondaryCtaLink: 'whatsapp',
      badge: '★ Verified Local Merchant 🇮🇳',
      backgroundImage: bannerImage,
    },

    // 2. About Section
    about: {
      enabled: true,
      title: term.sections.about.defaultHeading.replace('{businessName}', name),
      subtitle: term.sections.about.defaultSubtitle,
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
      title: term.sections.features.defaultHeading,
      subtitle: term.sections.features.defaultSubtitle,
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

    // 4. Category Showcase Section
    category: {
      enabled: true,
      title: term.sections.category.defaultHeading,
      subtitle: term.sections.category.defaultSubtitle,
    },

    // 5. Services Section (Managed via Store Services Catalogue)
    services: {
      enabled: true,
      title: term.sections.services.defaultHeading,
      subtitle: term.sections.services.defaultSubtitle,
      items: [],
    },

    // 6. Products Section
    products: {
      enabled: true,
      title: term.sections.products.defaultHeading,
      subtitle: term.sections.products.defaultSubtitle,
      showCategories: true,
    },

    // 7. Courses Section (Managed via Store Courses Catalogue)
    courses: {
      enabled: true,
      title: term.sections.courses.defaultHeading,
      subtitle: term.sections.courses.defaultSubtitle,
      badge: `${term.sections.courses.name} 🎓`,
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
      title: term.sections.offers.defaultHeading,
      subtitle: term.sections.offers.defaultSubtitle,
      banners: [
        {
          id: 'offer_1',
          imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
          title: `${term.sections.offers.name} - Special Opportunity`,
          subtitle: 'Reach out directly on WhatsApp to claim exclusive updates and benefits!',
          badge: 'SPECIAL',
          couponCode: 'WELCOME20',
          validUntil: 'Limited Period',
          buttonText: 'Inquire on WhatsApp',
        },
        {
          id: 'offer_2',
          imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200',
          title: 'Direct Assistance & Dedicated Support',
          subtitle: 'Reach out directly for personalized guidance and prompt service.',
          badge: 'VERIFIED',
          couponCode: 'DIRECT',
          validUntil: 'All 7 Days',
          buttonText: 'Connect on WhatsApp',
        },
      ],
    },

    // 9. Store Videos & Reels Showcase
    videos: {
      enabled: true,
      title: term.sections.videos.defaultHeading,
      subtitle: term.sections.videos.defaultSubtitle,
    },

    // 10. Photo Gallery (Masonry Style Showcase)
    gallery: {
      enabled: true,
      title: term.sections.gallery.defaultHeading,
      subtitle: term.sections.gallery.defaultSubtitle,
    },

    // 11. Portfolio / Projects
    portfolio: {
      enabled: true,
      title: term.sections.portfolio.defaultHeading,
      subtitle: term.sections.portfolio.defaultSubtitle,
      items: [
        {
          id: 'port_1',
          title: `${term.entityName} Highlights`,
          category: 'Showcase',
          imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800',
          description: `A view of our premium facilities and dedication to quality.`,
        },
        {
          id: 'port_2',
          title: 'Organized Operations',
          category: 'Standards',
          imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
          description: 'Hygienic and organized workflows to ensure top-notch standards.',
        },
        {
          id: 'port_3',
          title: 'Community Trust & Satisfaction',
          category: 'Testimonials',
          imageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800',
          description: 'Proudly serving smiling local families and individuals with prompt care.',
        },
        {
          id: 'port_4',
          title: 'Key Milestones',
          category: 'Milestones',
          imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
          description: 'Curated achievements and dedicated excellence.',
        },
      ],
    },

    // 11. Team Section
    team: {
      enabled: true,
      title: term.sections.team.defaultHeading,
      subtitle: term.sections.team.defaultSubtitle,
      members: [
        {
          id: 'team_1',
          name: owner,
          position: term.subCategory.includes('School') || term.subCategory.includes('College') ? 'Principal / Director' : (term.subCategory.includes('Clinic') || term.subCategory.includes('Doctor') ? 'Chief Specialist / Doctor' : 'Founder & Managing Director'),
          imageUrl: aboutImage,
          bio: `Dedicated to bringing high-quality ${term.entityName.toLowerCase()} solutions directly to the community.`,
        },
        {
          id: 'team_2',
          name: 'Sunil Kumar',
          position: 'Operations & Standards Lead',
          imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          bio: 'Supervises service standards, customer assistance, and smooth daily operations.',
        },
        {
          id: 'team_3',
          name: 'Priya Sharma',
          position: 'Customer Help & Coordination',
          imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
          bio: 'Always available to assist with inquiries and friendly guidance.',
        },
      ],
    },

    // 12. FAQ Section
    faq: {
      enabled: true,
      title: term.sections.faq.defaultHeading,
      subtitle: term.sections.faq.defaultSubtitle,
      items: [
        {
          id: 'faq_1',
          question: `How can I connect with ${name}?`,
          answer: 'You can connect directly via WhatsApp, phone call, or the online inquiry form for fast responses.',
        },
        {
          id: 'faq_2',
          question: 'What payment options are accepted?',
          answer: 'We accept Cash as well as all major UPI apps (Google Pay, PhonePe, Paytm, BHIM) via direct QR transfer.',
        },
        {
          id: 'faq_3',
          question: 'What are your working hours?',
          answer: `${shop.workingHours || '9:00 AM - 9:00 PM (All days)'}. We are happy to assist you during business hours.`,
        },
        {
          id: 'faq_4',
          question: 'Do you offer customized packages or specific requirements?',
          answer: 'Yes! We offer tailored solutions according to your specific needs. Reach out via WhatsApp or our inquiry form.',
        },
      ],
    },

    // 13. Call To Action (CTA) Section
    cta: {
      enabled: true,
      title: term.sections.cta.defaultHeading,
      description: term.sections.cta.defaultSubtitle,
      buttonText: term.ctaButtonText,
      buttonLink: 'whatsapp',
      badge: '★ CONNECT DIRECTLY ★',
    },

    // 14. Contact Section
    contact: {
      enabled: true,
      title: term.sections.contact.defaultHeading,
      subtitle: term.sections.contact.defaultSubtitle,
      showForm: true,
      phone: phone,
      email: email,
      address: address,
      workingHours: shop.workingHours || '9:00 AM - 9:00 PM (All 7 Days Open)',
    },

    // 15. Social Media Section
    socialMedia: {
      enabled: true,
      title: term.sections.socialMedia.defaultHeading,
      subtitle: term.sections.socialMedia.defaultSubtitle,
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
      title: term.sections.blog.defaultHeading,
      subtitle: term.sections.blog.defaultSubtitle,
      posts: [
        {
          id: 'post_1',
          title: `Welcome to ${name} — Quality & Excellence in ${city}`,
          snippet: `Key highlights and updates provided by ${name} for our valued community.`,
          content: `${name} is proud to serve ${city} with dedicated standards, verified solutions, and personalized assistance.`,
          date: 'August 2026',
          readTime: '3 min read',
          imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
          author: owner,
          category: 'Announcements',
        },
      ],
    },

    // 17. Footer Section
    footer: {
      enabled: true,
      aboutText: `${name} is a proud verified establishment powered by the IndianLalaJi Platform Network. Providing genuine quality and authentic commerce across ${city}.`,
      quickLinks: [
        { label: 'Hero Home', url: '#hero' },
        { label: term.sections.about.name, url: '#about' },
        { label: term.sections.features.name, url: '#why-choose-us' },
        { label: term.sections.category.name, url: '#categories' },
        { label: term.sections.services.name, url: '#services' },
        { label: term.sections.products.name, url: '#products' },
        { label: term.sections.courses.name, url: '#courses' },
        { label: term.sections.videos.name, url: '#videos' },
        { label: term.sections.offers.name, url: '#offers' },
        { label: term.sections.gallery.name, url: '#gallery' },
        { label: term.sections.portfolio.name, url: '#portfolio' },
        { label: term.sections.team.name, url: '#team' },
        { label: term.sections.faq.name, url: '#faq' },
        { label: term.sections.contact.name, url: '#contact-inquiry' },
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

import type { IndianTheme } from './data/indianThemes';
export type { IndianTheme };

export type UserRole = 'VENDOR' | 'ADMIN' | 'CUSTOMER';

export type ShopStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'HOLD' | 'REJECTED';

export type ProductType = 'PRODUCT' | 'SERVICE' | 'COURSE';

export interface ShopCategory {
  id: string;
  name: string;
  imageUrl: string;
  type?: 'ALL' | 'PRODUCT' | 'SERVICE' | 'COURSE';
  description?: string;
  itemCount?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  originalPrice?: number;
  category?: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
  unit?: string; // e.g. "kg", "pc", "hour", "session"
  hidePrice?: boolean; // When true, hides price and displays 'Price on Request / कीमत पूछें'
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  city?: string;
}

export interface ShopInquiry {
  id: string;
  shopId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceOrProductRequested?: string;
  message: string;
  date: string;
  status: 'UNREAD' | 'READ' | 'CONVERTED';
}

export interface Shop {
  id: string;
  shopId: string; // Dynamic Shop ID e.g. SHP01234454
  vendorId: string;
  vendorEmail: string;
  vendorName: string;
  vendorPassword?: string; // Vendor login password managed by Vendor & Super Admin
  passwordHash?: string; // Secure salt-hashed password
  businessName: string;
  tagline: string;
  category: string;
  mainCategory?: string; // One of 27 Main Categories (e.g. Education, Healthcare, Food & Dining)
  subCategory?: string; // Sub Category (e.g. School, College, Clinic, Restaurant, Gym)
  state: string;
  city: string;
  address: string;
  pincode: string;
  status: ShopStatus;
  templateId: string;
  createdAt: string;
  updatedAt: string;
  isFeaturedInShowcase: boolean;
  viewsCount: number;

  // Contact details
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsUrl?: string;
  workingHours?: string;

  // Branding & Media
  logoUrl: string;
  banners: string[]; // General/fallback banners
  desktopBanners?: string[]; // Desktop hero carousel banners (maximum 4)
  mobileBanners?: string[]; // Mobile hero carousel banners (maximum 3)
  useDesktopBannerOnMobile?: boolean; // When ON, mobile ignores mobileBanners and displays desktopBanners on mobile
  heroBannerEnabled?: boolean; // Independent toggle for hero banner carousel
  bannerTitle?: string;
  bannerSubtitle?: string;
  aboutPhotoUrl: string;
  aboutStory: string;
  establishedYear: string;
  galleryImages: string[];
  paymentQrUrl: string;
  upiId: string;

  // Subscription & Validity (1-Year Annual Plan)
  activeDate?: string; // e.g. "2026-08-01" or ISO string
  expiryDate?: string; // e.g. "2027-08-01" (1-Year Validity)
  planName?: string; // e.g. "1-Year Official LalaJi Store Plan"
  planPrice?: number; // e.g. 1499

  // Customization & Indian Layout Themes (10 Unique Layouts - 100% Free)
  themeId?: string; // e.g. 'bharat-royal' | 'kashi-heritage' | 'jaipur-haveli' | 'ganga-serene' | 'deccan-neo' | 'ayodhya-divine' | 'himalaya-pure' | 'utsav-vibrant' | 'kerala-palms' | 'bombay-modern'
  colorTheme: 'saffron' | 'emerald' | 'royal' | 'maroon' | 'gold' | 'rose';
  fontStyle: 'sans' | 'serif' | 'outfit';
  buttonStyle: 'rounded' | 'pill' | 'sharp';

  // Digital Invoices & Receipts
  invoices?: SubscriptionInvoice[];

  // Features
  ecommerceEnabled: boolean;
  serviceBookingEnabled: boolean;
  hideAllPrices?: boolean; // Store-wide: When true, hides prices for all products & services (Catalog / Inquire Mode)

  // Rich content
  videos: VideoItem[]; // up to 8
  products: ProductItem[];
  customCategories?: ShopCategory[]; // Vendor created categories with Image + Name (Products, Services, Courses)
  reviews: ReviewItem[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
    googleMaps?: string;
    website?: string;
  };

  // Website Connect & Custom Domain
  customDomain?: string; // e.g. "www.myshop.com" or "shop.brand.in"
  connectedWebsiteUrl?: string; // e.g. "https://external-website.com"
  domainConnectStatus?: 'NOT_CONNECTED' | 'PENDING_DNS' | 'CONNECTED';
  domainVerificationStatus?: 'VERIFIED' | 'PENDING' | 'FAILED';
  dnsStatus?: 'PROPAGATED' | 'PENDING' | 'ERROR';
  sslStatus?: 'ACTIVE' | 'ISSUING' | 'PENDING' | 'EXPIRED';
  isCustomDomainActive?: boolean;

  // Floating Action Circle Buttons (Bottom Right: WhatsApp, Call, Multi-Language, Google Location)
  floatingButtons?: FloatingButtonsConfig;

  // 16 Custom Page Builder Sections Config (ON/OFF & Edit)
  sectionsConfig?: ShopSectionsConfig;

  // Isolated Website Backups (Snapshots)
  backups?: VendorWebsiteBackup[];

  // Custom Store Terms & Conditions written by Vendor
  termsAndConditions?: string;
  termsUpdatedAt?: string;

  // Versioning & Future-Update Safety (Strict Immortality & Immunity)
  shopVersion?: string; // e.g. 'v1.0' | 'v1.1' | 'v2.0'
  versionLock?: boolean; // When true, platform updates/new features NEVER automatically modify this shop's schema/design
  installedModules?: string[]; // e.g. ['core_ecommerce', 'modular_sections', 'module_ai_voice', 'module_doctor_clinic', 'module_motor_garage', 'module_salon_spa']
  migrationHistory?: VendorMigrationRecord[];
}

export interface VendorMigrationRecord {
  id: string;
  fromVersion: string;
  toVersion: string;
  migratedAt: string;
  backupId: string; // ID of the snapshot taken automatically before migration
  enabledModules?: string[];
  note?: string;
  appliedBy: string; // e.g. 'Super Admin (rkmehra331996@gmail.com)'
}

export interface PlatformModuleDefinition {
  id: string;
  name: string;
  category: 'AI' | 'VERTICAL' | 'ECOMMERCE' | 'INFRA';
  description: string;
  icon: string;
  versionIntroduced: string;
  isBeta?: boolean;
  features: string[];
}

export interface PlatformVersionDefinition {
  version: string;
  name: string;
  releaseDate: string;
  description: string;
  features: string[];
  modules: string[];
  isStable: boolean;
  isLTS: boolean;
}

export interface AutoBackupConfig {
  enabled: boolean;
  frequency: 'DAILY' | 'HOURLY_12' | 'ON_MAJOR_CHANGE';
  lastBackupAt?: string;
  keepMaxSnapshots: number;
}

export interface SelectedVendorsBackup {
  backupId: string;
  createdAt: string;
  version: string;
  type: 'SELECTED_VENDORS' | 'ALL_VENDORS' | 'CUSTOM_DOMAIN_VENDORS';
  description?: string;
  totalVendors: number;
  shops: Shop[];
}

export interface CustomDomainRecord {
  id: string;
  shopId: string;
  businessName: string;
  domain: string;
  domainVerificationStatus: 'VERIFIED' | 'PENDING' | 'FAILED';
  dnsStatus: 'PROPAGATED' | 'PENDING' | 'ERROR';
  sslStatus: 'ACTIVE' | 'ISSUING' | 'PENDING' | 'EXPIRED';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  targetHost?: string;
  targetIp?: string;
  notes?: string;
}

export interface VendorWebsiteBackup {
  backupId: string;
  shopId: string;
  businessName: string;
  createdAt: string;
  version: string;
  description?: string;
  data: Shop;
}

export interface SaaSPlatformBackup {
  backupId: string;
  createdAt: string;
  version: string;
  description?: string;
  totalShops: number;
  data: Partial<PlatformState>;
}

export interface FloatingButtonsConfig {
  enabled: boolean;
  whatsapp: boolean;
  call: boolean;
  language: boolean;
  googleLocation: boolean;
}

// ==========================================
// 16 PAGE BUILDER SECTIONS INTERFACES
// ==========================================

export interface HeroBannerSectionConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  useDesktopBannerOnMobile?: boolean; // When ON, mobile ignores mobileBanners and displays desktopBanners on mobile
}

export interface HeroSectionConfig {
  enabled: boolean;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string; // e.g. '#products', '#contact-inquiry', 'whatsapp'
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badge?: string;
  backgroundImage?: string;
}

export interface AboutSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  description: string;
  storyHeading?: string;
  imageUrl?: string;
  yearsOfExperience?: string;
  highlights?: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface FeaturesSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  icon?: string;
  duration?: string;
}

export interface ServicesSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: ServiceItem[];
}

export interface CoursesSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  badge?: string;
}

export interface ProductsSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  showCategories?: boolean;
}

export interface StepItem {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
}

export interface HowItWorksSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  steps: StepItem[];
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  stat?: string;
}

export interface BenefitsSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: BenefitItem[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  text: string;
  location: string;
  rating?: number;
  avatarUrl?: string;
}

export interface TestimonialsSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: TestimonialItem[];
}

export interface PricingPlanItem {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
}

export interface PricingSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  plans: PricingPlanItem[];
}

export interface OfferBannerItem {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  badge?: string; // e.g. "FLAT 25% OFF" or "FESTIVE SALE"
  couponCode?: string; // e.g. "SAVE25"
  validUntil?: string; // e.g. "Limited Time Deal"
  buttonText?: string; // e.g. "Claim on WhatsApp"
  buttonLink?: string;
}

export interface OffersSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  banners: OfferBannerItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category?: string;
  imageUrl: string;
  description?: string;
}

export interface PortfolioSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: PortfolioItem[];
}

export interface GallerySectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  items?: string[]; // Optional specific image URLs, otherwise uses shop.galleryImages
}

export interface TeamMemberItem {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
  bio?: string;
}

export interface TeamSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  members: TeamMemberItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: FaqItem[];
}

export interface CtaSectionConfig {
  enabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  badge?: string;
}

export interface ContactSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  showForm: boolean;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  snippet: string;
  content?: string;
  date: string;
  readTime?: string;
  imageUrl?: string;
  author?: string;
  category?: string;
  linkUrl?: string;
}

export interface BlogSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  posts: BlogPostItem[];
}

export interface VideoSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
}

export interface SocialMediaSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  whatsapp?: string;
  twitter?: string;
  linkedin?: string;
  telegram?: string;
}

export interface FooterSectionConfig {
  enabled: boolean;
  aboutText: string;
  quickLinks: Array<{ label: string; url: string }>;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  };
  copyrightText: string;
}

export interface CategorySectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
}

export interface ShopSectionsConfig {
  heroBanner?: HeroBannerSectionConfig;
  hero: HeroSectionConfig;
  about: AboutSectionConfig;
  features: FeaturesSectionConfig; // Why Choose Us
  category?: CategorySectionConfig; // Category showcase
  services: ServicesSectionConfig;
  products: ProductsSectionConfig;
  courses?: CoursesSectionConfig;
  videos?: VideoSectionConfig;
  offers: OffersSectionConfig;
  gallery?: GallerySectionConfig; // Photo Gallery
  portfolio: PortfolioSectionConfig;
  team: TeamSectionConfig;
  faq: FaqSectionConfig;
  cta: CtaSectionConfig;
  contact: ContactSectionConfig;
  socialMedia?: SocialMediaSectionConfig;
  blog: BlogSectionConfig;
  footer: FooterSectionConfig;
  benefits?: BenefitsSectionConfig;
  testimonials?: TestimonialsSectionConfig;
  howItWorks?: HowItWorksSectionConfig;
  pricing?: PricingSectionConfig;
}

export interface AdvertisementPopup {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  startDate: string;
  endDate: string;
  frequency: 'ONCE_PER_SESSION' | 'ALWAYS';
  targetType: 'ALL_PUBLISHED' | 'CATEGORIES' | 'SELECTED_SHOPS';
  targetCategories: string[];
  targetShopIds: string[];
  isEnabled: boolean;
}

export interface PricingPackage {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  period: string; // e.g. "Per Year (1 Year Validity)"
  badge?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface TutorialVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  duration: string;
  description: string;
}

export interface PlatformLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessCategory: string;
  city: string;
  message: string;
  date: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED';
}

export interface MainWebsiteSectionsConfig {
  heroBanner: boolean;
  aboutStorySlider: boolean;
  videoTutorials: boolean;
  liveStoresShowcase: boolean;
  whyChooseUs: boolean;
  pricingPlan: boolean;
  adminPaymentQr: boolean;
  bottomCtaBanner: boolean;
}

export interface PlatformState {
  shops: Shop[];
  popups: AdvertisementPopup[];
  pricingPackages: PricingPackage[];
  tutorialVideos: TutorialVideo[];
  globalPopupEnabled: boolean;
  platformLeads: PlatformLead[];
  inquiries: ShopInquiry[];
  customerCarePhone: string;
  customerCareWhatsapp: string;
  customerCareEmail: string;
  supportHours: string;
  adminPaymentQrUrl?: string;
  adminUpiId?: string;
  adminAccountHolder?: string;
  platformHeroHeading?: string;
  platformHeroSubheading?: string;
  platformAboutStory?: string;
  platformAboutPhotos?: string[];
  mainWebsiteSectionsConfig?: MainWebsiteSectionsConfig;
  themes?: IndianTheme[];
  saasBackups?: SaaSPlatformBackup[];
  customDomainRecords?: CustomDomainRecord[];
  platformVersions?: PlatformVersionDefinition[];
  autoBackupConfig?: AutoBackupConfig;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface SubscriptionInvoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-8942"
  shopId: string;
  businessName: string;
  vendorName: string;
  vendorPhone: string;
  vendorEmail?: string;
  vendorAddress?: string;
  planName: string;
  planPeriod: string; // e.g. "1 Year (365 Days)"
  activeDate: string;
  expiryDate: string;
  baseAmount: number; // e.g. 1270.34
  taxRate: number; // e.g. 18% GST or 0%
  taxAmount: number; // e.g. 228.66
  totalAmount: number; // e.g. 1499
  paymentMethod: 'UPI' | 'QR_CODE' | 'BANK_TRANSFER' | 'MANUAL_ADMIN';
  paymentRefId?: string; // UTR / Transaction ID
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  paidAt: string;
  issuedBy: string; // "IndianLalaJi Platform Network"
  adminGstin?: string;
  adminAddress?: string;
}

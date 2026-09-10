import {
  Shop,
  VendorWebsiteBackup,
  VendorMigrationRecord,
  PlatformModuleDefinition,
  PlatformVersionDefinition,
  AutoBackupConfig,
} from '../types';

/**
 * 8 Modular Platform Extensions (Future-Ready Verticals & AI Capabilities)
 * Any new feature or industry module is registered here without altering core code.
 */
export const AVAILABLE_PLATFORM_MODULES: PlatformModuleDefinition[] = [
  {
    id: 'module_ai_voice',
    name: 'AI Voice Command Assistant',
    category: 'AI',
    description: 'Bilingual Hindi/English speech-to-catalog search & smart voice-guided order assistant for customers.',
    icon: 'Mic',
    versionIntroduced: 'v2.0',
    isBeta: false,
    features: [
      'Voice search for catalog products & services',
      'Hindi / Hinglish spoken query recognition',
      'Hands-free WhatsApp order drafting',
      'Voice-guided store navigation',
    ],
  },
  {
    id: 'module_doctor_clinic',
    name: 'Doctor & Healthcare Clinic',
    category: 'VERTICAL',
    description: 'Specialized clinic appointment booking, OPD timings, doctor credentials, and prescription upload.',
    icon: 'Stethoscope',
    versionIntroduced: 'v2.0',
    isBeta: false,
    features: [
      'Doctor OPD schedule & consultation time slots',
      'Patient token & appointment booking engine',
      'Secure prescription & medical report upload',
      'Specialist doctor profiles & clinic certificates',
    ],
  },
  {
    id: 'module_motor_garage',
    name: 'Motor & Automobile Garage',
    category: 'VERTICAL',
    description: 'Vehicle servicing scheduler, chassis/reg number intake, roadside breakdown SOS, and job card logs.',
    icon: 'Wrench',
    versionIntroduced: 'v2.0',
    isBeta: false,
    features: [
      'Vehicle service booking (2-Wheeler / 4-Wheeler)',
      'Vehicle registration & chassis number tracking',
      '24/7 Roadside breakdown SOS call button',
      'Service history & estimated delivery status',
    ],
  },
  {
    id: 'module_salon_spa',
    name: 'Salon & Beauty Parlor',
    category: 'VERTICAL',
    description: 'Stylist assignment, treatment duration calculator, beauty package menus, and time-slot booking.',
    icon: 'Sparkles',
    versionIntroduced: 'v2.0',
    isBeta: false,
    features: [
      'Stylist & beautician selection matrix',
      'Treatment duration (30 min / 60 min / Bridal)',
      'Package deals & festive beauty salon bundles',
      'Advance slot booking with WhatsApp reminder',
    ],
  },
  {
    id: 'module_restaurant',
    name: 'Restaurant, Cafe & Sweets',
    category: 'VERTICAL',
    description: 'Digital food menu, dietary badges (Pure Veg / Jain / Halal), table reservation, and takeaway orders.',
    icon: 'Utensils',
    versionIntroduced: 'v1.1',
    isBeta: false,
    features: [
      'Digital dine-in menu with dietary labels',
      'Table reservation request engine',
      'Chef specials & daily fresh sweet showcase',
      'Direct kitchen WhatsApp order receipt',
    ],
  },
  {
    id: 'module_coaching',
    name: 'Coaching, Tutors & Academy',
    category: 'VERTICAL',
    description: 'Batch schedule timetable, demo class registration, student syllabus downloads, and teacher profiles.',
    icon: 'GraduationCap',
    versionIntroduced: 'v1.1',
    isBeta: false,
    features: [
      'Batch timings & classroom subject schedule',
      'Free demo class registration form',
      'Syllabus & study material PDF download links',
      'Faculty achievements & student success gallery',
    ],
  },
  {
    id: 'module_modular_sections',
    name: '18 Modular Page Sections CMS',
    category: 'INFRA',
    description: 'Complete visual control over Hero, Banners, About Us, Reviews, Video Showcase, FAQ, and Inquiry sections.',
    icon: 'Layout',
    versionIntroduced: 'v1.1',
    isBeta: false,
    features: [
      '18 Independent ON / OFF toggleable sections',
      'Responsive Hero slider (Desktop 16:9 & Mobile portrait)',
      'Custom drag & arrange section display order',
      'Dynamic social links, photo gallery, and team cards',
    ],
  },
  {
    id: 'module_custom_domains',
    name: 'Custom Domain & DNS Router',
    category: 'INFRA',
    description: 'Connect own .com / .in domain (e.g. www.myshop.com) with automated CNAME & IP pointing records.',
    icon: 'Globe',
    versionIntroduced: 'v1.1',
    isBeta: false,
    features: [
      'Custom domain name binding (myshop.com / shop.brand.in)',
      'DNS CNAME & A record verification status tracker',
      'Automated SSL certificate badge indicator',
      'Zero downtime domain proxy routing',
    ],
  },
];

/**
 * Platform Versions Definition
 * When new features or themes are released, they are packaged into a version.
 * Existing vendors ALWAYS remain on their current version unless manually migrated by Super Admin.
 */
export const DEFAULT_PLATFORM_VERSIONS: PlatformVersionDefinition[] = [
  {
    version: 'v1.0',
    name: 'Classic Core Stable (LTS)',
    releaseDate: '2025-10-15',
    description: 'Rock-solid base platform with core catalog, WhatsApp cart ordering, and standard Indian themes.',
    features: [
      'Basic Product & Service Showcase',
      'Direct WhatsApp Ordering & Phone Inquiry',
      'Standard Bharat Royal & Traditional Themes',
      'QR Standee & Share Flyer Generator',
    ],
    modules: ['core_ecommerce'],
    isStable: true,
    isLTS: true,
  },
  {
    version: 'v1.1',
    name: 'Modular Sections & Custom Domains',
    releaseDate: '2026-03-01',
    description: 'Enhanced storefront with 18 modular section toggles, separate desktop/mobile hero banners, and custom domain connection.',
    features: [
      '18 Modular Page Sections (Hero, Banner, About, FAQ, Blog, etc.)',
      'Desktop & Mobile Dual-Banner Carousel',
      'Custom Domain Binding & DNS Verification',
      'Digital Invoice PDF & Cash Memo Generator',
    ],
    modules: ['core_ecommerce', 'module_modular_sections', 'module_custom_domains'],
    isStable: true,
    isLTS: false,
  },
  {
    version: 'v2.0',
    name: 'Next-Gen AI & Vertical Verticals',
    releaseDate: '2026-09-10',
    description: 'Future-ready SaaS with AI Voice Command, specialized vertical industry modules (Doctor, Motor Garage, Salon), and automated disaster recovery.',
    features: [
      'AI Voice Command Assistant (Hinglish / English voice search)',
      'Doctor & Clinic OPD Token & Prescription Booking',
      'Motor Garage Vehicle Service & Chassis Tracker',
      'Salon Stylist Appointment & Duration Calculator',
      'Immutable Vendor Version Lock & Pre-Migration Automated Snapshots',
    ],
    modules: [
      'core_ecommerce',
      'module_modular_sections',
      'module_custom_domains',
      'module_ai_voice',
      'module_doctor_clinic',
      'module_motor_garage',
      'module_salon_spa',
    ],
    isStable: true,
    isLTS: false,
  },
];

export const DEFAULT_AUTO_BACKUP_CONFIG: AutoBackupConfig = {
  enabled: true,
  frequency: 'DAILY',
  lastBackupAt: new Date().toISOString(),
  keepMaxSnapshots: 10,
};

/**
 * CRITICAL SAFETY GUARD:
 * Ensures existing vendor data, products, images, content, settings, current design,
 * and custom domain remain 100% UNTOUCHED while guaranteeing version safety flags.
 */
export function ensureShopSafetyDefaults(shop: Shop): Shop {
  const isExisting = Boolean(shop.shopVersion);
  return {
    ...shop,
    // Pin existing vendors to their existing version, or v1.0 by default
    shopVersion: shop.shopVersion || 'v1.0',
    // Version lock is TRUE by default to prevent unintended automatic updates
    versionLock: shop.versionLock ?? true,
    // Base installed modules
    installedModules:
      shop.installedModules && shop.installedModules.length > 0
        ? shop.installedModules
        : ['core_ecommerce', 'module_modular_sections'],
    migrationHistory: shop.migrationHistory || [],
    backups: shop.backups || [],
  };
}

/**
 * Checks if a specific module is active for a given shop
 */
export function isModuleActiveForShop(shop: Shop, moduleId: string): boolean {
  if (!shop.installedModules || shop.installedModules.length === 0) {
    // If shop is on v1.0, only core modules are active
    return moduleId === 'core_ecommerce' || moduleId === 'module_modular_sections';
  }
  return shop.installedModules.includes(moduleId);
}

/**
 * Safely migrates a vendor to a target platform version with MANDATORY automated pre-migration backup.
 * Existing products, images, content, settings, current design, and custom domain are guaranteed preserved!
 */
export function executeSafeVendorMigration(
  shop: Shop,
  targetVersion: string,
  targetModules: string[],
  appliedBy: string,
  note?: string
): { updatedShop: Shop; backupSnapshot: VendorWebsiteBackup; migrationRecord: VendorMigrationRecord } {
  const timestamp = new Date().toISOString();
  const fromVersion = shop.shopVersion || 'v1.0';

  // 1. MANDATORY: Create isolated automated snapshot backup BEFORE migration
  const backupId = `bkp_premigration_${shop.shopId}_${Date.now()}`;
  const backupSnapshot: VendorWebsiteBackup = {
    backupId,
    shopId: shop.shopId,
    businessName: shop.businessName,
    createdAt: timestamp,
    version: fromVersion,
    description: `Automated Pre-Migration Backup before upgrading from ${fromVersion} to ${targetVersion}`,
    data: JSON.parse(JSON.stringify(shop)),
  };

  // 2. Create official audit trail migration record
  const migrationRecord: VendorMigrationRecord = {
    id: `mig_${Date.now()}`,
    fromVersion,
    toVersion: targetVersion,
    migratedAt: timestamp,
    backupId,
    enabledModules: targetModules,
    note: note || `Super Admin manual upgrade to ${targetVersion}`,
    appliedBy,
  };

  // 3. Update shop version & modules strictly without modifying existing content/products/design
  const updatedShop: Shop = {
    ...shop,
    shopVersion: targetVersion,
    installedModules: Array.from(new Set([...(shop.installedModules || []), ...targetModules])),
    backups: [backupSnapshot, ...(shop.backups || [])],
    migrationHistory: [migrationRecord, ...(shop.migrationHistory || [])],
    updatedAt: timestamp,
  };

  return { updatedShop, backupSnapshot, migrationRecord };
}

/**
 * 1-Click Rollback for a migrated vendor:
 * Restores the exact pre-migration snapshot taken before the migration occurred.
 */
export function rollbackVendorMigration(
  shop: Shop,
  migrationRecordId: string
): { restoredShop: Shop; restoredFromBackupId: string } | null {
  const migration = shop.migrationHistory?.find((m) => m.id === migrationRecordId);
  if (!migration) return null;

  const targetBackup = shop.backups?.find((b) => b.backupId === migration.backupId);
  if (!targetBackup) return null;

  // Restore data from backup while preserving backups array and logging rollback
  const restoredShop: Shop = {
    ...targetBackup.data,
    id: shop.id,
    shopId: shop.shopId,
    vendorId: shop.vendorId,
    vendorEmail: shop.vendorEmail,
    vendorPassword: shop.vendorPassword,
    backups: shop.backups, // Keep snapshot history intact
    shopVersion: migration.fromVersion,
    migrationHistory: (shop.migrationHistory || []).map((m) =>
      m.id === migrationRecordId
        ? { ...m, note: `${m.note || ''} (ROLLED BACK on ${new Date().toLocaleDateString()})` }
        : m
    ),
    updatedAt: new Date().toISOString(),
  };

  return { restoredShop, restoredFromBackupId: targetBackup.backupId };
}

import React, { useState, useRef, useMemo } from 'react';
import {
  ShieldCheck,
  Database,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Server,
  Sparkles,
  Users,
  Store,
  ArrowRight,
  HardDrive,
  Copy,
  Check,
  Lock,
  Unlock,
  ShieldAlert,
  Cpu,
  Stethoscope,
  Wrench,
  Utensils,
  GraduationCap,
  Globe,
  Mic,
  RefreshCw,
  Sliders,
  FileText
} from 'lucide-react';
import {
  Shop,
  PlatformState,
  VendorWebsiteBackup,
  SaaSPlatformBackup,
  VendorMigrationRecord,
  PlatformModuleDefinition,
  PlatformVersionDefinition,
  AutoBackupConfig,
  SelectedVendorsBackup
} from '../../types';
import { formatDisplayDate } from '../../utils/mediaUpload';
import {
  exportSelectedVendorsBundleJSON,
  exportCustomDomainVendorsBundleJSON,
  parseVendorsBundleJSON,
  triggerFileDownload,
  downloadJSON
} from '../../utils/exportUtils';
import {
  AVAILABLE_PLATFORM_MODULES,
  DEFAULT_PLATFORM_VERSIONS,
  DEFAULT_AUTO_BACKUP_CONFIG,
  ensureShopSafetyDefaults,
  executeSafeVendorMigration,
  rollbackVendorMigration
} from '../../utils/moduleRegistry';

interface AdminBackupsManagerProps {
  state: PlatformState;
  onUpdateState: (newState: PlatformState) => void;
  onNavigateToShop?: (shopId: string) => void;
}

type MainTab = 'VAULT' | 'SAFETY_POLICY' | 'VERSIONING' | 'MIGRATION';
type VaultScope = 'SAAS' | 'ALL_VENDORS' | 'SELECTED_VENDORS' | 'SINGLE_VENDOR' | 'CUSTOM_DOMAINS';

export const AdminBackupsManager: React.FC<AdminBackupsManagerProps> = ({
  state,
  onUpdateState,
  onNavigateToShop,
}) => {
  // Main view navigation
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('VAULT');
  const [vaultScope, setVaultScope] = useState<VaultScope>('SELECTED_VENDORS');

  // Search & Filter
  const [vendorSearch, setVendorSearch] = useState<string>('');
  const [selectedShopId, setSelectedShopId] = useState<string>(
    state.shops && state.shops.length > 0 ? state.shops[0].shopId : ''
  );
  const [selectedShopIdsForBatch, setSelectedShopIdsForBatch] = useState<string[]>([]);
  const [filterDomainOnly, setFilterDomainOnly] = useState<boolean>(false);
  const [filterVersion, setFilterVersion] = useState<string>('ALL');

  // Toasts & Notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Pre-Update Safety Snapshot modal / state
  const [isPreUpdateModalOpen, setIsPreUpdateModalOpen] = useState(false);
  const [preUpdateDescription, setPreUpdateDescription] = useState(
    'Pre-Update Safety Backup before major platform enhancements'
  );

  // Auto Backup state
  const autoConfig: AutoBackupConfig = state.autoBackupConfig || DEFAULT_AUTO_BACKUP_CONFIG;

  // Import Modals & Previews
  const [importTarget, setImportTarget] = useState<'SAAS' | 'VENDORS_BUNDLE' | 'SINGLE_VENDOR' | null>(null);
  const [importedDataPreview, setImportedDataPreview] = useState<any | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importMergeMode, setImportMergeMode] = useState<'MERGE' | 'REPLACE'>('MERGE');

  // Migration Modal state
  const [migrationModalShop, setMigrationModalShop] = useState<Shop | null>(null);
  const [targetMigrationVersion, setTargetMigrationVersion] = useState<string>('v2.0');
  const [selectedModulesForMigration, setSelectedModulesForMigration] = useState<string[]>([
    'module_ai_voice',
    'module_modular_sections',
    'module_custom_domains'
  ]);
  const [migrationAdminNote, setMigrationAdminNote] = useState<string>('');
  const [migrationConfirmed, setMigrationConfirmed] = useState<boolean>(false);

  // Single Vendor snapshot notes
  const [vendorSnapshotNote, setVendorSnapshotNote] = useState<string>('');

  // Hidden File Inputs
  const saasFileInputRef = useRef<HTMLInputElement | null>(null);
  const vendorsBundleInputRef = useRef<HTMLInputElement | null>(null);
  const singleVendorInputRef = useRef<HTMLInputElement | null>(null);

  // Derived Statistics
  const totalShops = state.shops.length;
  const customDomainShops = useMemo(() => state.shops.filter((s) => Boolean(s.customDomain)), [state.shops]);
  const totalSnapshotsAcrossAllShops = useMemo(
    () => state.shops.reduce((acc, shop) => acc + (shop.backups?.length || 0), 0),
    [state.shops]
  );
  const totalSaasSnapshots = state.saasBackups?.length || 0;

  // Filtered Shops List
  const filteredShops = useMemo(() => {
    return state.shops.filter((shop) => {
      const q = vendorSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        shop.businessName.toLowerCase().includes(q) ||
        shop.shopId.toLowerCase().includes(q) ||
        shop.vendorName.toLowerCase().includes(q) ||
        shop.phone.includes(q) ||
        (shop.customDomain && shop.customDomain.toLowerCase().includes(q));

      const matchesDomain = !filterDomainOnly || Boolean(shop.customDomain);
      const matchesVersion = filterVersion === 'ALL' || (shop.shopVersion || 'v1.0') === filterVersion;

      return matchesSearch && matchesDomain && matchesVersion;
    });
  }, [state.shops, vendorSearch, filterDomainOnly, filterVersion]);

  // Selected single shop
  const currentSelectedShop = useMemo(
    () => state.shops.find((s) => s.shopId === selectedShopId) || state.shops[0] || null,
    [state.shops, selectedShopId]
  );

  // All historical migrations across platform
  const allMigrationRecords = useMemo(() => {
    const list: { shop: Shop; record: VendorMigrationRecord }[] = [];
    state.shops.forEach((shop) => {
      if (shop.migrationHistory && shop.migrationHistory.length > 0) {
        shop.migrationHistory.forEach((rec) => {
          list.push({ shop, record: rec });
        });
      }
    });
    return list.sort((a, b) => new Date(b.record.migratedAt).getTime() - new Date(a.record.migratedAt).getTime());
  }, [state.shops]);

  // Version Distribution
  const versionDistribution = useMemo(() => {
    const counts: Record<string, number> = { 'v1.0': 0, 'v1.1': 0, 'v2.0': 0 };
    state.shops.forEach((s) => {
      const v = s.shopVersion || 'v1.0';
      counts[v] = (counts[v] || 0) + 1;
    });
    return counts;
  }, [state.shops]);

  // ============================================================================
  // HANDLERS: SAAS BACKUP & PRE-UPDATE SAFETY
  // ============================================================================

  const handleExportFullSaasJson = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `indianlalaji_full_saas_backup_${dateStr}.json`;
    const payload = {
      backupMetadata: {
        platform: 'IndianLalaJi Digital SaaS Network',
        backupType: 'FULL_SAAS_MASTER_IMAGE',
        version: 'v2.0',
        exportedAt: new Date().toISOString(),
        totalShops: state.shops.length,
        totalSaasSnapshots: state.saasBackups?.length || 0,
        criticalRule: 'New feature, theme, template, category module ya SaaS design update existing vendor data ko automatically modify nahi karega.',
      },
      data: state,
    };
    downloadJSON(filename, payload);
    showToast('Full SaaS Backup JSON successfully exported!');
  };

  const handleCreatePreUpdateSafetyBackup = () => {
    const timestamp = new Date().toISOString();
    const backupId = `bkp_preupdate_saas_${Date.now()}`;
    const newSnapshot: SaaSPlatformBackup = {
      backupId,
      createdAt: timestamp,
      version: 'v2.0-PRE-UPDATE',
      description: preUpdateDescription || 'One-Click Pre-Update Safety Backup',
      totalShops: state.shops.length,
      data: JSON.parse(JSON.stringify(state)),
    };

    // Also take individual snapshots for every shop
    const updatedShops = state.shops.map((shop) => {
      const shopSnap: VendorWebsiteBackup = {
        backupId: `bkp_preupdate_${shop.shopId}_${Date.now()}`,
        shopId: shop.shopId,
        businessName: shop.businessName,
        createdAt: timestamp,
        version: shop.shopVersion || 'v1.0',
        description: `Pre-Update Safety Snapshot: ${preUpdateDescription}`,
        data: JSON.parse(JSON.stringify(shop)),
      };
      return {
        ...shop,
        backups: [shopSnap, ...(shop.backups || [])],
      };
    });

    const newState: PlatformState = {
      ...state,
      shops: updatedShops,
      saasBackups: [newSnapshot, ...(state.saasBackups || [])],
      autoBackupConfig: {
        ...autoConfig,
        lastBackupAt: timestamp,
      },
    };

    onUpdateState(newState);
    setIsPreUpdateModalOpen(false);
    showToast('Pre-Update Safety Backup created for Full SaaS and all stores!');
  };

  const handleTriggerAutoBackupNow = () => {
    const timestamp = new Date().toISOString();
    const backupId = `bkp_autosaas_${Date.now()}`;
    const autoSnapshot: SaaSPlatformBackup = {
      backupId,
      createdAt: timestamp,
      version: 'v2.0-AUTO',
      description: `Automated Scheduled Backup (${autoConfig.frequency})`,
      totalShops: state.shops.length,
      data: JSON.parse(JSON.stringify(state)),
    };

    const newState: PlatformState = {
      ...state,
      saasBackups: [autoSnapshot, ...(state.saasBackups || []).slice(0, autoConfig.keepMaxSnapshots - 1)],
      autoBackupConfig: {
        ...autoConfig,
        lastBackupAt: timestamp,
      },
    };
    onUpdateState(newState);
    showToast('Auto Backup completed successfully!');
  };

  const handleToggleAutoBackup = (enabled: boolean) => {
    const newState: PlatformState = {
      ...state,
      autoBackupConfig: {
        ...autoConfig,
        enabled,
      },
    };
    onUpdateState(newState);
    showToast(`Auto Backup ${enabled ? 'ENABLED' : 'DISABLED'}`);
  };

  const handleChangeAutoBackupFrequency = (freq: AutoBackupConfig['frequency']) => {
    const newState: PlatformState = {
      ...state,
      autoBackupConfig: {
        ...autoConfig,
        frequency: freq,
      },
    };
    onUpdateState(newState);
    showToast(`Auto Backup frequency updated to ${freq}`);
  };

  // ============================================================================
  // HANDLERS: VENDOR BACKUPS (ALL, SELECTED, SINGLE, CUSTOM DOMAIN)
  // ============================================================================

  const handleExportAllVendorsBundle = () => {
    exportSelectedVendorsBundleJSON(state.shops, `All Platform Vendors (${state.shops.length})`);
    showToast(`Exported all ${state.shops.length} vendors in bundle JSON!`);
  };

  const handleExportSelectedVendorsBundle = () => {
    if (selectedShopIdsForBatch.length === 0) {
      showToast('Please select at least one vendor first!');
      return;
    }
    const selectedShops = state.shops.filter((s) => selectedShopIdsForBatch.includes(s.shopId));
    exportSelectedVendorsBundleJSON(selectedShops, `Selected Vendors Batch (${selectedShops.length})`);
    showToast(`Exported ${selectedShops.length} selected vendors in bundle JSON!`);
  };

  const handleExportCustomDomainVendors = () => {
    if (customDomainShops.length === 0) {
      showToast('No vendors currently have custom domains attached!');
      return;
    }
    exportCustomDomainVendorsBundleJSON(state.shops);
    showToast(`Exported ${customDomainShops.length} Custom Domain Vendors Vault!`);
  };

  const handleExportSingleVendor = (shop: Shop) => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `vendor_${shop.shopId}_${shop.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${dateStr}.json`;
    const payload = {
      metadata: {
        platform: 'IndianLalaJi Digital SaaS Network',
        exportType: 'SINGLE_VENDOR_STANDALONE',
        exportedAt: new Date().toISOString(),
        shopId: shop.shopId,
        businessName: shop.businessName,
        shopVersion: shop.shopVersion || 'v1.0',
        versionLock: shop.versionLock ?? true,
      },
      shop,
    };
    downloadJSON(filename, payload);
    showToast(`Exported single vendor JSON for ${shop.businessName}!`);
  };

  const handleCreateSingleVendorSnapshot = (shop: Shop) => {
    const timestamp = new Date().toISOString();
    const backupId = `bkp_vendor_${shop.shopId}_${Date.now()}`;
    const newSnap: VendorWebsiteBackup = {
      backupId,
      shopId: shop.shopId,
      businessName: shop.businessName,
      createdAt: timestamp,
      version: shop.shopVersion || 'v1.0',
      description: vendorSnapshotNote.trim() || 'Manual Super Admin Snapshot',
      data: JSON.parse(JSON.stringify(shop)),
    };

    const updatedShops = state.shops.map((s) => {
      if (s.shopId === shop.shopId) {
        return {
          ...s,
          backups: [newSnap, ...(s.backups || [])],
        };
      }
      return s;
    });

    onUpdateState({ ...state, shops: updatedShops });
    setVendorSnapshotNote('');
    showToast(`New snapshot created for ${shop.businessName}!`);
  };

  const handleRestoreVendorSnapshot = (shop: Shop, backup: VendorWebsiteBackup) => {
    const confirmRestore = window.confirm(
      `Restore website for "${shop.businessName}" to snapshot from ${new Date(backup.createdAt).toLocaleString()}?\n\nExisting products, content, and settings will be safely reverted to that exact snapshot.`
    );
    if (!confirmRestore) return;

    const restoredShop: Shop = {
      ...backup.data,
      id: shop.id,
      shopId: shop.shopId,
      vendorId: shop.vendorId,
      vendorEmail: shop.vendorEmail,
      vendorPassword: shop.vendorPassword,
      backups: shop.backups, // Keep existing backup history
      updatedAt: new Date().toISOString(),
    };

    const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? restoredShop : s));
    onUpdateState({ ...state, shops: updatedShops });
    showToast(`Website restored to snapshot ${backup.backupId}!`);
  };

  const handleDeleteVendorSnapshot = (shop: Shop, backupId: string) => {
    const confirmDel = window.confirm('Delete this saved snapshot? This cannot be undone.');
    if (!confirmDel) return;

    const updatedShops = state.shops.map((s) => {
      if (s.shopId === shop.shopId) {
        return {
          ...s,
          backups: (s.backups || []).filter((b) => b.backupId !== backupId),
        };
      }
      return s;
    });

    onUpdateState({ ...state, shops: updatedShops });
    showToast('Snapshot removed.');
  };

  // Batch Snapshot for Selected Vendors
  const handleBatchSnapshotSelectedVendors = () => {
    if (selectedShopIdsForBatch.length === 0) {
      showToast('Select at least one vendor first!');
      return;
    }
    const timestamp = new Date().toISOString();
    const updatedShops = state.shops.map((shop) => {
      if (selectedShopIdsForBatch.includes(shop.shopId)) {
        const snap: VendorWebsiteBackup = {
          backupId: `bkp_batch_${shop.shopId}_${Date.now()}`,
          shopId: shop.shopId,
          businessName: shop.businessName,
          createdAt: timestamp,
          version: shop.shopVersion || 'v1.0',
          description: `Batch Snapshot of ${selectedShopIdsForBatch.length} vendors`,
          data: JSON.parse(JSON.stringify(shop)),
        };
        return {
          ...shop,
          backups: [snap, ...(shop.backups || [])],
        };
      }
      return shop;
    });

    onUpdateState({ ...state, shops: updatedShops });
    showToast(`Batch snapshot created for ${selectedShopIdsForBatch.length} vendors!`);
  };

  // Toggle Selection
  const handleToggleSelectShop = (shopId: string) => {
    setSelectedShopIdsForBatch((prev) =>
      prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]
    );
  };

  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredShops.map((s) => s.shopId);
    setSelectedShopIdsForBatch((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
  };

  const handleDeselectAll = () => {
    setSelectedShopIdsForBatch([]);
  };

  // Toggle Version Lock for a shop
  const handleToggleShopVersionLock = (shop: Shop) => {
    const newLock = !(shop.versionLock ?? true);
    const updatedShops = state.shops.map((s) => {
      if (s.shopId === shop.shopId) {
        return { ...s, versionLock: newLock };
      }
      return s;
    });
    onUpdateState({ ...state, shops: updatedShops });
    showToast(`Version lock ${newLock ? 'ENGAGED 🔒' : 'UNLOCKED 🔓'} for ${shop.businessName}`);
  };

  // ============================================================================
  // HANDLERS: IMPORT & RESTORE MODALS
  // ============================================================================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, target: 'SAAS' | 'VENDORS_BUNDLE' | 'SINGLE_VENDOR') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        if (target === 'SAAS') {
          const parsed = JSON.parse(content);
          const saasState = parsed.data || parsed;
          if (!saasState.shops || !Array.isArray(saasState.shops)) {
            setImportError('Invalid SaaS Backup file! Missing "shops" array.');
            return;
          }
          setImportedDataPreview(saasState);
          setImportTarget('SAAS');
          setImportError(null);
        } else if (target === 'VENDORS_BUNDLE' || target === 'SINGLE_VENDOR') {
          const res = parseVendorsBundleJSON(content);
          if (!res.success || res.shops.length === 0) {
            setImportError(res.error || 'Invalid file format.');
            return;
          }
          setImportedDataPreview(res);
          setImportTarget(target);
          setImportError(null);
        }
      } catch (err) {
        setImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleExecuteImport = () => {
    if (!importedDataPreview || !importTarget) return;

    if (importTarget === 'SAAS') {
      const parsedState = importedDataPreview as Partial<PlatformState>;
      if (importMergeMode === 'REPLACE') {
        const confirmWipe = window.confirm(
          'WARNING: Full Replace will overwrite the entire SaaS platform state with the imported file.\nAre you sure you want to proceed?'
        );
        if (!confirmWipe) return;
        onUpdateState({
          ...state,
          ...parsedState,
          shops: (parsedState.shops || []).map((s) => ensureShopSafetyDefaults(s)),
        });
        showToast('Full SaaS Platform restored from backup file!');
      } else {
        // Safe Merge: Merge shops (update existing and add new), preserve unaffected shops
        const existingShopsMap = new Map(state.shops.map((s) => [s.shopId, s]));
        (parsedState.shops || []).forEach((incomingShop) => {
          existingShopsMap.set(incomingShop.shopId, ensureShopSafetyDefaults(incomingShop));
        });
        onUpdateState({
          ...state,
          shops: Array.from(existingShopsMap.values()),
          themes: parsedState.themes || state.themes,
          pricingPackages: parsedState.pricingPackages || state.pricingPackages,
        });
        showToast('Safe Merge complete: Platform shops successfully updated!');
      }
    } else if (importTarget === 'VENDORS_BUNDLE' || importTarget === 'SINGLE_VENDOR') {
      const incomingShops: Shop[] = importedDataPreview.shops || [];
      const existingShopsMap = new Map(state.shops.map((s) => [s.shopId, s]));

      incomingShops.forEach((incomingShop) => {
        existingShopsMap.set(incomingShop.shopId, ensureShopSafetyDefaults(incomingShop));
      });

      onUpdateState({
        ...state,
        shops: Array.from(existingShopsMap.values()),
      });
      showToast(`Imported & restored ${incomingShops.length} vendor store(s) successfully!`);
    }

    setImportTarget(null);
    setImportedDataPreview(null);
  };

  // ============================================================================
  // HANDLERS: VENDOR MIGRATION ENGINE
  // ============================================================================

  const handleOpenMigrationModal = (shop: Shop) => {
    setMigrationModalShop(shop);
    setTargetMigrationVersion('v2.0');
    setSelectedModulesForMigration(shop.installedModules || ['module_ai_voice', 'module_modular_sections']);
    setMigrationAdminNote('');
    setMigrationConfirmed(false);
  };

  const handleExecuteMigration = () => {
    if (!migrationModalShop || !migrationConfirmed) return;

    const { updatedShop, backupSnapshot, migrationRecord } = executeSafeVendorMigration(
      migrationModalShop,
      targetMigrationVersion,
      selectedModulesForMigration,
      'Super Admin (rkmehra331996@gmail.com)',
      migrationAdminNote
    );

    const updatedShops = state.shops.map((s) => (s.shopId === updatedShop.shopId ? updatedShop : s));
    onUpdateState({ ...state, shops: updatedShops });

    setMigrationModalShop(null);
    showToast(
      `Successfully migrated "${updatedShop.businessName}" to ${targetMigrationVersion}! Automated backup saved (${backupSnapshot.backupId}).`
    );
  };

  const handleRollbackMigration = (shop: Shop, migrationRecordId: string) => {
    const confirmRollback = window.confirm(
      `Roll back migration for "${shop.businessName}"?\n\nThe automated snapshot taken immediately before migration will be restored, returning the shop safely to its previous version.`
    );
    if (!confirmRollback) return;

    const result = rollbackVendorMigration(shop, migrationRecordId);
    if (!result) {
      showToast('Could not find pre-migration backup snapshot for rollback.');
      return;
    }

    const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? result.restoredShop : s));
    onUpdateState({ ...state, shops: updatedShops });
    showToast(`Migration rolled back successfully to ${result.restoredShop.shopVersion}!`);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-slate-700 animate-slideUp">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hidden Inputs for File Upload */}
      <input
        type="file"
        ref={saasFileInputRef}
        onChange={(e) => handleFileSelect(e, 'SAAS')}
        accept=".json"
        className="hidden"
      />
      <input
        type="file"
        ref={vendorsBundleInputRef}
        onChange={(e) => handleFileSelect(e, 'VENDORS_BUNDLE')}
        accept=".json"
        className="hidden"
      />
      <input
        type="file"
        ref={singleVendorInputRef}
        onChange={(e) => handleFileSelect(e, 'SINGLE_VENDOR')}
        accept=".json"
        className="hidden"
      />

      {/* ============================================================ */}
      {/* HEADER & IMMUNITY GUARANTEE BANNER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-3 py-1 rounded-full font-mono flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                SUPER ADMIN DISASTER RECOVERY & SAFETY SHIELD
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Immutable Vendor Version Lock Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Outfit',sans-serif]">
              Backup, Versioning & Future Update Safety Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Complete disaster protection: Full SaaS, All Vendors, Selected Vendors batch, and Custom Domain vault
              exports. Pre-update safety snapshots, automated backups, and guaranteed zero-interference for existing stores.
            </p>
          </div>

          {/* Quick Pre-Update Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setIsPreUpdateModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              Pre-Update Safety Backup
            </button>

            <button
              type="button"
              onClick={handleExportFullSaasJson}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Full SaaS JSON
            </button>
          </div>
        </div>

        {/* CRITICAL RULE HIGHLIGHT STRIP */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block">
                CRITICAL IMMUNITY RULE ENFORCED
              </span>
              <p className="text-xs text-slate-200 mt-0.5 leading-snug">
                Koi bhi new update, feature, theme, template, ya category module add karne se existing vendors ki website
                automatically modify, reset ya delete nahi hogi. Products, images, content, settings, current design,
                aur custom domain 100% untouched rahenge.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <div className="text-lg font-black text-orange-400 font-mono">{totalShops}</div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">Stores</div>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <div className="text-lg font-black text-emerald-400 font-mono">{totalSnapshotsAcrossAllShops}</div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">Snapshots</div>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <div className="text-lg font-black text-cyan-400 font-mono">{customDomainShops.length}</div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">Domains</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4 TOP TABS NAVIGATION */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveMainTab('VAULT')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeMainTab === 'VAULT'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Database className="w-4 h-4 text-orange-400" />
          Backup & Disaster Recovery Vault
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('SAFETY_POLICY')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeMainTab === 'SAFETY_POLICY'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Existing Vendor Safety & Immunity
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('VERSIONING')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeMainTab === 'VERSIONING'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Layers className="w-4 h-4 text-sky-400" />
          Platform Versions & Future Modules
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('MIGRATION')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeMainTab === 'MIGRATION'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-purple-400" />
          Vendor Migration & Rollback Center
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: VAULT (BACKUP & RESTORE ENGINES) */}
      {/* ============================================================ */}
      {activeMainTab === 'VAULT' && (
        <div className="space-y-6">
          {/* Scope Selector Ribbon */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                EXPORT & RESTORE SCOPE
              </span>
              <h3 className="text-sm font-black text-slate-900">Choose Target Data Layer</h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setVaultScope('SELECTED_VENDORS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  vaultScope === 'SELECTED_VENDORS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Selected Vendor(s) ({selectedShopIdsForBatch.length})
              </button>

              <button
                type="button"
                onClick={() => setVaultScope('SINGLE_VENDOR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  vaultScope === 'SINGLE_VENDOR'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Single Vendor
              </button>

              <button
                type="button"
                onClick={() => setVaultScope('ALL_VENDORS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  vaultScope === 'ALL_VENDORS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Vendors ({totalShops})
              </button>

              <button
                type="button"
                onClick={() => setVaultScope('CUSTOM_DOMAINS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  vaultScope === 'CUSTOM_DOMAINS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom Domain Vendors ({customDomainShops.length})
              </button>

              <button
                type="button"
                onClick={() => setVaultScope('SAAS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  vaultScope === 'SAAS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Full SaaS Platform
              </button>
            </div>
          </div>

          {/* SCOPE 1: SELECTED VENDOR(S) BATCH */}
          {vaultScope === 'SELECTED_VENDORS' && (
            <div className="space-y-4">
              {/* Batch Action Bar */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-600 text-white font-mono">
                      {selectedShopIdsForBatch.length} Selected
                    </span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Batch Vendor Operations
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Select multiple stores to export them into a single bundle JSON file, or take snapshots for all selected stores at once.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllFiltered}
                    className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-all"
                  >
                    Select All Filtered ({filteredShops.length})
                  </button>

                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-all"
                  >
                    Clear Selection
                  </button>

                  <button
                    type="button"
                    onClick={handleBatchSnapshotSelectedVendors}
                    disabled={selectedShopIdsForBatch.length === 0}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Snapshot Selected
                  </button>

                  <button
                    type="button"
                    onClick={handleExportSelectedVendorsBundle}
                    disabled={selectedShopIdsForBatch.length === 0}
                    className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Selected JSON ({selectedShopIdsForBatch.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => vendorsBundleInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Import Vendors Bundle
                  </button>
                </div>
              </div>

              {/* Vendors Checkbox Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={vendorSearch}
                      onChange={(e) => setVendorSearch(e.target.value)}
                      placeholder="Filter vendors by name, shopId, phone, domain..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterDomainOnly(!filterDomainOnly)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        filterDomainOnly
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      🌐 Domains Only
                    </button>

                    <select
                      value={filterVersion}
                      onChange={(e) => setFilterVersion(e.target.value)}
                      aria-label="Filter stores by platform version"
                      className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-slate-700"
                    >
                      <option value="ALL">All Versions</option>
                      <option value="v1.0">v1.0 Only</option>
                      <option value="v1.1">v1.1 Only</option>
                      <option value="v2.0">v2.0 Only</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100/75 border-b border-gray-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3.5 w-12 text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredShops.length > 0 &&
                              filteredShops.every((s) => selectedShopIdsForBatch.includes(s.shopId))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleSelectAllFiltered();
                              } else {
                                const filteredIds = new Set(filteredShops.map((s) => s.shopId));
                                setSelectedShopIdsForBatch((prev) => prev.filter((id) => !filteredIds.has(id)));
                              }
                            }}
                            className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                          />
                        </th>
                        <th className="p-3.5">Store / Business Name</th>
                        <th className="p-3.5">Owner & Contact</th>
                        <th className="p-3.5">Custom Domain</th>
                        <th className="p-3.5 text-center">Version</th>
                        <th className="p-3.5 text-center">Safety Lock</th>
                        <th className="p-3.5 text-center">Snapshots</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                      {filteredShops.map((shop) => {
                        const isSelected = selectedShopIdsForBatch.includes(shop.shopId);
                        const isLocked = shop.versionLock ?? true;
                        const bCount = shop.backups?.length || 0;
                        return (
                          <tr
                            key={shop.shopId}
                            className={`hover:bg-orange-50/40 transition-colors ${
                              isSelected ? 'bg-orange-50/60' : ''
                            }`}
                          >
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectShop(shop.shopId)}
                                className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{shop.businessName}</span>
                              </div>
                              <span className="font-mono text-[10px] text-slate-400">{shop.shopId}</span>
                            </td>
                            <td className="p-3.5">
                              <div>{shop.vendorName}</div>
                              <div className="text-[11px] text-gray-500">{shop.phone}</div>
                            </td>
                            <td className="p-3.5">
                              {shop.customDomain ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                                  🌐 {shop.customDomain}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-[11px]">—</span>
                              )}
                            </td>
                            <td className="p-3.5 text-center">
                              <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-slate-100 text-slate-800">
                                {shop.shopVersion || 'v1.0'}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleShopVersionLock(shop)}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                  isLocked
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                {isLocked ? 'Locked' : 'Unlocked'}
                              </button>
                            </td>
                            <td className="p-3.5 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  bCount > 0 ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {bCount}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleExportSingleVendor(shop)}
                                  title="Export this vendor JSON"
                                  className="p-1.5 hover:bg-gray-100 text-slate-600 rounded-lg cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenMigrationModal(shop)}
                                  title="Migrate to New Version"
                                  className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Migrate
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SCOPE 2: SINGLE VENDOR DEEP DIVE */}
          {vaultScope === 'SINGLE_VENDOR' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Selector List */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col h-[650px]">
                <div className="p-3.5 border-b border-gray-100 bg-gray-50">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={vendorSearch}
                      onChange={(e) => setVendorSearch(e.target.value)}
                      placeholder="Search vendor..."
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                  {filteredShops.map((shop) => {
                    const isSelected = shop.shopId === selectedShopId;
                    const bCount = shop.backups?.length || 0;
                    return (
                      <button
                        key={shop.shopId}
                        type="button"
                        onClick={() => setSelectedShopId(shop.shopId)}
                        className={`w-full text-left p-3.5 transition-all flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected ? 'bg-orange-50 border-l-4 border-orange-600' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-xs text-slate-900 truncate">{shop.businessName}</h5>
                            {shop.customDomain && (
                              <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1 rounded-xs">
                                Domain
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                            <span className="font-mono">{shop.shopId}</span>
                            <span>•</span>
                            <span>{shop.shopVersion || 'v1.0'}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            bCount > 0 ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {bCount} snap
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Details Panel */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6 h-[650px] overflow-y-auto">
                {currentSelectedShop ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-slate-900">{currentSelectedShop.businessName}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                            {currentSelectedShop.shopId}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Owner: {currentSelectedShop.vendorName} ({currentSelectedShop.phone}) • City: {currentSelectedShop.city}
                        </p>
                        {currentSelectedShop.customDomain && (
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                            <span>🌐 Connected Domain:</span>
                            <span className="font-mono">{currentSelectedShop.customDomain}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleExportSingleVendor(currentSelectedShop)}
                          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Export Vendor JSON
                        </button>

                        <button
                          type="button"
                          onClick={() => singleVendorInputRef.current?.click()}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Import / Restore JSON
                        </button>
                      </div>
                    </div>

                    {/* Snapshot Creation Box */}
                    <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                          <Plus className="w-4 h-4 text-sky-600" />
                          Create Instant Website Snapshot
                        </h4>
                        <span className="text-[10px] text-sky-700 font-medium">Safe isolated restore point</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={vendorSnapshotNote}
                          onChange={(e) => setVendorSnapshotNote(e.target.value)}
                          placeholder="Note (e.g. Before changing products, Diwali offer update...)"
                          className="flex-1 px-3 py-2 bg-white border border-sky-300 rounded-xl text-xs outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleCreateSingleVendorSnapshot(currentSelectedShop)}
                          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 shadow-xs"
                        >
                          Take Snapshot
                        </button>
                      </div>
                    </div>

                    {/* Snapshots List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-500" />
                        Saved Historical Snapshots ({currentSelectedShop.backups?.length || 0})
                      </h4>

                      {!currentSelectedShop.backups || currentSelectedShop.backups.length === 0 ? (
                        <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          <HardDrive className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-xs font-bold text-gray-600">No snapshots created yet for this store.</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Click "Take Snapshot" above to create an immutable rollback point.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {currentSelectedShop.backups.map((snap) => (
                            <div
                              key={snap.backupId}
                              className="p-3.5 bg-gray-50 hover:bg-gray-100/80 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-black text-slate-800">{snap.backupId}</span>
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-800">
                                    {snap.version}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{snap.description || 'Manual Snapshot'}</p>
                                <span className="text-[10px] text-gray-400 block mt-0.5">
                                  {new Date(snap.createdAt).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleRestoreVendorSnapshot(currentSelectedShop, snap)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  Restore Snapshot
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVendorSnapshot(currentSelectedShop, snap.backupId)}
                                  className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-400">Select a vendor from the left list.</p>
                )}
              </div>
            </div>
          )}

          {/* SCOPE 3: ALL VENDORS BUNDLE */}
          {vaultScope === 'ALL_VENDORS' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs space-y-6">
              <div className="max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                  ALL STORES REPOSITORY
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 font-['Outfit',sans-serif]">
                  Complete All-Vendors Bundle ({totalShops} Stores)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
                  Export every vendor shop profile, catalog products, connected custom domains, images, and visual settings
                  in a unified master package. You can also import and merge multiple shops seamlessly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-purple-50/60 border border-purple-200 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-purple-950 uppercase tracking-wider">
                      Export All Vendors Bundle
                    </h4>
                    <p className="text-xs text-purple-800 mt-1">
                      Download a single JSON package containing all {totalShops} store profiles, catalogs, and images.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportAllVendorsBundle}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download All Vendors JSON ({totalShops})
                  </button>
                </div>

                <div className="p-6 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                      Import & Restore Stores Bundle
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1">
                      Upload a previously exported bundle JSON to restore or add vendor websites to your platform.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => vendorsBundleInputRef.current?.click()}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Import Vendors JSON File
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCOPE 4: CUSTOM DOMAIN VENDORS VAULT */}
          {vaultScope === 'CUSTOM_DOMAINS' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs space-y-6">
              <div className="max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full">
                  DOMAINS PROTECTION VAULT
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 font-['Outfit',sans-serif]">
                  Custom Domain Vendors Backup ({customDomainShops.length} Stores)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
                  Dedicated safety export for stores that have connected independent custom domains (.com, .in, .store).
                  Safeguards custom domain verification status, DNS records, SSL status, and website configurations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-indigo-50/60 border border-indigo-200 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-indigo-950 uppercase tracking-wider">
                      Export Custom Domain Stores
                    </h4>
                    <p className="text-xs text-indigo-800 mt-1">
                      Exports all {customDomainShops.length} stores having an active custom domain in 1-click.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportCustomDomainVendors}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export Custom Domain Bundle ({customDomainShops.length})
                  </button>
                </div>

                <div className="p-6 bg-slate-50 border border-gray-200 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Import Custom Domain Stores
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Restore or merge domain-connected stores from a previous backup file.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => vendorsBundleInputRef.current?.click()}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Import Domain Backup JSON
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCOPE 5: FULL SAAS PLATFORM */}
          {vaultScope === 'SAAS' && (
            <div className="space-y-6">
              {/* Auto Backup Configuration Card */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full font-mono">
                      AUTO BACKUP ENGINE
                    </span>
                    <span className="text-xs text-slate-300">
                      Status: {autoConfig.enabled ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                  <h4 className="text-lg font-black font-['Outfit',sans-serif]">
                    Automated Disaster Recovery Backups
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Last automatic backup:{' '}
                    {autoConfig.lastBackupAt ? new Date(autoConfig.lastBackupAt).toLocaleString() : 'Never'} • Keeps up
                    to {autoConfig.keepMaxSnapshots} snapshots.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <select
                    value={autoConfig.frequency}
                    onChange={(e) => handleChangeAutoBackupFrequency(e.target.value as any)}
                    aria-label="Auto backup frequency schedule"
                    className="px-3 py-2 bg-white/10 text-white border border-white/20 rounded-xl text-xs font-bold"
                  >
                    <option value="DAILY" className="text-slate-900">Daily</option>
                    <option value="HOURLY_12" className="text-slate-900">Every 12 Hours</option>
                    <option value="ON_MAJOR_CHANGE" className="text-slate-900">On Major Change</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleToggleAutoBackup(!autoConfig.enabled)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      autoConfig.enabled
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    }`}
                  >
                    {autoConfig.enabled ? 'Pause Auto Backup' : 'Enable Auto Backup'}
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerAutoBackupNow}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Run Backup Now
                  </button>
                </div>
              </div>

              {/* Full SaaS Export / Import Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-xs space-y-4">
                  <div>
                    <h4 className="text-base font-black text-slate-900">Export Complete SaaS Platform</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Dumps full system state including all {totalShops} stores, popup engines, pricing packages, leads,
                      and admin settings into a single JSON file.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportFullSaasJson}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export Full SaaS JSON
                  </button>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-xs space-y-4">
                  <div>
                    <h4 className="text-base font-black text-slate-900">Import & Restore SaaS State</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a SaaS JSON backup file to restore or merge entire system databases with pre-restore preview.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => saasFileInputRef.current?.click()}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Import Full SaaS Backup
                  </button>
                </div>
              </div>

              {/* Historical SaaS Snapshots */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-600" />
                  Historical SaaS Snapshots ({state.saasBackups?.length || 0})
                </h4>

                {!state.saasBackups || state.saasBackups.length === 0 ? (
                  <p className="text-xs text-gray-500">No system snapshots created yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {state.saasBackups.map((snap) => (
                      <div
                        key={snap.backupId}
                        className="p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-slate-900">{snap.backupId}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {snap.version}
                            </span>
                            <span className="text-xs text-gray-500">• {snap.totalShops} stores</span>
                          </div>
                          <p className="text-xs text-gray-700 mt-1">{snap.description || 'System Snapshot'}</p>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {new Date(snap.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const confirmR = window.confirm(
                                `Restore entire platform state to snapshot ${snap.backupId} from ${new Date(
                                  snap.createdAt
                                ).toLocaleString()}?`
                              );
                              if (!confirmR) return;
                              onUpdateState({
                                ...state,
                                ...snap.data,
                                saasBackups: state.saasBackups, // Keep snapshot list
                              });
                              showToast('Platform restored to snapshot!');
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Restore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: SAFETY POLICY & IMMUNITY PROOF */}
      {/* ============================================================ */}
      {activeMainTab === 'SAFETY_POLICY' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-mono">
                SAFETY GUARANTEE SPECIFICATION
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2 font-['Outfit',sans-serif]">
                Existing Vendor Protection & Immunity Architecture
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-3xl leading-relaxed">
                Super Admin rules strictly mandate that platform enhancements (new themes, new categories, new visual
                widgets, or schema updates) never disrupt live merchants.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                  100% Immutable Version Lock
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Har vendor profile par version lock active rehta hai. Jab naye default settings ya sections aate hain,
                  existing vendors ke custom values overwrite nahi hote.
                </p>
              </div>

              <div className="p-5 bg-sky-50/60 border border-sky-200 rounded-2xl space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-sky-950">
                  Custom Domain & SSL Shield
                </h4>
                <p className="text-xs text-sky-800 leading-relaxed">
                  Vendor ke custom domain (e.g. www.myshop.com) ke DNS pointers aur SSL certificates platform update ke
                  dauran 100% stable aur live rehte hain.
                </p>
              </div>

              <div className="p-5 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-950">
                  Automated Pre-Migration Snapshots
                </h4>
                <p className="text-xs text-purple-800 leading-relaxed">
                  Kisi vendor ko new version par move karne se pehle system automatically pre-migration snapshot save karta
                  hai, jisse 1-click me rollback ho sake.
                </p>
              </div>
            </div>

            {/* Vendor Immunity Table */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                All Vendors Immunity Status ({state.shops.length} Stores)
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Vendor / Business</th>
                      <th className="p-3">Current Version</th>
                      <th className="p-3">Immunity Lock</th>
                      <th className="p-3">Custom Domain</th>
                      <th className="p-3">Products</th>
                      <th className="p-3">Safety Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                    {state.shops.map((shop) => (
                      <tr key={shop.shopId} className="hover:bg-gray-50">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{shop.businessName}</span>
                          <span className="font-mono text-[10px] text-gray-400">{shop.shopId}</span>
                        </td>
                        <td className="p-3 font-mono font-bold">{shop.shopVersion || 'v1.0'}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" /> Locked & Immune
                          </span>
                        </td>
                        <td className="p-3">
                          {shop.customDomain ? (
                            <span className="font-mono text-[10px] font-bold text-indigo-700">
                              {shop.customDomain}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="p-3">{shop.products?.length || 0} items</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Protected
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: PLATFORM VERSIONS & FUTURE-READY MODULE REGISTRY */}
      {/* ============================================================ */}
      {activeMainTab === 'VERSIONING' && (
        <div className="space-y-6">
          {/* Versions Overview Cards */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-3">
              Platform Releases & Version Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEFAULT_PLATFORM_VERSIONS.map((v) => {
                const count = versionDistribution[v.version] || 0;
                return (
                  <div
                    key={v.version}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black bg-slate-900 text-white px-2.5 py-1 rounded-md">
                          {v.version}
                        </span>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          {count} {count === 1 ? 'store' : 'stores'} active
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 mt-2">{v.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{v.description}</p>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Included Features:</span>
                      <ul className="space-y-1">
                        {v.features.map((feat, idx) => (
                          <li key={idx} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Extensible Future Modules Registry */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  Extensible Platform Verticals & Modules
                </h3>
                <p className="text-xs text-gray-500">
                  Category-specific modules (Doctor, Motor Garage, Salon, AI Voice) that can be installed for any vendor
                  bina existing stores ko disrupt kiye.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AVAILABLE_PLATFORM_MODULES.map((mod) => {
                const installedCount = state.shops.filter((s) => s.installedModules?.includes(mod.id)).length;
                return (
                  <div
                    key={mod.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-slate-700 font-mono">
                          {mod.versionIntroduced}
                        </span>
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                          {installedCount} stores
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mt-2 flex items-center gap-1.5">
                        {mod.category === 'AI' && <Mic className="w-4 h-4 text-purple-600" />}
                        {mod.id === 'module_doctor_clinic' && <Stethoscope className="w-4 h-4 text-emerald-600" />}
                        {mod.id === 'module_motor_garage' && <Wrench className="w-4 h-4 text-blue-600" />}
                        {mod.id === 'module_salon_spa' && <Sparkles className="w-4 h-4 text-pink-600" />}
                        {mod.id === 'module_restaurant' && <Utensils className="w-4 h-4 text-amber-600" />}
                        {mod.id === 'module_coaching' && <GraduationCap className="w-4 h-4 text-indigo-600" />}
                        {mod.id === 'module_modular_sections' && <Sliders className="w-4 h-4 text-orange-600" />}
                        {mod.id === 'module_custom_domains' && <Globe className="w-4 h-4 text-cyan-600" />}
                        <span>{mod.name}</span>
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{mod.description}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Capabilities:</span>
                      <ul className="text-[11px] text-slate-600 space-y-0.5 mt-1">
                        {mod.features.slice(0, 2).map((f, idx) => (
                          <li key={idx} className="truncate">• {f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: MIGRATION & ROLLBACK CENTER */}
      {/* ============================================================ */}
      {activeMainTab === 'MIGRATION' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-mono">
                CONTROLLED MANUAL UPGRADE WORKFLOW
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2 font-['Outfit',sans-serif]">
                Super Admin Vendor Migration & Rollback Center
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-3xl leading-relaxed">
                Existing vendors only upgrade when Super Admin manually approves. An automatic pre-migration backup is
                guaranteed before migration starts. You can revert any migration with 1-click rollback.
              </p>
            </div>

            {/* Quick Action: Select vendor to migrate */}
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-950">
                  Upgrade a Vendor to New Version
                </h4>
                <p className="text-xs text-purple-800 mt-0.5">
                  Select a vendor from the list below and click "Migrate to New Version" to begin the guided workflow.
                </p>
              </div>
            </div>

            {/* Historical Migrations Log & 1-Click Rollback */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                Historical Migration Audit Trail ({allMigrationRecords.length})
              </h4>

              {allMigrationRecords.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-600">No vendor migrations recorded yet.</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    All existing stores remain on their original version.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {allMigrationRecords.map(({ shop, record }) => {
                    const isRolledBack = record.note?.includes('ROLLED BACK');
                    return (
                      <div
                        key={record.id}
                        className="p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{shop.businessName}</span>
                            <span className="font-mono text-[10px] text-gray-400">({shop.shopId})</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 font-mono">
                              {record.fromVersion} → {record.toVersion}
                            </span>
                            {isRolledBack && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                ROLLED BACK
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {record.note || 'Super Admin approved version upgrade'}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1">
                            <span>Migrated: {new Date(record.migratedAt).toLocaleString()}</span>
                            <span>•</span>
                            <span>Backup Snapshot: {record.backupId}</span>
                            <span>•</span>
                            <span>Approved by: {record.appliedBy}</span>
                          </div>
                        </div>

                        {!isRolledBack && (
                          <button
                            type="button"
                            onClick={() => handleRollbackMigration(shop, record.id)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Rollback Migration
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: PRE-UPDATE SAFETY BACKUP */}
      {/* ============================================================ */}
      {isPreUpdateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200 space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-black">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Pre-Update Safety Backup</h3>
                <p className="text-xs text-gray-500">Full SaaS Platform + Individual Stores Snapshot</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Platform me koi bhi major code, theme, ya design update deploy karne se pehle ye snapshot create karein.
              System pure SaaS ka aur sabhi {totalShops} stores ka isolated rollback snapshot bana dega.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Update Description / Release Notes:
              </label>
              <textarea
                value={preUpdateDescription}
                onChange={(e) => setPreUpdateDescription(e.target.value)}
                rows={3}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsPreUpdateModalOpen(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePreUpdateSafetyBackup}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
              >
                Create Safety Backup Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: IMPORT PREVIEW & EXECUTION MODAL */}
      {/* ============================================================ */}
      {importTarget && importedDataPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Confirm Backup Import ({importTarget})
                  </h3>
                  <p className="text-xs text-gray-500">Review incoming data before updating platform</p>
                </div>
              </div>
            </div>

            {/* Preview details */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Target Type:</span>
                <span className="font-bold text-slate-900">{importTarget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Stores in File:</span>
                <span className="font-bold text-slate-900">
                  {importTarget === 'SAAS'
                    ? importedDataPreview.shops?.length || 0
                    : importedDataPreview.shops?.length || 0}
                </span>
              </div>
            </div>

            {/* Merge Mode Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Restoration Mode:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setImportMergeMode('MERGE')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    importMergeMode === 'MERGE'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-white border-gray-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-black">Safe Merge (Recommended)</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Updates existing shops & adds new ones without deleting other live stores.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMergeMode('REPLACE')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    importMergeMode === 'REPLACE'
                      ? 'bg-red-50 border-red-500 text-red-950 font-bold'
                      : 'bg-white border-gray-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-black">Full Replace</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Completely overwrites all platform data with this file.
                  </div>
                </button>
              </div>
            </div>

            {importError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setImportTarget(null);
                  setImportedDataPreview(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
              >
                Execute Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: GUIDED VENDOR MIGRATION MODAL */}
      {/* ============================================================ */}
      {migrationModalShop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-200 space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Migrate Store: {migrationModalShop.businessName}
                </h3>
                <p className="text-xs text-gray-500">
                  Current Version: {migrationModalShop.shopVersion || 'v1.0'}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black">Automated Pre-Migration Backup Mandate:</span>
                <p className="mt-0.5 text-[11px] text-emerald-800">
                  Migration apply hone se pehle system automatically is store ka complete backup snapshot le lega.
                  Existing products, images, text, and custom domain 100% safe rahenge.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Target Platform Version:
              </label>
              <select
                value={targetMigrationVersion}
                onChange={(e) => setTargetMigrationVersion(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="v1.1">v1.1 - Modular Sections & Custom Domains</option>
                <option value="v2.0">v2.0 - Next-Gen AI & Vertical Verticals</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Enable Specific Modules for this Store:
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                {AVAILABLE_PLATFORM_MODULES.map((mod) => {
                  const isChecked = selectedModulesForMigration.includes(mod.id);
                  return (
                    <label
                      key={mod.id}
                      className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center gap-2 ${
                        isChecked
                          ? 'bg-purple-50 border-purple-300 font-bold text-purple-900'
                          : 'bg-white border-gray-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedModulesForMigration((prev) =>
                            prev.includes(mod.id) ? prev.filter((id) => id !== mod.id) : [...prev, mod.id]
                          );
                        }}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="truncate">{mod.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Super Admin Note:
              </label>
              <input
                type="text"
                value={migrationAdminNote}
                onChange={(e) => setMigrationAdminNote(e.target.value)}
                placeholder="Reason for upgrade (e.g. Vendor requested AI Voice & Doctor module)"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
              />
            </div>

            <label className="flex items-center gap-2 p-3 bg-gray-100 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={migrationConfirmed}
                onChange={(e) => setMigrationConfirmed(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-xs font-bold text-slate-800">
                I approve this vendor migration and confirm pre-migration automated backup.
              </span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setMigrationModalShop(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteMigration}
                disabled={!migrationConfirmed}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
              >
                Execute Migration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

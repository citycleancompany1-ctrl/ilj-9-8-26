import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Database,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  Package,
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
} from 'lucide-react';
import { Shop, PlatformState, VendorWebsiteBackup, SaaSPlatformBackup } from '../../types';
import { formatDisplayDate } from '../../utils/mediaUpload';

interface AdminBackupsManagerProps {
  state: PlatformState;
  onUpdateState: (newState: PlatformState) => void;
}

export const AdminBackupsManager: React.FC<AdminBackupsManagerProps> = ({
  state,
  onUpdateState,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'VENDORS' | 'SAAS'>('VENDORS');
  const [vendorSearch, setVendorSearch] = useState<string>('');
  const [selectedShopId, setSelectedShopId] = useState<string>(
    state.shops && state.shops.length > 0 ? state.shops[0].shopId : ''
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // SaaS Import / Restore modals
  const [importedSaasPreview, setImportedSaasPreview] = useState<Partial<PlatformState> | null>(null);
  const [saasImportError, setSaasImportError] = useState<string | null>(null);
  const [saasSnapshotNote, setSaasSnapshotNote] = useState<string>('');
  const [showSaasSnapshotModal, setShowSaasSnapshotModal] = useState<boolean>(false);

  // Vendor restore confirmation modal
  const [vendorRestoreTarget, setVendorRestoreTarget] = useState<{
    shop: Shop;
    backup: VendorWebsiteBackup;
  } | null>(null);

  const saasFileInputRef = useRef<HTMLInputElement>(null);
  const vendorFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const selectedShop = state.shops.find((s) => s.shopId === selectedShopId) || state.shops[0];

  // 1. EXPORT COMPLETE SAAS BACKUP (.JSON)
  const handleExportSaasBackup = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const fullBackup: SaaSPlatformBackup = {
      backupId: `saas_bkp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      version: '1.0',
      description: `Full IndianLalaJi Platform SaaS Backup (${new Date().toLocaleDateString()})`,
      totalShops: state.shops.length,
      data: JSON.parse(JSON.stringify(state)),
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(fullBackup, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const fileName = `indianlalaji_full_saas_backup_${timestamp}.json`;
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(`📦 Complete SaaS Backup (${state.shops.length} vendors) exported successfully!`);
  };

  // 2. CREATE SAAS INSTANT SNAPSHOT
  const handleCreateSaasSnapshot = () => {
    const newSnapshot: SaaSPlatformBackup = {
      backupId: `saas_snap_${Date.now()}`,
      createdAt: new Date().toISOString(),
      version: '1.0',
      description: saasSnapshotNote.trim() || `Platform Snapshot (${new Date().toLocaleDateString()})`,
      totalShops: state.shops.length,
      data: JSON.parse(JSON.stringify(state)),
    };

    const existingBackups = state.saasBackups || [];
    const updatedState: PlatformState = {
      ...state,
      saasBackups: [newSnapshot, ...existingBackups],
    };

    onUpdateState(updatedState);
    setSaasSnapshotNote('');
    setShowSaasSnapshotModal(false);
    showToast(`✅ Platform SaaS snapshot "${newSnapshot.description}" saved!`);
  };

  // 3. TRIGGER SAAS IMPORT FILE SELECTOR
  const handleTriggerSaasFileSelect = () => {
    setSaasImportError(null);
    if (saasFileInputRef.current) {
      saasFileInputRef.current.value = '';
      saasFileInputRef.current.click();
    }
  };

  // 4. HANDLE SAAS FILE CHANGE
  const handleSaasFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaasImportError(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        let platformData: Partial<PlatformState> | null = null;
        if (parsed.data && Array.isArray(parsed.data.shops)) {
          platformData = parsed.data;
        } else if (Array.isArray(parsed.shops)) {
          platformData = parsed;
        } else {
          setSaasImportError('Invalid SaaS backup file! Must contain "shops" array.');
          return;
        }

        setImportedSaasPreview(platformData);
      } catch (err) {
        console.error('Failed to parse SaaS backup JSON:', err);
        setSaasImportError('Could not parse JSON. Please verify that this is an authentic IndianLalaJi backup.');
      }
    };

    reader.readAsText(file);
  };

  // 5. RESTORE COMPLETE SAAS STATE
  const handleConfirmSaasRestore = (mode: 'OVERWRITE' | 'MERGE') => {
    if (!importedSaasPreview) return;

    if (mode === 'OVERWRITE') {
      const restoredState: PlatformState = {
        ...state,
        ...importedSaasPreview,
        shops: importedSaasPreview.shops || state.shops,
      };
      onUpdateState(restoredState);
      showToast(`🎉 Full SaaS Platform State Restored (${restoredState.shops.length} vendors)!`);
    } else {
      // Merge missing shops
      const existingShopIds = new Set(state.shops.map((s) => s.shopId));
      const incomingShops = importedSaasPreview.shops || [];
      const newShopsToAdd = incomingShops.filter((s) => !existingShopIds.has(s.shopId));

      const mergedState: PlatformState = {
        ...state,
        shops: [...state.shops, ...newShopsToAdd],
      };
      onUpdateState(mergedState);
      showToast(`🎉 Merged ${newShopsToAdd.length} new vendors into existing database!`);
    }

    setImportedSaasPreview(null);
  };

  // 6. CREATE SNAPSHOT FOR ALL VENDORS IN 1 CLICK
  const handleSnapshotAllVendors = () => {
    const timestamp = new Date().toISOString();
    const updatedShops = state.shops.map((shop) => {
      const backupId = `bkp_auto_admin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newBackup: VendorWebsiteBackup = {
        backupId,
        shopId: shop.shopId,
        businessName: shop.businessName,
        createdAt: timestamp,
        version: '1.0',
        description: `Admin Mass Backup (${new Date().toLocaleDateString()})`,
        data: JSON.parse(JSON.stringify(shop)),
      };
      const existing = shop.backups || [];
      return {
        ...shop,
        backups: [newBackup, ...existing],
        updatedAt: timestamp,
      };
    });

    onUpdateState({ ...state, shops: updatedShops });
    showToast(`✅ Created isolated snapshot backups for all ${state.shops.length} vendors!`);
  };

  // 7. EXPORT SINGLE VENDOR JSON
  const handleExportVendorJson = (shop: Shop) => {
    const exportObject: VendorWebsiteBackup = {
      backupId: `export_${Date.now()}`,
      shopId: shop.shopId,
      businessName: shop.businessName,
      createdAt: new Date().toISOString(),
      version: '1.0',
      description: `Admin Export on ${new Date().toLocaleString()}`,
      data: JSON.parse(JSON.stringify(shop)),
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportObject, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const fileName = `${shop.shopId}_${shop.businessName.replace(/[^a-zA-Z0-9]/g, '_')}_backup.json`;
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(`📥 Exported backup for ${shop.businessName} (${shop.shopId})`);
  };

  // 8. CREATE VENDOR SNAPSHOT FROM ADMIN
  const handleCreateVendorSnapshot = (targetShop: Shop) => {
    const backupId = `bkp_admin_${Date.now()}`;
    const newBackup: VendorWebsiteBackup = {
      backupId,
      shopId: targetShop.shopId,
      businessName: targetShop.businessName,
      createdAt: new Date().toISOString(),
      version: '1.0',
      description: `Admin Snapshot (${new Date().toLocaleDateString()})`,
      data: JSON.parse(JSON.stringify(targetShop)),
    };

    const updatedShops = state.shops.map((s) => {
      if (s.shopId === targetShop.shopId) {
        return {
          ...s,
          backups: [newBackup, ...(s.backups || [])],
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    onUpdateState({ ...state, shops: updatedShops });
    showToast(`✅ Created backup snapshot for ${targetShop.businessName}!`);
  };

  // 9. RESTORE VENDOR FROM SNAPSHOT
  const handleConfirmVendorRestore = () => {
    if (!vendorRestoreTarget) return;
    const { shop, backup } = vendorRestoreTarget;

    const restoredData = backup.data;
    const mergedShop: Shop = {
      ...restoredData,
      id: shop.id,
      shopId: shop.shopId,
      vendorId: shop.vendorId,
      vendorEmail: shop.vendorEmail,
      vendorPassword: shop.vendorPassword,
      passwordHash: shop.passwordHash,
      backups: shop.backups,
      updatedAt: new Date().toISOString(),
    };

    const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? mergedShop : s));
    onUpdateState({ ...state, shops: updatedShops });
    setVendorRestoreTarget(null);
    showToast(`🎉 Restored ${shop.businessName} from snapshot (${backup.description})!`);
  };

  // Filter vendors by search
  const filteredShops = state.shops.filter(
    (s) =>
      s.businessName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      s.shopId.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      s.phone.includes(vendorSearch) ||
      (s.customDomain && s.customDomain.toLowerCase().includes(vendorSearch.toLowerCase()))
  );

  const totalSnapshotsAcrossAllShops = state.shops.reduce(
    (acc, s) => acc + (s.backups?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={saasFileInputRef}
        onChange={handleSaasFileChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-sky-500/50 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white rounded-2xl p-6 border border-sky-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-sky-400">
          <Database className="w-56 h-56" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-black uppercase tracking-wider mb-2">
              <HardDrive className="w-3.5 h-3.5 text-sky-400" />
              SaaS Disaster Recovery & Data Vault
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Platform Backups & Restore Engine
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Super Admin yahan se <strong>individual vendor websites</strong> ya <strong>complete SaaS platform</strong> ka backup export, snapshot create aur point-in-time restore kar sakte hain.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportSaasBackup}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              Export Full SaaS JSON
            </button>

            <button
              type="button"
              onClick={handleTriggerSaasFileSelect}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Upload className="w-4 h-4" />
              Import SaaS Backup
            </button>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Live Stores</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{state.shops.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Vendor Snapshots</span>
          <p className="text-2xl font-black text-sky-700 mt-1">{totalSnapshotsAcrossAllShops}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">SaaS Snapshots</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{state.saasBackups?.length || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Custom Domains</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">
            {state.shops.filter((s) => s.customDomain).length}
          </p>
        </div>
      </div>

      {/* SUB-TABS: VENDOR BACKUPS VS COMPLETE SAAS BACKUP */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('VENDORS')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'VENDORS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Store className="w-4 h-4" />
          Individual & All Vendor Backups ({state.shops.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('SAAS')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'SAAS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Server className="w-4 h-4" />
          Complete SaaS Platform Backup (Full System)
        </button>
      </div>

      {/* VIEW 1: INDIVIDUAL & ALL VENDOR WEBSITE BACKUPS */}
      {activeSubTab === 'VENDORS' && (
        <div className="space-y-6">
          {/* Quick Mass Actions Bar */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Mass Backup Operations
              </h4>
              <p className="text-[11px] text-gray-500">
                Sabhi vendors ke website data ka ek sath instant backup banayein ya download karein.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSnapshotAllVendors}
                className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Snapshot All Stores ({state.shops.length})
              </button>

              <button
                type="button"
                onClick={handleExportSaasBackup}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export All Stores Bundle
              </button>
            </div>
          </div>

          {/* Vendors Selector & Details Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Vendor List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
              <div className="p-3.5 border-b border-gray-100 bg-gray-50">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    placeholder="Search vendor, shop ID, domain..."
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
                        isSelected
                          ? 'bg-sky-50 border-l-4 border-sky-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-xs text-slate-900 truncate">
                            {shop.businessName}
                          </h5>
                          {shop.customDomain && (
                            <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1.5 rounded-xs">
                              Domain
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                          <span className="font-mono">{shop.shopId}</span>
                          <span>•</span>
                          <span>{shop.city || 'India'}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          bCount > 0
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {bCount} {bCount === 1 ? 'backup' : 'backups'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Vendor Backup Panel */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-5 h-[600px] overflow-y-auto">
              {selectedShop ? (
                <>
                  {/* Selected Shop Info Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-slate-900">
                          {selectedShop.businessName}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gray-100 text-slate-700">
                          {selectedShop.shopId}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Owner: {selectedShop.vendorName} ({selectedShop.phone}) • Category: {selectedShop.category}
                      </p>
                      {selectedShop.customDomain && (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                          <span>🌐 Connected Domain:</span>
                          <a
                            href={`https://${selectedShop.customDomain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {selectedShop.customDomain}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCreateVendorSnapshot(selectedShop)}
                        className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        New Snapshot
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportVendorJson(selectedShop)}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export JSON
                      </button>
                    </div>
                  </div>

                  {/* Quick stats for this vendor */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Products</span>
                      <p className="text-base font-black text-slate-900 mt-0.5">
                        {selectedShop.products?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Active Theme</span>
                      <p className="text-base font-black text-indigo-600 mt-0.5 truncate">
                        {selectedShop.themeId || 'Bharat Royal'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Saved Backups</span>
                      <p className="text-base font-black text-sky-600 mt-0.5">
                        {selectedShop.backups?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Saved Snapshots list for this vendor */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      Saved Website Snapshots ({selectedShop.backups?.length || 0})
                    </h4>

                    {(!selectedShop.backups || selectedShop.backups.length === 0) ? (
                      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-2">
                        <Database className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="text-xs font-bold text-slate-700">No snapshots saved for this store yet.</p>
                        <p className="text-[11px] text-gray-400">
                          Click "+ New Snapshot" above to create an instant cloud backup.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedShop.backups.map((backup, idx) => (
                          <div
                            key={backup.backupId || idx}
                            className="p-3.5 bg-gray-50 hover:bg-slate-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3 transition-colors"
                          >
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 truncate">
                                  {backup.description || `Snapshot #${idx + 1}`}
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded-sm">
                                  v{backup.version || '1.0'}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                                <span>{new Date(backup.createdAt).toLocaleString()}</span>
                                <span>•</span>
                                <span>{backup.data.products?.length || 0} products</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setVendorRestoreTarget({ shop: selectedShop, backup })
                                }
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                                title="Restore this store snapshot"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Restore
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleExportVendorJson(backup.data)
                                }
                                className="p-1.5 bg-white hover:bg-gray-100 text-slate-700 border border-gray-200 rounded-lg text-xs cursor-pointer"
                                title="Download JSON"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  Select a vendor to inspect backups.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COMPLETE SAAS PLATFORM BACKUP */}
      {activeSubTab === 'SAAS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Server className="w-5 h-5 text-sky-600" />
                  Complete SaaS State Export & Import
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ye feature pure platform ka full data (sab vendors, themes, pricing plans, popups, videos, leads aur settings) ek single comprehensive JSON file me export aur import karta hai.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowSaasSnapshotModal(true)}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Save SaaS Snapshot
                </button>

                <button
                  type="button"
                  onClick={handleExportSaasBackup}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  Download SaaS JSON
                </button>
              </div>
            </div>

            {/* Platform Contents Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Vendors & Stores</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{state.shops.length}</p>
                <span className="text-[10px] text-gray-400">All catalogs & settings</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Themes & Templates</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{state.themes?.length || 10}</p>
                <span className="text-[10px] text-gray-400">System + Custom</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Platform Leads</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">{state.platformLeads?.length || 0}</p>
                <span className="text-[10px] text-gray-400">Customer requests</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Customer Inquiries</span>
                <p className="text-2xl font-black text-indigo-600 mt-1">{state.inquiries?.length || 0}</p>
                <span className="text-[10px] text-gray-400">Store inquiries</span>
              </div>
            </div>

            {/* Saved SaaS Snapshots */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                Historical SaaS Platform Snapshots ({state.saasBackups?.length || 0})
              </h4>

              {(!state.saasBackups || state.saasBackups.length === 0) ? (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Server className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">No SaaS platform snapshots created yet.</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Click "Save SaaS Snapshot" to preserve the complete system state.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {state.saasBackups.map((snap, idx) => (
                    <div
                      key={snap.backupId || idx}
                      className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-xs text-slate-900">{snap.description}</h5>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full">
                            v{snap.version || '1.0'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-1">
                          <span>Date: {new Date(snap.createdAt).toLocaleString()}</span>
                          <span>•</span>
                          <span>Stores: {snap.totalShops || 0}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Kya aap SaaS Platform ko snapshot "${snap.description}" par restore karna chahte hain?`)) {
                              onUpdateState({ ...state, ...snap.data });
                              showToast(`🎉 SaaS Platform successfully restored from snapshot!`);
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restore SaaS
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                              JSON.stringify(snap, null, 2)
                            )}`;
                            const a = document.createElement('a');
                            a.href = jsonString;
                            a.download = `saas_snapshot_${snap.backupId}.json`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          }}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-lg text-xs cursor-pointer"
                          title="Download Snapshot JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE SAAS SNAPSHOT MODAL */}
      {showSaasSnapshotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-sky-600" />
                Save Platform SaaS Snapshot
              </h3>
              <button
                type="button"
                onClick={() => setShowSaasSnapshotModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Yeh snapshot pure SaaS platform ka complete state ({state.shops.length} vendors, themes, pricing, leads, settings) save karega.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Snapshot Label / Version Note
              </label>
              <input
                type="text"
                value={saasSnapshotNote}
                onChange={(e) => setSaasSnapshotNote(e.target.value)}
                placeholder="e.g. Monthly Platform Backup / Pre-Upgrade"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowSaasSnapshotModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSaasSnapshot}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Save Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAAS IMPORT CONFIRMATION & PREVIEW MODAL */}
      {importedSaasPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileJson className="w-5 h-5 text-emerald-600" />
                SaaS Backup File Verified
              </h3>
              <button
                type="button"
                onClick={() => setImportedSaasPreview(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">
              File read successful. Is backup file me nimnlikhit system elements shamil hain:
            </p>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Vendors & Stores in File:</span>
                <span className="font-bold text-slate-900">{importedSaasPreview.shops?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Themes in File:</span>
                <span className="font-bold text-amber-600">{importedSaasPreview.themes?.length || 10}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pricing Packages:</span>
                <span className="font-bold text-slate-900">{importedSaasPreview.pricingPackages?.length || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Platform Leads:</span>
                <span className="font-bold text-slate-900">{importedSaasPreview.platformLeads?.length || 0}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-800">Choose Restore Action:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleConfirmSaasRestore('OVERWRITE')}
                  className="p-3 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-xl text-left transition-all cursor-pointer"
                >
                  <p className="font-bold text-xs">Full Overwrite & Restore</p>
                  <p className="text-[10px] text-red-600 mt-0.5">
                    Replaces all current shops with the backup file data.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmSaasRestore('MERGE')}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-left transition-all cursor-pointer"
                >
                  <p className="font-bold text-xs">Safe Merge Missing Only</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">
                    Adds newly found stores without deleting existing data.
                  </p>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setImportedSaasPreview(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM VENDOR RESTORE MODAL */}
      {vendorRestoreTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Restore Vendor Store?</h3>
                <p className="text-xs text-gray-500">
                  {vendorRestoreTarget.shop.businessName} ({vendorRestoreTarget.shop.shopId})
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold">⚠️ Warning:</p>
              <p>
                Is vendor ka live store snapshot "{vendorRestoreTarget.backup.description}" se restore ho jayega ({vendorRestoreTarget.backup.data.products?.length || 0} products).
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setVendorRestoreTarget(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVendorRestore}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

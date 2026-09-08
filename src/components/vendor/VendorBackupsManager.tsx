import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
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
  Layers,
  Database,
  Sparkles,
} from 'lucide-react';
import { Shop, VendorWebsiteBackup } from '../../types';
import { formatDisplayDate } from '../../utils/mediaUpload';

interface VendorBackupsManagerProps {
  shop: Shop;
  onUpdateShop: (updated: Shop) => void;
  showToast: (msg: string) => void;
}

export const VendorBackupsManager: React.FC<VendorBackupsManagerProps> = ({
  shop,
  onUpdateShop,
  showToast,
}) => {
  const [snapshotLabel, setSnapshotLabel] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState<VendorWebsiteBackup | null>(null);
  const [importedBackupPreview, setImportedBackupPreview] = useState<VendorWebsiteBackup | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const backups: VendorWebsiteBackup[] = shop.backups || [];

  // 1. CREATE NEW SNAPSHOT BACKUP
  const handleCreateSnapshot = () => {
    const backupId = `bkp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newBackup: VendorWebsiteBackup = {
      backupId,
      shopId: shop.shopId,
      businessName: shop.businessName,
      createdAt: new Date().toISOString(),
      version: '1.0',
      description: snapshotLabel.trim() || `Manual Snapshot (${new Date().toLocaleDateString()})`,
      data: JSON.parse(JSON.stringify(shop)),
    };

    const updatedBackups = [newBackup, ...backups];
    const updatedShop: Shop = {
      ...shop,
      backups: updatedBackups,
      updatedAt: new Date().toISOString(),
    };

    onUpdateShop(updatedShop);
    setSnapshotLabel('');
    setShowCreateModal(false);
    showToast(`✅ Store snapshot "${newBackup.description}" create ho gaya!`);
  };

  // 2. EXPORT AS JSON DOWNLOAD
  const handleExportJson = (backupData?: Shop, customFileName?: string) => {
    const dataToExport = backupData || shop;
    const exportObject: VendorWebsiteBackup = {
      backupId: `export_${Date.now()}`,
      shopId: shop.shopId,
      businessName: shop.businessName,
      createdAt: new Date().toISOString(),
      version: '1.0',
      description: `Exported on ${new Date().toLocaleString()}`,
      data: JSON.parse(JSON.stringify(dataToExport)),
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportObject, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const fileName =
      customFileName ||
      `${shop.shopId}_backup_${new Date().toISOString().split('T')[0]}.json`;
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(`📥 Backup file "${fileName}" download ho gayi!`);
  };

  // 3. TRIGGER IMPORT FILE SELECTOR
  const handleTriggerFileSelect = () => {
    setImportError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // 4. PROCESS IMPORTED JSON FILE
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Validate structure: must either be a VendorWebsiteBackup or a raw Shop object
        let shopData: Shop | null = null;
        let backupInfo: VendorWebsiteBackup;

        if (parsed.data && parsed.data.shopId && parsed.data.businessName) {
          shopData = parsed.data;
          backupInfo = parsed;
        } else if (parsed.shopId && parsed.businessName) {
          shopData = parsed;
          backupInfo = {
            backupId: `imported_${Date.now()}`,
            shopId: parsed.shopId,
            businessName: parsed.businessName,
            createdAt: parsed.updatedAt || new Date().toISOString(),
            version: '1.0',
            description: `Imported Backup (${file.name})`,
            data: parsed,
          };
        } else {
          setImportError('Invalid backup file! File must contain valid IndianLalaJi shop data.');
          return;
        }

        setImportedBackupPreview(backupInfo);
      } catch (err) {
        console.error('Failed to parse backup JSON:', err);
        setImportError('Could not parse JSON file. Please ensure it is a valid backup file.');
      }
    };

    reader.readAsText(file);
  };

  // 5. RESTORE STORE FROM BACKUP (EITHER IMPORTED OR SNAPSHOT)
  const handleConfirmRestore = (backupToRestore: VendorWebsiteBackup) => {
    const restoredData = backupToRestore.data;

    // Retain backups list and credentials of the current shop so login is uninterrupted
    const mergedShop: Shop = {
      ...restoredData,
      id: shop.id,
      shopId: shop.shopId, // preserve vendor shopId
      vendorId: shop.vendorId,
      vendorEmail: shop.vendorEmail,
      vendorPassword: shop.vendorPassword,
      passwordHash: shop.passwordHash,
      backups: shop.backups, // preserve backup history
      updatedAt: new Date().toISOString(),
    };

    onUpdateShop(mergedShop);
    setSelectedBackupForRestore(null);
    setImportedBackupPreview(null);
    showToast(`🎉 Website data successfully restore ho gaya (${backupToRestore.description || 'Snapshot'})!`);
  };

  // 6. DELETE SNAPSHOT
  const handleDeleteSnapshot = (backupId: string) => {
    if (!window.confirm('Kya aap yeh snapshot backup delete karna chahte hain?')) return;

    const filtered = backups.filter((b) => b.backupId !== backupId);
    const updatedShop: Shop = {
      ...shop,
      backups: filtered,
      updatedAt: new Date().toISOString(),
    };

    onUpdateShop(updatedShop);
    showToast('🗑️ Backup snapshot delete ho gaya.');
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 border border-sky-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-sky-400">
          <Database className="w-52 h-52" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Isolated Website Backups & Cloud Protection
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Store Backups, Export & 1-Click Restore
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Aapke store ka complete data (products, prices, photo gallery, banners, themes aur settings) hamesha safe rahe. Kabhi bhi snapshot banayein, JSON file download karein ya pehle ke backup par 1-click me restore karein.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Snapshot
            </button>

            <button
              type="button"
              onClick={() => handleExportJson()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>

            <button
              type="button"
              onClick={handleTriggerFileSelect}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Import Backup
            </button>
          </div>
        </div>
      </div>

      {/* Import Error Notice */}
      {importError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs font-semibold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{importError}</span>
        </div>
      )}

      {/* Backup Statistics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Snapshots</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{backups.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Live Products</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{shop.products?.length || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Store Theme</span>
          <p className="text-base font-black text-indigo-600 mt-1 truncate">
            {shop.themeId || 'Bharat Royal'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Last Synced</span>
          <p className="text-xs font-bold text-slate-700 mt-2">
            {shop.updatedAt ? formatDisplayDate(shop.updatedAt) : 'Just Now'}
          </p>
        </div>
      </div>

      {/* Snapshot Backups List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              Saved Snapshot Backups ({backups.length})
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Yeh backups aapke store ke point-in-time state ko preserve karte hain. Kisi bhi backup par Restore daba kar data wapas laa sakte hain.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Snapshot
          </button>
        </div>

        {backups.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
              <Database className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Abhi tak koi snapshot backup create nahi kiya gaya</h4>
            <p className="text-xs max-w-md mx-auto text-gray-500">
              Upar diye gaye <strong>"Create Snapshot"</strong> button par click karke apne store ka pehla safe backup point banayein.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Create First Snapshot Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {backups.map((backup, idx) => {
              const bData = backup.data;
              return (
                <div
                  key={backup.backupId || idx}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">
                        {backup.description || `Backup Snapshot #${idx + 1}`}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded-full">
                        v{backup.version || '1.0'}
                      </span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Latest Snapshot
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {backup.createdAt ? new Date(backup.createdAt).toLocaleString() : 'Unknown Date'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        {bData.products?.length || 0} Products
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        Theme: {bData.themeId || 'Bharat Royal'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedBackupForRestore(backup)}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Restore this snapshot"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleExportJson(
                          bData,
                          `${shop.shopId}_snapshot_${backup.backupId}.json`
                        )
                      }
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      title="Download JSON file"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSnapshot(backup.backupId)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      title="Delete snapshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE SNAPSHOT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-600" />
                Create Store Snapshot
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Yeh snapshot aapke sabhi <strong>products ({shop.products?.length || 0})</strong>, images, sections config aur layout theme ka accurate point-in-time record save karega.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Snapshot Label / Description (Optional)
              </label>
              <input
                type="text"
                value={snapshotLabel}
                onChange={(e) => setSnapshotLabel(e.target.value)}
                placeholder="e.g. Before Price Update / Festival Catalog"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSnapshot}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Save Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESTORE MODAL (FROM SNAPSHOT) */}
      {selectedBackupForRestore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Restore Store from Snapshot?</h3>
                <p className="text-xs text-gray-500">
                  {selectedBackupForRestore.description}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold">⚠️ Dhyan Dein:</p>
              <p>
                Aapka current store data is snapshot ke data se replace ho jayega ({selectedBackupForRestore.data.products?.length || 0} products, sections aur theme restore honge). Aapke login credentials surakshit rahenge.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedBackupForRestore(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmRestore(selectedBackupForRestore)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Yes, Restore Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT PREVIEW & RESTORE MODAL */}
      {importedBackupPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileJson className="w-5 h-5 text-emerald-600" />
                Backup File Ready to Import
              </h3>
              <button
                type="button"
                onClick={() => setImportedBackupPreview(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">
              File ko successfully read kar liya gaya hai. Kripya details verify karein:
            </p>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Business Name:</span>
                <span className="font-bold text-slate-900">{importedBackupPreview.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shop ID:</span>
                <span className="font-mono font-bold text-slate-900">{importedBackupPreview.shopId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Products:</span>
                <span className="font-bold text-slate-900">{importedBackupPreview.data.products?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="font-bold text-slate-900">{importedBackupPreview.data.category || 'General'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Theme:</span>
                <span className="font-bold text-indigo-600">{importedBackupPreview.data.themeId || 'Bharat Royal'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Backup Date:</span>
                <span className="font-bold text-slate-700">
                  {importedBackupPreview.createdAt ? new Date(importedBackupPreview.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                "Restore Store Now" click karte hi aapke live store me yeh backup apply ho jayega.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setImportedBackupPreview(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmRestore(importedBackupPreview)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Restore Store Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

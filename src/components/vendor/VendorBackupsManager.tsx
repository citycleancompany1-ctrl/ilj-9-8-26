import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Settings,
  Image as ImageIcon,
  FolderTree,
  X,
  FileCheck
} from 'lucide-react';
import { Shop } from '../../types';

interface VendorBackupsManagerProps {
  shop: Shop;
  onUpdateShop: (updated: Shop) => void;
  showToast: (msg: string) => void;
}

interface ParsedBackupData {
  fileName: string;
  fileSize: string;
  businessName: string;
  shopId: string;
  productsCount: number;
  categoriesCount: number;
  themeId: string;
  backupDate: string;
  rawShopData: Shop;
}

export const VendorBackupsManager: React.FC<VendorBackupsManagerProps> = ({
  shop,
  onUpdateShop,
  showToast,
}) => {
  const [uploadedBackup, setUploadedBackup] = useState<ParsedBackupData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showConfirmRestoreModal, setShowConfirmRestoreModal] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to resolve categories count
  const getCategoriesCount = (targetShop: Partial<Shop>): number => {
    if (targetShop.customCategories && targetShop.customCategories.length > 0) {
      return targetShop.customCategories.length;
    }
    const catsFromProducts = new Set(
      targetShop.products?.map((p) => p.category).filter(Boolean)
    );
    return catsFromProducts.size || (targetShop as any).categories?.length || 0;
  };

  const currentCategoriesCount = getCategoriesCount(shop);

  // 1. EXPORT & DOWNLOAD COMPLETE STORE BACKUP
  const handleDownloadBackup = () => {
    try {
      // Create deep clone of complete shop data
      const completeData = JSON.parse(JSON.stringify(shop));

      const exportPayload = {
        platform: 'IndianLalaJi',
        version: '2.0',
        exportedAt: new Date().toISOString(),
        shopId: shop.shopId,
        businessName: shop.businessName,
        stats: {
          productsCount: shop.products?.length || 0,
          categoriesCount: currentCategoriesCount,
          galleryCount: (shop.galleryImages?.length || 0) + (shop.banners?.length || 0),
          themeId: shop.themeId || 'Bharat Royal',
        },
        data: completeData,
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(exportPayload, null, 2)
      )}`;

      const sanitizedShopName = (shop.businessName || 'store')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .slice(0, 25);
      const dateStamp = new Date().toISOString().slice(0, 10);
      const fileName = `indianlalaji_${sanitizedShopName}_${shop.shopId}_backup_${dateStamp}.json`;

      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', fileName);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast(`📥 Store backup file "${fileName}" successfully download ho gayi!`);
    } catch (err) {
      console.error('Failed to export backup:', err);
      showToast('❌ Backup download karne me error aaya. Kripya punah prayas karein.');
    }
  };

  // 2. TRIGGER FILE SELECTOR
  const handleTriggerFileSelect = () => {
    setImportError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Helper to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // 3. PARSE & VALIDATE UPLOADED BACKUP FILE
  const processBackupFile = (file: File) => {
    setImportError(null);

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setImportError('Kripya sirf valid .json format wali backup file upload karein.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Detect shop data either wrapped in `data` or raw shop object
        let shopData: Shop | null = null;
        let backupDate = new Date().toISOString();

        if (parsed.data && (parsed.data.shopId || parsed.data.businessName)) {
          shopData = parsed.data;
          backupDate = parsed.exportedAt || parsed.createdAt || backupDate;
        } else if (parsed.shopId || parsed.businessName) {
          shopData = parsed;
          backupDate = parsed.updatedAt || parsed.createdAt || backupDate;
        } else {
          setImportError('Amanay (Invalid) backup file! Is file me IndianLalaJi store ka valid data nahi mila.');
          return;
        }

        const parsedResult: ParsedBackupData = {
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          businessName: shopData.businessName || 'Dukaan Store',
          shopId: shopData.shopId || shop.shopId,
          productsCount: shopData.products?.length || 0,
          categoriesCount: getCategoriesCount(shopData),
          themeId: shopData.themeId || 'Bharat Royal',
          backupDate,
          rawShopData: shopData,
        };

        setUploadedBackup(parsedResult);
        showToast(`✅ Backup file "${file.name}" successfully upload aur verify ho gayi!`);
      } catch (err) {
        console.error('Error reading JSON file:', err);
        setImportError('JSON file ko read karne me samasya aayi. Kripya valid backup file check karein.');
      }
    };

    reader.onerror = () => {
      setImportError('File padhne me error aaya. Kripya punah koshish karein.');
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processBackupFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processBackupFile(file);
    }
  };

  // 4. CONFIRM AND RESTORE STORE BACKUP
  const handleExecuteRestore = () => {
    if (!uploadedBackup) return;

    setIsRestoring(true);

    try {
      const restored = uploadedBackup.rawShopData;

      // Safely merge restored data, preserving authentication credentials & shopId
      const mergedShop: Shop = {
        ...restored,
        id: shop.id,
        shopId: shop.shopId, // preserve current shop identity
        vendorId: shop.vendorId,
        vendorEmail: shop.vendorEmail,
        vendorPassword: shop.vendorPassword,
        passwordHash: shop.passwordHash,
        backups: shop.backups, // preserve internal history
        updatedAt: new Date().toISOString(),
      };

      onUpdateShop(mergedShop);
      setShowConfirmRestoreModal(false);
      setIsRestoring(false);
      showToast(`🎉 Store backup successfully restore ho gaya! Sabhi products, categories aur settings update ho gaye hain.`);
    } catch (err) {
      console.error('Error restoring backup:', err);
      setIsRestoring(false);
      showToast('❌ Backup restore karne me error aaya. Kripya dobara prayas karein.');
    }
  };

  const handleClearUploadedBackup = () => {
    setUploadedBackup(null);
    setImportError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>Store Data Backup & 1-Click Restore</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            स्टोर बैकअप एवं रीस्टोर (Backup & Restore)
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            Apni dukaan ka complete offline backup download karein aur zaroorat padne par backup file upload karke 1-click me pura store restore karein. Aapka sara data bilkul surakshit rahega.
          </p>

          {/* Current Store Summary Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-gray-700 font-medium">
            <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              <span className="text-gray-400">Store:</span>
              <strong className="text-slate-900">{shop.businessName}</strong>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              <Package className="w-3.5 h-3.5 text-orange-600" />
              <strong className="text-slate-900">{shop.products?.length || 0}</strong>
              <span className="text-gray-500">Products</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              <FolderTree className="w-3.5 h-3.5 text-indigo-600" />
              <strong className="text-slate-900">{currentCategoriesCount}</strong>
              <span className="text-gray-500">Categories</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <strong className="text-slate-900">{shop.themeId || 'Bharat Royal'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Grid containing Export Backup & Import Backup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ============================================================ */}
        {/* 1. EXPORT BACKUP → DOWNLOAD BACKUP */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                  STEP 1
                </span>
                <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                  Export Backup → Download Backup
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Apne complete store ka offline backup JSON file me download karein. Isme products, categories, photos, banners, theme styling, 16 website sections, custom sections aur business settings shamil rahenge.
            </p>

            {/* Checklist of what's included */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2.5 text-xs text-gray-700">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 pb-1 border-b border-gray-200">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Backup me shamil features:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{shop.products?.length || 0} Products & Prices</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{currentCategoriesCount} Categories</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Theme: {shop.themeId || 'Royal'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Photos & Banners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>16 Website Sections</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>WhatsApp & Settings</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              id="export-backup-download-btn"
              type="button"
              onClick={handleDownloadBackup}
              className="w-full py-3.5 px-5 bg-slate-900 hover:bg-black active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Download Backup File (.JSON)</span>
            </button>
            <p className="text-[11px] text-gray-500 text-center mt-2">
              File aapke computer/mobile ke Downloads folder me save hogi.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. IMPORT BACKUP → UPLOAD BACKUP */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  STEP 2
                </span>
                <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                  Import Backup → Upload Backup
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Apni pehle se download ki hui IndianLalaJi backup file (.json) yahan upload karein. File upload hote hi details verify ho jayengi.
            </p>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleTriggerFileSelect}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-gray-300 hover:border-emerald-500 hover:bg-gray-50/80'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                Click karke Backup JSON File Chunein
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ya file yahan Drag & Drop karein (.json format only)
              </p>
            </div>

            {/* Import Error Message */}
            {importError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <span>{importError}</span>
              </div>
            )}
          </div>

          <div>
            <button
              id="import-backup-upload-btn"
              type="button"
              onClick={handleTriggerFileSelect}
              className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Backup File</span>
            </button>
            <p className="text-[11px] text-gray-500 text-center mt-2">
              File upload karne ke baad neeche verify karein aur Restore karein.
            </p>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. RESTORE BACKUP (APPEARS WHEN FILE IS UPLOADED & VERIFIED) */}
      {/* ============================================================ */}
      {uploadedBackup && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 sm:p-8 shadow-lg space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>STEP 3 • Backup File Ready to Restore</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  3. Restore Backup (स्टोर रीस्टोर करें)
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearUploadedBackup}
              className="text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-red-50 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove / Doosri File Chunein</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Aapki backup file safaltapoorvak read kar li gayi hai. Kripya details check karein aur neeche <strong>"Restore Backup"</strong> button par click karke store me data apply karein:
          </p>

          {/* Backup Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-gray-500 block">Uploaded File:</span>
              <span className="font-bold text-slate-900 block truncate" title={uploadedBackup.fileName}>
                {uploadedBackup.fileName}
              </span>
              <span className="text-[10px] text-gray-400">Size: {uploadedBackup.fileSize}</span>
            </div>

            <div className="space-y-1">
              <span className="text-gray-500 block">Store Name:</span>
              <span className="font-bold text-slate-900 block truncate">
                {uploadedBackup.businessName}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">ID: {uploadedBackup.shopId}</span>
            </div>

            <div className="space-y-1">
              <span className="text-gray-500 block">Products to Restore:</span>
              <span className="text-base font-black text-emerald-700 block">
                {uploadedBackup.productsCount} Products
              </span>
              <span className="text-[10px] text-gray-400">{uploadedBackup.categoriesCount} Categories</span>
            </div>

            <div className="space-y-1">
              <span className="text-gray-500 block">Theme & Layout:</span>
              <span className="font-bold text-indigo-700 block truncate">
                {uploadedBackup.themeId}
              </span>
              <span className="text-[10px] text-gray-400">16 Sections Config</span>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold">सुरक्षा सूचना (Safety Information):</span>
              <p>
                Restore karne par aapke live store ke vartamaan products, categories, theme aur settings is backup file se replace ho jayenge. Aapke vendor login credentials aur store URL surakshit rahenge.
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              Restore se pehle confirmation popup aayega.
            </div>

            <button
              id="trigger-restore-confirm-btn"
              type="button"
              onClick={() => setShowConfirmRestoreModal(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore Backup Now (रीस्टोर करें)</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CONFIRMATION MODAL BEFORE RESTORE */}
      {/* ============================================================ */}
      {showConfirmRestoreModal && uploadedBackup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  Kya aap store restore karna chahte hain?
                </h3>
                <p className="text-xs text-gray-500">
                  Confirm Store Backup Restoration
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠️ Dhyan Dein (Please Note):</span>
              </div>
              <p className="leading-relaxed">
                Yeh action aapke live store ke current data ko is backup file ke data se replace kar dega:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-amber-950 font-medium">
                <li><strong>{uploadedBackup.productsCount} Products</strong> restore honge</li>
                <li><strong>{uploadedBackup.categoriesCount} Categories</strong> restore hongi</li>
                <li>Theme <strong>"{uploadedBackup.themeId}"</strong> aur website sections restore honge</li>
                <li>Aapke login credentials bilkul surakshit rahenge</li>
              </ul>
            </div>

            {/* Backup Details Box */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Backup File:</span>
                <span className="font-bold text-slate-900 truncate max-w-[240px]">{uploadedBackup.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Store Name in Backup:</span>
                <span className="font-bold text-slate-900">{uploadedBackup.businessName}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                id="cancel-restore-modal-btn"
                type="button"
                onClick={() => setShowConfirmRestoreModal(false)}
                disabled={isRestoring}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Nahi, Cancel Karein
              </button>

              <button
                id="confirm-restore-modal-btn"
                type="button"
                onClick={handleExecuteRestore}
                disabled={isRestoring}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isRestoring ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Restoring Store...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Haan, Backup Restore Karein</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Informational Note at Bottom */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <FileJson className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 block">Offline Backup File Format:</strong>
            <span className="text-gray-500">
              Backup standard .json format me hota hai jise aap kisi bhi samay apne system me safe rakh sakte hain.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadBackup}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 underline underline-offset-2 shrink-0 cursor-pointer"
        >
          Fresh Backup Download Karein →
        </button>
      </div>

    </div>
  );
};

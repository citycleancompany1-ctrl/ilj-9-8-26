import React, { useState } from 'react';
import { 
  Download, 
  Database, 
  FileSpreadsheet, 
  FileText, 
  Users, 
  Store, 
  Layers, 
  Search, 
  Check, 
  Copy, 
  Printer, 
  Globe, 
  PhoneCall, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Tag,
  ChevronRight
} from 'lucide-react';
import { PlatformState, Shop } from '../../types';
import { 
  exportPurePortalCompleteBackup, 
  exportPurePortalSummaryCSV, 
  exportAllVendorsDirectoryCSV, 
  exportAllProductsMasterCSV, 
  exportAllShopsJSON, 
  exportPlatformLeadsCSV, 
  exportSpecificVendorDataJSON, 
  exportSpecificVendorProductsCSV, 
  exportSpecificVendorInquiriesCSV, 
  generateSpecificVendorPrintableSummary,
  triggerFileDownload
} from '../../utils/exportUtils';
import { calculateDaysRemaining, formatDisplayDate, getOneYearExpiryDate } from '../../utils/mediaUpload';

interface DataExportManagerProps {
  state: PlatformState;
  onNavigateToShop?: (shopId: string) => void;
}

export const DataExportManager: React.FC<DataExportManagerProps> = ({
  state,
  onNavigateToShop
}) => {
  const [selectedShopId, setSelectedShopId] = useState<string>(state.shops[0]?.shopId || '');
  const [vendorSearchQuery, setVendorSearchQuery] = useState<string>('');
  const [copiedShopJson, setCopiedShopJson] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const totalShops = state.shops.length;
  const publishedShops = state.shops.filter((s) => s.status === 'PUBLISHED').length;
  const totalProducts = state.shops.reduce((sum, s) => sum + (s.products?.length || 0), 0);
  const totalViews = state.shops.reduce((sum, s) => sum + (s.viewsCount || 0), 0);
  const totalLeads = state.platformLeads?.length || 0;

  // Selected specific vendor
  const selectedShop = state.shops.find((s) => s.shopId === selectedShopId) || state.shops[0] || null;

  // Filtered shops list for quick selection
  const filteredShops = state.shops.filter((s) => {
    const q = vendorSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.businessName.toLowerCase().includes(q) ||
      s.shopId.toLowerCase().includes(q) ||
      s.vendorName.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-slideUp">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2.5 py-0.5 rounded-full font-mono">
              MASTER DATA ENGINE
            </span>
            <span className="text-xs text-slate-300">
              Complete Data Extraction & Offline Backups
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-['Outfit',sans-serif]">
            Portal & Vendor Data Export Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Super Admin master controls: Pure portal ka complete backup, sabhi vendors aur unke products ki master spreadsheet, ya kisi bhi specific dukan ka full data ek click me download karein.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-3 rounded-xl border border-white/10 shrink-0 text-center">
          <div className="px-3 py-1">
            <div className="text-xl font-black text-orange-400 font-['Outfit',sans-serif]">{totalShops}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">Total Shops</div>
          </div>
          <div className="px-3 py-1 border-l border-white/10">
            <div className="text-xl font-black text-emerald-400 font-['Outfit',sans-serif]">{publishedShops}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">Live Active</div>
          </div>
          <div className="px-3 py-1 border-l border-white/10">
            <div className="text-xl font-black text-amber-400 font-['Outfit',sans-serif]">{totalProducts}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">Catalog Items</div>
          </div>
          <div className="px-3 py-1 border-l border-white/10">
            <div className="text-xl font-black text-cyan-400 font-['Outfit',sans-serif]">{totalLeads}</div>
            <div className="text-[10px] text-slate-300 uppercase font-bold">Total Leads</div>
          </div>
        </div>
      </div>

      {/* 3 DISTINCT DATA EXTRACTION MODULES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ============================================================ */}
        {/* MODULE 1: PURE PORTAL MASTER DATA */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-orange-50 border-b border-orange-100 p-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black shadow-xs">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-200 text-orange-900 px-2 py-0.5 rounded font-mono">
                  MODULE 1
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mt-3 font-['Outfit',sans-serif]">
                Pure Portal Ka Data
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Poore IndianLalaJi platform ka complete system backup, global settings, leads aur platform summary.
              </p>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Button 1: Complete Portal JSON */}
              <div className="bg-orange-50/40 hover:bg-orange-50 border border-orange-200 rounded-xl p-3.5 transition-all">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-orange-600" />
                    <span>Pure Portal Complete Backup</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-orange-800 bg-orange-100 px-1.5 py-0.2 rounded">
                    .JSON
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                  Poori website, sabhi {totalShops} dukaanein, popups, packages, tutorial videos, platform leads aur settings ka complete snapshot.
                </p>
                <button
                  onClick={() => {
                    exportPurePortalCompleteBackup(state);
                    showToast('Pure Portal Complete Backup (.json) download shuru ho gaya!');
                  }}
                  className="w-full py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Complete Portal JSON</span>
                </button>
              </div>

              {/* Button 2: Portal Summary CSV */}
              <div className="bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl p-3.5 transition-all">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-700" />
                    <span>Portal Master Summary Sheet</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-gray-200 px-1.5 py-0.2 rounded">
                    .CSV
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                  Total vendors, active status, category distribution, total website hits aur platform parameters ki executive summary.
                </p>
                <button
                  onClick={() => {
                    exportPurePortalSummaryCSV(state);
                    showToast('Portal Master Summary Sheet (.csv) download ho gayi!');
                  }}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Summary CSV (Excel)</span>
                </button>
              </div>

              {/* Button 3: Platform Leads CSV */}
              <div className="bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl p-3.5 transition-all">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-700" />
                    <span>All Platform Inquiries & Leads</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-gray-200 px-1.5 py-0.2 rounded">
                    {totalLeads} LEADS
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                  Landing page par aaye contact inquiries, interested categories aur phone numbers ka master lead list.
                </p>
                <button
                  onClick={() => {
                    exportPlatformLeadsCSV(state.platformLeads || []);
                    showToast('Platform Leads & Inquiries CSV download ho gayi!');
                  }}
                  className="w-full py-2 px-3 bg-white hover:bg-gray-100 text-slate-800 border border-gray-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Platform Leads ({totalLeads})</span>
                </button>
              </div>

            </div>
          </div>

          <div className="p-4 bg-orange-50/50 border-t border-orange-100 text-[11px] text-orange-900 font-medium">
            💡 <strong>Offline Safety:</strong> Portal JSON se future me poora platform restore kiya ja sakta hai.
          </div>
        </div>

        {/* ============================================================ */}
        {/* MODULE 2: ALL VENDOR SHOPS DATA */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-emerald-50 border-b border-emerald-100 p-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono">
                  MODULE 2
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mt-3 font-['Outfit',sans-serif]">
                All Vendor Shop Ka Data
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Sabhi registered {totalShops} dukano ki master directory aur unke saare {totalProducts} products ka aggregated catalog.
              </p>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Button 1: All Vendors Directory CSV */}
              <div className="bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 transition-all">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>All Vendors Directory (CSV / Excel)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                    {totalShops} SHOPS
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                  Shop ID, Business Name, Owner, Phone, WhatsApp, Category, City, 1-Yr Expiry, Days Left, Total Products, Custom Domain, UPI ID.
                </p>
                <button
                  onClick={() => {
                    exportAllVendorsDirectoryCSV(state.shops);
                    showToast(`All Vendors Directory CSV (${totalShops} shops) download ho gayi!`);
                  }}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All Vendors Directory (CSV)</span>
                </button>
              </div>

              {/* Button 2: Master Products Catalogue CSV */}
              <div className="bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl p-3.5 transition-all">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-700" />
                    <span>All Products & Services Master Catalog</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-gray-200 px-1.5 py-0.2 rounded">
                    {totalProducts} ITEMS
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                  Poore portal ke sabhi dukano ke har ek item ka Itemized Price, MRP, Discount, Unit, Stock status, Category aur Image URL.
                </p>
                <button
                  onClick={() => {
                    exportAllProductsMasterCSV(state.shops);
                    showToast(`All Products Master Catalogue (${totalProducts} items) download ho gayi!`);
                  }}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All Products Catalog ({totalProducts})</span>
                </button>
              </div>

              {/* Button 3: All Shops Bulk JSON */}
              <div className="bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl p-3.5 transition-all">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-slate-700" />
                    <span>All Shops Structured Data (Bulk JSON)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-gray-200 px-1.5 py-0.2 rounded">
                    RAW JSON
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                  Developer & database integration ke liye sabhi dukano ki raw JSON array file.
                </p>
                <button
                  onClick={() => {
                    exportAllShopsJSON(state.shops);
                    showToast(`All Shops JSON (${totalShops} shops) download ho gayi!`);
                  }}
                  className="w-full py-2 px-3 bg-white hover:bg-gray-100 text-slate-800 border border-gray-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All Shops JSON</span>
                </button>
              </div>

            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border-t border-emerald-100 text-[11px] text-emerald-900 font-medium">
            📊 <strong>Excel Ready:</strong> UTF-8 BOM encoding ke sath export hota hai taaki Hindi text cleanly display ho.
          </div>
        </div>

        {/* ============================================================ */}
        {/* MODULE 3: SPECIFIC VENDOR KA DATA */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-blue-50 border-b border-blue-100 p-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
                  <Tag className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-mono">
                  MODULE 3
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mt-3 font-['Outfit',sans-serif]">
                Specific Vendor Ka Data
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Kisi bhi specific vendor ko select karein aur unka store backup, catalogue CSV ya printable dossier lein.
              </p>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Vendor Selector Dropdown & Filter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Select Specific Vendor:
                </label>
                <div className="relative">
                  <select
                    value={selectedShop?.shopId || ''}
                    onChange={(e) => setSelectedShopId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  >
                    {state.shops.map((s) => (
                      <option key={s.shopId} value={s.shopId}>
                        {s.shopId} - {s.businessName} ({s.vendorName} - {s.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Vendor Quick Card */}
              {selectedShop && (
                <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedShop.logoUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'} 
                      alt={selectedShop.businessName}
                      className="w-10 h-10 rounded-lg object-cover border border-blue-200 shrink-0 bg-white"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded">
                          {selectedShop.shopId}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          {selectedShop.status}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs truncate mt-0.5">
                        {selectedShop.businessName}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        Owner: {selectedShop.vendorName} | Ph: +91 {selectedShop.phone}
                      </div>
                    </div>
                  </div>

                  {/* Quick stats on selected vendor */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1 border-t border-blue-100">
                    <div className="bg-white p-1 rounded border border-blue-100">
                      <div className="font-bold text-slate-800">{selectedShop.products?.length || 0}</div>
                      <div className="text-gray-400">Products</div>
                    </div>
                    <div className="bg-white p-1 rounded border border-blue-100">
                      <div className="font-bold text-slate-800">{selectedShop.viewsCount || 0}</div>
                      <div className="text-gray-400">Hits</div>
                    </div>
                    <div className="bg-white p-1 rounded border border-blue-100">
                      <div className="font-bold text-emerald-700">
                        {(() => {
                          const activeDateVal = selectedShop.activeDate || selectedShop.createdAt?.split('T')[0] || '';
                          const expiryDateVal = selectedShop.expiryDate || (activeDateVal ? getOneYearExpiryDate(activeDateVal) : '');
                          return expiryDateVal ? `${calculateDaysRemaining(expiryDateVal)}d` : '365d';
                        })()}
                      </div>
                      <div className="text-gray-400">Validity</div>
                    </div>
                  </div>

                  {/* Direct Action Buttons for Selected Vendor */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        exportSpecificVendorDataJSON(selectedShop);
                        showToast(`${selectedShop.shopId} complete backup (.json) download ho gaya!`);
                      }}
                      className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Shop Complete Backup (JSON)</span>
                    </button>

                    <button
                      onClick={() => {
                        exportSpecificVendorProductsCSV(selectedShop);
                        showToast(`${selectedShop.shopId} products catalog (.csv) download ho gaya!`);
                      }}
                      className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Download Products List CSV ({selectedShop.products?.length || 0} Items)</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const textContent = generateSpecificVendorPrintableSummary(selectedShop);
                          const dateStr = new Date().toISOString().slice(0, 10);
                          triggerFileDownload(textContent, `vendor_${selectedShop.shopId}_official_dossier_${dateStr}.txt`, 'text/plain;charset=utf-8;');
                          showToast(`${selectedShop.shopId} official dossier download ho gaya!`);
                        }}
                        className="flex-1 py-1.5 px-2 bg-white hover:bg-gray-100 text-slate-800 border border-gray-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Download Dossier as Text"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span>Dossier .TXT</span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(selectedShop, null, 2));
                          setCopiedShopJson(true);
                          showToast(`${selectedShop.shopId} raw JSON copied!`);
                          setTimeout(() => setCopiedShopJson(false), 2500);
                        }}
                        className="py-1.5 px-3 bg-white hover:bg-gray-100 text-slate-800 border border-gray-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy Raw JSON"
                      >
                        {copiedShopJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedShopJson ? 'Copied' : 'Copy JSON'}</span>
                      </button>

                      {onNavigateToShop && (
                        <button
                          onClick={() => onNavigateToShop(selectedShop.shopId)}
                          className="p-2 bg-white hover:bg-gray-100 text-slate-700 border border-gray-300 rounded-lg transition-colors cursor-pointer"
                          title="Open Storefront Preview"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

          <div className="p-4 bg-blue-50/50 border-t border-blue-100 text-[11px] text-blue-900 font-medium">
            🎯 <strong>Vendor Specific:</strong> Aap Vendors table me har vendor ke saamne bane direct Download button se bhi data nikal sakte hain.
          </div>
        </div>

      </div>

      {/* QUICK TABLE: ALL VENDORS WITH INSTANT DOWNLOAD BUTTONS */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight font-['Outfit',sans-serif] flex items-center gap-2">
              <Store className="w-4 h-4 text-orange-600" />
              <span>Direct Specific Vendor Data Export Directory</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Kisi bhi dukan ke aage bane direct download button se unka data instant extract karein.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search vendor by name, phone, SHP ID..."
              value={vendorSearchQuery}
              onChange={(e) => setVendorSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-gray-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Shop ID & Business</th>
                <th className="py-3 px-4">Owner & Phone</th>
                <th className="py-3 px-4">Category & Location</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">1-Yr Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Direct Data Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredShops.slice(0, 15).map((shop) => {
                const activeDateVal = shop.activeDate || shop.createdAt?.split('T')[0] || '';
                const expiryDateVal = shop.expiryDate || (activeDateVal ? getOneYearExpiryDate(activeDateVal) : '');
                const daysLeft = expiryDateVal ? calculateDaysRemaining(expiryDateVal) : 0;

                return (
                  <tr key={shop.shopId} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={shop.logoUrl} 
                          alt={shop.businessName}
                          className="w-8 h-8 rounded-lg object-cover border border-gray-200 bg-gray-50 shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-slate-900">{shop.businessName}</div>
                          <div className="font-mono text-[10px] text-orange-600 font-bold">{shop.shopId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{shop.vendorName}</div>
                      <div className="text-[10px] text-gray-500 font-mono">+91 {shop.phone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800">{shop.category}</div>
                      <div className="text-[10px] text-gray-400">{shop.city}, {shop.state}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 bg-gray-100 px-2 py-0.5 rounded font-mono">
                        {shop.products?.length || 0}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-[10px] text-slate-700">{formatDisplayDate(expiryDateVal)}</div>
                      <div className={`text-[10px] font-bold ${daysLeft <= 30 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {daysLeft} days left
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        shop.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {shop.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            exportSpecificVendorDataJSON(shop);
                            showToast(`${shop.shopId} JSON backup download ho gaya!`);
                          }}
                          className="px-2 py-1 bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Download Shop JSON"
                        >
                          <Database className="w-3 h-3" />
                          <span>JSON</span>
                        </button>

                        <button
                          onClick={() => {
                            exportSpecificVendorProductsCSV(shop);
                            showToast(`${shop.shopId} products catalogue CSV download ho gaya!`);
                          }}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Download Products CSV"
                        >
                          <FileSpreadsheet className="w-3 h-3" />
                          <span>Products CSV</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedShopId(shop.shopId);
                            const textContent = generateSpecificVendorPrintableSummary(shop);
                            const printWindow = window.open('', '_blank');
                            if (printWindow) {
                              printWindow.document.write(`
                                <html>
                                  <head><title>${shop.shopId} - Dossier</title></head>
                                  <body style="font-family: monospace; padding: 24px; font-size: 13px; line-height: 1.6;">
                                    <pre>${textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                                    <script>window.onload = function() { window.print(); };</script>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                            }
                          }}
                          className="p-1 bg-gray-50 hover:bg-gray-200 text-slate-700 border border-gray-200 rounded transition-colors cursor-pointer"
                          title="Print Vendor Dossier"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredShops.length > 15 && (
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500 font-medium">
            Showing top 15 results out of {filteredShops.length} stores. Sabhi {totalShops} stores ek sath download karne ke liye Module 2 ka All Vendors Directory CSV use karein.
          </div>
        )}
      </div>

    </div>
  );
};

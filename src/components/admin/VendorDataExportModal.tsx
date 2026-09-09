import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Database, 
  Check, 
  Copy, 
  ExternalLink, 
  Store, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Calendar, 
  Layers, 
  Tag, 
  Printer
} from 'lucide-react';
import { Shop, ShopInquiry } from '../../types';
import { 
  exportSpecificVendorDataJSON, 
  exportSpecificVendorProductsCSV, 
  exportSpecificVendorInquiriesCSV, 
  generateSpecificVendorPrintableSummary,
  triggerFileDownload
} from '../../utils/exportUtils';
import { calculateDaysRemaining, formatDisplayDate, getOneYearExpiryDate } from '../../utils/mediaUpload';

interface VendorDataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop | null;
  inquiries?: ShopInquiry[];
  onNavigateToShop?: (shopId: string) => void;
}

export const VendorDataExportModal: React.FC<VendorDataExportModalProps> = ({
  isOpen,
  onClose,
  shop,
  inquiries = [],
  onNavigateToShop
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !shop) return null;

  const activeDateVal = shop.activeDate || shop.createdAt?.split('T')[0] || '';
  const expiryDateVal = shop.expiryDate || (activeDateVal ? getOneYearExpiryDate(activeDateVal) : '');
  const daysLeft = expiryDateVal ? calculateDaysRemaining(expiryDateVal) : 0;
  const isExpired = daysLeft <= 0;

  const showSuccessNotice = (msg: string) => {
    setDownloadSuccessMessage(msg);
    setTimeout(() => setDownloadSuccessMessage(null), 3500);
  };

  const handleDownloadJSON = () => {
    exportSpecificVendorDataJSON(shop);
    showSuccessNotice(`Shop backup file '${shop.shopId}_full_data.json' download ho gayi!`);
  };

  const handleDownloadProductsCSV = () => {
    exportSpecificVendorProductsCSV(shop);
    showSuccessNotice(`Products catalogue '${shop.shopId}_products.csv' download ho gayi!`);
  };

  const handleDownloadInquiriesCSV = () => {
    exportSpecificVendorInquiriesCSV(shop, inquiries);
    showSuccessNotice(`Customer inquiries file download ho gayi!`);
  };

  const handleDownloadTextDossier = () => {
    const textContent = generateSpecificVendorPrintableSummary(shop);
    const dateStr = new Date().toISOString().slice(0, 10);
    triggerFileDownload(textContent, `vendor_${shop.shopId}_official_dossier_${dateStr}.txt`, 'text/plain;charset=utf-8;');
    showSuccessNotice(`Official vendor dossier text report download ho gayi!`);
  };

  const handlePrintDossier = () => {
    const textContent = generateSpecificVendorPrintableSummary(shop);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${shop.shopId} - ${shop.businessName} - Official Dossier</title>
            <style>
              body { font-family: monospace; padding: 24px; font-size: 13px; line-height: 1.6; color: #111; }
              pre { white-space: pre-wrap; word-wrap: break-word; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            <pre>${textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            <script>
              window.onload = function() { window.print(); };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(shop, null, 2));
    setCopied(true);
    showSuccessNotice('Complete store JSON clipboard me copy ho gaya!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={shop.logoUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120'} 
              alt={shop.businessName}
              className="w-14 h-14 rounded-xl object-cover border-2 border-white/20 bg-slate-800 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold bg-orange-600 text-white px-2 py-0.5 rounded-sm">
                  {shop.shopId}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                  shop.status === 'PUBLISHED' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {shop.status}
                </span>
                {shop.customDomain && (
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-900/50 px-2 py-0.5 rounded-sm border border-cyan-700/50">
                    🌐 {shop.customDomain}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-1 font-['Outfit',sans-serif]">
                {shop.businessName}
              </h2>
              <p className="text-xs text-slate-300">
                Owner: <strong className="text-white">{shop.vendorName}</strong> | {shop.category}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {downloadSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-emerald-800 text-xs font-bold animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Quick Vendor Meta Summary */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-gray-400" /> Phone & WhatsApp
            </span>
            <div className="font-bold text-slate-800 mt-1 font-mono">+91 {shop.phone}</div>
            <div className="text-[10px] text-gray-500">WA: +91 {shop.whatsapp}</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" /> Location
            </span>
            <div className="font-bold text-slate-800 mt-1 truncate">{shop.city}, {shop.state}</div>
            <div className="text-[10px] text-gray-500 font-mono">Pin: {shop.pincode}</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <Layers className="w-3 h-3 text-gray-400" /> Catalog Items
            </span>
            <div className="font-black text-slate-900 mt-1 text-base">{shop.products?.length || 0}</div>
            <div className="text-[10px] text-gray-500">Listed products / services</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-400" /> 1-Yr Validity
            </span>
            <div className={`font-bold mt-1 ${isExpired ? 'text-red-700' : 'text-emerald-700'}`}>
              {isExpired ? '🔴 Expired' : `🟢 ${daysLeft} Days Left`}
            </div>
            <div className="text-[10px] text-gray-500 font-mono">Exp: {formatDisplayDate(expiryDateVal)}</div>
          </div>
        </div>

        {/* Export Actions Cards */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
            <span>Choose Data Export Format:</span>
            <span className="text-[11px] font-mono text-gray-500 font-normal">Direct download without rate limit</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Complete Shop JSON Backup */}
            <div className="border border-gray-200 hover:border-orange-300 rounded-xl p-4 bg-white hover:bg-orange-50/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Complete Store JSON Backup</h3>
                    <span className="text-[10px] text-gray-500 font-mono">.json (Full Store Data & Settings)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Isme shop ki complete profile, all products, banners, about story, UPI, custom domain aur website sections config included hai.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={handleDownloadJSON}
                  className="flex-1 py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
                <button
                  onClick={handleCopyJSON}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy Raw JSON"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 2. Products / Catalogue CSV */}
            <div className="border border-gray-200 hover:border-emerald-300 rounded-xl p-4 bg-white hover:bg-emerald-50/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Products & Catalog (CSV / Excel)</h3>
                    <span className="text-[10px] text-gray-500 font-mono">.csv (Compatible with MS Excel & Sheets)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Is vendor ke sabhi {shop.products?.length || 0} products ka itemized price list, MRP, unit, category, discount aur stock status.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={handleDownloadProductsCSV}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Products CSV ({shop.products?.length || 0} Items)</span>
                </button>
              </div>
            </div>

            {/* 3. Inquiries & Leads CSV */}
            <div className="border border-gray-200 hover:border-blue-300 rounded-xl p-4 bg-white hover:bg-blue-50/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Customer Inquiries / Leads (CSV)</h3>
                    <span className="text-[10px] text-gray-500 font-mono">.csv (Customer orders & contact requests)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Is dukaan par aaye customer contact forms, product booking requests aur messages ka spreadsheet record.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={handleDownloadInquiriesCSV}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Inquiries CSV</span>
                </button>
              </div>
            </div>

            {/* 4. Official Printable Store Dossier (Print / PDF / TXT) */}
            <div className="border border-gray-200 hover:border-purple-300 rounded-xl p-4 bg-white hover:bg-purple-50/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Official Store Dossier (Print / TXT)</h3>
                    <span className="text-[10px] text-gray-500 font-mono">Printable Document & Official Record</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Vendor ki complete verified profile, contact, validity period aur full inventory ka clean official summary sheet.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={handlePrintDossier}
                  className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={handleDownloadTextDossier}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Download as TXT"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.TXT</span>
                </button>
              </div>
            </div>

          </div>

          {/* Direct Storefront Link */}
          {onNavigateToShop && (
            <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
              <span>View live storefront online:</span>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToShop(shop.shopId);
                }}
                className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Open Storefront Preview ({shop.shopId})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            🔒 Super Admin Master Privilege: Data exported securely without sensitive credentials.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

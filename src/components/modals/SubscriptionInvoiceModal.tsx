import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Store, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Share2, 
  MessageSquare,
  Building2,
  ExternalLink
} from 'lucide-react';
import { Shop, SubscriptionInvoice } from '../../types';
import { formatINR, formatDisplayDate, getWhatsAppDirectUrl, generateInvoiceNumber } from '../../utils/mediaUpload';

interface SubscriptionInvoiceModalProps {
  isOpen?: boolean;
  shop: Shop | null | undefined;
  invoice?: SubscriptionInvoice;
  onClose: () => void;
  adminPhone?: string;
  adminEmail?: string;
}

export const SubscriptionInvoiceModal: React.FC<SubscriptionInvoiceModalProps> = ({
  isOpen = true,
  shop,
  invoice,
  onClose,
  adminPhone = '7087033009',
  adminEmail = 'info@indianlalaji.com',
}) => {
  if (isOpen === false || !shop) return null;

  // Priority: if custom invoice passed, or shop has stored invoice, use that exact invoice record
  const storedInvoice = invoice || (shop.invoices && shop.invoices.length > 0 ? shop.invoices[0] : null);
  const basePrice = storedInvoice?.totalAmount || shop.planPrice || 1499;
  const taxableAmount = storedInvoice?.baseAmount || Math.round((basePrice / 1.18) * 100) / 100;
  const taxAmount = storedInvoice?.taxAmount || Math.round((basePrice - taxableAmount) * 100) / 100;

  const activeInvoice: SubscriptionInvoice = storedInvoice || {
    id: `inv_${shop.id || shop.shopId || Date.now()}`,
    invoiceNumber: generateInvoiceNumber(shop.shopId || '000000'),
    shopId: shop.shopId || '',
    businessName: shop.businessName || 'Dukaan Store',
    vendorName: shop.ownerName || shop.vendorName || 'Merchant',
    vendorPhone: shop.phone || '',
    vendorEmail: shop.email || shop.vendorEmail || '',
    vendorAddress: `${shop.address || ''}, ${shop.city || ''}, ${shop.state || ''} - ${shop.pincode || ''}`.replace(/^[,\s-]+|[,\s-]+$/g, '') || 'India',
    planName: shop.planName || '1-Year Official LalaJi Store Plan',
    planPeriod: '1 Full Year (365 Days Validity)',
    activeDate: shop.activeDate || new Date().toISOString().split('T')[0],
    expiryDate: shop.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    baseAmount: taxableAmount,
    taxRate: 18,
    taxAmount: taxAmount,
    totalAmount: basePrice,
    paymentMethod: 'UPI',
    paymentRefId: `UPI/LALAJI/${(shop.shopId || 'LALAJI').slice(-6)}`,
    paymentStatus: shop.status === 'PUBLISHED' ? 'PAID' : 'PENDING',
    paidAt: shop.activeDate || new Date().toISOString().split('T')[0],
    issuedBy: 'IndianLalaJi Platform Network (Digital Dukaan Technologies India)',
    adminGstin: '03AABCI9823P1Z4',
    adminAddress: 'IndianLalaJi Digital Commerce HQ, Industrial Area, Punjab - 144001',
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappReceiptMessage = 
    `*OFFICIAL 1-YEAR SUBSCRIPTION INVOICE / RECEIPT*\n` +
    `*IndianLalaJi.com - Digital Store Network*\n\n` +
    `📄 *Invoice No:* ${activeInvoice.invoiceNumber}\n` +
    `🏬 *Shop ID:* ${shop.shopId}\n` +
    `🏢 *Business:* ${shop.businessName}\n` +
    `👤 *Owner:* ${activeInvoice.vendorName}\n` +
    `📱 *Phone:* +91 ${activeInvoice.vendorPhone}\n` +
    `📦 *Plan:* ${activeInvoice.planName}\n` +
    `📅 *Validity Period:* ${formatDisplayDate(activeInvoice.activeDate)} to ${formatDisplayDate(activeInvoice.expiryDate)} (365 Days)\n` +
    `💰 *Total Amount:* ${formatINR(activeInvoice.totalAmount)} (All taxes included)\n` +
    `💳 *Payment Status:* ${activeInvoice.paymentStatus === 'PAID' ? 'PAID & VERIFIED ✅' : 'PENDING APPROVAL'}\n` +
    `🔗 *Live Store URL:* https://indianlalaji.com/?shop=${shop.shopId}\n\n` +
    `Customer Care Helpline: +91 ${adminPhone} | ${adminEmail}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 my-auto animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-w-none print:rounded-none">
        
        {/* Top Action Bar (Hidden during Print) */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white text-sm">
              ₹
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-tight">
                Digital Subscription Invoice / Receipt
              </h3>
              <p className="text-[11px] text-gray-400">
                1-Year Store Hosting & Merchant Services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
              title="Print / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <a
              href={getWhatsAppDirectUrl(shop.phone, whatsappReceiptMessage)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
              title="Share Receipt on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-8">
          
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-orange-600">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-['Outfit',sans-serif] tracking-tight uppercase text-slate-900">
                  INDIAN<span className="text-orange-600">LALAJI</span>.COM
                </span>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                  Verified Tax Receipt
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-sm">
                Official Digital Store Network & Cloud Commerce Platform for Indian Businesses.
              </p>
              <div className="text-[11px] text-gray-500 mt-2 space-y-0.5 font-mono">
                <div>GSTIN: {activeInvoice.adminGstin}</div>
                <div>Helpline: +91 {adminPhone} • Email: {adminEmail}</div>
                <div>Web: https://indianlalaji.com</div>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="sm:text-right bg-orange-50/60 sm:bg-transparent p-3.5 sm:p-0 rounded-xl sm:rounded-none w-full sm:w-auto border border-orange-200 sm:border-none">
              <div className="inline-block bg-orange-600 text-white text-xs font-black uppercase px-3 py-1 rounded-sm tracking-wider mb-2">
                TAX INVOICE / RECEIPT
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Invoice No: <strong className="text-slate-900 font-mono text-sm">{activeInvoice.invoiceNumber}</strong></div>
                <div>Issue Date: <strong className="text-slate-900">{formatDisplayDate(activeInvoice.paidAt)}</strong></div>
                <div>Payment Mode: <strong className="text-slate-900">{activeInvoice.paymentMethod} (Direct QR)</strong></div>
                <div>Ref / UTR ID: <strong className="text-slate-900 font-mono text-[11px]">{activeInvoice.paymentRefId || 'VERIFIED'}</strong></div>
              </div>
            </div>
          </div>

          {/* Billed To & Subscription Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-orange-700 mb-1">
                BILLED TO (MERCHANT / STORE OWNER)
              </div>
              <div className="text-base font-bold text-slate-900">{shop.businessName}</div>
              <div className="text-gray-700 font-medium">Owner: {activeInvoice.vendorName}</div>
              <div className="text-gray-600">Shop ID: <span className="font-mono font-bold text-orange-600">{shop.shopId}</span></div>
              <div className="text-gray-600">Phone: +91 {activeInvoice.vendorPhone}</div>
              {activeInvoice.vendorEmail && (
                <div className="text-gray-600">Email: {activeInvoice.vendorEmail}</div>
              )}
              <div className="text-gray-500 mt-1">{activeInvoice.vendorAddress}</div>
            </div>

            <div className="sm:text-right sm:border-l sm:border-gray-200 sm:pl-4 space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-orange-700 mb-1">
                SUBSCRIPTION VALIDITY DETAILS
              </div>
              <div>
                <span className="text-gray-500">Plan Duration: </span>
                <strong className="text-slate-900">{activeInvoice.planPeriod}</strong>
              </div>
              <div>
                <span className="text-gray-500">Active From: </span>
                <strong className="text-slate-900">{formatDisplayDate(activeInvoice.activeDate)}</strong>
              </div>
              <div>
                <span className="text-gray-500">Valid Till: </span>
                <strong className="text-orange-600 font-bold">{formatDisplayDate(activeInvoice.expiryDate)}</strong>
              </div>
              <div className="pt-1">
                <span className={`inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-0.5 rounded ${
                  activeInvoice.paymentStatus === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Status: {activeInvoice.paymentStatus}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 px-3 rounded-tl">#</th>
                  <th className="py-2.5 px-3">Service / Item Description</th>
                  <th className="py-2.5 px-3 text-center">Validity</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right rounded-tr">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700 border-b border-gray-200">
                <tr>
                  <td className="py-3 px-3 font-mono">01</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{activeInvoice.planName}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Includes 1-Year Store Hosting, Direct WhatsApp Cart & Ordering Engine, 0% UPI QR Setup, HD Photo Gallery, Video Embeds, 24/7 Mobile Vendor Dashboard & Priority Customer Support.
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900 whitespace-nowrap">
                    365 Days
                  </td>
                  <td className="py-3 px-3 text-right font-mono">1</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                    {formatINR(activeInvoice.baseAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculations & Total Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-[11px] text-gray-500 space-y-1 max-w-sm">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Terms & Conditions:
              </div>
              <p>• 1-Year store validity is non-transferable and renewable annually.</p>
              <p>• All transactions are secured directly between customer and merchant.</p>
              <p>• Computer-generated digital tax receipt. Authorized under IndianLalaJi Digital Commerce.</p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Sub Total (Taxable):</span>
                <span className="font-mono">{formatINR(activeInvoice.baseAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18% Included):</span>
                <span className="font-mono">{formatINR(activeInvoice.taxAmount)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between items-baseline font-black text-slate-900 text-sm sm:text-base">
                <span className="uppercase font-['Outfit',sans-serif]">Total Paid:</span>
                <span className="text-orange-600 font-mono font-black">{formatINR(activeInvoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Official Verification Seal */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border-2 border-emerald-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-black text-slate-900 uppercase text-[11px] tracking-wider">
                  Digitally Verified & Authenticated
                </div>
                <div className="text-[10px] text-gray-500">
                  IndianLalaJi Platform Network • Authorized Merchant Receipt
                </div>
              </div>
            </div>

            <div className="text-center sm:text-right font-mono text-[10px] text-gray-400">
              Generated for Store: <strong className="text-slate-800">{shop.shopId}</strong> on {formatDisplayDate(activeInvoice.paidAt)}
            </div>
          </div>

        </div>

        {/* Footer info (Print hidden) */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 print:hidden gap-2">
          <span className="text-[11px]">
            Need help or GST invoice modification? Contact Admin: <strong>+91 {adminPhone}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-sm font-bold uppercase tracking-wider text-xs transition-colors"
          >
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  );
};

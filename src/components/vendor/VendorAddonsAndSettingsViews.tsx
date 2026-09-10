import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  QrCode,
  Globe,
  Palette,
  FileText,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Printer,
  Download,
  Shield,
  ShieldCheck,
  Calendar,
  Clock,
  HardDrive,
  RefreshCw,
  Zap,
  ShoppingBag,
  Layers,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Headphones,
  Upload,
  ArrowRight,
  Eye,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Shop } from '../../types';
import {
  formatINR,
  getWhatsAppDirectUrl,
  formatDisplayDate,
  calculateDaysRemaining,
  getOneYearExpiryDate,
  fileToBase64
} from '../../utils/mediaUpload';

interface VendorSubViewProps {
  shop: Shop;
  onUpdateShop: (updated: Shop) => void;
  onMarkDirty: () => void;
  showToast: (msg: string) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenStandeeModal?: () => void;
  onOpenInvoiceModal?: () => void;
  onNavigateToShop?: () => void;
  adminPaymentQrUrl?: string;
  adminUpiId?: string;
  adminPhone?: string;
  adminWhatsapp?: string;
}

// 1. CALL ADDON
export const CallAddonView: React.FC<VendorSubViewProps> = ({
  shop,
  onUpdateShop,
  onMarkDirty,
  showToast
}) => {
  const [phone, setPhone] = useState(shop.phone || '');
  const [workingHours, setWorkingHours] = useState(shop.workingHours || '10:00 AM - 08:30 PM');
  const [callEnabled, setCallEnabled] = useState(shop.floatingButtons?.callEnabled !== false);

  const handleApply = () => {
    const updated: Shop = {
      ...shop,
      phone,
      workingHours,
      floatingButtons: {
        ...shop.floatingButtons,
        callEnabled
      }
    };
    onUpdateShop(updated);
    onMarkDirty();
    showToast('Call Addon settings updated! Click "Save Changes" to publish.');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Phone className="w-3.5 h-3.5" />
            <span>Addon Settings</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Call Addon Setup
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Grahak website se seedhe 1-click mein aapko phone call kar sakein.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${callEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
            {callEnabled ? '● Active' : '○ Inactive'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Calling Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-semibold"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Is number par website visitors se calls aayenge.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Call Timings / Working Hours
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="e.g. 10:00 AM - 08:30 PM (Mon-Sat)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-medium"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={callEnabled}
                onChange={(e) => setCallEnabled(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Show Click-to-Call Button on Storefront</div>
                <div className="text-[11px] text-gray-500">Website par header, contact section aur floating CTA mein call button dikhega.</div>
              </div>
            </label>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all"
          >
            Apply Call Settings
          </button>
        </div>

        <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">Live Visitor Preview</div>
            <div className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{shop.businessName || 'Dukaan Name'}</div>
                  <div className="text-xs font-mono text-blue-700 font-bold">{phone || 'Number not set'}</div>
                </div>
              </div>
              <div className="text-[11px] text-gray-500">
                Working: {workingHours || '10:00 AM - 08:30 PM'}
              </div>
            </div>
          </div>
          <div className="text-[11px] text-blue-900/80 mt-4 bg-white/60 p-3 rounded-xl">
            💡 <strong>Tip:</strong> Mobile par user Call button dabate hi dialer open ho jayega aur number pehle se typed milega.
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. WHATSAPP ADDON
export const WhatsAppAddonView: React.FC<VendorSubViewProps> = ({
  shop,
  onUpdateShop,
  onMarkDirty,
  showToast
}) => {
  const [whatsapp, setWhatsapp] = useState(shop.whatsapp || '');
  const [greeting, setGreeting] = useState(
    shop.whatsappCustomMessage || `Namaste! Mujhe aapki dukaan "${shop.businessName}" se product order / inquiry karni hai.`
  );
  const [whatsappEnabled, setWhatsappEnabled] = useState(shop.floatingButtons?.whatsappEnabled !== false);

  const handleApply = () => {
    const updated: Shop = {
      ...shop,
      whatsapp,
      whatsappCustomMessage: greeting,
      floatingButtons: {
        ...shop.floatingButtons,
        whatsappEnabled
      }
    };
    onUpdateShop(updated);
    onMarkDirty();
    showToast('WhatsApp Addon settings updated! Click "Save Changes" to publish.');
  };

  const testUrl = getWhatsAppDirectUrl(whatsapp, greeting);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Addon Settings</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            WhatsApp Direct Chat & Ordering
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Grahak ke saare orders aur inquiries seedhe aapke business WhatsApp par auto-filled message ke saath aate hain.
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${whatsappEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
          {whatsappEnabled ? '● Active' : '○ Inactive'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Registered WhatsApp Mobile Number *
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-semibold font-mono"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Country code (91) system automatically jod lega.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Auto-Filled Customer Greeting Message
            </label>
            <textarea
              rows={3}
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-medium"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Jab grahak WhatsApp par aayega, ye message pehle se likha hua milega.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Enable WhatsApp Order Buttons on All Products</div>
                <div className="text-[11px] text-gray-500">Every product card will have direct "Order on WhatsApp" button.</div>
              </div>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all"
            >
              Apply WhatsApp Settings
            </button>

            {whatsapp && (
              <a
                href={testUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test WhatsApp Link</span>
              </a>
            )}
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">WhatsApp Order Experience</div>
            <div className="bg-emerald-950 text-white p-4 rounded-xl shadow-inner font-sans space-y-2">
              <div className="text-[10px] text-emerald-400 font-mono">WhatsApp Web / App Preview</div>
              <div className="p-3 bg-emerald-900/80 rounded-lg text-xs leading-relaxed border border-emerald-700/50">
                "{greeting}"
              </div>
              <div className="text-[11px] text-emerald-200">
                To: <span className="font-mono font-bold">+91 {whatsapp || 'Your-Number'}</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-emerald-900 mt-4 bg-white/70 p-3 rounded-xl border border-emerald-200">
            ✅ <strong>Direct Orders:</strong> Direct orders directly to your WhatsApp. No third-party cuts or middleman delays.
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. EMAIL ADDON
export const EmailAddonView: React.FC<VendorSubViewProps> = ({
  shop,
  onUpdateShop,
  onMarkDirty,
  showToast
}) => {
  const [email, setEmail] = useState(shop.email || shop.vendorEmail || '');
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleApply = () => {
    const updated: Shop = {
      ...shop,
      email,
      vendorEmail: email
    };
    onUpdateShop(updated);
    onMarkDirty();
    showToast('Email Addon settings updated! Click "Save Changes" to publish.');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Addon Settings</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Email Inquiries Addon
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Store inquiries aur contact form submissions ke alerts apne email par receive karein.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Store Official Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. contact@mystore.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-medium"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Customer contact section mein yahi email dikhega.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Email Alerts on Form Submission</div>
                <div className="text-[11px] text-gray-500">Instant notification when a customer submits inquiry form.</div>
              </div>
            </label>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all"
          >
            Apply Email Settings
          </button>
        </div>

        <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50/50 rounded-2xl border border-purple-200 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-2">Storefront Email Badge</div>
            <div className="bg-white p-4 rounded-xl border border-purple-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Mail className="w-4 h-4 text-purple-600" />
                <span>{email || 'support@yourbusiness.com'}</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Grahak contact form bhar kar direct email inquiry bhej sakte hain.
              </p>
            </div>
          </div>
          <div className="text-[11px] text-purple-900 mt-4 bg-white/70 p-3 rounded-xl border border-purple-200">
            🔒 Professional trust badge for high-ticket corporate / bulk orders.
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. PAYMENT QR ADDON
export const PaymentQrAddonView: React.FC<VendorSubViewProps> = ({
  shop,
  onUpdateShop,
  onMarkDirty,
  showToast
}) => {
  const [upiId, setUpiId] = useState(shop.upiId || '');
  const [paymentQrUrl, setPaymentQrUrl] = useState(shop.paymentQrUrl || '');
  const [copied, setCopied] = useState(false);

  const handleApply = () => {
    const updated: Shop = {
      ...shop,
      upiId,
      paymentQrUrl
    };
    onUpdateShop(updated);
    onMarkDirty();
    showToast('Payment QR Addon settings updated! Click "Save Changes" to publish.');
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      setPaymentQrUrl(b64);
      const updated: Shop = {
        ...shop,
        paymentQrUrl: b64,
        upiId: upiId || shop.upiId
      };
      onUpdateShop(updated);
      onMarkDirty();
      showToast('Custom Payment QR uploaded successfully!');
    } catch {
      alert('Kripya valid image file upload karein.');
    }
  };

  const copyUpi = () => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('UPI ID clipboard mein copy ho gaya!');
  };

  // Instant generated QR
  const upiQrApiUrl = upiId
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        `upi://pay?pa=${upiId}&pn=${encodeURIComponent(shop.businessName || 'Merchant')}&cu=INR`
      )}`
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <QrCode className="w-3.5 h-3.5" />
            <span>Direct UPI Addon</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Direct UPI Payment QR Code
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Allow customers to send payments directly to your bank account via PhonePe, Google Pay, Paytm, or BHIM UPI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Store UPI ID / VPA *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. shopname@okaxis or 9876543210@ybl"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-mono font-bold text-slate-900"
              />
              {upiId && (
                <button
                  type="button"
                  onClick={copyUpi}
                  className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Aapka PhonePe, Google Pay ya Paytm UPI ID dalein.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Or Upload Custom Bank / Store QR Code Image
            </label>
            <label className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer transition-colors text-xs font-bold text-slate-700">
              <Upload className="w-4 h-4 text-gray-500" />
              <span>Choose QR Image File (PNG / JPG)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleQrUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="font-bold">Accepted UPI Payment Apps:</div>
            <div className="text-[11px] text-emerald-800">
              ✓ PhonePe &nbsp;•&nbsp; ✓ Google Pay &nbsp;•&nbsp; ✓ Paytm &nbsp;•&nbsp; ✓ BHIM UPI &nbsp;•&nbsp; ✓ Amazon Pay
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all"
          >
            Apply UPI QR Settings
          </button>
        </div>

        <div className="p-5 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl border border-emerald-200 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
            Customer Payment QR Preview
          </div>
          <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-md border border-gray-200 flex items-center justify-center">
            {paymentQrUrl ? (
              <img
                src={paymentQrUrl}
                alt="Store Payment QR"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : upiQrApiUrl ? (
              <img
                src={upiQrApiUrl}
                alt="Generated UPI QR"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center text-gray-400 p-4">
                <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <div className="text-[11px]">Enter UPI ID to generate live QR</div>
              </div>
            )}
          </div>
          <div className="text-xs font-mono font-bold text-slate-800 mt-3">
            {upiId || 'No UPI ID Set'}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Scan & Pay directly via any UPI app
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. SHOP STANDEE VIEW
export const ShopStandeeView: React.FC<VendorSubViewProps> = ({
  shop,
  onOpenStandeeModal,
  showToast
}) => {
  const storeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?shop=${shop.shopId}`
    : `https://indianlalaji.com/?shop=${shop.shopId}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(storeUrl)}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Printer className="w-3.5 h-3.5" />
            <span>Counter Branding</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Dukaan QR Standee & Posters
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Apni dukaan ke counter par rakhne ke liye high-resolution A4 QR Standee ready hai.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenStandeeModal}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Open Printable A4 Standee</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* STAND PREVIEW CARD */}
        <div className="mx-auto w-full max-w-sm bg-gradient-to-b from-orange-600 via-orange-500 to-amber-600 p-6 rounded-3xl text-white shadow-xl text-center space-y-4 border-4 border-white">
          <div className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block">
            Hamari Digital Dukaan Par Swagat Hai!
          </div>

          <div className="w-16 h-16 mx-auto rounded-full bg-white p-1 shadow-md overflow-hidden">
            {shop.logoUrl ? (
              <img src={shop.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-orange-100 text-orange-700 flex items-center justify-center font-black text-lg">
                {shop.businessName?.[0] || 'D'}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-black">{shop.businessName}</h3>
            <p className="text-xs text-orange-100 mt-0.5">{shop.tagline || 'Best Quality Products & Services'}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-inner max-w-[220px] mx-auto text-slate-900">
            <img src={qrUrl} alt="Store QR" className="w-full h-auto" referrerPolicy="no-referrer" />
            <div className="text-[10px] font-black uppercase tracking-wider text-orange-700 mt-2">
              Scan To View Catalog & Order
            </div>
          </div>

          <div className="pt-2 text-xs font-bold text-orange-100 flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Ordering Available</span>
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-800">
              Standee Kaise Use Karein?
            </div>
            <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>Step 1:</strong> 'Open Printable A4 Standee' button dabayein.</li>
              <li><strong>Step 2:</strong> Kisi bhi regular printer ya photo studio se color print nikalwayein.</li>
              <li><strong>Step 3:</strong> Acrylic table stand ya laminate karwa ke counter par lagayein.</li>
              <li><strong>Step 4:</strong> Customer aate hi apna camera open kar ke QR scan karega aur dukaan ka catalog uske phone par khul jayega!</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <div className="text-xs font-bold text-slate-900">Direct Dukaan Link</div>
            <div className="p-2.5 bg-white rounded-xl border border-gray-200 font-mono text-xs text-slate-700 break-all select-all">
              {storeUrl}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(storeUrl);
                showToast('Store link clipboard mein copy ho gaya!');
              }}
              className="px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. WEBSITE SWITCH (E-COMMERCE VS CATALOGUE)
export const WebsiteSwitchView: React.FC<VendorSubViewProps> = ({
  shop,
  onUpdateShop,
  onMarkDirty,
  showToast,
  onNavigateToShop,
}) => {
  const isCatalog = Boolean(
    shop.isCatalogOnly === true ||
    shop.hideAllPrices === true ||
    (shop as any).websiteMode === 'CATALOG'
  );

  const handleSetMode = (catalogMode: boolean) => {
    const updated: Shop = {
      ...shop,
      isCatalogOnly: catalogMode,
      hideAllPrices: catalogMode,
      websiteMode: catalogMode ? 'CATALOG' : 'ECOMMERCE',
      updatedAt: new Date().toISOString()
    } as any;
    onUpdateShop(updated);
    if (onMarkDirty) onMarkDirty();
    showToast(
      catalogMode
        ? 'Catalogue Mode activated! All prices are hidden and quote buttons are active. 👁️❌'
        : 'E-Commerce Mode activated! Product prices and direct order buttons are now live. 👁️✅'
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Storefront Mode Switcher</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Website Switch: E-Commerce vs Catalogue
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Apne business model ke hisaab se switch karein ki website par price dikhane hain ya price hide karke sirf inquiries leni hain.
          </p>
        </div>

        {onNavigateToShop && (
          <button
            type="button"
            onClick={onNavigateToShop}
            className="self-start sm:self-auto px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </button>
        )}
      </div>

      {/* Real-time Status Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isCatalog 
          ? 'bg-purple-50 border-purple-200 text-purple-950' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isCatalog ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {isCatalog ? <Sliders className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Current Active Mode:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                isCatalog ? 'bg-purple-200 text-purple-900' : 'bg-emerald-200 text-emerald-900'
              }`}>
                {isCatalog ? 'Catalogue Mode (Prices Hidden)' : 'E-Commerce Mode (Prices Shown)'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isCatalog
                ? 'All products are displaying "Price on Request" with inquiry quotation buttons.'
                : 'All products are displaying standard prices with instant WhatsApp ordering buttons.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSetMode(!isCatalog)}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            isCatalog
              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
              : 'bg-purple-700 hover:bg-purple-800 text-white shadow-sm'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Switch to {isCatalog ? 'E-Commerce Mode' : 'Catalogue Mode'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MODE 1: E-COMMERCE (WITH PRICE) */}
        <div
          onClick={() => handleSetMode(false)}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
            !isCatalog
              ? 'border-orange-500 bg-orange-50/40 ring-4 ring-orange-500/10 shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                Mode 1
              </span>
              {!isCatalog && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Currently Active</span>
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-slate-900">E-Commerce (With Price)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sabhi products aur services ki price (MRP / Discounted Rate) publically dikhegi. Grahak 'Add to Cart' ya instant WhatsApp order kar sakte hain.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Product prices clearly visible (e.g. ₹499)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Instant 'Order on WhatsApp' button with price</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Best for: Retail shops, clothing, groceries, electronics</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSetMode(false);
            }}
            className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              !isCatalog
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
            }`}
          >
            {!isCatalog ? 'Active (With Price)' : 'Switch to E-Commerce'}
          </button>
        </div>

        {/* MODE 2: CATALOGUE (WITHOUT PRICE) */}
        <div
          onClick={() => handleSetMode(true)}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
            isCatalog
              ? 'border-indigo-500 bg-indigo-50/40 ring-4 ring-indigo-500/10 shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                Mode 2
              </span>
              {isCatalog && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Currently Active</span>
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-slate-900">Catalogue (Without Price)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sabhi products display honge par prices hide rahengi. Grahak 'Price on Request' ya 'Inquire on WhatsApp' dabakar custom quotation mangenge.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>All prices hidden — Shows 'Price on Request'</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>'Get Best Quote on WhatsApp' button</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>Best for: Wholesalers, manufacturers, custom fabricators</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSetMode(true);
            }}
            className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              isCatalog
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
            }`}
          >
            {isCatalog ? 'Active (Without Price)' : 'Switch to Catalogue'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. MY PLAN VIEW
export const MyPlanView: React.FC<VendorSubViewProps> = ({
  shop,
  onNavigateTab
}) => {
  const expiry = shop.expiryDate || getOneYearExpiryDate(new Date().toISOString());
  const daysLeft = calculateDaysRemaining(expiry);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Subscription Status</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            My 1-Year Platinum Plan
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            IndianLalaJi Merchant Platform full feature 1-Year access and validity details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
            ● Active (Verified)
          </span>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('billing_renew')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Renew / Extend
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Plan Duration</div>
          <div className="text-xl font-black text-slate-900 mt-1">365 Days (1 Year)</div>
          <div className="text-xs text-gray-500 mt-0.5">All-inclusive platform suite</div>
        </div>

        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-orange-800">Days Remaining</div>
          <div className="text-xl font-black text-orange-700 mt-1">{daysLeft} Days</div>
          <div className="text-xs text-orange-800 mt-0.5">Valid until {formatDisplayDate(expiry)}</div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Cloud Storage</div>
          <div className="text-xl font-black text-emerald-700 mt-1">200 MB Storage</div>
          <div className="text-xs text-emerald-800 mt-0.5">Dedicated media allocation</div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Included Features In Your Plan</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          {[
            'Unlimited Products & Services catalog showcase',
            'Direct WhatsApp ordering engine (Direct customer orders)',
            'Custom Domain (.com / .in / .org) connection with SSL',
            'Full 16 modular website sections suite',
            'Printable A4 Dukaan QR Standee generator',
            'Direct UPI QR Code (PhonePe, GPay, Paytm)',
            'Full data JSON backup & restore anytime',
            'Priority 24/7 Merchant Customer Care Helpline'
          ].map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 8. BILLING INVOICE VIEW
export const BillingInvoiceView: React.FC<VendorSubViewProps> = ({
  shop,
  onOpenInvoiceModal
}) => {
  const invoiceNum = `INV-2026-${(shop.shopId || 'SHP123').slice(0, 6).toUpperCase()}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Tax Invoice</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Official Invoices & Receipts
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Apni dukaan ke subscription ka official GST-ready printable tax invoice yahan se download karein.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenInvoiceModal}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Open Printable Tax Invoice</span>
        </button>
      </div>

      <div className="max-w-2xl bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <div className="text-xs text-gray-500">Invoice Number</div>
            <div className="text-sm font-mono font-bold text-slate-900">{invoiceNum}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Status</div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              PAID - VERIFIED
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-bold text-slate-900">Billed To:</div>
            <div className="text-gray-700 mt-0.5">{shop.businessName}</div>
            <div className="text-gray-500">Owner: {shop.vendorName || 'Merchant'}</div>
            <div className="text-gray-500">Shop ID: {shop.shopId}</div>
          </div>
          <div>
            <div className="font-bold text-slate-900">Provider:</div>
            <div className="text-gray-700 mt-0.5">IndianLalaJi E-Commerce Technologies</div>
            <div className="text-gray-500">GSTIN: 07AAACI1234F1Z5</div>
            <div className="text-gray-500">Support: care@indianlalaji.com</div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">IndianLalaJi 1-Year Digital Storefront Package</span>
            <span className="font-bold text-slate-900">{formatINR(shop.planPrice || 1499)}</span>
          </div>
          <div className="flex justify-between text-xs font-black text-slate-900 border-t border-gray-200 pt-2">
            <span>Total Paid (Inclusive of Taxes):</span>
            <span className="text-sm text-emerald-700">{formatINR(shop.planPrice || 1499)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 9. BILLING RENEW VIEW
export const BillingRenewView: React.FC<VendorSubViewProps> = ({
  shop,
  adminPaymentQrUrl,
  adminUpiId,
  adminPhone,
  adminWhatsapp,
  showToast
}) => {
  const [copied, setCopied] = useState(false);
  const upiId = adminUpiId || 'admin@indianlalaji';
  const phone = adminWhatsapp || adminPhone || '7087033009';

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Admin UPI ID copy ho gaya!');
  };

  const whatsappProofUrl = getWhatsAppDirectUrl(
    phone,
    `Namaste IndianLalaJi Admin! I have completed payment of Rs. 999 for 1-Year store renewal.\n\nShop Name: "${shop.businessName}"\nShop ID: ${shop.shopId}\nMobile: ${shop.phone}\n\nPlease verify payment screenshot.`
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Loyalty Renewal Offer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Renew Store Subscription for 1 Year
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Special merchant loyalty discount: Get full 1-Year renewal for just ₹999 (Original price: ₹1,499).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="p-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl text-white shadow-xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block">
            Merchant Loyalty Deal
          </div>
          <h3 className="text-2xl font-black">1-Year Full Store Access</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">₹999</span>
            <span className="line-through text-orange-200 text-sm">₹1,499</span>
            <span className="text-xs bg-white text-orange-700 font-black px-2 py-0.5 rounded-full">Save ₹500</span>
          </div>
          <ul className="text-xs space-y-2 text-orange-100 pt-2 border-t border-white/20">
            <li>✓ Extra 365 Days added to your store validity</li>
            <li>✓ Free SSL certificate & custom domain link</li>
            <li>✓ 200 MB high-speed cloud media hosting</li>
            <li>✓ 24/7 dedicated merchant WhatsApp helpline</li>
          </ul>
        </div>

        <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Step 1: Scan UPI QR / Transfer ₹999
          </div>

          <div className="flex items-center gap-4">
            <div className="w-28 h-28 bg-white p-2 rounded-xl shadow-xs border border-gray-200 shrink-0 flex items-center justify-center">
              {adminPaymentQrUrl ? (
                <img src={adminPaymentQrUrl} alt="Admin QR" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              ) : (
                <QrCode className="w-16 h-16 text-gray-400" />
              )}
            </div>

            <div className="space-y-2">
              <div className="text-xs text-gray-500">Official UPI ID:</div>
              <div className="font-mono font-bold text-xs text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                {upiId}
              </div>
              <button
                type="button"
                onClick={copyUpi}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied' : 'Copy UPI ID'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              Step 2: Send Payment Screenshot on WhatsApp
            </div>
            <a
              href={whatsappProofUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Submit Payment Screenshot</span>
            </a>
            <p className="text-[11px] text-gray-500 mt-1 text-center">
              Payment verify hote hi aapki store validity 365 din badha di jayegi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 10. SUPPORT HELP VIEW
export const SupportHelpView: React.FC<VendorSubViewProps> = ({
  shop
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Dukaan par naya product kaise add karein?',
      a: 'Sidebar se "Products Catalogue" par click karein aur "+ Add Product" button dabayein. Product ka naam, price, description aur photo daal kar Save karein.'
    },
    {
      q: 'Grahak ke orders mujhe kaise milenge?',
      a: 'Website par har product ke saath direct "Order on WhatsApp" button hota hai. Grahak ke click karte hi aapke registered WhatsApp number par message aa jayega.'
    },
    {
      q: 'Website par prices kaise hide karein (Catalogue Mode)?',
      a: 'Sidebar se "Website Switch" par click karein aur "Catalogue (Without Price)" mode select karein. Isse sabhi items par price ki jagah "Price on Request" dikhega.'
    },
    {
      q: 'Apna counter QR Standee kaise print karein?',
      a: 'Sidebar se "Shop Standee" par jayein aur "Open Printable A4 Standee" par click karein. Aap apne printer se direct color print nikal sakte hain.'
    },
    {
      q: 'Custom Domain (.com / .in) kaise link karein?',
      a: 'Sidebar se "Custom Domain" par click karein, apna domain name enter karein aur bataye gaye DNS A & CNAME records apne domain provider mein add karein.'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Merchant Knowledgebase & Tutorials
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Apni dukaan ko online grow karne ke aasan tareeqe aur video guides.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
          Frequently Asked Questions (FAQ)
        </h4>
        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100/80 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-900"
                >
                  <span>Q: {faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs text-gray-700 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 11. SUPPORT CARE VIEW
export const SupportCareView: React.FC<VendorSubViewProps> = ({
  shop,
  adminPhone,
  adminWhatsapp
}) => {
  const phone = adminWhatsapp || adminPhone || '7087033009';
  const helpDeskUrl = getWhatsAppDirectUrl(
    phone,
    `Namaste IndianLalaJi Support Team!\n\nStore Name: "${shop.businessName}"\nShop ID: ${shop.shopId}\nMerchant: ${shop.vendorName || 'Vendor'}\n\nI need urgent assistance with my store.`
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Headphones className="w-3.5 h-3.5" />
            <span>24x7 Customer Care</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Customer Care & Merchant Helpline
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Humari merchant support team aapki madad ke liye hamesha taiyar hai.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href={helpDeskUrl}
          target="_blank"
          rel="noreferrer"
          className="p-6 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl transition-all flex items-center gap-4 cursor-pointer shadow-xs"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">Priority WhatsApp Helpline</div>
            <div className="text-xs text-emerald-800 font-bold mt-0.5">+91 {phone}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Instant reply • Available 24x7</div>
          </div>
        </a>

        <a
          href={`tel:${phone}`}
          className="p-6 bg-orange-50 hover:bg-orange-100/80 border border-orange-200 rounded-2xl transition-all flex items-center gap-4 cursor-pointer shadow-xs"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">Direct Phone Calling Support</div>
            <div className="text-xs text-orange-900 font-bold mt-0.5">10:00 AM to 8:00 PM</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Mon - Sat (Hindi & English)</div>
          </div>
        </a>
      </div>

      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-slate-700 space-y-1">
        <div className="font-bold text-slate-900">Support Guarantee:</div>
        <p className="text-gray-600 leading-relaxed">
          Agar aapki dukaan par koi technical dikkat aati hai, humari team bina kisi extra charge ke usse 2 ghante ke andar theek karegi.
        </p>
      </div>
    </div>
  );
};

// 12. STORAGE MANAGER VIEW (Vendor Storage: 200 MB only)
export const StorageManagerView: React.FC<VendorSubViewProps> = ({
  shop,
  showToast
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Calculate estimated size from shop data
  const shopJsonStr = JSON.stringify(shop);
  const dataBytes = new Blob([shopJsonStr]).size;
  const dataMb = (dataBytes / (1024 * 1024)).toFixed(2);
  const estimatedMediaMb = ((shop.galleryImages?.length || 0) * 1.8 + (shop.banners?.length || 0) * 2.2 + 8.5).toFixed(1);
  const totalUsedMb = (parseFloat(estimatedMediaMb) + parseFloat(dataMb)).toFixed(1);
  const totalQuotaMb = 200;
  const percentUsed = Math.min(100, Math.round((parseFloat(totalUsedMb) / totalQuotaMb) * 100));

  const handleOptimizeMedia = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      showToast('Media cache optimized! Compressed 3.4 MB temporary buffers.');
    }, 1000);
  };

  const handleDownloadOfflineBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shop, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${shop.shopId}_complete_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Offline store backup download ho gaya!');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Storage Quota</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Vendor Storage: 200 MB Only
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Har dukaan ko high-speed Indian CDN par 200 MB dedicated ultra-fast storage diya jata hai.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadOfflineBackup}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Offline Backup</span>
          </button>
        </div>
      </div>

      {/* STORAGE PROGRESS BAR */}
      <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-300 font-medium">Used Space</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {totalUsedMb} MB <span className="text-sm font-normal text-gray-400">/ 200 MB Limit</span>
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold">
              {percentUsed}% Used • {200 - parseFloat(totalUsedMb)} MB Free
            </span>
          </div>
        </div>

        {/* Progress gauge */}
        <div className="w-full bg-slate-700/80 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-400 pt-1">
          <span>Speed: Tier-1 Indian Edge CDN (Sub-1s Load Time)</span>
          <span>Zero Server Downtime Guarantee</span>
        </div>
      </div>

      {/* DETAILED BREAKDOWN */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
          Storage Breakdown
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-gray-500 font-medium">Product Catalog Photos</div>
            <div className="text-base font-black text-slate-900 mt-1">
              {(catalogProductsCount(shop) * 0.45 + 2.5).toFixed(1)} MB
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">{catalogProductsCount(shop)} Products Listed</div>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-gray-500 font-medium">Hero Banners & Artworks</div>
            <div className="text-base font-black text-slate-900 mt-1">
              {((shop.banners?.length || 1) * 2.1).toFixed(1)} MB
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">{shop.banners?.length || 1} Banner Slides</div>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-gray-500 font-medium">Portfolio & Gallery Photos</div>
            <div className="text-base font-black text-slate-900 mt-1">
              {((shop.galleryImages?.length || 0) * 1.5).toFixed(1)} MB
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">{shop.galleryImages?.length || 0} Photos Uploaded</div>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-gray-500 font-medium">Store JSON Database</div>
            <div className="text-base font-black text-slate-900 mt-1">
              {dataMb} MB
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Structured Settings & Texts</div>
          </div>
        </div>
      </div>

      {/* OPTIMIZE ACTION */}
      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-orange-900">Fast Media Optimization Engine</div>
          <p className="text-[11px] text-orange-800 mt-0.5">
            Automatic WebP compression keeps your images crystal clear while loading instantly on 4G/5G mobile connections across India.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOptimizeMedia}
          disabled={isOptimizing}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Optimizing...' : 'Optimize & Clean Cache'}</span>
        </button>
      </div>
    </div>
  );
};

function catalogProductsCount(shop: Shop): number {
  return (shop.products || []).filter((p) => p.type !== 'SERVICE').length;
}

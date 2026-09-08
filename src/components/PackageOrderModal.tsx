import React, { useState } from 'react';
import { 
  X, 
  Check, 
  QrCode, 
  PhoneCall, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Building,
  CreditCard
} from 'lucide-react';
import { PricingPackage, PlatformState } from '../types';
import { formatINR, getWhatsAppDirectUrl } from '../utils/mediaUpload';

interface PackageOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: PricingPackage | null;
  state: PlatformState;
  onOpenAuthRegister: () => void;
}

export const PackageOrderModal: React.FC<PackageOrderModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  state,
  onOpenAuthRegister,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isOpen || !selectedPackage) return null;

  const adminPhone = state.customerCareWhatsapp || state.customerCarePhone || '7087033009';
  const adminUpi = state.adminUpiId || '7087033009@paytm';
  const adminHolder = state.adminAccountHolder || 'IndianLalaJi Platform (R. K. Mehra)';
  
  // Custom uploaded QR or dynamic generated QR for exact amount
  const qrImage = state.adminPaymentQrUrl || 
    `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=upi://pay?pa=${encodeURIComponent(adminUpi)}&pn=IndianLalaJi&am=${selectedPackage.price}&cu=INR`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(adminUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSendWhatsAppOrder = () => {
    const bName = businessName.trim() || 'Meri Nayi Dukaan';
    const oName = ownerName.trim() || 'Store Owner';
    const mob = phone.trim() || 'Not Provided';
    const utr = utrNumber.trim() ? `\n🔢 *UTR/Transaction ID:* ${utrNumber.trim()}` : '';

    const message = `Namaste IndianLalaJi Admin Ji! 🙏\n\nMaine *1 Single Package* select kiya hai:\n\n📦 *Ordered Plan:* ${selectedPackage.name}\n💰 *Price:* ${formatINR(selectedPackage.price)} (${selectedPackage.period})\n🏬 *Business Name:* ${bName}\n👤 *Owner Name:* ${oName}\n📱 *Mobile Number:* ${mob}${utr}\n\nMaine payment process shuru kar diya hai. Kripya mera digital store setup aur verification confirm karein. Dhanyawaad!`;

    window.open(getWhatsAppDirectUrl(adminPhone, message), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-xs">
              <Sparkles className="w-3 h-3" /> Single Package Order (1 Plan Only)
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] uppercase tracking-tight">
              Order: <span className="text-orange-400">{selectedPackage.name}</span>
            </h2>
            <p className="text-xs text-gray-300">
              Aap sirf yeh 1 specific plan order kar rahe hain. 100% Secure & Direct UPI Payment.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Plan Summary Banner */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-700">
                Selected Plan Details
              </div>
              <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                {selectedPackage.name}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {selectedPackage.description}
              </p>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {formatINR(selectedPackage.price)}
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase line-through">
                MRP {formatINR(selectedPackage.originalPrice)}
              </div>
              <div className="text-[10px] font-black text-orange-600 uppercase mt-0.5">
                {selectedPackage.period}
              </div>
            </div>
          </div>

          {/* Payment & QR Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left QR Code Box */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-orange-600" />
                <span>Admin Official Payment QR</span>
              </div>
              
              <div className="w-44 h-44 bg-white p-2.5 rounded-lg border border-gray-300 shadow-sm flex items-center justify-center">
                <img
                  src={qrImage}
                  alt="Admin Payment QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-2 border border-emerald-200">
                0% UPI Fee • All Apps Accepted
              </span>
            </div>

            {/* Right UPI Details & Quick Copy */}
            <div className="md:col-span-7 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Official UPI ID
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-100 rounded border border-gray-300 text-xs font-mono font-bold text-slate-900 select-all">
                    {adminUpi}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded flex items-center gap-1 transition-colors"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Account Name:</span>
                  <span className="font-bold text-slate-900">{adminHolder}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Customer Care:</span>
                  <span className="font-bold text-slate-900">+91 {adminPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Validity:</span>
                  <span className="font-bold text-emerald-600">1 Full Year (365 Days)</span>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900">
                💡 <strong>Kaise Pay Karein:</strong> Kisi bhi UPI app (PhonePe, GPay, Paytm) se QR code scan karein aur <strong>{formatINR(selectedPackage.price)}</strong> transfer karein.
              </div>
            </div>

          </div>

          {/* Form: Your Details for instant activation */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Apni Dukaan Ki Jankari Bharein (Instant Setup)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Dukaan / Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kirana Store"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  Aapka Naam (Owner Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chand"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="10 digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  UPI UTR / Transaction No. (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 423891002341"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSendWhatsAppOrder}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs sm:text-sm rounded-sm shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Confirm Order & Send on Admin WhatsApp (+91 {adminPhone})</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthRegister();
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-wider text-xs rounded-sm transition-colors text-center"
              >
                Create Store Account Directly
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold uppercase tracking-wider text-xs rounded-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

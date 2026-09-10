import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  QrCode, 
  PhoneCall, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PricingPackage } from '../../types';
import { formatINR, getWhatsAppDirectUrl } from '../../utils/mediaUpload';

interface PackageOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: PricingPackage | null;
  adminPaymentQrUrl?: string;
  adminUpiId?: string;
  adminAccountHolder?: string;
  adminPhone?: string;
  adminWhatsapp?: string;
  onProceedToRegister: (pkg?: PricingPackage) => void;
}

export const PackageOrderModal: React.FC<PackageOrderModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  adminPaymentQrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=upi://pay?pa=7087033009@paytm&pn=IndianLalaJi%20Official&cu=INR',
  adminUpiId = '7087033009@paytm',
  adminAccountHolder = 'IndianLalaJi Platform (R. K. Mehra)',
  adminPhone = '7087033009',
  adminWhatsapp = '7087033009',
  onProceedToRegister,
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isOpen || !selectedPackage) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(adminUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const whatsappOrderMsg = `Hello IndianLalaJi Team! I would like to order this 1-Year Store Package:\n\n` +
    `*Package Name:* ${selectedPackage.name}\n` +
    `*Price:* ${formatINR(selectedPackage.price)} (Validity: ${selectedPackage.period})\n` +
    `*Admin UPI ID:* ${adminUpiId}\n\n` +
    `Please provide payment verification and website setup instructions. Thank you!`;

  const whatsappUrl = getWhatsAppDirectUrl(adminWhatsapp || adminPhone, whatsappOrderMsg);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-orange-600/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-sm mb-2 border border-orange-500/30">
            <Sparkles className="w-3 h-3" /> Official 1-Year Store Activation
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-['Outfit',sans-serif]">
            Order Single Package: <span className="text-orange-500">{selectedPackage.name}</span>
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Instant verification and dedicated WhatsApp order setup assistance.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          
          {/* Selected Package Summary Card */}
          <div className="bg-orange-50/60 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                Selected Plan
              </span>
              <h4 className="font-bold text-base text-slate-900 mt-1">
                {selectedPackage.name}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-1">
                {selectedPackage.description}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                {formatINR(selectedPackage.price)}
              </div>
              <div className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                {selectedPackage.period} (1 Year)
              </div>
            </div>
          </div>

          {/* Included Features */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Features Included in this Package:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {selectedPackage.features.slice(0, 6).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Payment QR & UPI Section */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-900">
                <QrCode className="w-4 h-4 text-orange-600" />
                <span>Admin Official Payment QR</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Direct Verified UPI
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* QR Image */}
              <div className="w-32 h-32 bg-white rounded-lg border-2 border-orange-300 p-1.5 shrink-0 flex items-center justify-center shadow-xs">
                {adminPaymentQrUrl ? (
                  <img
                    src={adminPaymentQrUrl}
                    alt="Official Payment QR"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode className="w-16 h-16 text-gray-400" />
                )}
              </div>

              {/* UPI ID & Holder Details */}
              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Account Holder</div>
                  <div className="text-xs font-bold text-slate-900 truncate">{adminAccountHolder}</div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Admin Official UPI ID</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="text"
                      readOnly
                      value={adminUpiId}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-mono font-bold text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded flex items-center gap-1 shrink-0 transition-colors"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500">
                  Scan and pay securely using PhonePe, Google Pay, Paytm, or any UPI app.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Send 1-Plan Order on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToRegister(selectedPackage);
              }}
              className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-wider text-xs rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Register Store & Claim This Plan</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </button>
          </div>

          {/* Guarantee Badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-gray-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Support: +91 {adminPhone} ({adminAccountHolder})</span>
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Clock,
  Store,
  CreditCard,
  Truck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Shop } from '../../types';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop?: Shop;
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  shop,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const storeName = shop?.businessName || 'Verified Merchant Store';
  const ownerName = shop?.vendorName || 'Authorized Store Owner';
  const phone = shop?.phone || shop?.whatsapp || 'Direct Store Helpline';
  const address = shop?.address
    ? `${shop.address}, ${shop.city || ''} ${shop.state || ''} ${shop.pincode ? `- ${shop.pincode}` : ''}`
    : 'Local Store Coordinates';

  return (
    <div
      id="terms-and-conditions-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="terms-and-conditions-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800/60">
                  Store Policies & Legal
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white font-['Outfit',sans-serif] truncate">
                Terms & Conditions (T&C)
              </h3>
            </div>
          </div>

          {/* Close (X) Button */}
          <button
            id="close-terms-modal-x-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close Terms and Conditions Modal"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 text-slate-800 text-xs sm:text-sm leading-relaxed bg-gray-50/50 flex-1">
          {/* Store Identification Banner */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="font-bold text-slate-900 text-sm sm:text-base">{storeName}</span>
              </div>
              <div className="flex items-center gap-2">
                {shop?.termsAndConditions?.trim() ? (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Vendor Verified Policies
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                    Standard Store Policies
                  </span>
                )}
                <span className="text-[11px] text-gray-500 font-mono">
                  Proprietor: {ownerName}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600">
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Contact / WhatsApp: +91 {phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="truncate">Address: {address}</span>
              </div>
            </div>
          </div>

          {/* VENDOR CUSTOM TERMS & CONDITIONS (IF WRITTEN) */}
          {shop?.termsAndConditions?.trim() ? (
            <div className="space-y-4">
              {shop.termsAndConditions
                .split(/\n\s*\n/)
                .map((s) => s.trim())
                .filter(Boolean)
                .map((sec, idx) => {
                  const lines = sec.split('\n').map((l) => l.trim()).filter(Boolean);
                  if (lines.length === 0) return null;

                  const firstLine = lines[0];
                  const isHeading = /^(#|\d+\.|[A-Z\s]{4,}|[A-Za-z\s]+:)/.test(firstLine);
                  const heading = isHeading ? firstLine.replace(/^#+\s*/, '') : `Clause ${idx + 1}`;
                  const bodyLines = isHeading ? lines.slice(1) : lines;

                  return (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                        <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-black shrink-0">
                          {idx + 1}
                        </div>
                        <h4 className="leading-snug">{heading}</h4>
                      </div>
                      <div className="pl-8 space-y-1.5 text-xs text-gray-600 leading-relaxed">
                        {bodyLines.length > 0 ? (
                          bodyLines.map((line, lIdx) => {
                            const isBullet = /^[-*•]\s+/.test(line);
                            if (isBullet) {
                              const bulletText = line.replace(/^[-*•]\s+/, '');
                              return (
                                <div key={lIdx} className="flex items-start gap-2 text-slate-700">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                  <span>{bulletText}</span>
                                </div>
                              );
                            }
                            return <p key={lIdx} className="text-gray-600">{line}</p>;
                          })
                        ) : (
                          <p className="text-gray-600">{firstLine}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            /* DEFAULT STANDARD POLICIES (WHEN VENDOR HAS NOT WRITTEN CUSTOM TERMS YET) */
            <>
              {/* Clause 1: Order Placement & Flow */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-black">
                    1
                  </div>
                  <h4>Order Placement & Catalogue Inquiries (ऑर्डर व पूछताछ प्रक्रिया)</h4>
                </div>
                <p className="text-gray-600 pl-8 text-xs leading-relaxed">
                  Customers can browse products, services, and courses through either <strong>E-Commerce Mode</strong> or <strong>Catalogue Mode</strong>. In both modes, users can add multiple items to their cart, provide their contact and delivery details, and submit a consolidated order/inquiry bill directly to the merchant via WhatsApp or phone.
                </p>
                <div className="pl-8 text-[11px] text-gray-500 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Order acceptance is confirmed directly by the store proprietor upon reviewing item availability.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>In Catalogue Mode, custom quotations or bulk pricing are negotiated directly without platform interference.</span>
                  </div>
                </div>
              </div>

              {/* Clause 2: Direct Payments & Zero Middleman */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                    2
                  </div>
                  <h4>Payment Policy: 100% Direct & 0% Commission (सीधा भुगतान)</h4>
                </div>
                <p className="text-gray-600 pl-8 text-xs leading-relaxed">
                  All transactions occur directly between the buyer and <strong>{storeName}</strong>. Payments can be settled via direct verified UPI QR code (Google Pay, PhonePe, Paytm, BHIM), Net Banking, or Cash on Delivery (COD) as mutually agreed.
                </p>
                <div className="pl-8 text-[11px] text-gray-500 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Zero commission is deducted from the merchant, ensuring transparent direct store prices.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Always verify the merchant's UPI ID ({shop?.upiId || 'Direct UPI'}) and business name before transferring funds.</span>
                  </div>
                </div>
              </div>

              {/* Clause 3: Delivery & Dispatch */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
                    3
                  </div>
                  <h4>Dispatch, Fulfillment & Store Pickup (डिलीवरी एवं समय सीमा)</h4>
                </div>
                <p className="text-gray-600 pl-8 text-xs leading-relaxed">
                  Fulfillment timelines, local store pickup, or courier dispatch are coordinated directly by the store proprietor. Delivery charges (if applicable) are communicated transparently during order confirmation.
                </p>
              </div>

              {/* Clause 4: Returns, Cancellations & Grievance */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
                    4
                  </div>
                  <h4>Returns, Replacements & Cancellations (वापसी एवं रद्दीकरण)</h4>
                </div>
                <p className="text-gray-600 pl-8 text-xs leading-relaxed">
                  If an item is damaged or defective upon receipt, please notify the merchant within 24 hours of delivery with photographic evidence. Return and replacement policies are governed by the merchant's physical shop policy.
                </p>
              </div>
            </>
          )}

          {/* Clause 5: Technology Platform Disclaimer (Always retained) */}
          <div className="bg-orange-50/70 p-4 rounded-xl border border-orange-200/80 space-y-2">
            <div className="flex items-center gap-2 text-orange-950 font-bold text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
              <h4>Technology Platform & Data Notice (तकनीकी उत्तरदायित्व अस्वीकरण)</h4>
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              <strong>IndianLalaJi.com</strong> is a software-as-a-service (SaaS) digital catalogue provider. IndianLalaJi does not hold customer funds, process private financial transactions, or store sensitive banking passwords/OTPs. All commercial agreements, quality assurance, and guarantees are the direct responsibility of the respective merchant.
            </p>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-gray-500 hidden sm:block">
            Last Updated: {shop?.termsUpdatedAt || `${new Date().getFullYear()}`} • {storeName}
          </div>
          <button
            id="close-terms-modal-bottom-btn"
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm ml-auto active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Close (समझ गए / बंद करें)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

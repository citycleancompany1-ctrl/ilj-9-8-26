import React, { useState } from 'react';
import { 
  QrCode, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  ShieldCheck, 
  Share2, 
  X, 
  Sparkles,
  Phone,
  MapPin,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Shop } from '../../types';

interface DukaanQrStandeeModalProps {
  shop: Shop;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'STANDEE' | 'SCANNERS' | 'QR';
}

export const DukaanQrStandeeModal: React.FC<DukaanQrStandeeModalProps> = ({
  shop,
  isOpen,
  onClose,
  initialTab = 'STANDEE',
}) => {
  const [activeTab, setActiveTab] = useState<'STANDEE' | 'QR'>(
    initialTab === 'SCANNERS' || initialTab === 'QR' ? 'QR' : 'STANDEE'
  );
  const [copiedLink, setCopiedLink] = useState<'WEBSITE' | 'UPI' | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://indianlalaji.com';
  const websiteUrl = `${origin}/?shop=${encodeURIComponent(shop.shopId)}`;
  const websiteQrImg = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(websiteUrl)}&margin=10`;

  const handleCopy = (text: string, type: 'WEBSITE' | 'UPI') => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handlePrintStandee = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `Namaste! Humari dukaan "${shop.businessName}" ki digital website yahan se open karein:\n\n👉 ${websiteUrl}\n\nOnline catalogue dekhein aur WhatsApp par direct order karein!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      
      {/* Print-specific style to isolate the standee card cleanly on A4 paper */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-dukaan-standee, #printable-dukaan-standee * {
            visibility: visible !important;
          }
          #printable-dukaan-standee {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 190mm !important;
            margin: 0 auto !important;
            padding: 10mm !important;
            background: white !important;
            border: 3px solid #ea580c !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header Bar (No-Print) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight font-['Outfit',sans-serif]">
                  Dukaan Counter QR Standee
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Website QR
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {shop.businessName} • Counter Standee & Official Website QR Code
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector (No-Print) */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2.5 gap-2 shrink-0 no-print">
          <button
            type="button"
            onClick={() => setActiveTab('STANDEE')}
            className={`py-2.5 px-4 rounded-t-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border-t-2 transition-all cursor-pointer ${
              activeTab === 'STANDEE'
                ? 'bg-white border-orange-600 text-orange-600 shadow-xs'
                : 'border-transparent text-gray-500 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>1. Dukaan Counter Standee (Print Ready A4)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('QR')}
            className={`py-2.5 px-4 rounded-t-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border-t-2 transition-all cursor-pointer ${
              activeTab === 'QR'
                ? 'bg-white border-orange-600 text-orange-600 shadow-xs'
                : 'border-transparent text-gray-500 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>2. Website QR Code & Links</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50/50">

          {/* TAB 1: PRINTABLE DUKAAN COUNTER STANDEE */}
          {activeTab === 'STANDEE' && (
            <div className="space-y-6">
              
              {/* Instructions Banner (No-Print) */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 no-print shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-orange-950">
                      Counter Standee Printout Kaise Kaam Karta Hai?
                    </h4>
                    <p className="text-xs text-orange-900/80 leading-relaxed">
                      Neeche diye gaye standee ko <strong>"Print Standee (A4)"</strong> button se print karke apni dukaan ke counter par lagayein. Customer camera se scan karte hi seedha aapki online dukaan ki website khul jayegi!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePrintStandee}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Standee (A4)</span>
                  </button>
                  <a
                    href={websiteQrImg}
                    download={`${shop.businessName.replace(/\s+/g, '_')}_Website_QR.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-slate-800 border border-gray-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Download Website QR Image"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* THE OFFICIAL DUKAAN STANDEE (Print-Ready Component) */}
              <div className="flex justify-center">
                <div 
                  id="printable-dukaan-standee" 
                  className="bg-white rounded-3xl border-4 border-orange-500 shadow-xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center relative overflow-hidden"
                >
                  {/* Top Indian Tricolor Ribbon */}
                  <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
                  
                  {/* Brand Header */}
                  <div className="pt-2 space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-800 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-0.5 rounded-full shadow-xs">
                      <ShieldCheck className="w-3 h-3 text-orange-600" />
                      <span>Official Digital Dukaan • IndianLalaJi</span>
                    </div>

                    {/* Logo & Business Name */}
                    <div className="flex flex-col items-center justify-center gap-2 pt-1">
                      {shop.logoUrl ? (
                        <img 
                          src={shop.logoUrl} 
                          alt={shop.businessName} 
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                          {shop.businessName.charAt(0)}
                        </div>
                      )}
                      
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] leading-tight">
                          {shop.businessName}
                        </h2>
                        <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">
                          {shop.tagline || `${shop.category} • ${shop.city}, ${shop.state}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QR SCANNER CONTAINER (WEBSITE QR ONLY) */}
                  <div className="relative p-4 sm:p-5 bg-gradient-to-b from-orange-50/60 to-amber-50/40 rounded-2xl border-2 border-dashed border-orange-300 inline-block mx-auto shadow-inner">
                    <img
                      src={websiteQrImg}
                      alt="Dukaan Website QR Code"
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto rounded-xl shadow-xs bg-white p-2"
                    />

                    {/* Badge Under QR */}
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-slate-900 text-white px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                      <Globe className="w-3.5 h-3.5 text-orange-400" />
                      <span>Scan To Open Dukaan Website</span>
                    </div>
                  </div>

                  {/* HOW TO SCAN INSTRUCTIONS */}
                  <div className="bg-slate-900 text-white rounded-2xl p-3.5 space-y-1 text-center shadow-sm">
                    <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center justify-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Camera Ya Google Lens Se Scan Karein</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-snug">
                      Online catalogue dekhein, items select karein aur WhatsApp par direct order karein!
                    </p>
                  </div>

                  {/* FOOTER: Direct UPI & Contact */}
                  <div className="pt-2 border-t border-gray-200 space-y-2 text-left text-xs">
                    {shop.upiId && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900">
                          Direct 0% UPI Payment:
                        </span>
                        <span className="font-mono font-bold text-emerald-700 text-xs truncate">
                          {shop.upiId}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-gray-600 px-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-orange-600" />
                        <span>{shop.phone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-600" />
                        <span className="truncate max-w-[160px]">{shop.address}, {shop.city}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pt-1">
                    Powered by IndianLalaJi.com • Bharat Ka Digital Vyapar
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: WEBSITE QR CODE & SHARING */}
          {activeTab === 'QR' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl border-2 border-orange-400 p-6 shadow-md flex flex-col space-y-5 text-center">
                
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-800 border border-orange-200 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    <Globe className="w-3.5 h-3.5 text-orange-600" />
                    <span>Official Website QR Code</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight font-['Outfit',sans-serif]">
                    Dukaan Ki Website Open Karein
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Customer is QR code ko scan karke direct aapki online digital dukaan par pahunch jayenge aur catalogue dekhkar order kar sakenge.
                  </p>
                </div>

                {/* QR Display */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-block mx-auto shadow-inner">
                  <img
                    src={websiteQrImg}
                    alt="Store Website QR Code"
                    className="w-56 h-56 object-contain rounded-xl bg-white p-2 shadow-xs"
                  />
                </div>

                {/* URL Field with Copy */}
                <div className="p-2.5 bg-gray-100 rounded-xl text-left text-xs font-mono truncate text-gray-700 flex items-center justify-between gap-2">
                  <span className="truncate flex-1">{websiteUrl}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(websiteUrl, 'WEBSITE')}
                    className="px-3 py-1.5 bg-white hover:bg-orange-50 text-orange-700 font-bold uppercase text-[11px] rounded-lg border border-gray-200 shrink-0 cursor-pointer transition-colors"
                  >
                    {copiedLink === 'WEBSITE' ? 'Copied! ✓' : 'Copy'}
                  </button>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={websiteQrImg}
                    download={`${shop.businessName.replace(/\s+/g, '_')}_Website_QR.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download QR</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share WhatsApp</span>
                  </button>
                </div>

                {/* Direct Store Link */}
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 text-xs font-bold text-slate-600 hover:text-orange-600 inline-flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Open Store Website in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer (No-Print) */}
        <div className="p-4 bg-gray-100 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 no-print text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Yeh official high-resolution QR code hai jo sabhi mobile phone cameras par 100% kaam karta hai.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-wider text-xs cursor-pointer transition-colors"
          >
            Done / Close
          </button>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { 
  Tag, 
  Check, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  ShieldCheck, 
  PhoneCall 
} from 'lucide-react';
import { PricingPackage } from '../../types';
import { formatINR } from '../../utils/mediaUpload';

interface PricingPageProps {
  pricingPackages: PricingPackage[];
  onOpenAuth: (tab?: 'LOGIN' | 'REGISTER' | 'ADMIN') => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  pricingPackages,
  onOpenAuth,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
          <Tag className="w-3.5 h-3.5" /> 1-Year Official LalaJi Store Plan
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight font-['Outfit',sans-serif]">
          1-Year All-In-One <span className="text-orange-600">Digital Dukaan Plan</span>
        </h1>
        <p className="text-gray-600 text-sm">
          Sabhi features included hain 1 saal (365 Din) ke liye. Unlimited products, direct WhatsApp shopping, 0% UPI payments aur priority support.
        </p>
      </div>

      {/* Single 1-Year Master Plan Card */}
      {(() => {
        const pkg = (pricingPackages && pricingPackages.length > 0) ? pricingPackages[0] : {
          id: 'pkg_annual_master',
          name: '1-Year Official LalaJi Store Plan',
          originalPrice: 4999,
          price: 1499,
          period: 'Per Year (1 Year Validity - 365 Days)',
          badge: '1-YEAR ALL-IN-ONE PLAN 🇮🇳',
          description: 'Complete mobile-first digital store solution with 1-Year validity, WhatsApp order engine, 0% UPI QR, photo gallery, videos, and full vendor dashboard.',
          features: [
            '1 Full Year (365 Days) Store Hosting & Live Validity',
            'Dedicated Unique Shop Link (e.g. indianlalaji.com/?shop=SHP01234454)',
            'Unlimited Products & Services Showcase',
            '1-Click WhatsApp Direct Ordering & Cart System',
            '0% Commission Direct UPI QR Code Payment Setup',
            'Up to 8 YouTube Video Tutorials & Demos Embeds',
            'HD Photo Gallery with Full Masonry Showcase',
            'Dynamic Theme & Color Palette Switcher',
            '24/7 Mobile Vendor Dashboard (Live Price, Stock & Description Updates)',
            'Customer Inquiries, Leads Box & Direct Calling',
            'Admin Verified Official Store Badge & Google Maps Location',
            'Priority Phone & WhatsApp Customer Support (7087033009)',
          ],
          isPopular: true,
        };

        return (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative bg-white border-2 border-orange-600 shadow-xl">
              {pkg.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-sm shadow-md whitespace-nowrap">
                  {pkg.badge}
                </span>
              )}

              <div className="space-y-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif] uppercase tracking-tight">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {pkg.description}
                  </p>
                </div>

                <div className="py-3.5 border-y border-gray-100 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 font-['Outfit',sans-serif]">
                      {formatINR(pkg.price)}
                    </span>
                    <span className="text-sm text-gray-400 line-through font-semibold">
                      {formatINR(pkg.originalPrice)}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      SAVE {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}%
                    </span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    {pkg.period}
                  </div>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-2">
                  {pkg.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('REGISTER')}
                  className="w-full py-3.5 rounded-sm font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 active:scale-[0.99]"
                >
                  <span>Select & Register Store (1-Year Plan)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-2">
                  1-Year validity with 1-Click WhatsApp orders, 0% UPI QR code, and full mobile dashboard.
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Support Box */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Custom Package Ya Plan Enquiry?</h3>
          <p className="text-xs text-gray-500">
            Aap hamare support team se baat karke direct payment verification aur setup assistance le sakte hain.
          </p>
        </div>
        <a
          href="https://wa.me/917087033009?text=Namaste%20IndianLalaJi%20Pricing%20Help"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-3 rounded-sm bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <PhoneCall className="w-4 h-4 text-orange-400" />
          <span>Call / WhatsApp: 7087033009</span>
        </a>
      </div>

    </div>
  );
};

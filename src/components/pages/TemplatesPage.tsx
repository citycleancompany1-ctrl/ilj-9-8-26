import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Check, 
  Eye, 
  ArrowRight,
} from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../../data/initialData';

interface TemplatesPageProps {
  onNavigate: (view: string, shopId?: string) => void;
  onOpenAuth: (tab?: 'LOGIN' | 'REGISTER' | 'ADMIN') => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  onNavigate,
  onOpenAuth,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const filteredCategories = BUSINESS_CATEGORIES.filter((cat) => {
    if (selectedCategoryFilter === 'ALL') return true;
    return cat.id === selectedCategoryFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-900 border border-orange-300 text-[10px] font-black uppercase tracking-[0.2em] px-3.5 py-1 rounded-full shadow-xs">
          <Layers className="w-3.5 h-3.5 text-orange-700" />
          <span>Official LalaJi Business Store Templates</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight font-['Outfit',sans-serif]">
          Store <span className="text-orange-600">Templates</span>
        </h1>

        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Choose a category tailored to your business. Every business comes with a tailored layout, mobile-friendly design, 15 customizable sections, direct WhatsApp ordering, and zero-fee UPI payment support ready out of the box.
        </p>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 max-w-5xl mx-auto scrollbar-none py-2 px-1">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
              selectedCategoryFilter === 'ALL'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            All Templates ({BUSINESS_CATEGORIES.length})
          </button>
          {BUSINESS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                selectedCategoryFilter === cat.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              #{cat.number} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CATEGORY TEMPLATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat, idx) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-orange-500 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-md">
                  Template #{idx + 1}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Mobile-Ready
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight font-['Outfit',sans-serif]">
                {cat.name}
              </h3>

              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 space-y-1.5 text-xs text-slate-600">
                <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Features Included:</div>
                <div className="text-[11px] text-gray-500 space-y-0.5 font-medium">
                  <div>✓ Custom Hero with WhatsApp Ordering</div>
                  <div>✓ Products & Services with Invoice Generator</div>
                  <div>✓ 15 Interactive Sections Configurable in Vendor Panel</div>
                  <div>✓ Direct UPI QR Code & Location Map</div>
                  <div>✓ Fast PWA Mobile App Support</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onNavigate('stores')}
                className="py-2.5 px-3 text-center text-xs font-bold uppercase tracking-wider text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                <span>View Sample</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('REGISTER')}
                className="py-2.5 px-3 text-center text-xs font-black uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-200" />
                <span>Build Free</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TRUST & ONBOARDING STRIP */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs font-black uppercase tracking-wider text-orange-400">Included With Every Template</div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif]">
            1-Year Official LalaJi Store Plan Included
          </h2>
          <p className="text-xs text-gray-400 max-w-xl">
            Direct WhatsApp orders, instant UPI payments, unlimited products, and super-fast mobile experience.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenAuth('REGISTER')}
          className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer shrink-0 transition-transform active:scale-98"
        >
          <span>Launch Your Store Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

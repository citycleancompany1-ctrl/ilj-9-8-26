import React from 'react';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Check,
  ShoppingBag,
  Plus,
  Minus,
  Heart,
  Flame,
  Droplets,
  Cpu,
  Leaf,
  Gift,
  Sun,
  Award,
  Zap,
  Tag,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  QrCode,
  MapPin,
  ChevronRight,
  MessageSquare,
  EyeOff,
} from 'lucide-react';
import { IndianTheme } from '../../data/indianThemes';
import { Shop, ProductItem, CartItem } from '../../types';
import { formatINR, getWhatsAppDirectUrl } from '../../utils/mediaUpload';

interface ThemedHeroSectionProps {
  theme: IndianTheme;
  shop: Shop;
  onExploreProducts: () => void;
  onOpenUpiQr?: () => void;
}

export const ThemedHeroSection: React.FC<ThemedHeroSectionProps> = ({
  theme,
  shop,
  onExploreProducts,
  onOpenUpiQr,
}) => {
  const archetype = theme.layoutArchetype;

  // 1. ROYAL PALACE (Bharat Royal)
  if (archetype === 'royal-palace') {
    return (
      <section className="relative overflow-hidden pt-6 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Palace Arched Container */}
          <div className="relative rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-950 via-slate-900 to-amber-900 text-amber-100 p-6 sm:p-10 shadow-2xl overflow-hidden">
            {/* Ornate corner filigrees */}
            <div className="absolute top-3 left-3 text-amber-400/40 text-xs font-serif font-black tracking-widest uppercase">
              ✦ ❖ ✦
            </div>
            <div className="absolute top-3 right-3 text-amber-400/40 text-xs font-serif font-black tracking-widest uppercase">
              ✦ ❖ ✦
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              {/* Grand Royal Heraldic Emblem */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-black uppercase tracking-widest shadow-inner">
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>राजसी स्वागतम् • Grand Royal Store</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-serif max-w-3xl">
                {shop.businessName}
              </h1>

              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-1" />

              <p className="text-sm sm:text-base text-amber-200/90 max-w-2xl font-medium leading-relaxed">
                {shop.description || 'Shahi Parampara, Shuddhata aur Vishwas. Aapki seva mein shreshtha utpad direct store rate par uplabdh.'}
              </p>

              {/* Royal Pedestal Stat Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl pt-3">
                <div className="p-2.5 rounded-xl bg-amber-900/40 border border-amber-500/40 text-center">
                  <div className="text-amber-400 font-serif font-black text-base sm:text-lg">100% Shuddh</div>
                  <div className="text-[10px] text-amber-200/70 font-semibold uppercase tracking-wider">Purity Assured</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-900/40 border border-amber-500/40 text-center">
                  <div className="text-amber-400 font-serif font-black text-base sm:text-lg">0% Shahi Rate</div>
                  <div className="text-[10px] text-amber-200/70 font-semibold uppercase tracking-wider">Direct Merchant</div>
                </div>
                <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-amber-900/40 border border-amber-500/40 text-center">
                  <div className="text-amber-400 font-serif font-black text-base sm:text-lg">Fast Seva</div>
                  <div className="text-[10px] text-amber-200/70 font-semibold uppercase tracking-wider">Royal Delivery</div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onExploreProducts}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer transition-transform hover:scale-105"
                >
                  <Crown className="w-4 h-4 text-slate-950" />
                  <span>Explore Shahi Collection</span>
                </button>
                {onOpenUpiQr && (
                  <button
                    onClick={onOpenUpiQr}
                    className="px-5 py-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-400/40 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>0% UPI Shahi Pay</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. SACRED GHAT (Kashi Heritage)
  if (archetype === 'sacred-ghat') {
    return (
      <section className="relative overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Split Ghat & Sandstone Temple Layout */}
          <div className="rounded-3xl border-2 border-orange-400/80 bg-gradient-to-br from-stone-900 via-orange-950 to-amber-950 text-orange-100 p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Pillar: Blessings & Vedic Story */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-600/30 border border-orange-400/60 text-orange-300 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span>काशी विश्वनाथ कृपा • Shuddhata & Satvikta</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white font-serif tracking-tight">
                  {shop.businessName}
                </h1>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {shop.description || 'Pavitra Ghaton ki shanti aur paramparik vishwas. Shuddh Desi utpad sidhe aapke ghar tak 100% pramanikta ke sath.'}
                </p>

                {/* Vedic Trust Pillars */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-orange-200">
                  <span className="px-2.5 py-1 rounded bg-orange-900/60 border border-orange-700/50">🪔 100% Satvik</span>
                  <span className="px-2.5 py-1 rounded bg-orange-900/60 border border-orange-700/50">🌾 Sidhe Kisan / Karigar</span>
                  <span className="px-2.5 py-1 rounded bg-orange-900/60 border border-orange-700/50">📜 Khata Bahi Guarantee</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onExploreProducts}
                    className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-102"
                  >
                    <span>Pavitra Utpad Dekhein</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Pillar: Sandstone Spotlight Frame */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border-2 border-orange-400/60 bg-amber-950/60 p-4 backdrop-blur-sm space-y-3">
                  <div className="flex items-center justify-between text-xs text-orange-300 font-bold border-b border-orange-700/40 pb-2">
                    <span>✨ Aaj Ki Vishesh Shuddhata</span>
                    <span className="text-[10px] bg-orange-500/30 px-2 py-0.5 rounded text-orange-200">Verified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={shop.logoUrl}
                      alt={shop.businessName}
                      className="w-16 h-16 rounded-xl object-cover border border-orange-400/40 bg-stone-900"
                    />
                    <div>
                      <div className="text-sm font-bold text-white font-serif">{shop.businessName}</div>
                      <div className="text-xs text-orange-300 font-mono">{shop.shopId}</div>
                      <div className="text-[11px] text-stone-300 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-400" />
                        <span>{shop.city}, {shop.state}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-orange-900/30 border border-orange-500/20 text-[11px] text-stone-300 text-center font-medium">
                    "सत्यं शिवं सुन्दरम् - Har grahak hamara parivar hai."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. JHAROKHA BOUTIQUE (Jaipur Haveli)
  if (archetype === 'jharokha-boutique') {
    return (
      <section className="relative overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Asymmetrical Jharokha Archway Boutique Banner */}
          <div className="rounded-3xl border-2 border-rose-300/80 bg-gradient-to-r from-rose-950 via-pink-950 to-slate-950 text-rose-100 p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/60 text-rose-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Gulabi Nagari Curated Collection</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white font-serif tracking-tight">
                  {shop.businessName}
                </h1>

                <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed font-light">
                  {shop.description || 'Haveli ke jharokhon se nikli khubsurat kalakari. Handcrafted block prints, designer fashion aur ethnic elegance.'}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={onExploreProducts}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/25 cursor-pointer transition-transform hover:scale-105"
                  >
                    View Boutique Lookbook
                  </button>
                  <span className="text-xs text-rose-300 font-serif italic">🌸 Pure Jaipur Craft</span>
                </div>
              </div>

              {/* Overlapping Lookbook Cards Graphic */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 flex items-center justify-center">
                <div className="absolute w-36 h-48 rounded-2xl bg-rose-800/40 border border-rose-400/40 rotate-6 shadow-md" />
                <div className="absolute w-36 h-48 rounded-2xl bg-rose-900/60 border border-rose-400/60 -rotate-3 shadow-lg" />
                <div className="relative w-36 h-48 rounded-2xl overflow-hidden border-2 border-rose-300 shadow-xl bg-rose-950">
                  <img
                    src={shop.logoUrl}
                    alt={shop.businessName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-center">
                    <span className="text-[10px] font-bold text-rose-200 uppercase tracking-widest">Handcrafted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 4. FLOWING RIVER (Ganga Serene)
  if (archetype === 'flowing-river') {
    return (
      <section className="relative overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Panoramic Wave-Cut River Flow Banner */}
          <div className="rounded-3xl border-2 border-teal-400/70 bg-gradient-to-r from-teal-950 via-slate-900 to-cyan-950 text-teal-100 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/50 text-teal-300 text-xs font-bold uppercase tracking-wider">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                  <span>Purity & Flowing Freshness Guaranteed</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {shop.businessName}
                </h1>

                <p className="text-xs sm:text-sm text-teal-200/90 max-w-xl leading-relaxed">
                  {shop.description || 'Shuddhata aur taazgi ka sangam. Daily essentials, dairy aur hygiene products sidhe store se bina kisi milawat ke.'}
                </p>

                {/* Freshness Metrics */}
                <div className="flex items-center gap-4 pt-1 text-xs text-teal-300">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Lab Verified Purity</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>0% Cold Chain Break</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onExploreProducts}
                    className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer transition-transform hover:scale-102"
                  >
                    <Droplets className="w-4 h-4 text-cyan-300" />
                    <span>Order Pure Essentials</span>
                  </button>
                </div>
              </div>

              {/* River Flow Freshness Badge */}
              <div className="w-full sm:w-56 p-4 rounded-2xl bg-teal-900/40 border border-teal-500/30 text-center space-y-2">
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Freshness Meter</div>
                <div className="text-3xl font-black text-white">100%</div>
                <div className="w-full bg-teal-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 to-cyan-300 h-full w-full animate-pulse" />
                </div>
                <div className="text-[10px] text-teal-300">Daily Stock Refreshed Today</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 5. CYBER TERMINAL (Deccan Neo)
  if (archetype === 'cyber-terminal') {
    return (
      <section className="relative overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Obsidian Tech Bento Terminal */}
          <div className="rounded-2xl border-2 border-amber-500/80 bg-slate-950 text-white p-6 sm:p-8 shadow-2xl font-mono">
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-amber-400 font-bold ml-2">SYSTEM://{shop.shopId}.in</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>STATUS: ONLINE [0ms LATENCY]</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3 text-left">
                <div className="inline-block px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  ⚡ HIGH-PERFORMANCE TECH HUB
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wider font-sans">
                  {shop.businessName}
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {shop.description || 'Cutting-edge electronics, genuine hardware components aur high-speed gadgets direct store discount par.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 font-sans">
                  <button
                    onClick={onExploreProducts}
                    className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-transform hover:scale-102"
                  >
                    <Cpu className="w-4 h-4 text-slate-950" />
                    <span>View Spec Matrix & Stock</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-4 bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">TELEMETRY DATA</div>
                <div className="flex justify-between text-slate-300">
                  <span>COMMISSION:</span>
                  <span className="text-emerald-400 font-bold">0.00%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>DISPATCH:</span>
                  <span className="text-amber-400 font-bold">IMMEDIATE</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>WARRANTY:</span>
                  <span className="text-blue-400 font-bold">100% GENUINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 6. MANDIR GOPURAM (Ayodhya Divine)
  if (archetype === 'mandir-gopuram') {
    return (
      <section className="relative overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Temple Shikhar Mandap Arch */}
          <div className="rounded-3xl border-2 border-yellow-400 bg-gradient-to-b from-orange-950 via-red-950 to-amber-950 text-amber-100 p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/60 text-yellow-300 text-xs font-black uppercase tracking-widest">
                <Sun className="w-4 h-4 text-yellow-400" />
                <span>॥ ॐ श्री गणेशाय नमः ॥ • शुभ दर्शन व सेवा</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white font-serif tracking-tight">
                {shop.businessName}
              </h1>

              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent my-1" />

              <p className="text-xs sm:text-sm text-amber-200/90 max-w-2xl leading-relaxed font-serif">
                {shop.description || 'Pavitra Dharmik Pustakein, Shuddh Prasad, Poojan Samagri aur Murtiyan. Sampoorn bhakti bhav ke sath sidhe mandir shetra se.'}
              </p>

              <div className="flex items-center gap-2 text-xs text-yellow-300 pt-1">
                <span>🛕 100% Shuddh Prasad</span>
                <span>•</span>
                <span>🪔 Satvik Samagri</span>
                <span>•</span>
                <span>🔔 Shubh Sankalp Order</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onExploreProducts}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/30 cursor-pointer transition-transform hover:scale-105"
                >
                  <Sun className="w-4 h-4 text-yellow-200" />
                  <span>Darshan & Prasad Order Karein</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 7. GLACIER MINIMAL (Himalaya Pure)
  if (archetype === 'glacier-minimal') {
    return (
      <section className="relative overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Swiss-Scandinavian Ultra-Clean White Hero */}
          <div className="rounded-2xl border border-sky-200 bg-white text-slate-900 p-6 sm:p-10 shadow-sm text-left">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>CLINICAL GRADE PURITY // LAB TESTED</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {shop.businessName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {shop.description || 'Pristine mountain clarity and medical-grade precision. Zero additives, batch-tested herbs, pharmacy supplies and natural nutrition.'}
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center max-w-md">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-base font-black text-sky-700">99.9%</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase">Purity Ratio</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-base font-black text-sky-700">0</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase">Adulterants</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-base font-black text-sky-700">100%</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase">Traceable</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onExploreProducts}
                  className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <span>Explore Verified Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 8. CARNIVAL BAZAAR (Utsav Vibrant)
  if (archetype === 'carnival-bazaar') {
    return (
      <section className="relative overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Festive Carnival Mela Banner */}
          <div className="rounded-3xl border-3 border-amber-400 bg-gradient-to-r from-rose-900 via-amber-900 to-emerald-900 text-white p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
            <div className="relative z-10 space-y-4 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md animate-bounce">
                <Gift className="w-4 h-4" />
                <span>🎉 त्यौहार महा बचत मेला • Flat Store Discounts!</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-amber-200 tracking-tight">
                {shop.businessName}
              </h1>

              <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl leading-relaxed">
                {shop.description || 'Har din tyohar jaisa jashn! Mithaiyan, gift hampers, decorations aur party samagri par dhamaka deals direct shopkeeper rate par.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white">🎁 Free Gift Packing</span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white">⚡ Same Day Express</span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white">0% Middleman Cut</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onExploreProducts}
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl cursor-pointer transition-transform hover:scale-105"
                >
                  🎊 Loot Lo Festive Deals!
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 9. BACKWATER RETREAT (Kerala Palms)
  if (archetype === 'backwater-retreat') {
    return (
      <section className="relative overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Tropical Backwater & Spice Garden Canopy Banner */}
          <div className="rounded-3xl border-2 border-emerald-400/80 bg-gradient-to-br from-emerald-950 via-stone-900 to-green-950 text-emerald-100 p-6 sm:p-10 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-left">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Farm-to-Doorstep Organic Fresh</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white font-serif tracking-tight">
                  {shop.businessName}
                </h1>

                <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-light">
                  {shop.description || 'God’s Own Country ke organic bagan se sidhe aapki rasoi tak. Taaza masale, herbal wellness aur chemical-free utpad.'}
                </p>

                <div className="flex items-center gap-3 pt-1 text-xs text-emerald-300">
                  <span>🌿 100% Certified Organic</span>
                  <span>•</span>
                  <span>🥥 Cold Pressed & Raw</span>
                  <span>•</span>
                  <span>🤝 Direct Farmer Fair Price</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onExploreProducts}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-transform hover:scale-102"
                  >
                    <Leaf className="w-4 h-4 text-emerald-300" />
                    <span>Order Farm-Fresh Harvest</span>
                  </button>
                </div>
              </div>

              {/* Eco Crate Guarantee Seal */}
              <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 text-center space-y-1 w-full md:w-48 shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white font-serif">Earth Purity Seal</div>
                <div className="text-[10px] text-emerald-300">Zero Chemical Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 10. RUNWAY CHIC (Bombay Modern)
  return (
    <section className="relative overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Metropolitan Magazine Runway Layout */}
        <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-r from-black via-indigo-950 to-purple-950 text-white p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[11px] font-bold uppercase tracking-widest">
                <span>METROPOLITAN LUXURY // ISSUE 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
                {shop.businessName}
              </h1>

              <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed font-light">
                {shop.description || 'High-street fashion, contemporary lifestyle and premium designer accessories. Curated luxury with instant VIP doorstep delivery.'}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onExploreProducts}
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 cursor-pointer transition-all hover:scale-105"
                >
                  Explore Collection
                </button>
                <span className="text-xs text-purple-300 tracking-wider">VIP Concierge Ready</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center space-y-2 w-full md:w-56 shrink-0">
              <div className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Direct Access</div>
              <div className="text-2xl font-black text-white">0% MARKUP</div>
              <div className="text-[11px] text-purple-200">Wholesale Merchant Price Direct to Consumer</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------------------
// TRUST STRIP RENDERER: Unique Layout Structure for Every Theme
// ----------------------------------------------------------------------------------

interface ThemedTrustStripProps {
  theme: IndianTheme;
  shop: Shop;
}

export const ThemedTrustStrip: React.FC<ThemedTrustStripProps> = ({ theme, shop }) => {
  const archetype = theme.layoutArchetype;

  // 1. Royal Medallions
  if (archetype === 'royal-palace') {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-serif font-black flex items-center justify-center shrink-0 shadow-sm text-sm">
              👑
            </div>
            <div>
              <div className="text-xs font-black uppercase text-amber-950 font-serif">100% Shahi Shuddhata</div>
              <div className="text-[11px] text-amber-800">Direct Karigar & Royal Heritage Grade</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-serif font-black flex items-center justify-center shrink-0 shadow-sm text-sm">
              ₹0
            </div>
            <div>
              <div className="text-xs font-black uppercase text-amber-950 font-serif">0% Middleman Tax</div>
              <div className="text-[11px] text-amber-800">Direct Shopkeeper Billing Guarantee</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-serif font-black flex items-center justify-center shrink-0 shadow-sm text-sm">
              ⚡
            </div>
            <div>
              <div className="text-xs font-black uppercase text-amber-950 font-serif">Shahi WhatsApp Delivery</div>
              <div className="text-[11px] text-amber-800">Instant VIP Order Confirmation</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Sandstone Marquee
  if (archetype === 'sacred-ghat') {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="p-3 rounded-xl bg-orange-100/70 border border-orange-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-orange-950">
          <div className="flex items-center gap-2 font-bold font-serif">
            <Flame className="w-4 h-4 text-orange-600" />
            <span>सत्यं शिवं सुन्दरम् • Shuddhata Praman Patra</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-orange-900 font-medium">
            <span>✓ Desi Utpadan</span>
            <span>✓ Sidhe Dukan Se</span>
            <span>✓ Kashi Ki Shresth Seva</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Horizontal Wave Hygiene Strip
  if (archetype === 'flowing-river') {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
            <div className="font-bold text-teal-900">0% Adulteration</div>
            <div className="text-[10px] text-teal-700">Lab Grade Purity</div>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
            <div className="font-bold text-teal-900">Direct Sourced</div>
            <div className="text-[10px] text-teal-700">No Storage Delay</div>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
            <div className="font-bold text-teal-900">Sanitized Pack</div>
            <div className="text-[10px] text-teal-700">100% Sealed Safe</div>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
            <div className="font-bold text-teal-900">Local Speed</div>
            <div className="text-[10px] text-teal-700">Doorstep Delivery</div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Cyber Tech Matrix Status Strip
  if (archetype === 'cyber-terminal') {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-4 font-mono">
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-bold">TELEMETRY:</span>
            <span>UPI_DIRECT // 0% COMMISSION // GENUINE_PARTS</span>
          </div>
          <div className="text-[11px] text-slate-400">
            NODE: {shop.city.toUpperCase() || 'LOCAL'} • DISPATCH_READY
          </div>
        </div>
      </div>
    );
  }

  // Default clean trust strip
  return (
    <div className="max-w-6xl mx-auto px-4 mt-4">
      <div className="bg-white rounded-xl border border-gray-200/80 p-3 flex flex-wrap items-center justify-around gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Direct Store Purchase</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <Check className="w-4 h-4 text-orange-600" />
          <span>0% Platform Commission</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Instant WhatsApp Bill & Order</span>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------------
// THEMED PRODUCT CATALOGUE RENDERER
// ----------------------------------------------------------------------------------

interface ThemedProductCatalogueProps {
  theme: IndianTheme;
  shop: Shop;
  products: ProductItem[];
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onRemoveFromCart: (productId: string) => void;
}

export const ThemedProductCatalogue: React.FC<ThemedProductCatalogueProps> = ({
  theme,
  shop,
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
}) => {
  const archetype = theme.layoutArchetype;

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-2">
        <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto" />
        <div className="text-sm font-bold text-slate-700">Abhi koi product uplabdh nahi hai</div>
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 1. ROYAL PALACE (Arch Framed Pedestal Cards)
  // --------------------------------------------------------------------------------
  if (archetype === 'royal-palace') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((prod) => {
          const inCart = cart.find((c) => c.product.id === prod.id);
          const isPriceHidden = Boolean(shop.hideAllPrices || prod.hidePrice);
          const whatsappInquiryUrl = getWhatsAppDirectUrl(
            shop.whatsapp || shop.phone,
            `Namaste ${shop.businessName}! Mujhe "${prod.name}" ki price aur details janni hai.`
          );
          const discount = !isPriceHidden && prod.originalPrice && prod.originalPrice > prod.price
            ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
            : null;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border-2 border-amber-300 shadow-md hover:shadow-xl hover:border-amber-500 transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Royal Arch Frame Top */}
              <div className="p-3 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-b border-amber-200 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 font-serif flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-600" />
                  <span>Shahi Utpad</span>
                </span>
                {isPriceHidden ? (
                  <span className="bg-amber-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 font-serif">
                    <EyeOff className="w-3 h-3" />
                    <span>Price on Request</span>
                  </span>
                ) : discount ? (
                  <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs font-serif">
                    {discount}% Shahi Bachat
                  </span>
                ) : null}
              </div>

              {/* Picture Arch */}
              <div className="relative aspect-4/3 overflow-hidden bg-amber-50/50">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {prod.unit && (
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs font-serif">
                    {prod.unit}
                  </span>
                )}
              </div>

              {/* Content Pedestal */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-black text-slate-900 text-base group-hover:text-amber-700 transition-colors line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-100 flex items-center justify-between gap-2">
                  {isPriceHidden ? (
                    <div>
                      <div className="text-[10px] text-amber-800 font-serif uppercase tracking-wider">Shahi Mulya</div>
                      <div className="text-xs sm:text-sm font-bold text-amber-950 font-serif">
                        Price on Request
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] text-amber-800 font-serif uppercase tracking-wider">Shahi Mulya</div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-amber-950 font-serif">{formatINR(prod.price)}</span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="text-xs text-gray-400 line-through">{formatINR(prod.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {isPriceHidden ? (
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-serif flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                      title="Ask price on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>कीमत पूछें</span>
                    </a>
                  ) : inCart ? (
                    <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 rounded-xl p-1">
                      <button
                        onClick={() => onRemoveFromCart(prod.id)}
                        className="w-7 h-7 rounded-lg bg-white text-amber-900 font-bold flex items-center justify-center hover:bg-amber-200 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-serif font-bold text-xs px-1 text-amber-950">{inCart.quantity}</span>
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center hover:bg-amber-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddToCart(prod)}
                      aria-label="Add to cart"
                      title="Add to cart"
                      className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 2. SACRED GHAT (Sandstone Parchment / Khata-Bahi Ledger Cards)
  // --------------------------------------------------------------------------------
  if (archetype === 'sacred-ghat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((prod) => {
          const inCart = cart.find((c) => c.product.id === prod.id);
          const isPriceHidden = Boolean(shop.hideAllPrices || prod.hidePrice);
          const whatsappInquiryUrl = getWhatsAppDirectUrl(
            shop.whatsapp || shop.phone,
            `Namaste ${shop.businessName}! Mujhe "${prod.name}" ki price aur details janni hai.`
          );

          return (
            <div
              key={prod.id}
              className="bg-[#FFFDF9] rounded-xl border-2 border-orange-300 p-4 shadow-sm hover:shadow-md hover:border-orange-500 transition-all flex flex-col sm:flex-row gap-4 relative"
            >
              {/* Image with wax seal look */}
              <div className="w-full sm:w-36 h-36 shrink-0 rounded-lg overflow-hidden border border-orange-200 bg-stone-100 relative">
                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                <span className="absolute top-1 left-1 bg-orange-700 text-white text-[9px] font-serif font-bold px-1.5 py-0.5 rounded shadow-xs">
                  🪔 100% Satvik
                </span>
                {isPriceHidden && (
                  <span className="absolute bottom-1 right-1 bg-stone-900/80 text-orange-200 text-[9px] font-serif font-bold px-1.5 py-0.5 rounded">
                    Price on Request
                  </span>
                )}
              </div>

              {/* Bahi-Khata Ledger Info */}
              <div className="flex-1 flex flex-col justify-between space-y-2 text-left">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-orange-800 font-bold">खता सं: #{prod.id.slice(-4)}</span>
                    {prod.unit && (
                      <span className="text-[10px] font-serif bg-orange-100 text-orange-950 px-2 py-0.5 rounded border border-orange-200">
                        {prod.unit}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-base mt-1">{prod.name}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-0.5 leading-relaxed">{prod.description}</p>
                </div>

                <div className="pt-2 border-t border-dashed border-orange-200 flex items-center justify-between">
                  {isPriceHidden ? (
                    <div>
                      <div className="text-[10px] text-stone-500 font-serif">शुद्ध मूल्य</div>
                      <div className="text-xs sm:text-sm font-bold text-orange-950 font-serif">कीमत पूछें</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] text-stone-500 font-serif">शुद्ध मूल्य</div>
                      <div className="text-lg font-black text-orange-950 font-serif">{formatINR(prod.price)}</div>
                    </div>
                  )}

                  {isPriceHidden ? (
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-serif font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                      title="Ask price on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>कीमत पूछें</span>
                    </a>
                  ) : inCart ? (
                    <div className="flex items-center gap-1 bg-orange-100 rounded-lg p-1 border border-orange-300">
                      <button
                        onClick={() => onRemoveFromCart(prod.id)}
                        className="w-6 h-6 rounded bg-white text-orange-900 font-bold flex items-center justify-center hover:bg-orange-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-xs px-1.5">{inCart.quantity}</span>
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="w-6 h-6 rounded bg-orange-600 text-white font-bold flex items-center justify-center hover:bg-orange-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddToCart(prod)}
                      aria-label="बही में जोड़ें"
                      title="बही में जोड़ें"
                      className="w-8 h-8 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 3. JHAROKHA BOUTIQUE (Editorial Lookbook Portrait Cards - 3:4 Aspect Ratio)
  // --------------------------------------------------------------------------------
  if (archetype === 'jharokha-boutique') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((prod) => {
          const inCart = cart.find((c) => c.product.id === prod.id);
          const isPriceHidden = Boolean(shop.hideAllPrices || prod.hidePrice);
          const whatsappInquiryUrl = getWhatsAppDirectUrl(
            shop.whatsapp || shop.phone,
            `Namaste ${shop.businessName}! Mujhe "${prod.name}" ki price aur details janni hai.`
          );

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-rose-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-400 transition-all flex flex-col justify-between group"
            >
              {/* Tall 3:4 Portrait Image */}
              <div className="relative aspect-3/4 overflow-hidden bg-rose-50">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="bg-rose-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs uppercase tracking-wider">
                    Jaipur Curated
                  </span>
                  {isPriceHidden && (
                    <span className="bg-stone-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs uppercase">
                      Price on Request
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-rose-700">
                    {prod.name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-rose-100 flex items-center justify-between gap-1.5">
                  {isPriceHidden ? (
                    <div className="text-xs text-rose-950 font-serif font-bold">
                      कीमत पूछें
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-rose-950 font-serif font-black truncate">
                      {formatINR(prod.price)}
                    </div>
                  )}

                  {isPriceHidden ? (
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                      title="Ask price on WhatsApp"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>कीमत पूछें</span>
                    </a>
                  ) : inCart ? (
                    <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-full p-0.5">
                      <button
                        onClick={() => onRemoveFromCart(prod.id)}
                        className="w-6 h-6 rounded-full bg-white text-rose-900 font-bold flex items-center justify-center hover:bg-rose-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs text-rose-950 px-1">{inCart.quantity}</span>
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center hover:bg-rose-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddToCart(prod)}
                      aria-label="Add to cart"
                      title="Add to cart"
                      className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 4. FLOWING RIVER (Streamlined Horizontal Rows)
  // --------------------------------------------------------------------------------
  if (archetype === 'flowing-river') {
    return (
      <div className="space-y-3">
        {products.map((prod) => {
          const inCart = cart.find((c) => c.product.id === prod.id);
          const isPriceHidden = Boolean(shop.hideAllPrices || prod.hidePrice);
          const whatsappInquiryUrl = getWhatsAppDirectUrl(
            shop.whatsapp || shop.phone,
            `Namaste ${shop.businessName}! Mujhe "${prod.name}" ki price aur details janni hai.`
          );

          return (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-teal-200 p-3 shadow-xs hover:shadow-md hover:border-teal-400 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0 border border-teal-100"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      💧 Pure Stream
                    </span>
                    {prod.unit && <span className="text-[10px] text-gray-500 font-bold">{prod.unit}</span>}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate mt-0.5">{prod.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{prod.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {isPriceHidden ? (
                  <div className="text-right">
                    <div className="text-xs font-bold text-teal-900">Price on Request</div>
                    <div className="text-[10px] text-teal-700">कीमत पूछें</div>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-base font-black text-teal-900">{formatINR(prod.price)}</div>
                    {prod.originalPrice && prod.originalPrice > prod.price && (
                      <div className="text-[10px] text-gray-400 line-through">{formatINR(prod.originalPrice)}</div>
                    )}
                  </div>
                )}

                {isPriceHidden ? (
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                    title="Ask price on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>कीमत पूछें</span>
                  </a>
                ) : inCart ? (
                  <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 rounded-lg p-1">
                    <button
                      onClick={() => onRemoveFromCart(prod.id)}
                      className="w-7 h-7 rounded bg-white text-teal-900 font-bold flex items-center justify-center hover:bg-teal-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs px-1 text-teal-950">{inCart.quantity}</span>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="w-7 h-7 rounded bg-teal-600 text-white font-bold flex items-center justify-center hover:bg-teal-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(prod)}
                    aria-label="Add to cart"
                    title="Add to cart"
                    className="w-8 h-8 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 5. CYBER TERMINAL (Obsidian Spec-Matrix Bento Grid)
  // --------------------------------------------------------------------------------
  if (archetype === 'cyber-terminal') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {products.map((prod) => {
          const inCart = cart.find((c) => c.product.id === prod.id);
          const isPriceHidden = Boolean(shop.hideAllPrices || prod.hidePrice);
          const whatsappInquiryUrl = getWhatsAppDirectUrl(
            shop.whatsapp || shop.phone,
            `Namaste ${shop.businessName}! Mujhe "${prod.name}" ki price aur details janni hai.`
          );

          return (
            <div
              key={prod.id}
              className="bg-slate-900 rounded-xl border border-slate-800 hover:border-amber-400 p-4 shadow-xl flex flex-col justify-between space-y-3 group transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-amber-400 font-bold">MODEL://{prod.id.slice(-5).toUpperCase()}</span>
                  {isPriceHidden ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <EyeOff className="w-2.5 h-2.5" /> ON_REQUEST
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold">100% IN_STOCK</span>
                  )}
                </div>

                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mt-2 border border-slate-800">
                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>

                <h3 className="text-sm font-bold text-white mt-2 font-sans line-clamp-1">{prod.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 font-sans">{prod.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                {isPriceHidden ? (
                  <div>
                    <div className="text-[10px] text-slate-500">SPEC STATUS</div>
                    <div className="text-xs font-bold text-amber-400">PRICE ON REQUEST</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-[10px] text-slate-500">DIRECT PRICE</div>
                    <div className="text-base font-black text-amber-400">{formatINR(prod.price)}</div>
                  </div>
                )}

                {isPriceHidden ? (
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap"
                    title="Ask price on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>INQUIRE</span>
                  </a>
                ) : inCart ? (
                  <div className="flex items-center gap-1 bg-slate-800 rounded p-1 border border-amber-500/40">
                    <button
                      onClick={() => onRemoveFromCart(prod.id)}
                      className="w-6 h-6 rounded bg-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs text-amber-400 px-1">{inCart.quantity}</span>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(prod)}
                    aria-label="Add to cart"
                    title="Add to cart"
                    className="w-8 h-8 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 6. MANDIR GOPURAM (Sanctified Prasad Thali Grid)
  // --------------------------------------------------------------------------------
  if (archetype === 'mandir-gopuram') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => {
          const inCart = cart.find((c) => c.product.id === prod.id);
          const isPriceHidden = Boolean(shop.hideAllPrices || prod.hidePrice);
          const whatsappInquiryUrl = getWhatsAppDirectUrl(
            shop.whatsapp || shop.phone,
            `Namaste ${shop.businessName}! Mujhe "${prod.name}" ki price aur details janni hai.`
          );

          return (
            <div
              key={prod.id}
              className="bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-2xl border-2 border-amber-400/80 p-4 shadow-md flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-serif font-bold text-orange-950 border-b border-amber-300 pb-1.5">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-orange-600" />
                    <span>सात्विक प्रसाद</span>
                  </span>
                  {isPriceHidden ? (
                    <span className="text-[10px] bg-orange-200/80 px-2 py-0.5 rounded text-orange-900 font-bold">
                      कीमत पूछें
                    </span>
                  ) : (
                    <span className="text-[10px] bg-orange-200/80 px-2 py-0.5 rounded text-orange-900">100% Shuddh</span>
                  )}
                </div>

                <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden mt-2 border border-amber-300 bg-white">
                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="font-serif font-black text-orange-950 text-base mt-2 line-clamp-1">{prod.name}</h3>
                <p className="text-xs text-orange-900/80 font-serif line-clamp-2 mt-0.5">{prod.description}</p>
              </div>

              <div className="pt-2 border-t border-amber-300 flex items-center justify-between">
                {isPriceHidden ? (
                  <div>
                    <div className="text-[10px] text-orange-800 font-serif">शुभ अर्पण</div>
                    <div className="text-xs sm:text-sm font-bold text-orange-950 font-serif">कीमत पूछें</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-[10px] text-orange-800 font-serif">शुभ अर्पण मूल्य</div>
                    <div className="text-lg font-black text-orange-950 font-serif">{formatINR(prod.price)}</div>
                  </div>
                )}

                {isPriceHidden ? (
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                    title="Ask price on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>कीमत पूछें</span>
                  </a>
                ) : inCart ? (
                  <div className="flex items-center gap-1 bg-amber-200/80 rounded-xl p-1 border border-amber-400">
                    <button
                      onClick={() => onRemoveFromCart(prod.id)}
                      className="w-7 h-7 rounded-lg bg-white text-orange-900 font-bold flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-serif font-bold text-xs px-1 text-orange-950">{inCart.quantity}</span>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="w-7 h-7 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(prod)}
                    aria-label="प्रसाद लें"
                    title="प्रसाद लें"
                    className="w-8 h-8 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95 text-white font-bold flex items-center justify-center shadow-sm cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 7. GLACIER MINIMAL (Swiss Clean Directory Grid)
  // --------------------------------------------------------------------------------
  if (archetype === 'glacier-minimal') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => {
          const inCart = cart.find((c) => c.product.id === prod.id);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-sky-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-sky-800 font-bold">
                  <span>TESTED BATCH</span>
                  {prod.unit && <span className="bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{prod.unit}</span>}
                </div>

                <div className="aspect-video w-full rounded-lg overflow-hidden mt-2 bg-slate-50 border border-sky-100">
                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2">{prod.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{prod.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-base font-extrabold text-slate-900">{formatINR(prod.price)}</div>

                {inCart ? (
                  <div className="flex items-center gap-1 bg-sky-50 rounded-lg p-1 border border-sky-200">
                    <button
                      onClick={() => onRemoveFromCart(prod.id)}
                      className="w-6 h-6 rounded bg-white text-sky-900 font-bold flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs px-1 text-sky-950">{inCart.quantity}</span>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="w-6 h-6 rounded bg-sky-600 text-white font-bold flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(prod)}
                    aria-label="Add to cart"
                    title="Add to cart"
                    className="w-8 h-8 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 8. CARNIVAL BAZAAR (Festive Dhamaka Deal Grid with Diagonal Ribbons)
  // --------------------------------------------------------------------------------
  if (archetype === 'carnival-bazaar') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((prod) => {
          const inCart = cart.find((c) => c.product.id === prod.id);
          const discount = prod.originalPrice && prod.originalPrice > prod.price
            ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
            : 20;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border-2 border-rose-400 p-2 sm:p-3 shadow-md hover:shadow-xl hover:scale-102 transition-all flex flex-col justify-between space-y-2 relative overflow-hidden"
            >
              {/* Corner Festive Dhamaka Ribbon */}
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg shadow-xs uppercase tracking-wider z-10">
                🎉 {discount}% धमाका
              </div>

              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-rose-50">
                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-xs sm:text-sm line-clamp-1">{prod.name}</h3>
              </div>

              <div className="flex items-center justify-between pt-1 gap-1">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm sm:text-base font-black text-rose-700">{formatINR(prod.price)}</span>
                    {prod.originalPrice && (
                      <span className="text-[10px] text-gray-400 line-through">{formatINR(prod.originalPrice)}</span>
                    )}
                  </div>
                </div>

                {inCart ? (
                  <div className="flex items-center justify-between bg-rose-100 rounded-xl p-0.5 border border-rose-300">
                    <button
                      onClick={() => onRemoveFromCart(prod.id)}
                      className="w-6 h-6 rounded-lg bg-white text-rose-900 font-bold flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs text-rose-950 px-1">{inCart.quantity}</span>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(prod)}
                    aria-label="Add to cart"
                    title="Loot Lo!"
                    className="w-8 h-8 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:opacity-95 text-white font-black flex items-center justify-center shadow-sm cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 9. BACKWATER RETREAT (Organic Farm Crate Layout)
  // --------------------------------------------------------------------------------
  if (archetype === 'backwater-retreat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => {
          const inCart = cart.find((c) => c.product.id === prod.id);

          return (
            <div
              key={prod.id}
              className="bg-[#FCFDF9] rounded-2xl border-2 border-emerald-300 p-4 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 border-b border-emerald-200 pb-1.5">
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wayanad Farm Fresh</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded text-emerald-950">100% Organic</span>
                </div>

                <div className="aspect-video w-full rounded-xl overflow-hidden mt-2 bg-emerald-50 border border-emerald-200">
                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="font-serif font-bold text-slate-900 text-base mt-2 line-clamp-1">{prod.name}</h3>
                <p className="text-xs text-emerald-950/80 line-clamp-2 mt-0.5">{prod.description}</p>
              </div>

              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-emerald-700 font-bold uppercase">Harvest Rate</div>
                  <div className="text-lg font-black text-emerald-950">{formatINR(prod.price)}</div>
                </div>

                {inCart ? (
                  <div className="flex items-center gap-1 bg-emerald-100 rounded-xl p-1 border border-emerald-300">
                    <button
                      onClick={() => onRemoveFromCart(prod.id)}
                      className="w-7 h-7 rounded-lg bg-white text-emerald-900 font-bold flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs px-1 text-emerald-950">{inCart.quantity}</span>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(prod)}
                    aria-label="Add to cart"
                    title="Add to cart"
                    className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center shadow-sm cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // 10. RUNWAY CHIC (High-Fashion Pill Masonry Grid)
  // --------------------------------------------------------------------------------
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((prod) => {
        const inCart = cart.find((c) => c.product.id === prod.id);

        return (
          <div
            key={prod.id}
            className="bg-white rounded-3xl border border-purple-200 p-3 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-3"
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-purple-50">
              <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
              <span className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                VIP
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1 uppercase">{prod.name}</h3>
            </div>

            <div className="pt-2 border-t border-purple-100 flex items-center justify-between gap-1.5">
              <div className="text-sm font-black text-purple-900 truncate">{formatINR(prod.price)}</div>

              {inCart ? (
                <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-full p-0.5">
                  <button
                    onClick={() => onRemoveFromCart(prod.id)}
                    className="w-6 h-6 rounded-full bg-white text-purple-900 font-bold flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-xs text-purple-950 px-1">{inCart.quantity}</span>
                  <button
                    onClick={() => onAddToCart(prod)}
                    className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddToCart(prod)}
                  aria-label="Add to cart"
                  title="Add to cart"
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-700 to-purple-600 hover:opacity-90 text-white font-bold flex items-center justify-center shadow-sm cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

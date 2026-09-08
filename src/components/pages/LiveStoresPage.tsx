import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  MapPin, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  Filter,
  Sparkles
} from 'lucide-react';
import { Shop } from '../../types';
import { BUSINESS_CATEGORIES } from '../../data/initialData';

interface LiveStoresPageProps {
  shops: Shop[];
  onNavigate: (view: string, shopId?: string) => void;
  onOpenAuth: (tab?: 'LOGIN' | 'REGISTER' | 'ADMIN') => void;
}

export const LiveStoresPage: React.FC<LiveStoresPageProps> = ({
  shops,
  onNavigate,
  onOpenAuth,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Only show published stores publicly (STEP 6 security rule)
  const publishedShops = shops.filter((s) => s.status === 'PUBLISHED');
  const featuredShopsCount = publishedShops.filter((s) => s.isFeaturedInShowcase).length;

  const filteredShops = publishedShops.filter((shop) => {
    let matchesCategory = true;
    if (selectedCategory === 'FEATURED') {
      matchesCategory = !!shop.isFeaturedInShowcase;
    } else if (selectedCategory !== 'ALL') {
      matchesCategory = shop.category.toLowerCase().includes(selectedCategory.toLowerCase());
    }

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      shop.businessName.toLowerCase().includes(query) ||
      shop.vendorName.toLowerCase().includes(query) ||
      shop.shopId.toLowerCase().includes(query) ||
      shop.city.toLowerCase().includes(query) ||
      shop.state.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-600/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
            <Store className="w-3.5 h-3.5" /> Live Stores Showcase
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight uppercase font-['Outfit',sans-serif]">
            Explore Verified Indian Digital Stores
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Ye woh dukaanein hain jo IndianLalaJi.com par live hain aur WhatsApp orders & UPI payments accept kar rahi hain. Aap bhi apni dukaan sirf 2 minute mein live kar sakte hain!
          </p>
        </div>
        <div className="absolute right-6 bottom-6 hidden lg:block">
          <button
            onClick={() => onOpenAuth('REGISTER')}
            className="px-5 py-3 rounded-sm bg-orange-600 text-white font-bold uppercase tracking-wider text-xs shadow-md hover:bg-orange-700 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Your Store</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        
        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by shop name, owner, city or SHP ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-sm border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('FEATURED')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedCategory === 'FEATURED'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-400'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>★ Featured Showcase ({featuredShopsCount})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
            }`}
          >
            All Stores ({publishedShops.length})
          </button>
          {BUSINESS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name.split(' ')[0])}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat.name.split(' ')[0]
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
            >
              {cat.name.split(' ')[0]}
            </button>
          ))}
        </div>

      </div>

      {/* Stores Grid (Image + Name + Owner + 2-line Description + View Store Button) */}
      {filteredShops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-3">
          <Store className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700 uppercase tracking-tight">Koi store nahi mila</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query or filter to find live vendor storefronts.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group p-4"
            >
              {/* Store Card Top Banner Image */}
              <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-lg overflow-hidden mb-3">
                <img
                  src={shop.banners[0] || shop.logoUrl}
                  alt={shop.businessName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Shop ID Pill */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white text-[9px] font-black text-slate-900 rounded uppercase tracking-wider shadow-xs border border-gray-100">
                  {shop.shopId}
                </div>

                {/* State & Featured Tags */}
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                  {shop.isFeaturedInShowcase && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                      <span>★ FEATURED</span>
                    </span>
                  )}
                  <span className="bg-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                    {shop.city}, {shop.state}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-bold text-base uppercase tracking-tight text-slate-900 truncate">
                    {shop.businessName}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Owner: {shop.vendorName}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mt-1">
                    {shop.tagline || shop.aboutStory}
                  </p>
                </div>

                {/* Location & Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-gray-500 flex items-center gap-1 truncate max-w-[120px]">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{shop.address}</span>
                  </div>

                  <button
                    id={`live-view-btn-${shop.shopId}`}
                    onClick={() => onNavigate(`shop/${shop.shopId}`, shop.shopId)}
                    className="px-3.5 py-1.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>View Store</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

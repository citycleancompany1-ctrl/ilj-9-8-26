import React, { useMemo, useState } from 'react';
import {
  Home,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Phone,
  PhoneCall,
  MapPin,
  Clock,
  QrCode,
  Send,
  MessageSquare,
  ShieldCheck,
  Award,
  Calendar,
  Layers,
  GraduationCap,
  Play,
  Info,
  CheckCircle2,
  FileText,
  X,
  ExternalLink,
} from 'lucide-react';
import { Shop, ProductItem, CartItem, ShopSectionsConfig } from '../../types';
import { formatINR, getWhatsAppDirectUrl } from '../../utils/mediaUpload';
import { StoreCategoryBar, CategoryBarItem } from './StoreCategoryBar';
import { extractStoreCategories } from '../../utils/categoryUtils';
import { SharedItemCard } from './StoreItemsCarouselSection';
import {
  AboutSectionRenderer,
  FeaturesSectionRenderer,
  BenefitsSectionRenderer,
  TeamSectionRenderer,
  FaqSectionRenderer,
  GallerySectionRenderer,
  VideoSectionRenderer,
  PortfolioSectionRenderer,
} from './PublicStoreSections';

// Breadcrumb Navigation Header Component
export const PageBreadcrumb: React.FC<{
  shopName: string;
  currentPageTitle: string;
  onNavigateHome: () => void;
}> = ({ shopName, currentPageTitle, onNavigateHome }) => {
  return (
    <div className="bg-orange-50/70 border-b border-orange-100/80 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-600">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-orange-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-orange-600" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-bold text-slate-900 truncate">{currentPageTitle}</span>
      </div>
    </div>
  );
};

// ==========================================
// 1. DEDICATED PRODUCTS PAGE
// ==========================================
export interface ProductsPageProps {
  shop: Shop;
  products: ProductItem[];
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onRemoveFromCart: (productId: string) => void;
  onSelectItem: (product: ProductItem) => void;
  onNavigateHome: () => void;
}

export const ProductsPageView: React.FC<ProductsPageProps> = ({
  shop,
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onSelectItem,
  onNavigateHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'name_asc'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Extract categories using the unified utility (which auto-includes 'ALL')
  const categories: CategoryBarItem[] = useMemo(() => {
    return extractStoreCategories(products, shop.customCategories, 'PRODUCT');
  }, [products, shop.customCategories]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category filter
        if (selectedCategory && selectedCategory !== 'ALL' && item.category !== selectedCategory) {
          return false;
        }
        // In-stock filter
        if (inStockOnly && item.inStock === false) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = item.name.toLowerCase().includes(q);
          const descMatch = (item.description || '').toLowerCase().includes(q);
          const catMatch = (item.category || '').toLowerCase().includes(q);
          if (!nameMatch && !descMatch && !catMatch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        return 0; // featured/original
      });
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  return (
    <div className="min-h-[70vh] pb-16">
      <PageBreadcrumb
        shopName={shop.businessName}
        currentPageTitle="Store Products & Catalogue"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Page Banner Header */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5" /> Direct Store Catalogue
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-['Outfit',sans-serif]">
              Products Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-orange-50/90 leading-relaxed">
              Explore authentic merchandise directly from {shop.businessName}. Order online or directly connect on WhatsApp for instant doorstep delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <div className="text-right">
              <div className="text-2xl font-black">{filteredProducts.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-orange-100 font-bold">Items Listed</div>
            </div>
          </div>
        </div>

        {/* Category Horizontal Bar */}
        {categories.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/90 p-3 shadow-xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-2 mb-2 flex items-center justify-between">
              <span>Select Category:</span>
              {selectedCategory !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className="text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                >
                  Reset to All
                </button>
              )}
            </div>
            <StoreCategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search product name, description or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/60 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: In-Stock Toggle & Sort */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              No products found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No products matched your current search or category filter. Try clearing filters or searching for something else.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product) => (
              <SharedItemCard
                key={product.id}
                item={product}
                isService={false}
                shop={shop}
                cart={cart}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onSelectItem={onSelectItem}
              />
            ))}
          </div>
        )}

        {/* Bottom Quick Connect Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-black uppercase tracking-tight font-['Outfit',sans-serif]">
              Can't find what you are looking for?
            </h4>
            <p className="text-xs text-slate-300">
              Message {shop.vendorName} directly on WhatsApp for custom requests, bulk quantities, or special orders.
            </p>
          </div>
          <a
            href={getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `Namaste ${shop.businessName}, I am looking for a product that is not listed in your store catalogue.`)}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider text-xs rounded-xl flex items-center gap-2 shrink-0 shadow-md transition-all hover:scale-102"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 2. DEDICATED SERVICES PAGE
// ==========================================
export interface ServicesPageProps {
  shop: Shop;
  services: ProductItem[];
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onRemoveFromCart: (productId: string) => void;
  onSelectItem: (product: ProductItem) => void;
  onNavigateHome: () => void;
  onBookService: (serviceName: string) => void;
}

export const ServicesPageView: React.FC<ServicesPageProps> = ({
  shop,
  services,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onSelectItem,
  onNavigateHome,
  onBookService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: CategoryBarItem[] = useMemo(() => {
    return extractStoreCategories(services, shop.customCategories, 'SERVICE');
  }, [services, shop.customCategories]);

  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      if (selectedCategory && selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const catMatch = (item.category || '').toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }
      return true;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="min-h-[70vh] pb-16">
      <PageBreadcrumb
        shopName={shop.businessName}
        currentPageTitle="Professional Services & Booking"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Professional Store Services
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-['Outfit',sans-serif]">
              Services & Appointments
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed">
              Book expert services directly from {shop.businessName}. Get upfront pricing, transparent quotes, and verified execution.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <div className="text-right">
              <div className="text-2xl font-black">{filteredServices.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-emerald-100 font-bold">Services Available</div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        {categories.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/90 p-3 shadow-xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-2 mb-2 flex items-center justify-between">
              <span>Filter by Service Speciality:</span>
              {selectedCategory !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className="text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
                >
                  Reset to All
                </button>
              )}
            </div>
            <StoreCategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-xs">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services by name or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/60 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              No services found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No services matched your current query. Message the vendor directly for custom service bookings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredServices.map((service) => (
              <SharedItemCard
                key={service.id}
                item={service}
                isService={true}
                shop={shop}
                cart={cart}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onSelectItem={onSelectItem}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

// ==========================================
// 3. DEDICATED COURSES PAGE
// ==========================================
export interface CoursesPageProps {
  shop: Shop;
  courses: ProductItem[];
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onRemoveFromCart: (productId: string) => void;
  onSelectItem: (product: ProductItem) => void;
  onNavigateHome: () => void;
}

export const CoursesPageView: React.FC<CoursesPageProps> = ({
  shop,
  courses,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onSelectItem,
  onNavigateHome,
}) => {
  return (
    <div className="min-h-[70vh] pb-16">
      <PageBreadcrumb
        shopName={shop.businessName}
        currentPageTitle="Courses & Training Batches"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" /> Certified Educational Courses
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-['Outfit',sans-serif]">
              Courses & Coaching Batches
            </h1>
            <p className="text-xs sm:text-sm text-indigo-50/90 leading-relaxed">
              Join upcoming batches, practical training workshops, and educational programs conducted by {shop.businessName}.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <div className="text-right">
              <div className="text-2xl font-black">{courses.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-100 font-bold">Batches Open</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={course.image || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80'}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    {course.category || 'Certification'}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    {course.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <span className="text-lg text-indigo-600 font-black">{formatINR(course.price)}</span>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatINR(course.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `Namaste ${shop.businessName}, I would like to enroll in course: ${course.name}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enroll on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. DEDICATED ABOUT US PAGE
// ==========================================
export interface AboutPageProps {
  shop: Shop;
  sectionsConfig: ShopSectionsConfig | null;
  onNavigateHome: () => void;
}

export const AboutPageView: React.FC<AboutPageProps> = ({
  shop,
  sectionsConfig,
  onNavigateHome,
}) => {
  return (
    <div className="min-h-[70vh] pb-16">
      <PageBreadcrumb
        shopName={shop.businessName}
        currentPageTitle="About Merchant & Verified Credentials"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-3xl p-6 sm:p-10 text-white shadow-sm">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Local Enterprise
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-['Outfit',sans-serif]">
              About {shop.businessName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Proprietor: <strong>{shop.vendorName}</strong>. Operating direct store services in <strong>{shop.city || 'India'}</strong> with direct merchant accountability and zero middleman markups.
            </p>
          </div>
        </div>

        {/* Business Credentials Grid */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                Verified Business Dossier
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Active Merchant
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                Official Business Name
              </span>
              <span className="font-bold text-slate-900 text-sm">{shop.businessName}</span>
            </div>

            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                Store Proprietor / Owner
              </span>
              <span className="font-bold text-slate-900 text-sm">{shop.vendorName}</span>
            </div>

            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                Store ID & Registration
              </span>
              <span className="font-mono font-bold text-orange-600 text-sm">{shop.shopId}</span>
            </div>

            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                Store Location / Jurisdiction
              </span>
              <span className="font-bold text-slate-900 text-sm">{shop.city}, {shop.state}</span>
            </div>
          </div>
        </div>

        {/* Story Section */}
        {sectionsConfig && sectionsConfig.about.enabled && (
          <AboutSectionRenderer config={sectionsConfig.about} shop={shop} />
        )}

        {/* Features / Pillars */}
        {sectionsConfig && sectionsConfig.features.enabled && (
          <FeaturesSectionRenderer config={sectionsConfig.features} />
        )}

        {/* Why Choose Us */}
        {sectionsConfig && sectionsConfig.benefits && sectionsConfig.benefits.enabled && (
          <BenefitsSectionRenderer config={sectionsConfig.benefits} />
        )}

        {/* Team */}
        {sectionsConfig && sectionsConfig.team.enabled && (
          <TeamSectionRenderer config={sectionsConfig.team} />
        )}

        {/* FAQ */}
        {sectionsConfig && sectionsConfig.faq.enabled && (
          <FaqSectionRenderer config={sectionsConfig.faq} />
        )}

      </div>
    </div>
  );
};

// ==========================================
// 5. DEDICATED GALLERY & MEDIA PAGE
// ==========================================
export interface GalleryPageProps {
  shop: Shop;
  sectionsConfig: ShopSectionsConfig | null;
  onNavigateHome: () => void;
}

export const GalleryPageView: React.FC<GalleryPageProps> = ({
  shop,
  sectionsConfig,
  onNavigateHome,
}) => {
  return (
    <div className="min-h-[70vh] pb-16">
      <PageBreadcrumb
        shopName={shop.businessName}
        currentPageTitle="Photo Gallery & Store Videos"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-sm">
          <div className="max-w-xl space-y-1.5">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
              <Play className="w-3.5 h-3.5" /> Verified Visual Showcase
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-['Outfit',sans-serif]">
              Photos, Videos & Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-rose-50/90 leading-relaxed">
              Explore recent customer work, store facility photos, product demonstrations, and service videos from {shop.businessName}.
            </p>
          </div>
        </div>

        {/* Photo Gallery */}
        {(!sectionsConfig || !sectionsConfig.gallery || sectionsConfig.gallery.enabled) && (
          <GallerySectionRenderer config={sectionsConfig?.gallery} shop={shop} />
        )}

        {/* Store Videos */}
        {(!sectionsConfig?.videos || sectionsConfig.videos.enabled) && (
          <VideoSectionRenderer shop={shop} config={sectionsConfig?.videos} />
        )}

        {/* Portfolio Showcase */}
        {sectionsConfig && sectionsConfig.portfolio.enabled && (
          <PortfolioSectionRenderer config={sectionsConfig.portfolio} />
        )}
      </div>
    </div>
  );
};

// ==========================================
// 6. DEDICATED CONTACT & INQUIRY PAGE
// ==========================================
export interface ContactPageProps {
  shop: Shop;
  sectionsConfig: ShopSectionsConfig | null;
  onNavigateHome: () => void;
  custName: string;
  setCustName: (val: string) => void;
  custPhone: string;
  setCustPhone: (val: string) => void;
  custService: string;
  setCustService: (val: string) => void;
  custMsg: string;
  setCustMsg: (val: string) => void;
  inquirySubmitted: boolean;
  onHandleInquirySubmit: (e: React.FormEvent) => void;
  onCopyUpi: () => void;
  copiedUpi: boolean;
}

export const ContactPageView: React.FC<ContactPageProps> = ({
  shop,
  sectionsConfig,
  onNavigateHome,
  custName,
  setCustName,
  custPhone,
  setCustPhone,
  custService,
  setCustService,
  custMsg,
  setCustMsg,
  inquirySubmitted,
  onHandleInquirySubmit,
  onCopyUpi,
  copiedUpi,
}) => {
  return (
    <div className="min-h-[70vh] pb-16">
      <PageBreadcrumb
        shopName={shop.businessName}
        currentPageTitle="Contact Us & Direct Coordinates"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-sm">
          <div className="max-w-xl space-y-1.5">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5" /> Direct Merchant Helpline
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-['Outfit',sans-serif]">
              Get in Touch with {shop.businessName}
            </h1>
            <p className="text-xs sm:text-sm text-orange-50/90 leading-relaxed">
              Connect directly via phone, WhatsApp, or send an inquiry below. We respond instantly during business hours.
            </p>
          </div>
        </div>

        {/* Contact Coordinates & Direct QR Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Coordinates Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Helpline Card */}
            <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                <span>Direct Contact Channels</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Phone Call Helpline</div>
                    <a href={`tel:${shop.phone}`} className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                      +91 {shop.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">WhatsApp Direct Chat</div>
                    <a 
                      href={getWhatsAppDirectUrl(shop.whatsapp || shop.phone, `Namaste ${shop.businessName}!`)}
                      target="_blank" 
                      rel="noreferrer"
                      className="text-gray-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                      +91 {shop.whatsapp || shop.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Physical Store Address</div>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      {shop.address}, {shop.city}, {shop.state} - {shop.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Operating Hours</div>
                    <p className="text-gray-600 font-medium">
                      Monday to Saturday: 9:30 AM – 8:30 PM (Sunday Open)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct UPI Payment QR Card */}
            <div className="bg-orange-50/80 rounded-3xl border border-orange-200/80 p-6 space-y-3">
              <div className="flex items-center gap-2 text-orange-950 font-black uppercase tracking-wider text-xs">
                <QrCode className="w-4 h-4 text-orange-600" />
                <span>Store Instant UPI Payment QR</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-orange-200 text-center shadow-xs">
                <img
                  src={shop.paymentQrUrl}
                  alt={`${shop.businessName} UPI QR`}
                  className="w-44 h-44 object-contain mx-auto rounded-xl"
                />
              </div>
              <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2 rounded-xl border border-orange-200 text-xs">
                <span className="font-mono font-bold text-slate-900 truncate">
                  {shop.upiId || '7087033009@paytm'}
                </span>
                <button
                  type="button"
                  onClick={onCopyUpi}
                  className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
                >
                  {copiedUpi ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Scan with any UPI app (GPay, PhonePe, Paytm) for direct instant settlement.
              </p>
            </div>

          </div>

          {/* Right: Direct Customer Message & Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
            <div className="space-y-1 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                <MessageSquare className="w-3 h-3" /> Quick Merchant Message
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                Send Direct Message or Inquiry
              </h3>
              <p className="text-xs text-gray-500">
                Submit this form to send your inquiry directly to {shop.vendorName}.
              </p>
            </div>

            {inquirySubmitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-slate-900 uppercase tracking-tight text-base">
                  Inquiry Sent Successfully!
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you! Your message has been received. {shop.vendorName} will connect with you on WhatsApp / Phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={onHandleInquirySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Product or Service Required (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sofa Cleaning / Special Order / Bulk Rate"
                    value={custService}
                    onChange={(e) => setCustService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Message / Inquiry Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message or inquiry details here..."
                    value={custMsg}
                    onChange={(e) => setCustMsg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Direct Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

// ==========================================
// 7. FIXED MOBILE BOTTOM NAVIGATION BAR
// ==========================================
export interface MobileBottomNavProps {
  activePage: 'home' | 'products' | 'services' | 'courses' | 'about' | 'gallery' | 'contact';
  onNavigate: (page: 'home' | 'products' | 'services' | 'courses' | 'about' | 'gallery' | 'contact') => void;
  cartCount: number;
  onOpenCart: () => void;
  hasServices: boolean;
}

export const MobileBottomNavBar: React.FC<MobileBottomNavProps> = ({
  activePage,
  onNavigate,
  cartCount,
  onOpenCart,
  hasServices,
}) => {
  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-lg px-2 py-1 flex items-center justify-around"
    >
      {/* Home */}
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
          activePage === 'home' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
      </button>

      {/* Products */}
      <button
        type="button"
        onClick={() => onNavigate('products')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
          activePage === 'products' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight">Products</span>
      </button>

      {/* Services (or About) */}
      {hasServices ? (
        <button
          type="button"
          onClick={() => onNavigate('services')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            activePage === 'services' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Services</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onNavigate('about')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            activePage === 'about' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Info className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">About</span>
        </button>
      )}

      {/* Cart (if has items or enabled) */}
      <button
        type="button"
        onClick={onOpenCart}
        className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-orange-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
      </button>

      {/* Contact */}
      <button
        type="button"
        onClick={() => onNavigate('contact')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
          activePage === 'contact' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Phone className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight">Contact</span>
      </button>
    </nav>
  );
};

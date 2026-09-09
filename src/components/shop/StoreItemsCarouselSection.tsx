import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Briefcase,
  GraduationCap,
  ArrowRight,
  MessageSquare,
  Plus,
  Minus,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Zap,
  Search,
  X,
} from 'lucide-react';
import { ProductItem, Shop, CartItem, ProductType } from '../../types';
import { formatINR, getWhatsAppDirectUrl } from '../../utils/mediaUpload';

export interface StoreItemsCarouselSectionProps {
  id: string; // 'products', 'services', or 'courses'
  title: string;
  subtitle?: string;
  badgeText: string;
  isService?: boolean;
  isCourse?: boolean;
  itemType?: ProductType;
  items: ProductItem[];
  shop: Shop;
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onRemoveFromCart: (productId: string) => void;
  onSelectItem: (product: ProductItem) => void;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  extraHeaderAction?: React.ReactNode;
  filterToolbar?: React.ReactNode;
}

interface SharedItemCardProps {
  item: ProductItem;
  isService?: boolean;
  isCourse?: boolean;
  itemType?: ProductType;
  shop: Shop;
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onRemoveFromCart: (productId: string) => void;
  onSelectItem: (product: ProductItem) => void;
}

export const SharedItemCard: React.FC<SharedItemCardProps> = ({
  item,
  isService = false,
  isCourse = false,
  itemType,
  shop,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onSelectItem,
}) => {
  const isCourseItem = item.type === 'COURSE' || isCourse || itemType === 'COURSE';
  const isServiceItem = !isCourseItem && (item.type === 'SERVICE' || isService || itemType === 'SERVICE');

  const inCart = cart.find((c) => c.product.id === item.id);
  const isPriceHidden = Boolean(
    shop.hideAllPrices ||
      shop.isCatalogOnly ||
      (shop as any).websiteMode === 'CATALOG' ||
      item.hidePrice
  );
  const hasDiscount = !isPriceHidden && item.originalPrice && item.originalPrice > item.price;
  const discountPercent = hasDiscount
    ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
    : 0;

  const defaultImg = isCourseItem
    ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'
    : isServiceItem
    ? 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'
    : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';

  const whatsappInquiryUrl = isPriceHidden
    ? getWhatsAppDirectUrl(
        shop.whatsapp || shop.phone,
        isCourseItem
          ? `Namaste ${shop.businessName}! Mujhe aapke course/training "${item.name}" ke syllabus, batch timing aur fee ke baare me janna hai.`
          : isServiceItem
          ? `Namaste ${shop.businessName}! Mujhe aapki "${item.name}" service ke charges aur details janni hain.`
          : `Namaste ${shop.businessName}! Mujhe "${item.name}" ki price aur details janni hai.`
      )
    : getWhatsAppDirectUrl(
        shop.whatsapp || shop.phone,
        isCourseItem
          ? `Namaste ${shop.businessName}! I want to enroll/inquire about your course: "${item.name}" (${formatINR(item.price)}).`
          : isServiceItem
          ? `Namaste ${shop.businessName}! I want to book/inquire about your service: "${item.name}" (${formatINR(item.price)}).`
          : `Namaste ${shop.businessName}! I want to order "${item.name}" (${formatINR(item.price)}).`
      );

  const cardId = `${isCourseItem ? 'course' : isServiceItem ? 'service' : 'product'}-card-${item.id}`;

  return (
    <div
      id={cardId}
      onClick={() => onSelectItem(item)}
      className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 hover:border-orange-500/60 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer h-full select-none"
    >
      {/* 1. Item Image & Badges */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={item.imageUrl || defaultImg}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none gap-1">
          {/* Left badge */}
          {isCourseItem ? (
            <span className="bg-indigo-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
              COURSE
            </span>
          ) : isServiceItem ? (
            <span className="bg-blue-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
              SERVICE
            </span>
          ) : hasDiscount ? (
            <span className="bg-red-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          ) : (
            <span />
          )}

          {/* Right badge */}
          {isCourseItem ? (
            item.inStock ? (
              <span className="bg-emerald-600/90 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                Seats Open
              </span>
            ) : (
              <span className="bg-red-600 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                Batch Full
              </span>
            )
          ) : isServiceItem ? (
            item.unit ? (
              <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                {item.unit}
              </span>
            ) : null
          ) : item.inStock ? (
            <span className="bg-emerald-600/90 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              In Stock
            </span>
          ) : (
            <span className="bg-red-600 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              Out of Stock
            </span>
          )}
        </div>

        {/* Bottom unit indicator */}
        {item.unit && (
          <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded">
            {item.unit}
          </span>
        )}
      </div>

      {/* 2. Item Details & Actions */}
      <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between gap-1.5 sm:gap-2">
        <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors font-['Outfit',sans-serif]">
          {item.name}
        </h3>

        {/* Bottom Price & Button Strip */}
        <div className="pt-1.5 sm:pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
          {/* Price display */}
          {isPriceHidden ? (
            <div className="min-w-0">
              <span className="inline-block px-1 sm:px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[9px] sm:text-[11px] leading-tight">
                Price on Request
              </span>
              <span className="text-[9px] text-amber-700 font-semibold block">
                {isCourseItem ? 'फीस पूछें' : isServiceItem ? 'फीस पूछें' : 'कीमत पूछें'}
              </span>
            </div>
          ) : (
            <div className="min-w-0">
              <span className="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate block">
                {formatINR(item.price)}
              </span>
              {hasDiscount && (
                <span className="text-[9px] sm:text-[11px] text-gray-400 line-through block leading-tight">
                  {formatINR(item.originalPrice!)}
                </span>
              )}
            </div>
          )}

          {/* Action button */}
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {isPriceHidden ? (
              <a
                href={whatsappInquiryUrl}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noreferrer"
                className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95"
                title="Inquire on WhatsApp"
              >
                <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Ask</span>
              </a>
            ) : shop.ecommerceEnabled !== false ? (
              inCart ? (
                <div className="flex items-center gap-0.5 bg-orange-50 border border-orange-200 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromCart(item.id);
                    }}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-white text-orange-700 font-bold flex items-center justify-center hover:bg-orange-100 cursor-pointer shadow-xs"
                    title="Decrease quantity"
                  >
                    <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                  <span className="font-black text-[11px] sm:text-xs px-1 text-orange-950 font-mono">
                    {inCart.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-orange-600 text-white font-bold flex items-center justify-center hover:bg-orange-700 cursor-pointer shadow-xs"
                    title="Increase quantity"
                  >
                    <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                  className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-slate-900 hover:bg-orange-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                  title="Add to cart"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              )
            ) : (
              <a
                href={whatsappInquiryUrl}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noreferrer"
                className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95"
                title="Order on WhatsApp"
              >
                <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Order</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StoreItemsCarouselSection: React.FC<StoreItemsCarouselSectionProps> = ({
  id,
  title,
  subtitle,
  badgeText,
  isService = false,
  isCourse = false,
  itemType,
  items,
  shop,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onSelectItem,
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  extraHeaderAction,
  filterToolbar,
}) => {
  const [isViewAllExpanded, setIsViewAllExpanded] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const [totalDots, setTotalDots] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Search state (supports internal or controlled search)
  const [internalSearch, setInternalSearch] = useState('');
  const isControlledSearch = searchQuery !== undefined;
  const currentSearch = isControlledSearch ? searchQuery : internalSearch;

  const handleSearchChange = (val: string) => {
    if (isControlledSearch) {
      if (onSearchChange) onSearchChange(val);
    } else {
      setInternalSearch(val);
    }
  };

  // Filter items matching search
  const filteredItems = useMemo(() => {
    const q = currentSearch.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      return matchName || matchDesc || matchCat;
    });
  }, [items, currentSearch]);

  // Content threshold: View All button only appears when items quantity exceeds initial visible design capacity
  // (2-row carousel: 4 items on mobile [2 cols], 8 items on desktop [4 cols])
  const [hasMoreContent, setHasMoreContent] = useState(false);

  useEffect(() => {
    const checkCapacity = () => {
      const isDesktop = window.innerWidth >= 1024;
      const threshold = isDesktop ? 8 : 4;
      setHasMoreContent(filteredItems.length > threshold);
    };

    checkCapacity();
    window.addEventListener('resize', checkCapacity);
    return () => window.removeEventListener('resize', checkCapacity);
  }, [filteredItems.length]);

  // Group items into columns of 2 rows each
  const itemPairs = useMemo(() => {
    const pairs: ProductItem[][] = [];
    for (let i = 0; i < filteredItems.length; i += 2) {
      if (i + 1 < filteredItems.length) {
        pairs.push([filteredItems[i], filteredItems[i + 1]]);
      } else {
        pairs.push([filteredItems[i]]);
      }
    }
    return pairs;
  }, [filteredItems]);

  // Update total dots based on number of columns and viewport width
  useEffect(() => {
    const updateDots = () => {
      if (!scrollRef.current) return;
      const { scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 10) {
        setTotalDots(1);
        return;
      }
      // Calculate pages: on mobile ~2 columns per view, on desktop ~4 columns per view
      const isDesktop = window.innerWidth >= 1024;
      const colsPerView = isDesktop ? 4 : 2;
      const computedDots = Math.max(2, Math.ceil(itemPairs.length / colsPerView));
      setTotalDots(Math.min(computedDots, 8)); // limit to max 8 dots for clean aesthetics
    };

    updateDots();
    window.addEventListener('resize', updateDots);
    return () => window.removeEventListener('resize', updateDots);
  }, [itemPairs.length]);

  // Handle scroll to update active dot
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setActiveDot(0);
      return;
    }
    const progress = scrollLeft / maxScroll;
    const current = Math.round(progress * (totalDots - 1));
    setActiveDot(Math.min(totalDots - 1, Math.max(0, current)));
  };

  // Click dot to navigate smoothly
  const handleDotClick = (index: number) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = (index / (totalDots - 1)) * maxScroll;
    scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveDot(index);
  };

  // Arrow navigation
  const handleScrollArrow = (direction: 'prev' | 'next') => {
    if (!scrollRef.current) return;
    const step = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({
      left: direction === 'next' ? step : -step,
      behavior: 'smooth',
    });
  };

  if (items.length === 0) return null;

  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-4">
      {/* 1. Header Bar: Left = Section Title & Badge, Right = Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
        {/* Left: Heading & Badge Area */}
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 text-orange-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
            {isCourse ? (
              <GraduationCap className="w-3 h-3 text-indigo-600 shrink-0" />
            ) : isService ? (
              <Briefcase className="w-3 h-3 text-blue-600 shrink-0" />
            ) : (
              <ShoppingBag className="w-3 h-3 text-orange-600 shrink-0" />
            )}
            <span className="truncate">{badgeText}</span>
          </div>

          <h2 className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif] mt-1 truncate">
            {title} <span className="text-gray-400 text-xs sm:text-sm md:text-base font-bold">({filteredItems.length})</span>
          </h2>

          {subtitle && (
            <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5 hidden xs:block">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: Search Bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                searchPlaceholder ||
                (isCourse
                  ? 'Search courses...'
                  : isService
                  ? 'Search services...'
                  : 'Search products...')
              }
              value={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50/90 hover:bg-gray-50 transition-all placeholder:text-gray-400 font-medium"
            />
            {currentSearch && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-700 cursor-pointer p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {extraHeaderAction}
        </div>
      </div>

      {/* Optional Toolbar (if passed) */}
      {filterToolbar && <div>{filterToolbar}</div>}

      {/* 2. Content: Empty Search Result OR 2-Row Horizontal Carousel OR Expanded Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800">
            Koi item nahi mila
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            &quot;{currentSearch}&quot; ke liye koi match nahi mila. Kripya dusra naam ya keyword try karein.
          </p>
          <button
            type="button"
            onClick={() => handleSearchChange('')}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : isViewAllExpanded ? (
        /* Expanded Full Grid View (in-place on page, without popup) */
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full">
            {filteredItems.map((item) => (
              <SharedItemCard
                key={item.id}
                item={item}
                isService={isService}
                isCourse={isCourse}
                itemType={itemType}
                shop={shop}
                cart={cart}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onSelectItem={onSelectItem}
              />
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsViewAllExpanded(false);
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <ChevronUp className="w-4 h-4" />
              <span>Show Less (Carousel View)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Horizontal Carousel (Mobile: 2 full + 20% peek of 3rd, Desktop: 4 full + 20% peek of 5th, 2 rows) */
        <div className="relative group/carousel space-y-3">
          {/* Optional Left / Right Arrow buttons on Desktop */}
          {totalDots > 1 && (
            <>
              <button
                type="button"
                onClick={() => handleScrollArrow('prev')}
                className="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 border border-gray-200 text-slate-800 items-center justify-center shadow-md hover:bg-orange-600 hover:text-white transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollArrow('next')}
                className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 border border-gray-200 text-slate-800 items-center justify-center shadow-md hover:bg-orange-600 hover:text-white transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Carousel Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-2.5 sm:gap-3.5 lg:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
          >
            {itemPairs.map((pair, colIdx) => (
              <div
                key={`pair-${colIdx}`}
                className="flex flex-col gap-2.5 sm:gap-3.5 lg:gap-4 shrink-0 snap-start
                           w-[calc((100%-20px)/2.22)] min-w-[calc((100%-20px)/2.22)]
                           sm:w-[calc((100%-36px)/3.22)] sm:min-w-[calc((100%-36px)/3.22)]
                           lg:w-[calc((100%-60px)/4.22)] lg:min-w-[calc((100%-60px)/4.22)]"
              >
                {/* Row 1 Item */}
                {pair[0] && (
                  <div className="h-[265px] sm:h-[285px]">
                    <SharedItemCard
                      item={pair[0]}
                      isService={isService}
                      isCourse={isCourse}
                      itemType={itemType}
                      shop={shop}
                      cart={cart}
                      onAddToCart={onAddToCart}
                      onRemoveFromCart={onRemoveFromCart}
                      onSelectItem={onSelectItem}
                    />
                  </div>
                )}

                {/* Row 2 Item (if pair has 2 items) */}
                {pair[1] && (
                  <div className="h-[265px] sm:h-[285px]">
                    <SharedItemCard
                      item={pair[1]}
                      isService={isService}
                      isCourse={isCourse}
                      itemType={itemType}
                      shop={shop}
                      cart={cart}
                      onAddToCart={onAddToCart}
                      onRemoveFromCart={onRemoveFromCart}
                      onSelectItem={onSelectItem}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 3. Rows ke niche dots */}
          {totalDots > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1 pb-1">
              {Array.from({ length: totalDots }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDotClick(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeDot === idx
                      ? 'w-5 sm:w-6 bg-orange-600'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide group ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* 4. View All Button BELOW CAROUSEL - Only shown when content exceeds design capacity (4 on mobile, 8 on desktop) */}
          {(hasMoreContent || isViewAllExpanded) && filteredItems.length > 0 && (
            <div className="flex justify-center pt-3 pb-1">
              <button
                type="button"
                onClick={() => setIsViewAllExpanded((prev) => !prev)}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider text-white transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  isCourse
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : isService
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
                title={isViewAllExpanded ? 'Show 2-Row Carousel' : `View All ${title}`}
              >
                <span>{isViewAllExpanded ? 'Show Less (Carousel View)' : `View All (${filteredItems.length})`}</span>
                {isViewAllExpanded ? (
                  <ChevronUp className="w-4 h-4 shrink-0" />
                ) : (
                  <ArrowRight className="w-4 h-4 shrink-0" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

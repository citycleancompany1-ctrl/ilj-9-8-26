import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export interface CategoryBarItem {
  id: string;
  name: string;
  imageUrl: string;
  count: number;
}

interface StoreCategoryBarProps {
  categories: CategoryBarItem[];
  selectedCategory: string; // 'ALL' or category name
  onSelectCategory: (categoryName: string) => void;
  accentColor?: 'orange' | 'indigo' | 'blue' | 'emerald';
  allLabel?: string;
  allImage?: string;
  totalCount: number;
  sectionTitle?: string;
}

export const StoreCategoryBar: React.FC<StoreCategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  accentColor = 'orange',
  allLabel = 'All',
  allImage,
  totalCount,
  sectionTitle,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Combine "All" pill with the individual categories
  const allCategoryItem: CategoryBarItem = {
    id: 'all-category-item',
    name: allLabel,
    imageUrl:
      allImage ||
      (categories.length > 0 && categories[0].imageUrl
        ? categories[0].imageUrl
        : 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80'),
    count: totalCount,
  };

  const allItemsList = [allCategoryItem, ...categories];
  const totalItemsCount = allItemsList.length;

  // Rule:
  // Desktop: 10 per line. If > 10, carousel starts.
  // Mobile: 5 per line. If > 5, carousel starts.
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isCarousel = isDesktop ? totalItemsCount > 10 : totalItemsCount > 5;

  // Check scroll position to show/hide left & right arrows
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    checkScroll();
  }, [totalItemsCount, isDesktop]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 350);
  };

  // Color theme classes
  const colorStyles = {
    orange: {
      activeRing: 'ring-2 ring-orange-500 border-orange-500 shadow-orange-200/50',
      activeText: 'text-orange-600',
      activeBg: 'bg-orange-50/80',
      badge: 'bg-orange-600 text-white',
      badgeInactive: 'bg-slate-800/85 text-white',
      hoverBorder: 'hover:border-orange-400',
    },
    indigo: {
      activeRing: 'ring-2 ring-indigo-600 border-indigo-600 shadow-indigo-200/50',
      activeText: 'text-indigo-600',
      activeBg: 'bg-indigo-50/80',
      badge: 'bg-indigo-600 text-white',
      badgeInactive: 'bg-slate-800/85 text-white',
      hoverBorder: 'hover:border-indigo-400',
    },
    blue: {
      activeRing: 'ring-2 ring-blue-600 border-blue-600 shadow-blue-200/50',
      activeText: 'text-blue-600',
      activeBg: 'bg-blue-50/80',
      badge: 'bg-blue-600 text-white',
      badgeInactive: 'bg-slate-800/85 text-white',
      hoverBorder: 'hover:border-blue-400',
    },
    emerald: {
      activeRing: 'ring-2 ring-emerald-600 border-emerald-600 shadow-emerald-200/50',
      activeText: 'text-emerald-600',
      activeBg: 'bg-emerald-50/80',
      badge: 'bg-emerald-600 text-white',
      badgeInactive: 'bg-slate-800/85 text-white',
      hoverBorder: 'hover:border-emerald-400',
    },
  }[accentColor];

  // If there are no categories to show, return null
  if (categories.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/90 p-3 sm:p-4 shadow-2xs space-y-2.5">
      {/* Category Header Label */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
          <Layers className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span>Browse by Category {sectionTitle ? `(${sectionTitle})` : ''}</span>
          <span className="text-[10px] text-gray-400 font-bold">({categories.length} Categories)</span>
        </div>

        {selectedCategory !== 'ALL' && (
          <button
            type="button"
            onClick={() => onSelectCategory('ALL')}
            className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
          >
            Show All Items ({totalCount})
          </button>
        )}
      </div>

      {/* Category Container:
          - Desktop: 10 per line. If > 10, carousel with arrows.
          - Mobile: 5 per line. If > 5, carousel.
      */}
      <div className="relative group/catbar">
        {/* Left Arrow for Desktop Carousel */}
        {isCarousel && canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200/90 items-center justify-center text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-all cursor-pointer active:scale-90"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Categories List */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className={
            isCarousel
              ? 'flex items-start gap-3 sm:gap-4 overflow-x-auto scroll-smooth scrollbar-none py-1.5 px-0.5 snap-x'
              : `grid gap-2 sm:gap-3 py-1 ${
                  // Mobile: if <= 5, grid-cols-5. Desktop: up to grid-cols-10
                  totalItemsCount <= 5
                    ? 'grid-cols-5'
                    : totalItemsCount <= 8
                    ? 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8'
                    : 'grid-cols-5 sm:grid-cols-8 lg:grid-cols-10'
                }`
          }
        >
          {allItemsList.map((item, idx) => {
            const isAll = idx === 0;
            const isSelected = isAll
              ? selectedCategory === 'ALL'
              : selectedCategory.trim().toLowerCase() === item.name.trim().toLowerCase();

            return (
              <button
                key={item.id || item.name}
                type="button"
                onClick={() => onSelectCategory(isAll ? 'ALL' : item.name)}
                className={`flex flex-col items-center justify-start group cursor-pointer text-center select-none transition-all active:scale-95 ${
                  isCarousel ? 'shrink-0 snap-start w-[64px] sm:w-[76px] lg:w-[84px]' : 'w-full'
                }`}
                title={`${item.name} (${item.count} items)`}
              >
                {/* Category Image Circle */}
                <div
                  className={`relative w-13 h-13 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full p-0.5 transition-all duration-200 ${
                    isSelected
                      ? `${colorStyles.activeRing} shadow-sm scale-105`
                      : `border-2 border-gray-200/90 ${colorStyles.hoverBorder} hover:scale-105 bg-white`
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full bg-gray-100"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback image if broken
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80';
                    }}
                  />

                  {/* Count badge overlay on bottom right */}
                  <span
                    className={`absolute -bottom-1 -right-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono shadow-2xs border border-white leading-none ${
                      isSelected ? colorStyles.badge : colorStyles.badgeInactive
                    }`}
                  >
                    {item.count}
                  </span>
                </div>

                {/* Category Name */}
                <span
                  className={`text-[10px] sm:text-xs leading-tight line-clamp-2 text-center mt-1.5 px-0.5 transition-colors font-['Outfit',sans-serif] ${
                    isSelected
                      ? `${colorStyles.activeText} font-black`
                      : 'text-slate-700 font-bold group-hover:text-slate-950'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow for Desktop Carousel */}
        {isCarousel && canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200/90 items-center justify-center text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-all cursor-pointer active:scale-90"
            aria-label="Next categories"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

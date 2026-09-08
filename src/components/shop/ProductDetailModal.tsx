import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Store, 
  Calendar,
  Share2,
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';
import { ProductItem, Shop } from '../../types';
import { formatINR, getWhatsAppDirectUrl } from '../../utils/mediaUpload';

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  cart: { product: ProductItem; quantity: number }[];
  onAddToCart: (product: ProductItem) => void;
  onRemoveFromCart: (productId: string) => void;
  onBookService?: (serviceName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  shop,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onBookService,
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  if (!isOpen || !product) return null;

  const inCart = cart.find((item) => item.product.id === product.id);
  const isService = product.type === 'SERVICE';
  const isPriceHidden = Boolean(shop.hideAllPrices || product.hidePrice);
  const hasDiscount = !isPriceHidden && product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const defaultImg = isService
    ? 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600'
    : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';

  const displayImg = product.imageUrl || defaultImg;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | ${shop.businessName}`,
          text: isPriceHidden
            ? `Check out ${product.name} at ${shop.businessName}!`
            : `Check out ${product.name} at ${shop.businessName} for ${formatINR(product.price)}!`,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {
        // clipboard unavailable
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1">
          {/* Product Image Section */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-gray-100 overflow-hidden">
            <img
              src={displayImg}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              {isService ? (
                <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                  Service
                </span>
              ) : (
                hasDiscount && (
                  <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )
              )}

              {product.unit && (
                <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  {isService ? <Clock className="w-3 h-3" /> : null}
                  {product.unit}
                </span>
              )}
            </div>

            {/* Stock status badge */}
            <div className="absolute bottom-3 left-3 pointer-events-none">
              {product.inStock ? (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> In Stock & Available
                </span>
              ) : (
                <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Currently Out of Stock
                </span>
              )}
            </div>

            {/* Share Button on Image */}
            <button
              onClick={handleShare}
              className="absolute bottom-3 right-3 h-8 px-2.5 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 cursor-pointer text-xs font-bold"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedLink && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
            </button>
          </div>

          {/* Details Body */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Title */}
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif] leading-snug">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Store className="w-3.5 h-3.5 text-orange-600" />
                <span className="font-semibold text-slate-700">{shop.businessName}</span>
                <span>•</span>
                <span>{shop.city}, {shop.state}</span>
              </div>
            </div>

            {/* Price Block */}
            {isPriceHidden ? (
              <div className="flex items-center justify-between p-3.5 bg-amber-50/90 rounded-xl border border-amber-200">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-amber-950 font-['Outfit',sans-serif]">
                    Price on Request
                  </span>
                  <span className="text-xs text-amber-800 font-bold block mt-0.5">
                    कीमत पूछें / WhatsApp Inquiry
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-md">
                  Direct Merchant Quote
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2.5 flex-wrap p-3 bg-orange-50/60 rounded-xl border border-orange-100">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  {formatINR(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
                    {formatINR(product.originalPrice!)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                    Save {formatINR(product.originalPrice! - product.price)}
                  </span>
                )}
                {product.unit && (
                  <span className="text-xs font-bold text-gray-500">
                    / {product.unit}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Description / विवरण
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  {product.description}
                </p>
              </div>
            )}

            {/* Merchant Direct Highlights */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 pt-1">
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Direct Store Item</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Fast Direct Store Pickup / Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2 shrink-0">
          {/* If price is hidden, customer inquires price directly on WhatsApp */}
          {isPriceHidden ? (
            <div className="flex items-center gap-2">
              <a
                href={getWhatsAppDirectUrl(
                  shop.whatsapp || shop.phone,
                  `Namaste ${shop.businessName}! Mujhe "${product.name}" ki price aur details jaanni hain. Kripya best quote share karein.`
                )}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask Price on WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="py-3 px-5 sm:px-6 rounded-xl bg-gray-200 hover:bg-gray-300 text-slate-800 font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                <span>Close</span>
              </button>
            </div>
          ) : shop.ecommerceEnabled !== false ? (
            <div className="flex items-center gap-2">
              {inCart ? (
                <div className="flex-1 flex items-center justify-between bg-white border-2 border-orange-500 rounded-xl p-1 shadow-xs">
                  <button
                    onClick={() => onRemoveFromCart(product.id)}
                    className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 font-black flex items-center justify-center hover:bg-orange-200 transition-colors cursor-pointer"
                    title="Kam karein"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="text-center px-2">
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Cart Mein</span>
                    <span className="font-black text-sm text-slate-900">{inCart.quantity} Item</span>
                  </div>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-9 h-9 rounded-lg bg-orange-600 text-white font-black flex items-center justify-center hover:bg-orange-700 transition-colors cursor-pointer shadow-xs"
                    title="Badhayein"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                    product.inStock
                      ? 'bg-orange-600 hover:bg-orange-700 text-white active:scale-98'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart ({formatINR(product.price)})</span>
                </button>
              )}

              {/* OK Tick Button */}
              <button
                onClick={onClose}
                className="py-3 px-5 sm:px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                title="OK"
              >
                <Check className="w-4 h-4" />
                <span>OK</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isService && onBookService ? (
                <button
                  onClick={() => {
                    onClose();
                    onBookService(product.name);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Service Now</span>
                </button>
              ) : null}

              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs text-center cursor-pointer active:scale-98"
                title="OK"
              >
                <Check className="w-5 h-5" />
                <span>OK</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

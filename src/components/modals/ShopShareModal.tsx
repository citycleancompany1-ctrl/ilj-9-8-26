import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Store, 
  MessageCircle, 
  Send, 
  QrCode, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Shop } from '../../types';
import { getShopCanonicalUrl, getShopDescription, getShopOgImage } from '../../utils/seo';

interface ShopShareModalProps {
  shop: Shop;
  isOpen: boolean;
  onClose: () => void;
  onOpenStandeeModal?: () => void;
}

export const ShopShareModal: React.FC<ShopShareModalProps> = ({
  shop,
  isOpen,
  onClose,
  onOpenStandeeModal,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  const shopUrl = getShopCanonicalUrl(shop);
  const title = shop.tagline || shop.bannerTitle || 'Official Digital Store';
  const description = getShopDescription(shop);
  const logoUrl = getShopOgImage(shop);

  // Formatted WhatsApp caption with Shop Name, Title, and Link
  const fullShareText = `🏪 *${shop.businessName}*\n✨ *${title}*\n🏷️ ${description}\n\n📍 Address: ${shop.address || 'Local Store'}\n📞 Contact: ${shop.phone || shop.whatsapp || ''}\n\n👇 *Click here to view our catalogue & order directly:*\n${shopUrl}\n\n_Powered by IndianLalaJi.com — Verified Direct Store_`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${shop.businessName} — ${title}`,
          text: fullShareText,
          url: shopUrl,
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shopUrl)}`;
    window.open(fbUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const tweet = `${shop.businessName} — ${title}\nCheck out products & order online:\n${shopUrl}`;
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(twUrl, '_blank');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shopUrl)}&text=${encodeURIComponent(`${shop.businessName} — ${title}`)}`;
    window.open(tgUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
        
        {/* Header (Clean Light Theme) */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-orange-50 via-white to-amber-50 border-b border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>SEO & Social Share</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit',sans-serif] leading-tight">
                Share Store Website
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-slate-800 flex items-center justify-center border border-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* SEO & Social Card Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-orange-600" />
                <span>WhatsApp / Social Media Share Preview</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                SEO Meta Verified
              </span>
            </div>

            {/* Social Share Card Mockup */}
            <div className="rounded-2xl border border-gray-300 bg-slate-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              {/* Image / Logo Banner */}
              <div className="relative h-44 sm:h-48 bg-gradient-to-br from-orange-100 via-white to-amber-100 flex items-center justify-center p-4 border-b border-gray-200">
                {logoUrl ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <img 
                      src={logoUrl} 
                      alt={shop.businessName}
                      className="max-h-36 max-w-full object-contain drop-shadow-md rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg">
                    <Store className="w-10 h-10" />
                  </div>
                )}

                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span>Shop ID: {shop.shopId}</span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 bg-white space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1">
                  <span>INDIANLALAJI.COM • OFFICIAL STORE</span>
                </div>
                
                {/* Shop Name (Bold) */}
                <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {shop.businessName}
                </h4>

                {/* Title / Tagline */}
                <p className="text-xs font-bold text-orange-600">
                  {title}
                </p>

                {/* Subtitle / Description */}
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {description}
                </p>
                
                <div className="pt-1 text-[11px] text-gray-400 truncate flex items-center gap-1">
                  <Globe className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="truncate">{shopUrl}</span>
                </div>
              </div>
            </div>

            {/* OpenGraph Live Meta Tags Verification Inspector */}
            <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-gray-200 text-[11px] font-mono space-y-1 text-slate-700">
              <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                <span>Active OG Meta Tags</span>
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[9px] font-bold">Live</span>
              </div>
              <div className="truncate"><strong className="text-orange-700">og:title:</strong> {shop.businessName}</div>
              <div className="truncate"><strong className="text-orange-700">og:description:</strong> {description}</div>
              <div className="truncate"><strong className="text-orange-700">og:image:</strong> {logoUrl}</div>
              <div className="truncate"><strong className="text-orange-700">og:url:</strong> {shopUrl}</div>
              <div className="truncate"><strong className="text-orange-700">og:type:</strong> website</div>
            </div>
          </div>

          {/* Primary Quick Share Buttons */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Direct Share
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Share on WhatsApp</span>
              </button>

              {/* Native / Device Share Button */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile Native Share</span>
              </button>
            </div>

            {/* Other Channels: Facebook, Telegram, Twitter */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={handleFacebookShare}
                className="py-2.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={handleTelegramShare}
                className="py-2.5 px-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>

              <button
                type="button"
                onClick={handleTwitterShare}
                className="py-2.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-slate-800 border border-gray-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Twitter / X</span>
              </button>
            </div>
          </div>

          {/* Copy Link & Caption */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shopUrl}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 select-all focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMessage ? 'Full WhatsApp Caption Copied!' : 'Copy Full WhatsApp Caption with Logo & Link'}</span>
            </button>
          </div>

          {/* Dukaan QR Standee Modal Shortcut */}
          {onOpenStandeeModal && (
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStandeeModal();
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-700" />
                <span>Print Counter QR Standee & App Scanners</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

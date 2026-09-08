import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Shop, CartItem, ProductItem } from '../../types';
import { formatINR, getWhatsAppDirectUrl } from '../../utils/mediaUpload';

interface CheckoutInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  cart: CartItem[];
  onOpenQrModal?: () => void;
  onOrderSuccess?: () => void;
  onAddToCart?: (product: ProductItem) => void;
  onRemoveFromCart?: (productId: string) => void;
}

export const CheckoutInvoiceModal: React.FC<CheckoutInvoiceModalProps> = ({
  isOpen,
  onClose,
  shop,
  cart,
  onOpenQrModal,
  onAddToCart,
  onRemoveFromCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderId] = useState(() => `ILJ-${Math.floor(100000 + Math.random() * 900000)}`);
  const [orderDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  });

  const [invoiceImageUrl, setInvoiceImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Generate Canvas Invoice Image
  useEffect(() => {
    if (!isOpen || cart.length === 0) return;

    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution width & dynamic height
    const width = 800;
    const baseHeight = 580;
    const itemRowHeight = 44;
    const itemsHeight = cart.length * itemRowHeight;
    const customerBlockHeight = customerName || customerPhone || customerAddress ? 80 : 40;
    const height = baseHeight + itemsHeight + customerBlockHeight;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Top Header Pattern / Brand Banner
    const brandGradient = ctx.createLinearGradient(0, 0, width, 0);
    brandGradient.addColorStop(0, '#EA580C'); // Orange 600
    brandGradient.addColorStop(1, '#C2410C'); // Orange 700
    ctx.fillStyle = brandGradient;
    ctx.fillRect(0, 0, width, 12);

    // Header Content
    let currentY = 45;

    // "TAX INVOICE / ORDER BILL" Badge
    ctx.fillStyle = '#F97316';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('DIRECT STORE INVOICE / ESTIMATE BILL', 40, currentY);

    // Order ID & Date on top right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`ORDER #${orderId}`, width - 40, currentY);

    ctx.fillStyle = '#64748B';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Date: ${orderDate}`, width - 40, currentY + 20);
    ctx.textAlign = 'left';

    currentY += 25;

    // Store Business Name
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 24px sans-serif';
    ctx.fillText(shop.businessName || 'Verified Store', 40, currentY);

    currentY += 20;
    // Store Tagline / Phone
    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    const storeContactText = `Phone/WhatsApp: ${shop.phone || shop.whatsapp || 'N/A'} • ${shop.category || 'Direct Merchant'}`;
    ctx.fillText(storeContactText, 40, currentY);

    currentY += 18;
    if (shop.address) {
      ctx.fillStyle = '#64748B';
      ctx.font = '11px sans-serif';
      ctx.fillText(`Address: ${shop.address}`, 40, currentY);
      currentY += 18;
    }

    // Divider Line
    currentY += 10;
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, currentY);
    ctx.lineTo(width - 40, currentY);
    ctx.stroke();

    // Customer Info Card
    currentY += 20;
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    const custBoxH = customerName || customerPhone || customerAddress ? 68 : 36;
    ctx.beginPath();
    ctx.roundRect(40, currentY, width - 80, custBoxH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('CUSTOMER / DELIVERY TO:', 55, currentY + 22);

    if (customerName || customerPhone || customerAddress) {
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 13px sans-serif';
      const cDetails = [
        customerName ? customerName : 'Valued Customer',
        customerPhone ? `(${customerPhone})` : '',
      ].filter(Boolean).join(' ');
      ctx.fillText(cDetails, 220, currentY + 22);

      if (customerAddress) {
        ctx.fillStyle = '#64748B';
        ctx.font = '11px sans-serif';
        ctx.fillText(`Delivery Address: ${customerAddress}`, 55, currentY + 48);
      }
    } else {
      ctx.fillStyle = '#64748B';
      ctx.font = 'italic 12px sans-serif';
      ctx.fillText('Direct Customer Order via Website', 220, currentY + 22);
    }

    currentY += custBoxH + 20;

    // Table Header
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(40, currentY, width - 80, 36, 4);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('#', 55, currentY + 22);
    ctx.fillText('ITEM / SERVICE NAME', 85, currentY + 22);
    ctx.fillText('TYPE', 430, currentY + 22);
    ctx.textAlign = 'center';
    ctx.fillText('QTY', 525, currentY + 22);
    ctx.textAlign = 'right';
    ctx.fillText('RATE', 640, currentY + 22);
    ctx.fillText('AMOUNT', width - 55, currentY + 22);
    ctx.textAlign = 'left';

    currentY += 36;

    // Items List
    cart.forEach((item, index) => {
      currentY += 8;

      // Alternating row background
      if (index % 2 === 1) {
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(40, currentY - 6, width - 80, itemRowHeight);
      }

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`${index + 1}`, 55, currentY + 18);

      // Item Name
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 12px sans-serif';
      let title = item.product.name;
      if (title.length > 38) {
        title = title.substring(0, 35) + '...';
      }
      ctx.fillText(title, 85, currentY + 18);

      // Type Badge (Product or Service)
      const isService = item.product.type === 'SERVICE';
      ctx.fillStyle = isService ? '#EFF6FF' : '#F1F5F9';
      ctx.strokeStyle = isService ? '#93C5FD' : '#CBD5E1';
      ctx.beginPath();
      ctx.roundRect(425, currentY + 4, 60, 20, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isService ? '#1D4ED8' : '#475569';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(isService ? 'SERVICE' : 'PRODUCT', 432, currentY + 18);

      // QTY
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`${item.quantity}`, 525, currentY + 18);

      // Unit Rate
      ctx.textAlign = 'right';
      ctx.fillStyle = '#475569';
      ctx.font = '12px sans-serif';
      ctx.fillText(`₹${item.product.price.toLocaleString('en-IN')}`, 640, currentY + 18);

      // Item Total
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 13px sans-serif';
      const itemSubtotal = item.product.price * item.quantity;
      ctx.fillText(`₹${itemSubtotal.toLocaleString('en-IN')}`, width - 55, currentY + 18);
      ctx.textAlign = 'left';

      currentY += itemRowHeight - 8;

      // Light separator
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, currentY);
      ctx.lineTo(width - 40, currentY);
      ctx.stroke();
    });

    currentY += 15;

    // Totals Section Box
    const totalBoxW = 340;
    const totalBoxX = width - 40 - totalBoxW;

    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(totalBoxX, currentY, totalBoxW, 110, 6);
    ctx.fill();
    ctx.stroke();

    // Items Subtotal
    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Items Subtotal (${totalItemsCount} items):`, totalBoxX + 15, currentY + 28);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`₹${totalAmount.toLocaleString('en-IN')}`, totalBoxX + totalBoxW - 15, currentY + 28);
    ctx.textAlign = 'left';

    // 0% Platform Fee / Direct Store
    ctx.fillStyle = '#15803D'; // Emerald
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Platform Commission / Fee:', totalBoxX + 15, currentY + 54);
    ctx.textAlign = 'right';
    ctx.fillText('₹0 (0% Direct Store)', totalBoxX + totalBoxW - 15, currentY + 54);
    ctx.textAlign = 'left';

    // Grand Total Divider
    ctx.strokeStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.moveTo(totalBoxX + 10, currentY + 68);
    ctx.lineTo(totalBoxX + totalBoxW - 10, currentY + 68);
    ctx.stroke();

    // Grand Total
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 14px sans-serif';
    ctx.fillText('TOTAL PAYABLE:', totalBoxX + 15, currentY + 95);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#EA580C'; // Orange
    ctx.font = '900 19px sans-serif';
    ctx.fillText(`₹${totalAmount.toLocaleString('en-IN')}`, totalBoxX + totalBoxW - 15, currentY + 95);
    ctx.textAlign = 'left';

    // Left side: Payment Instructions & IndianLalaJi Trust Seal
    ctx.fillStyle = '#FFF7ED';
    ctx.strokeStyle = '#FED7AA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(40, currentY, totalBoxX - 55, 110, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#9A3412';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('DIRECT PAYMENT & DELIVERY', 55, currentY + 26);

    ctx.fillStyle = '#7C2D12';
    ctx.font = '10px sans-serif';
    ctx.fillText('• 0% Middleman Commission store', 55, currentY + 46);
    ctx.fillText('• Pay directly to store via Cash / UPI on Delivery', 55, currentY + 64);
    ctx.fillText(`• Store UPI: ${shop.upiId || '7087033009@paytm'}`, 55, currentY + 82);
    ctx.fillText('• Share this bill on WhatsApp to confirm delivery', 55, currentY + 100);

    currentY += 135;

    // Bottom Footer Banner
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, height - 42, width, 42);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Thank you for shopping directly with local merchants! • Powered by IndianLalaJi.com', 40, height - 16);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#F97316';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('VERIFIED DIRECT STORE', width - 40, height - 16);
    ctx.textAlign = 'left';

    // Export to Data URL
    const dataUrl = canvas.toDataURL('image/png');
    setInvoiceImageUrl(dataUrl);
    setIsGenerating(false);
  }, [isOpen, cart, shop, customerName, customerPhone, customerAddress, orderId, orderDate]);

  if (!isOpen) return null;

  // Formatted WhatsApp Message
  const itemsTextList = cart
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} [${item.product.type === 'SERVICE' ? 'Service' : 'Product'}] x ${
          item.quantity
        } = ${formatINR(item.product.price * item.quantity)}`
    )
    .join('\n');

  const customerText = [
    customerName ? `👤 Customer: ${customerName}` : '',
    customerPhone ? `📞 Phone: ${customerPhone}` : '',
    customerAddress ? `📍 Address: ${customerAddress}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const fullWhatsAppMessage = `*🧾 NEW ORDER INVOICE #${orderId}*\n*Store:* ${shop.businessName}\n*Date:* ${orderDate}\n\n${customerText ? `${customerText}\n\n` : ''}*Items Ordered:*\n${itemsTextList}\n\n*Total Amount: ${formatINR(
    totalAmount
  )}*\n\n✅ Please verify and confirm my order. I have saved/attached the invoice bill!`;

  const directWhatsAppUrl = getWhatsAppDirectUrl(
    shop.whatsapp || shop.phone,
    fullWhatsAppMessage
  );

  // 1. Download Invoice Image
  const handleDownloadImage = () => {
    if (!invoiceImageUrl) return;
    const a = document.createElement('a');
    a.href = invoiceImageUrl;
    a.download = `Invoice_${shop.businessName.replace(/\s+/g, '_')}_${orderId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // 2. Share Invoice on WhatsApp
  const handleShareWhatsApp = async () => {
    // If Web Share API is available with file support (Mobile browsers)
    if (invoiceImageUrl && navigator.canShare) {
      try {
        const res = await fetch(invoiceImageUrl);
        const blob = await res.blob();
        const file = new File([blob], `Invoice_${orderId}.png`, { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Order Invoice #${orderId} - ${shop.businessName}`,
            text: fullWhatsAppMessage,
            files: [file],
          });
          return;
        }
      } catch (err) {
        console.log('Native share failed or dismissed, falling back to WhatsApp link:', err);
      }
    }

    // Fallback: Trigger download so user has the image, and open WhatsApp directly
    handleDownloadImage();
    window.open(directWhatsAppUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh]">
        {/* 1. HEADER: ONLY "Order Invoice & Bill" + CLOSE BUTTON */}
        <div className="p-4 sm:px-5 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0 border-b border-slate-800">
          <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white font-['Outfit',sans-serif]">
            Order Invoice & Bill
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="overflow-y-auto p-3.5 sm:p-5 space-y-3.5 bg-gray-50 flex-1">
          {/* 2. SECTION 2: NAME + MOBILE NUMBER IN ONE LINE, ADDRESS UNDERNEATH */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Name / आपका नाम"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 bg-white placeholder-gray-400 text-slate-900"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Mobile Number / मोबाइल नंबर"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 bg-white placeholder-gray-400 text-slate-900"
              />
            </div>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Delivery Address / पूरा पता (House/Shop No, Area, City)"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 bg-white placeholder-gray-400 text-slate-900"
            />
          </div>

          {/* 3. SECTION 3: BILL KI IMAGE BS */}
          <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-xs flex items-center justify-center min-h-[180px]">
            {isGenerating ? (
              <div className="py-16 text-center space-y-2 text-xs text-gray-500">
                <Sparkles className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
                <p className="font-semibold">Generating Bill Image...</p>
              </div>
            ) : invoiceImageUrl ? (
              <img
                src={invoiceImageUrl}
                alt="Order Bill"
                className="w-full max-h-[480px] object-contain rounded-lg border border-gray-200 shadow-xs bg-white"
              />
            ) : (
              <div className="py-16 text-center text-xs text-gray-500">
                Loading bill...
              </div>
            )}
          </div>
        </div>

        {/* 4. SECTION 4: 2 BUTTONS (LEFT: DOWNLOAD IMAGE, RIGHT: SHARE ON WHATSAPP) - NICHE KUCH NAHI */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-gray-200 shrink-0">
          <div className="grid grid-cols-2 gap-3">
            {/* Left Button: Download Image */}
            <button
              id="btn-download-bill-image"
              type="button"
              onClick={handleDownloadImage}
              className="w-full py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>{downloadSuccess ? 'Downloaded! ✓' : 'Download Image'}</span>
            </button>

            {/* Right Button: Share on WhatsApp */}
            <button
              id="btn-share-bill-whatsapp"
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

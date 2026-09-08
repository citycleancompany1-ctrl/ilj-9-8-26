/**
 * Media and Utility helpers for IndianLalaJi.com
 */

export function generateShopId(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `SHP0${randomDigits}`;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getYouTubeEmbedUrl(urlOrId: string, autoplay: boolean = false): string | null {
  if (!urlOrId) return null;
  
  const trimmed = urlOrId.trim();
  const videoId = getYouTubeVideoId(trimmed);
  if (videoId) {
    const params = new URLSearchParams();
    if (autoplay) {
      params.set('autoplay', '1');
    }
    params.set('rel', '0');
    params.set('modestbranding', '1');
    params.set('enablejsapi', '1');
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  return null;
}

export function getYouTubeVideoId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return getYouTubeVideoId(srcMatch[1]);
    }
  }

  const idMatch = trimmed.match(/(?:(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|v\/|e\/|shorts\/|live\/|embed\/|user\/[^\/]+\/u\/[0-9]\/)))([a-zA-Z0-9_-]{11})/i);
  if (idMatch && idMatch[1]) return idMatch[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

export function getYouTubeThumbnail(urlOrId: string): string {
  const videoId = getYouTubeVideoId(urlOrId);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80';
}

export function getWhatsAppDirectUrl(phone: string | undefined | null, message: string): string {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedMsg = encodeURIComponent(message || '');
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMsg}`;
}

export function getWhatsAppCartMessageUrl(
  phone: string,
  businessName: string,
  cartItems: { product: { name: string; price: number }; quantity: number }[]
): string {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemsList = cartItems
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} x ${item.quantity} = ${formatINR(
          item.product.price * item.quantity
        )}`
    )
    .join('\n');

  const message = `Namaste ${businessName} Ji! 🙏\n\nMaine aapki IndianLalaJi digital store website se order banaya hai:\n\n${itemsList}\n\n*Total Bill: ${formatINR(
    totalAmount
  )}*\n\nKripya mera order confirm karein aur payment/delivery details share karein. Dhanyawaad!`;

  return getWhatsAppDirectUrl(phone, message);
}

/**
 * Reads a File object and converts it to a Base64 data URL with automatic compression/resizing
 * Optimized to keep image size ~30-70KB for fast cross-device Firestore synchronization
 */
export function fileToBase64(file: File, maxWidth = 800, maxHeight = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG 0.72 quality for optimal size (<60KB) & fast cloud sync
          const compressed = canvas.toDataURL('image/jpeg', 0.72);
          resolve(compressed);
        } else {
          resolve(img.src);
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Format date string (ISO or YYYY-MM-DD) into readable Indian format e.g. "15 Aug 2026"
 */
export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Calculate remaining days until expiry date
 */
export function calculateDaysRemaining(expiryDateStr?: string): number {
  if (!expiryDateStr) return 365;
  try {
    const expiry = new Date(expiryDateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  } catch {
    return 0;
  }
}

/**
 * Calculate 1-Year Expiry Date from given start date
 */
export function getOneYearExpiryDate(startDateStr?: string): string {
  const start = startDateStr ? new Date(startDateStr) : new Date();
  const nextYear = new Date(start);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  return nextYear.toISOString().split('T')[0];
}

/**
 * Generate a standard tax invoice number for 1-Year store subscription
 */
export function generateInvoiceNumber(shopId?: string): string {
  const year = new Date().getFullYear();
  const cleanId = (shopId || '0000').replace(/[^0-9]/g, '').slice(-4) || '1001';
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `ILJ-${year}-${cleanId}${randomSuffix}`;
}

/**
 * Sanitize and normalize a custom domain name (removes protocol, port, trailing slash)
 */
export function sanitizeDomain(domainStr: string): string {
  if (!domainStr) return '';
  return domainStr
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, 'www.')
    .replace(/\/.*$/, '')
    .replace(/[^a-z0-9.-]/g, '');
}


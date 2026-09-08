export type IndianThemeLayoutArchetype =
  | 'royal-palace'
  | 'sacred-ghat'
  | 'jharokha-boutique'
  | 'flowing-river'
  | 'cyber-terminal'
  | 'mandir-gopuram'
  | 'glacier-minimal'
  | 'carnival-bazaar'
  | 'backwater-retreat'
  | 'runway-chic';

export interface IndianTheme {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  description: string;
  categoryFit: string;
  layoutArchetype: IndianThemeLayoutArchetype;
  layoutLabel: string;
  layoutDescription: string;
  layoutBadge: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgGradient: string;
  headerGradient: string;
  cardBorder: string;
  cardRadius: string;
  accentBadgeBg: string;
  buttonGradient: string;
  animationType:
    | 'shimmer-gold'
    | 'spiritual-diya'
    | 'palace-bloom'
    | 'water-wave'
    | 'neon-pulse'
    | 'surya-radiance'
    | 'frost-breeze'
    | 'confetti-bounce'
    | 'leaf-sway'
    | 'cosmo-glide';
  animationLabel: string;
  animationClass: string;
  previewColorSwatches: string[];
  features: string[];
  isFree?: boolean;
  isActive?: boolean;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const INDIAN_LAYOUT_THEMES: IndianTheme[] = [
  {
    id: 'bharat-royal',
    name: 'Bharat Royal',
    hindiName: 'भारत रॉयल',
    tagline: 'Grand Saffron & 24K Gold Royal Heritage',
    description:
      'Rajwada aur royal darbar se prerit design. Shimmering gold borders, rich saffron accents, ornate typography aur grand luxury feel.',
    categoryFit: 'Jewellery, Silk & Sarees, Heritage Sweets, Luxury Handicrafts, Royal Gifts',
    layoutArchetype: 'royal-palace',
    layoutLabel: 'Arch Pedestal & Golden Medallions',
    layoutDescription: 'Double-gold arched frames, traditional crest header, royal seal badges aur grand pedestal cards.',
    layoutBadge: '🏛️ Grand Palace Architecture',
    primaryColor: '#D97706', // Saffron Amber
    secondaryColor: '#B45309',
    accentColor: '#F59E0B',
    bgGradient: 'from-amber-50 via-orange-50/40 to-yellow-50/30',
    headerGradient: 'from-amber-950 via-slate-900 to-amber-900 text-amber-100 border-b-2 border-amber-500/60',
    cardBorder: 'border-amber-300/80 hover:border-amber-500 shadow-sm hover:shadow-amber-100 hover:shadow-lg',
    cardRadius: 'rounded-xl',
    accentBadgeBg: 'bg-amber-100 text-amber-900 border border-amber-300',
    buttonGradient: 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white shadow-amber-200',
    animationType: 'shimmer-gold',
    animationLabel: '✨ 24K Gold Shimmer Pulse',
    animationClass: 'animate-pulse ring-2 ring-amber-400/40',
    previewColorSwatches: ['#D97706', '#F59E0B', '#78350F', '#FEF3C7'],
    features: ['Royal Gold Etched Borders', 'Ornate Saffron Badges', 'Ambient Luxury Glow', 'Grand Heritage Typography'],
    isFree: true,
  },
  {
    id: 'kashi-heritage',
    name: 'Kashi Heritage',
    hindiName: 'काशी हेरिटेज',
    tagline: 'Sacred Terracotta Ochre & Sandstone Purity',
    description:
      'Ghats of Kashi, peetal ke bartan aur sandstone deewaron ka aalaukik sangam. Traditional trust, shuddhata aur apnepan ki pehchan.',
    categoryFit: 'Pooja Samagri, Ayurvedic Medicines, Organic Foods, Traditional Kirana, Banarasi Sarees',
    layoutArchetype: 'sacred-ghat',
    layoutLabel: 'Sandstone Split-Ghat & Khata-Bahi Cards',
    layoutDescription: 'Split hero layout with auspicious Diya glow, continuous Vedic purity ribbon aur authentic parchment ledger cards.',
    layoutBadge: '🪔 Split Ghat & Bahi-Khata',
    primaryColor: '#EA580C', // Terracotta Orange
    secondaryColor: '#C2410C',
    accentColor: '#FB923C',
    bgGradient: 'from-orange-50/60 via-amber-50/40 to-stone-50',
    headerGradient: 'from-orange-950 via-stone-900 to-orange-900 text-orange-100 border-b-2 border-orange-500/60',
    cardBorder: 'border-orange-200 hover:border-orange-400 shadow-sm hover:shadow-orange-100 hover:shadow-lg',
    cardRadius: 'rounded-xl',
    accentBadgeBg: 'bg-orange-100 text-orange-950 border border-orange-300',
    buttonGradient: 'bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white shadow-orange-200',
    animationType: 'spiritual-diya',
    animationLabel: '🪔 Sacred Diya Warm Glow',
    animationClass: 'animate-[pulse_3s_ease-in-out_infinite]',
    previewColorSwatches: ['#EA580C', '#C2410C', '#431407', '#FFEDD5'],
    features: ['Authentic Sandstone Hue', 'Temple Brass Accent Ribbons', 'Gentle Hover Aura', 'Vedic Trust Badges'],
    isFree: true,
  },
  {
    id: 'jaipur-haveli',
    name: 'Jaipur Haveli',
    hindiName: 'जयपुर हवेली',
    tagline: 'Pink City Rose, Floral Courtyard & Marigold Festive',
    description:
      'Gulabi nagari Jaipur ke jharokhe aur phoolon ki sajawat. Vibrant rose tones, delicate petal curves aur festive elegance.',
    categoryFit: 'Women Ethnic Wear, Bridal Boutique, Home Furnishing, Block Prints, Footwear & Juttis',
    layoutArchetype: 'jharokha-boutique',
    layoutLabel: 'Editorial Lookbook & Jharokha Archway',
    layoutDescription: 'Tall 3:4 portrait cards, boutique floating badges, heart save button aur curved floral header banner.',
    layoutBadge: '🌸 Editorial Lookbook Grid',
    primaryColor: '#E11D48', // Rose Pink
    secondaryColor: '#BE123C',
    accentColor: '#FB7185',
    bgGradient: 'from-rose-50/60 via-pink-50/40 to-amber-50/30',
    headerGradient: 'from-rose-950 via-slate-900 to-rose-900 text-rose-100 border-b-2 border-rose-500/60',
    cardBorder: 'border-rose-200 hover:border-rose-400 shadow-sm hover:shadow-rose-100 hover:shadow-lg',
    cardRadius: 'rounded-2xl',
    accentBadgeBg: 'bg-rose-100 text-rose-900 border border-rose-300',
    buttonGradient: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-rose-200',
    animationType: 'palace-bloom',
    animationLabel: '🌸 Floral Palace Bloom',
    animationClass: 'hover:scale-[1.02] transition-transform duration-300',
    previewColorSwatches: ['#E11D48', '#BE123C', '#881337', '#FFE4E6'],
    features: ['Pink City Rose Accents', 'Jharokha Architectural Curves', 'Floral Glow Badges', 'Boutique Elegance'],
    isFree: true,
  },
  {
    id: 'ganga-serene',
    name: 'Ganga Serene',
    hindiName: 'गंगा सरीन',
    tagline: 'River Aqua Teal, Flowing Wave & Pristine Calm',
    description:
      'Ganga ki sheetal lehrein aur neela jal. Purity, swachhata aur modern cooling aesthetics jo dil ko shanti pradan kare.',
    categoryFit: 'Dairy Products, Purified Water, Health & Nutrition, Laundry & Cleaning, Natural Cosmetics',
    layoutArchetype: 'flowing-river',
    layoutLabel: 'Horizontal Stream & Wave-Cut Freshness',
    layoutDescription: 'Side-by-side horizontal product rows, quantity steppers, water-drop purity meter aur dual-action wave hero.',
    layoutBadge: '🌊 Streamlined Horizontal Rows',
    primaryColor: '#0D9488', // Teal Aqua
    secondaryColor: '#0F766E',
    accentColor: '#14B8A6',
    bgGradient: 'from-teal-50/60 via-cyan-50/40 to-slate-50',
    headerGradient: 'from-teal-950 via-slate-900 to-teal-900 text-teal-100 border-b-2 border-teal-500/60',
    cardBorder: 'border-teal-200 hover:border-teal-400 shadow-sm hover:shadow-teal-100 hover:shadow-lg',
    cardRadius: 'rounded-xl',
    accentBadgeBg: 'bg-teal-100 text-teal-900 border border-teal-300',
    buttonGradient: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-teal-200',
    animationType: 'water-wave',
    animationLabel: '🌊 Sacred Water Wave Ripple',
    animationClass: 'ring-1 ring-teal-400/50 hover:ring-2 transition-all',
    previewColorSwatches: ['#0D9488', '#0F766E', '#134E4A', '#CCFBF1'],
    features: ['Aqua Flow Gradients', 'Cooling Cyan Badges', 'Refreshing Wave Cards', 'Purity Verified Indicators'],
    isFree: true,
  },
  {
    id: 'deccan-neo',
    name: 'Deccan Neo',
    hindiName: 'डेक्कन नियो',
    tagline: 'Cyber Obsidian Charcoal & Electric Amber Pulse',
    description:
      'Bengaluru aur Hyderabad ke tech hub se inspired. High-contrast dark obsidian cards, electric neon accents aur modern futuristic agility.',
    categoryFit: 'Electronics & Mobiles, IT & Computers, Gadgets, Gaming, Automobile Spares & Hardware',
    layoutArchetype: 'cyber-terminal',
    layoutLabel: 'Obsidian Tech Terminal & Spec-Matrix Bento',
    layoutDescription: 'Dark mode cyber terminal, live status telemetry indicators, monospace specs matrix aur glowing amber trigger.',
    layoutBadge: '⚡ Tech Spec Bento Matrix',
    primaryColor: '#0F172A', // Obsidian
    secondaryColor: '#334155',
    accentColor: '#F59E0B', // Neon Amber
    bgGradient: 'from-slate-100 via-gray-50 to-slate-100',
    headerGradient: 'from-black via-slate-950 to-slate-900 text-white border-b border-amber-500',
    cardBorder: 'border-slate-800/20 hover:border-amber-500 shadow-sm hover:shadow-xl hover:shadow-amber-500/10',
    cardRadius: 'rounded-lg',
    accentBadgeBg: 'bg-slate-900 text-amber-400 border border-amber-400/40',
    buttonGradient: 'bg-gradient-to-r from-slate-900 via-amber-600 to-slate-900 hover:from-black hover:to-slate-950 text-amber-200 border border-amber-500/40',
    animationType: 'neon-pulse',
    animationLabel: '⚡ Electric Neon Amber Glow',
    animationClass: 'hover:shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-shadow duration-300',
    previewColorSwatches: ['#0F172A', '#F59E0B', '#1E293B', '#F1F5F9'],
    features: ['Dark Mode Tech Accents', 'Electric Amber Indicators', 'Sharp Precision Corners', 'Spec Matrix Layout'],
    isFree: true,
  },
  {
    id: 'ayodhya-divine',
    name: 'Ayodhya Divine',
    hindiName: 'अयोध्या डिवाइन',
    tagline: 'Surya Marigold Gold & Auspicious Red Splendor',
    description:
      'Surya Dev ki swarnim kiranon aur mangalmay vermillion ka pavitra swaroop. Shubharambh, vishwas aur mangalkari shakti se bharpoor.',
    categoryFit: 'Religious Books, Murti & Idols, Traditional Sweets, Dry Fruits, Wedding Cards & Gifts',
    layoutArchetype: 'mandir-gopuram',
    layoutLabel: 'Mandir Gopuram & Sanctified Prasad Thali',
    layoutDescription: 'Temple shikhar arch banner, auspicious Shubh-Labh golden bells, sanctified Diya ribbon aur Prasad thali cards.',
    layoutBadge: '🛕 Mandir Gopuram & Thali Grid',
    primaryColor: '#B45309', // Surya Amber
    secondaryColor: '#DC2626', // Sacred Vermillion
    accentColor: '#FBBF24',
    bgGradient: 'from-yellow-50/70 via-orange-50/50 to-amber-50/30',
    headerGradient: 'from-orange-950 via-red-950 to-amber-950 text-amber-100 border-b-2 border-yellow-500',
    cardBorder: 'border-amber-300 hover:border-red-500 shadow-sm hover:shadow-amber-100 hover:shadow-lg',
    cardRadius: 'rounded-xl',
    accentBadgeBg: 'bg-gradient-to-r from-amber-100 to-red-100 text-red-950 border border-red-300',
    buttonGradient: 'bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 hover:from-red-700 hover:to-amber-700 text-white shadow-amber-200',
    animationType: 'surya-radiance',
    animationLabel: '☀️ Surya Radiance Aura',
    animationClass: 'hover:ring-2 hover:ring-amber-500 transition-all duration-300',
    previewColorSwatches: ['#B45309', '#DC2626', '#FBBF24', '#FEF3C7'],
    features: ['Surya Golden Sunrise Trim', 'Auspicious Red Highlights', 'Bhakti Mandap Framing', 'Mangal Festive Radiance'],
    isFree: true,
  },
  {
    id: 'himalaya-pure',
    name: 'Himalaya Pure',
    hindiName: 'हिमालय प्योर',
    tagline: 'Snow Glacier Azure, Crisp Air & Modern Minimalist',
    description:
      'Himalaya ki barfil chotiyon aur shuddh hawa jaisa clean design. Zero clutter, wide spacing, frosted glass effects aur effortless clarity.',
    categoryFit: 'Pharmacy & Clinics, Optical & Eyewear, Stationery, Pure Honey & Mountain Herbs, Consultancy',
    layoutArchetype: 'glacier-minimal',
    layoutLabel: 'Swiss-Minimalist & Clinical Precision Directory',
    layoutDescription: 'Ultra-spacious white canvas, hairline ice-blue grid, clinical purity statistics strip aur flat modern controls.',
    layoutBadge: '❄️ Swiss Clean Precision Grid',
    primaryColor: '#0284C7', // Azure Blue
    secondaryColor: '#0369A1',
    accentColor: '#38BDF8',
    bgGradient: 'from-sky-50/60 via-slate-50 to-blue-50/30',
    headerGradient: 'from-slate-900 via-sky-950 to-slate-950 text-sky-100 border-b border-sky-400/40',
    cardBorder: 'border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-sky-100 hover:shadow-md',
    cardRadius: 'rounded-xl',
    accentBadgeBg: 'bg-sky-100 text-sky-900 border border-sky-200',
    buttonGradient: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-sky-200',
    animationType: 'frost-breeze',
    animationLabel: '❄️ Glacial Frost Glass Glow',
    animationClass: 'hover:-translate-y-1 transition-transform duration-200',
    previewColorSwatches: ['#0284C7', '#0369A1', '#0C4A6E', '#E0F2FE'],
    features: ['Glacial Ice Azure Sheen', 'Minimalist Spacious Layout', 'Frosted Backdrop Elements', 'Crisp Medical-Grade Clarity'],
    isFree: true,
  },
  {
    id: 'utsav-vibrant',
    name: 'Utsav Vibrant',
    hindiName: 'उत्सव वाइब्रेंट',
    tagline: 'Ruby Crimson, Emerald Fortune & Festive Carnival',
    description:
      'Diwali, Holi, Eid aur Indian wedding festivals ka jashn! Double gradient festive burst, confetti animations aur high-energy celebration mood.',
    categoryFit: 'Event Organizers, Sweet Shops, Party Goods, Fireworks & Celebrations, Gift Hampers, Toys',
    layoutArchetype: 'carnival-bazaar',
    layoutLabel: 'Festive Bazaar Mela & Dhamaka Deal Badges',
    layoutDescription: 'Celebration confetti hero, diagonal corner "धमाका बचत" ribbons, energetic dual gradients aur bounce CTA.',
    layoutBadge: '🎉 Festive Carnival & Mela Grid',
    primaryColor: '#BE123C', // Ruby
    secondaryColor: '#047857', // Emerald
    accentColor: '#F59E0B',
    bgGradient: 'from-rose-50/70 via-emerald-50/50 to-amber-50/40',
    headerGradient: 'from-rose-950 via-slate-900 to-emerald-950 text-amber-100 border-b-2 border-amber-400',
    cardBorder: 'border-rose-200 hover:border-emerald-500 shadow-sm hover:shadow-rose-100 hover:shadow-lg',
    cardRadius: 'rounded-2xl',
    accentBadgeBg: 'bg-gradient-to-r from-rose-100 to-amber-100 text-rose-900 border border-rose-300',
    buttonGradient: 'bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-600 hover:opacity-95 text-white shadow-rose-200',
    animationType: 'confetti-bounce',
    animationLabel: '🎉 Celebration Confetti Bounce',
    animationClass: 'hover:scale-105 transition-transform duration-200',
    previewColorSwatches: ['#BE123C', '#047857', '#F59E0B', '#FFF1F2'],
    features: ['Dual Ruby & Emerald Ribbon', 'Festive Offer Explosion', 'High Energy Call-to-Actions', 'Joyous Carnival Layout'],
    isFree: true,
  },
  {
    id: 'kerala-palms',
    name: 'Kerala Palms',
    hindiName: 'केरल पाम्स',
    tagline: 'Lush Forest Emerald, Backwaters & Organic Earth',
    description:
      'God’s Own Country ke nariyal ke bagan, masalon ki khushboo aur shant backwaters. Natural, eco-friendly aur Ayurvedic wellness feel.',
    categoryFit: 'Spices & Condiments, Handloom & Coir, Natural Wellness, Tea & Coffee Estates, Organic Vegetables',
    layoutArchetype: 'backwater-retreat',
    layoutLabel: 'Organic Harvest Crate & Farm-to-Door Fresh',
    layoutDescription: 'Eco-lodge canopy banner, farm harvest origin seals, organic benefits checklist aur botanical wooden crate cards.',
    layoutBadge: '🌿 Farm Harvest Crate Layout',
    primaryColor: '#15803D', // Forest Green
    secondaryColor: '#166534',
    accentColor: '#84CC16',
    bgGradient: 'from-emerald-50/60 via-green-50/40 to-stone-50',
    headerGradient: 'from-emerald-950 via-stone-900 to-green-950 text-emerald-100 border-b-2 border-emerald-500/60',
    cardBorder: 'border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-emerald-100 hover:shadow-lg',
    cardRadius: 'rounded-xl',
    accentBadgeBg: 'bg-emerald-100 text-emerald-950 border border-emerald-300',
    buttonGradient: 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-emerald-200',
    animationType: 'leaf-sway',
    animationLabel: '🌿 Tropical Leaf Gentle Sway',
    animationClass: 'hover:-translate-y-1 transition-transform duration-300',
    previewColorSwatches: ['#15803D', '#166534', '#064E3B', '#D1FAE5'],
    features: ['Tropical Forest Gradients', 'Organic Earth Shadows', 'Ayurveda Herb Badges', 'Eco-Conscious Atmosphere'],
    isFree: true,
  },
  {
    id: 'bombay-modern',
    name: 'Bombay Modern',
    hindiName: 'बॉम्बे मॉडर्न',
    tagline: 'Midnight Marine Drive, Sunset Lilac & Urban Chic',
    description:
      'Mumbai ki high-street shopping, Marine Drive sunset aur metropolitan luxury style. Ultra-sleek rounded pill buttons aur runway chic vibe.',
    categoryFit: 'Designer Apparel, Luxury Perfumes, Gourmet Cafes, Footwear, Modern Lifestyle Accessories',
    layoutArchetype: 'runway-chic',
    layoutLabel: 'High-Fashion Runway & Sleek Minimal Pills',
    layoutDescription: 'Asymmetric metropolitan magazine layout, sleek pill buttons, shadow elevation floating cards aur VIP concierge.',
    layoutBadge: '✨ Runway Chic Masonry',
    primaryColor: '#1E1B4B', // Midnight Marine
    secondaryColor: '#7C3AED', // Lilac Violet
    accentColor: '#A855F7',
    bgGradient: 'from-indigo-50/60 via-purple-50/40 to-slate-50',
    headerGradient: 'from-black via-indigo-950 to-purple-950 text-purple-100 border-b border-purple-500/50',
    cardBorder: 'border-indigo-100 hover:border-purple-400 shadow-sm hover:shadow-purple-100 hover:shadow-lg',
    cardRadius: 'rounded-2xl',
    accentBadgeBg: 'bg-purple-100 text-purple-950 border border-purple-300',
    buttonGradient: 'bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 hover:opacity-95 text-white shadow-purple-200',
    animationType: 'cosmo-glide',
    animationLabel: '✨ Runway Magnetic Glide',
    animationClass: 'hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300',
    previewColorSwatches: ['#1E1B4B', '#7C3AED', '#581C87', '#EDE9FE'],
    features: ['Midnight Marine Skyline', 'Sunset Lilac Glow Accents', 'Ultra-Sleek Pill Buttons', 'Runway Fashion Precision'],
    isFree: true,
  },
];

export function getThemeById(themeId?: string, customThemes?: IndianTheme[]): IndianTheme {
  if (customThemes && customThemes.length > 0) {
    const customFound = customThemes.find((t) => t.id === themeId);
    if (customFound) return customFound;
  }
  if (!themeId) return (customThemes && customThemes[0]) || INDIAN_LAYOUT_THEMES[0];
  const found = INDIAN_LAYOUT_THEMES.find((t) => t.id === themeId);
  if (found) return found;

  // Backward-compatibility mapping with old template IDs
  if (themeId.includes('boutique') || themeId.includes('fashion')) {
    return INDIAN_LAYOUT_THEMES[2]; // Jaipur Haveli
  }
  if (themeId.includes('clean') || themeId.includes('services')) {
    return INDIAN_LAYOUT_THEMES[3]; // Ganga Serene
  }
  if (themeId.includes('food') || themeId.includes('sweets')) {
    return INDIAN_LAYOUT_THEMES[7]; // Utsav Vibrant
  }
  if (themeId.includes('electronics')) {
    return INDIAN_LAYOUT_THEMES[4]; // Deccan Neo
  }
  return INDIAN_LAYOUT_THEMES[0];
}

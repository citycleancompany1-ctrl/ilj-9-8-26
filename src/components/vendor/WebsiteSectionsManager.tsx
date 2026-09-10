import React, { useState, useMemo } from 'react';
import {
  Layout,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  HelpCircle,
  Layers,
  Star,
  Tag,
  Package,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Users,
  Award,
  Briefcase,
  FileText,
  DollarSign,
  Check,
  Globe,
  Play,
  Wrench,
  Video,
  Zap,
  Palette,
  X,
  GraduationCap,
  FolderTree,
  AlertCircle,
  Share2,
  Youtube
} from 'lucide-react';
import {
  Shop,
  ProductItem,
  ProductType,
  ShopSectionsConfig,
  HeroSectionConfig,
  AboutSectionConfig,
  FeaturesSectionConfig,
  ServicesSectionConfig,
  CoursesSectionConfig,
  ProductsSectionConfig,
  HowItWorksSectionConfig,
  BenefitsSectionConfig,
  TestimonialsSectionConfig,
  PricingSectionConfig,
  OffersSectionConfig,
  OfferBannerItem,
  VideoSectionConfig,
  GallerySectionConfig,
  PortfolioSectionConfig,
  TeamSectionConfig,
  FaqSectionConfig,
  CtaSectionConfig,
  ContactSectionConfig,
  SocialMediaSectionConfig,
  BlogSectionConfig,
  FooterSectionConfig,
  FloatingButtonsConfig,
  ShopCategory,
  VideoItem
} from '../../types';
import { getDefaultSectionsConfig } from '../../utils/sectionDefaults';
import { fileToBase64, getYouTubeEmbedUrl } from '../../utils/mediaUpload';
import { getAvailableCategoriesForShop, getCategoryImageByName } from '../../utils/categoryUtils';

interface WebsiteSectionsManagerProps {
  shop: Shop;
  onUpdateShop: (updated: Shop) => void;
  onPreviewShop?: () => void;
  onOpenThemes?: () => void;
  onOpenCategories?: () => void;
  onOpenCreateCategory?: () => void;
  showToast: (msg: string) => void;
  initialExpandedSection?: SectionKey | string;
  onAnyChange?: () => void;
}

type SectionKey = keyof ShopSectionsConfig;

export const WebsiteSectionsManager: React.FC<WebsiteSectionsManagerProps> = ({
  shop,
  onUpdateShop,
  onPreviewShop,
  onOpenThemes,
  onOpenCategories,
  onOpenCreateCategory,
  showToast,
  initialExpandedSection,
  onAnyChange,
}) => {
  // Initialize config with shop's config or fallback to defaults
  const [config, setConfig] = useState<ShopSectionsConfig>(() => {
    const defaults = getDefaultSectionsConfig(shop);
    return {
      ...defaults,
      ...(shop.sectionsConfig || {}),
    };
  });

  const [expandedSection, setExpandedSection] = useState<SectionKey | null>(
    (initialExpandedSection as SectionKey) || 'hero'
  );
  const [filterMode, setFilterMode] = useState<'ALL' | 'ACTIVE' | 'DISABLED'>('ALL');
  const [isSaving, setIsSaving] = useState(false);

  // Add / Edit Product / Service Modal in All Sections
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalType, setItemModalType] = useState<ProductType>('PRODUCT');

  // Form states for Product / Service Modal
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState<number | string>('');
  const [itemOriginalPrice, setItemOriginalPrice] = useState<number | string>('');
  const [itemUnit, setItemUnit] = useState('');
  const [itemCategory, setItemCategory] = useState('General');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImageUrl, setItemImageUrl] = useState('');
  const [itemInStock, setItemInStock] = useState(true);
  const [itemHidePrice, setItemHidePrice] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Category Selector & Quick Creator state for Item Modal
  const [showInlineCatCreator, setShowInlineCatCreator] = useState(false);
  const [customNewCatName, setCustomNewCatName] = useState('');

  const availableItemCategories = useMemo(() => {
    return getAvailableCategoriesForShop(
      shop.customCategories || [],
      shop.products || [],
      itemModalType
    );
  }, [shop.customCategories, shop.products, itemModalType]);

  const openAddItem = (type: ProductType) => {
    setItemModalType(type);
    setEditingItem(null);
    setItemName('');
    setItemPrice('');
    setItemOriginalPrice('');
    setItemUnit(type === 'COURSE' ? '30 Days' : type === 'PRODUCT' ? '1 pc' : 'Per Visit');
    const available = getAvailableCategoriesForShop(shop.customCategories || [], shop.products || [], type);
    setItemCategory(available.length > 0 ? available[0].name : '');
    setShowInlineCatCreator(false);
    setCustomNewCatName('');
    setItemDescription('');
    setItemImageUrl(
      type === 'COURSE'
        ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80'
        : type === 'PRODUCT'
        ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80'
    );
    setItemInStock(true);
    setItemHidePrice(false);
    setIsItemModalOpen(true);
  };

  const openEditItem = (item: ProductItem) => {
    setEditingItem(item);
    setItemModalType(item.type);
    setItemName(item.name);
    setItemPrice(item.price);
    setItemOriginalPrice(item.originalPrice || '');
    setItemUnit(item.unit || (item.type === 'COURSE' ? '30 Days' : item.type === 'PRODUCT' ? '1 pc' : 'Per Visit'));
    setItemCategory(item.category || '');
    setShowInlineCatCreator(false);
    setCustomNewCatName('');
    setItemDescription(item.description || '');
    setItemImageUrl(item.imageUrl || '');
    setItemInStock(item.inStock !== false);
    setItemHidePrice(item.hidePrice === true);
    setIsItemModalOpen(true);
  };

  const handleSaveItemModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || itemPrice === '') {
      showToast('Kripya item ka naam aur price bharein.');
      return;
    }

    const priceNum = Number(itemPrice) || 0;
    const origPriceNum = itemOriginalPrice ? Number(itemOriginalPrice) : undefined;

    let updatedProducts: ProductItem[] = [];

    if (editingItem) {
      updatedProducts = (shop.products || []).map((p) =>
        p.id === editingItem.id
          ? {
              ...p,
              name: itemName.trim(),
              type: itemModalType,
              price: priceNum,
              originalPrice: origPriceNum,
              unit: itemUnit.trim() || undefined,
              category: itemCategory.trim() || undefined,
              description: itemDescription.trim(),
              imageUrl: itemImageUrl.trim() || editingItem.imageUrl,
              inStock: itemInStock,
              hidePrice: itemHidePrice,
            }
          : p
      );
      showToast(`${itemModalType === 'COURSE' ? 'Course' : itemModalType === 'PRODUCT' ? 'Product' : 'Service'} successfully update ho gaya!`);
    } else {
      const newItem: ProductItem = {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: itemName.trim(),
        type: itemModalType,
        price: priceNum,
        originalPrice: origPriceNum,
        unit: itemUnit.trim() || (itemModalType === 'COURSE' ? '30 Days' : itemModalType === 'PRODUCT' ? '1 pc' : 'Per Visit'),
        category: itemCategory.trim() || (itemModalType === 'COURSE' ? 'Training & Course' : itemModalType === 'PRODUCT' ? 'General' : 'Service'),
        description: itemDescription.trim(),
        imageUrl: itemImageUrl.trim() || (
          itemModalType === 'COURSE'
            ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80'
            : itemModalType === 'PRODUCT'
            ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80'
        ),
        inStock: itemInStock,
        hidePrice: itemHidePrice,
      };
      updatedProducts = [...(shop.products || []), newItem];
      showToast(`Naya ${itemModalType === 'COURSE' ? 'Course' : itemModalType === 'PRODUCT' ? 'Product' : 'Service'} successfully add ho gaya!`);
    }

    // Ensure selected category is persisted in shop.customCategories
    let updatedCustomCats = shop.customCategories || [];
    const chosenCat = itemCategory.trim();
    if (chosenCat && !updatedCustomCats.some((c) => c.name.toLowerCase() === chosenCat.toLowerCase())) {
      updatedCustomCats = [
        ...updatedCustomCats,
        {
          id: `cat_${Date.now()}`,
          name: chosenCat,
          imageUrl: getCategoryImageByName(chosenCat, itemModalType),
          type: itemModalType,
        },
      ];
    }

    onUpdateShop({ ...shop, products: updatedProducts, customCategories: updatedCustomCats });
    if (onAnyChange) onAnyChange();
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string, name: string) => {
    if (!window.confirm(`Kya aap "${name}" ko sach mein delete karna chahte hain?`)) {
      return;
    }
    const updatedProducts = (shop.products || []).filter((p) => p.id !== itemId);
    onUpdateShop({
      ...shop,
      products: updatedProducts,
      customCategories: shop.customCategories || [],
    });
    if (onAnyChange) onAnyChange();
    showToast(`"${name}" delete ho gaya.`);
  };

  const handleToggleStock = (itemId: string) => {
    const updatedProducts = (shop.products || []).map((p) =>
      p.id === itemId ? { ...p, inStock: !p.inStock } : p
    );
    onUpdateShop({
      ...shop,
      products: updatedProducts,
      customCategories: shop.customCategories || [],
    });
    if (onAnyChange) onAnyChange();
  };

  const handleToggleHidePrice = (itemId: string) => {
    const updatedProducts = (shop.products || []).map((p) =>
      p.id === itemId ? { ...p, hidePrice: !p.hidePrice } : p
    );
    onUpdateShop({
      ...shop,
      products: updatedProducts,
      customCategories: shop.customCategories || [],
    });
    if (onAnyChange) onAnyChange();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingPhoto(true);
      const base64 = await fileToBase64(file);
      setItemImageUrl(base64);
      showToast('Photo uploaded successfully!');
    } catch {
      showToast('Photo upload fail ho gaya. Kripya doosri image try karein.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Sync if shop changes
  React.useEffect(() => {
    if (shop.sectionsConfig) {
      setConfig((prev) => ({
        ...prev,
        ...shop.sectionsConfig,
      }));
    }
  }, [shop.sectionsConfig]);

  // Sync initialExpandedSection when passed from sidebar
  React.useEffect(() => {
    if (initialExpandedSection) {
      let targetKey: SectionKey = initialExpandedSection as SectionKey;
      if (initialExpandedSection === 'hero_banner' || initialExpandedSection === 'hero') targetKey = 'hero';
      else if (initialExpandedSection === 'why_choose_us' || initialExpandedSection === 'features') targetKey = 'features';
      else if (initialExpandedSection === 'social_media' || initialExpandedSection === 'socialMedia') targetKey = 'socialMedia';
      else if (initialExpandedSection === 'video' || initialExpandedSection === 'videos') targetKey = 'videos';
      else if (initialExpandedSection === 'offer' || initialExpandedSection === 'offers') targetKey = 'offers';
      else if (initialExpandedSection === 'gallery' || initialExpandedSection === 'photo_gallery') targetKey = 'gallery';
      else if (initialExpandedSection === 'services' || initialExpandedSection === 'service') targetKey = 'services';
      else if (initialExpandedSection === 'products' || initialExpandedSection === 'product') targetKey = 'products';
      else if (initialExpandedSection === 'courses' || initialExpandedSection === 'course') targetKey = 'courses';

      setExpandedSection(targetKey);
      setTimeout(() => {
        const el = document.getElementById(`section-card-${targetKey}`) || document.getElementById(`section-card-${initialExpandedSection}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [initialExpandedSection]);

  // Master Save Handler
  const handleSaveConfig = (newConfig: ShopSectionsConfig, successMsg = 'Website sections save ho gaye!') => {
    setIsSaving(true);
    const updatedShop: Shop = {
      ...shop,
      sectionsConfig: newConfig,
      updatedAt: new Date().toISOString(),
    };
    onUpdateShop(updatedShop);
    if (onAnyChange) onAnyChange();
    setTimeout(() => {
      setIsSaving(false);
      showToast(successMsg);
    }, 400);
  };

  // Toggle Section ON / OFF
  const handleToggleSection = (key: SectionKey) => {
    const isCurrentlyEnabled = config[key]?.enabled !== false;
    const nextVal = !isCurrentlyEnabled;
    const updated: ShopSectionsConfig = {
      ...config,
      [key]: {
        ...(config[key] || {}),
        enabled: nextVal,
      },
    };
    setConfig(updated);
    if (onAnyChange) onAnyChange();
    handleSaveConfig(
      updated,
      `${SECTION_METAS.find((s) => s.key === key)?.title || 'Section'} ${nextVal ? 'ON (Live website par visible)' : 'OFF (Website se hide)'} ho gaya!`
    );
  };

  // Reset to smart defaults
  const handleResetAllToDefaults = () => {
    if (window.confirm('Kya aap sabhi sections ko smart recommended defaults par reset karna chahte hain?')) {
      const defaults = getDefaultSectionsConfig(shop);
      setConfig(defaults);
      if (onAnyChange) onAnyChange();
      handleSaveConfig(defaults, 'Sabhi 16 sections defaults par reset ho gaye!');
    }
  };

  // Count active sections within builder
  const activeCount = Object.values(config).filter((s) => (s as { enabled?: boolean })?.enabled !== false).length;

  // Metadata for the 17 Modular Website Sections (Strict parity with public store website)
  const SECTION_METAS: Array<{
    key: SectionKey;
    number: number;
    title: string;
    subtitle: string;
    icon: any;
    color: string;
  }> = [
    {
      key: 'hero',
      number: 1,
      title: 'Hero Section',
      subtitle: 'Main heading, short description, CTA button & badge',
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      key: 'about',
      number: 2,
      title: 'About Us',
      subtitle: 'Company / store / owner story & achievements',
      icon: Award,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      key: 'features',
      number: 3,
      title: 'Why Choose Us',
      subtitle: 'Key store highlights & why customers choose you',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      key: 'services',
      number: 4,
      title: 'Service',
      subtitle: 'Professional services, consultations & booking offerings',
      icon: Wrench,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      key: 'products',
      number: 5,
      title: 'Product',
      subtitle: 'Products showcase catalogue with prices & stock',
      icon: Tag,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      key: 'courses',
      number: 6,
      title: 'Course',
      subtitle: 'Structured courses, syllabus, fees & certification batches',
      icon: GraduationCap,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      key: 'videos',
      number: 7,
      title: 'Video',
      subtitle: 'Showcase store walkthroughs, product reels & YouTube demos',
      icon: Play,
      color: 'text-red-600 bg-red-50',
    },
    {
      key: 'offers',
      number: 8,
      title: 'Offer',
      subtitle: 'Promotional banners with coupon codes & direct WhatsApp deals',
      icon: Sparkles,
      color: 'text-pink-600 bg-pink-50',
    },
    {
      key: 'gallery',
      number: 9,
      title: 'Photo Gallery',
      subtitle: 'Store photos, showroom images & photo showcase',
      icon: ImageIcon,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      key: 'portfolio',
      number: 10,
      title: 'Portfolio',
      subtitle: 'Previous work, client projects & work showcase',
      icon: Briefcase,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      key: 'team',
      number: 11,
      title: 'Team',
      subtitle: 'Staff & specialists (Photo, name, role & bio)',
      icon: Users,
      color: 'text-fuchsia-600 bg-fuchsia-50',
    },
    {
      key: 'faq',
      number: 12,
      title: 'FAQ',
      subtitle: 'Frequently asked questions & customer answers',
      icon: HelpCircle,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      key: 'cta',
      number: 13,
      title: 'CTA',
      subtitle: 'Prominent banner encouraging customer order or booking',
      icon: Zap,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      key: 'contact',
      number: 14,
      title: 'Contact Us',
      subtitle: 'Phone, WhatsApp, email, address, working hours & inquiry form',
      icon: Phone,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      key: 'socialMedia',
      number: 15,
      title: 'Social Media',
      subtitle: 'Instagram, Facebook, YouTube, WhatsApp & social channel links',
      icon: Share2,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      key: 'blog',
      number: 16,
      title: 'Blog',
      subtitle: 'Latest store news, buying guides & expert articles',
      icon: FileText,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      key: 'footer',
      number: 17,
      title: 'Footer',
      subtitle: 'Copyright text, quick links, disclaimer & social profiles',
      icon: Globe,
      color: 'text-slate-600 bg-slate-100',
    },
  ];

  const totalCount = SECTION_METAS.length;

  const filteredMetas = SECTION_METAS.filter((meta) => {
    const isEnabled = config[meta.key]?.enabled !== false;
    if (filterMode === 'ACTIVE') return isEnabled;
    if (filterMode === 'DISABLED') return !isEnabled;
    return true;
  });

  return (
    <div className="space-y-6">
      
        

      {/* Modular Sections List */}
      <div className="space-y-4">
        {filteredMetas.map((meta) => {
          const isEnabled = config[meta.key]?.enabled !== false;
          const isExpanded = expandedSection === meta.key;
          const IconComp = meta.icon;

          return (
            <div
              key={meta.key}
              id={`section-card-${meta.key}`}
              className={`bg-white rounded-xl border transition-all duration-200 shadow-xs overflow-hidden ${
                isEnabled ? 'border-gray-200' : 'border-gray-200 bg-gray-50/50 opacity-90'
              }`}
            >
              {/* Card Header & Toggle */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                <div
                  onClick={() => setExpandedSection(isExpanded ? null : meta.key)}
                  className="flex items-start sm:items-center gap-3 cursor-pointer flex-1 select-none"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-orange-600 font-bold">#{meta.number}</span>
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                        {meta.title}
                      </h3>
                      {isEnabled ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSection(meta.key);
                          }}
                          className="inline-flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded transition-colors cursor-pointer"
                          title="Click to Turn Section OFF"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Live (ON)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSection(meta.key);
                          }}
                          className="inline-flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-black uppercase px-2 py-0.5 rounded transition-colors cursor-pointer"
                          title="Click to Turn Section ON"
                        >
                          <XCircle className="w-3 h-3" /> Hidden (OFF)
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{meta.subtitle}</p>
                  </div>
                </div>

                {/* Right Side: Toggle Switch & Expand Button */}
                <div 
                  className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* ON / OFF Switch */}
                  <div className="flex items-center gap-2 select-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleSection(meta.key);
                      }}
                      className={`text-[11px] font-black uppercase tracking-wider cursor-pointer px-1 py-0.5 rounded transition-colors ${
                        isEnabled ? 'text-emerald-700 hover:text-emerald-800' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {isEnabled ? 'ON' : 'OFF'}
                    </button>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isEnabled}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleSection(meta.key);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                      title={isEnabled ? 'Click to Turn Section OFF' : 'Click to Turn Section ON'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedSection(isExpanded ? null : meta.key)}
                    className="p-1.5 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                    title={isExpanded ? 'Collapse' : 'Edit Section Details'}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Edit Form */}
              {isExpanded && (
                <div className="p-5 sm:p-6 bg-[#FCFBF9] border-t border-gray-100 animate-in fade-in duration-150 space-y-5">
                  {renderSectionEditor(meta.key, config, setConfig, showToast, shop, {
                    onOpenAddItem: openAddItem,
                    onOpenEditItem: openEditItem,
                    onDeleteItem: handleDeleteItem,
                    onToggleStock: handleToggleStock,
                    onToggleHidePrice: handleToggleHidePrice,
                    onUpdateShop,
                  })}
                  
                  {/* Bottom Save Bar for this section */}
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      Section {meta.number}: {meta.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSaveConfig(config, `${meta.title} ke badlaav save ho gaye!`)}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Section</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT PRODUCT & SERVICE MODAL IN ALL SECTIONS */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  itemModalType === 'COURSE'
                    ? 'bg-indigo-100 text-indigo-600'
                    : itemModalType === 'PRODUCT'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {itemModalType === 'COURSE' ? (
                    <GraduationCap className="w-4 h-4" />
                  ) : itemModalType === 'PRODUCT' ? (
                    <Package className="w-4 h-4" />
                  ) : (
                    <Wrench className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-['Outfit',sans-serif]">
                    {editingItem
                      ? (itemModalType === 'COURSE' ? 'Edit Course Details' : itemModalType === 'PRODUCT' ? 'Edit Product Details' : 'Edit Service Details')
                      : (itemModalType === 'COURSE' ? 'Add New Training / Course' : itemModalType === 'PRODUCT' ? 'Add New Physical Product' : 'Add New Professional Service')}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {itemModalType === 'COURSE' ? 'Course syllabus, fees & batch details bharein' : itemModalType === 'PRODUCT' ? 'Product catalog details bharein' : 'Service & booking terms bharein'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsItemModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1.5 text-gray-400 hover:text-slate-800 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItemModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {itemModalType === 'COURSE' ? 'Course / Training Title *' : itemModalType === 'PRODUCT' ? 'Product / Item Name *' : 'Service Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    itemModalType === 'COURSE'
                      ? 'e.g. Masterclass in Web Design, Digital Marketing, Yoga Coaching'
                      : itemModalType === 'PRODUCT'
                      ? 'e.g. Pure Desi Cow Ghee (1 Litre Jar) ya Cotton Kurti'
                      : 'e.g. AC Deep Cleaning, Bridal Makeup, Legal Consultation'
                  }
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {itemModalType === 'COURSE' ? 'Course Fee (₹) *' : itemModalType === 'PRODUCT' ? 'Selling Price (₹) *' : 'Starting Fee (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 999"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {itemModalType === 'COURSE' ? 'Original Regular Fee (₹) (Optional)' : itemModalType === 'PRODUCT' ? 'Original MRP (₹) (Optional)' : 'Regular Fee (₹) (Optional)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1999 (Discount ke liye)"
                    value={itemOriginalPrice}
                    onChange={(e) => setItemOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {itemModalType === 'COURSE' ? 'Batch Duration / Validity' : itemModalType === 'PRODUCT' ? 'Pack Size / Unit' : 'Duration / Terms'}
                  </label>
                  <input
                    type="text"
                    placeholder={itemModalType === 'COURSE' ? 'e.g. 30 Days, 3 Months, 40 Hours' : itemModalType === 'PRODUCT' ? 'e.g. 1 pc, 1 kg, 500gm' : 'e.g. Per Visit, 1 Hour, Per Room'}
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <FolderTree className="w-3.5 h-3.5 text-orange-600" />
                      <span>Category (श्रेणी चुनें) *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowInlineCatCreator(!showInlineCatCreator)}
                      className="text-[11px] font-bold text-orange-600 hover:text-orange-800 underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{showInlineCatCreator ? 'Select from list' : '+ Nayi Category Banayein'}</span>
                    </button>
                  </div>

                  {!showInlineCatCreator ? (
                    <select
                      value={itemCategory}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setShowInlineCatCreator(true);
                        } else {
                          setItemCategory(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-white font-medium text-slate-900 cursor-pointer"
                    >
                      <option value="">-- Kripya Category Chunein (Select Category) --</option>
                      {availableItemCategories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name} {cat.isCustom ? '★ (Custom)' : ''}
                        </option>
                      ))}
                      <option value="__NEW__" className="font-bold text-orange-600 bg-orange-50">
                        + Nayi Category Banayein (Create New Category)...
                      </option>
                    </select>
                  ) : (
                    <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-lg space-y-2">
                      <div className="text-[10px] font-bold text-orange-950 uppercase tracking-wider">
                        Nayi Shreni Ka Naam Likh Kar Add Karein
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder={
                            itemModalType === 'COURSE'
                              ? 'e.g. AI & Machine Learning'
                              : itemModalType === 'PRODUCT'
                              ? 'e.g. Organic Dry Fruits'
                              : 'e.g. Solar Panel Cleaning'
                          }
                          value={customNewCatName}
                          onChange={(e) => setCustomNewCatName(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded border border-orange-300 text-xs bg-white font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!customNewCatName.trim()) return;
                            const name = customNewCatName.trim();
                            const newCat: ShopCategory = {
                              id: `cat_${Date.now()}`,
                              name,
                              imageUrl: getCategoryImageByName(name, itemModalType),
                              type: itemModalType,
                            };
                            const updatedShop = {
                              ...shop,
                              customCategories: [...(shop.customCategories || []), newCat],
                            };
                            onUpdateShop(updatedShop);
                            setItemCategory(name);
                            setCustomNewCatName('');
                            setShowInlineCatCreator(false);
                            showToast(`Nayi category "${name}" add ho gayi!`);
                          }}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-xs shrink-0 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Photo / Image URL
                </label>
                <div className="flex items-center gap-3">
                  {itemImageUrl && (
                    <img
                      src={itemImageUrl}
                      alt="Preview"
                      className="w-14 h-14 rounded-lg object-cover border border-gray-300 shrink-0 bg-gray-50"
                    />
                  )}
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={itemImageUrl}
                      onChange={(e) => setItemImageUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-md border border-gray-300 text-xs bg-gray-50/50"
                    />
                    <label className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-md text-[11px] font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-gray-600" />
                      <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Device Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={isUploadingPhoto}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Toggles: In Stock & Hide Price */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={itemInStock}
                    onChange={(e) => setItemInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900">
                      {itemModalType === 'COURSE' ? 'Seats Open / Enrolling' : itemModalType === 'PRODUCT' ? 'Available in Stock' : 'Booking Available'}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {itemInStock
                        ? (itemModalType === 'COURSE' ? 'Admissions live rahenge' : 'Website par live rahega')
                        : (itemModalType === 'COURSE' ? 'Batch Full / Closed' : 'Website par paused dikhega')}
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={itemHidePrice}
                    onChange={(e) => setItemHidePrice(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Hide Price</div>
                    <div className="text-[10px] text-gray-500">
                      {itemHidePrice ? 'Price on Request dikhega' : 'Original price show hoga'}
                    </div>
                  </div>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {itemModalType === 'COURSE' ? 'Course Curriculum & Highlights' : 'Description / Features (Short Summary)'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    itemModalType === 'COURSE'
                      ? 'e.g. Practical syllabus, weekly doubt-clearing sessions, live certificate, and study notes.'
                      : itemModalType === 'PRODUCT'
                      ? 'e.g. 100% pure chemical-free organic ingredients with 6 months shelf life.'
                      : 'e.g. Complete inspection, deep jet cleaning with eco-friendly chemicals.'
                  }
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsItemModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-lg font-bold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-lg font-black uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer ${
                    itemModalType === 'COURSE'
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : itemModalType === 'PRODUCT'
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {editingItem
                    ? (itemModalType === 'COURSE' ? 'Update Course' : itemModalType === 'PRODUCT' ? 'Update Product' : 'Update Service')
                    : (itemModalType === 'COURSE' ? '+ Add Course' : itemModalType === 'PRODUCT' ? '+ Add Product' : '+ Add Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Sub-component for Video Section with YouTube Link addition and live preview
const VideoSectionEditor: React.FC<{
  data: VideoSectionConfig;
  update: (patch: Partial<VideoSectionConfig>) => void;
  shop: Shop;
  onUpdateShop?: (updated: Shop) => void;
  showToast: (msg: string) => void;
}> = ({ data, update, shop, onUpdateShop, showToast }) => {
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');

  const currentVideos: VideoItem[] = shop.videos || [];
  const previewEmbedUrl = videoUrlInput.trim() ? getYouTubeEmbedUrl(videoUrlInput.trim()) : null;

  const handleAddYouTubeVideo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const url = videoUrlInput.trim();
    if (!url) {
      showToast('Kripya YouTube video ya Shorts ka link enter karein.');
      return;
    }
    const embedUrl = getYouTubeEmbedUrl(url);
    if (!embedUrl) {
      showToast('Valid YouTube Link nahi mila. Kripya valid YouTube ya Shorts URL dalein.');
      return;
    }
    if (currentVideos.length >= 10) {
      showToast('Maximum 10 YouTube videos allowed hain.');
      return;
    }

    const newVideo: VideoItem = {
      id: `vid_${Date.now()}`,
      title: videoTitleInput.trim() || 'Store Showcase Video',
      youtubeUrl: url,
    };

    const updatedVideos = [...currentVideos, newVideo];
    if (onUpdateShop) {
      onUpdateShop({
        ...shop,
        videos: updatedVideos,
      });
    }
    setVideoTitleInput('');
    setVideoUrlInput('');
    showToast('YouTube video successfully add ho gaya! ✅');
  };

  const handleDeleteYouTubeVideo = (id: string, title?: string) => {
    if (!window.confirm(`Kya aap "${title || 'is video'}" ko delete karna chahte hain?`)) {
      return;
    }
    const updatedVideos = currentVideos.filter((v) => v.id !== id);
    if (onUpdateShop) {
      onUpdateShop({
        ...shop,
        videos: updatedVideos,
      });
    }
    showToast('Video delete ho gaya.');
  };

  return (
    <div className="space-y-5">
      {/* Section Titles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Section Heading *
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white font-medium"
            placeholder="e.g. Store Videos & YouTube Reels"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Section Subtitle
          </label>
          <input
            type="text"
            value={data.subtitle}
            onChange={(e) => update({ subtitle: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
            placeholder="e.g. Watch our products in action, store tour & customer experiences"
          />
        </div>
      </div>

      {/* DEDICATED YOUTUBE LINK ADDITION CARD */}
      <div className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50/50 via-white to-orange-50/30 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20 shrink-0">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span>Add YouTube Video Link</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  Live Store Embed
                </span>
              </h4>
              <p className="text-[11px] text-gray-500">
                YouTube Video ya YouTube Shorts ka link yahan paste karein. Website par responsive player ke sath play hoga.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0 bg-white px-2.5 py-1 rounded-md border border-gray-200">
            {currentVideos.length}/10 Added
          </span>
        </div>

        <form onSubmit={handleAddYouTubeVideo} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Video Title Input */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Video Title (Optional)
              </label>
              <input
                type="text"
                value={videoTitleInput}
                onChange={(e) => setVideoTitleInput(e.target.value)}
                placeholder="e.g. Dukaan Tour, New Stock Unboxing, Demo"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium text-slate-800"
              />
            </div>

            {/* YouTube Link Input */}
            <div className="sm:col-span-7">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                <span>YouTube URL / Link *</span>
                <span className="text-[10px] text-red-600 font-semibold lowercase">
                  (watch link, youtu.be, shorts)
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-600">
                  <Youtube className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Instant Live URL Preview if valid */}
          {videoUrlInput.trim() && (
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              {previewEmbedUrl ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Valid YouTube Link detected - Instant Preview:
                    </span>
                    <span className="text-gray-400 font-mono text-[10px] truncate max-w-[250px]">
                      {videoUrlInput}
                    </span>
                  </div>
                  <div className="relative max-w-sm aspect-video bg-black rounded-lg overflow-hidden shadow-inner">
                    <iframe
                      src={previewEmbedUrl}
                      title="YouTube Video Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Kripya valid YouTube video link dalein (jaise: https://youtu.be/dQw4w9WgXcQ ya https://www.youtube.com/watch?v=...)</span>
                </div>
              )}
            </div>
          )}

          {/* Action row & formats guide */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500">
              <span className="font-semibold text-slate-600">Supported:</span>
              <span className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">youtube.com/watch?v=...</span>
              <span className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">youtu.be/...</span>
              <span className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">youtube.com/shorts/...</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={currentVideos.length >= 10 || !videoUrlInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Add YouTube Video</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ACTIVE STORE VIDEOS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span>Active Store Videos ({currentVideos.length})</span>
            {currentVideos.length > 0 && (
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Visible on Storefront
              </span>
            )}
          </h4>
        </div>

        {currentVideos.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/80 rounded-xl border border-dashed border-gray-300 space-y-2">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Youtube className="w-6 h-6" />
            </div>
            <h5 className="text-xs font-bold text-slate-800">
              Abhi tak koi YouTube video add nahi kiya gaya hai
            </h5>
            <p className="text-[11px] text-gray-500 max-w-md mx-auto">
              Apni dukaan, products ya customer review ka YouTube link upar dalein aur <strong>"Add YouTube Video"</strong> par click karein.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setVideoTitleInput('Demo Product Showcase & Store Tour');
                  setVideoUrlInput('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Try with Sample YouTube Link</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentVideos.map((vid, idx) => {
              const embedUrl = getYouTubeEmbedUrl(vid.youtubeUrl) || vid.youtubeUrl;
              return (
                <div
                  key={vid.id || idx}
                  className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-red-300 transition-all"
                >
                  {/* Video Player */}
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={embedUrl}
                      title={vid.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Video Info & Controls */}
                  <div className="p-3 bg-white space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-slate-900 truncate" title={vid.title}>
                          {vid.title || 'Store Video'}
                        </h5>
                        <a
                          href={vid.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-red-600 hover:underline font-mono truncate flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate">{vid.youtubeUrl}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteYouTubeVideo(vid.id, vid.title)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Delete Video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper to render specific editor based on section key
function renderSectionEditor(
  key: SectionKey,
  config: ShopSectionsConfig,
  setConfig: React.Dispatch<React.SetStateAction<ShopSectionsConfig>>,
  showToast: (msg: string) => void,
  shop: Shop,
  actions?: {
    onOpenAddItem: (type: ProductType) => void;
    onOpenEditItem: (item: ProductItem) => void;
    onDeleteItem: (itemId: string, name: string) => void;
    onToggleStock: (itemId: string) => void;
    onToggleHidePrice: (itemId: string) => void;
    onUpdateShop?: (updated: Shop) => void;
  }
) {
  switch (key) {
    // 1. HERO SECTION
    case 'hero': {
      const data = config.hero;
      const update = (patch: Partial<HeroSectionConfig>) => {
        setConfig((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }));
      };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Main Headline / Title *
              </label>
              <input
                type="text"
                value={data.heading}
                onChange={(e) => update({ heading: e.target.value })}
                placeholder="e.g. City Clean Company — Best Cleaning in Ludhiana"
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Short Description / Subtitle
              </label>
              <textarea
                rows={2}
                value={data.subheading}
                onChange={(e) => update({ subheading: e.target.value })}
                placeholder="Brief introduction for the hero banner..."
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Primary CTA Button Text *
              </label>
              <input
                type="text"
                value={data.ctaText}
                onChange={(e) => update({ ctaText: e.target.value })}
                placeholder="e.g. Explore Products & Order"
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Primary CTA Button Link
              </label>
              <input
                type="text"
                value={data.ctaLink}
                onChange={(e) => update({ ctaLink: e.target.value })}
                placeholder="#products, #contact-inquiry, or whatsapp"
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={data.secondaryCtaText || ''}
                onChange={(e) => update({ secondaryCtaText: e.target.value })}
                placeholder="e.g. WhatsApp Direct Chat"
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Top Badge Text
              </label>
              <input
                type="text"
                value={data.badge || ''}
                onChange={(e) => update({ badge: e.target.value })}
                placeholder="e.g. ★ Verified Local Merchant 🇮🇳"
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            {/* Desktop Hero Carousel Banners (Max 4) */}
            <div className="sm:col-span-2 pt-3 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Desktop Hero Slider Banners (Maximum 4 Banners)
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Desktop aur laptop screens ke liye horizontal wide banners (16:9 ya 21:9). Carousel slider mein auto-slide honge.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                  Desktop (Max 4)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((idx) => {
                  const bannerSrc = (shop.desktopBanners && shop.desktopBanners[idx]) || (idx === 0 ? (shop.banners?.[0] || data.backgroundImage) : '') || '';
                  return (
                    <div key={`desk-sec-banner-${idx}`} className="border border-gray-200 rounded-xl p-2.5 bg-gray-50/50 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">Banner #{idx + 1}</span>
                          {bannerSrc ? (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Uploaded
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              Empty
                            </span>
                          )}
                        </div>

                        <div className="aspect-16/9 rounded-lg bg-gray-200 overflow-hidden border border-gray-300 relative group flex items-center justify-center">
                          {bannerSrc ? (
                            <img src={bannerSrc} alt={`Desktop Banner ${idx + 1}`} className="w-full h-full object-contain bg-slate-900/5" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                              <ImageIcon className="w-5 h-5 mb-0.5 text-gray-300" />
                              <span className="text-[10px]">No Banner</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <label className="cursor-pointer flex-1 py-1.5 bg-white border border-gray-300 hover:bg-orange-50 text-slate-700 hover:text-orange-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors shadow-2xs">
                          <Upload className="w-3 h-3 text-orange-600 shrink-0" />
                          <span>{bannerSrc ? `Change` : `Upload`}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const base64 = await fileToBase64(file, 1600, 800);
                                const currentList = [...(shop.desktopBanners || shop.banners || [])];
                                while (currentList.length <= idx) currentList.push('');
                                currentList[idx] = base64;
                                const updated = {
                                  ...shop,
                                  desktopBanners: currentList,
                                  banners: currentList,
                                };
                                actions?.onUpdateShop?.(updated);
                                showToast(`Desktop Banner #${idx + 1} updated!`);
                              } catch (err) {
                                showToast('Image upload failed');
                              }
                            }}
                          />
                        </label>

                        {bannerSrc && (
                          <button
                            type="button"
                            onClick={() => {
                              const currentList = [...(shop.desktopBanners || shop.banners || [])];
                              if (idx < currentList.length) {
                                currentList[idx] = '';
                                while (currentList.length > 0 && !currentList[currentList.length - 1]) {
                                  currentList.pop();
                                }
                                const updated = {
                                  ...shop,
                                  desktopBanners: currentList,
                                  banners: currentList,
                                };
                                actions?.onUpdateShop?.(updated);
                                showToast(`Desktop Banner #${idx + 1} removed.`);
                              }
                            }}
                            className="p-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded transition-colors shadow-2xs cursor-pointer"
                            title={`Remove Banner #${idx + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Hero Carousel Banners (Max 3) */}
            <div className="sm:col-span-2 pt-3 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Mobile Hero Slider Banners (Maximum 3 Banners)
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Smartphones ke liye separate portrait banners (4:5 ya 9:16). Mobile par sirf ye show honge.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  Mobile (Max 3)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[0, 1, 2].map((idx) => {
                  const bannerSrc = shop.mobileBanners?.[idx] || '';
                  return (
                    <div key={`mob-sec-banner-${idx}`} className="border border-gray-200 rounded-xl p-2.5 bg-gray-50/50 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">Mobile Banner #{idx + 1}</span>
                          {bannerSrc ? (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Uploaded
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              Empty
                            </span>
                          )}
                        </div>

                        <div className="aspect-4/5 max-h-40 mx-auto rounded-lg bg-gray-200 overflow-hidden border border-gray-300 relative group flex items-center justify-center">
                          {bannerSrc ? (
                            <img src={bannerSrc} alt={`Mobile Banner ${idx + 1}`} className="w-full h-full object-contain bg-slate-900/5" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                              <ImageIcon className="w-5 h-5 mb-0.5 text-gray-300" />
                              <span className="text-[10px]">No Banner</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <label className="cursor-pointer flex-1 py-1.5 bg-white border border-gray-300 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors shadow-2xs">
                          <Upload className="w-3 h-3 text-purple-600 shrink-0" />
                          <span>{bannerSrc ? `Change` : `Upload`}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const base64 = await fileToBase64(file, 900, 1200);
                                const currentList = [...(shop.mobileBanners || [])];
                                while (currentList.length <= idx) currentList.push('');
                                currentList[idx] = base64;
                                const updated = {
                                  ...shop,
                                  mobileBanners: currentList,
                                };
                                actions?.onUpdateShop?.(updated);
                                showToast(`Mobile Banner #${idx + 1} updated!`);
                              } catch (err) {
                                showToast('Image upload failed');
                              }
                            }}
                          />
                        </label>

                        {bannerSrc && (
                          <button
                            type="button"
                            onClick={() => {
                              const currentList = [...(shop.mobileBanners || [])];
                              if (idx < currentList.length) {
                                currentList[idx] = '';
                                while (currentList.length > 0 && !currentList[currentList.length - 1]) {
                                  currentList.pop();
                                }
                                const updated = {
                                  ...shop,
                                  mobileBanners: currentList,
                                };
                                actions?.onUpdateShop?.(updated);
                                showToast(`Mobile Banner #${idx + 1} removed.`);
                              }
                            }}
                            className="p-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded transition-colors shadow-2xs cursor-pointer"
                            title={`Remove Mobile Banner #${idx + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. ABOUT SECTION
    case 'about': {
      const data = config.about;
      const update = (patch: Partial<AboutSectionConfig>) => {
        setConfig((prev) => ({ ...prev, about: { ...prev.about, ...patch } }));
      };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Title *
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Company / Person / Product Story & Description *
              </label>
              <textarea
                rows={4}
                value={data.description}
                onChange={(e) => update({ description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Story Heading
              </label>
              <input
                type="text"
                value={data.storyHeading || ''}
                onChange={(e) => update({ storyHeading: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Experience Badge
              </label>
              <input
                type="text"
                value={data.yearsOfExperience || ''}
                onChange={(e) => update({ yearsOfExperience: e.target.value })}
                placeholder="e.g. 10+ Years Experience"
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                About Photo
              </label>
              <div className="flex items-center gap-3">
                {data.imageUrl && (
                  <img
                    src={data.imageUrl}
                    alt="About"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                  />
                )}
                <label className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-orange-600" />
                  <span>Upload About / Founder Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const base64 = await fileToBase64(file, 800, 800);
                          update({ imageUrl: base64 });
                          showToast('About photo updated!');
                        } catch (err) {
                          showToast('Upload failed');
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. FEATURES SECTION
    case 'features': {
      const data = config.features;
      const update = (patch: Partial<FeaturesSectionConfig>) => {
        setConfig((prev) => ({ ...prev, features: { ...prev.features, ...patch } }));
      };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Features Heading
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Features Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Key Features List ({data.items.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const newItem = {
                    id: `feat_${Date.now()}`,
                    title: 'New Key Feature',
                    description: 'Description of this feature and customer advantage.',
                    icon: 'CheckCircle2',
                  };
                  update({ items: [...data.items, newItem] });
                }}
                className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 text-[11px] font-bold uppercase rounded flex items-center gap-1 border border-orange-200"
              >
                <Plus className="w-3 h-3" />
                <span>Add Feature</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.items.map((item, idx) => (
                <div key={item.id || idx} className="p-3 bg-white rounded-lg border border-gray-200 space-y-2 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-orange-600 font-bold">Feature #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        update({ items: data.items.filter((_, i) => i !== idx) });
                      }}
                      className="text-gray-400 hover:text-red-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...data.items];
                      newItems[idx].title = e.target.value;
                      update({ items: newItems });
                    }}
                    placeholder="Feature Title"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 font-bold text-slate-900"
                  />
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...data.items];
                      newItems[idx].description = e.target.value;
                      update({ items: newItems });
                    }}
                    placeholder="Feature Description"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 text-gray-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 4. PRODUCTS SECTION
    case 'products': {
      const data = config.products;
      const update = (patch: Partial<ProductsSectionConfig>) => {
        setConfig((prev) => ({ ...prev, products: { ...prev.products, ...patch } }));
      };
      const productsList = (shop.products || []).filter((p) => p.type !== 'SERVICE');

      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Products Section Title *
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                placeholder="e.g. Featured Products Catalogue"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Products Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                placeholder="e.g. Quality handpicked products at best market rates"
              />
            </div>
          </div>

          {/* Action Header Banner with Add Product Button */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-orange-950 flex items-center gap-1.5 text-xs">
                <Tag className="w-4 h-4 text-orange-600" />
                <span>Physical Products Catalogue ({productsList.length} items listed)</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Aap yahan se directly naye products add, edit aur delete kar sakte hain. Website par live update hoga.
              </p>
            </div>
            {actions && (
              <button
                type="button"
                onClick={() => actions.onOpenAddItem('PRODUCT')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Product</span>
              </button>
            )}
          </div>

          {/* Products List with Add, Edit, Delete, Stock & Price Visibility */}
          {productsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {productsList.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 rounded-xl border border-gray-200 bg-white hover:border-orange-300 transition-all shadow-2xs flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'}
                      alt={prod.name}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          prod.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {prod.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {prod.unit && (
                          <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                            {prod.unit}
                          </span>
                        )}
                        {prod.hidePrice && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5 text-amber-600" />
                            <span>Price Hidden</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-1">{prod.name}</h4>
                      {prod.description && (
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{prod.description}</p>
                      )}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-black text-orange-600">₹{prod.price}</span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="text-[11px] line-through text-gray-400">₹{prod.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Card Actions */}
                  {actions && (
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => actions.onToggleHidePrice(prod.id)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border flex items-center gap-1 cursor-pointer transition-colors ${
                            prod.hidePrice
                              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                          title={prod.hidePrice ? 'Click to show price' : 'Click to hide price (Price on Request)'}
                        >
                          {prod.hidePrice ? <EyeOff className="w-3 h-3 text-amber-700" /> : <Eye className="w-3 h-3 text-gray-500" />}
                          <span>{prod.hidePrice ? 'Show Price' : 'Hide Price'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => actions.onToggleStock(prod.id)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border cursor-pointer transition-colors ${
                            prod.inStock
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {prod.inStock ? 'Pause' : 'Activate'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => actions.onOpenEditItem(prod)}
                          className="p-1.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded border border-gray-200 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-slate-600 hover:text-emerald-700" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => actions.onDeleteItem(prod.id, prod.name)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded border border-gray-200 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl border border-dashed border-gray-300 bg-white space-y-2">
              <Package className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Abhi koi product add nahi hai</div>
              <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                Apne store ke physical products (kapde, kirana, jewellery, items) add karein taaki customers website se order kar sakein.
              </p>
              {actions && (
                <button
                  type="button"
                  onClick={() => actions.onOpenAddItem('PRODUCT')}
                  className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Your First Product</span>
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    // 5. SERVICES SECTION
    case 'services': {
      const data = config.services || {
        enabled: true,
        title: 'Professional Services & Bookings',
        subtitle: 'Expert doorstep services provided by verified specialists',
      };
      const update = (patch: Partial<ServicesSectionConfig>) => {
        setConfig((prev) => ({
          ...prev,
          services: { ...(prev.services || data), ...patch },
        }));
      };
      const servicesList = (shop.products || []).filter((p) => p.type === 'SERVICE');

      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Services Section Heading *
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                placeholder="e.g. Our Professional Services"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Services Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                placeholder="e.g. On-time doorstep service with verified technicians"
              />
            </div>
          </div>

          {/* Action Header Banner with Add Service Button */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-purple-950 flex items-center gap-1.5 text-xs">
                <Wrench className="w-4 h-4 text-purple-600" />
                <span>Professional Services & Bookings ({servicesList.length} services active)</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Yahan se naye service packages add karein, unke rates, duration aur booking availability edit/delete karein.
              </p>
            </div>
            {actions && (
              <button
                type="button"
                onClick={() => actions.onOpenAddItem('SERVICE')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Service</span>
              </button>
            )}
          </div>

          {/* Services List with Add, Edit, Delete, Active & Price Visibility */}
          {servicesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {servicesList.map((svc) => (
                <div
                  key={svc.id}
                  className="p-3 rounded-xl border border-gray-200 bg-white hover:border-purple-300 transition-all shadow-2xs flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={svc.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'}
                      alt={svc.name}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          svc.inStock ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {svc.inStock ? 'Booking Open' : 'Paused'}
                        </span>
                        {svc.unit && (
                          <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                            {svc.unit}
                          </span>
                        )}
                        {svc.hidePrice && (
                          <span className="text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5 text-purple-600" />
                            <span>Price on Request</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-1">{svc.name}</h4>
                      {svc.description && (
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{svc.description}</p>
                      )}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-black text-purple-700">₹{svc.price}</span>
                        {svc.originalPrice && svc.originalPrice > svc.price && (
                          <span className="text-[11px] line-through text-gray-400">₹{svc.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Service Card Actions */}
                  {actions && (
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => actions.onToggleHidePrice(svc.id)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border flex items-center gap-1 cursor-pointer transition-colors ${
                            svc.hidePrice
                              ? 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                          title={svc.hidePrice ? 'Click to show fee' : 'Click to hide fee (Price on Request)'}
                        >
                          {svc.hidePrice ? <EyeOff className="w-3 h-3 text-purple-700" /> : <Eye className="w-3 h-3 text-gray-500" />}
                          <span>{svc.hidePrice ? 'Show Fee' : 'Hide Fee'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => actions.onToggleStock(svc.id)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border cursor-pointer transition-colors ${
                            svc.inStock
                              ? 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {svc.inStock ? 'Pause' : 'Activate'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => actions.onOpenEditItem(svc)}
                          className="p-1.5 text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded border border-gray-200 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-slate-600 hover:text-purple-700" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => actions.onDeleteItem(svc.id, svc.name)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded border border-gray-200 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl border border-dashed border-gray-300 bg-white space-y-2">
              <Wrench className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Abhi koi service listed nahi hai</div>
              <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                Doorstep cleaning, salon, consultation, repair ya tailor services add karein taaki customers direct WhatsApp booking kar sakein.
              </p>
              {actions && (
                <button
                  type="button"
                  onClick={() => actions.onOpenAddItem('SERVICE')}
                  className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Your First Service</span>
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    // 6. COURSES & TRAINING
    case 'courses': {
      const data: CoursesSectionConfig = config.courses || {
        enabled: true,
        title: 'Our Featured Courses & Training',
        subtitle: 'Skill-up karein hamare structured courses aur practical batches ke sath',
        badge: 'Certified Courses & Training 🎓',
      };
      const update = (patch: Partial<CoursesSectionConfig>) => {
        setConfig({ ...config, courses: { ...data, ...patch } });
      };
      const courses = (shop.products || []).filter((p) => p.type === 'COURSE');

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Section Heading / Title
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Badge / Tagline
              </label>
              <input
                type="text"
                value={data.badge || ''}
                onChange={(e) => update({ badge: e.target.value })}
                placeholder="e.g. Certified Courses & Training 🎓"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Subtitle / Supporting Text
            </label>
            <input
              type="text"
              value={data.subtitle || ''}
              onChange={(e) => update({ subtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Courses List & Action Header */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Courses Catalogue ({courses.length})
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                {courses.filter((c) => c.inStock !== false).length} Enrolling Active
              </span>
            </div>
            {actions && (
              <button
                type="button"
                onClick={() => actions.onOpenAddItem('COURSE')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Course</span>
              </button>
            )}
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {courses.map((crs) => (
                <div
                  key={crs.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={crs.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'}
                        alt={crs.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500';
                        }}
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs ${
                            crs.inStock !== false
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {crs.inStock !== false ? 'Seats Open' : 'Batch Full'}
                        </span>
                        {crs.unit && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
                            {crs.unit}
                          </span>
                        )}
                      </div>
                      {crs.hidePrice && (
                        <div className="absolute top-2 right-2">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-sm bg-amber-500 text-white shadow-xs">
                            Fees on Request
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {crs.category || 'Training'}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500">
                          ID: {crs.id.slice(-4)}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{crs.name}</h4>
                      {crs.description && (
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{crs.description}</p>
                      )}

                      <div className="mt-2.5 flex items-baseline gap-2">
                        {crs.hidePrice ? (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            Fees on Request
                          </span>
                        ) : (
                          <>
                            <span className="text-sm font-black text-slate-900 font-['Outfit',sans-serif]">
                              ₹{crs.price}
                            </span>
                            {crs.originalPrice && crs.originalPrice > crs.price && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{crs.originalPrice}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {actions && (
                    <div className="p-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => actions.onToggleStock(crs.id)}
                          className={`p-1.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            crs.inStock !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title="Toggle Seats Open / Batch Full"
                        >
                          {crs.inStock !== false ? 'Seats Open' : 'Closed'}
                        </button>
                        <button
                          type="button"
                          onClick={() => actions.onToggleHidePrice(crs.id)}
                          className={`p-1.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            crs.hidePrice
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          title="Show / Hide Fee"
                        >
                          {crs.hidePrice ? 'Fee Hidden' : 'Show Fee'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => actions.onOpenEditItem(crs)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-gray-200 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Edit Course"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-slate-600 hover:text-indigo-700" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => actions.onDeleteItem(crs.id, crs.name)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded border border-gray-200 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl border border-dashed border-gray-300 bg-white space-y-2">
              <GraduationCap className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Abhi koi course listed nahi hai</div>
              <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                Skill training, coaching batches, vocational classes ya computer courses add karein taaki students direct WhatsApp se syllabus aur batch timings jaan sakein.
              </p>
              {actions && (
                <button
                  type="button"
                  onClick={() => actions.onOpenAddItem('COURSE')}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Your First Course</span>
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    // 9. STORE VIDEOS & REELS
    case 'videos': {
      const data = config.videos || {
        enabled: true,
        title: 'Store Videos & YouTube Reels',
        subtitle: 'Watch our products in action, store tour & customer experiences',
      };
      const update = (patch: Partial<VideoSectionConfig>) => {
        setConfig((prev) => ({
          ...prev,
          videos: { ...(prev.videos || data), ...patch },
        }));
      };

      return (
        <VideoSectionEditor
          data={data}
          update={update}
          shop={shop}
          onUpdateShop={actions?.onUpdateShop}
          showToast={showToast}
        />
      );
    }

    // 9. PHOTO GALLERY
    case 'gallery': {
      const data: GallerySectionConfig = config.gallery || {
        enabled: true,
        title: 'Store Photo Gallery',
        subtitle: 'Hamari dukaan, taaza stock aur shandar collection ka photo showcase',
        items: [],
      };
      const update = (patch: Partial<GallerySectionConfig>) => {
        setConfig((prev) => ({
          ...prev,
          gallery: { ...(prev.gallery || data), ...patch },
        }));
      };

      const galleryPhotos = (data.items && data.items.length > 0)
        ? data.items
        : (shop.galleryImages && shop.galleryImages.length > 0 ? shop.galleryImages : [
            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
            'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800',
            'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
            'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800',
          ]);

      const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const currentList = data.items && data.items.length > 0 ? data.items : galleryPhotos;
        if (currentList.length >= 15) {
          showToast('Gallery mein maximum 15 photos allowed hain.');
          return;
        }
        try {
          const base64 = await fileToBase64(file);
          const updatedPhotos = [...currentList, base64].slice(0, 15);
          update({ items: updatedPhotos });
          showToast('New photo added to gallery!');
        } catch {
          showToast('Photo upload failed. Kripya doosri image try karein.');
        }
      };

      const handleRemoveGalleryImage = (idx: number) => {
        const currentList = data.items && data.items.length > 0 ? data.items : galleryPhotos;
        const updatedPhotos = currentList.filter((_, i) => i !== idx);
        update({ items: updatedPhotos });
        showToast('Photo gallery se remove ho gayi.');
      };

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Gallery Heading *
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white font-medium"
                placeholder="e.g. Store Photo Gallery"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Gallery Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                placeholder="e.g. Hamari dukaan aur taaza stock ka photo showcase"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Gallery Photos Showcase ({galleryPhotos.length})
              </span>
              <label className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold uppercase rounded flex items-center gap-1.5 border border-teal-200 cursor-pointer transition-colors shadow-2xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAddGalleryImage}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {galleryPhotos.map((photoUrl, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 shadow-2xs"
                >
                  <img
                    src={photoUrl}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Photo #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 9. OUR OFFERS & DEALS (1 or 2 Promotional Banners)
    case 'offers': {
      const data = config.offers || {
        enabled: true,
        title: 'Special Offers & Deals',
        subtitle: 'Exclusive discounts aur festival offers sirf hamare direct grahakon ke liye',
        banners: [],
      };
      const update = (patch: Partial<OffersSectionConfig>) => {
        setConfig((prev) => ({
          ...prev,
          offers: {
            ...(prev.offers || {
              enabled: true,
              title: 'Special Offers & Deals',
              subtitle: 'Exclusive discounts aur festival offers sirf hamare direct grahakon ke liye',
              banners: [],
            }),
            ...patch,
          },
        }));
      };

      const handleBannerUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          const base64 = await fileToBase64(file);
          const newBanners = [...data.banners];
          newBanners[idx].imageUrl = base64;
          update({ banners: newBanners });
          showToast('Banner image upload ho gayi!');
        } catch (err) {
          showToast('Image upload failed. Kripya doosri image try karein.');
        }
      };

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Offers Section Heading
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  Promotional Banners ({data.banners.length}/2 Banners)
                </span>
                <span className="text-[11px] text-gray-500">
                  Vendor yahan 1 ya 2 promotional banners upload kar sakte hain.
                </span>
              </div>

              {data.banners.length < 2 && (
                <button
                  type="button"
                  onClick={() => {
                    const newBanner: OfferBannerItem = {
                      id: `offer_${Date.now()}`,
                      imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200',
                      title: 'Special Discount Deal - Flat 20% OFF',
                      subtitle: 'Order now on WhatsApp to claim instant festival discount!',
                      badge: 'SPECIAL DEAL',
                      couponCode: 'OFFER20',
                      validUntil: 'Limited Period',
                      buttonText: 'Claim Offer on WhatsApp',
                    };
                    update({ banners: [...data.banners, newBanner] });
                  }}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold uppercase rounded flex items-center gap-1 border border-rose-200 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Banner ({data.banners.length + 1}/2)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.banners.map((banner, idx) => (
                <div key={banner.id || idx} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <span className="font-mono text-[10px] text-rose-700 font-bold uppercase tracking-wider">
                      Banner #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        update({ banners: data.banners.filter((_, i) => i !== idx) });
                      }}
                      className="text-gray-400 hover:text-red-600 p-0.5"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Banner Image Preview & Upload */}
                  <div className="space-y-2">
                    <div className="relative aspect-16/7 bg-slate-100 rounded-lg overflow-hidden border border-gray-200">
                      {banner.imageUrl ? (
                        <img
                          src={banner.imageUrl}
                          alt={banner.title || 'Banner'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1 text-xs">
                          <ImageIcon className="w-6 h-6 text-gray-300" />
                          <span>No Banner Image</span>
                        </div>
                      )}
                      {banner.badge && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                          {banner.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-1.5 px-2 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-bold text-slate-700 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-rose-600" />
                        <span>Upload Banner Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleBannerUpload(idx, e)}
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      value={banner.imageUrl}
                      onChange={(e) => {
                        const newBanners = [...data.banners];
                        newBanners[idx].imageUrl = e.target.value;
                        update({ banners: newBanners });
                      }}
                      placeholder="Or paste banner image URL (https://...)"
                      className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-gray-600"
                    />
                  </div>

                  {/* Banner Text Fields */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">Banner Title *</label>
                      <input
                        type="text"
                        value={banner.title}
                        onChange={(e) => {
                          const newBanners = [...data.banners];
                          newBanners[idx].title = e.target.value;
                          update({ banners: newBanners });
                        }}
                        placeholder="e.g. Festival Special - Flat 20% OFF"
                        className="w-full px-2 py-1 text-xs rounded border border-gray-200 font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">Subtitle / Description</label>
                      <input
                        type="text"
                        value={banner.subtitle || ''}
                        onChange={(e) => {
                          const newBanners = [...data.banners];
                          newBanners[idx].subtitle = e.target.value;
                          update({ banners: newBanners });
                        }}
                        placeholder="e.g. Orders above ₹499 get free doorstep dispatch"
                        className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-gray-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500">Badge Tag</label>
                        <input
                          type="text"
                          value={banner.badge || ''}
                          onChange={(e) => {
                            const newBanners = [...data.banners];
                            newBanners[idx].badge = e.target.value;
                            update({ banners: newBanners });
                          }}
                          placeholder="e.g. FESTIVAL SPECIAL"
                          className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-red-600 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500">Coupon Code</label>
                        <input
                          type="text"
                          value={banner.couponCode || ''}
                          onChange={(e) => {
                            const newBanners = [...data.banners];
                            newBanners[idx].couponCode = e.target.value;
                            update({ banners: newBanners });
                          }}
                          placeholder="e.g. WELCOME20"
                          className="w-full px-2 py-1 text-xs rounded border border-gray-200 font-mono font-bold text-orange-800 uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500">Valid Until</label>
                        <input
                          type="text"
                          value={banner.validUntil || ''}
                          onChange={(e) => {
                            const newBanners = [...data.banners];
                            newBanners[idx].validUntil = e.target.value;
                            update({ banners: newBanners });
                          }}
                          placeholder="e.g. Limited Period"
                          className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500">CTA Button Text</label>
                        <input
                          type="text"
                          value={banner.buttonText || ''}
                          onChange={(e) => {
                            const newBanners = [...data.banners];
                            newBanners[idx].buttonText = e.target.value;
                            update({ banners: newBanners });
                          }}
                          placeholder="Claim Offer on WhatsApp"
                          className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 10. PORTFOLIO / PROJECTS (Previous Work Image Gallery)
    case 'portfolio': {
      const data = config.portfolio;
      const update = (patch: Partial<PortfolioSectionConfig>) => {
        setConfig((prev) => ({ ...prev, portfolio: { ...prev.portfolio, ...patch } }));
      };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Gallery Title
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Work & Gallery Images ({data.items.length})
              </span>
              <label className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer">
                <Upload className="w-3 h-3" />
                <span>Upload New Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const base64 = await fileToBase64(file, 800, 800);
                        const newItem = {
                          id: `port_${Date.now()}`,
                          title: file.name.replace(/\.[^/.]+$/, ''),
                          category: 'Work Showcase',
                          imageUrl: base64,
                          description: 'Recent customer order / work showcase.',
                        };
                        update({ items: [...data.items, newItem] });
                        showToast('New photo added to gallery!');
                      } catch (err) {
                        showToast('Upload failed');
                      }
                    }
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.items.map((item, idx) => (
                <div key={item.id || idx} className="p-2.5 bg-white rounded-lg border border-gray-200 space-y-2">
                  <div className="relative aspect-4/3 rounded overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        update({ items: data.items.filter((_, i) => i !== idx) });
                      }}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded shadow-sm hover:bg-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...data.items];
                      newItems[idx].title = e.target.value;
                      update({ items: newItems });
                    }}
                    placeholder="Photo Title"
                    className="w-full px-2 py-1 text-xs rounded border border-gray-200 font-bold"
                  />
                  <input
                    type="text"
                    value={item.category || ''}
                    onChange={(e) => {
                      const newItems = [...data.items];
                      newItems[idx].category = e.target.value;
                      update({ items: newItems });
                    }}
                    placeholder="Category / Tag"
                    className="w-full px-2 py-1 text-[11px] rounded border border-gray-200 text-gray-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 11. TEAM SECTION (Image + Position + Name)
    case 'team': {
      const data = config.team;
      const update = (patch: Partial<TeamSectionConfig>) => {
        setConfig((prev) => ({ ...prev, team: { ...prev.team, ...patch } }));
      };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Team Heading
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Team Members (Image + Position + Name) ({data.members.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const newMember = {
                    id: `team_${Date.now()}`,
                    name: 'Team Member Name',
                    position: 'Role / Designation',
                    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
                    bio: 'Dedicated store support team member.',
                  };
                  update({ members: [...data.members, newMember] });
                }}
                className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 text-[11px] font-bold uppercase rounded flex items-center gap-1 border border-orange-200"
              >
                <Plus className="w-3 h-3" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.members.map((member, idx) => (
                <div key={member.id || idx} className="p-3 bg-white rounded-lg border border-gray-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-fuchsia-700 font-bold">Member #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        update({ members: data.members.filter((_, i) => i !== idx) });
                      }}
                      className="text-gray-400 hover:text-red-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-12 h-12 object-cover rounded-full border border-gray-300 shrink-0"
                    />
                    <label className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-slate-800 text-[10px] font-bold rounded cursor-pointer">
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const base64 = await fileToBase64(file, 400, 400);
                              const newMembers = [...data.members];
                              newMembers[idx].imageUrl = base64;
                              update({ members: newMembers });
                              showToast('Member photo updated!');
                            } catch (err) {
                              showToast('Upload failed');
                            }
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Name *</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const newMembers = [...data.members];
                        newMembers[idx].name = e.target.value;
                        update({ members: newMembers });
                      }}
                      placeholder="e.g. Sunil Kumar"
                      className="w-full px-2 py-1 text-xs rounded border border-gray-200 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Position / Role *</label>
                    <input
                      type="text"
                      value={member.position}
                      onChange={(e) => {
                        const newMembers = [...data.members];
                        newMembers[idx].position = e.target.value;
                        update({ members: newMembers });
                      }}
                      placeholder="e.g. Founder / Manager"
                      className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-orange-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Short Bio</label>
                    <textarea
                      rows={2}
                      value={member.bio || ''}
                      onChange={(e) => {
                        const newMembers = [...data.members];
                        newMembers[idx].bio = e.target.value;
                        update({ members: newMembers });
                      }}
                      placeholder="Short bio..."
                      className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-gray-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 12. FAQ SECTION
    case 'faq': {
      const data = config.faq;
      const update = (patch: Partial<FaqSectionConfig>) => {
        setConfig((prev) => ({ ...prev, faq: { ...prev.faq, ...patch } }));
      };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                FAQ Heading
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Questions & Answers ({data.items.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const newItem = {
                    id: `faq_${Date.now()}`,
                    question: 'New Common Question?',
                    answer: 'Helpful and clear answer for the customer.',
                  };
                  update({ items: [...data.items, newItem] });
                }}
                className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 text-[11px] font-bold uppercase rounded flex items-center gap-1 border border-orange-200"
              >
                <Plus className="w-3 h-3" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-2">
              {data.items.map((item, idx) => (
                <div key={item.id || idx} className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-sky-700 font-bold">Q&A #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        update({ items: data.items.filter((_, i) => i !== idx) });
                      }}
                      className="text-gray-400 hover:text-red-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...data.items];
                      newItems[idx].question = e.target.value;
                      update({ items: newItems });
                    }}
                    placeholder="Customer Question?"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 font-bold text-slate-900"
                  />
                  <textarea
                    rows={2}
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...data.items];
                      newItems[idx].answer = e.target.value;
                      update({ items: newItems });
                    }}
                    placeholder="Clear and detailed answer..."
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 text-gray-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 13. CTA SECTION (Encouraging User Action)
    case 'cta': {
      const data = config.cta;
      const update = (patch: Partial<CtaSectionConfig>) => {
        setConfig((prev) => ({ ...prev, cta: { ...prev.cta, ...patch } }));
      };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                CTA Headline (Action Title) *
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Description / Offer Text
              </label>
              <textarea
                rows={2}
                value={data.description}
                onChange={(e) => update({ description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={data.buttonText}
                onChange={(e) => update({ buttonText: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Badge / Tag
              </label>
              <input
                type="text"
                value={data.badge || ''}
                onChange={(e) => update({ badge: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
          </div>
        </div>
      );
    }

    // 14. CONTACT SECTION
    case 'contact': {
      const data = config.contact;
      const update = (patch: Partial<ContactSectionConfig>) => {
        setConfig((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }));
      };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contact Heading
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={data.phone || ''}
                onChange={(e) => update({ phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="text"
                value={data.email || ''}
                onChange={(e) => update({ email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                value={data.address || ''}
                onChange={(e) => update({ address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Store Working Hours
              </label>
              <input
                type="text"
                value={data.workingHours || ''}
                onChange={(e) => update({ workingHours: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="showFormCheckbox"
                checked={data.showForm}
                onChange={(e) => update({ showForm: e.target.checked })}
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
              <label htmlFor="showFormCheckbox" className="text-xs font-bold text-slate-800">
                Show Customer Online Inquiry Form
              </label>
            </div>
          </div>
        </div>
      );
    }

    // 14. BLOG / ARTICLES SECTION
    case 'blog': {
      const data = config.blog;
      const update = (patch: Partial<BlogSectionConfig>) => {
        setConfig((prev) => ({ ...prev, blog: { ...prev.blog, ...patch } }));
      };

      const handleBlogImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          const base64 = await fileToBase64(file);
          const newPosts = [...data.posts];
          newPosts[idx].imageUrl = base64;
          update({ posts: newPosts });
          showToast('Article image upload ho gayi!');
        } catch (err) {
          showToast('Image upload failed. Kripya doosri image try karein.');
        }
      };

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Blog Heading
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Articles & Posts ({data.posts.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const newPost = {
                    id: `post_${Date.now()}`,
                    title: 'New Helpful Guide or Store News',
                    snippet: 'Short summary of the article for visitors to read...',
                    content: 'Write the complete in-depth article, helpful tips, or announcement here for your customers.',
                    category: 'Store Guide',
                    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    readTime: '3 min read',
                    author: shop.businessName || 'Store Team',
                    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
                  };
                  update({ posts: [...data.posts, newPost] });
                }}
                className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 text-[11px] font-bold uppercase rounded flex items-center gap-1 border border-orange-200 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.posts.map((post, idx) => (
                <div key={post.id || idx} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <span className="font-mono text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                      Article #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        update({ posts: data.posts.filter((_, i) => i !== idx) });
                      }}
                      className="text-gray-400 hover:text-red-600 p-0.5 cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Image Upload & Preview */}
                  <div className="space-y-2">
                    <div className="relative aspect-16/9 bg-slate-100 rounded-lg overflow-hidden border border-gray-200">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1 text-xs">
                          <ImageIcon className="w-6 h-6 text-gray-300" />
                          <span>No Article Image</span>
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-1.5 px-2 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-bold text-slate-700 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleBlogImageUpload(idx, e)}
                        />
                      </label>
                      {post.imageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const newPosts = [...data.posts];
                            newPosts[idx].imageUrl = '';
                            update({ posts: newPosts });
                          }}
                          className="text-[10px] text-red-600 hover:underline px-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={post.imageUrl || ''}
                      onChange={(e) => {
                        const newPosts = [...data.posts];
                        newPosts[idx].imageUrl = e.target.value;
                        update({ posts: newPosts });
                      }}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-gray-600 bg-white"
                    />
                  </div>

                  {/* Title & Category */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Article Title *</label>
                    <input
                      type="text"
                      value={post.title}
                      onChange={(e) => {
                        const newPosts = [...data.posts];
                        newPosts[idx].title = e.target.value;
                        update({ posts: newPosts });
                      }}
                      placeholder="e.g. 5 Easy Steps to Pick the Best Fresh Produce"
                      className="w-full px-2 py-1 text-xs rounded border border-gray-200 font-bold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">Category</label>
                      <input
                        type="text"
                        value={post.category || ''}
                        onChange={(e) => {
                          const newPosts = [...data.posts];
                          newPosts[idx].category = e.target.value;
                          update({ posts: newPosts });
                        }}
                        placeholder="e.g. Tips"
                        className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">Date</label>
                      <input
                        type="text"
                        value={post.date}
                        onChange={(e) => {
                          const newPosts = [...data.posts];
                          newPosts[idx].date = e.target.value;
                          update({ posts: newPosts });
                        }}
                        placeholder="Date"
                        className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500">Read Time</label>
                      <input
                        type="text"
                        value={post.readTime || ''}
                        onChange={(e) => {
                          const newPosts = [...data.posts];
                          newPosts[idx].readTime = e.target.value;
                          update({ posts: newPosts });
                        }}
                        placeholder="3 min"
                        className="w-full px-2 py-1 text-xs rounded border border-gray-200 text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Summary / Snippet (Short Card Preview) *</label>
                    <textarea
                      rows={2}
                      value={post.snippet}
                      onChange={(e) => {
                        const newPosts = [...data.posts];
                        newPosts[idx].snippet = e.target.value;
                        update({ posts: newPosts });
                      }}
                      placeholder="Short summary of the article..."
                      className="w-full px-2 py-1.5 text-xs rounded border border-gray-200 text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">Full Article Content (Shown when clicking "Read") *</label>
                    <textarea
                      rows={4}
                      value={post.content || ''}
                      onChange={(e) => {
                        const newPosts = [...data.posts];
                        newPosts[idx].content = e.target.value;
                        update({ posts: newPosts });
                      }}
                      placeholder="Write the full in-depth article content, guidance, steps, or advice for your store visitors..."
                      className="w-full px-2 py-1.5 text-xs rounded border border-gray-200 text-gray-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 15. SOCIAL MEDIA SECTION
    case 'socialMedia': {
      const data: SocialMediaSectionConfig = config.socialMedia || {
        enabled: true,
        title: 'Connect With Us On Social Media',
        subtitle: 'Follow our official channels for latest updates, new launches & deals',
        instagram: shop.socialLinks?.instagram || '',
        facebook: shop.socialLinks?.facebook || '',
        youtube: shop.socialLinks?.youtube || '',
        whatsapp: shop.whatsapp || shop.phone || '',
        twitter: '',
        linkedin: '',
        telegram: '',
      };
      const update = (patch: Partial<SocialMediaSectionConfig>) => {
        setConfig((prev) => ({
          ...prev,
          socialMedia: { ...(prev.socialMedia || data), ...patch },
        }));
      };

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Heading *
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white font-medium"
                placeholder="e.g. Follow Us On Social Media"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                placeholder="e.g. Latest updates aur offers paane ke liye follow karein"
              />
            </div>
          </div>

          <div className="pt-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Social Profiles & Channels
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  value={data.instagram || ''}
                  onChange={(e) => update({ instagram: e.target.value })}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Facebook Page URL
                </label>
                <input
                  type="text"
                  value={data.facebook || ''}
                  onChange={(e) => update({ facebook: e.target.value })}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="text"
                  value={data.youtube || ''}
                  onChange={(e) => update({ youtube: e.target.value })}
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  value={data.whatsapp || ''}
                  onChange={(e) => update({ whatsapp: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Twitter / X Profile URL
                </label>
                <input
                  type="text"
                  value={data.twitter || ''}
                  onChange={(e) => update({ twitter: e.target.value })}
                  placeholder="https://x.com/yourhandle"
                  className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  LinkedIn Profile / Company URL
                </label>
                <input
                  type="text"
                  value={data.linkedin || ''}
                  onChange={(e) => update({ linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 17. FOOTER SECTION
    case 'footer': {
      const data = config.footer;
      const update = (patch: Partial<FooterSectionConfig>) => {
        setConfig((prev) => ({ ...prev, footer: { ...prev.footer, ...patch } }));
      };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Footer About Store Text
              </label>
              <textarea
                rows={2}
                value={data.aboutText}
                onChange={(e) => update({ aboutText: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={data.socialLinks.instagram || ''}
                onChange={(e) =>
                  update({ socialLinks: { ...data.socialLinks, instagram: e.target.value } })
                }
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={data.socialLinks.facebook || ''}
                onChange={(e) =>
                  update({ socialLinks: { ...data.socialLinks, facebook: e.target.value } })
                }
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                YouTube Channel URL
              </label>
              <input
                type="text"
                value={data.socialLinks.youtube || ''}
                onChange={(e) =>
                  update({ socialLinks: { ...data.socialLinks, youtube: e.target.value } })
                }
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={data.copyrightText}
                onChange={(e) => update({ copyrightText: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-sm border border-gray-300 bg-white"
              />
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

// Simple internal icon for CTA
function ZapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

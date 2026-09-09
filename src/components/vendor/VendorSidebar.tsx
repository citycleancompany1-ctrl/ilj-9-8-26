import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  User,
  Store,
  Package,
  FolderTree,
  Wrench,
  Image as ImageIcon,
  Layers,
  QrCode,
  CreditCard,
  FileText,
  Receipt,
  MessageSquare,
  BarChart3,
  Star,
  Headphones,
  HelpCircle,
  Settings,
  LogOut,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Palette,
  Globe,
  Database,
  PhoneCall,
  MessageCircle,
  Mail,
  ToggleLeft,
  HardDrive,
  Zap,
  Tag,
  Video,
  Users,
  Phone,
  Award,
  CheckCircle2,
  Printer,
  GraduationCap
} from 'lucide-react';
import { Shop } from '../../types';

export interface VendorSidebarProps {
  shop: Shop;
  activeNav: string;
  onSelectNav: (navKey: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onVisitStore: () => void;
  unreadInquiriesCount?: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  subItems?: { id: string; label: string; icon?: React.ElementType }[];
}

interface MenuGroup {
  groupTitle: string;
  items: MenuItem[];
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({
  shop,
  activeNav,
  onSelectNav,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  onVisitStore,
  unreadInquiriesCount = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'sections': true,
    'website_all_sections': true,
    'addons': true,
    'billing': false,
    'support': false,
    'settings': false,
  });

  const toggleExpand = (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const isCatalog = Boolean(
    (shop as any).websiteMode === 'CATALOG' || shop.isCatalogOnly || shop.hideAllPrices
  );
  const productsCount = (shop.products || []).filter((p) => p.type !== 'SERVICE' && p.type !== 'COURSE').length;
  const servicesCount = (shop.products || []).filter((p) => p.type === 'SERVICE').length;
  const coursesCount = (shop.products || []).filter((p) => p.type === 'COURSE').length;

  const menuGroups: MenuGroup[] = useMemo(
    () => [
      {
        groupTitle: 'VENDOR DASHBOARD',
        items: [
          {
            id: 'dashboard',
            label: 'Store Dashboard',
            icon: LayoutDashboard,
          },
          {
            id: 'categories',
            label: 'Categories (Shreni)',
            icon: FolderTree,
            badge: `${shop.customCategories?.length || 0}`,
            badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
          },
          {
            id: 'profile',
            label: 'My Profile & Shop',
            icon: Store,
            badge: 'Live',
            badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          },
        ],
      },
      {
        groupTitle: 'WEBSITE ALL SECTIONS',
        items: [
          {
            id: 'sections',
            label: 'All Sections (18)',
            icon: Layers,
            badge: '18 Live',
            badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
            subItems: [
              { id: 'section_categories', label: `Categories (${shop.customCategories?.length || 0})`, icon: FolderTree },
              { id: 'section_hero', label: 'Hero Section', icon: Sparkles },
              { id: 'section_about', label: 'About Section', icon: Award },
              { id: 'section_features', label: 'Features', icon: CheckCircle2 },
              { id: 'section_products', label: `Products (${productsCount})`, icon: Tag },
              { id: 'section_services', label: `Services (${servicesCount})`, icon: Wrench },
              { id: 'section_courses', label: `Courses (${coursesCount})`, icon: GraduationCap },
              { id: 'section_benefits', label: 'Benefits', icon: Star },
              { id: 'section_testimonials', label: 'Testimonials', icon: MessageSquare },
              { id: 'section_offers', label: 'Our Offers & Deals', icon: Sparkles },
              { id: 'section_videos', label: 'Store Videos', icon: Video },
              { id: 'section_portfolio', label: 'Portfolio & Projects', icon: ImageIcon },
              { id: 'section_team', label: 'Team Members', icon: Users },
              { id: 'section_faq', label: 'FAQ Section', icon: HelpCircle },
              { id: 'section_cta', label: 'Call to Action (CTA)', icon: Zap },
              { id: 'section_contact', label: 'Contact Details', icon: Phone },
              { id: 'section_blog', label: 'Blog & Articles', icon: FileText },
              { id: 'section_footer', label: 'Footer Section', icon: Globe },
            ],
          },
          {
            id: 'categories',
            label: '+ Create Category',
            icon: FolderTree,
            badge: `${shop.customCategories?.length || 0}`,
            badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          },
        ],
      },
      {
        groupTitle: 'ADDONS',
        items: [
          {
            id: 'addon_call',
            label: 'Call',
            icon: PhoneCall,
          },
          {
            id: 'addon_whatsapp',
            label: 'WhatsApp',
            icon: MessageCircle,
            badge: 'Active',
            badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          },
          {
            id: 'addon_email',
            label: 'Email',
            icon: Mail,
          },
          {
            id: 'addon_payment_qr',
            label: 'Payment QR',
            icon: QrCode,
          },
          {
            id: 'addon_custom_domain',
            label: 'Custom Domain',
            icon: Globe,
            badge: 'DNS',
            badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
          },
          {
            id: 'addon_shop_standee',
            label: 'Shop Standee',
            icon: Printer,
            badge: 'A4 Print',
            badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          },
          {
            id: 'addon_website_switch',
            label: 'Website Switch',
            icon: ToggleLeft,
            badge: isCatalog ? 'Catalogue' : 'E-Commerce',
            badgeColor: isCatalog
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          },
        ],
      },
      {
        groupTitle: 'PLAN & BILLING',
        items: [
          {
            id: 'billing_plan',
            label: 'My Plan',
            icon: CreditCard,
            badge: '1-Year',
            badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
          },
          {
            id: 'billing_invoice',
            label: 'Invoice',
            icon: FileText,
          },
          {
            id: 'billing_renew',
            label: 'Renew',
            icon: Zap,
          },
        ],
      },
      {
        groupTitle: 'SUPPORT',
        items: [
          {
            id: 'support_help',
            label: 'Help Center',
            icon: HelpCircle,
          },
          {
            id: 'support_care',
            label: 'Customer Care',
            icon: Headphones,
            badge: '24/7 Helpline',
            badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          },
        ],
      },
      {
        groupTitle: 'SETTINGS',
        items: [
          {
            id: 'settings_backup',
            label: 'Store Backup',
            icon: Database,
          },
          {
            id: 'settings_storage',
            label: 'Storage',
            icon: HardDrive,
            badge: '200 MB',
            badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          },
          {
            id: 'logout',
            label: 'Logout',
            icon: LogOut,
          },
        ],
      },
    ],
    [shop.products, isCatalog, productsCount, servicesCount, coursesCount]
  );

  // Filter menu items by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return menuGroups;
    const q = searchQuery.toLowerCase();
    return menuGroups
      .map((group) => {
        const matchingItems = group.items
          .map((item) => {
            const matchesItem = item.label.toLowerCase().includes(q);
            const matchingSubs = item.subItems?.filter((sub) =>
              sub.label.toLowerCase().includes(q)
            );
            if (matchesItem || (matchingSubs && matchingSubs.length > 0)) {
              return {
                ...item,
                subItems: matchingSubs || item.subItems,
              };
            }
            return null;
          })
          .filter(Boolean) as MenuItem[];
        return {
          ...group,
          items: matchingItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [menuGroups, searchQuery]);

  const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
      onLogout();
      return;
    }
    if (itemId === 'store') {
      onVisitStore();
      return;
    }
    onSelectNav(itemId);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  // Vendor Initials Badge (e.g. SA or IL)
  const vendorInitials = useMemo(() => {
    const name = shop.vendorName || shop.businessName || 'Vendor';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [shop.vendorName, shop.businessName]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111827] text-slate-200 border-r border-slate-800 select-none">
      {/* 1. Header: Branding & Vendor Avatar Badge */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white uppercase font-['Outfit',sans-serif]">
                  INDIANLALAJI<span className="text-orange-500">.COM</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Digital Store Platform
              </p>
            </div>
          </div>

          {/* Avatar circle / initials pill */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 text-white font-black text-xs flex items-center justify-center shadow-md shrink-0 ring-2 ring-slate-700"
              title={`${shop.vendorName} (${shop.businessName})`}
            >
              {vendorInitials}
            </div>

            {/* Mobile Close Button */}
            {isOpenMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Store Name & ID Sub-bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs">
          <div className="min-w-0">
            <p className="font-bold text-slate-200 truncate text-[12px]">
              {shop.businessName}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              ID: {shop.shopId}
            </p>
          </div>
          <button
            type="button"
            onClick={onVisitStore}
            className="px-2 py-1 rounded bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shrink-0"
            title="Open live storefront"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Visit</span>
          </button>
        </div>

        {/* Dedicated Single-Vendor Secure Portal Indicator */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-1.5 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
            <span className="font-semibold text-slate-300 truncate">Dedicated Vendor Portal</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-900/50 shrink-0 font-bold">
            Private
          </span>
        </div>
      </div>

      {/* 2. Search Menu Input */}
      <div className="p-3.5 border-b border-slate-800/80 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Menu (e.g. FAQ, WhatsApp, Storage)..."
            className="w-full bg-[#1F2937] text-slate-200 placeholder-slate-400 text-xs rounded-xl pl-3.5 pr-9 py-2.5 border border-slate-700/80 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Scrollable Navigation Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-dark-scrollbar">
        {filteredGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            {/* Section Heading */}
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400/90 font-['Outfit',sans-serif]">
              {group.groupTitle}
            </div>

            {/* Menu List */}
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const isActive =
                  activeNav === item.id ||
                  (item.subItems && item.subItems.some((sub) => activeNav === sub.id));
                const isExpanded = Boolean(expandedMenus[item.id]) || Boolean(searchQuery);

                return (
                  <div key={item.id} className="space-y-0.5">
                    <button
                      type="button"
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-black shadow-md shadow-orange-600/30 ring-1 ring-orange-400/60'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isActive && (
                          <span className="w-1.5 h-3.5 rounded-full bg-white mr-0.5 shrink-0 animate-pulse" />
                        )}
                        <IconComponent
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-white drop-shadow-xs'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              isActive
                                ? 'bg-white text-orange-700 font-black shadow-xs'
                                : item.badgeColor || 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {item.subItems && (
                          <span
                            onClick={(e) => toggleExpand(item.id, e)}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Sub-items list */}
                    {item.subItems && isExpanded && (
                      <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-slate-800 ml-3">
                        {item.subItems.map((sub) => {
                          const isSubActive = activeNav === sub.id;
                          const SubIcon = sub.icon;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleItemClick(sub.id)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                                isSubActive
                                  ? 'bg-orange-500/25 text-orange-300 font-bold border-l-2 border-orange-500 pl-2'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {SubIcon && <SubIcon className="w-3 h-3 text-slate-500 shrink-0" />}
                                <span className="truncate">{sub.label}</span>
                              </div>
                              <span className="text-slate-500 text-[10px]">›</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Vendor Storage 200 MB Widget (Requested: Vendor Storage: 200 MB only) */}
      <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs shrink-0">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <HardDrive className="w-3.5 h-3.5 text-orange-400" />
            <span>Storage: 200 MB only</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400">14.2 MB (7.1%)</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full rounded-full" style={{ width: '7.1%' }} />
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>185.8 MB Available</span>
          <button
            type="button"
            onClick={() => onSelectNav('settings_storage')}
            className="text-orange-400 hover:underline font-bold"
          >
            Manage
          </button>
        </div>
      </div>

      {/* 5. Footer status bar */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0B0F19] text-[10px] text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-300">Store Live & SSL Secured</span>
        </div>
        <span className="font-mono text-slate-500">v3.0</span>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR: Fixed/Sticky left sidebar (250–280px wide) */}
      <aside className="hidden lg:block w-[270px] shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* MOBILE DRAWER: Slide-in with dark backdrop overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Dark transparent overlay with blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="relative w-[82%] max-w-[280px] h-full shadow-2xl z-50 transform transition-transform duration-300 ease-out animate-in slide-in-from-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

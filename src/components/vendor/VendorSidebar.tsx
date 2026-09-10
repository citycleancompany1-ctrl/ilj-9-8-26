import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Store,
  FolderTree,
  Wrench,
  Image as ImageIcon,
  QrCode,
  CreditCard,
  FileText,
  Receipt,
  MessageSquare,
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
  GraduationCap,
  ShieldCheck
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

export interface SubMenuItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  emoji?: string;
  badge?: string | number;
  badgeColor?: string;
  subItems?: SubMenuItem[];
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
    menu_profile: true,
    menu_sections: true,
    menu_addons: false,
    menu_billing: false,
    menu_support: false,
    menu_settings: false,
  });

  const toggleExpand = (menuId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Structured menu items exactly as specified by user
  const menuItems: SidebarMenuItem[] = useMemo(
    () => [
      {
        id: 'dashboard',
        label: 'DASHBOARD',
        icon: LayoutDashboard,
      },
      {
        id: 'menu_profile',
        label: 'My Profile',
        emoji: '👤',
        icon: User,
        subItems: [
          { id: 'profile_business', label: 'Business Profile', icon: Store },
          { id: 'profile_validity', label: '1-Year Store Validity & Annual Subscription', icon: ShieldCheck },
          { id: 'profile_visibility', label: 'Website Visibility', icon: Globe },
          {
            id: 'profile_inquiries',
            label: 'Form Submission Entries',
            icon: MessageSquare,
            badge: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} New` : undefined,
            badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold',
          },
        ],
      },
      {
        id: 'menu_sections',
        label: 'All Sections',
        emoji: '📄',
        icon: FileText,
        badge: '18 Live',
        badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
        subItems: [
          { id: 'section_hero_banner', label: 'Hero Banner', icon: ImageIcon },
          { id: 'section_hero', label: 'Hero Section', icon: Sparkles },
          { id: 'section_about', label: 'About Us', icon: Award },
          { id: 'section_why_choose_us', label: 'Why Choose Us', icon: CheckCircle2 },
          { id: 'section_categories', label: 'Category', icon: FolderTree },
          { id: 'section_services', label: 'Service', icon: Wrench },
          { id: 'section_products', label: 'Product', icon: Tag },
          { id: 'section_courses', label: 'Course', icon: GraduationCap },
          { id: 'section_videos', label: 'Video', icon: Video },
          { id: 'section_offers', label: 'Offer', icon: Sparkles },
          { id: 'section_gallery', label: 'Photo Gallery', icon: ImageIcon },
          { id: 'section_portfolio', label: 'Portfolio', icon: ImageIcon },
          { id: 'section_team', label: 'Team', icon: Users },
          { id: 'section_faq', label: 'FAQ', icon: HelpCircle },
          { id: 'section_cta', label: 'CTA', icon: Zap },
          { id: 'section_contact', label: 'Contact Us', icon: Phone },
          { id: 'section_social_media', label: 'Social Media', icon: MessageCircle },
          { id: 'section_blog', label: 'Blog', icon: FileText },
          { id: 'section_footer', label: 'Footer', icon: Globe },
        ],
      },
      {
        id: 'menu_addons',
        label: 'Addons',
        emoji: '➕',
        icon: Zap,
        subItems: [
          { id: 'addon_call', label: 'Call', icon: PhoneCall },
          { id: 'addon_whatsapp', label: 'WhatsApp', icon: MessageCircle },
          { id: 'addon_email', label: 'Email', icon: Mail },
          { id: 'addon_payment_qr', label: 'Payment QR', icon: QrCode },
          { id: 'addon_custom_domain', label: 'Custom Domain Req..', icon: Globe },
          { id: 'addon_shop_standee', label: 'Shop QR Standee', icon: Printer },
          { id: 'addon_website_switch', label: 'Website Switch', icon: ToggleLeft },
        ],
      },
      {
        id: 'menu_billing',
        label: 'Plan & Billing',
        emoji: '💳',
        icon: CreditCard,
        subItems: [
          { id: 'billing_plan', label: 'My Plan', icon: CreditCard },
          { id: 'billing_invoice', label: 'Invoice', icon: Receipt },
          { id: 'billing_renew', label: 'Renew', icon: Zap },
        ],
      },
      {
        id: 'menu_support',
        label: 'Support',
        emoji: '🎧',
        icon: Headphones,
        subItems: [
          { id: 'support_help', label: 'Help Center', icon: HelpCircle },
          { id: 'support_care', label: 'Customer Care', icon: Headphones },
        ],
      },
      {
        id: 'menu_settings',
        label: 'Settings',
        emoji: '⚙',
        icon: Settings,
        subItems: [
          { id: 'settings_backup', label: 'Store Backup', icon: Database },
          { id: 'settings_storage', label: 'Storage', icon: HardDrive },
          { id: 'settings_account', label: 'Account Settings', icon: Settings },
        ],
      },
      {
        id: 'logout',
        label: 'Logout',
        emoji: '🚪',
        icon: LogOut,
      },
    ],
    [unreadInquiriesCount]
  );

  // Auto-expand menu containing current activeNav
  useEffect(() => {
    for (const item of menuItems) {
      if (item.subItems && item.subItems.some((sub) => sub.id === activeNav)) {
        setExpandedMenus((prev) => ({
          ...prev,
          [item.id]: true,
        }));
      }
    }
  }, [activeNav, menuItems]);

  // Filter menu items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;
    const q = searchQuery.toLowerCase();
    return menuItems
      .map((item) => {
        const matchesMain = item.label.toLowerCase().includes(q);
        const matchingSubs = item.subItems?.filter((sub) =>
          sub.label.toLowerCase().includes(q)
        );
        if (matchesMain || (matchingSubs && matchingSubs.length > 0)) {
          return {
            ...item,
            subItems: matchingSubs && matchingSubs.length > 0 ? matchingSubs : item.subItems,
          };
        }
        return null;
      })
      .filter(Boolean) as SidebarMenuItem[];
  }, [menuItems, searchQuery]);

  const handleItemClick = (itemId: string, hasSubItems = false) => {
    if (itemId === 'logout') {
      onLogout();
      return;
    }
    if (hasSubItems) {
      toggleExpand(itemId);
      return;
    }
    onSelectNav(itemId);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  const handleSubItemClick = (subId: string) => {
    onSelectNav(subId);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  // Vendor Initials Badge
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
              title={`${shop.vendorName || ''} (${shop.businessName})`}
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
            <span className="font-semibold text-slate-300 truncate">Store Live</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-900/50 shrink-0 font-bold">
            1-Year Active
          </span>
        </div>
      </div>

      {/* 2. Search Menu Input */}
      <div className="p-3 border-b border-slate-800/80 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Menu (Sections, Addons, Profile)..."
            className="w-full bg-[#1F2937] text-slate-200 placeholder-slate-400 text-xs rounded-xl pl-3 pr-9 py-2 border border-slate-700/80 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-3.5 h-3.5" />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Navigation Hierarchy List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-dark-scrollbar">
        {filteredItems.map((item) => {
          const IconComponent = item.icon;
          const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
          const isItemActive = activeNav === item.id;
          const isParentOfActive = Boolean(
            hasSubItems && item.subItems?.some((sub) => activeNav === sub.id)
          );
          const isExpanded = Boolean(expandedMenus[item.id]) || Boolean(searchQuery);

          return (
            <div key={item.id} className="space-y-0.5">
              {/* Top-Level Menu Row */}
              <button
                type="button"
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleItemClick(item.id, hasSubItems)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all group cursor-pointer ${
                  isItemActive
                    ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-400/60'
                    : isParentOfActive
                    ? 'bg-slate-800/90 text-orange-400 ring-1 ring-orange-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.emoji && <span className="text-sm shrink-0">{item.emoji}</span>}
                  <IconComponent
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isItemActive
                        ? 'text-white drop-shadow-xs'
                        : isParentOfActive
                        ? 'text-orange-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        isItemActive
                          ? 'bg-white text-orange-700 font-black shadow-xs'
                          : item.badgeColor || 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Dropdown Arrow (Requested: (i want dropdown arrow)) */}
                  {hasSubItems && (
                    <span
                      onClick={(e) => toggleExpand(item.id, e)}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isItemActive || isParentOfActive
                          ? 'text-white hover:bg-white/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                      title={isExpanded ? 'Collapse Menu' : 'Expand Menu'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
                      )}
                    </span>
                  )}
                </div>
              </button>

              {/* Sub-Items Tree List with Hierarchy Connectors ├─ and └─ */}
              {hasSubItems && isExpanded && (
                <div className="pl-3 pr-1 py-1 space-y-0.5 border-l-2 border-slate-800 ml-4 animate-in fade-in duration-150">
                  {item.subItems!.map((sub, index, arr) => {
                    const isSubActive = activeNav === sub.id;
                    const SubIcon = sub.icon;
                    const isLast = index === arr.length - 1;

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        id={`sidebar-nav-${sub.id}`}
                        onClick={() => handleSubItemClick(sub.id)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all group cursor-pointer ${
                          isSubActive
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold shadow-xs'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {/* Tree branch connector indicator */}
                          <span className="font-mono text-slate-500 text-[10px] select-none shrink-0 group-hover:text-slate-400">
                            {isLast ? '└─' : '├─'}
                          </span>
                          {SubIcon && (
                            <SubIcon
                              className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                isSubActive
                                  ? 'text-white'
                                  : 'text-slate-500 group-hover:text-slate-300'
                              }`}
                            />
                          )}
                          <span className="truncate">{sub.label}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {sub.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                                isSubActive
                                  ? 'bg-white/20 text-white'
                                  : sub.badgeColor || 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {sub.badge}
                            </span>
                          )}
                          {!isSubActive && (
                            <span className="text-slate-600 text-[10px] group-hover:text-slate-400">
                              ›
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Vendor Storage 200 MB Widget */}
      <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs shrink-0">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <HardDrive className="w-3.5 h-3.5 text-orange-400" />
            <span>Storage: 200 MB</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400">14.2 MB (7.1%)</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full rounded-full" style={{ width: '7.1%' }} />
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>185.8 MB Free</span>
          <button
            type="button"
            onClick={() => onSelectNav('settings_storage')}
            className="text-orange-400 hover:underline font-bold cursor-pointer"
          >
            Manage
          </button>
        </div>
      </div>

      {/* 5. Footer status bar */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0B0F19] text-[10px] text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-300">Store Live & Secured</span>
        </div>
        <span className="font-mono text-slate-500">v3.0</span>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR: Fixed/Sticky left sidebar (260px wide) */}
      <aside className="hidden lg:block w-[260px] shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* MOBILE DRAWER: Slide-in with dark backdrop overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-[85%] max-w-[280px] h-full shadow-2xl z-50 transform transition-transform duration-300 ease-out animate-in slide-in-from-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

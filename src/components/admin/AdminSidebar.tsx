import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Store,
  Globe,
  Download,
  Receipt,
  Sliders,
  Megaphone,
  Tag,
  Video,
  Users,
  Settings,
  Plus,
  Power,
  LogOut,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Sparkles,
  Database,
  ExternalLink,
  HelpCircle,
  FolderTree
} from 'lucide-react';
import { PlatformState } from '../../types';
import { loadUserSession } from '../../services/authSession';

export type AdminTabKey = 
  | 'SHOPS' 
  | 'DOMAINS' 
  | 'BACKUPS_SAFETY'
  | 'DATA_EXPORT' 
  | 'BILLING' 
  | 'SECTIONS' 
  | 'POPUPS' 
  | 'PRICING' 
  | 'VIDEOS' 
  | 'LEADS' 
  | 'PLATFORM_SETTINGS';

export interface AdminSidebarProps {
  state: PlatformState;
  activeTab: AdminTabKey;
  onSelectTab: (tab: AdminTabKey) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onOpenAddWebsite: () => void;
  onToggleGlobalPopup: () => void;
  onNavigateHome?: () => void;
}

interface SubMenuItem {
  id: string;
  tabKey?: AdminTabKey;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  onClick?: () => void;
}

interface SidebarMenuGroup {
  id: string;
  label: string;
  emoji?: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  subItems?: SubMenuItem[];
  directTabKey?: AdminTabKey;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  state,
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  onOpenAddWebsite,
  onToggleGlobalPopup,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const session = loadUserSession();
  const currentAdminEmail = session.email || 'RKMEHRA331996@GMAIL.COM';
  const isPageGuru = currentAdminEmail.toLowerCase().includes('pageguru');
  const currentAdminName = session.vendorName || (isPageGuru ? 'Page Guru' : 'R. K. Mehra');
  const adminInitials = isPageGuru ? 'PG' : 'RK';

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    menu_stores: true,
    menu_finance: true,
    menu_cms: false,
    menu_leads: false,
    menu_data: false,
  });

  const toggleExpand = (menuId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const domainCount = useMemo(() => {
    return state.shops.filter((s) => Boolean(s.customDomain)).length;
  }, [state.shops]);

  const menuGroups: SidebarMenuGroup[] = useMemo(
    () => [
      {
        id: 'group_overview',
        label: 'Dashboard Overview',
        icon: LayoutDashboard,
        directTabKey: 'SHOPS',
        badge: `${state.shops.length} Shops`,
        badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
      },
      {
        id: 'menu_stores',
        label: 'Stores & Domains',
        emoji: '🏪',
        icon: Store,
        badge: state.shops.length,
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold',
        subItems: [
          {
            id: 'sub_shops',
            tabKey: 'SHOPS',
            label: 'Vendors & Stores List',
            icon: Store,
            badge: state.shops.length,
            badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold',
          },
          {
            id: 'sub_add_website',
            label: '+ Add New Website',
            icon: Plus,
            badge: 'Quick',
            badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
            onClick: onOpenAddWebsite,
          },
          {
            id: 'sub_domains',
            tabKey: 'DOMAINS',
            label: 'Custom Domains & DNS',
            icon: Globe,
            badge: domainCount > 0 ? domainCount : undefined,
            badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
          },
        ],
      },
      {
        id: 'menu_finance',
        label: 'Finance & Plans',
        emoji: '💳',
        icon: Receipt,
        subItems: [
          {
            id: 'sub_billing',
            tabKey: 'BILLING',
            label: 'Website Earnings & Billing',
            icon: Receipt,
            badge: 'Day/Mo/Yr',
            badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          },
          {
            id: 'sub_pricing',
            tabKey: 'PRICING',
            label: '1-Year Pricing Packages',
            icon: Tag,
            badge: '1-Year Master',
            badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          },
        ],
      },
      {
        id: 'menu_data',
        label: 'Backups & Future Safety',
        emoji: '🛡️',
        icon: ShieldCheck,
        subItems: [
          {
            id: 'sub_backups_safety',
            tabKey: 'BACKUPS_SAFETY',
            label: 'Backup & Future Update Safety',
            icon: ShieldCheck,
            badge: 'Immunity',
            badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold',
          },
          {
            id: 'sub_data_export',
            tabKey: 'DATA_EXPORT',
            label: 'Data Export & CSV Reports',
            icon: Download,
            badge: 'Sheets',
            badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
          },
        ],
      },
      {
        id: 'menu_cms',
        label: 'CMS & Storefront',
        emoji: '🎨',
        icon: Sliders,
        subItems: [
          {
            id: 'sub_sections',
            tabKey: 'SECTIONS',
            label: 'Website Sections (ON / OFF)',
            icon: Sliders,
            badge: '18 Live',
            badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
          },
          {
            id: 'sub_popups',
            tabKey: 'POPUPS',
            label: 'Advertisement Popups',
            icon: Megaphone,
            badge: state.popups.length,
            badgeColor: state.popups.length > 0 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : undefined,
          },
          {
            id: 'sub_videos',
            tabKey: 'VIDEOS',
            label: 'Homepage Video Guides',
            icon: Video,
            badge: '4 Videos',
            badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
          },
          {
            id: 'sub_platform_settings',
            tabKey: 'PLATFORM_SETTINGS',
            label: 'Homepage & Admin Controls',
            icon: Settings,
            badge: 'QR & Story',
            badgeColor: 'bg-slate-700 text-slate-300 border border-slate-600',
          },
        ],
      },
      {
        id: 'menu_leads',
        label: 'Inquiries & Leads',
        emoji: '👥',
        icon: Users,
        directTabKey: 'LEADS',
        badge: state.platformLeads.length > 0 ? state.platformLeads.length : undefined,
        badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold',
      },
    ],
    [state.shops.length, domainCount, state.popups.length, state.platformLeads.length, onOpenAddWebsite]
  );

  // Filter groups and subitems by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return menuGroups;
    const q = searchQuery.toLowerCase();
    return menuGroups
      .map((group) => {
        const matchesMain = group.label.toLowerCase().includes(q);
        const matchingSubs = group.subItems?.filter((sub) =>
          sub.label.toLowerCase().includes(q)
        );
        if (matchesMain || (matchingSubs && matchingSubs.length > 0)) {
          return {
            ...group,
            subItems: matchingSubs && matchingSubs.length > 0 ? matchingSubs : group.subItems,
          };
        }
        return null;
      })
      .filter(Boolean) as SidebarMenuGroup[];
  }, [menuGroups, searchQuery]);

  // Auto-expand menu containing current activeTab
  useEffect(() => {
    for (const group of menuGroups) {
      if (group.subItems && group.subItems.some((sub) => sub.tabKey === activeTab)) {
        setExpandedMenus((prev) => ({
          ...prev,
          [group.id]: true,
        }));
      }
    }
  }, [activeTab, menuGroups]);

  const handleSelectTabKey = (key: AdminTabKey) => {
    onSelectTab(key);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111827] text-slate-200 border-r border-slate-800 select-none">
      
      {/* 1. Header: Super Admin Branding & Master Badge */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white uppercase font-['Outfit',sans-serif]">
                  INDIANLALAJI<span className="text-orange-500">.COM</span>
                </span>
              </div>
              <p className="text-[11px] text-orange-400 font-bold tracking-wider uppercase truncate">
                Super Admin Console
              </p>
            </div>
          </div>

          {/* Close button for Mobile Drawer */}
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

        {/* Admin Identity Pill */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shadow-md ring-2 ring-slate-700 shrink-0 ${
              isPageGuru 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                : 'bg-gradient-to-br from-orange-500 to-rose-600'
            }`}>
              {adminInitials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-200 truncate text-[11px] leading-tight">
                {currentAdminName}
              </p>
              <p className="text-[10px] text-slate-400 truncate font-mono">
                {currentAdminEmail}
              </p>
            </div>
          </div>

          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 shrink-0 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE
          </span>
        </div>
      </div>

      {/* 2. Quick Search Filter */}
      <div className="p-3 border-b border-slate-800/60 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search admin menus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Navigation Menus */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredGroups.map((group) => {
          const Icon = group.icon;
          const hasSubItems = Boolean(group.subItems && group.subItems.length > 0);
          const isExpanded = Boolean(expandedMenus[group.id]);
          const isDirectActive = group.directTabKey === activeTab;
          const hasActiveChild = Boolean(
            group.subItems && group.subItems.some((sub) => sub.tabKey === activeTab)
          );

          return (
            <div key={group.id} className="space-y-0.5">
              {/* Group / Direct Tab Row */}
              <button
                type="button"
                onClick={(e) => {
                  if (hasSubItems) {
                    toggleExpand(group.id, e);
                  } else if (group.directTabKey) {
                    handleSelectTabKey(group.directTabKey);
                  }
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDirectActive
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/20'
                    : hasActiveChild
                    ? 'bg-slate-800/80 text-orange-400 font-extrabold'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isDirectActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{group.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {group.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                        isDirectActive
                          ? 'bg-white/20 text-white'
                          : group.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {group.badge}
                    </span>
                  )}

                  {hasSubItems && (
                    <span className="text-slate-500">
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </span>
                  )}
                </div>
              </button>

              {/* Submenu items */}
              {hasSubItems && isExpanded && group.subItems && (
                <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-slate-800 ml-3.5 mt-0.5">
                  {group.subItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = sub.tabKey === activeTab;

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          if (sub.onClick) {
                            sub.onClick();
                            if (isOpenMobile) onCloseMobile();
                          } else if (sub.tabKey) {
                            handleSelectTabKey(sub.tabKey);
                          }
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-orange-600/20 text-orange-400 border border-orange-500/40 font-bold'
                            : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-orange-400' : 'text-slate-500'}`} />
                          <span className="truncate">{sub.label}</span>
                        </div>

                        {sub.badge !== undefined && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-xs shrink-0 ${
                              isSubActive
                                ? 'bg-orange-500/30 text-orange-200'
                                : sub.badgeColor || 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Controls: Global Popup Quick Switcher & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 shrink-0 space-y-2">
        
        {/* Global Popup Fast Switcher */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
              Global Popup
            </span>
            <span className={`text-[11px] font-bold ${state.globalPopupEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
              {state.globalPopupEnabled ? '🟢 Active On' : '🔴 Disabled'}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleGlobalPopup}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              state.globalPopupEnabled
                ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                : 'bg-rose-600 text-white shadow-xs hover:bg-rose-700'
            }`}
            title="Toggle global advertisement popup"
          >
            <Power className="w-3 h-3" />
            <span>{state.globalPopupEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Quick Add Website CTA */}
        <button
          type="button"
          onClick={() => {
            onOpenAddWebsite();
            if (isOpenMobile) onCloseMobile();
          }}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Store</span>
        </button>

        {/* View Live Storefront */}
        {onNavigateHome && (
          <button
            type="button"
            onClick={() => {
              onNavigateHome();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
            <span>View Live Website</span>
          </button>
        )}

        {/* Exit Admin */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-red-950/40 hover:text-red-400 text-slate-400 hover:border-red-900/50 border border-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin Panel</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed/Sticky Left Sidebar (Width: 270px) */}
      <aside className="hidden lg:block w-[270px] shrink-0 sticky top-0 h-screen z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Slide-in Drawer Sidebar with Backdrop */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Menu Canvas */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

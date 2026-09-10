import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, 
  PhoneCall, 
  Menu, 
  X, 
  LogIn, 
  PlusCircle, 
  Layers, 
  Video, 
  Tag, 
  Headphones, 
  Building2,
  ShieldCheck,
  Globe,
  ChevronDown,
  Check
} from 'lucide-react';
import { 
  SUPPORTED_LANGUAGES, 
  SupportedLanguage 
} from '../utils/shopTranslations';
import { 
  initGoogleTranslate, 
  applyGoogleTranslation 
} from '../utils/googleTranslate';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, shopId?: string) => void;
  onOpenAuth: (initialTab?: 'LOGIN' | 'REGISTER' | 'ADMIN') => void;
  currentRole?: 'VISITOR' | 'VENDOR' | 'ADMIN';
  currentUser?: { role: 'VENDOR' | 'ADMIN'; email: string; name?: string; shopId?: string } | null;
  vendorShopId?: string | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  currentRole = 'VISITOR',
  currentUser,
  vendorShopId,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Sync language on mount and handle outside click
  useEffect(() => {
    try {
      const saved = (localStorage.getItem('shop_preferred_language') as SupportedLanguage) || 'en';
      setCurrentLang(saved);
      initGoogleTranslate(saved);
    } catch {
      initGoogleTranslate('en');
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: SupportedLanguage) => {
    setCurrentLang(langCode);
    setIsLangOpen(false);
    try {
      localStorage.setItem('shop_preferred_language', langCode);
    } catch (e) {}
    applyGoogleTranslation(langCode);
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const effectiveRole = currentUser?.role || (currentRole !== 'VISITOR' ? currentRole : null);

  const navItems = [
    { id: 'home', label: 'Home', icon: Building2 },
    { id: 'stores', label: 'Live Stores', icon: Store },
    { id: 'how-it-works', label: 'How It Works', icon: Video },
    { id: 'pricing', label: 'Pricing', icon: Tag },
    { id: 'contact', label: 'Contact', icon: Headphones },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top Editorial Announcement / Customer Care Bar */}
      <div className="bg-[#F27D26] text-white text-[10px] py-1.5 px-4 sm:px-8 flex justify-between items-center tracking-wider font-bold uppercase select-none relative z-50">
        <div className="flex items-center gap-2 truncate">
          <PhoneCall className="w-3 h-3 shrink-0 text-white/90" />
          <span className="truncate">Support: +91 7087033009 | info@indianlalaji.com</span>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-3 tracking-widest text-[9.5px]">
            <span>Mon-Fri 10AM-5PM</span>
            <span>•</span>
            <span>LAUNCH YOUR STORE IN 2 MINUTES</span>
          </div>

          {/* Topbar Language Switcher Button */}
          <div className="relative" ref={langDropdownRef}>
            <button
              id="topbar-language-btn"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 bg-black/20 hover:bg-black/35 active:bg-black/40 text-white px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-normal transition-colors border border-white/20 shadow-xs cursor-pointer notranslate"
              title="Select Language"
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-white" />
              <span className="font-semibold">{activeLangObj.nativeName}</span>
              <ChevronDown className={`w-3 h-3 text-white/80 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isLangOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans normal-case tracking-normal notranslate"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
                  <span>Language</span>
                  <span className="text-orange-600 font-bold">11 Languages</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 py-1">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = lang.code === currentLang;
                    return (
                      <button
                        key={lang.code}
                        id={`topbar-lang-${lang.code}`}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-orange-50 transition-colors cursor-pointer ${
                          isSelected ? 'bg-orange-50/80 font-bold text-orange-600' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{lang.flag}</span>
                          <span className="font-semibold text-slate-900">{lang.nativeName}</span>
                          <span className="text-[11px] text-gray-400">({lang.name})</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Editorial Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:bg-orange-700 transition-colors">
              <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 font-['Outfit',sans-serif]">
                INDIANLALAJI<span className="text-orange-600">.COM</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase -mt-0.5">
                Digital Catalogue SaaS
              </span>
            </div>
          </div>

          {/* Desktop Editorial Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-semibold text-xs sm:text-sm uppercase tracking-wide">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-colors font-bold cursor-pointer relative py-1 ${
                    isActive
                      ? 'text-orange-600'
                      : 'text-slate-700 hover:text-orange-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3.5">
            {effectiveRole ? (
              <div className="flex items-center gap-2">
                <button
                  id="dashboard-access-btn"
                  onClick={() => handleNavClick(effectiveRole === 'ADMIN' ? 'admin-dashboard' : 'vendor-dashboard')}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors border border-orange-200"
                >
                  {effectiveRole === 'ADMIN' ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-orange-600" />
                      <span>Admin Panel</span>
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4 text-orange-600" />
                      <span>Vendor Dashboard</span>
                    </>
                  )}
                </button>
                <button
                  id="logout-btn"
                  onClick={onLogout}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  id="header-login-btn"
                  onClick={() => onOpenAuth('LOGIN')}
                  className="text-xs sm:text-sm font-bold border-2 border-slate-900 text-slate-900 px-5 py-2 hover:bg-slate-900 hover:text-white transition-colors uppercase tracking-wider rounded-sm"
                >
                  LOGIN
                </button>
                <button
                  id="header-create-store-btn"
                  onClick={() => onOpenAuth('REGISTER')}
                  className="text-xs sm:text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-sm shadow-md shadow-orange-500/20 uppercase tracking-wider transition-all"
                >
                  CREATE STORE
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 shadow-xl space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-left transition-colors ${
                    isActive ? 'bg-orange-50 text-orange-600' : 'text-slate-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {/* Mobile Language Selector */}
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/70 notranslate">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-orange-600" />
                  <span>Choose Language</span>
                </span>
                <span className="text-orange-600 font-semibold">{activeLangObj.nativeName}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = lang.code === currentLang;
                  return (
                    <button
                      key={`mob-lang-${lang.code}`}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`px-2 py-1.5 rounded text-[11px] font-medium text-left truncate transition-colors flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-orange-600 text-white font-bold' 
                          : 'bg-white hover:bg-orange-50 text-slate-700 border border-gray-200'
                      }`}
                    >
                      <span className="text-xs">{lang.flag}</span>
                      <span className="truncate">{lang.nativeName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {effectiveRole ? (
              <>
                <button
                  onClick={() => handleNavClick(effectiveRole === 'ADMIN' ? 'admin-dashboard' : 'vendor-dashboard')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider bg-orange-600 text-white shadow-xs"
                >
                  {effectiveRole === 'ADMIN' ? <ShieldCheck className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                  <span>Go to {effectiveRole === 'ADMIN' ? 'Admin Panel' : 'Vendor Dashboard'}</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-bold uppercase tracking-wider text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('REGISTER');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-200"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>CREATE STORE (Free Register)</span>
                </button>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('LOGIN');
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider text-slate-800 border-2 border-slate-900 rounded-sm"
                  >
                    Vendor Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('ADMIN');
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 rounded-sm"
                  >
                    Admin Login
                  </button>
                </div>
              </>
            )}
            
            <div className="mt-2 text-center text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
              Customer Support: <a href="tel:7087033009" className="text-orange-600 font-bold underline">+91 7087033009</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

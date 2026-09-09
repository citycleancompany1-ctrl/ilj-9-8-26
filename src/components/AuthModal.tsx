import React, { useState, useEffect } from 'react';
import { 
  X, 
  Store, 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Briefcase, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  MessageCircle
} from 'lucide-react';
import { BUSINESS_CATEGORIES, SUPER_ADMIN_CREDENTIALS } from '../data/initialData';
import { generateShopId, getOneYearExpiryDate } from '../utils/mediaUpload';
import { hashPassword, verifyPassword } from '../utils/security';
import { saveShopToFirestore, fetchShopFromFirestore } from '../services/firebase';
import { getRememberedShopId } from '../services/authSession';
import { Shop } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'LOGIN' | 'REGISTER' | 'ADMIN';
  authPromptNotice?: string | null;
  prefilledShopId?: string;
  onVendorLoginSuccess: (shopOrEmail: Shop | string, vendorName?: string, shopId?: string) => void;
  onVendorRegisterSuccess?: (newShop: Shop) => void;
  onRegisterShop?: (newShop: Shop) => void;
  onAdminLoginSuccess: () => void;
  existingShops?: Shop[];
  shops?: Shop[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'LOGIN',
  authPromptNotice = null,
  prefilledShopId = '',
  onVendorLoginSuccess,
  onVendorRegisterSuccess,
  onRegisterShop,
  onAdminLoginSuccess,
  existingShops,
  shops,
}) => {
  const allShops = shops || existingShops || [];
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER' | 'ADMIN'>(initialTab);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync tab when initialTab changes or modal opens
  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMsg(null);
  }, [initialTab, isOpen]);

  // Vendor Login Form State
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState(prefilledShopId || '');
  const [loginPassword, setLoginPassword] = useState('');

  // Sync prefilledShopId or rememberedShopId into login input
  useEffect(() => {
    if (prefilledShopId) {
      setLoginEmailOrPhone(prefilledShopId);
    } else if (!loginEmailOrPhone) {
      const remembered = getRememberedShopId();
      if (remembered) {
        setLoginEmailOrPhone(remembered);
      }
    }
  }, [prefilledShopId, isOpen]);

  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Vendor Registration Form State
  const [ownerName, setOwnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessCategory, setBusinessCategory] = useState(BUSINESS_CATEGORIES[0].name);
  const [state, setState] = useState('Uttar Pradesh');

  const indianStates = [
    'Uttar Pradesh', 'Maharashtra', 'Rajasthan', 'Delhi', 'Madhya Pradesh', 
    'Gujarat', 'Bihar', 'Punjab', 'Haryana', 'West Bengal', 'Karnataka', 
    'Tamil Nadu', 'Telangana', 'Kerala', 'Odisha', 'Assam', 'Jharkhand', 
    'Uttarakhand', 'Himachal Pradesh', 'Chhattisgarh', 'Goa', 'Andhra Pradesh'
  ];

  if (!isOpen) return null;

  const handleVendorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const query = loginEmailOrPhone.trim().toLowerCase();
    if (!query || !loginPassword) {
      setErrorMsg('Kripya apna email/mobile/Shop ID aur password bharein.');
      return;
    }

    // Match with existing registered shops
    let foundShop = allShops.find(
      (s) => s.vendorEmail.toLowerCase() === query || 
             s.phone === query || 
             s.whatsapp === query || 
             s.shopId.toLowerCase() === query
    );

    // Fallback: If shop was registered on another device and local cache hasn't synced yet, fetch directly from cloud
    if (!foundShop && query.startsWith('shp')) {
      const cloudShop = await fetchShopFromFirestore(query.toUpperCase());
      if (cloudShop) {
        foundShop = cloudShop;
      }
    }

    if (!foundShop) {
      setErrorMsg('Account nahi mila! Kripya apna registered Mobile number ya Shop ID darj karein, ya naya account Register karein.');
      return;
    }

    const storedCredential = foundShop.passwordHash || foundShop.vendorPassword;
    const isValid = await verifyPassword(loginPassword, storedCredential, foundShop.shopId);

    if (!isValid) {
      setErrorMsg('Galat Password! Kripya apna sahi password darj karein ya Super Admin se reset karwayein (Customer Care: 7087033009).');
      return;
    }

    // If legacy plain password exists and no hash, upgrade hash in Firestore
    if (!foundShop.passwordHash) {
      const newHash = await hashPassword(loginPassword, foundShop.shopId);
      const updatedShop = { ...foundShop, passwordHash: newHash };
      saveShopToFirestore(updatedShop);
    }

    onVendorLoginSuccess(foundShop, foundShop.vendorName, foundShop.shopId);
    onClose();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (
      adminEmail.trim().toLowerCase() === SUPER_ADMIN_CREDENTIALS.email.toLowerCase() &&
      adminPassword === SUPER_ADMIN_CREDENTIALS.password
    ) {
      onAdminLoginSuccess();
      onClose();
    } else {
      setErrorMsg('Invalid Super Admin credentials. Please check email and password.');
    }
  };

  const handleFillAdminDemo = () => {
    setAdminEmail(SUPER_ADMIN_CREDENTIALS.email);
    setAdminPassword(SUPER_ADMIN_CREDENTIALS.password);
    setErrorMsg(null);
  };

  const handleFillVendorDemo = (shop: Shop) => {
    setLoginEmailOrPhone(shop.vendorEmail || shop.phone || shop.shopId);
    setLoginPassword(shop.vendorPassword || '');
    setErrorMsg(null);
  };

  const handleVendorRegister = async (e?: React.FormEvent, sendWhatsApp: boolean = false) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (!ownerName.trim() || !businessName.trim() || !regEmail.trim() || !mobileNumber.trim() || !regPassword) {
      setErrorMsg('Kripya sabhi zaroori fields bharein.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setErrorMsg('Password aur Confirm Password match nahi ho rahe hain.');
      return;
    }

    const cleanPhone = (mobileNumber || '').replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Kripya 10-digit valid mobile number darj karein.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate unique Shop ID and salted hash
      const newShopId = generateShopId();
      const rawPass = regPassword.trim();
      const secureHash = await hashPassword(rawPass, newShopId);

      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://indianlalaji.com';
      const loginUrl = `${currentOrigin}/?action=login&shopId=${newShopId}`;

      const newShop: Shop = {
        id: `shop_${Date.now()}`,
        shopId: newShopId,
        vendorId: `vend_${Date.now()}`,
        vendorEmail: regEmail.trim(),
        vendorName: ownerName.trim(),
        vendorPassword: rawPass,
        passwordHash: secureHash,
        businessName: businessName.trim(),
        tagline: `Welcome to ${businessName.trim()} — Best quality in ${state}`,
        category: businessCategory,
        state: state,
        city: 'Local City',
        address: `Shop No. 1, Main Market, ${state}`,
        pincode: '110001',
        status: 'PUBLISHED', // Immediately published so website & products are live across all devices in 2 minutes
        templateId: 'tpl_premium_retail',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        activeDate: new Date().toISOString().split('T')[0],
        expiryDate: getOneYearExpiryDate(new Date().toISOString().split('T')[0]),
        planName: '1-Year Official LalaJi Store Plan',
        planPrice: 1499,
        isFeaturedInShowcase: false,
        viewsCount: 1,
        phone: cleanPhone,
        whatsapp: cleanPhone,
        email: regEmail.trim(),
        workingHours: '9:00 AM - 9:00 PM',
        logoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&auto=format&fit=crop&q=80',
        banners: [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
        ],
        bannerTitle: `${businessName.trim()} Ki Online Dukan`,
        bannerSubtitle: 'Aapki apni bharosemand dukaan ab digital ho chuki hai. WhatsApp pe order karein!',
        aboutPhotoUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&auto=format&fit=crop&q=80',
        aboutStory: `${businessName.trim()} mein aapka swaagat hai. Hum provide karte hain behtareen quality aur genuine service.`,
        establishedYear: '2024',
        galleryImages: [],
        paymentQrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${cleanPhone}@upi&pn=${encodeURIComponent(businessName)}&cu=INR`,
        upiId: `${cleanPhone}@upi`,
        colorTheme: 'saffron',
        fontStyle: 'sans',
        buttonStyle: 'rounded',
        ecommerceEnabled: true,
        serviceBookingEnabled: true,
        videos: [],
        products: [
          {
            id: `p_${Date.now()}_1`,
            name: 'Featured Special Item / Service',
            type: 'PRODUCT',
            price: 499,
            originalPrice: 799,
            category: 'General',
            description: 'Best selling high quality product. Direct order on WhatsApp!',
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
            inStock: true,
          },
        ],
        reviews: [],
      };

      // Save directly to Firestore cloud database
      await saveShopToFirestore(newShop);

      if (sendWhatsApp) {
        // WhatsApp message with Username/ID, Mobile, Password, Login URL
        const whatsappMsg = `*Namaste ${ownerName.trim()} ji!* 🙏\n\n` +
          `Aapka *IndianLalaJi Digital Store* account successfully create ho gaya hai!\n\n` +
          `🏪 *Shop Name:* ${businessName.trim()}\n` +
          `🆔 *Username / Shop ID:* ${newShopId}\n` +
          `📱 *Registered Mobile:* ${cleanPhone}\n` +
          `🔑 *Password:* ${rawPass}\n` +
          `🌐 *System Generated Login URL:* ${loginUrl}\n\n` +
          `👉 *Login Link:* Is link ko click karne par Login Window direct khulegi aur aapka Shop ID pehle se bhara milega. Sirf apna Password darj karein.\n\n` +
          `_IndianLalaJi Platform Network - 2 Minute Mein Website Live_`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(whatsappMsg)}`;
        window.open(whatsappUrl, '_blank');
      }

      setSuccessMsg(
        `Mubarak ho! Aapka Store ID: ${newShopId} create ho chuka hai. ${
          sendWhatsApp ? 'WhatsApp par ID aur Password bhej diya gaya hai. ' : ''
        }Dashboard open ho raha hai...`
      );

      setTimeout(() => {
        onRegisterShop?.(newShop);
        onVendorRegisterSuccess?.(newShop);
        onVendorLoginSuccess(newShop, newShop.vendorName, newShop.shopId);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Store create karne mein error aaya. Kripya dobara koshish karein.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-slate-900 px-6 pt-6 pb-5 text-white border-b-2 border-orange-600">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-sm bg-orange-600 flex items-center justify-center font-bold">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase font-['Outfit',sans-serif]">
                Indian<span className="text-orange-500">LalaJi</span>.com Portal
              </h2>
              <p className="text-xs text-gray-300 font-medium">
                2 Minute Mein Website Live Karo — Mobile Se Banao Apni Website
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-sm mt-4 text-[10px] font-black uppercase tracking-wider">
            <button
              id="tab-vendor-login"
              onClick={() => {
                setActiveTab('LOGIN');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-sm transition-all text-center ${
                activeTab === 'LOGIN' ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              Vendor Login
            </button>
            <button
              id="tab-vendor-register"
              onClick={() => {
                setActiveTab('REGISTER');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-sm transition-all text-center ${
                activeTab === 'REGISTER' ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              Create Store
            </button>
            <button
              id="tab-admin-login"
              onClick={() => {
                setActiveTab('ADMIN');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-sm transition-all text-center ${
                activeTab === 'ADMIN' ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              Super Admin
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {authPromptNotice && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold block text-amber-800 uppercase tracking-wide text-[10px]">Login Required</span>
                {authPromptNotice}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-sm bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-green-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: VENDOR LOGIN */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleVendorLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Registered Email or Mobile Number
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="vendor-login-email"
                    type="text"
                    required
                    placeholder="e.g. ramesh.kirana@gmail.com ya 9876543210"
                    value={loginEmailOrPhone}
                    onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-sm border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="vendor-login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-sm border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50/50"
                  />
                  <button
                    id="toggle-vendor-login-password"
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    title={showLoginPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="vendor-login-submit-btn"
                type="submit"
                className="w-full py-3 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Login to Vendor Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>



              <div className="text-center pt-2">
                <span className="text-xs text-gray-500"> <b> Password Bhool Gaye?</b></span>
                <span className="text-xs text-gray-500"> <b>कस्टमर केयर: 7087033009 — अपना शॉप नंबर / रजिस्टर्ड मोबाइल नंबर बताएं।</b></span>
              </div>
            

              <div className="text-center pt-2">
                <span className="text-xs text-gray-500">Naya store banana hai? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('REGISTER')}
                  className="text-xs font-bold uppercase tracking-wider text-orange-600 hover:underline"
                >
                  Register Store Now (Free)
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: VENDOR REGISTRATION (Exact specification fields) */}
          {activeTab === 'REGISTER' && (
            <form onSubmit={handleVendorRegister} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Owner Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="reg-owner-name"
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Business / Shop Name *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="reg-business-name"
                      type="text"
                      required
                      placeholder="e.g. Lala Ji Kirana Store"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="e.g. ramesh@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="reg-mobile"
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Business Category *
                  </label>
                  <select
                    id="reg-category"
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 font-medium"
                  >
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    State *
                  </label>
                  <select
                    id="reg-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 font-medium"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                    <button
                      id="toggle-reg-password"
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-2 p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      title={showRegPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                    <button
                      id="toggle-reg-confirm-password"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2 p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-sm border border-gray-200 text-[11px] text-slate-900 leading-relaxed">
                ⚡ <strong>Registration Workflow:</strong> Register → Auto Dynamic Shop ID → Vendor Dashboard → Fill details & Draft preview → Submit for Admin Review → Website Published!
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  id="vendor-register-submit-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleVendorRegister(e, false)}
                  className="flex-1 py-3 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Create Account</span>
                </button>

                <button
                  id="vendor-register-whatsapp-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleVendorRegister(e, true)}
                  className="flex-1 py-3 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>💬 Send ID & Password on WhatsApp</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SUPER ADMIN LOGIN */}
          {activeTab === 'ADMIN' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Super Admin Email
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="admin-login-email"
                    type="email"
                    required
                    placeholder="admin@gmail.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-sm border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Admin Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="admin-login-password"
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-sm border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono bg-gray-50/50"
                  />
                  <button
                    id="toggle-admin-login-password"
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    title={showAdminPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="admin-login-submit-btn"
                type="submit"
                className="w-full py-3 rounded-sm bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-wider text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>Enter Super Admin Dashboard</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

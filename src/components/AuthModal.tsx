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
import { BUSINESS_CATEGORIES, SUPER_ADMIN_CREDENTIALS, SUPER_ADMIN_ACCOUNTS } from '../data/initialData';
import { getSubCategoriesForMain } from '../data/categoryTaxonomy';
import { generateShopId, getOneYearExpiryDate, generateInvoiceNumber, formatINR } from '../utils/mediaUpload';
import { hashPassword, verifyPassword } from '../utils/security';
import { saveShopToFirestore, fetchShopFromFirestore } from '../services/firebase';
import { getRememberedShopId } from '../services/authSession';
import { seedStoreWithDefaults } from '../utils/defaultContentSeeder';
import { Shop, SubscriptionInvoice, PricingPackage } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'LOGIN' | 'REGISTER' | 'ADMIN';
  authPromptNotice?: string | null;
  prefilledShopId?: string;
  onVendorLoginSuccess: (shopOrEmail: Shop | string, vendorName?: string, shopId?: string) => void;
  onVendorRegisterSuccess?: (newShop: Shop) => void;
  onRegisterShop?: (newShop: Shop) => void;
  onAdminLoginSuccess: (adminEmail?: string, adminName?: string) => void;
  existingShops?: Shop[];
  shops?: Shop[];
  pricingPackages?: PricingPackage[];
  activePlanPrice?: number;
  activePlanName?: string;
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
  pricingPackages,
  activePlanPrice,
  activePlanName,
}) => {
  const allShops = shops || existingShops || [];
  const finalPlanPrice = activePlanPrice ?? (pricingPackages && pricingPackages.length > 0 ? pricingPackages[0].price : 1499);
  const finalPlanName = activePlanName ?? (pricingPackages && pricingPackages.length > 0 ? pricingPackages[0].name : '1-Year Official LalaJi Store Plan');
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
  const [adminPin, setAdminPin] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);

  // Vendor Registration Form State (Your Name, Business Name, WhatsApp Number, Business Category, Business Sub-Category, Password, Confirm Password)
  const [ownerName, setOwnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [businessCategory, setBusinessCategory] = useState(BUSINESS_CATEGORIES[0].name);
  const [subCategory, setSubCategory] = useState(() => getSubCategoriesForMain(BUSINESS_CATEGORIES[0].name)[0] || '');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleVendorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const query = loginEmailOrPhone.trim().toLowerCase();
    if (!query || !loginPassword) {
      setErrorMsg('Please enter your registered email/mobile/Shop ID and password.');
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
      setErrorMsg('Account not found! Please check your registered mobile number or Shop ID, or register a new store account.');
      return;
    }

    const storedCredential = foundShop.passwordHash || foundShop.vendorPassword;
    const isValid = await verifyPassword(loginPassword, storedCredential, foundShop.shopId);

    if (!isValid) {
      setErrorMsg('Incorrect password! Please enter the correct password or contact customer support at +91 7087033009 for a password reset.');
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

    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPassword = adminPassword.trim();
    const cleanPin = adminPin.trim();

    if (!cleanEmail || !cleanPassword || !cleanPin) {
      setErrorMsg('Please enter Email ID, Master Password, and Security PIN.');
      return;
    }

    const matchedAdmin = SUPER_ADMIN_ACCOUNTS.find(
      (acc) =>
        acc.email.toLowerCase() === cleanEmail &&
        acc.password === cleanPassword &&
        acc.pin === cleanPin
    );

    if (matchedAdmin) {
      onAdminLoginSuccess(matchedAdmin.email, matchedAdmin.name);
      onClose();
    } else {
      const emailExists = SUPER_ADMIN_ACCOUNTS.some(
        (acc) => acc.email.toLowerCase() === cleanEmail
      );
      if (!emailExists) {
        setErrorMsg('Unauthorized Super Admin email address.');
      } else {
        setErrorMsg('Incorrect Master Password or Security PIN Code.');
      }
    }
  };

  const handleFillVendorDemo = (shop: Shop) => {
    setLoginEmailOrPhone(shop.vendorEmail || shop.phone || shop.shopId);
    setLoginPassword(shop.vendorPassword || '');
    setErrorMsg(null);
  };

  const handleVendorRegister = async (e?: React.FormEvent, sendWhatsApp?: boolean) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (!ownerName.trim() || !businessName.trim() || !mobileNumber.trim() || !regPassword || !confirmPassword) {
      setErrorMsg('Please fill in all required fields (Your Name, Business Name, WhatsApp Number, Password, Confirm Password).');
      return;
    }

    const cleanPhone = (mobileNumber || '').replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    const shouldSendWhatsApp = Boolean(sendWhatsApp);
    setIsSubmitting(true);
    try {
      // Generate unique Shop ID and salted hash
      const newShopId = generateShopId();
      const rawPass = regPassword.trim();
      const secureHash = await hashPassword(rawPass, newShopId);

      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://indianlalaji.com';
      const loginUrl = `${currentOrigin}/?action=login&shopId=${newShopId}`;
      const storeEmail = `${cleanPhone}@store.indianlalaji.com`;

      const baseShop: Partial<Shop> = {
        id: `shop_${Date.now()}`,
        shopId: newShopId,
        vendorId: `vend_${Date.now()}`,
        vendorEmail: storeEmail,
        vendorName: ownerName.trim(),
        vendorPassword: rawPass,
        passwordHash: secureHash,
        businessName: businessName.trim(),
        category: subCategory ? `${businessCategory} - ${subCategory}` : businessCategory,
        mainCategory: businessCategory,
        subCategory: subCategory,
        state: 'Uttar Pradesh',
        city: 'Local Market',
        address: 'Shop No. 1, Main Market',
        pincode: '110001',
        status: 'DRAFT', // Registered in Draft mode. Admin payment verification ke baad website publish hogi
        templateId: 'tpl_premium_retail',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        activeDate: new Date().toISOString().split('T')[0],
        expiryDate: getOneYearExpiryDate(new Date().toISOString().split('T')[0]),
        planName: finalPlanName,
        planPrice: finalPlanPrice,
        isFeaturedInShowcase: false,
        viewsCount: 1,
        phone: cleanPhone,
        whatsapp: cleanPhone,
        email: storeEmail,
        workingHours: '9:00 AM - 9:00 PM',
        paymentQrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${cleanPhone}@upi&pn=${encodeURIComponent(businessName)}&cu=INR`,
        upiId: `${cleanPhone}@upi`,
        fontStyle: 'sans',
        buttonStyle: 'rounded',
        ecommerceEnabled: true,
        serviceBookingEnabled: true,
        invoices: [
          (() => {
            const taxableAmount = Math.round((finalPlanPrice / 1.18) * 100) / 100;
            const taxAmount = Math.round((finalPlanPrice - taxableAmount) * 100) / 100;
            const regDateStr = new Date().toISOString().split('T')[0];
            return {
              id: `inv_${newShopId}_${Date.now()}`,
              invoiceNumber: generateInvoiceNumber(newShopId),
              shopId: newShopId,
              businessName: businessName.trim(),
              vendorName: ownerName.trim(),
              vendorPhone: cleanPhone,
              vendorEmail: storeEmail,
              vendorAddress: 'Shop No. 1, Main Market - 110001',
              planName: finalPlanName,
              planPeriod: '1 Full Year (365 Days Validity)',
              activeDate: regDateStr,
              expiryDate: getOneYearExpiryDate(regDateStr),
              baseAmount: taxableAmount,
              taxRate: 18,
              taxAmount: taxAmount,
              totalAmount: finalPlanPrice,
              paymentMethod: 'UPI',
              paymentStatus: 'PENDING',
              paidAt: '',
              issuedBy: 'IndianLalaJi Platform Network',
              adminGstin: '03AABCI9823P1Z4',
            };
          })(),
        ],
        videos: [],
      };

      // Apply category-aware default content seeding (relevant banners, logo, about story, products, services, features, FAQs, reviews)
      const newShop = seedStoreWithDefaults(
        {
          businessName: businessName.trim(),
          vendorName: ownerName.trim(),
          category: businessCategory,
          mainCategory: businessCategory,
          subCategory: subCategory,
          city: 'Local Market',
          state: 'Uttar Pradesh',
          phone: cleanPhone,
          email: storeEmail,
        },
        baseShop
      ) as Shop;

      // Save directly to Firestore cloud database
      await saveShopToFirestore(newShop);

      if (shouldSendWhatsApp) {
        // WhatsApp message with Username/ID, Mobile, Password, Login URL
        const whatsappMsg = `*Hello ${ownerName.trim()}!* 🙏\n\n` +
          `Your *IndianLalaJi Digital Store* account has been created in *DRAFT Mode*!\n\n` +
          `🏪 *Shop Name:* ${businessName.trim()}\n` +
          `🆔 *Username / Shop ID:* ${newShopId}\n` +
          `📱 *Registered WhatsApp:* ${cleanPhone}\n` +
          `🔑 *Password:* ${rawPass}\n` +
          `📋 *Status:* DRAFT (Admin payment verification ke baad website publish hogi)\n` +
          `🌐 *System Generated Login URL:* ${loginUrl}\n\n` +
          `👉 *Direct Login Link:* Click this link to open the login screen with your Shop ID prefilled. Enter your password to access your dashboard.\n\n` +
          `_IndianLalaJi Platform Network - Trusted Business Growth_`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(whatsappMsg)}`;
        window.open(whatsappUrl, '_blank');
      }

      setSuccessMsg(
        `Store account (${newShopId}) created successfully! ${
          shouldSendWhatsApp ? 'Credentials WhatsApp par bhej diye gaye hain. ' : ''
        }Opening your dashboard...`
      );

      setTimeout(() => {
        onRegisterShop?.(newShop);
        onVendorRegisterSuccess?.(newShop);
        onVendorLoginSuccess(newShop, newShop.vendorName, newShop.shopId);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error creating your store account. Please try again.');
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
                Launch Your Website in 2 Minutes — Build & Manage from Your Smartphone
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
                  Registered WhatsApp Number, Mobile or Shop ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="vendor-login-email"
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or SHP..."
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
                <span className="text-xs text-gray-500"> <b> Forgot Password? </b></span>
                <span className="text-xs text-gray-500"> <b>Customer Support: +91 7087033009 — Provide your Shop ID or registered mobile.</b></span>
              </div>
            

              <div className="text-center pt-2">
                <span className="text-xs text-gray-500">Need to create a new store? </span>
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
            <form onSubmit={(e) => handleVendorRegister(e)} className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Your Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      id="reg-your-name"
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* 2. Business Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Business Name *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      id="reg-business-name"
                      type="text"
                      required
                      placeholder="e.g. Lala Ji Kirana Store"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* 3. WhatsApp Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    id="reg-whatsapp-number"
                    type="tel"
                    required
                    placeholder="10-digit WhatsApp number (e.g. 9876543210)"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 4. Business Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Business Category *
                  </label>
                  <select
                    id="reg-business-category"
                    value={businessCategory}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setBusinessCategory(newCat);
                      const subs = getSubCategoriesForMain(newCat);
                      setSubCategory(subs[0] || '');
                    }}
                    className="w-full px-3 py-2.5 rounded-sm border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 font-medium"
                  >
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        #{cat.number} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Business Sub-Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Business Sub-Category *
                  </label>
                  <select
                    id="reg-business-sub-category"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-sm border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 font-medium"
                  >
                    {getSubCategoriesForMain(businessCategory).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 6. Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 rounded-sm border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                    <button
                      id="toggle-reg-password"
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-2.5 p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      title={showRegPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 7. Confirm Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 rounded-sm border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                    <button
                      id="toggle-reg-confirm-password"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2.5 p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: 1) Create Store, 2) Send ID & Password on WhatsApp */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  id="vendor-create-store-submit-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleVendorRegister(e, false)}
                  className="flex-1 py-3 px-3 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Store className="w-4 h-4 shrink-0" />
                  <span>{isSubmitting ? 'Creating Store...' : 'Create store'}</span>
                </button>

                <button
                  id="vendor-register-whatsapp-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleVendorRegister(e, true)}
                  className="flex-1 py-3 px-3 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Send ID & Password on WhatsApp</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <span className="text-xs text-gray-500">Already have a store? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('LOGIN')}
                  className="text-xs font-bold uppercase tracking-wider text-orange-600 hover:underline cursor-pointer"
                >
                  Login Here
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SUPER ADMIN LOGIN */}
          {activeTab === 'ADMIN' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Super Admin Email ID
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="admin-login-email"
                    type="email"
                    required
                    placeholder="Enter Super Admin Email ID"
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
                    placeholder="Enter Master Password"
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Security PIN Code (4 Digits)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="admin-login-pin"
                    type={showAdminPin ? 'text' : 'password'}
                    required
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 4-Digit PIN (e.g. 0000 or 1996)"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-sm border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono bg-gray-50/50 tracking-wider"
                  />
                  <button
                    id="toggle-admin-login-pin"
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    title={showAdminPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Three-factor authentication: Email ID, Master Password, and Security PIN are required.
                </p>
              </div>

              <button
                id="admin-login-submit-btn"
                type="submit"
                className="w-full py-3 rounded-sm bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-wider text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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

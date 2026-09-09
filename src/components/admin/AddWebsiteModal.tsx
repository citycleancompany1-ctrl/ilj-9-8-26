import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Store, 
  Key, 
  Copy, 
  Check, 
  Globe, 
  Sparkles, 
  Calendar, 
  CreditCard,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { Shop, PlatformState, SubscriptionInvoice } from '../../types';
import { BUSINESS_CATEGORIES } from '../../data/initialData';
import { generateShopId, getOneYearExpiryDate, getWhatsAppDirectUrl } from '../../utils/mediaUpload';
import { generateSecurePassword, hashPassword } from '../../utils/security';
import { saveShopToFirestore } from '../../services/firebase';
import { getDefaultSectionsConfig } from '../../utils/sectionDefaults';

interface AddWebsiteModalProps {
  state: PlatformState;
  onClose: () => void;
  onAddShop: (newShop: Shop) => void;
  showToast: (msg: string) => void;
}

export const AddWebsiteModal: React.FC<AddWebsiteModalProps> = ({
  state,
  onClose,
  onAddShop,
  showToast,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [category, setCategory] = useState(BUSINESS_CATEGORIES[0]?.name || 'Retail & Kirana Store');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Uttar Pradesh');
  const [address, setAddress] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [upiId, setUpiId] = useState('');
  const [password, setPassword] = useState(generateSecurePassword());
  const [status, setStatus] = useState<'PUBLISHED' | 'PENDING_APPROVAL'>('PUBLISHED');
  const [planPrice, setPlanPrice] = useState(1499);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !vendorName.trim() || !phone.trim()) {
      showToast('Please fill in business name, owner name, and phone number!');
      return;
    }

    setIsSubmitting(true);
    try {
      const newShopId = generateShopId();
      const todayStr = new Date().toISOString().split('T')[0];
      const expiryStr = getOneYearExpiryDate(todayStr);

      const passwordHash = await hashPassword(password, newShopId);

      const initialInvoice: SubscriptionInvoice = {
        id: `inv_${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${newShopId.replace('SHP', '')}`,
        shopId: newShopId,
        businessName: businessName.trim(),
        vendorName: vendorName.trim(),
        vendorPhone: phone.trim(),
        vendorEmail: vendorEmail.trim() || undefined,
        vendorAddress: address.trim() || `${city}, ${stateName}`,
        planName: '1-Year Official LalaJi Store Plan',
        planPeriod: '1 Year (365 Days)',
        activeDate: todayStr,
        expiryDate: expiryStr,
        baseAmount: Math.round((planPrice / 1.18) * 100) / 100,
        taxRate: 18,
        taxAmount: Math.round((planPrice - planPrice / 1.18) * 100) / 100,
        totalAmount: planPrice,
        paymentMethod: 'UPI',
        paymentRefId: `ADMIN-ONBOARD-${Date.now().toString().slice(-6)}`,
        paymentStatus: status === 'PUBLISHED' ? 'PAID' : 'PENDING',
        paidAt: new Date().toISOString(),
        issuedBy: 'IndianLalaJi Platform Network',
      };

      const cleanDomain = customDomain.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');

      const resolvedEmail = vendorEmail.trim() || `${phone.trim()}@indianlalaji.com`;

      const newShop: Shop = {
        id: `shop_${Date.now()}`,
        shopId: newShopId,
        vendorId: `vend_${Date.now()}`,
        businessName: businessName.trim(),
        vendorName: vendorName.trim(),
        phone: phone.trim(),
        whatsapp: (whatsapp.trim() || phone.trim()),
        email: resolvedEmail,
        vendorEmail: resolvedEmail,
        vendorPassword: password,
        passwordHash: passwordHash,
        category,
        address: address.trim() || `${city}, ${stateName}`,
        city: city.trim() || 'Varanasi',
        state: stateName,
        pincode: '221001',
        tagline: `${businessName.trim()} - Best in ${category}`,
        aboutStory: `Namaste! Welcome to ${businessName.trim()}. We offer premium quality ${category.toLowerCase()} items at best prices. Order directly on WhatsApp!`,
        planName: '1-Year Official LalaJi Store Plan',
        planPrice: planPrice,
        activeDate: todayStr,
        expiryDate: expiryStr,
        status: status,
        templateId: 'tpl_premium_retail',
        isFeaturedInShowcase: false,
        viewsCount: 0,
        logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
        banners: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200'],
        aboutPhotoUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800',
        establishedYear: '2020',
        galleryImages: [],
        paymentQrUrl: 'https://images.unsplash.com/photo-1595079672139-547104b2320e?w=400',
        upiId: upiId.trim() || `${phone.trim()}@paytm`,
        colorTheme: 'saffron',
        fontStyle: 'sans',
        buttonStyle: 'rounded',
        ecommerceEnabled: true,
        serviceBookingEnabled: true,
        videos: [],
        products: [],
        reviews: [],
        customDomain: cleanDomain || undefined,
        connectedWebsiteUrl: cleanDomain ? `https://${cleanDomain}` : undefined,
        domainConnectStatus: cleanDomain ? 'CONNECTED' : 'NOT_CONNECTED',
        invoices: [initialInvoice],
        sectionsConfig: getDefaultSectionsConfig({
          businessName: businessName.trim(),
          vendorName: vendorName.trim(),
          category,
          city: city.trim(),
          phone: phone.trim(),
          email: resolvedEmail,
          address: address.trim(),
        }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onAddShop(newShop);
      saveShopToFirestore(newShop).catch((err) => {
        console.warn('[Firestore] Background cloud save warning:', err);
      });
      showToast(`Website "${newShop.businessName}" created successfully with ID: ${newShop.shopId}!`);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Error creating website. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                + Add New Website / Dukaan
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Create and launch a new vendor website with 1-Year validity
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
          
          {/* Business & Owner Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Business / Store Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Fashion Boutique"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Owner / Vendor Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Anjali Verma"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mobile Phone *
              </label>
              <input
                type="tel"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                placeholder="If same, leave empty"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="vendor@gmail.com"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Business Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-medium text-slate-900"
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                City / Town
              </label>
              <input
                type="text"
                placeholder="e.g. Varanasi, Lucknow"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
              Store Physical Address
            </label>
            <input
              type="text"
              placeholder="e.g. Shop 24, Main Market, Near Clock Tower"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 font-medium text-slate-900"
            />
          </div>

          {/* Website Connect & Domain */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Connect Website / Custom Domain (Optional)</span>
            </div>
            <input
              type="text"
              placeholder="e.g. www.royalfashion.in or shop.royalfashion.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-medium text-slate-900"
            />
            <p className="text-[10px] text-gray-500">
              Vendor website ke sath direct custom domain connect karne ke liye domain name enter karein.
            </p>
          </div>

          {/* Vendor Login Password Box */}
          <div className="p-3.5 bg-orange-50/70 rounded-xl border border-orange-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-orange-900 font-bold">
                <Key className="w-3.5 h-3.5 text-orange-600" />
                <span>Vendor Login Password (Auto Generated)</span>
              </div>
              <button
                type="button"
                onClick={() => setPassword(generateSecurePassword())}
                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase cursor-pointer"
              >
                Regenerate
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="admin-create-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 pr-9 py-1.5 rounded-lg border border-orange-300 bg-white font-mono font-bold text-slate-900 text-sm"
                />
                <button
                  id="toggle-admin-create-password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                id="copy-admin-create-password"
                type="button"
                onClick={copyPassword}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer text-xs"
              >
                {copiedPassword ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPassword ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-500">
              Vendor will login using their Mobile Number or Email and this password.
            </p>
          </div>

          {/* Plan & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subscription Plan Fee (₹)
              </label>
              <input
                type="number"
                value={planPrice}
                onChange={(e) => setPlanPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-bold text-slate-900"
              />
              <span className="text-[10px] text-emerald-700 font-medium">1 Full Year Validity (365 Days)</span>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-bold text-slate-900"
              >
                <option value="PUBLISHED">🟢 PUBLISHED (Live Immediately)</option>
                <option value="PENDING_APPROVAL">🟡 PENDING_APPROVAL (Awaiting Payment)</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold uppercase rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Creating Website...' : 'Create & Launch Website'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

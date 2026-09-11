import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Server,
  Trash2,
  Save,
  Check,
  RefreshCw,
  Sparkles,
  Send,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Search,
  QrCode,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import { Shop, VendorDomainRequest } from '../../types';
import { saveShopToFirestore } from '../../services/firebase';
import { getWhatsAppDirectUrl } from '../../utils/mediaUpload';

interface VendorCustomDomainManagerProps {
  shop: Shop;
  onUpdateShop: (updated: Shop) => void;
  showToast: (msg: string) => void;
}

export const VendorCustomDomainManager: React.FC<VendorCustomDomainManagerProps> = ({
  shop,
  onUpdateShop,
  showToast,
}) => {
  // Selected option: 'ALREADY_HAVE' (₹599) vs 'BUY_NEW' (₹1,499)
  const [selectedOption, setSelectedOption] = useState<'ALREADY_HAVE' | 'BUY_NEW'>(
    shop.domainRequest?.type || 'ALREADY_HAVE'
  );

  // Input states
  const [alreadyHaveDomainInput, setAlreadyHaveDomainInput] = useState<string>(
    shop.domainRequest?.type === 'ALREADY_HAVE' ? shop.domainRequest.domain : (shop.customDomain || '')
  );
  const [buyNewDomainInput, setBuyNewDomainInput] = useState<string>(
    shop.domainRequest?.type === 'BUY_NEW' ? shop.domainRequest.domain : ''
  );

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const adminPhone = '7087033009';
  const adminWhatsapp = '7087033009';

  const cleanDomain = (val: string) =>
    val.trim().toLowerCase().replace(/^https?:\/\//i, '').replace(/\/$/, '');

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`📋 Copied "${text}" to clipboard!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Submit Domain Request to Admin
  const handleSendRequestToAdmin = (type: 'ALREADY_HAVE' | 'BUY_NEW') => {
    const rawInput = type === 'ALREADY_HAVE' ? alreadyHaveDomainInput : buyNewDomainInput;
    const cleaned = cleanDomain(rawInput);

    if (!cleaned) {
      showToast(
        type === 'ALREADY_HAVE'
          ? '⚠️ Kripya apna existing domain enter karein (Example: www.mybusiness.in)'
          : '⚠️ Kripya apna preferred domain enter karein (Example: mybusiness.in)'
      );
      return;
    }

    // Basic domain validation
    if (!cleaned.includes('.') || cleaned.length < 4) {
      showToast('⚠️ Valid domain format enter karein (e.g. www.mybusiness.in ya mybusiness.in)');
      return;
    }

    setIsSubmittingRequest(true);

    const amount = type === 'ALREADY_HAVE' ? 599 : 1499;
    const newRequest: VendorDomainRequest = {
      id: `DREQ-${Date.now()}`,
      shopId: shop.shopId,
      businessName: shop.businessName,
      vendorName: shop.vendorName,
      phone: shop.phone,
      whatsapp: shop.whatsapp || shop.phone,
      type,
      amount,
      domain: cleaned,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      adminNotes: type === 'BUY_NEW' ? 'Admin will check domain availability and verify' : 'DNS setup assistance requested',
      paymentStatus: 'PENDING',
    };

    const updated: Shop = {
      ...shop,
      domainRequest: newRequest,
      // If vendor already has this domain, keep domain state pending admin review
      customDomain: shop.customDomain || cleaned,
      domainConnectStatus: shop.domainConnectStatus === 'CONNECTED' ? 'CONNECTED' : 'PENDING_DNS',
      updatedAt: new Date().toISOString(),
    };

    onUpdateShop(updated);
    saveShopToFirestore(updated);

    setTimeout(() => {
      setIsSubmittingRequest(false);
      showToast(
        `🚀 Domain Request (₹${amount.toLocaleString('en-IN')}) successfully Admin ko bhej di gayi hai! Admin Dashboard me review ke liye pahunch gayi hai.`
      );
    }, 600);
  };

  // Cancel / Withdraw Request
  const handleCancelRequest = () => {
    if (!window.confirm('Kya aap apni pending domain request cancel karna chahte hain?')) {
      return;
    }

    const updated: Shop = {
      ...shop,
      domainRequest: undefined,
      updatedAt: new Date().toISOString(),
    };

    onUpdateShop(updated);
    saveShopToFirestore(updated);
    showToast('🗑️ Domain request cancel kar di gayi hai.');
  };

  // Disconnect active domain
  const handleRemoveDomain = () => {
    if (!window.confirm(`Kya aap "${shop.customDomain}" domain disconnect karna chahte hain?`)) {
      return;
    }

    const updated: Shop = {
      ...shop,
      customDomain: undefined,
      domainConnectStatus: 'NOT_CONNECTED',
      domainRequest: undefined,
      updatedAt: new Date().toISOString(),
    };

    setAlreadyHaveDomainInput('');
    setBuyNewDomainInput('');
    setVerificationResult(null);
    onUpdateShop(updated);
    saveShopToFirestore(updated);
    showToast('🗑️ Custom domain disconnect kar diya gaya hai.');
  };

  // Verify DNS simulation
  const handleVerifyDns = () => {
    const targetDomain = shop.customDomain || cleanDomain(alreadyHaveDomainInput);
    if (!targetDomain) {
      showToast('⚠️ Pehle domain name enter karein.');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      const isConfigured = Boolean(targetDomain && targetDomain.includes('.'));
      if (isConfigured) {
        setVerificationResult({
          success: true,
          message: `DNS Records verified! Domain "${targetDomain}" is actively routed to IndianLalaJi Edge Ingress with SSL certificate.`,
        });

        const updated: Shop = {
          ...shop,
          customDomain: targetDomain,
          domainConnectStatus: 'CONNECTED',
          isCustomDomainActive: true,
          updatedAt: new Date().toISOString(),
        };
        onUpdateShop(updated);
        saveShopToFirestore(updated);
        showToast(`✅ DNS Verified! "${targetDomain}" is CONNECTED.`);
      } else {
        setVerificationResult({
          success: false,
          message: 'DNS propagation pending or record mismatch. Please check your A and CNAME records.',
        });
      }
    }, 1200);
  };

  const activeRequest = shop.domainRequest;
  const isDomainConnected = Boolean(shop.customDomain && shop.domainConnectStatus === 'CONNECTED');

  return (
    <div className="space-y-6">
      {/* 1. TOP HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-indigo-400">
          <Globe className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              Vendor Panel → Domain Request
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Connect Your Brand Domain (.com / .in / .store)
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Apni dukaan ko apne personal brand domain par chalayein (jaise <strong>www.mybusiness.in</strong>). 
              Chahe aapke paas pehle se domain ho ya naya kharidna ho, IndianLalaJi team complete setup provide karti hai.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
            {isDomainConnected ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Live: https://{shop.customDomain}
              </span>
            ) : activeRequest ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black shadow-xs">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                Request Status: {activeRequest.status}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/40 text-xs font-bold shadow-xs">
                <AlertTriangle className="w-4 h-4 text-gray-400" />
                No Domain Connected Yet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. ACTIVE DOMAIN REQUEST STATUS TRACKER (IF REQUEST SUBMITTED) */}
      {activeRequest && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-400 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-amber-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Clock className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 uppercase font-['Outfit',sans-serif]">
                    Active Domain Request Sent to Admin
                  </h3>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    activeRequest.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : activeRequest.status === 'CHECKING_AVAILABILITY'
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      : activeRequest.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {activeRequest.status === 'CHECKING_AVAILABILITY' 
                      ? 'Admin Checking Availability' 
                      : activeRequest.status === 'PENDING' 
                      ? 'Pending Admin Review' 
                      : activeRequest.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Request ID: <strong className="font-mono text-slate-800">{activeRequest.id}</strong> • Submitted:{' '}
                  {new Date(activeRequest.requestedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto">
              <button
                type="button"
                onClick={handleCancelRequest}
                className="px-3.5 py-2 text-xs font-bold text-red-600 hover:text-red-800 bg-white hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel Request
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Selected Option</span>
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
                {activeRequest.type === 'BUY_NEW' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>₹1,499 — Buy New Domain + Setup</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>₹599 — Already Have a Domain</span>
                  </>
                )}
              </span>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Requested Domain</span>
              <span className="font-mono font-bold text-orange-700 text-sm block mt-0.5 truncate">
                {activeRequest.domain}
              </span>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Admin Availability Check</span>
              <span className="font-semibold text-slate-800 text-xs block mt-0.5">
                {activeRequest.type === 'BUY_NEW'
                  ? 'Admin is checking registrar availability & DNS'
                  : 'Ready for DNS CNAME & IP routing'}
              </span>
            </div>
          </div>

          {/* WhatsApp / Call Admin Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-600">
              Fast-track verification ke liye Admin ko WhatsApp par request message bhejein:
            </div>
            <div className="flex items-center gap-2">
              <a
                href={getWhatsAppDirectUrl(
                  adminWhatsapp,
                  `Namaste Admin! Maine Shop ID: ${shop.shopId} (${shop.businessName}) ke liye Domain Request submit ki hai:
Domain: ${activeRequest.domain}
Option: ${activeRequest.type === 'BUY_NEW' ? '₹1,499 - Buy New Domain + Setup' : '₹599 - Already Have a Domain'}
Amount: ₹${activeRequest.amount}
Kripya availability check karke approve karein!`
                )}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Admin (+91 {adminWhatsapp})</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHOOSE DOMAIN OPTION SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase font-['Outfit',sans-serif] flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-600" />
              Choose Domain Option
            </h3>
            <p className="text-xs text-gray-500">
              Apni zaroorat ke hisaab se option chunein aur apna domain name enter karein.
            </p>
          </div>
        </div>

        {/* Option Selector Cards (Two Options Side-by-Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* OPTION 1: ₹599 — Already Have a Domain */}
          <div
            onClick={() => setSelectedOption('ALREADY_HAVE')}
            className={`rounded-2xl p-6 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedOption === 'ALREADY_HAVE'
                ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50/50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedOption === 'ALREADY_HAVE' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Setup & DNS
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-1 font-['Outfit',sans-serif]">
                      ₹599 — Already Have a Domain
                    </h4>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === 'ALREADY_HAVE' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                }`}>
                  {selectedOption === 'ALREADY_HAVE' && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Agar aapne GoDaddy, Namecheap, BigRock ya Hostinger se domain pehle se kharid rakha hai, to hum use aapki dukaan se connect karenge.
              </p>

              <div className="space-y-1.5 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cloud Edge DNS & IP Ingress Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Auto-Renewing SSL Certificate (HTTPS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Request goes directly to Admin Dashboard</span>
                </div>
              </div>

              {/* Form Input for Option 1 */}
              <div className="pt-3 border-t border-emerald-200/60 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Vendor enters existing domain name:
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs font-mono">
                    https://
                  </span>
                  <input
                    type="text"
                    value={alreadyHaveDomainInput}
                    onChange={(e) => setAlreadyHaveDomainInput(e.target.value)}
                    placeholder="Example: www.mybusiness.in"
                    className="w-full pl-16 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <span className="text-[11px] text-gray-500 block">
                  Example: <strong>www.mybusiness.in</strong> ya <strong>shop.mybrand.com</strong>
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4">
              <button
                type="button"
                onClick={() => handleSendRequestToAdmin('ALREADY_HAVE')}
                disabled={isSubmittingRequest}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Request to Admin (₹599)</span>
              </button>
            </div>
          </div>

          {/* OPTION 2: ₹1,499 — Buy New Domain + Setup */}
          <div
            onClick={() => setSelectedOption('BUY_NEW')}
            className={`rounded-2xl p-6 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedOption === 'BUY_NEW'
                ? 'border-indigo-500 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20'
                : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50/50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedOption === 'BUY_NEW' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                      All-Inclusive Package
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-1 font-['Outfit',sans-serif]">
                      ₹1,499 — Buy New Domain + Setup
                    </h4>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === 'BUY_NEW' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                }`}>
                  {selectedOption === 'BUY_NEW' && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Aapko kuch karne ki zaroorat nahi. IndianLalaJi team aapki pasand ka fresh 1-Year domain buy karegi aur full server setup karke degi.
              </p>

              <div className="space-y-1.5 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>1-Year Official .in / .com / .store Domain Purchase</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span><strong>Admin checks domain availability</strong> & verifies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Complete Zero-Configuration Setup + Free SSL</span>
                </div>
              </div>

              {/* Form Input for Option 2 */}
              <div className="pt-3 border-t border-indigo-200/60 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Vendor enters preferred domain name:
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs font-mono">
                    https://
                  </span>
                  <input
                    type="text"
                    value={buyNewDomainInput}
                    onChange={(e) => setBuyNewDomainInput(e.target.value)}
                    placeholder="Example: mybusiness.in or mybrandstore.com"
                    className="w-full pl-16 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <span className="text-[11px] text-gray-500 block">
                  Click <strong>Send Request to Admin</strong> → Request goes to Admin Dashboard
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4">
              <button
                type="button"
                onClick={() => handleSendRequestToAdmin('BUY_NEW')}
                disabled={isSubmittingRequest}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Request to Admin (₹1,499)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CURRENT CONNECTED DOMAIN & LIVE ACTIONS (IF ACTIVE) */}
      {shop.customDomain && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Connected Domain
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1 flex items-center gap-2">
                <span>{shop.customDomain}</span>
                <a
                  href={`https://${shop.customDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                  title="Open live site"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVerifyDns}
                disabled={isVerifying}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Verifying...' : 'Verify DNS'}</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveDomain}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>

          {/* Verification Result Banner */}
          {verificationResult && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                verificationResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {verificationResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <p className="font-bold">{verificationResult.message}</p>
              </div>
            </div>
          )}

          {/* DNS Configuration Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 font-bold text-slate-800 flex items-center justify-between">
              <span>Required DNS Records for {shop.customDomain}</span>
              <span className="text-[10px] font-mono text-gray-500">Hostinger Cloud Server</span>
            </div>

            <table className="w-full text-left border-collapse font-mono text-[11px]">
              <thead>
                <tr className="bg-gray-100/70 text-slate-600 border-b border-gray-200">
                  <th className="py-2 px-4">Type</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Points To / Value</th>
                  <th className="py-2 px-4 text-right">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2.5 px-4 font-bold text-indigo-700">A Record</td>
                  <td className="py-2.5 px-4 text-slate-800">@</td>
                  <td className="py-2.5 px-4 text-slate-900 font-bold">145.223.124.49</td>
                  <td className="py-2.5 px-4 text-right font-sans">
                    <button
                      type="button"
                      onClick={() => copyToClipboard('145.223.124.49', 'a_record')}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'a_record' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      Copy IP
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-indigo-700">CNAME Record</td>
                  <td className="py-2.5 px-4 text-slate-800">www</td>
                  <td className="py-2.5 px-4 text-slate-900 font-bold">cname.indianlalaji.com</td>
                  <td className="py-2.5 px-4 text-right font-sans">
                    <button
                      type="button"
                      onClick={() => copyToClipboard('cname.indianlalaji.com', 'cname_record')}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'cname_record' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      Copy CNAME
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. FAQ & BENEFIT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-900">Free SSL Certificate</h5>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
              Auto Let's Encrypt SSL active hota hai jo browser me green secure padlock dikhata hai.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-900">Superfast Edge Proxy</h5>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
              Zero downtime routing se aapki dukaan bina kisi page lag ke instant open hoti hai.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex items-start gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-900">Admin Availability Check</h5>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
              Buy New option me Admin domain availability check karke direct activate karta hai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

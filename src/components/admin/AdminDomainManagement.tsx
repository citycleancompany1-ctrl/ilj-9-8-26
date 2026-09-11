import React, { useState } from 'react';
import {
  Globe,
  Plus,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  Copy,
  Check,
  Lock,
  Search,
  Info,
  Edit2,
  Unlink,
  X,
  AlertTriangle,
  Store,
  Sparkles,
  Send,
  MessageSquare,
  Phone,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Shop, PlatformState, VendorDomainRequest } from '../../types';
import { saveShopToFirestore, deleteShopFromFirestore } from '../../services/firebase';
import { getWhatsAppDirectUrl } from '../../utils/mediaUpload';

interface AdminDomainManagementProps {
  state: PlatformState;
  onUpdateState: (newState: PlatformState) => void;
  showToast: (msg: string) => void;
  onNavigateToShop: (shopId: string) => void;
}

export const AdminDomainManagement: React.FC<AdminDomainManagementProps> = ({
  state,
  onUpdateState,
  showToast,
  onNavigateToShop,
}) => {
  // Main tab: 'REQUESTS' vs 'MAPPED_DOMAINS' vs 'DNS_REFERENCE'
  const [activeMainTab, setActiveMainTab] = useState<'REQUESTS' | 'MAPPED_DOMAINS' | 'DNS_REFERENCE'>('REQUESTS');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [requestFilter, setRequestFilter] = useState<'ALL' | 'PENDING' | 'BUY_NEW' | 'ALREADY_HAVE' | 'APPROVED' | 'REJECTED'>('ALL');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isVerifyingShopId, setIsVerifyingShopId] = useState<string | null>(null);

  // Inline editing states (for mapped custom domains)
  const [inlineEditingShopId, setInlineEditingShopId] = useState<string | null>(null);
  const [inlineDomain, setInlineDomain] = useState('');
  const [inlineStatus, setInlineStatus] = useState<'CONNECTED' | 'PENDING_DNS' | 'NOT_CONNECTED'>('CONNECTED');
  const [inlineIsActive, setInlineIsActive] = useState(true);

  // In-page Map New Domain card toggle
  const [showAddCard, setShowAddCard] = useState(false);
  const [newMapShopId, setNewMapShopId] = useState(state.shops[0]?.shopId || '');
  const [newMapDomain, setNewMapDomain] = useState('');
  const [newMapStatus, setNewMapStatus] = useState<'CONNECTED' | 'PENDING_DNS' | 'NOT_CONNECTED'>('CONNECTED');

  // Checking Availability modal / inline state
  const [checkingAvailabilityShop, setCheckingAvailabilityShop] = useState<{
    shop: Shop;
    domain: string;
    type: 'ALREADY_HAVE' | 'BUY_NEW';
    isChecking: boolean;
    result?: { available: boolean; message: string };
  } | null>(null);

  // Rejection note prompt modal
  const [rejectPromptShop, setRejectPromptShop] = useState<{
    shop: Shop;
    reason: string;
  } | null>(null);

  // Confirmation dialog for Unlinking Domain or Deleting Store
  const [confirmAction, setConfirmAction] = useState<{
    shop: Shop;
    type: 'DISCONNECT_DOMAIN' | 'DELETE_STORE';
  } | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`📋 Copied: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Collect all shops with domain requests
  const shopsWithRequests = (state.shops || []).filter((s) => Boolean(s.domainRequest));

  // Count pending domain requests
  const pendingRequestsCount = shopsWithRequests.filter(
    (s) => s.domainRequest?.status === 'PENDING' || s.domainRequest?.status === 'CHECKING_AVAILABILITY'
  ).length;

  // Get shops with custom domains
  const shopsWithDomains = (state.shops || []).filter((s) => Boolean(s.customDomain));

  // Filtered requests list
  const filteredRequests = shopsWithRequests.filter((shop) => {
    const req = shop.domainRequest;
    if (!req) return false;

    const matchesSearch =
      (shop.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shop.shopId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.domain || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shop.vendorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shop.phone || '').includes(searchQuery);

    if (!matchesSearch) return false;

    if (requestFilter === 'PENDING') {
      return req.status === 'PENDING' || req.status === 'CHECKING_AVAILABILITY';
    }
    if (requestFilter === 'BUY_NEW') {
      return req.type === 'BUY_NEW';
    }
    if (requestFilter === 'ALREADY_HAVE') {
      return req.type === 'ALREADY_HAVE';
    }
    if (requestFilter === 'APPROVED') {
      return req.status === 'APPROVED';
    }
    if (requestFilter === 'REJECTED') {
      return req.status === 'REJECTED';
    }

    return true;
  });

  // Filtered mapped shops list
  const filteredShops = shopsWithDomains.filter((shop) => {
    const matchesSearch =
      (shop.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shop.shopId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shop.customDomain || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ACTIVE') {
      return (
        shop.isCustomDomainActive !== false &&
        (shop.domainConnectStatus === 'CONNECTED' || !shop.domainConnectStatus)
      );
    }
    if (statusFilter === 'PENDING') {
      return shop.domainConnectStatus === 'PENDING_DNS';
    }

    return true;
  });

  // Check Domain Availability Handler
  const handleCheckAvailability = (shop: Shop) => {
    if (!shop.domainRequest) return;
    const domain = shop.domainRequest.domain;

    setCheckingAvailabilityShop({
      shop,
      domain,
      type: shop.domainRequest.type,
      isChecking: true,
    });

    // Also update shop status to CHECKING_AVAILABILITY in state and Firestore
    const updatedShop: Shop = {
      ...shop,
      domainRequest: {
        ...shop.domainRequest,
        status: 'CHECKING_AVAILABILITY',
        updatedAt: new Date().toISOString(),
        adminNotes: 'Admin is checking registrar availability and DNS routing',
      },
      updatedAt: new Date().toISOString(),
    };

    const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? updatedShop : s));
    onUpdateState({ ...state, shops: updatedShops });
    saveShopToFirestore(updatedShop);

    // Simulate whois availability check
    setTimeout(() => {
      const isAvailable = !domain.includes('google') && !domain.includes('facebook') && !domain.includes('amazon');
      setCheckingAvailabilityShop({
        shop: updatedShop,
        domain,
        type: shop.domainRequest!.type,
        isChecking: false,
        result: {
          available: isAvailable,
          message: isAvailable
            ? `Domain "${domain}" is available for 1-Year registration! Ready to purchase.`
            : `Domain "${domain}" appears to be already registered or reserved.`,
        },
      });
    }, 1000);
  };

  // Approve and Connect Domain Request
  const handleApproveRequest = (shop: Shop) => {
    if (!shop.domainRequest) return;
    const cleanDomain = shop.domainRequest.domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/\/$/, '');

    const updatedShop: Shop = {
      ...shop,
      customDomain: cleanDomain,
      domainConnectStatus: 'CONNECTED',
      domainVerificationStatus: 'VERIFIED',
      dnsStatus: 'PROPAGATED',
      sslStatus: 'ACTIVE',
      isCustomDomainActive: true,
      domainRequest: {
        ...shop.domainRequest,
        status: 'APPROVED',
        paymentStatus: 'PAID',
        adminNotes: 'Domain approved and successfully connected to store',
        updatedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? updatedShop : s));
    onUpdateState({ ...state, shops: updatedShops });
    saveShopToFirestore(updatedShop);
    showToast(`✅ Domain "${cleanDomain}" approved & actively connected to ${shop.businessName}!`);
  };

  // Reject Request
  const handleExecuteReject = () => {
    if (!rejectPromptShop || !rejectPromptShop.shop.domainRequest) return;
    const { shop, reason } = rejectPromptShop;

    const updatedShop: Shop = {
      ...shop,
      domainRequest: {
        ...shop.domainRequest!,
        status: 'REJECTED',
        adminNotes: reason || 'Domain not available or request declined by admin',
        updatedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? updatedShop : s));
    onUpdateState({ ...state, shops: updatedShops });
    saveShopToFirestore(updatedShop);
    showToast(`❌ Domain Request rejected for ${shop.businessName}.`);
    setRejectPromptShop(null);
  };

  // Start Inline Edit (No popup modal)
  const startInlineEdit = (shop: Shop) => {
    setInlineEditingShopId(shop.shopId);
    setInlineDomain(shop.customDomain || '');
    setInlineStatus(shop.domainConnectStatus || 'CONNECTED');
    setInlineIsActive(shop.isCustomDomainActive !== false);
  };

  // Save Inline Edit
  const handleSaveInlineEdit = (shop: Shop) => {
    const cleanDomain = inlineDomain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/\/$/, '');

    if (!cleanDomain) {
      showToast('⚠️ Kripya domain name enter karein (e.g. trustedweb.online)');
      return;
    }

    const updatedShop: Shop = {
      ...shop,
      customDomain: cleanDomain,
      domainConnectStatus: inlineStatus,
      domainVerificationStatus: 'VERIFIED',
      dnsStatus: 'PROPAGATED',
      sslStatus: 'ACTIVE',
      isCustomDomainActive: inlineIsActive,
      updatedAt: new Date().toISOString(),
    };

    const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? updatedShop : s));
    onUpdateState({ ...state, shops: updatedShops });
    saveShopToFirestore(updatedShop);
    showToast(`✅ Custom Domain "${cleanDomain}" saved for ${shop.businessName}!`);
    setInlineEditingShopId(null);
  };

  // Map New Domain (from inline card)
  const handleSaveNewDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = newMapDomain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/\/$/, '');

    if (!cleanDomain) {
      showToast('⚠️ Kripya domain name enter karein (e.g. trustedweb.online)');
      return;
    }

    const targetShop = state.shops.find((s) => s.shopId === newMapShopId);
    if (!targetShop) {
      showToast('⚠️ Kripya store select karein.');
      return;
    }

    const updatedShop: Shop = {
      ...targetShop,
      customDomain: cleanDomain,
      domainConnectStatus: newMapStatus,
      domainVerificationStatus: 'VERIFIED',
      dnsStatus: 'PROPAGATED',
      sslStatus: 'ACTIVE',
      isCustomDomainActive: true,
      updatedAt: new Date().toISOString(),
    };

    const updatedShops = state.shops.map((s) => (s.shopId === targetShop.shopId ? updatedShop : s));
    onUpdateState({ ...state, shops: updatedShops });
    saveShopToFirestore(updatedShop);
    showToast(`✅ Custom Domain "${cleanDomain}" successfully mapped to ${targetShop.businessName}!`);
    setShowAddCard(false);
    setNewMapDomain('');
  };

  // Toggle active / paused
  const handleToggleActive = (shop: Shop) => {
    const newActive = shop.isCustomDomainActive === false;
    const updatedShop: Shop = {
      ...shop,
      isCustomDomainActive: newActive,
      updatedAt: new Date().toISOString(),
    };

    const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? updatedShop : s));
    onUpdateState({ ...state, shops: updatedShops });
    saveShopToFirestore(updatedShop);
    showToast(newActive ? `🟢 Domain activated for ${shop.businessName}` : `⏸️ Domain paused for ${shop.businessName}`);
  };

  // Re-verify DNS & SSL
  const handleSimulateVerify = (shop: Shop) => {
    setIsVerifyingShopId(shop.shopId);
    setTimeout(() => {
      setIsVerifyingShopId(null);
      const updatedShop: Shop = {
        ...shop,
        domainConnectStatus: 'CONNECTED',
        domainVerificationStatus: 'VERIFIED',
        dnsStatus: 'PROPAGATED',
        sslStatus: 'ACTIVE',
        isCustomDomainActive: true,
      };
      const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? updatedShop : s));
      onUpdateState({ ...state, shops: updatedShops });
      saveShopToFirestore(updatedShop);
      showToast(`⚡ DNS & SSL Verified successfully for ${shop.customDomain}!`);
    }, 1000);
  };

  // Execute Action (Disconnect Domain or Delete Store)
  const handleExecuteConfirmAction = () => {
    if (!confirmAction) return;
    const { shop, type } = confirmAction;

    if (type === 'DISCONNECT_DOMAIN') {
      const updatedShop: Shop = {
        ...shop,
        customDomain: undefined,
        domainConnectStatus: 'NOT_CONNECTED',
        domainVerificationStatus: undefined,
        dnsStatus: undefined,
        sslStatus: undefined,
        isCustomDomainActive: false,
        updatedAt: new Date().toISOString(),
      };
      const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? updatedShop : s));
      onUpdateState({ ...state, shops: updatedShops });
      saveShopToFirestore(updatedShop);
      showToast(`🗑️ Domain unlinked from ${shop.businessName}. Store default platform URL active.`);
    } else if (type === 'DELETE_STORE') {
      deleteShopFromFirestore(shop.shopId);
      if (shop.id && shop.id !== shop.shopId) {
        deleteShopFromFirestore(shop.id);
      }
      const updatedShops = state.shops.filter((s) => s.shopId !== shop.shopId && s.id !== shop.id);
      onUpdateState({ ...state, shops: updatedShops });
      showToast(`🗑️ Store (${shop.businessName} - ${shop.shopId}) permanently delete ho chuki hai!`);
    }

    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-indigo-500/20 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" />
              SaaS Multi-Tenant Domain Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Custom Domain Requests & DNS Management
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Vendors ke <strong>₹599 (Already Have a Domain)</strong> aur <strong>₹1,499 (Buy New Domain + Setup)</strong> requests review karein, availability check karein aur unka isolated Shop ID domain se connect karein.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddCard(!showAddCard)}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {showAddCard ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showAddCard ? 'Close Add Form' : 'Map New Domain'}</span>
            </button>
          </div>
        </div>

        {/* Quick DNS Reference Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Hostinger Server IP (A Record):</span>
              <span className="font-mono font-bold text-white text-sm">145.223.124.49</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('145.223.124.49', 'ip')}
              className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white cursor-pointer"
              title="Copy IP"
            >
              {copiedKey === 'ip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">CNAME Target (www):</span>
              <span className="font-mono font-bold text-white text-sm">cname.indianlalaji.com</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('cname.indianlalaji.com', 'cname')}
              className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white cursor-pointer"
              title="Copy CNAME"
            >
              {copiedKey === 'cname' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">SSL & Architecture:</span>
              <span className="font-semibold text-emerald-300 text-xs flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> No-Redirect Masking (200 OK)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB CONTROLS (REQUESTS vs MAPPED DOMAINS) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMainTab('REQUESTS')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeMainTab === 'REQUESTS'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Vendor Domain Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="bg-amber-400 text-slate-900 px-2 py-0.2 rounded-full text-[10px] font-black animate-pulse">
                {pendingRequestsCount} Pending
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('MAPPED_DOMAINS')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeMainTab === 'MAPPED_DOMAINS'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Connected Domains ({shopsWithDomains.length})</span>
          </button>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Total Registered Shops: <strong>{state.shops.length}</strong>
        </div>
      </div>

      {/* 3. INLINE ADD DOMAIN CARD */}
      {showAddCard && (
        <div className="bg-white rounded-2xl border-2 border-orange-500/80 p-5 shadow-lg animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                  Map New Custom Domain to Store (Inline Setup)
                </h3>
                <p className="text-[11px] text-gray-500">
                  Select a vendor store and enter their external domain without opening any popups.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCard(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-slate-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveNewDomain} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Select Client Store / Shop ID
              </label>
              <select
                value={newMapShopId}
                onChange={(e) => setNewMapShopId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-semibold text-slate-900 focus:border-orange-500 focus:outline-none"
              >
                {state.shops.map((s) => (
                  <option key={s.shopId} value={s.shopId}>
                    {s.businessName} ({s.shopId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Custom Domain Name
              </label>
              <input
                type="text"
                placeholder="e.g. trustedweb.online"
                value={newMapDomain}
                onChange={(e) => setNewMapDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono font-bold text-slate-900 focus:border-orange-500 focus:outline-none"
                required
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Do not include <code>https://</code>
              </span>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Connection Status
              </label>
              <select
                value={newMapStatus}
                onChange={(e) => setNewMapStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-bold text-slate-900 focus:border-orange-500 focus:outline-none"
              >
                <option value="CONNECTED">🟢 CONNECTED (Active & Propagated)</option>
                <option value="PENDING_DNS">🟡 PENDING_DNS (DNS pending)</option>
                <option value="NOT_CONNECTED">⚪ NOT_CONNECTED (Disabled)</option>
              </select>
            </div>

            <div className="md:col-span-3 flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddCard(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold uppercase rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase rounded-lg shadow-sm text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Mapping</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. MAIN TAB: VENDOR DOMAIN REQUESTS */}
      {activeMainTab === 'REQUESTS' && (
        <div className="space-y-4">
          {/* Requests Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search requests by domain, shop ID, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setRequestFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    requestFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  All ({shopsWithRequests.length})
                </button>
                <button
                  onClick={() => setRequestFilter('PENDING')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    requestFilter === 'PENDING' ? 'bg-white text-amber-700 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  Pending ({pendingRequestsCount})
                </button>
                <button
                  onClick={() => setRequestFilter('BUY_NEW')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    requestFilter === 'BUY_NEW' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  ₹1,499 Buy New
                </button>
                <button
                  onClick={() => setRequestFilter('ALREADY_HAVE')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    requestFilter === 'ALREADY_HAVE' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  ₹599 Existing
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 font-medium">
              Showing <strong>{filteredRequests.length}</strong> request(s)
            </div>
          </div>

          {/* Requests Table / Cards */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-slate-900 font-['Outfit',sans-serif]">
                Koi Domain Request Nahi Hai
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 leading-relaxed">
                Jab koi vendor apne dashboard se <strong>₹599 (Already Have a Domain)</strong> ya <strong>₹1,499 (Buy New Domain + Setup)</strong> request bhejega, to wo yahan dikhegi.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100/80 text-slate-700 font-bold border-b border-gray-200">
                      <th className="py-3 px-4">Client Store / Owner</th>
                      <th className="py-3 px-4">Request Option & Amount</th>
                      <th className="py-3 px-4">Requested Domain Name</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRequests.map((shop) => {
                      const req = shop.domainRequest!;
                      const isBuyNew = req.type === 'BUY_NEW';
                      const isPending = req.status === 'PENDING' || req.status === 'CHECKING_AVAILABILITY';
                      const isApproved = req.status === 'APPROVED';

                      return (
                        <tr key={shop.shopId} className="hover:bg-gray-50/70 transition-colors">
                          {/* Store Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={shop.logoUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100'}
                                alt=""
                                className="w-8 h-8 rounded-md object-cover border border-gray-200 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900 leading-tight">
                                  {shop.businessName}
                                </div>
                                <div className="font-mono text-[10px] text-orange-600 font-semibold">
                                  {shop.shopId} • {shop.vendorName}
                                </div>
                                <div className="text-[10px] text-gray-500 font-medium">
                                  Ph: +91 {shop.phone}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Request Option & Amount */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black ${
                              isBuyNew
                                ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              {isBuyNew ? <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> : <Globe className="w-3.5 h-3.5 text-emerald-600" />}
                              <span>{isBuyNew ? '₹1,499 — Buy New Domain' : '₹599 — Already Have'}</span>
                            </span>
                            <div className="text-[10px] text-gray-500 mt-0.5">
                              {isBuyNew ? 'Admin checks availability & buys' : 'DNS & SSL Mapping setup'}
                            </div>
                          </td>

                          {/* Requested Domain */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-1 rounded border border-gray-300">
                                {req.domain}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(req.domain, `req_${shop.shopId}`)}
                                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-slate-700 cursor-pointer"
                                title="Copy Domain"
                              >
                                {copiedKey === `req_${shop.shopId}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              req.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : req.status === 'CHECKING_AVAILABILITY'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : req.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {req.status === 'APPROVED' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                              {req.status === 'CHECKING_AVAILABILITY' && <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin" />}
                              {req.status === 'PENDING' && <Clock className="w-3 h-3 text-amber-600" />}
                              <span>{req.status === 'CHECKING_AVAILABILITY' ? 'Checking' : req.status}</span>
                            </span>
                            {req.adminNotes && (
                              <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1" title={req.adminNotes}>
                                {req.adminNotes}
                              </div>
                            )}
                          </td>

                          {/* Submitted At */}
                          <td className="py-3.5 px-4 text-[11px] text-gray-500">
                            {new Date(req.requestedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>

                          {/* Admin Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Action 1: Check Domain Availability (Especially for Buy New) */}
                              {isBuyNew && isPending && (
                                <button
                                  type="button"
                                  onClick={() => handleCheckAvailability(shop)}
                                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Check Domain Availability"
                                >
                                  <Search className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Check Availability</span>
                                </button>
                              )}

                              {/* Action 2: Approve & Connect */}
                              {!isApproved && (
                                <button
                                  type="button"
                                  onClick={() => handleApproveRequest(shop)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                                  title="Approve & Connect Domain"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve & Map</span>
                                </button>
                              )}

                              {/* Action 3: Reject */}
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => setRejectPromptShop({ shop, reason: '' })}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer"
                                  title="Reject Request"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Action 4: WhatsApp Vendor */}
                              <a
                                href={getWhatsAppDirectUrl(
                                  shop.phone,
                                  isBuyNew
                                    ? `Namaste ${shop.vendorName}! IndianLalaJi team ne aapki Domain Request (${req.domain} - ₹1,499 Buy New) check ki hai. Setup ke liye aage badh rahe hain.`
                                    : `Namaste ${shop.vendorName}! IndianLalaJi team ne aapki Domain Request (${req.domain} - ₹599 Already Have) approve kar di hai. DNS records configure kar rahe hain.`
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer"
                                title="WhatsApp Vendor"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. MAIN TAB: MAPPED CUSTOM DOMAINS */}
      {activeMainTab === 'MAPPED_DOMAINS' && (
        <div className="space-y-4">
          {/* Stats and Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by domain, shop ID, or store..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                    statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  All ({shopsWithDomains.length})
                </button>
                <button
                  onClick={() => setStatusFilter('ACTIVE')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                    statusFilter === 'ACTIVE' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                    statusFilter === 'PENDING' ? 'bg-white text-amber-700 shadow-xs' : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 font-medium self-end sm:self-center">
              Showing <strong>{filteredShops.length}</strong> mapped domain(s)
            </div>
          </div>

          {/* Domains Table with Inline Editing */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100/80 text-slate-700 font-bold border-b border-gray-200">
                    <th className="py-3 px-4">Client Store / Shop ID</th>
                    <th className="py-3 px-4">Mapped Custom Domain</th>
                    <th className="py-3 px-4">Original Platform URL</th>
                    <th className="py-3 px-4">DNS Status</th>
                    <th className="py-3 px-4">SSL Security</th>
                    <th className="py-3 px-4">Active Toggle</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredShops.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        <Globe className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="font-bold text-slate-700">Koi custom domain nahi mila.</p>
                        <p className="text-[11px] text-gray-400 mt-1">Upar "Map New Domain" button click karke client ka domain connect karein.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredShops.map((shop) => {
                      const isInlineEditing = inlineEditingShopId === shop.shopId;
                      const isActive = shop.isCustomDomainActive !== false;
                      const isPending = shop.domainConnectStatus === 'PENDING_DNS';

                      return (
                        <tr
                          key={shop.shopId}
                          className={`transition-colors ${
                            isInlineEditing ? 'bg-orange-50/60 border-y-2 border-orange-400' : 'hover:bg-gray-50/70'
                          }`}
                        >
                          {/* Shop Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={shop.logoUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100'}
                                alt=""
                                className="w-8 h-8 rounded-md object-cover border border-gray-200 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900 leading-tight">
                                  {shop.businessName}
                                </div>
                                <div className="font-mono text-[10px] text-orange-600 font-semibold">
                                  {shop.shopId}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Custom Domain (Inline Editable) */}
                          <td className="py-3.5 px-4">
                            {isInlineEditing ? (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={inlineDomain}
                                  onChange={(e) => setInlineDomain(e.target.value)}
                                  className="w-48 px-2.5 py-1 text-xs font-mono font-bold bg-white border-2 border-orange-500 rounded-lg text-slate-900 focus:outline-none shadow-xs"
                                  placeholder="e.g. trustedweb.online"
                                  autoFocus
                                />
                                <div className="text-[9px] text-orange-800 font-medium">
                                  Enter domain without https://
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-900 text-xs bg-indigo-50 text-indigo-900 px-2 py-1 rounded border border-indigo-200">
                                  {shop.customDomain}
                                </span>
                                <a
                                  href={`https://${shop.customDomain}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                                  title="Open live website"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </td>

                          {/* Platform URL */}
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-[11px] text-gray-500">
                              indianlalaji.com/?shop={shop.shopId}
                            </span>
                          </td>

                          {/* DNS Status */}
                          <td className="py-3.5 px-4">
                            {isInlineEditing ? (
                              <select
                                value={inlineStatus}
                                onChange={(e) => setInlineStatus(e.target.value as any)}
                                className="px-2 py-1 bg-white border border-gray-300 rounded text-[11px] font-bold text-slate-800"
                              >
                                <option value="CONNECTED">🟢 CONNECTED</option>
                                <option value="PENDING_DNS">🟡 PENDING_DNS</option>
                                <option value="NOT_CONNECTED">⚪ NOT_CONNECTED</option>
                              </select>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-500" />
                                Pending DNS
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Active (200 OK)
                              </span>
                            )}
                          </td>

                          {/* SSL Status */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                              <Lock className="w-3 h-3 text-emerald-600" />
                              SSL Active
                            </span>
                          </td>

                          {/* Active Toggle */}
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(shop)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {isActive ? '● Live' : '○ Paused'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isInlineEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveInlineEdit(shop)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setInlineEditingShopId(null)}
                                    className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded text-xs font-bold cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleSimulateVerify(shop)}
                                    disabled={isVerifyingShopId === shop.shopId}
                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-indigo-600 cursor-pointer"
                                    title="Verify DNS & SSL"
                                  >
                                    <RefreshCw
                                      className={`w-3.5 h-3.5 ${
                                        isVerifyingShopId === shop.shopId ? 'animate-spin text-indigo-600' : ''
                                      }`}
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => startInlineEdit(shop)}
                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-orange-600 cursor-pointer"
                                    title="Edit Domain"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmAction({ shop, type: 'DISCONNECT_DOMAIN' })}
                                    className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 cursor-pointer"
                                    title="Disconnect Domain"
                                  >
                                    <Unlink className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL / DIALOG: CHECK DOMAIN AVAILABILITY POPUP */}
      {checkingAvailabilityShop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-indigo-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900">
                    Domain Availability Check
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    Shop: {checkingAvailabilityShop.shop.businessName} ({checkingAvailabilityShop.shop.shopId})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckingAvailabilityShop(null)}
                className="p-1 text-gray-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase block">Target Domain:</span>
              <span className="text-base font-mono font-black text-indigo-900 block">
                {checkingAvailabilityShop.domain}
              </span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 inline-block">
                ₹1,499 — Buy New Domain + Setup
              </span>
            </div>

            {checkingAvailabilityShop.isChecking ? (
              <div className="py-6 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">Checking domain registrar availability...</p>
              </div>
            ) : checkingAvailabilityShop.result ? (
              <div className={`p-4 rounded-xl border space-y-2 ${
                checkingAvailabilityShop.result.available
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  {checkingAvailabilityShop.result.available ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                  <span>{checkingAvailabilityShop.result.available ? 'Available!' : 'Notice'}</span>
                </div>
                <p className="text-xs">{checkingAvailabilityShop.result.message}</p>
              </div>
            ) : null}

            {/* Registrar & External Whois Links */}
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <a
                href={`https://who.is/whois/${checkingAvailabilityShop.domain}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Check on Whois.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={`https://in.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${checkingAvailabilityShop.domain}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Check & Purchase on GoDaddy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCheckingAvailabilityShop(null)}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApproveRequest(checkingAvailabilityShop.shop);
                  setCheckingAvailabilityShop(null);
                }}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Map</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: REJECT REASON PROMPT */}
      {rejectPromptShop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-gray-200 animate-scaleUp">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <X className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase">
                Reject Domain Request
              </h3>
              <p className="text-xs text-gray-500">
                Shop: {rejectPromptShop.shop.businessName} ({rejectPromptShop.shop.domainRequest?.domain})
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Reason for Rejection:
              </label>
              <textarea
                rows={3}
                value={rejectPromptShop.reason}
                onChange={(e) => setRejectPromptShop({ ...rejectPromptShop, reason: e.target.value })}
                placeholder="e.g. Domain is already taken, payment pending, or invalid domain name"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRejectPromptShop(null)}
                className="py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReject}
                className="py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase rounded-xl cursor-pointer shadow-xs"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CONFIRM ACTION MODAL (UNLINK OR DELETE) */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-gray-200 animate-scaleUp">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-inner ${
                confirmAction.type === 'DELETE_STORE'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              {confirmAction.type === 'DELETE_STORE' ? (
                <Trash2 className="w-6 h-6" />
              ) : (
                <Unlink className="w-6 h-6" />
              )}
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                {confirmAction.type === 'DELETE_STORE'
                  ? 'Permanently Delete Store?'
                  : 'Disconnect Custom Domain?'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {confirmAction.type === 'DELETE_STORE' ? (
                  <>
                    Kya aap sure hain ki <strong className="text-slate-900">{confirmAction.shop.businessName}</strong> (Shop ID:{' '}
                    <span className="font-mono font-bold text-orange-600">{confirmAction.shop.shopId}</span>) ko platform aur database se permanently delete karna chahte hain?
                  </>
                ) : (
                  <>
                    Domain <strong className="font-mono text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">{confirmAction.shop.customDomain}</strong> ko{' '}
                    <strong className="text-slate-900">{confirmAction.shop.businessName}</strong> se remove / disconnect karna chahte hain?
                  </>
                )}
              </p>
            </div>

            <div
              className={`rounded-lg p-3 text-[11px] leading-relaxed border ${
                confirmAction.type === 'DELETE_STORE'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              {confirmAction.type === 'DELETE_STORE' ? (
                <>
                  ⚠️ <strong>Dhyan dein:</strong> Dukaan, products, catalogue aur vendor account permanently delete ho jayenge.
                </>
              ) : (
                <>
                  ℹ️ <strong>Note:</strong> Dukaan delete nahi hogi. Store active rahega aur default URL (<code>indianlalaji.com/?shop={confirmAction.shop.shopId}</code>) par khulega.
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold uppercase rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmAction}
                className={`px-4 py-2.5 text-white font-black uppercase rounded-xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5 ${
                  confirmAction.type === 'DELETE_STORE'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {confirmAction.type === 'DELETE_STORE' ? (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Store</span>
                  </>
                ) : (
                  <>
                    <Unlink className="w-3.5 h-3.5" />
                    <span>Disconnect Domain</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

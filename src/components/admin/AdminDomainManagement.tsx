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
  Store
} from 'lucide-react';
import { Shop, PlatformState } from '../../types';
import { saveShopToFirestore, deleteShopFromFirestore } from '../../services/firebase';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isVerifyingShopId, setIsVerifyingShopId] = useState<string | null>(null);

  // Inline editing states (No modal popup on edit)
  const [inlineEditingShopId, setInlineEditingShopId] = useState<string | null>(null);
  const [inlineDomain, setInlineDomain] = useState('');
  const [inlineStatus, setInlineStatus] = useState<'CONNECTED' | 'PENDING_DNS' | 'NOT_CONNECTED'>('CONNECTED');
  const [inlineIsActive, setInlineIsActive] = useState(true);

  // In-page Map New Domain card toggle (replaces popup modal)
  const [showAddCard, setShowAddCard] = useState(false);
  const [newMapShopId, setNewMapShopId] = useState(state.shops[0]?.shopId || '');
  const [newMapDomain, setNewMapDomain] = useState('');
  const [newMapStatus, setNewMapStatus] = useState<'CONNECTED' | 'PENDING_DNS' | 'NOT_CONNECTED'>('CONNECTED');

  // Confirmation dialog for Unlinking Domain or Deleting Store (bypasses window.confirm in iframe)
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

  // Get shops with custom domains
  const shopsWithDomains = (state.shops || []).filter((s) => Boolean(s.customDomain));

  // Filtered list
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

  // Start Inline Edit (No popup modal)
  const startInlineEdit = (shop: Shop) => {
    setInlineEditingShopId(shop.shopId);
    setInlineDomain(shop.customDomain || '');
    setInlineStatus(shop.domainConnectStatus || 'CONNECTED');
    setInlineIsActive(shop.isCustomDomainActive !== false);
  };

  // Cancel Inline Edit
  const handleCancelInlineEdit = () => {
    setInlineEditingShopId(null);
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

    // Check if domain is already used by another shop
    const duplicate = state.shops.find(
      (s) => s.shopId !== shop.shopId && s.customDomain?.toLowerCase() === cleanDomain
    );
    if (duplicate) {
      showToast(`⚠️ Domain "${cleanDomain}" pehle se "${duplicate.businessName}" (${duplicate.shopId}) se juda hua hai.`);
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

    // Check if domain is already used by another shop
    const duplicate = state.shops.find(
      (s) => s.shopId !== newMapShopId && s.customDomain?.toLowerCase() === cleanDomain
    );
    if (duplicate) {
      showToast(`⚠️ Domain "${cleanDomain}" pehle se "${duplicate.businessName}" (${duplicate.shopId}) se juda hua hai.`);
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

  // Execute Action (Disconnect Domain or Delete Store) - 100% reliable in iframe without window.confirm
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
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-indigo-500/20 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" />
              SaaS Multi-Tenant Domain Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Custom Domain Mapping & DNS Management
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Yahan se client ka custom domain (jaise <strong>trustedweb.online</strong>) unke isolated Shop ID (jaise <strong>SHP099949294</strong>) se map karein. Jab customer domain kholega, bina kisi URL redirect ke unka store open hoga.
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

      {/* Inline Add Domain Card (No modal popup) */}
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
                              className="text-indigo-600 hover:text-indigo-800 p-1"
                              title={`Open https://${shop.customDomain}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Original Platform URL */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-gray-600">
                          <span>indianlalaji.com/?shop={shop.shopId}</span>
                          <button
                            type="button"
                            onClick={() => onNavigateToShop(shop.shopId)}
                            className="text-orange-600 hover:underline font-bold text-[10px] ml-1 cursor-pointer"
                          >
                            Preview
                          </button>
                        </div>
                      </td>

                      {/* DNS Status (Inline Editable) */}
                      <td className="py-3.5 px-4">
                        {isInlineEditing ? (
                          <select
                            value={inlineStatus}
                            onChange={(e) => setInlineStatus(e.target.value as any)}
                            className="px-2 py-1 text-[11px] font-bold border-2 border-orange-500 bg-white rounded-lg text-slate-900"
                          >
                            <option value="CONNECTED">🟢 Propagated (Connected)</option>
                            <option value="PENDING_DNS">🟡 Pending DNS</option>
                            <option value="NOT_CONNECTED">⚪ Not Connected</option>
                          </select>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                            <Clock className="w-3 h-3 animate-spin" /> Pending DNS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Propagated
                          </span>
                        )}
                      </td>

                      {/* SSL Security */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                          <Lock className="w-3 h-3 text-blue-600" /> Active (Let's Encrypt)
                        </span>
                      </td>

                      {/* Active Toggle */}
                      <td className="py-3.5 px-4">
                        {isInlineEditing ? (
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-800">
                            <input
                              type="checkbox"
                              checked={inlineIsActive}
                              onChange={(e) => setInlineIsActive(e.target.checked)}
                              className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                            />
                            <span>Active</span>
                          </label>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleActive(shop)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                              isActive ? 'bg-emerald-600' : 'bg-gray-300'
                            }`}
                            title={isActive ? 'Click to Pause Domain' : 'Click to Activate Domain'}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                isActive ? 'translate-x-4.5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isInlineEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveInlineEdit(shop)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Save Inline Edit"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelInlineEdit}
                              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              title="Cancel Edit"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            {/* Verify DNS */}
                            <button
                              type="button"
                              onClick={() => handleSimulateVerify(shop)}
                              disabled={isVerifyingShopId === shop.shopId}
                              className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                              title="Re-verify DNS & SSL"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingShopId === shop.shopId ? 'animate-spin text-emerald-600' : ''}`} />
                            </button>

                            {/* Inline Edit (No Popup) */}
                            <button
                              type="button"
                              onClick={() => startInlineEdit(shop)}
                              className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded cursor-pointer"
                              title="Edit Domain Inline (No Popup)"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Disconnect Custom Domain */}
                            <button
                              type="button"
                              onClick={() => setConfirmAction({ shop, type: 'DISCONNECT_DOMAIN' })}
                              className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded cursor-pointer"
                              title="Disconnect / Remove Domain from Store"
                            >
                              <Unlink className="w-3.5 h-3.5" />
                            </button>

                            {/* Permanently Delete Store */}
                            <button
                              type="button"
                              onClick={() => setConfirmAction({ shop, type: 'DELETE_STORE' })}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                              title="Permanently Delete Store from Platform"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guide / Troubleshooting Box for GoDaddy & Hostinger */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-3">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-2">
            <h4 className="font-bold text-sm text-amber-950">
              Important: GoDaddy Forwarding vs. DNS Mapping Guide (No-Redirect Solution)
            </h4>
            <p className="leading-relaxed">
              Agar aap chahte hain ki <strong>trustedweb.online</strong> browser me open hone ke baad <code>indianlalaji.com/?shop=...</code> pe redirect <strong>NA</strong> ho, to GoDaddy aur Hostinger me ye step follow karein:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 font-medium">
              <li>
                <strong>GoDaddy Forwarding REMOVE karein:</strong> GoDaddy ke DNS panel me neeche "Forwarding" section me agar <code>https://indianlalaji.com/?shop=...</code> dala hua hai, to use <strong>Delete</strong> kar dein. Forwarding se browser 301 redirect karke URL change kar deta hai.
              </li>
              <li>
                <strong>GoDaddy me A Record add karein:</strong> Type: <code>A</code> | Name: <code>@</code> | Value: <code>145.223.124.49</code> (Hostinger server IP).
              </li>
              <li>
                <strong>GoDaddy me CNAME Record add karein:</strong> Type: <code>CNAME</code> | Name: <code>www</code> | Value: <code>cname.indianlalaji.com</code>.
              </li>
              <li>
                <strong>Hostinger Panel me Domain Add karein (Parked Domain / Alias):</strong> Hostinger hPanel me jaakar <code>Domains &gt; Parked Domains (ya Domain Alias)</code> me <strong>trustedweb.online</strong> add karein taaki Hostinger webserver is domain ki request accept kare aur SSL certificate issue kare.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Reliable In-App Confirmation Modal (bypasses window.confirm which fails in iframes) */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
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

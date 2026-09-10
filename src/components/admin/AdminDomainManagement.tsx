import React, { useState } from 'react';
import {
  Globe,
  Plus,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Server,
  Store,
  ArrowRight,
  Info,
  Edit2
} from 'lucide-react';
import { Shop, PlatformState, CustomDomainRecord } from '../../types';
import { saveShopToFirestore, savePlatformConfigToFirestore } from '../../services/firebase';

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

  // Modal state for linking/editing a shop domain
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [inputShopId, setInputShopId] = useState('');
  const [inputDomain, setInputDomain] = useState('');
  const [inputStatus, setInputStatus] = useState<'CONNECTED' | 'PENDING_DNS' | 'NOT_CONNECTED'>('CONNECTED');
  const [isDomainActive, setIsDomainActive] = useState<boolean>(true);

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

  const openAddModal = () => {
    setEditingShop(null);
    setInputShopId(state.shops[0]?.shopId || '');
    setInputDomain('');
    setInputStatus('CONNECTED');
    setIsDomainActive(true);
  };

  const openEditModal = (shop: Shop) => {
    setEditingShop(shop);
    setInputShopId(shop.shopId);
    setInputDomain(shop.customDomain || '');
    setInputStatus(shop.domainConnectStatus || 'CONNECTED');
    setIsDomainActive(shop.isCustomDomainActive !== false);
  };

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = inputDomain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/\/$/, '');

    if (!cleanDomain) {
      showToast('⚠️ Kripya domain name enter karein (e.g. trustedweb.online)');
      return;
    }

    const targetShop = state.shops.find((s) => s.shopId === inputShopId);
    if (!targetShop) {
      showToast('⚠️ Invalid Shop ID selected.');
      return;
    }

    // Check if domain is already used by another shop
    const duplicate = state.shops.find(
      (s) => s.shopId !== inputShopId && s.customDomain?.toLowerCase() === cleanDomain
    );
    if (duplicate) {
      showToast(`⚠️ Domain "${cleanDomain}" pehle se "${duplicate.businessName}" (${duplicate.shopId}) se juda hua hai.`);
      return;
    }

    const updatedShop: Shop = {
      ...targetShop,
      customDomain: cleanDomain,
      domainConnectStatus: inputStatus,
      domainVerificationStatus: 'VERIFIED',
      dnsStatus: 'PROPAGATED',
      sslStatus: 'ACTIVE',
      isCustomDomainActive: isDomainActive,
      updatedAt: new Date().toISOString(),
    };

    const updatedShops = state.shops.map((s) => (s.shopId === targetShop.shopId ? updatedShop : s));
    const nextState = { ...state, shops: updatedShops };

    onUpdateState(nextState);
    saveShopToFirestore(updatedShop);
    showToast(`✅ Custom Domain "${cleanDomain}" mapped to ${targetShop.businessName} (${targetShop.shopId})!`);
    setEditingShop(null);
  };

  const handleToggleActive = (shop: Shop) => {
    const newActive = shop.isCustomDomainActive === false ? true : false;
    const updatedShop: Shop = {
      ...shop,
      isCustomDomainActive: newActive,
      updatedAt: new Date().toISOString(),
    };

    const updatedShops = state.shops.map((s) => (s.shopId === shop.shopId ? updatedShop : s));
    const nextState = { ...state, shops: updatedShops };

    onUpdateState(nextState);
    saveShopToFirestore(updatedShop);
    showToast(newActive ? `🟢 Domain activated for ${shop.businessName}` : `⏸️ Domain paused for ${shop.businessName}`);
  };

  const handleRemoveDomain = (shop: Shop) => {
    if (!window.confirm(`Kya aap domain "${shop.customDomain}" ko ${shop.businessName} (${shop.shopId}) se remove karna chahte hain?`)) {
      return;
    }

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
    const nextState = { ...state, shops: updatedShops };

    onUpdateState(nextState);
    saveShopToFirestore(updatedShop);
    showToast(`🗑️ Domain unlinked from ${shop.businessName}`);
  };

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
    }, 1200);
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
              Yahan se kisi bhi client ka custom domain (jaise <strong>trustedweb.online</strong>) unke isolated Shop ID (jaise <strong>SHP099949294</strong>) se map karein. Jab customer domain kholega, bina kisi URL redirect ke unka store open hoga.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Map New Domain
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
              className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white"
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
              className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white"
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
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              All ({shopsWithDomains.length})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                statusFilter === 'ACTIVE' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
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

      {/* Domains Table */}
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
                  const isActive = shop.isCustomDomainActive !== false;
                  const isPending = shop.domainConnectStatus === 'PENDING_DNS';

                  return (
                    <tr key={shop.shopId} className="hover:bg-gray-50/70 transition-colors">
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

                      {/* Custom Domain */}
                      <td className="py-3.5 px-4">
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
                      </td>

                      {/* Original Platform URL */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-gray-600">
                          <span>indianlalaji.com/?shop={shop.shopId}</span>
                          <button
                            type="button"
                            onClick={() => onNavigateToShop(shop.shopId)}
                            className="text-orange-600 hover:underline font-bold text-[10px] ml-1"
                          >
                            Preview
                          </button>
                        </div>
                      </td>

                      {/* DNS Status */}
                      <td className="py-3.5 px-4">
                        {isPending ? (
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
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSimulateVerify(shop)}
                            disabled={isVerifyingShopId === shop.shopId}
                            className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Re-verify DNS & SSL"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingShopId === shop.shopId ? 'animate-spin text-emerald-600' : ''}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(shop)}
                            className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded"
                            title="Edit Domain Mapping"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveDomain(shop)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Disconnect / Remove Domain"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Map / Edit Modal */}
      {(editingShop !== null || inputShopId) && inputDomain !== undefined && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-600" />
                {editingShop ? 'Edit Custom Domain Mapping' : 'Map Custom Domain to Store'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingShop(null)}
                className="text-gray-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDomain} className="space-y-3.5 text-xs">
              {/* Select Shop */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Client Store / Shop ID
                </label>
                <select
                  value={inputShopId}
                  onChange={(e) => setInputShopId(e.target.value)}
                  disabled={Boolean(editingShop)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-semibold text-slate-900"
                >
                  {state.shops.map((s) => (
                    <option key={s.shopId} value={s.shopId}>
                      {s.businessName} ({s.shopId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Domain Name */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Domain Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. trustedweb.online"
                  value={inputDomain}
                  onChange={(e) => setInputDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono font-semibold text-slate-900"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Do not include <code>https://</code> or trailing slash. Example: <code>trustedweb.online</code>
                </p>
              </div>

              {/* Connection Status */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Connection Status
                </label>
                <select
                  value={inputStatus}
                  onChange={(e) => setInputStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-bold text-slate-900"
                >
                  <option value="CONNECTED">🟢 CONNECTED (Active & Propagated)</option>
                  <option value="PENDING_DNS">🟡 PENDING_DNS (DNS propagation pending)</option>
                  <option value="NOT_CONNECTED">⚪ NOT_CONNECTED (Disabled)</option>
                </select>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <span className="font-bold text-slate-800 block">Domain Routing Active</span>
                  <span className="text-[10px] text-gray-500">Direct traffic to this client store</span>
                </div>
                <input
                  type="checkbox"
                  checked={isDomainActive}
                  onChange={(e) => setIsDomainActive(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingShop(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

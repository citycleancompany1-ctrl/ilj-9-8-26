import React, { useState } from 'react';
import { Globe, X, Check, ExternalLink, AlertCircle, Copy, CheckCircle2, ShieldCheck, Link2 } from 'lucide-react';
import { Shop, PlatformState } from '../../types';
import { saveShopToFirestore } from '../../services/firebase';

interface ConnectWebsiteModalProps {
  shop: Shop;
  onClose: () => void;
  onUpdateShop: (updatedShop: Shop) => void;
  showToast: (msg: string) => void;
}

export const ConnectWebsiteModal: React.FC<ConnectWebsiteModalProps> = ({
  shop,
  onClose,
  onUpdateShop,
  showToast,
}) => {
  const [customDomain, setCustomDomain] = useState(shop.customDomain || '');
  const [connectedWebsiteUrl, setConnectedWebsiteUrl] = useState(shop.connectedWebsiteUrl || '');
  const [domainConnectStatus, setDomainConnectStatus] = useState<'CONNECTED' | 'PENDING_DNS' | 'NOT_CONNECTED'>(
    shop.domainConnectStatus || (shop.customDomain ? 'CONNECTED' : 'NOT_CONNECTED')
  );
  const [copiedDns, setCopiedDns] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean domain format (remove https://, trailing slashes if entered)
    const cleanDomain = customDomain.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');
    const cleanUrl = connectedWebsiteUrl.trim();

    const updatedShop: Shop = {
      ...shop,
      customDomain: cleanDomain || undefined,
      connectedWebsiteUrl: cleanUrl || (cleanDomain ? `https://${cleanDomain}` : undefined),
      domainConnectStatus: cleanDomain ? domainConnectStatus : 'NOT_CONNECTED',
    };

    saveShopToFirestore(updatedShop);
    onUpdateShop(updatedShop);
    showToast(`Domain settings saved for ${shop.businessName}!`);
    onClose();
  };

  const copyDnsRecord = () => {
    navigator.clipboard.writeText('indianlalaji.com');
    setCopiedDns(true);
    setTimeout(() => setCopiedDns(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                Connect Website & Custom Domain
              </h3>
              <p className="text-xs text-gray-500 font-medium">{shop.businessName} ({shop.shopId})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Current Shop Default Link */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Default IndianLalaJi Link:</span>
              <div className="font-mono font-bold text-slate-800">
                indianlalaji.com/?shop={shop.shopId}
              </div>
            </div>
            <a
              href={`/?shop=${shop.shopId}`}
              target="_blank"
              rel="noreferrer"
              className="text-orange-600 hover:text-orange-700 flex items-center gap-1 font-bold"
            >
              <span>Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Custom Domain Input */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
              Custom Domain Name (e.g. www.mydukaan.com)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. www.guptakirana.in or shop.mybrand.com"
                value={customDomain}
                onChange={(e) => {
                  setCustomDomain(e.target.value);
                  if (e.target.value.trim() && domainConnectStatus === 'NOT_CONNECTED') {
                    setDomainConnectStatus('CONNECTED');
                  }
                }}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 font-medium text-slate-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Agar vendor ka apna domain hai (GoDaddy, Hostinger, Namecheap se), toh yahan connect karein.
            </p>
          </div>

          {/* External Connected Website URL (Optional) */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
              Connected Website Target URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://www.example.com"
              value={connectedWebsiteUrl}
              onChange={(e) => setConnectedWebsiteUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 font-medium text-slate-900"
            />
          </div>

          {/* Connection Status Selector */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
              Domain Connection Status
            </label>
            <select
              value={domainConnectStatus}
              onChange={(e) => setDomainConnectStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-bold text-slate-900"
            >
              <option value="CONNECTED">🟢 CONNECTED (Active & Live)</option>
              <option value="PENDING_DNS">🟡 PENDING_DNS (Awaiting CNAME Verification)</option>
              <option value="NOT_CONNECTED">⚪ NOT_CONNECTED (Disconnected)</option>
            </select>
          </div>

          {/* DNS Configuration Helper Card */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-blue-900">
              <span className="font-black uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                DNS Records Setup (GoDaddy / Hostinger)
              </span>
              <button
                type="button"
                onClick={copyDnsRecord}
                className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                {copiedDns ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDns ? 'Copied IP' : 'Copy IP'}</span>
              </button>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg border border-blue-100">
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-sans">Type</span>
                  <span className="font-bold text-slate-900">A Record</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-sans">Host</span>
                  <span className="font-bold text-slate-900">@</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-sans">Points to IP</span>
                  <span className="font-bold text-orange-600">145.223.124.49</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg border border-blue-100">
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-sans">Type</span>
                  <span className="font-bold text-slate-900">CNAME</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-sans">Host</span>
                  <span className="font-bold text-slate-900">www</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-sans">Points to Target</span>
                  <span className="font-bold text-orange-600">cname.indianlalaji.com</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-blue-800 font-sans mt-1">
              <strong>Note:</strong> GoDaddy DNS me "Forwarding" use mat karein. Direct A/CNAME record se URL change hue bina store load hota hai.
            </p>
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
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Connect Website</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

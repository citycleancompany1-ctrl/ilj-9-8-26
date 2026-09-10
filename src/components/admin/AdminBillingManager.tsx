import React, { useState, useMemo } from 'react';
import { 
  IndianRupee, 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  FileText, 
  ArrowUpRight, 
  Store, 
  PhoneCall, 
  Plus, 
  X,
  CreditCard,
  Building,
  Check,
  AlertCircle
} from 'lucide-react';
import { Shop, PlatformState, SubscriptionInvoice } from '../../types';
import { formatINR, formatDisplayDate, getWhatsAppDirectUrl } from '../../utils/mediaUpload';
import { saveShopToFirestore } from '../../services/firebase';

interface AdminBillingManagerProps {
  state: PlatformState;
  onUpdateState: (newState: PlatformState) => void;
  onViewInvoice: (shop: Shop) => void;
  showToast: (msg: string) => void;
}

export const AdminBillingManager: React.FC<AdminBillingManagerProps> = ({
  state,
  onUpdateState,
  onViewInvoice,
  showToast,
}) => {
  const currentDate = new Date();
  const currentYearStr = String(currentDate.getFullYear());
  const currentMonthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
  const todayStr = currentDate.toISOString().split('T')[0];

  // Filter States
  const [filterMode, setFilterMode] = useState<'DAY' | 'MONTH' | 'YEAR' | 'ALL_TIME'>('MONTH');
  const [selectedDay, setSelectedDay] = useState<string>(todayStr);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);
  const [billingStatusFilter, setBillingStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Manual payment modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    shopId: '',
    amount: 1499,
    paymentMethod: 'UPI' as 'UPI' | 'QR_CODE' | 'BANK_TRANSFER' | 'MANUAL_ADMIN',
    paymentRefId: '',
    date: todayStr,
    status: 'PAID' as 'PAID' | 'PENDING',
  });

  // Extract date parts safely
  const getShopDateInfo = (shop: Shop) => {
    const raw = shop.activeDate || shop.createdAt || '2026-08-01';
    const cleanDate = raw.split('T')[0];
    const parts = cleanDate.split('-');
    const year = parts[0] || '2026';
    const month = parts[1] ? parts[1].padStart(2, '0') : '08';
    const day = parts[2] ? parts[2].padStart(2, '0') : '01';
    return { cleanDate, year, month, day };
  };

  // Compile billing items from shops
  const allBillingRecords = useMemo(() => {
    return state.shops.map((shop, index) => {
      const dateInfo = getShopDateInfo(shop);
      const isPaid = shop.status === 'PUBLISHED' || (shop.invoices && shop.invoices.some(i => i.paymentStatus === 'PAID'));
      const invoiceNumber = shop.invoices?.[0]?.invoiceNumber || `INV-${dateInfo.year}-${shop.shopId.replace('SHP', '') || (8900 + index)}`;
      const amount = shop.planPrice || 1499;

      return {
        shop,
        invoiceNumber,
        amount,
        isPaid,
        paymentStatus: isPaid ? 'PAID' : (shop.status === 'PENDING_APPROVAL' ? 'PENDING' : 'UNPAID'),
        date: dateInfo.cleanDate,
        year: dateInfo.year,
        month: dateInfo.month,
        day: dateInfo.day,
        planName: shop.planName || '1-Year Official LalaJi Store Plan',
      };
    });
  }, [state.shops]);

  // Overall aggregate financial metrics (All time)
  const totalGrossEarnings = useMemo(() => {
    return allBillingRecords
      .filter(r => r.isPaid)
      .reduce((sum, r) => sum + r.amount, 0);
  }, [allBillingRecords]);

  const todayEarnings = useMemo(() => {
    return allBillingRecords
      .filter(r => r.isPaid && r.date === todayStr)
      .reduce((sum, r) => sum + r.amount, 0);
  }, [allBillingRecords, todayStr]);

  const thisMonthEarnings = useMemo(() => {
    return allBillingRecords
      .filter(r => r.isPaid && r.year === currentYearStr && r.month === currentMonthStr)
      .reduce((sum, r) => sum + r.amount, 0);
  }, [allBillingRecords, currentYearStr, currentMonthStr]);

  const thisYearEarnings = useMemo(() => {
    return allBillingRecords
      .filter(r => r.isPaid && r.year === currentYearStr)
      .reduce((sum, r) => sum + r.amount, 0);
  }, [allBillingRecords, currentYearStr]);

  const totalPaidStoresCount = useMemo(() => {
    return allBillingRecords.filter(r => r.isPaid).length;
  }, [allBillingRecords]);

  const totalPendingStoresCount = useMemo(() => {
    return allBillingRecords.filter(r => !r.isPaid).length;
  }, [allBillingRecords]);

  // Filtered Records based on user selections
  const filteredRecords = useMemo(() => {
    return allBillingRecords.filter((record) => {
      // 1. Status Filter
      if (billingStatusFilter === 'PAID' && !record.isPaid) return false;
      if (billingStatusFilter === 'PENDING' && record.isPaid) return false;

      // 2. Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = record.shop.businessName.toLowerCase().includes(q);
        const matchOwner = record.shop.vendorName.toLowerCase().includes(q);
        const matchPhone = record.shop.phone.includes(q);
        const matchShopId = record.shop.shopId.toLowerCase().includes(q);
        const matchInv = record.invoiceNumber.toLowerCase().includes(q);
        if (!matchName && !matchOwner && !matchPhone && !matchShopId && !matchInv) {
          return false;
        }
      }

      // 3. Timeframe Filter
      if (filterMode === 'DAY') {
        return record.date === selectedDay;
      } else if (filterMode === 'MONTH') {
        return record.year === selectedYear && record.month === selectedMonth;
      } else if (filterMode === 'YEAR') {
        return record.year === selectedYear;
      }
      return true; // ALL_TIME
    });
  }, [allBillingRecords, filterMode, selectedDay, selectedMonth, selectedYear, billingStatusFilter, searchQuery]);

  // Filtered Period Earnings
  const filteredPeriodEarnings = useMemo(() => {
    return filteredRecords
      .filter(r => r.isPaid)
      .reduce((sum, r) => sum + r.amount, 0);
  }, [filteredRecords]);

  // Handle toggle payment status for a shop
  const handleTogglePaymentStatus = (shop: Shop, currentIsPaid: boolean) => {
    const newStatus = currentIsPaid ? 'HOLD' : 'PUBLISHED';
    const updatedShop: Shop = {
      ...shop,
      status: newStatus,
      activeDate: currentIsPaid ? shop.activeDate : todayStr,
    };
    saveShopToFirestore(updatedShop);
    const updatedShops = state.shops.map(s => s.shopId === shop.shopId ? updatedShop : s);
    onUpdateState({ ...state, shops: updatedShops });
    showToast(`Payment status updated to ${newStatus === 'PUBLISHED' ? 'PAID' : 'PENDING'} for ${shop.businessName}`);
  };

  // Handle Record Manual Payment
  const handleSaveManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetShop = state.shops.find(s => s.shopId === manualForm.shopId);
    if (!targetShop) {
      showToast('Please select a valid store!');
      return;
    }

    const newInvoice: SubscriptionInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${currentYearStr}-${Math.floor(1000 + Math.random() * 9000)}`,
      shopId: targetShop.shopId,
      businessName: targetShop.businessName,
      vendorName: targetShop.vendorName,
      vendorPhone: targetShop.phone,
      vendorEmail: targetShop.vendorEmail || targetShop.email,
      vendorAddress: targetShop.address,
      planName: targetShop.planName || '1-Year Official LalaJi Store Plan',
      planPeriod: '1 Year (365 Days)',
      activeDate: manualForm.date,
      expiryDate: new Date(new Date(manualForm.date).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      baseAmount: Math.round((manualForm.amount / 1.18) * 100) / 100,
      taxRate: 18,
      taxAmount: Math.round((manualForm.amount - manualForm.amount / 1.18) * 100) / 100,
      totalAmount: manualForm.amount,
      paymentMethod: manualForm.paymentMethod,
      paymentRefId: manualForm.paymentRefId || `UTR${Date.now().toString().slice(-8)}`,
      paymentStatus: manualForm.status,
      paidAt: new Date().toISOString(),
      issuedBy: 'IndianLalaJi Platform Network',
    };

    const updatedShop: Shop = {
      ...targetShop,
      status: manualForm.status === 'PAID' ? 'PUBLISHED' : targetShop.status,
      activeDate: manualForm.date,
      invoices: [newInvoice, ...(targetShop.invoices || [])],
    };

    saveShopToFirestore(updatedShop);
    const updatedShops = state.shops.map(s => s.shopId === targetShop.shopId ? updatedShop : s);
    onUpdateState({ ...state, shops: updatedShops });
    setShowManualModal(false);
    showToast(`Offline payment of ₹${manualForm.amount} recorded for ${targetShop.businessName}!`);
  };

  const monthsList = [
    { num: '01', name: 'January' },
    { num: '02', name: 'February' },
    { num: '03', name: 'March' },
    { num: '04', name: 'April' },
    { num: '05', name: 'May' },
    { num: '06', name: 'June' },
    { num: '07', name: 'July' },
    { num: '08', name: 'August' },
    { num: '09', name: 'September' },
    { num: '10', name: 'October' },
    { num: '11', name: 'November' },
    { num: '12', name: 'December' },
  ];

  const getMonthName = (m: string) => {
    const found = monthsList.find(item => item.num === m);
    return found ? found.name : m;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP FINANCIAL KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Website Gross Earnings */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Website Gross Earning</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] tracking-tight text-white">
            {formatINR(totalGrossEarnings)}
          </div>
          <div className="text-[11px] text-orange-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{totalPaidStoresCount} Stores Activated All-Time</span>
          </div>
        </div>

        {/* Today's Earning */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's Earning (Day)</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              ⚡
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] tracking-tight text-emerald-950">
            {formatINR(todayEarnings)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Date: {formatDisplayDate(todayStr)}
          </div>
        </div>

        {/* This Month's Earning */}
        <div className="bg-white p-5 rounded-2xl border border-orange-200 bg-orange-50/30 shadow-xs">
          <div className="flex items-center justify-between text-orange-900 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">This Month's Earning</span>
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] tracking-tight text-orange-950">
            {formatINR(thisMonthEarnings)}
          </div>
          <div className="text-[11px] text-orange-800 font-medium mt-1">
            {getMonthName(currentMonthStr)} {currentYearStr}
          </div>
        </div>

        {/* This Year's Earning */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between text-blue-900 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">This Year's Earning (Annual)</span>
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] tracking-tight text-blue-950">
            {formatINR(thisYearEarnings)}
          </div>
          <div className="text-[11px] text-blue-800 font-medium mt-1">
            Fiscal Year {currentYearStr}
          </div>
        </div>

      </div>

      {/* 2. ADVANCED BILLING FILTERS & CONTROLS (DAY / MONTH / YEAR) */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          
          {/* Filter Mode Selector */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">Filter By:</span>
            
            <button
              id="filter-mode-day"
              onClick={() => setFilterMode('DAY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                filterMode === 'DAY'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📅 Specific Day
            </button>

            <button
              id="filter-mode-month"
              onClick={() => setFilterMode('MONTH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                filterMode === 'MONTH'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📆 By Month
            </button>

            <button
              id="filter-mode-year"
              onClick={() => setFilterMode('YEAR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                filterMode === 'YEAR'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 By Year
            </button>

            <button
              id="filter-mode-all"
              onClick={() => setFilterMode('ALL_TIME')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                filterMode === 'ALL_TIME'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌐 All Time
            </button>
          </div>

          {/* Action Buttons: Add Offline Payment & Print Statement */}
          <div className="flex items-center gap-2">
            <button
              id="record-manual-payment-btn"
              onClick={() => setShowManualModal(true)}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Offline Payment</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
          </div>

        </div>

        {/* Dynamic Inputs Based on Filter Mode */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3">
            {filterMode === 'DAY' && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Date:</label>
                <input
                  type="date"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
                {/* Quick day buttons */}
                <button
                  onClick={() => setSelectedDay(todayStr)}
                  className="px-2.5 py-1 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 rounded-md text-slate-700 cursor-pointer"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                    setSelectedDay(yesterday);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 rounded-md text-slate-700 cursor-pointer"
                >
                  Yesterday
                </button>
              </div>
            )}

            {filterMode === 'MONTH' && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Month & Year:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white text-slate-900 focus:ring-2 focus:ring-orange-500"
                >
                  {monthsList.map(m => (
                    <option key={m.num} value={m.num}>{m.name} ({m.num})</option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white text-slate-900 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            )}

            {filterMode === 'YEAR' && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Fiscal Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white text-slate-900 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            )}

            {/* Payment Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status:</span>
              <select
                value={billingStatusFilter}
                onChange={(e) => setBillingStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white text-slate-900 focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">All Payments</option>
                <option value="PAID">Paid Only</option>
                <option value="PENDING">Pending Approval</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search store, owner or invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500"
            />
          </div>

        </div>

        {/* Filter Summary Banner */}
        <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 uppercase tracking-wide">
                Filtered Period Total Earnings: <span className="text-orange-700 text-sm">{formatINR(filteredPeriodEarnings)}</span>
              </div>
              <div className="text-[11px] text-gray-600">
                Found {filteredRecords.length} website subscription transactions ({filteredRecords.filter(r => r.isPaid).length} paid)
              </div>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-orange-200 self-start sm:self-auto">
            {filterMode === 'DAY' && `Showing Day: ${formatDisplayDate(selectedDay)}`}
            {filterMode === 'MONTH' && `Showing Month: ${getMonthName(selectedMonth)} ${selectedYear}`}
            {filterMode === 'YEAR' && `Showing Year: ${selectedYear}`}
            {filterMode === 'ALL_TIME' && `Showing Complete Historical Ledger`}
          </div>
        </div>

      </div>

      {/* 3. DETAILED SUBSCRIPTION INVOICES & EARNINGS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
              Subscription Billing & Revenue Ledger ({filteredRecords.length})
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium">1-Year Store Hosting Package (₹1,499)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-gray-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Invoice # & Date</th>
                <th className="py-3.5 px-4">Website / Shop ID</th>
                <th className="py-3.5 px-4">Owner & Phone</th>
                <th className="py-3.5 px-4">Plan & Validity</th>
                <th className="py-3.5 px-4">Gross Amount</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Invoice Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No billing transactions found for the selected time filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const shop = record.shop;
                  return (
                    <tr key={shop.shopId} className="hover:bg-orange-50/40 transition-colors">
                      
                      {/* Invoice # & Date */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900">{record.invoiceNumber}</div>
                        <div className="text-[11px] text-gray-500">{formatDisplayDate(record.date)}</div>
                      </td>

                      {/* Website & Shop ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{shop.businessName}</span>
                        </div>
                        <div className="font-mono text-[11px] text-orange-600 font-bold">{shop.shopId}</div>
                        {shop.customDomain && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                            🌐 {shop.customDomain}
                          </span>
                        )}
                      </td>

                      {/* Owner & Phone */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{shop.vendorName}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <PhoneCall className="w-3 h-3 text-gray-400" />
                          <span>+91 {shop.phone}</span>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-bold">{record.planName}</div>
                        <div className="text-[10px] text-emerald-700 font-bold uppercase">1 Year (365 Days)</div>
                      </td>

                      {/* Gross Amount */}
                      <td className="py-3 px-4">
                        <div className="font-black text-slate-900 font-['Outfit',sans-serif] text-sm">
                          {formatINR(record.amount)}
                        </div>
                        <div className="text-[10px] text-gray-400">Direct Store Payment</div>
                      </td>

                      {/* Status & Quick Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePaymentStatus(shop, record.isPaid)}
                          className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            record.isPaid
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200'
                          }`}
                          title="Click to toggle Payment Status"
                        >
                          {record.isPaid ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>PAID (Active)</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>PENDING</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Invoice Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onViewInvoice(shop)}
                            className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-orange-200 flex items-center gap-1 cursor-pointer"
                            title="View / Print Official GST Invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Tax Invoice</span>
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

      {/* 4. RECORD MANUAL / OFFLINE PAYMENT MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                  Record Offline Subscription Payment
                </h3>
              </div>
              <button 
                onClick={() => setShowManualModal(false)}
                className="text-gray-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualPayment} className="space-y-3 text-xs">
              
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Select Website / Store
                </label>
                <select
                  value={manualForm.shopId}
                  onChange={(e) => setManualForm({ ...manualForm, shopId: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-bold text-slate-900"
                >
                  <option value="">-- Choose Store --</option>
                  {state.shops.map((s) => (
                    <option key={s.shopId} value={s.shopId}>
                      {s.businessName} ({s.shopId}) - {s.vendorName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Amount Received (₹)
                  </label>
                  <input
                    type="number"
                    value={manualForm.amount}
                    onChange={(e) => setManualForm({ ...manualForm, amount: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={manualForm.date}
                    onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={manualForm.paymentMethod}
                    onChange={(e) => setManualForm({ ...manualForm, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-medium"
                  >
                    <option value="UPI">UPI Direct</option>
                    <option value="QR_CODE">QR Code Scan</option>
                    <option value="BANK_TRANSFER">NEFT / Bank Transfer</option>
                    <option value="MANUAL_ADMIN">Cash / Manual Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={manualForm.status}
                    onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-bold"
                  >
                    <option value="PAID">🟢 PAID (Publish Store)</option>
                    <option value="PENDING">🟡 PENDING</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Bank Reference / UTR # (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR429812984124"
                  value={manualForm.paymentRefId}
                  onChange={(e) => setManualForm({ ...manualForm, paymentRefId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold uppercase rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase rounded-lg shadow-sm cursor-pointer"
                >
                  Save & Generate Tax Invoice
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

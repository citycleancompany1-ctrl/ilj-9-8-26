import React, { useState } from 'react';
import {
  FileText,
  Save,
  Eye,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Building2,
  Shirt,
  Utensils,
  Smartphone,
  Stethoscope,
  Wrench,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Shop } from '../../types';

interface VendorTermsManagerProps {
  shop: Shop;
  onUpdateShop: (updated: Shop) => void;
  onMarkDirty?: () => void;
  showToast: (msg: string) => void;
  onOpenPreviewModal: () => void;
}

export const VendorTermsManager: React.FC<VendorTermsManagerProps> = ({
  shop,
  onUpdateShop,
  onMarkDirty,
  showToast,
  onOpenPreviewModal,
}) => {
  const [termsText, setTermsText] = useState<string>(shop.termsAndConditions || '');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const storeName = shop.businessName || 'My Store';
  const ownerName = shop.vendorName || 'Store Proprietor';
  const phone = shop.phone || shop.whatsapp || 'Helpline';
  const address = shop.address ? `${shop.address}, ${shop.city || ''}` : 'Store Location';

  // Starter Templates
  const handleLoadTemplate = (templateType: string) => {
    let newContent = '';

    switch (templateType) {
      case 'retail':
        newContent = `1. ORDER PLACEMENT & INQUIRY (ऑर्डर एवं पूछताछ)
- All orders placed via our website or WhatsApp catalogue are reviewed directly by ${storeName}.
- Item availability and final pricing will be confirmed before dispatch or customer pickup.
- In case of out-of-stock items, we will offer immediate substitutes of equal or better quality.

2. PAYMENT POLICY (भुगतान नियम)
- 100% Direct Settlement: We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD).
- No middleman commission is deducted; you pay the genuine shop price directly.
- Always verify store account details before making advance digital payments.

3. HOME DELIVERY & STORE PICKUP (डिलीवरी एवं समय सीमा)
- Local delivery is typically fulfilled within 2 to 6 hours for nearby pin codes.
- Customers may also choose Store Pickup at: ${address}.
- Delivery charges (if applicable) will be informed prior to order confirmation.

4. RETURN & REPLACEMENT (वापसी व एक्सचेंज नियम)
- Perishable/grocery items must be inspected upon delivery. Damaged items will be replaced immediately.
- Packaged goods can be exchanged within 24-48 hours with original packaging and invoice.

5. CUSTOMER HELPLINE (कस्टमर सहायता)
- For any order inquiries, complaints or feedback, contact ${ownerName} at +91 ${phone}.`;
        break;

      case 'clothing':
        newContent = `1. ORDER CONFIRMATION & SIZING (ऑर्डर व साइज चयन)
- Please check the size chart carefully before confirming your clothing/garment order.
- Exact fabric shades may vary slightly due to digital lighting and screen resolutions.

2. PAYMENT TERMS (भुगतान नियम)
- We accept direct UPI transfers, credit/debit cards, net banking, or COD as mutually confirmed on WhatsApp.
- Custom stitched or altered outfits require a 50% advance payment prior to work commencement.

3. DISPATCH & SHIPPING (शिपिंग व डिलीवरी)
- In-stock garments are dispatched within 24 hours. Delivery takes 2-5 business days across India.
- Store pickup is available during normal business hours at ${storeName}.

4. EXCHANGE & RETURN POLICY (एक्सचेंज पॉलिसी)
- Size exchanges are accepted within 3 days of delivery if the item is unwashed, unworn, and tags intact.
- Custom-stitched or altered garments are non-returnable unless there is a stitching defect from our end.

5. CONTACT FOR STYLING & SIZING (सहायता केंद्र)
- Need help picking the right size or fabric? Message us directly on WhatsApp at +91 ${phone}.`;
        break;

      case 'food':
        newContent = `1. FRESH FOOD PREPARATION (ताजा भोजन एवं तैयारी)
- All sweets, bakery items, and meals at ${storeName} are prepared fresh daily using authentic ingredients.
- Please consume perishable sweets and fresh snacks within the recommended shelf time.

2. ORDER CANCELLATION (ऑर्डर रद्दीकरण)
- Once kitchen preparation has started (usually within 10-15 minutes of ordering), orders cannot be cancelled.
- Bulk sweets and catering orders require at least 24 hours advance notice.

3. HYGIENE & DIRECT DELIVERY (स्वच्छता एवं डिलीवरी)
- Deliveries are sealed carefully to prevent tampering. Please check the tamper-evident seal before receiving.
- Instant local delivery is completed within 30-60 minutes depending on distance and kitchen rush.

4. DIRECT PAYMENT (सीधा भुगतान)
- We accept direct UPI payments (PhonePe / Google Pay / Paytm) and Cash on Delivery. Zero extra service fees.

5. FEEDBACK & QUALITY SUPPORT (गुणवत्ता सहायता)
- Your satisfaction is our pride. Contact ${ownerName} directly at +91 ${phone} for any quality feedback.`;
        break;

      case 'electronics':
        newContent = `1. PRODUCT AUTHENTICITY & WARRANTY (वारंटी व गारंटी)
- All products sold at ${storeName} are 100% genuine with authorized brand warranty cards (where applicable).
- Warranty claims for branded electronics are serviced directly through authorized brand service centers.

2. TESTING & STORE PICKUP (जांच एवं स्टोर पिकअप)
- We thoroughly test all gadgets, accessories, and repaired items before handover or dispatch.
- Customers are encouraged to record an unboxing video upon receiving courier dispatches.

3. RETURN & REPLACEMENT (रिप्लेसमेंट नियम)
- In case of a technical defect on delivery, inform us within 48 hours for immediate replacement or repair.
- Physical damage, water damage, or unauthorized tampering voids all replacement warranties.

4. SECURE PAYMENT (सुरक्षित भुगतान)
- Payment can be made via direct UPI, bank transfer, or at our shop counter in cash.

5. TECHNICAL SUPPORT HELPLINE (तकनीकी सहायता)
- For repairs, installations, or compatibility questions, call or WhatsApp our technician at +91 ${phone}.`;
        break;

      case 'services':
        newContent = `1. SERVICE BOOKING & ESTIMATE (सर्विस बुकिंग व कोटेशन)
- Service bookings submitted on our website will be acknowledged within 2 hours by our team.
- A free or nominal inspection estimate will be shared before starting any major repair/service work.

2. WORK SCHEDULE & VISITS (विजिट समय सीमा)
- Our technician/service partner will visit your premises at the mutually agreed time slot.
- Please ensure an adult family member or representative is present during the service.

3. SERVICE GUARANTEE (सर्विस वारंटी)
- Repaired parts and service workmanship carry a 7 to 30 days testing warranty depending on the service category.
- Spare parts cost is billed separately with original vendor receipts.

4. DIRECT SETTLEMENT (पारदर्शी भुगतान)
- Pay only upon full job satisfaction via direct UPI or cash. No hidden platform charges.

5. EMERGENCY HELPLINE (आपातकालीन संपर्क)
- For urgent assistance or rescheduling, contact ${ownerName} at +91 ${phone}.`;
        break;

      default:
        newContent = `1. ORDER PLACEMENT & INQUIRY (ऑर्डर प्रक्रिया)
- Customers can add items to cart and submit their order directly via our verified WhatsApp checkout.
- Order confirmation, availability, and delivery schedule will be shared directly by ${storeName}.

2. DIRECT PAYMENT TERMS (सीधा भुगतान)
- We accept direct UPI (PhonePe, Google Pay, Paytm, BHIM), Net Banking, or Cash on Delivery.
- 100% direct transaction with zero intermediary platform deductions.

3. DISPATCH, FULFILLMENT & PICKUP (डिलीवरी नियम)
- Orders are fulfilled promptly from our store at ${address}.
- Estimated delivery timelines will be confirmed at the time of order booking.

4. RETURN, REFUND & REPLACEMENT (वापसी नीति)
- If you receive an incorrect or damaged item, please notify us within 24 hours with photos.
- Replacement or refund will be processed fairly according to our store policy.

5. STORE INFORMATION & HELPLINE (दुकान संपर्क)
- Proprietor: ${ownerName}
- Phone / WhatsApp: +91 ${phone}
- Store Address: ${address}`;
        break;
    }

    setTermsText(newContent);
    setIsSaved(false);
    onMarkDirty?.();
    showToast(`Loaded ${templateType.toUpperCase()} Terms & Conditions template! Click Save to apply.`);
  };

  // Insert a quick clause at the end of the text
  const handleInsertClause = (clauseTitle: string, clauseBody: string) => {
    const clauseText = `\n\n${clauseTitle}\n${clauseBody}`;
    setTermsText((prev) => (prev ? prev.trim() + clauseText : clauseText.trim()));
    setIsSaved(false);
    onMarkDirty?.();
    showToast(`Added clause: ${clauseTitle}`);
  };

  // Save changes
  const handleSave = () => {
    const updatedShop: Shop = {
      ...shop,
      termsAndConditions: termsText.trim(),
      termsUpdatedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      updatedAt: new Date().toISOString(),
    };

    onUpdateShop(updatedShop);
    setIsSaved(true);
    showToast('Store Terms & Conditions (T&C) saved successfully!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Clear / Reset
  const handleClear = () => {
    if (window.confirm('Kya aap sach me T&C text clear karna chahte hain? Isse default standard template active ho jayega.')) {
      setTermsText('');
      const updatedShop: Shop = {
        ...shop,
        termsAndConditions: '',
        termsUpdatedAt: new Date().toLocaleDateString('en-IN'),
        updatedAt: new Date().toISOString(),
      };
      onUpdateShop(updatedShop);
      showToast('Terms reset to standard default template.');
    }
  };

  const wordCount = termsText.trim() ? termsText.trim().split(/\s+/).length : 0;
  const lineCount = termsText.trim() ? termsText.trim().split('\n').length : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit',sans-serif] uppercase tracking-tight">
                Store Terms & Conditions (T&C) Editor
              </h3>
              {termsText.trim() ? (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Custom T&C Active
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  Standard Default Active
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Yahan aap apne store ke niyam, delivery timing, return policy aur payment guidelines apni marzi se likh sakte hain.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={onOpenPreviewModal}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
            title="Preview how customers see your T&C modal"
          >
            <Eye className="w-4 h-4 text-orange-600" />
            <span>Live Preview Modal</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-98 text-white ${
              isSaved
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Saved!' : 'Save T&C'}</span>
          </button>
        </div>
      </div>

      {/* Quick Starter Templates */}
      <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/80 rounded-xl p-4 border border-amber-200/80 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>1-Click Starter Templates (रेडीमेड फॉर्मेट चुनें व एडिट करें)</span>
          </div>
          <span className="text-[11px] text-amber-800">
            Clicking a template fills ready-to-use professional policies with your shop details!
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => handleLoadTemplate('retail')}
            className="p-2.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-slate-800 text-left transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-orange-700 font-bold text-xs">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Retail / Kirana</span>
            </div>
            <span className="text-[10px] text-gray-500">किराना व जनरल स्टोर</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadTemplate('clothing')}
            className="p-2.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-slate-800 text-left transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
              <Shirt className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Boutique & Garment</span>
            </div>
            <span className="text-[10px] text-gray-500">कपड़ा व रेडीमेड</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadTemplate('food')}
            className="p-2.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-slate-800 text-left transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
              <Utensils className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Food & Bakery</span>
            </div>
            <span className="text-[10px] text-gray-500">रेस्टोरेंट व मिठाई</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadTemplate('electronics')}
            className="p-2.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-slate-800 text-left transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Electronics & Mobile</span>
            </div>
            <span className="text-[10px] text-gray-500">मोबाइल व गैजेट्स</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadTemplate('services')}
            className="p-2.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-slate-800 text-left transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-teal-700 font-bold text-xs">
              <Wrench className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Repairs & Services</span>
            </div>
            <span className="text-[10px] text-gray-500">सेवाएं व कांट्रैक्टर</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadTemplate('standard')}
            className="p-2.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-slate-800 text-left transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Standard Terms</span>
            </div>
            <span className="text-[10px] text-gray-500">जनरल ऑल-इन-वन</span>
          </button>
        </div>
      </div>

      {/* Quick Insert Clause Shortcuts */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Quick Insert Policy Clauses (क्विक पॉइंट जोड़ें):
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() =>
              handleInsertClause(
                'PAYMENT & ADVANCE POLICY (भुगतान नियम):',
                '- All payments are direct between the customer and the shop.\n- Accepted modes: UPI (PhonePe, Google Pay, Paytm), Bank Transfer, or Cash.\n- Zero platform commission.'
              )
            }
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3 h-3 text-orange-600" />
            <span>+ Payment Policy</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleInsertClause(
                'DELIVERY & STORE PICKUP TIMELINE (डिलीवरी समय सीमा):',
                '- Orders are processed within 2 to 4 hours of confirmation.\n- Express delivery available for local areas.\n- Store pickup is free during business hours.'
              )
            }
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3 h-3 text-orange-600" />
            <span>+ Delivery Time</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleInsertClause(
                'RETURN, EXCHANGE & REPLACEMENT (वापसी व एक्सचेंज नियम):',
                '- Report damaged or incorrect items within 24 hours of receiving.\n- Items must be unused with original tags/packaging.\n- Food/custom orders cannot be returned once prepared.'
              )
            }
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3 h-3 text-orange-600" />
            <span>+ Return Policy</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleInsertClause(
                'WARRANTY & GUARANTEE POLICY (वारंटी व गारंटी):',
                '- Genuine manufacturer warranty applies on branded goods.\n- In-house repair/services carry a 15-day workmanship guarantee.'
              )
            }
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3 h-3 text-orange-600" />
            <span>+ Warranty Policy</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleInsertClause(
                'CUSTOMER SUPPORT & HELPLINE (कस्टमर केयर):',
                `- For order status, WhatsApp or call ${ownerName} at +91 ${phone}.\n- Support Hours: 9:00 AM to 9:00 PM, Monday to Sunday.`
              )
            }
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3 h-3 text-orange-600" />
            <span>+ Support Helpline</span>
          </button>
        </div>
      </div>

      {/* Main Text Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <label htmlFor="vendor-tnc-textarea" className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-orange-600" />
            <span>Write Your Website's Terms & Conditions (दुकान के नियम व शर्तें):</span>
          </label>
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{lineCount} lines</span>
          </div>
        </div>

        <textarea
          id="vendor-tnc-textarea"
          rows={16}
          value={termsText}
          onChange={(e) => {
            setTermsText(e.target.value);
            setIsSaved(false);
            onMarkDirty?.();
          }}
          placeholder={`Yahan par apne store ke sabhi niyam likhein...\n\nExample:\n1. ORDER PLACEMENT\n- Customers can place orders via WhatsApp catalogue...\n\n2. PAYMENT TERMS\n- Direct UPI payment accepted...\n\n3. RETURN & EXCHANGE\n- 24 hours exchange for defective items...`}
          className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-xs sm:text-sm text-slate-900 leading-relaxed font-mono bg-white resize-y transition-all shadow-2xs"
        />

        <div className="flex items-center justify-between gap-3 pt-2 text-xs">
          <div className="text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Customers will see this formatted nicely in the popup modal from the footer or order checkout.</span>
          </div>

          <div className="flex items-center gap-2">
            {termsText.trim() && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Reset to default standard template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-102 active:scale-98"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Card */}
      {termsText.trim() && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Preview (How It Reads)</span>
            </h4>
            <button
              type="button"
              onClick={onOpenPreviewModal}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Open Customer Modal View →</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3 max-h-60 overflow-y-auto leading-relaxed whitespace-pre-line font-sans">
            {termsText}
          </div>
        </div>
      )}
    </div>
  );
};

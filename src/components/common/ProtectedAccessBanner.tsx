import React from 'react';
import { Lock, Store, ShieldCheck, ArrowLeft, LogIn } from 'lucide-react';

interface ProtectedAccessBannerProps {
  requiredRole: 'VENDOR' | 'ADMIN';
  onLogin: () => void;
  onGoHome: () => void;
}

export const ProtectedAccessBanner: React.FC<ProtectedAccessBannerProps> = ({
  requiredRole,
  onLogin,
  onGoHome,
}) => {
  const isVendor = requiredRole === 'VENDOR';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wider border border-red-200">
            {isVendor ? <Store className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
            <span>{isVendor ? 'Vendor Authentication Required' : 'Super Admin Authentication Required'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase font-['Outfit',sans-serif] tracking-tight">
            Dashboard Access Protected
          </h2>

          <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
            {isVendor
              ? 'Aap logged in nahi hain ya aapka session logout ho chuka hai. Vendor Dashboard access karne ke liye kripya apne registered Mobile Number / Shop ID aur Password se login karein.'
              : 'Super Admin Dashboard access karne ke liye authorized Super Admin credentials se login karein.'}
          </p>
        </div>

        <div className="bg-amber-50/70 rounded-xl p-3 text-[11px] text-amber-900 border border-amber-200 text-left space-y-1">
          <div className="font-bold uppercase tracking-wider text-[10px] text-amber-800 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Security Notice</span>
          </div>
          <p className="text-gray-700 text-[11px]">
            Logout ke baad ya bina credentials ke direct URL enter karne par kisi ko bhi kisi aur ki shop ya dashboard ka access nahi diya jata.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={onGoHome}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Home</span>
          </button>

          <button
            type="button"
            onClick={onLogin}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{isVendor ? 'Vendor Login' : 'Admin Login'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

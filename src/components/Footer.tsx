import React from 'react';
import { 
  Store, 
  PhoneCall, 
  Mail, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (tab?: 'LOGIN' | 'REGISTER' | 'ADMIN') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <footer className="bg-slate-900 text-gray-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top Editorial CTA Banner */}
        <div className="bg-orange-600 rounded-2xl p-6 sm:p-10 text-white shadow-xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 bg-black/20 text-orange-100 text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-sm mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Bharat Ka Apna Digital Catalogue SaaS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
                “2 Minute Mein Website Live Karo — Mobile Se Banao Apni Website”
              </h2>
              <p className="text-orange-100 text-sm sm:text-base mt-2">
                Join 5,000+ Indian local businesses, kirana stores, boutiques, restaurants & service vendors today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <button
                id="footer-start-free-btn"
                onClick={() => onOpenAuth('REGISTER')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-sm bg-white text-orange-700 font-bold uppercase tracking-wider text-xs hover:bg-orange-50 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>CREATE STORE FREE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/917087033009?text=Namaste%20IndianLalaJi%20mujhe%20website%20banani%20hai"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-sm bg-slate-900 text-white font-bold uppercase tracking-wider text-xs hover:bg-black transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp: 7087033009</span>
              </a>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14 text-sm">
          
          {/* Col 1: About Platform */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-xs">
                <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.2]" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white font-['Outfit',sans-serif]">
                INDIANLALAJI<span className="text-orange-500">.COM</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              IndianLalaJi.com is India's leading multi-vendor digital catalogue SaaS platform, empowering micro, small, and medium businesses across India to publish high-converting mobile digital stores in just 2 minutes.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-orange-400 px-2.5 py-1 rounded-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Indian Business Focused
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Admin Verified Stores
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs tracking-widest uppercase">Platform Pages</h3>
            <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-orange-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stores')} className="hover:text-orange-400 transition-colors">
                  Live Stores by Category
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-orange-400 transition-colors">
                  How It Works (4 Videos)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-orange-400 transition-colors">
                  Pricing Plans (1 Year)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-orange-400 transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs tracking-widest uppercase">Store Categories</h3>
            <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
              <li><button onClick={() => onNavigate('stores')} className="hover:text-orange-400">Retail & Kirana Stores</button></li>
              <li><button onClick={() => onNavigate('stores')} className="hover:text-orange-400">Clothing & Fashion Boutiques</button></li>
              <li><button onClick={() => onNavigate('stores')} className="hover:text-orange-400">Sweets, Bakeries & Food</button></li>
              <li><button onClick={() => onNavigate('stores')} className="hover:text-orange-400">Deep Cleaning & Maintenance</button></li>
              <li><button onClick={() => onNavigate('stores')} className="hover:text-orange-400">Mobile & Electronics Repair</button></li>
              <li><button onClick={() => onNavigate('stores')} className="hover:text-orange-400">Salons, Spa & Healthcare</button></li>
            </ul>
          </div>

          {/* Col 4: Customer Support */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs tracking-widest uppercase">Customer Support</h3>
            <div className="space-y-3 text-gray-400 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Helpline & WhatsApp</div>
                  <a href="tel:7087033009" className="text-orange-400 hover:underline font-mono font-bold">
                    +91 7087033009
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Email Support</div>
                  <a href="mailto:info@indianlalaji.com" className="text-gray-300 hover:underline">
                    info@indianlalaji.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Support Hours</div>
                  <div className="text-xs">Monday – Friday: 10:00 AM – 5:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Vendor & Admin Portal Access */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} IndianLalaJi.com — Digital Catalogue.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              id="footer-vendor-login-btn"
              onClick={() => onOpenAuth('LOGIN')}
              className="text-gray-400 hover:text-orange-400 font-semibold transition-colors uppercase tracking-wider text-[11px]"
            >
              Vendor Login
            </button>
            <span>•</span>
            <button
              id="footer-vendor-reg-btn"
              onClick={() => onOpenAuth('REGISTER')}
              className="text-gray-400 hover:text-orange-400 font-semibold transition-colors uppercase tracking-wider text-[11px]"
            >
              Create Store
            </button>
            <span>•</span>
            <button
              id="footer-admin-login-btn"
              onClick={() => onOpenAuth('ADMIN')}
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors uppercase tracking-wider text-[11px]"
            >
              Super Admin
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};


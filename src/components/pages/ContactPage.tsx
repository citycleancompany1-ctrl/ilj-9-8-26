import React, { useState } from 'react';
import { 
  Headphones, 
  PhoneCall, 
  Mail, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  ShieldCheck 
} from 'lucide-react';
import { PlatformLead } from '../../types';

interface ContactPageProps {
  onAddLead: (lead: Omit<PlatformLead, 'id' | 'date' | 'status'>) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onAddLead }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Retail & Shopping');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    onAddLead({
      name,
      phone,
      email,
      businessCategory,
      city,
      message,
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
          <Headphones className="w-3.5 h-3.5" /> Customer Care & Support
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight font-['Outfit',sans-serif]">
          Get in Touch With Us (<span className="text-orange-600">Contact Us</span>)
        </h1>
        <p className="text-gray-600 text-sm">
          Have a question, need help with store setup, or want to share feedback? Our support team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: Helpline & WhatsApp */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Official Helpline & WhatsApp</h3>
                <p className="text-xs text-gray-500">Connect directly via phone call or WhatsApp</p>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
              <span className="text-base font-black text-slate-900 font-mono">+91 7087033009</span>
              <a
                href="https://wa.me/917087033009?text=Hello%20IndianLalaJi%20Support"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-sm bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors shadow-xs"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Card 2: Email & Support Hours */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Email Address</h4>
                <a href="mailto:info@indianlalaji.com" className="text-xs text-orange-600 font-semibold hover:underline">
                  info@indianlalaji.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Working / Support Hours</h4>
                <p className="text-xs text-gray-600">Monday – Friday: 10:00 AM – 5:00 PM</p>
                <p className="text-[11px] text-gray-400">Closed on Sundays & National Holidays</p>
              </div>
            </div>
          </div>

          {/* Card 3: Trust Note */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-2 text-xs">
            <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Indian Business Guarantee</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              All store verification and activation requests are reviewed and processed by our Super Admin team within 2 hours.
            </p>
          </div>

        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Thank You! Your Message Has Been Received</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Our customer support team will contact you shortly at <strong>+91 {phone}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-5 py-2.5 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1 mb-2">
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Send an Inquiry or Message</h3>
                  <p className="text-xs text-gray-500">Fill out the form below and our team will get in touch with you promptly.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">City / State</label>
                    <input
                      type="text"
                      placeholder="e.g. Varanasi, UP"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Business Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Kirana Store, Boutique, Cleaning"
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your Message / Question *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="What questions or assistance do you need regarding your store website?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-sm border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry to Customer Care</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

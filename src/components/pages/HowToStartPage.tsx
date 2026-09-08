import React from 'react';
import { 
  Video, 
  Play, 
  Sparkles, 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  Share2 
} from 'lucide-react';
import { TutorialVideo } from '../../types';
import { VideoPlayerCard } from '../common/VideoPlayerCard';

interface HowToStartPageProps {
  tutorialVideos: TutorialVideo[];
  onOpenAuth: (tab?: 'LOGIN' | 'REGISTER' | 'ADMIN') => void;
}

export const HowToStartPage: React.FC<HowToStartPageProps> = ({
  tutorialVideos,
  onOpenAuth,
}) => {
  const steps = [
    {
      step: '1',
      title: 'Mobile Se Register Karein (30 Seconds)',
      desc: 'Apna Owner Name, Dukaan Ka Naam, Mobile Number aur Category select karke register karein.',
      icon: Smartphone,
    },
    {
      step: '2',
      title: 'Products, Services Aur Photos Upload Karein',
      desc: 'Mobile gallery se photo chunein, rate dalein, UPI Payment QR code upload karein.',
      icon: QrCode,
    },
    {
      step: '3',
      title: 'Admin Verification & Live Store URL',
      desc: 'Submit karte hi IndianLalaJi admin team review karke aapka store publish kar deti hai.',
      icon: ShieldCheck,
    },
    {
      step: '4',
      title: 'Grahakon Ko Share Karein & Order Paayein',
      desc: 'Apna Shop ID (/shop/SHP01234454) WhatsApp, Instagram aur visiting card par lagayein.',
      icon: Share2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
          <Video className="w-3.5 h-3.5" /> 4 Video Tutorials & Help Guides
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight font-['Outfit',sans-serif]">
          Mobile Se Dukaan Live Karne Ka <span className="text-orange-600">Aasan Tarika</span>
        </h1>
        <p className="text-gray-600 text-sm">
          Niche diye gaye 4 video guides ko dekhein ya step-by-step instructions follow karein.
        </p>
      </div>

      {/* 4 Step Process Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-black text-sm">
                {s.step}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-gray-100 text-orange-700 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
                <Icon className="w-3.5 h-3.5" />
                <span>Quick Step</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Guides Section with VideoPlayerCard */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
            <Play className="w-4 h-4 fill-orange-600 text-orange-600" />
            <span>Official Step-By-Step Video Guides ({tutorialVideos.length} Videos)</span>
          </h2>
          <span className="text-xs font-bold text-gray-500">Click any video to play or view fullscreen</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {tutorialVideos.map((vid, idx) => (
            <VideoPlayerCard
              key={vid.id}
              id={vid.id}
              title={vid.title}
              youtubeUrl={vid.youtubeUrl}
              duration={vid.duration}
              description={vid.description}
              badge={`Tutorial Video #${idx + 1}`}
              className="h-full"
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-4 shadow-lg">
        <h3 className="text-2xl font-black uppercase tracking-tight font-['Outfit',sans-serif]">
          Abhi Apna Store Banayein — 2 Minute Lagte Hain
        </h3>
        <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto">
          No credit card required. Free registration with your mobile number.
        </p>
        <button
          onClick={() => onOpenAuth('REGISTER')}
          className="px-8 py-3.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create Your Store Now</span>
        </button>
      </div>

    </div>
  );
};

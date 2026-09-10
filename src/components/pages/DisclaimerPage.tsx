import React from 'react';
import { 
  ShieldAlert, 
  Database, 
  Cpu, 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle,
  Lock,
  PhoneCall
} from 'lucide-react';

interface DisclaimerPageProps {
  onNavigateHome: () => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Back button */}
      <div>
        <button
          id="disclaimer-back-home-btn"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors bg-white border border-gray-200 px-4 py-2 rounded-md shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य पृष्ठ पर वापस जाएँ (Back to Home)</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[11px] font-black uppercase tracking-[0.2em] px-3.5 py-1 rounded-sm">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
            <span>Official Policy & Legal Notice</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-['Outfit',sans-serif]">
            डेटा एवं तकनीकी उत्तरदायित्व अस्वीकरण
          </h1>
          <h2 className="text-lg sm:text-xl font-bold text-orange-400">
            Technology & Data Disclaimer
          </h2>

          <div className="p-4 bg-slate-800/80 border-l-4 border-orange-500 rounded-r-lg mt-4 text-sm sm:text-base text-gray-200 leading-relaxed font-medium">
            “IndianLalaJi.com एक डिजिटल तकनीक (Technology Platform) है। हम किसी भी उपयोगकर्ता या ग्राहक का डेटा सेव नहीं करते हैं और न ही किसी प्रकार के नुकसान या लेन-देन की हमारी कोई ज़िम्मेदारी है — क्योंकि यह एक टेक्नोलॉजी है।”
          </div>
        </div>
      </div>

      {/* Core Policy Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Section 1: Data Storage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Database className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
            1. हम डेटा सेव नहीं करते (We Do Not Save Data)
          </h3>

          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>निजी डेटा सुरक्षा:</strong> IndianLalaJi.com किसी भी ग्राहक या विज़िटर का संवेदनशील निजी डेटा, बैंकिंग क्रेडेंशियल्स या क्रेडिट/डेबिट कार्ड डेटा सेव (Store) नहीं करता।
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>सीधा संपर्क:</strong> ग्राहक जब भी किसी स्टोर से ऑर्डर या पूछताछ भेजते हैं, तो वह सीधा दुकानदार के अपने WhatsApp नंबर या फ़ोन पर जाता है। IndianLalaJi.com बीच में कोई निजी चैट या पेमेंट डेटा स्टोर नहीं करता।
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>टेक्नोलॉजी आधारित कैटलॉग:</strong> डिजिटल कैटलॉग केवल उत्पाद प्रदर्शित करने का एक माध्यम है। दुकानदार अपनी सुविधानुसार डेटा अपडेट या डिलीट कर सकते हैं।
              </span>
            </li>
          </ul>
        </div>

        {/* Section 2: Zero Liability / Technology */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Cpu className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
            2. हमारी कोई ज़िम्मेदारी नहीं है — क्योंकि यह एक टेक्नोलॉजी है
          </h3>

          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <span>
                <strong>तकनीकी प्रकृति (Nature of Technology):</strong> यह प्लेटफ़ॉर्म विशुद्ध रूप से एक सॉफ्टवेयर और इंटरनेट तकनीक है। सर्वर डाउनटाइम, इंटरनेट कनेक्टिविटी, मोबाइल डिवाइस कम्पैटिबिलिटी, या तकनीकी त्रुटियों के लिए प्लेटफ़ॉर्म ज़िम्मेदार नहीं है।
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <span>
                <strong>लेनदेन व भुगतान की ज़िम्मेदारी नहीं:</strong> दुकानदार और ग्राहक के बीच होने वाले किसी भी नकद या ऑनलाइन भुगतान, सामान की डिलीवरी, उत्पाद की गुणवत्ता अथवा किसी भी आर्थिक नुकसान के लिए IndianLalaJi.com की कोई जवाबदेही या ज़िम्मेदारी नहीं है।
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <span>
                <strong>दुकानदार की सामग्री:</strong> स्टोर में अपलोड की गई फ़ोटो, कीमतें, ब्रांड नाम, ऑफ़र या विवरण के लिए स्वयं दुकानदार पूर्णतः उत्तरदायी हैं।
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Detailed Legal & Technological Clauses */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-orange-600" />
          <span>नियम एवं शर्तों का स्पष्टीकरण (Terms & Conditions Summary)</span>
        </h3>

        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            <strong>क. टेक्नोलॉजी फैसिलिटेटर मात्र:</strong> IndianLalaJi.com केवल एक डिजिटल स्टोरफ़्रंट निर्माण सॉफ्टवेयर (SaaS Tool) है। यह कोई ई-कॉमर्स बाज़ार (Marketplace) या वित्तीय संस्थान (Financial Institution) नहीं है। 
          </p>
          <p>
            <strong>ख. डेटा हानि या कैश क्लीयरेंस:</strong> यूज़र या वेंडर के डिवाइस, ब्राउज़र कैश या इंटरनेट समस्याओं के कारण यदि कोई डेटा रीसेट या अनुपलब्ध होता है, तो इसके लिए IndianLalaJi.com किसी भी क्षतिपूर्ति का भागीदार नहीं होगा।
          </p>
          <p>
            <strong>ग. आपसी विवाद:</strong> ग्राहक और दुकानदार के बीच किसी भी लेन-देन अथवा विवाद को दोनों पक्षों को स्वयं सुलझाना होगा। IndianLalaJi.com किसी मध्यस्थता या गारंटी का दावा नहीं करता है।
          </p>
          <p>
            <strong>घ. सहमति:</strong> इस वेबसाइट अथवा किसी भी संबंधित डिजिटल स्टोर का उपयोग करने पर यह मान लिया जाएगा कि आपने इन सभी नियमों व अस्वीकरणों को पढ़ लिया है और आप पूर्णतः सहमत हैं।
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>अंतिम संशोधन (Last Updated): {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-orange-500" />
            <span>सहायता डेस्क: +91 7087033009 | info@indianlalaji.com</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA to return */}
      <div className="text-center pt-4">
        <button
          onClick={onNavigateHome}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-md transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>होमपेज पर वापस जाएँ (Back to Home)</span>
        </button>
      </div>

    </div>
  );
};

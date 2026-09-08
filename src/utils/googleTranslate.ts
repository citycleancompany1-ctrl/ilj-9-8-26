import { SupportedLanguage } from './shopTranslations';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
    __googleTranslateInitialized?: boolean;
  }
}

// Map app language code to Google Translate language code
export function getGoogleLangCode(lang: SupportedLanguage): string {
  switch (lang) {
    case 'hi':
      return 'hi';
    case 'gu':
      return 'gu';
    case 'mr':
      return 'mr';
    case 'bn':
      return 'bn';
    case 'ta':
      return 'ta';
    case 'te':
      return 'te';
    case 'en':
      return 'en';
    case 'hinglish':
      return 'hi'; // Google Translate uses Hindi, while UI uses Hinglish dictionary
    default:
      return 'hi';
  }
}

/**
 * Sets Google Translate cookies so that Google Translate auto-translates to target language
 */
export function setGoogleTranslateCookies(langCode: string) {
  if (typeof document === 'undefined') return;

  const host = window.location.hostname;
  const domainList = ['', host, '.' + host.replace(/^www\./, '')];

  domainList.forEach((dom) => {
    const domainStr = dom ? `; domain=${dom}` : '';
    try {
      if (langCode === 'en' || !langCode) {
        document.cookie = `googtrans=; path=/${domainStr}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      } else {
        const cookieVal = `/auto/${langCode}`;
        document.cookie = `googtrans=${cookieVal}; path=/${domainStr}; SameSite=None; Secure`;
        document.cookie = `googtrans=${cookieVal}; path=/${domainStr}; SameSite=Lax`;
        document.cookie = `googtrans=${cookieVal}; path=/; SameSite=Lax`;
      }
    } catch (e) {
      // ignore
    }
  });
}

/**
 * Suppress any banner frames, injected bars, or top gaps caused by Google Translate
 */
export function suppressGoogleTranslateBar() {
  if (typeof document === 'undefined') return;

  const cleanup = () => {
    // Reset body top offset that Google injects (40px)
    if (document.body.style.top && document.body.style.top !== '0px') {
      document.body.style.top = '0px';
    }
    if (document.body.style.position === 'relative') {
      document.body.style.position = 'static';
    }

    // Hide all banner frames, iframe bars, and top bars injected by Google
    const bannerSelectors = [
      '.goog-te-banner-frame',
      'iframe.goog-te-banner-frame',
      'iframe.skiptranslate',
      'body > .skiptranslate',
      '.VIpgJd-ZVi9od-aZ2wEe-wOHMyf',
      '.VIpgJd-ZVi9od-OR95-psKmfa',
      '.VIpgJd-ZVi9od-O27K3e',
      '.VIpgJd-y6Aal-PfaGhd',
      '#goog-gt-tt',
      '.goog-tooltip',
    ];

    bannerSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        try {
          const htmlEl = el as HTMLElement;
          htmlEl.style.setProperty('display', 'none', 'important');
          htmlEl.style.setProperty('visibility', 'hidden', 'important');
          htmlEl.style.setProperty('height', '0px', 'important');
          htmlEl.style.setProperty('opacity', '0', 'important');
          htmlEl.style.setProperty('pointer-events', 'none', 'important');
          htmlEl.style.setProperty('position', 'absolute', 'important');
          htmlEl.style.setProperty('left', '-9999px', 'important');
          htmlEl.style.setProperty('top', '-9999px', 'important');
        } catch (e) {}
      });
    });
  };

  cleanup();

  if (!(window as any).__googleBannerSuppressedObserver) {
    (window as any).__googleBannerSuppressedObserver = true;
    try {
      const observer = new MutationObserver(() => {
        cleanup();
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    } catch (e) {}
  }
}

/**
 * Initialize the Google Translate script and off-screen container
 */
export function initGoogleTranslate(initialLang?: SupportedLanguage) {
  if (typeof window === 'undefined') return;

  suppressGoogleTranslateBar();

  // Reset default to English for all visitors unless explicitly changed in this version
  try {
    if (localStorage.getItem('shop_lang_default_v3') !== 'true') {
      localStorage.setItem('shop_lang_default_v3', 'true');
      localStorage.setItem('shop_preferred_language', 'en');
      setGoogleTranslateCookies('en');
    }
  } catch (e) {}

  // Check stored language preference (Default strictly 'en')
  const savedLang = initialLang || (localStorage.getItem('shop_preferred_language') as SupportedLanguage) || 'en';
  const targetGoogleCode = getGoogleLangCode(savedLang);

  if (targetGoogleCode !== 'en') {
    setGoogleTranslateCookies(targetGoogleCode);
  } else {
    setGoogleTranslateCookies('en');
  }

  // Ensure container exists without display: none so Google calculates bounds
  let container = document.getElementById('google_translate_element');
  if (!container) {
    container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '1px';
    container.style.height = '1px';
    container.style.opacity = '0.01';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-9999';
    document.body.appendChild(container);
  }

  // Define global init callback if not already set
  window.googleTranslateElementInit = () => {
    try {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,gu,mr,bn,ta,te',
            autoDisplay: false,
          },
          'google_translate_element'
        );
        window.__googleTranslateInitialized = true;

        // Apply translation once combo is rendered only if non-English
        if (savedLang !== 'en') {
          setTimeout(() => {
            applyGoogleTranslation(savedLang);
          }, 350);
        } else {
          setGoogleTranslateCookies('en');
        }
      }
    } catch (err) {
      console.warn('Google Translate initialization notice:', err);
    }
  };

  // Check if script already injected
  const existingScript = document.getElementById('google-translate-script');
  if (!existingScript && !document.querySelector('script[src*="translate.google.com"]')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  } else if (window.google?.translate?.TranslateElement) {
    window.googleTranslateElementInit();
  }
}

/**
 * Change the page language using Google Translate combo and cookies
 */
export function applyGoogleTranslation(targetLang: SupportedLanguage): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  const googleLang = getGoogleLangCode(targetLang);

  // Set cookies
  setGoogleTranslateCookies(googleLang);
  try {
    localStorage.setItem('shop_preferred_language', targetLang);
  } catch (e) {}

  const triggerChange = (selectCombo: HTMLSelectElement): boolean => {
    // Check available option values
    const options = Array.from(selectCombo.options).map((opt) => opt.value);
    let chosenVal = googleLang;

    if (googleLang === 'en' || targetLang === 'en') {
      chosenVal = options.includes('en') ? 'en' : '';
    } else if (!options.includes(googleLang)) {
      chosenVal = '';
    }

    selectCombo.value = chosenVal;
    selectCombo.dispatchEvent(new Event('change', { bubbles: true }));

    // Legacy DOM event dispatch
    try {
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      selectCombo.dispatchEvent(evt);
    } catch (e) {}

    setTimeout(() => {
      suppressGoogleTranslateBar();
    }, 50);

    return true;
  };

  // Try to find the select combo box created by Google Translate
  const selectCombo = document.querySelector<HTMLSelectElement>('.goog-te-combo');

  if (selectCombo) {
    return triggerChange(selectCombo);
  } else {
    // If not found yet, poll every 150ms up to 25 times
    let retries = 0;
    const interval = setInterval(() => {
      retries++;
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        clearInterval(interval);
        triggerChange(combo);
      } else if (retries >= 25) {
        clearInterval(interval);
      }
    }, 150);

    return false;
  }
}

'use client';

import { useState, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie_consent';
const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    preferences: false,
    statistics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid flash on page load
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs));
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);

    // Apply consent to analytics
    if (typeof window !== 'undefined') {
      // Google Analytics consent
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: prefs.statistics ? 'granted' : 'denied',
          ad_storage: prefs.marketing ? 'granted' : 'denied',
          functionality_storage: prefs.preferences ? 'granted' : 'denied',
          personalization_storage: prefs.preferences ? 'granted' : 'denied',
        });
      }

      // Facebook Pixel consent
      if ((window as any).fbq && prefs.marketing) {
        (window as any).fbq('consent', 'grant');
      }
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true,
    });
  };

  const acceptSelected = () => {
    saveConsent(preferences);
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      preferences: false,
      statistics: false,
      marketing: false,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => {}} // Prevent closing on backdrop click
      />
      
      {/* Modal */}
      <div className="relative bg-deep-black border border-sage/30 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-oxblood to-burgundy px-6 py-4">
          <h2 className="text-xl font-cinzel text-ivory flex items-center gap-2">
            <span className="text-2xl">🍪</span> Cookie Settings
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-deep-black">
          {!showDetails ? (
            // Simple view
            <div className="space-y-4">
              <p className="text-ivory/90 font-inter text-sm leading-relaxed">
                We use cookies to personalize content and ads, to provide social media features, 
                and to analyze our traffic. We also share information about your use of our site 
                with our social media, advertising, and analytics partners who may combine it 
                with other information that you've provided to them or that they've collected 
                from your use of their services.
              </p>
              
              <button
                onClick={() => setShowDetails(true)}
                className="text-sage hover:text-sage-light text-sm font-medium underline underline-offset-2 transition-colors"
              >
                Show details →
              </button>
            </div>
          ) : (
            // Detailed view
            <div className="space-y-4">
              <p className="text-ivory/90 font-inter text-sm leading-relaxed mb-4">
                Manage your cookie preferences below. You can enable or disable different types of cookies.
              </p>

              {/* Necessary cookies */}
              <div className="flex items-center justify-between py-3 border-b border-sage/20">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-ivory">Necessary</h3>
                  <p className="text-xs text-ivory/60 mt-1">
                    Essential for the website to function. Cannot be disabled.
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="sr-only"
                  />
                  <div className="w-11 h-6 bg-oxblood rounded-full cursor-not-allowed">
                    <div className="absolute right-1 top-1 bg-ivory w-4 h-4 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Preferences cookies */}
              <div className="flex items-center justify-between py-3 border-b border-sage/20">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-ivory">Preferences</h3>
                  <p className="text-xs text-ivory/60 mt-1">
                    Remember your settings and preferences for a better experience.
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, preferences: !p.preferences }))}
                  className="relative"
                >
                  <div className={`w-11 h-6 rounded-full transition-colors ${
                    preferences.preferences ? 'bg-oxblood' : 'bg-charcoal'
                  }`}>
                    <div className={`absolute top-1 w-4 h-4 bg-ivory rounded-full transition-transform ${
                      preferences.preferences ? 'right-1' : 'left-1'
                    }`} />
                  </div>
                </button>
              </div>

              {/* Statistics cookies */}
              <div className="flex items-center justify-between py-3 border-b border-sage/20">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-ivory">Statistics</h3>
                  <p className="text-xs text-ivory/60 mt-1">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, statistics: !p.statistics }))}
                  className="relative"
                >
                  <div className={`w-11 h-6 rounded-full transition-colors ${
                    preferences.statistics ? 'bg-oxblood' : 'bg-charcoal'
                  }`}>
                    <div className={`absolute top-1 w-4 h-4 bg-ivory rounded-full transition-transform ${
                      preferences.statistics ? 'right-1' : 'left-1'
                    }`} />
                  </div>
                </button>
              </div>

              {/* Marketing cookies */}
              <div className="flex items-center justify-between py-3">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-ivory">Marketing</h3>
                  <p className="text-xs text-ivory/60 mt-1">
                    Used to track visitors across websites for advertising purposes.
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                  className="relative"
                >
                  <div className={`w-11 h-6 rounded-full transition-colors ${
                    preferences.marketing ? 'bg-oxblood' : 'bg-charcoal'
                  }`}>
                    <div className={`absolute top-1 w-4 h-4 bg-ivory rounded-full transition-transform ${
                      preferences.marketing ? 'right-1' : 'left-1'
                    }`} />
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="text-sage hover:text-sage-light text-sm font-medium underline underline-offset-2 transition-colors"
              >
                ← Back to summary
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-charcoal/50 border-t border-sage/20 space-y-2">
          {showDetails ? (
            <button
              onClick={acceptSelected}
              className="w-full py-3 px-4 bg-gradient-to-r from-oxblood to-burgundy hover:from-burgundy hover:to-oxblood text-ivory font-inter font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-oxblood/20"
            >
              Save Preferences
            </button>
          ) : (
            <button
              onClick={acceptAll}
              className="w-full py-3 px-4 bg-gradient-to-r from-oxblood to-burgundy hover:from-burgundy hover:to-oxblood text-ivory font-inter font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-oxblood/20"
            >
              Accept All
            </button>
          )}
          <button
            onClick={rejectAll}
            className="w-full py-3 px-4 bg-charcoal hover:bg-charcoal/80 text-ivory/80 hover:text-ivory font-inter font-medium rounded-lg transition-colors border border-sage/20"
          >
            Reject All
          </button>
        </div>

        {/* Footer link */}
        <div className="px-6 py-3 bg-deep-black border-t border-sage/10 text-center">
          <a 
            href="/polityka-prywatnosci" 
            className="text-xs text-ivory/50 hover:text-sage transition-colors"
          >
            Learn more about our Privacy Policy
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

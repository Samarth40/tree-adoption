import React, { useEffect, useState } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import AnimatedHero from '../components/AnimatedHero';
import HomeAbout from '../components/HomeAbout';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Impact from '../components/Impact';
import CallToAction from '../components/CallToAction';
import ScrollProgress from '../components/ScrollProgress';
import SectionDivider from '../components/SectionDivider';
import ChatWidget from '../components/ChatWidget';
import AmbientBackground from '../components/AmbientBackground';
import LoadingScreen from '../components/LoadingScreen';

const HomePage = () => {
  const { scrollY } = useScroll();
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowCookieConsent(true);
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Show content with a slight delay after loading
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(visibilityTimer);
    };
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      analytics: true,
      functional: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowCookieConsent(false);
  };

  const handlePreferences = () => {
    setShowPreferences(true);
  };

  const handleSavePreferences = (preferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }));
    setShowCookieConsent(false);
    setShowPreferences(false);
  };

  // Smooth scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <motion.div 
        className="overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <ScrollProgress />
        <div className="grain-overlay" />
        <AmbientBackground />
        <ChatWidget />
        
        {/* Main Content */}
        <div className="relative">
          {/* Hero Section */}
          <motion.section 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatedHero />
            <SectionDivider variant="wave" />
          </motion.section>

          {/* About Section with Parallax */}
          <motion.section
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <HomeAbout />
            <SectionDivider variant="curve" />
          </motion.section>

          {/* Features Section */}
          <motion.section
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Features />
            <SectionDivider variant="triangle" />
          </motion.section>

          {/* Impact Section with Parallax */}
          <motion.section
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Impact />
            <SectionDivider variant="wave" />
          </motion.section>

          {/* Testimonials Section */}
          <motion.section
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Testimonials />
            <SectionDivider variant="curve" />
          </motion.section>

          {/* Call to Action Section */}
          <motion.section
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <CallToAction />
          </motion.section>
        </div>

        {/* Floating Action Button for quick navigation */}
        <motion.button
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-forest-green text-white shadow-enhanced glass flex items-center justify-center transform-gpu hover:scale-110 transition-transform z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: scrollY > 200 ? 1 : 0,
            scale: scrollY > 200 ? 1 : 0.8,
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </motion.button>

        {/* Cookie Consent Banner */}
        <AnimatePresence>
          {showCookieConsent && !showPreferences && (
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 shadow-lg z-40"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-600 text-sm">
                  We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                </p>
                <div className="flex gap-2">
                  <motion.button
                    className="px-4 py-2 bg-forest-green text-white rounded-lg text-sm hover:bg-sage-green transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAcceptCookies}
                  >
                    Accept All
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePreferences}
                  >
                    Preferences
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cookie Preferences Modal */}
        <AnimatePresence>
          {showPreferences && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-forest-green mb-4">Cookie Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">Essential Cookies</h3>
                        <p className="text-sm text-gray-600">Required for the website to function properly</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" checked disabled className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">Analytics Cookies</h3>
                        <p className="text-sm text-gray-600">Help us improve our website</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4"
                          onChange={(e) => {
                            const preferences = JSON.parse(localStorage.getItem('cookieConsent') || '{}');
                            preferences.analytics = e.target.checked;
                            localStorage.setItem('cookieConsent', JSON.stringify(preferences));
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">Marketing Cookies</h3>
                        <p className="text-sm text-gray-600">Used for targeted advertising</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4"
                          onChange={(e) => {
                            const preferences = JSON.parse(localStorage.getItem('cookieConsent') || '{}');
                            preferences.marketing = e.target.checked;
                            localStorage.setItem('cookieConsent', JSON.stringify(preferences));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-2">
                  <motion.button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPreferences(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-forest-green text-white rounded-lg text-sm hover:bg-sage-green transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const preferences = JSON.parse(localStorage.getItem('cookieConsent') || '{}');
                      handleSavePreferences(preferences);
                    }}
                  >
                    Save Preferences
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default HomePage; 
import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedHero = () => {
  const scrollToFeatures = useCallback(() => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background - Optimized with transform-gpu */}
      <motion.div 
        className="absolute inset-0 z-0 transform-gpu"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: 1,
          ease: "easeOut"
        }}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3')",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          willChange: "transform"
        }}
      >
        <div className="absolute inset-0 bg-forest-green/40 backdrop-blur-[2px]" />
      </motion.div>

      {/* Content */}
      <AnimatePresence>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut"
              }}
            >
              <motion.span 
                className="block mb-2 drop-shadow-lg transform-gpu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.2,
                  ease: "easeOut"
                }}
              >
                Adopt a Tree,
              </motion.span>
              <motion.span 
                className="block text-cream transform-gpu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.3,
                  ease: "easeOut"
                }}
              >
                Make an Impact!
              </motion.span>
            </motion.h1>
            <motion.p 
              className="mt-6 text-xl text-cream md:max-w-2xl mx-auto drop-shadow-lg transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: 0.4,
                ease: "easeOut"
              }}
            >
              Join our mission to create a greener future. Every tree adoption contributes to environmental conservation and helps combat climate change.
            </motion.p>
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: 0.5,
                ease: "easeOut"
              }}
            >
              <motion.button 
                className="px-8 py-4 bg-leaf-green text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-sage-green transform hover:-translate-y-1 transition-all duration-200"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Adopt a Tree Now
              </motion.button>
              <motion.button 
                className="px-8 py-4 bg-white/90 backdrop-blur-sm text-forest-green text-lg font-semibold rounded-lg shadow-lg hover:bg-white transform hover:-translate-y-1 transition-all duration-200"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={scrollToFeatures}
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>

      {/* Scroll Indicator - Optimized animation */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer transform-gpu"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.5, 1, 0.5],
          y: [0, 8, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut"
        }}
        onClick={scrollToFeatures}
      >
        <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </div>
  );
};

export default React.memo(AnimatedHero); 
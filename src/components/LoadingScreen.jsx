import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center relative">
        {/* Background blur effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-forest-green/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-leaf-green/10 rounded-full blur-2xl" />
        </div>

        {/* Logo */}
        <motion.img 
          src="/TreeAdopt Logo.png" 
          alt="VanaRaksha Logo" 
          className="h-24 w-auto mx-auto mb-8"
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.8, 1, 0.8] 
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Loading Bar Container */}
        <div className="w-64 h-2 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden mb-6 relative shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-forest-green via-leaf-green to-forest-green rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          className="text-forest-green text-lg font-medium bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading VanaRaksha...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen; 
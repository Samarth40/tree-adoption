import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Donation package data
const donationPackages = [
  {
    amount: 10,
    trees: 1,
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L17 7V13L12 17L7 13V7L12 3Z" className="fill-forest-green/20" />
        <path d="M12 6L14 8V12L12 14L10 12V8L12 6Z" className="fill-forest-green" />
      </svg>
    ),
    perks: ["Digital certificate", "Impact tracker"],
    accentColor: "bg-[#E8F5E9]",
    borderColor: "border-[#81C784]",
    textColor: "text-[#2E7D32]"
  },
  {
    amount: 50,
    trees: 5,
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L16 6L12 10L8 6L12 2Z" className="fill-forest-green/20" />
        <path d="M12 8L16 12L12 16L8 12L12 8Z" className="fill-forest-green/20" />
        <path d="M12 14L16 18L12 22L8 18L12 14Z" className="fill-forest-green" />
      </svg>
    ),
    perks: ["Digital certificate", "Growth updates", "Name on website"],
    accentColor: "bg-[#F1F8E9]",
    borderColor: "border-[#AED581]",
    textColor: "text-[#558B2F]",
    popular: true
  },
  {
    amount: 100,
    trees: 10,
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" className="fill-forest-green/20" />
        <path d="M12 6C14.2091 6 16 7.79086 16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10C8 7.79086 9.79086 6 12 6Z" className="fill-forest-green" />
        <path d="M12 16L15 20H9L12 16Z" className="fill-forest-green" />
      </svg>
    ),
    perks: ["All previous perks", "Thank you video", "Priority support"],
    accentColor: "bg-[#DCEDC8]",
    borderColor: "border-[#8BC34A]",
    textColor: "text-[#33691E]"
  }
];

// Top donors data
const topDonors = [
  { name: "Sarah J.", trees: 50, amount: 500 },
  { name: "Michael R.", trees: 30, amount: 300 },
  { name: "Emma W.", trees: 25, amount: 250 },
  // ... add more donors
];

// Add this animation variant
const coinToTreeAnimation = {
  initial: { scale: 0.8, y: -50 },
  animate: {
    scale: [0.8, 1.2, 1],
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Add pulsing animation for CTA
const pulsingButton = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 0 rgba(76, 175, 80, 0.4)",
      "0 0 20px rgba(76, 175, 80, 0.6)",
      "0 0 0 rgba(76, 175, 80, 0.4)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Add these SVG components at the top with other constants
const PaymentSVGs = {
  oneTime: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8V12L14 14" className="stroke-current stroke-2 rounded-full" />
      <circle cx="12" cy="12" r="9" className="stroke-current stroke-2" />
    </svg>
  ),
  monthly: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H16" className="stroke-current stroke-2" />
      <path d="M12 3L15 6M12 3L9 6M12 3V14" className="stroke-current stroke-2" />
    </svg>
  ),
  paypal: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.5 8.5C19.5 11.5 17 14 14 14H11L10 19H7L8.5 8.5H14C17 8.5 19.5 5.5 19.5 8.5Z" className="fill-current" />
      <path d="M16.5 5.5C16.5 8.5 14 11 11 11H8L7 16H4L5.5 5.5H11C14 5.5 16.5 2.5 16.5 5.5Z" className="fill-current opacity-50" />
    </svg>
  ),
  card: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="2" className="stroke-current stroke-2" />
      <path d="M2 10H22" className="stroke-current stroke-2" />
      <path d="M6 15H10" className="stroke-current stroke-2" />
    </svg>
  )
};

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const navigate = useNavigate();

  // Add ref for smooth scroll
  const transparencyRef = useRef(null);

  const scrollToTransparency = () => {
    transparencyRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  // Add redirection function for EcoVerify
  const handleEcoVerifyClick = () => {
    window.open('https://www.globalreporting.org', '_blank');
  };

  // Add redirection function for Plant Trees
  const handlePlantTreesClick = () => {
    navigate('/explore');
  };

  return (
    <div className="min-h-screen bg-cream snap-y snap-mandatory overflow-x-hidden">
      {/* Hero Section - Full Window Height */}
      <section className="relative h-screen w-screen flex items-center justify-center overflow-hidden snap-start">
        {/* Modern animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green via-forest-green/95 to-forest-green/90">
          {/* Animated circles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5 backdrop-blur-sm"
              initial={{ 
                width: `${200 + i * 100}px`,
                height: `${200 + i * 100}px`,
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0.1
              }}
              animate={{ 
                x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}

          {/* Animated leaf particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  top: '-20%',
                  left: `${Math.random() * 100}%`,
                  rotate: 0,
                  opacity: 0
                }}
                animate={{ 
                  top: '120%',
                  rotate: 360,
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "linear"
                }}
              >
                <span className="text-4xl transform rotate-45">
                  {['🌱', '🍃', '🌿'][Math.floor(Math.random() * 3)]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-left space-y-8"
            >
              <div className="space-y-4">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm
                           text-white/90 text-sm font-medium border border-white/20"
                >
                  🌍 Make a Difference Today
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl sm:text-7xl md:text-8xl font-bold"
                >
                  <span className="text-white">Plant a Tree,</span>
                  <motion.span 
                    className="block text-leaf-green mt-2"
                    animate={{
                      scale: [1, 1.02, 1],
                      transition: { duration: 2, repeat: Infinity }
                    }}
                  >
                    Grow Hope
                  </motion.span>
                </motion.h1>
              </div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl sm:text-2xl text-white/80 font-light max-w-xl"
              >
                Join our mission to restore Earth's green cover. Every tree you sponsor helps combat climate change and creates a better future.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(76, 175, 80, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlantTreesClick}
                  className="px-8 py-4 text-xl font-semibold text-forest-green bg-leaf-green 
                           hover:bg-white rounded-2xl shadow-xl transition-all duration-300 
                           flex items-center gap-3 group"
                >
                  <span>Plant Trees Now</span>
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={scrollToTransparency}
                  className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30
                           hover:bg-white/10 rounded-2xl transition-all duration-300 backdrop-blur-sm
                           flex items-center gap-2"
                >
                  <span>Learn More</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Content - Creative Stats Display */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* 3D Tree Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotateY: 45 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                className="absolute -top-20 -right-10 w-40 h-40 bg-gradient-to-br from-leaf-green to-forest-green
                          rounded-2xl shadow-2xl transform rotate-12 backdrop-blur-lg
                          flex items-center justify-center border border-white/20"
              >
                <span className="text-8xl transform -rotate-12">🌳</span>
              </motion.div>

              {/* Main Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8
                          border border-white/20 relative overflow-hidden"
              >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-full h-1 bg-gradient-to-r from-leaf-green/20 to-transparent"
                      style={{ top: `${30 + i * 30}%` }}
                      animate={{
                        x: ['-100%', '100%'],
                        opacity: [0.1, 0.5, 0.1]
                      }}
                      transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                </div>
                
                {/* Interactive Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8 relative">
                  {[
                    { label: 'Trees Planted', value: '47,582', icon: '🌳', color: 'from-leaf-green to-forest-green' },
                    { label: 'CO₂ Offset', value: '2,150', unit: 'tons', icon: '🌍', color: 'from-forest-green to-leaf-green' },
                    { label: 'Success Rate', value: '95%', icon: '📈', color: 'from-leaf-green to-forest-green' },
                    { label: 'Active Projects', value: '12', icon: '🎯', color: 'from-forest-green to-leaf-green' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-forest-green/20 to-leaf-green/20 
                                    rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 
                                    opacity-0 group-hover:opacity-100" />
                      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 
                                    border border-white/20 group-hover:border-white/30 
                                    transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{stat.icon}</span>
                          <div className="h-px flex-grow bg-gradient-to-r from-white/20 to-transparent" />
                        </div>
                        <div className="text-2xl font-bold text-white group-hover:bg-gradient-to-r 
                                      group-hover:from-white group-hover:to-white/90 
                                      group-hover:bg-clip-text group-hover:text-transparent
                                      transition-all duration-300">
                          {stat.value}
                          {stat.unit && <span className="text-sm ml-1">{stat.unit}</span>}
                        </div>
                        <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Animated Progress Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-forest-green/20 to-leaf-green/20 
                                rounded-2xl blur-lg opacity-50" />
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 
                                border border-white/20">
                    <div className="flex justify-between text-sm text-white/80 mb-3">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-leaf-green animate-pulse" />
                        Progress to Goal
                      </span>
                      <span className="font-bold text-white">80%</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-leaf-green via-forest-green to-leaf-green animate-gradient" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
                      </motion.div>
                    </div>
                    <div className="mt-3 text-sm text-white/60">
                      <span className="text-white font-medium">2,418</span> trees needed to reach 50,000
                    </div>
                  </div>
                </motion.div>

                {/* Floating Achievement Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 }}
                  className="absolute -bottom-6 -right-6 transform rotate-12
                            bg-gradient-to-br from-yellow-400/90 to-yellow-600/90 
                            w-32 h-32 rounded-full backdrop-blur-sm
                            flex items-center justify-center border-4 border-white/30
                            shadow-2xl"
                >
                  <div className="transform -rotate-12 text-center">
                    <div className="text-3xl mb-1">🏆</div>
                    <div className="text-white text-sm font-bold">Top Rated</div>
                    <div className="text-white/80 text-xs">Eco Project</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                onClick={handleEcoVerifyClick}
                className="absolute -bottom-4 left-8 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl
                          border border-white/20 flex items-center gap-3 group hover:bg-white/20 
                          transition-all duration-300 cursor-pointer"
              >
                <svg className="w-6 h-6 text-leaf-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-white font-medium">Verified by</span>
                  <span className="text-leaf-green font-bold">EcoVerify™</span>
                </div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5 text-leaf-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section - Full Window Height */}
      <section className="h-screen w-screen bg-white relative overflow-hidden snap-start">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMmw3LjMyMSA0LjIydjguNDRMMjAgMTkuMDc4bC03LjMyMS00LjQxOHYtOC40NEwyMCAyeiIgc3Ryb2tlPSIjNENBRjUwMjAiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 relative flex flex-col justify-center">
          <div className="text-center mb-12">
            <h2 className="text-6xl sm:text-7xl font-bold text-forest-green mb-6 tracking-tight">
              Choose Your Impact
            </h2>
            <p className="text-2xl text-earth-brown/80 max-w-2xl mx-auto">
              Select a package that matches your giving goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-h-[70vh] px-4 mt-4">
            {donationPackages.map((pkg) => (
              <motion.div
                key={pkg.amount}
                whileHover={{ y: -10 }}
                className="relative group h-full"
              >
                {pkg.popular && (
                  <div className="absolute -top-4 inset-x-0 z-10 text-center">
                    <span className="bg-forest-green text-white px-6 py-2 rounded-full text-sm
                                  shadow-lg inline-block">
                      Most Popular Choice
                    </span>
                  </div>
                )}
                
                <div className={`h-full ${pkg.accentColor} rounded-3xl overflow-hidden 
                              shadow-lg group-hover:shadow-2xl transition-all duration-500
                              border-2 ${pkg.borderColor}`}>
                  <div className="relative p-8 h-full flex flex-col">
                    {/* Icon Container */}
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-white rounded-2xl p-3
                                    transform group-hover:scale-110 transition-transform duration-500
                                    shadow-md">
                        {pkg.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-grow space-y-6">
                      <div>
                        <h3 className={`text-4xl font-bold ${pkg.textColor} mb-1`}>
                          ${pkg.amount}
                        </h3>
                        <p className={`${pkg.textColor}/80 text-lg`}>
                          Plants {pkg.trees} {pkg.trees === 1 ? 'Tree' : 'Trees'}
                        </p>
                      </div>

                      <ul className="space-y-4 flex-grow">
                        {pkg.perks.map((perk, i) => (
                          <li key={i} className={`flex items-start ${pkg.textColor}/80`}>
                            <svg className={`w-5 h-5 mr-3 mt-1 ${pkg.textColor}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
                            </svg>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAmount(pkg.amount)}
                        className={`w-full bg-forest-green text-white font-semibold py-4 rounded-xl 
                                 hover:bg-forest-green/90 transition-all duration-300
                                 shadow-md`}
                      >
                        Select Package
                      </motion.button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-forest-green/5 rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-forest-green/5 rounded-tr-full" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Section - Full Window Height */}
      <section className="h-screen w-screen bg-gradient-to-br from-forest-green/5 to-cream relative overflow-hidden snap-start">
        {/* Modern geometric patterns background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-forest-green/20"
                style={{
                  width: Math.random() * 300 + 50 + 'px',
                  height: Math.random() * 300 + 50 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  transform: `scale(${Math.random() + 0.5})`,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="h-full max-w-4xl mx-auto px-4 sm:px-6 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h3 className="text-6xl font-bold text-forest-green mb-6 tracking-tight">
                Complete Your Impact
              </h3>
              <p className="text-xl text-earth-brown/80">Choose your preferred payment method</p>
            </motion.div>
            
            {/* Modern Payment Type Selection */}
            <div className="flex justify-center gap-8 mb-16">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsRecurring(false)}
                className={`group flex flex-col items-center gap-4 relative ${!isRecurring ? 'text-forest-green' : 'text-forest-green/40'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                              ${!isRecurring ? 'bg-forest-green/10 shadow-lg' : 'bg-forest-green/5'}`}>
                  {PaymentSVGs.oneTime}
                </div>
                <span className="font-medium">One-time</span>
                {!isRecurring && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute -bottom-2 w-12 h-1 bg-forest-green rounded-full"
                  />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsRecurring(true)}
                className={`group flex flex-col items-center gap-4 relative ${isRecurring ? 'text-forest-green' : 'text-forest-green/40'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                              ${isRecurring ? 'bg-forest-green/10 shadow-lg' : 'bg-forest-green/5'}`}>
                  {PaymentSVGs.monthly}
                </div>
                <span className="font-medium">Monthly</span>
                {isRecurring && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute -bottom-2 w-12 h-1 bg-forest-green rounded-full"
                  />
                )}
              </motion.button>
            </div>

            {/* Modern Payment Buttons */}
            <div className="space-y-6 max-w-lg mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-[#0070BA] rounded-2xl hover:bg-[#003087] 
                         transition-all duration-300 flex items-center justify-center gap-4
                         relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    {PaymentSVGs.paypal}
                  </div>
                  <span className="font-medium text-lg text-white">Pay with PayPal</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-forest-green to-leaf-green rounded-2xl
                         transition-all duration-300 flex items-center justify-center gap-4
                         relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    {PaymentSVGs.card}
                  </div>
                  <span className="font-medium text-lg text-white">Pay with Card</span>
                </div>
              </motion.button>
            </div>

            {/* Modern Security Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-sm
                            border border-forest-green/10 shadow-sm">
                <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-forest-green">Secure Payments</span>
                  <span className="text-xs text-forest-green/60">256-bit SSL encryption</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Donor Recognition - Tree Champions */}
      <section className="min-h-screen w-screen bg-gradient-to-br from-white via-forest-green/5 to-cream relative overflow-hidden snap-start py-20">
        {/* Modern geometric background */}
        <div className="absolute inset-0">
          <svg className="absolute w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[...Array(10)].map((_, i) => (
              <path
                key={i}
                d={`M${i * 10},0 L${i * 10 + 5},100 L${i * 10 + 10},0`}
                className="fill-forest-green/20"
              />
            ))}
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-forest-green/10 text-forest-green text-sm font-medium mb-4">
              Our Community
            </span>
            <h2 className="text-6xl sm:text-7xl font-bold text-forest-green mb-6 tracking-tight">
              Tree Champions
            </h2>
            <p className="text-xl text-earth-brown/80 max-w-2xl mx-auto">
              Join our growing community of environmental heroes making a real impact
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {topDonors.map((donor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-forest-green/20 to-leaf-green/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-forest-green/10 shadow-xl">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transform rotate-45 overflow-hidden
                                    ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                      index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                                      'bg-gradient-to-br from-leaf-green to-forest-green'}`}
                      >
                        <span className="text-2xl font-bold text-white transform -rotate-45">#{index + 1}</span>
                      </div>
                      {index < 3 && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-2 rounded-2xl border-2 border-dashed border-forest-green/20 -z-10"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-forest-green">{donor.name}</span>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-forest-green to-leaf-green bg-clip-text text-transparent">
                            {donor.trees}
                          </div>
                          <div className="text-sm text-forest-green/60">trees planted</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="h-2 bg-forest-green/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(donor.trees / 100) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-forest-green to-leaf-green"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Modern Join CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(76, 175, 80, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 bg-gradient-to-r from-forest-green to-leaf-green text-white 
                       rounded-2xl shadow-xl font-semibold text-lg transition-all duration-300
                       flex items-center gap-3 mx-auto group"
            >
              <span>Join the Champions</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Modern Transparency Section */}
      <section className="min-h-screen w-screen bg-gradient-to-br from-forest-green/5 via-white to-cream relative overflow-hidden snap-start py-20" ref={transparencyRef}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(76,175,80,0.1),transparent)]" />
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.2, 1],
                rotate: 360
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute rounded-full border border-forest-green/20"
              style={{
                width: `${400 + i * 200}px`,
                height: `${400 + i * 200}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-forest-green/10 text-forest-green text-sm font-medium mb-4">
              Transparency
            </span>
            <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-forest-green via-leaf-green to-forest-green bg-clip-text text-transparent mb-6">
              Your Impact Breakdown
            </h2>
            <p className="text-xl text-earth-brown/80 max-w-2xl mx-auto">
              See exactly how your contribution creates positive change
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { title: 'Tree Planting', value: 70, color: 'from-leaf-green to-forest-green', icon: '🌱' },
              { title: 'Maintenance', value: 20, color: 'from-forest-green to-earth-brown', icon: '🔧' },
              { title: 'Operations', value: 10, color: 'from-earth-brown to-leaf-green', icon: '⚙️' }
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-forest-green/20 to-leaf-green/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-forest-green/10 shadow-xl h-full">
                  <div className="text-4xl mb-6">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-forest-green mb-4">
                    {item.title}
                  </h3>
                  <div className="text-5xl font-bold bg-gradient-to-r from-forest-green to-leaf-green bg-clip-text text-transparent mb-6">
                    {item.value}%
                  </div>
                  <div className="h-2 bg-forest-green/10 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${item.color}`}
                    />
                  </div>
                  <p className="text-earth-brown/80">
                    {item.title === 'Tree Planting' && 'Direct investment in planting new trees and initial care'}
                    {item.title === 'Maintenance' && 'Ensuring long-term survival and growth monitoring'}
                    {item.title === 'Operations' && 'Essential platform and administrative costs'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Success Rate', value: '95%', icon: '📈' },
              { label: 'Trees Planted', value: '47,582', icon: '🌳' },
              { label: 'CO₂ Offset', value: '2,150', unit: 'tons', icon: '🌍' },
              { label: 'Active Projects', value: '12', icon: '🎯' }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 text-center border border-forest-green/10 shadow-lg"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-forest-green">
                  {stat.value}
                  {stat.unit && <span className="text-sm ml-1">{stat.unit}</span>}
                </div>
                <div className="text-sm text-earth-brown/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate; 
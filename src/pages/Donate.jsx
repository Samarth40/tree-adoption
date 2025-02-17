import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Donation package data
const donationPackages = [
  {
    amount: 10,
    trees: 1,
    icon: "🌱",
    perks: ["Digital certificate", "Impact tracker"],
    color: "from-leaf-green to-forest-green"
  },
  {
    amount: 50,
    trees: 5,
    icon: "🌳",
    perks: ["Digital certificate", "Growth updates", "Name on website"],
    color: "from-sky-blue to-leaf-green",
    popular: true
  },
  {
    amount: 100,
    trees: 10,
    icon: "🌍",
    perks: ["All previous perks", "Thank you video", "Priority support"],
    color: "from-forest-green to-earth-brown"
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

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-green/90 to-forest-green/70">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#4CAF5020_1px,transparent_1px)] [background-size:20px_20px]" />
          
          {/* Coin to Tree Animation */}
          <motion.div
            variants={coinToTreeAnimation}
            initial="initial"
            animate="animate"
            className="absolute top-1/4 right-1/4 text-8xl opacity-20"
          >
            💰
          </motion.div>
          <motion.div
            variants={coinToTreeAnimation}
            initial="initial"
            animate="animate"
            transition={{ delay: 1 }}
            className="absolute bottom-1/4 left-1/4 text-8xl opacity-20"
          >
            🌳
          </motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold"
            >
              <span className="text-white">Every Penny</span>
              <motion.span 
                className="block text-leaf-green mt-2"
                animate={{
                  scale: [1, 1.02, 1],
                  transition: { duration: 2, repeat: Infinity }
                }}
              >
                Plants a Tree
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto font-light"
            >
              Your donation fights deforestation & restores ecosystems
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Primary CTA */}
              <motion.button
                variants={pulsingButton}
                initial="initial"
                animate="pulse"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-xl font-semibold text-white bg-leaf-green 
                         hover:bg-forest-green rounded-full shadow-xl transition-all duration-300"
              >
                Donate Now
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToTransparency}
                className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30
                         hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                Learn How Your Donation Helps
              </motion.button>
            </div>

            {/* Live Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-lg mx-auto"
            >
              <h3 className="text-white/90 text-lg mb-2">Trees Funded This Year</h3>
              <div className="text-4xl font-bold text-leaf-green">47,582</div>
              <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "80%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-leaf-green h-full rounded-full"
                />
              </div>
              <p className="text-white/80 text-sm mt-2">
                80% to our goal of 50,000 trees
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Visualization */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-forest-green mb-4">
              Choose Your Impact
            </h2>
            <p className="text-xl text-earth-brown/80">
              Select a package that matches your giving goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationPackages.map((pkg) => (
              <motion.div
                key={pkg.amount}
                whileHover={{ y: -10 }}
                className={`relative rounded-2xl overflow-hidden shadow-xl 
                           ${pkg.popular ? 'ring-4 ring-leaf-green' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-leaf-green text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-8 bg-gradient-to-br ${pkg.color}`}>
                  <span className="text-6xl block mb-6">{pkg.icon}</span>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    ${pkg.amount}
                  </h3>
                  <p className="text-white/90 text-lg mb-6">
                    Plants {pkg.trees} {pkg.trees === 1 ? 'Tree' : 'Trees'}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {pkg.perks.map((perk, i) => (
                      <li key={i} className="flex items-center text-white">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAmount(pkg.amount)}
                    className="w-full bg-white text-forest-green font-semibold py-3 rounded-xl 
                             hover:bg-forest-green hover:text-white transition-all duration-300"
                  >
                    Select Package
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Payment Options */}
      <section className="py-16 bg-cream relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#4CAF5008_1px,transparent_1px),linear-gradient(-45deg,#4CAF5008_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-forest-green/10"
          >
            <h3 className="text-3xl font-bold text-forest-green mb-8 text-center">
              Make Your Impact Today
            </h3>
            
            {/* Recurring Option with enhanced styling */}
            <div className="flex justify-center gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRecurring(false)}
                className={`px-8 py-3 rounded-full transition-all duration-300 font-medium
                          ${!isRecurring 
                            ? 'bg-gradient-to-r from-leaf-green to-forest-green text-white shadow-lg' 
                            : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                One-time
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRecurring(true)}
                className={`px-8 py-3 rounded-full transition-all duration-300 font-medium
                          ${isRecurring 
                            ? 'bg-gradient-to-r from-leaf-green to-forest-green text-white shadow-lg' 
                            : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Monthly
              </motion.button>
            </div>

            {/* Enhanced Payment Buttons */}
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-[#0070BA] text-white rounded-xl hover:bg-[#003087] 
                         transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
              >
                <img src="/paypal-logo.png" alt="PayPal" className="h-5" />
                <span className="font-medium">Pay with PayPal</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#6772E5] to-[#4B4EA8] text-white 
                         rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
              >
                <img src="/stripe-logo.png" alt="Stripe" className="h-5" />
                <span className="font-medium">Pay with Card</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-white border-2 text-gray-700 rounded-xl hover:bg-gray-50 
                         transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
              >
                <img src="/google-pay-logo.png" alt="Google Pay" className="h-5" />
                <span className="font-medium">Pay with Google Pay</span>
              </motion.button>
            </div>

            {/* Security Badge */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-forest-green/60">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582a1 1 0 01.646.934v4.642a6.002 6.002 0 01-3.779 5.564l-1.821.908a1 1 0 01-.894 0l-1.821-.908A6.002 6.002 0 013.5 11.48V6.838a1 1 0 01.646-.934L8.1 4.323V3a1 1 0 011-1zm0 2.618L6.409 6.172v4.896a4.002 4.002 0 002.52 3.709L10 15.48l1.071-.703a4.002 4.002 0 002.52-3.709V6.172L10 4.618z" />
                </svg>
                <span className="text-sm">Secure Payment</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Donor Recognition */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#4CAF5010_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-forest-green mb-4">
              Tree Champions
            </h2>
            <p className="text-xl text-earth-brown/80">
              Join our community of dedicated environmental supporters
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {topDonors.map((donor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                className="flex items-center justify-between p-6 mb-4 rounded-xl border border-forest-green/10 
                         bg-white/60 backdrop-blur-sm shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                                  ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                                    'bg-gradient-to-br from-leaf-green to-forest-green'}`}
                    >
                      <span className="text-xl font-bold text-white">#{index + 1}</span>
                    </div>
                    {index < 3 && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-1 rounded-full border-2 border-dashed 
                                 border-forest-green/20 -z-10"
                      />
                    )}
                  </div>
                  <div>
                    <span className="text-xl font-bold text-forest-green block">{donor.name}</span>
                    <span className="text-earth-brown text-sm">Joined our mission this month</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-leaf-green">{donor.trees}</div>
                  <div className="text-earth-brown text-sm">trees planted</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Join the Leaderboard CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-leaf-green to-forest-green text-white 
                       rounded-full shadow-xl font-semibold transition-all duration-300"
            >
              Join the Leaderboard
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Transparency Report - Modified without external dependency */}
      <section className="py-16 bg-cream" ref={transparencyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-forest-green text-center mb-12">
            Where Your Money Goes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Tree Planting', value: 70, color: 'bg-leaf-green' },
              { title: 'Maintenance', value: 20, color: 'bg-forest-green' },
              { title: 'Operations', value: 10, color: 'bg-earth-brown' }
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className={`w-24 h-24 ${item.color} rounded-full mx-auto mb-4 
                                flex items-center justify-center text-2xl font-bold text-white`}>
                  {item.value}%
                </div>
                <h3 className="text-xl font-bold text-forest-green mb-2">
                  {item.title}
                </h3>
                <p className="text-earth-brown">
                  {item.title === 'Tree Planting' && 'Direct costs of trees and planting'}
                  {item.title === 'Maintenance' && 'Ongoing care and monitoring'}
                  {item.title === 'Operations' && 'Administrative and platform costs'}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Progress Bars */}
          <div className="max-w-2xl mx-auto mt-12 space-y-6">
            {[
              { title: 'Tree Planting', value: 70, color: 'from-leaf-green to-forest-green' },
              { title: 'Maintenance', value: 20, color: 'from-forest-green to-earth-brown' },
              { title: 'Operations', value: 10, color: 'from-earth-brown to-leaf-green' }
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="flex justify-between text-sm text-forest-green">
                  <span>{item.title}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate; 
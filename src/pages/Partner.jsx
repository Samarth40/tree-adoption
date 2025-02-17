import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SuccessModal from '../components/SuccessModal';

// Collaboration Models Data
const collaborationModels = [
  {
    title: "Corporate Tree Adoption",
    icon: "🌱",
    description: "Adopt trees for your organization and track their growth",
    benefits: [
      "Customized adoption certificates",
      "Regular growth updates",
      "Employee engagement opportunities"
    ]
  },
  {
    title: "Event Sponsorship",
    icon: "🎉",
    description: "Sponsor tree planting events and community initiatives",
    benefits: [
      "Brand visibility at events",
      "Media coverage",
      "Community engagement"
    ]
  },
  {
    title: "Eco-awareness Campaigns",
    icon: "📢",
    description: "Launch joint environmental awareness campaigns",
    benefits: [
      "Co-branded content",
      "Social media promotion",
      "Educational workshops"
    ]
  }
];

// Benefits Data
const benefits = [
  {
    title: "CSR Benefits",
    icon: "🌍",
    description: "Enhance your environmental responsibility credentials"
  },
  {
    title: "Brand Visibility",
    icon: "👥",
    description: "Feature in our campaigns and digital platforms"
  },
  {
    title: "Impact Contribution",
    icon: "📊",
    description: "Measurable contribution to ecosystem restoration"
  }
];

const StatCard = ({ number, label }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center"
  >
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="block text-4xl font-bold bg-gradient-to-r from-forest-green to-leaf-green 
                 bg-clip-text text-transparent mb-2"
    >
      {number}
    </motion.span>
    <span className="text-earth-brown">{label}</span>
  </motion.div>
);

const Partner = () => {
  const [showModal, setShowModal] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const formRef = useRef(null);
  const benefitsRef = useRef(null);

  // Add this useEffect for scroll to top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Use 'instant' instead of 'smooth' for immediate scroll
    });
  }, []); // Empty dependency array means this runs once when component mounts

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToBenefits = () => {
    benefitsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-leaf-green origin-left z-50"
        style={{ scaleX }}
      />

      {/* Combined Hero and Stats Section - Added pt-16 for navbar space */}
      <div className="h-screen flex flex-col pt-16">
        {/* Hero Section - adjusted height */}
        <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-forest-green/90 via-forest-green/80 to-forest-green/70">
            <div className="absolute inset-0 bg-[url('/partnership-bg.jpg')] bg-cover bg-center opacity-20" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Main Headline - adjusted sizes */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight font-montserrat"
              >
                Grow Your Impact 
                <span className="block text-leaf-green mt-2">with Us</span>
              </motion.h1>

              {/* Subheadline - adjusted sizes */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed"
              >
                Join forces with us to create a greener future through corporate and NGO partnerships
              </motion.p>

              {/* CTA Buttons Container - Removed scroll indicator */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                {/* Primary CTA */}
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(76, 175, 80, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToForm}
                  className="px-8 py-4 text-lg font-semibold text-white bg-leaf-green 
                            hover:bg-forest-green rounded-full shadow-xl transition-all duration-300
                            relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    Become a Partner
                    <motion.svg 
                      className="ml-2 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-leaf-green to-sky-blue opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                {/* Secondary CTA */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToBenefits}
                  className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30
                            hover:bg-sky-blue hover:border-transparent rounded-full transition-all duration-300
                            backdrop-blur-sm cursor-pointer"
                >
                  Explore Our Impact
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section - adjusted padding */}
        <section className="flex-1 bg-white py-4 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard number="10K+" label="Trees Planted" />
              <StatCard number="50+" label="Corporate Partners" />
              <StatCard number="100+" label="Events Organized" />
              <StatCard number="5K+" label="Volunteers Engaged" />
            </div>
          </div>
          
          {/* Decorative Background */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(#4CAF50_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          {/* Add this to the Stats Section for a subtle divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-cream/10"
          />
        </section>
      </div>

      {/* Why Partner With Us Section - Added scroll margin for navbar */}
      <section 
        ref={benefitsRef}
        className="py-12 bg-cream scroll-mt-28"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-forest-green text-center mb-8"
          >
            Why Partner With Us?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-cream rounded-xl p-6 text-center"
              >
                <span className="text-4xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-xl font-bold text-forest-green mb-2">{benefit.title}</h3>
                <p className="text-earth-brown">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4CAF5010_1px,transparent_1px),linear-gradient(to_bottom,#4CAF5010_1px,transparent_1px)] bg-[size:14px_24px]" />
        </div>
      </section>

      {/* Collaboration Models Section - adjusted padding */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-forest-green text-center mb-8"
          >
            Collaboration Models
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collaborationModels.map((model, index) => (
              <motion.div
                key={model.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  background: "linear-gradient(to bottom right, white, #F5F5DC)"
                }}
                className="bg-white rounded-xl p-6 shadow-lg transition-all duration-500 
                           border border-forest-green/5 relative overflow-hidden group"
              >
                {/* Add a decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-leaf-green/5 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Existing content with relative positioning */}
                <div className="relative z-10">
                  <span className="text-4xl mb-4 block">{model.icon}</span>
                  <h3 className="text-xl font-bold text-forest-green mb-4">{model.title}</h3>
                  <p className="text-earth-brown mb-6">{model.description}</p>
                  <ul className="space-y-2">
                    {model.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2 text-leaf-green" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form Section - Added consistent scroll margin */}
      <section 
        ref={formRef}
        className="py-12 bg-cream scroll-mt-28"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-cream rounded-xl p-6 sm:p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-forest-green text-center mb-8">
              Start Your Partnership Journey
            </h2>
            <form className="space-y-6">
              {/* Form fields */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Organization Name"
                  className="w-full px-4 py-3 rounded-lg border-2 border-forest-green/10 
                           focus:border-leaf-green focus:ring-4 focus:ring-leaf-green/20 
                           transition-all duration-300"
                />
                <input
                  type="email"
                  placeholder="Contact Email"
                  className="w-full px-4 py-3 rounded-lg border-2 border-forest-green/10 
                           focus:border-leaf-green focus:ring-4 focus:ring-leaf-green/20 
                           transition-all duration-300"
                />
                <select
                  className="w-full px-4 py-3 rounded-lg border-2 border-forest-green/10 
                           focus:border-leaf-green focus:ring-4 focus:ring-leaf-green/20 
                           transition-all duration-300"
                >
                  <option value="">Select Partnership Type</option>
                  <option value="corporate">Corporate Tree Adoption</option>
                  <option value="event">Event Sponsorship</option>
                  <option value="campaign">Eco-awareness Campaign</option>
                </select>
                <textarea
                  placeholder="Tell us about your organization and partnership goals"
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border-2 border-forest-green/10 
                           focus:border-leaf-green focus:ring-4 focus:ring-leaf-green/20 
                           transition-all duration-300"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-leaf-green hover:bg-forest-green text-white font-semibold 
                           py-3 rounded-lg transition-all duration-300"
                  type="submit"
                >
                  Submit Proposal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-white border-2 border-leaf-green text-leaf-green 
                           font-semibold py-3 rounded-lg hover:bg-leaf-green hover:text-white 
                           transition-all duration-300"
                  type="button"
                >
                  Schedule a Call
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Thank you for your interest! We'll get back to you within 24 hours."
      />

      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 bg-leaf-green text-white p-4 rounded-full shadow-lg 
                   hover:bg-forest-green transition-colors duration-300 z-40 group"
      >
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 
                        rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity 
                        duration-300 whitespace-nowrap">
          Need help? Chat with us
        </div>
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
      </motion.button>
    </div>
  );
};

export default Partner; 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, FaUserLock, FaDatabase, FaUserCog, FaEnvelope, 
  FaHistory, FaLeaf, FaLock, FaCookie, FaGlobe, FaServer,
  FaUserShield, FaExclamationTriangle, FaHandshake
} from 'react-icons/fa';

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('all');
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      icon: <FaLock className="w-6 h-6" />,
      title: "Introduction",
      content: "Welcome to VanRaksha's Privacy Policy. We are committed to protecting your personal information and being transparent about how we collect, use, and share your data. This policy explains our practices regarding your privacy and data protection rights.",
      details: [
        "Scope of this policy",
        "Our commitment to privacy",
        "Legal basis for processing",
        "Applicability to our services"
      ]
    },
    {
      icon: <FaUserLock className="w-6 h-6" />,
      title: "Information We Collect",
      content: "We collect various types of information to provide and improve our services:",
      details: [
        "Personal information (name, email, contact details)",
        "VanRaksha history and preferences",
        "Payment information for donations",
        "Usage data and interaction with our platform",
        "Device and browser information",
        "Location data (with your consent)",
        "Communication preferences"
      ]
    },
    {
      icon: <FaDatabase className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: "Your information helps us provide and improve our services:",
      details: [
        "Managing your tree support and donations",
        "Providing updates about your supported trees",
        "Improving our services and user experience",
        "Sending relevant notifications and communications",
        "Processing payments and transactions",
        "Preventing fraud and ensuring security",
        "Complying with legal obligations"
      ]
    },
    {
      icon: <FaCookie className="w-6 h-6" />,
      title: "Cookies & Tracking",
      content: "We use cookies and similar technologies to enhance your experience:",
      details: [
        "Essential cookies for site functionality",
        "Analytics cookies to improve our service",
        "Preference cookies to remember your settings",
        "Third-party cookies and their purposes",
        "How to manage cookie preferences"
      ]
    },
    {
      icon: <FaGlobe className="w-6 h-6" />,
      title: "Data Sharing & Transfer",
      content: "We share your data with trusted partners and service providers:",
      details: [
        "Third-party service providers",
        "Legal requirements and compliance",
        "Business transfers or mergers",
        "International data transfers",
        "Data protection safeguards"
      ]
    },
    {
      icon: <FaServer className="w-6 h-6" />,
      title: "Data Security",
      content: "We implement robust security measures to protect your data:",
      details: [
        "Encryption and secure protocols",
        "Access controls and monitoring",
        "Regular security audits",
        "Incident response procedures",
        "Employee training and awareness"
      ]
    },
    {
      icon: <FaUserCog className="w-6 h-6" />,
      title: "Your Privacy Rights",
      content: "You have several rights regarding your personal data:",
      details: [
        "Access your personal information",
        "Request corrections to your data",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Data portability options",
        "Withdraw consent",
        "Lodge complaints with authorities"
      ]
    },
    {
      icon: <FaUserShield className="w-6 h-6" />,
      title: "Children's Privacy",
      content: "We take special precautions to protect children's privacy:",
      details: [
        "Age restrictions and verification",
        "Parental consent requirements",
        "Special protections for minors",
        "Educational resources"
      ]
    },
    {
      icon: <FaExclamationTriangle className="w-6 h-6" />,
      title: "Data Retention",
      content: "We retain your data only as long as necessary:",
      details: [
        "Retention periods for different data types",
        "Data deletion procedures",
        "Archiving policies",
        "Legal requirements"
      ]
    },
    {
      icon: <FaHandshake className="w-6 h-6" />,
      title: "Third-Party Services",
      content: "Our relationship with third-party services and links:",
      details: [
        "Third-party websites and services",
        "Payment processors",
        "Analytics providers",
        "Social media integrations"
      ]
    },
    {
      icon: <FaHistory className="w-6 h-6" />,
      title: "Policy Updates",
      content: "We may update this Privacy Policy periodically. The latest version will always be available on our website.",
      details: [
        "Change notification process",
        "Version history",
        "Material changes handling",
        "User notification methods"
      ]
    },
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: "Contact Us",
      content: "If you have any questions or concerns about our Privacy Policy:",
      details: [
        "Email: privacy@vanraksha.com",
        "Phone: +91 123 456 7890",
        "Address: 201 Magarpatta Road, Hadapsar, Pune 411028",
        "Data Protection Officer contact"
      ]
    }
  ];

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    setExpandedSection(null);
  };

  const handleExpandSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const filteredSections = activeSection === 'all' 
    ? sections 
    : sections.filter((_, index) => index === sections.findIndex(s => s.title === activeSection));

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24 pb-16">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMmw3LjMyMSA0LjIydjguNDRMMjAgMTkuMDc4bC03LjMyMS00LjQxOHYtOC40NEwyMCAyeiIgc3Ryb2tlPSIjNENBRjUwMjAiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] opacity-30" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-forest-green/10 rounded-2xl flex items-center justify-center">
              <FaShieldAlt className="w-8 h-8 text-forest-green" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-forest-green">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy matters to us. Learn how we protect and manage your data while helping you make a positive impact on the environment.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className="px-4 py-2 bg-forest-green/10 text-forest-green rounded-xl text-sm font-medium">
              GDPR Compliant
            </span>
            <span className="px-4 py-2 bg-forest-green/10 text-forest-green rounded-xl text-sm font-medium">
              ISO 27001 Certified
            </span>
            <span className="px-4 py-2 bg-forest-green/10 text-forest-green rounded-xl text-sm font-medium">
              SSL Secured
            </span>
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSectionClick('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                        ${activeSection === 'all'
                          ? 'bg-forest-green text-white' 
                          : 'bg-white/80 text-forest-green hover:bg-forest-green/10'}`}
            >
              All Sections
            </motion.button>
            {sections.map((section) => (
              <motion.button
                key={section.title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSectionClick(section.title)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                          ${activeSection === section.title
                            ? 'bg-forest-green text-white' 
                            : 'bg-white/80 text-forest-green hover:bg-forest-green/10'}`}
              >
                {section.title}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-8"
            >
              {filteredSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
                >
                  <div 
                    className={`p-6 cursor-pointer transition-colors duration-300
                              ${expandedSection === index ? 'bg-forest-green/5' : 'hover:bg-forest-green/5'}`}
                    onClick={() => handleExpandSection(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-forest-green/10 flex items-center justify-center text-forest-green shrink-0">
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h2>
                        <p className="text-gray-600">{section.content}</p>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedSection === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-6 bg-forest-green/5">
                          <ul className="space-y-3">
                            {section.details.map((detail, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <FaLeaf className="w-4 h-4 text-forest-green mt-1 flex-shrink-0" />
                                <span className="text-gray-600">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <div className="flex items-center gap-2 text-forest-green">
              <FaShieldAlt className="w-4 h-4" />
              <span className="text-sm">Your data is protected by Tree Adoption Initiative</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 
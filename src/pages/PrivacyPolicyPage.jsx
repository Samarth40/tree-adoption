import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserLock, FaDatabase, FaUserCog, FaEnvelope, FaHistory, FaLeaf, FaLock } from 'react-icons/fa';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: <FaLock className="w-6 h-6" />,
      title: "Introduction",
      content: "Welcome to Tree Adoption's Privacy Policy. We are committed to protecting your personal information and being transparent about how we collect, use, and share your data."
    },
    {
      icon: <FaUserLock className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "Personal information (name, email, contact details)",
        "Tree adoption history and preferences",
        "Payment information for donations and adoptions",
        "Usage data and interaction with our platform"
      ]
    },
    {
      icon: <FaDatabase className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: [
        "Managing your tree adoptions and donations",
        "Providing updates about your adopted trees",
        "Improving our services and user experience",
        "Sending relevant notifications and communications"
      ]
    },
    {
      icon: <FaUserCog className="w-6 h-6" />,
      title: "Your Rights",
      content: [
        "Access your personal information",
        "Request corrections to your data",
        "Delete your account and associated data",
        "Opt-out of marketing communications"
      ]
    },
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: "Contact Us",
      content: "If you have any questions about our Privacy Policy, please contact us at privacy@treeadoption.com"
    },
    {
      icon: <FaHistory className="w-6 h-6" />,
      title: "Updates to This Policy",
      content: "We may update this Privacy Policy periodically. The latest version will always be available on our website."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-forest-green/5 rounded-full -translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-green/5 rounded-full translate-x-8 translate-y-8" />

      {/* Header */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <FaShieldAlt className="w-12 h-12 text-forest-green" />
            <h1 className="text-4xl font-bold text-forest-green">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Your privacy matters to us. Learn how we protect and manage your data while helping you make a positive impact on the environment.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid gap-8 md:grid-cols-2">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-forest-green/10 flex items-center justify-center text-forest-green shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                    {Array.isArray(section.content) ? (
                      <ul className="space-y-2">
                        {section.content.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                            <FaLeaf className="w-3.5 h-3.5 text-forest-green mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="border-t border-gray-200 pt-8 pb-12">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-forest-green/10 text-forest-green rounded-full text-sm font-medium">
                Version 1.0
              </span>
              <span className="px-4 py-1.5 bg-forest-green/10 text-forest-green rounded-full text-sm font-medium">
                GDPR Compliant
              </span>
              <span className="px-4 py-1.5 bg-forest-green/10 text-forest-green rounded-full text-sm font-medium">
                ISO 27001 Certified
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 
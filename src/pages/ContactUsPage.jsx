import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdEmail, MdPhone, MdLocationOn, MdMessage, MdSend, MdOutlineSupport } from 'react-icons/md';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('form');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const socialLinks = [
    { icon: <FaTwitter />, url: '#', color: 'hover:text-forest-green' },
    { icon: <FaFacebook />, url: '#', color: 'hover:text-forest-green' },
    { icon: <FaInstagram />, url: '#', color: 'hover:text-forest-green' },
    { icon: <FaLinkedin />, url: '#', color: 'hover:text-forest-green' },
    { icon: <FaWhatsapp />, url: '#', color: 'hover:text-forest-green' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24 pb-16">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMmw3LjMyMSA0LjIydjguNDRMMjAgMTkuMDc4bC03LjMyMS00LjQxOHYtOC40NEwyMCAyeiIgc3Ryb2tlPSIjNENBRjUwMjAiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] opacity-30" />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-forest-green/5"
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-6 mb-8">
            <h1 className="text-5xl sm:text-6xl font-bold text-forest-green">
              Get in Touch
            </h1>
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-forest-green flex items-center justify-center">
                <MdMessage className="w-8 h-8 text-forest-green" />
              </div>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about VanRaksha? We're here to help you make a difference.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {['form', 'map'].map((section) => (
            <motion.button
              key={section}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 border-2
                ${activeSection === section 
                  ? 'border-forest-green bg-forest-green text-white' 
                  : 'border-forest-green text-forest-green hover:bg-forest-green/5'}`}
            >
              {section === 'form' ? 'Contact Form' : 'Find Us'}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: activeSection === 'form' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeSection === 'form' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'form' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Contact Form Card */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 relative overflow-hidden"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-forest-green/10 to-transparent rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-leaf-green/10 to-transparent rounded-full blur-2xl" />

                  <motion.div variants={itemVariants} className="relative">
                    <h2 className="text-2xl font-bold text-forest-green mb-6">Send us a Message</h2>
                    <p className="text-gray-600 mb-8">
                      Whether you have a question about adoptions, need technical support, or want to partner with us - we're ready to help!
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest-green focus:border-transparent transition-all duration-300"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest-green focus:border-transparent transition-all duration-300"
                            placeholder="john@example.com"
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest-green focus:border-transparent transition-all duration-300"
                          placeholder="How can we help?"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="4"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest-green focus:border-transparent transition-all duration-300"
                          placeholder="Your message here..."
                        ></textarea>
                      </motion.div>

                      <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white 
                                 px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <MdSend className="w-5 h-5" />
                            <span>Send Message</span>
                          </>
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                </motion.div>

                {/* Contact Information */}
                <div className="space-y-8">
                  {/* Quick Contact Cards */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {[
                      {
                        icon: <MdEmail className="w-6 h-6" />,
                        title: "Email Us",
                        content: ["support@treeadoption.com"],
                        subtext: "We'll respond within 24 hours"
                      },
                      {
                        icon: <MdPhone className="w-6 h-6" />,
                        title: "Call Us",
                        content: ["+91 123 456 7890"],
                        subtext: "Mon - Fri, 9am - 6pm"
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={item.title}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full border-2 border-forest-green 
                                        flex items-center justify-center text-forest-green shrink-0">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-forest-green mb-1">{item.title}</h3>
                            {item.content.map((line, i) => (
                              <p key={i} className="text-forest-green text-sm truncate">
                                {line}
                              </p>
                            ))}
                            <p className="text-sage-green text-sm mt-1">{item.subtext}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Office Location Card */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                  >
                    <motion.div variants={itemVariants} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-forest-green 
                                    flex items-center justify-center text-forest-green">
                        <MdLocationOn className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-forest-green">Visit Our Office</h3>
                        <p className="text-forest-green">VanRaksha Initiative</p>
                        <p className="text-sage-green">201 Magarpatta Road</p>
                        <p className="text-sage-green">Hadapsar, Pune 411028</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Social Media Links */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                  >
                    <motion.h3 
                      variants={itemVariants}
                      className="text-lg font-semibold text-forest-green mb-4"
                    >
                      Connect With Us
                    </motion.h3>
                    <motion.div 
                      variants={itemVariants}
                      className="flex gap-4"
                    >
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-10 h-10 rounded-lg bg-cream flex items-center justify-center 
                                    text-forest-green transition-colors duration-300 ${social.color}`}
                        >
                          {social.icon}
                        </motion.a>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            ) : (
              // Map Section
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 overflow-hidden"
              >
                <motion.div variants={itemVariants} className="aspect-w-16 aspect-h-9">
                  <iframe
                    title="Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30273.475568794785!2d73.91776535!3d18.5091753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c19e0f3b6617%3A0x3056ce7c9ecb086c!2sHadapsar%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1635825247425!5m2!1sen!2sin"
                    className="w-full h-[600px] rounded-xl"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Success Message Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowSuccess(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-md mx-4 relative"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-forest-green mb-4">Message Sent Successfully!</h3>
                  <div className="space-y-3">
                    <p className="text-gray-700 font-medium">
                      Thank you for contacting VanRaksha Initiative!
                    </p>
                    <p className="text-gray-600 text-sm">
                      Your message has been received and we'll get back to you within 24 hours at the email address provided.
                    </p>
                    <p className="text-sage-green text-sm mt-2">
                      Reference ID: #{Math.random().toString(36).substr(2, 9)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="mt-8 bg-forest-green text-white px-8 py-3 rounded-xl hover:bg-forest-green/90 
                             transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <span>Close</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactUsPage; 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeadset, FaPaperPlane, FaComments } from 'react-icons/fa';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for your message. We will get back to you soon!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-forest-green/5 rounded-full -translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-green/5 rounded-full translate-x-8 translate-y-8" />

      {/* Header Section */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <FaComments className="w-12 h-12 text-forest-green" />
            <h1 className="text-4xl font-bold text-forest-green">Get in Touch</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Have questions about tree adoption? We're here to help you make a difference.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 lg:p-8 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Send us a Message</h2>
              <p className="text-gray-600 text-sm mb-6">
                Whether you have a question about adoptions, need technical support, or want to partner with us - we're ready to help!
              </p>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-forest-green/10 flex items-center justify-center">
                    <FaEnvelope className="w-4 h-4 text-forest-green" />
                  </div>
                  <p className="text-sm">Quick response within 24 hours</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-forest-green/10 flex items-center justify-center">
                    <FaHeadset className="w-4 h-4 text-forest-green" />
                  </div>
                  <p className="text-sm">Expert advice on tree adoption</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-forest-green text-white px-6 py-2.5 rounded-lg hover:bg-forest-green/90 transition-colors duration-300 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <FaPaperPlane className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaEnvelope className="w-5 h-5" />,
              title: "Email",
              content: [
                "contact@treeadoption.com",
                "support@treeadoption.com"
              ],
              bgColor: "bg-green-50",
              hoverColor: "hover:bg-green-100",
              textColor: "text-green-800"
            },
            {
              icon: <FaPhone className="w-5 h-5" />,
              title: "Phone",
              content: [
                "+91 123 456 7890",
                "Mon - Fri, 9am - 6pm"
              ],
              bgColor: "bg-green-50",
              hoverColor: "hover:bg-green-100",
              textColor: "text-green-800"
            },
            {
              icon: <FaMapMarkerAlt className="w-5 h-5" />,
              title: "Visit",
              content: [
                "Tree Adoption Initiative",
                "123 Green Street",
                "New Delhi, India 110001"
              ],
              bgColor: "bg-green-50",
              hoverColor: "hover:bg-green-100",
              textColor: "text-green-800"
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${item.bgColor} ${item.textColor} rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 p-6 ${item.hoverColor} cursor-pointer`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full ${item.textColor} bg-white/50 flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                {item.content.map((line, i) => (
                  <p key={i} className={i === 0 ? "text-base mb-1" : "text-sm opacity-80"}>
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage; 
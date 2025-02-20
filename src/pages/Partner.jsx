import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHandshake, FaTree, FaUsers, FaChartLine, FaLeaf, FaGlobe, FaBullhorn, FaCalendarAlt } from 'react-icons/fa';
import SuccessModal from '../components/SuccessModal';

// Collaboration Models Data
const collaborationModels = [
  {
    title: "VanRaksha Partnership",
    icon: <FaTree className="w-8 h-8" />,
    description: "Partner with us to support and nurture trees at scale",
    benefits: [
      "Customized partnership certificates",
      "Regular growth updates",
      "Employee engagement opportunities"
    ],
    color: "from-forest-green to-leaf-green"
  },
  {
    title: "Event Sponsorship",
    icon: <FaCalendarAlt className="w-8 h-8" />,
    description: "Sponsor impactful tree planting events and initiatives",
    benefits: [
      "Brand visibility at events",
      "Media coverage",
      "Community engagement"
    ],
    color: "from-leaf-green to-sky-blue"
  },
  {
    title: "Eco-awareness Campaigns",
    icon: <FaBullhorn className="w-8 h-8" />,
    description: "Create joint environmental awareness programs",
    benefits: [
      "Co-branded content",
      "Social media promotion",
      "Educational workshops"
    ],
    color: "from-sky-blue to-forest-green"
  }
];

// Benefits Data
const benefits = [
  {
    title: "Environmental Impact",
    icon: <FaGlobe className="w-6 h-6" />,
    description: "Make a measurable contribution to ecosystem restoration",
    stats: "10,000+ trees planted"
  },
  {
    title: "Brand Enhancement",
    icon: <FaChartLine className="w-6 h-6" />,
    description: "Strengthen your brand's environmental credentials",
    stats: "50+ successful partnerships"
  },
  {
    title: "Community Engagement",
    icon: <FaUsers className="w-6 h-6" />,
    description: "Connect with environmentally conscious communities",
    stats: "5,000+ engaged participants"
  }
];

const StatCard = ({ icon, number, label }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-gradient-to-br from-white via-white to-cream rounded-2xl p-6 shadow-lg 
                 text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
    >
      {/* Glowing Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-leaf-green/5 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Decorative Corner */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-forest-green/10 to-transparent 
                      rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      
      {/* Icon Container */}
      <div className="relative mb-4 transform group-hover:scale-110 transition-transform duration-500">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-forest-green/10 to-leaf-green/10 
                       rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-500">
          <div className="text-forest-green transform group-hover:rotate-12 transition-transform duration-500">
            {icon}
          </div>
        </div>
      </div>

      {/* Number with counter effect */}
      <motion.span
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        className="block text-4xl font-bold bg-gradient-to-r from-forest-green via-leaf-green to-forest-green 
                   bg-clip-text text-transparent mb-2 relative"
      >
        {number}
      </motion.span>

      {/* Label */}
      <span className="text-earth-brown font-medium relative">{label}</span>
    </motion.div>
  );
};

const CollaborationCard = ({ model, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-forest-green/5 rounded-3xl transform transition-transform duration-500 group-hover:scale-105" />
            
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl p-8 shadow-lg transition-all duration-500 group-hover:shadow-2xl overflow-hidden">
                {/* Decorative Corner Elements */}
                <div className="absolute top-0 right-0 w-20 h-20">
                    <div className="absolute top-4 right-4 w-2 h-2 bg-forest-green rounded-full" />
                    <div className="absolute top-4 right-8 w-2 h-2 bg-sage-green rounded-full" />
                    <div className="absolute top-8 right-4 w-2 h-2 bg-sage-green rounded-full" />
                </div>
                <div className="absolute bottom-0 left-0 w-20 h-20">
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-forest-green rounded-full" />
                    <div className="absolute bottom-4 left-8 w-2 h-2 bg-sage-green rounded-full" />
                    <div className="absolute bottom-8 left-4 w-2 h-2 bg-sage-green rounded-full" />
                </div>

                {/* Icon Container */}
                <div className="relative mb-6">
                    <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12">
                        {model.icon}
                    </div>
                    <div className="absolute -inset-4 bg-forest-green/5 rounded-full blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-forest-green mb-4 relative">
                    {model.title}
                    <div className="absolute -bottom-1 left-0 w-12 h-1 bg-sage-green transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100" />
                </h3>

                <p className="text-sage-green mb-6 leading-relaxed">
                    {model.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-3">
                    {model.benefits.map((benefit, idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className="flex items-start gap-3 text-gray-600"
                        >
                            <div className="w-6 h-6 rounded-full bg-cream flex items-center justify-center flex-shrink-0 mt-0.5 transform transition-transform duration-300 group-hover:scale-110">
                                <div className="w-2 h-2 bg-forest-green rounded-full" />
                            </div>
                            <span className="transition-colors duration-300 group-hover:text-forest-green">
                                {benefit}
                            </span>
                        </motion.li>
                    ))}
                </ul>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-forest-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
            </div>
        </motion.div>
    );
};

const Partner = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnershipType: '',
    message: ''
  });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const formRef = useRef(null);
  const benefitsRef = useRef(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Show success modal
    setShowModal(true);
    // Reset form
    setFormData({
      organizationName: '',
      contactPerson: '',
      email: '',
      phone: '',
      partnershipType: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-green to-leaf-green origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Unique Background Design */}
        <div className="absolute inset-0 bg-forest-green">
          {/* Animated Geometric Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" 
                 style={{ 
                   backgroundImage: `linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
                                   linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
                                   linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
                                   linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
                                   linear-gradient(60deg, #77777777 25%, transparent 25.5%, transparent 75%, #77777777 75%, #77777777)`,
                   backgroundSize: '80px 140px',
                   backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0'
                 }} 
            />
          </div>

          {/* Animated Circles */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2"
            >
              <div className="w-full h-full rounded-full bg-white/5 backdrop-blur-3xl" />
            </motion.div>
            
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1.2, 1, 1.2],
              }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2"
            >
              <div className="w-full h-full rounded-full bg-white/5 backdrop-blur-3xl" />
            </motion.div>
          </div>

          {/* Decorative Lines */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 w-full h-px bg-white/10 transform -rotate-6" />
            <div className="absolute top-1/3 left-0 w-full h-px bg-white/10 transform rotate-3" />
            <div className="absolute top-2/3 left-0 w-full h-px bg-white/10 transform -rotate-3" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-1/4 w-12 h-12 border border-white/20 rounded-lg"
            />
            <motion.div
              animate={{ 
                y: [0, 20, 0],
                x: [0, -10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-1/3 right-1/3 w-16 h-16 border border-white/20 rounded-full"
            />
          </div>

          {/* Light Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-12">
            {/* Icon Container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative"
            >
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12">
                <FaHandshake className="w-12 h-12 text-forest-green transform -rotate-12" />
              </div>
              <div className="absolute -inset-2 bg-white/10 rounded-3xl blur-xl -z-10" />
            </motion.div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                  Partner for a
                  <div className="relative inline-block ml-4">
                    <span className="text-leaf-green">Greener</span>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-white/30" />
                  </div>
                  <span className="block mt-2 text-white">Future</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto font-light">
                  Join our mission to create sustainable environmental impact through meaningful partnerships
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                {/* Primary CTA */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToForm}
                  className="group relative px-10 py-5 bg-white text-forest-green text-lg font-semibold rounded-2xl shadow-2xl flex items-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10">Become a Partner</span>
                  <motion.div
                    className="relative z-10"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                  <div className="absolute inset-0 bg-forest-green/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </motion.button>

                {/* Secondary CTA */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToBenefits}
                  className="px-10 py-5 text-lg font-semibold text-white border-2 border-white/20 rounded-2xl 
                           hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center gap-3"
                >
                  <span>Learn More</span>
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4"
            >
              <div className="w-2 h-2 bg-white/20 rounded-full" />
              <div className="w-2 h-2 bg-white/40 rounded-full" />
              <div className="w-2 h-2 bg-white/20 rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-cream relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<FaTree className="w-8 h-8 mx-auto" />}
              number="10K+" 
              label="Trees Planted" 
            />
            <StatCard 
              icon={<FaHandshake className="w-8 h-8 mx-auto" />}
              number="50+" 
              label="Corporate Partners" 
            />
            <StatCard 
              icon={<FaCalendarAlt className="w-8 h-8 mx-auto" />}
              number="100+" 
              label="Events Organized" 
            />
            <StatCard 
              icon={<FaUsers className="w-8 h-8 mx-auto" />}
              number="5K+" 
              label="Volunteers Engaged" 
            />
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(#4CAF50_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
      </section>

      {/* Collaboration Models Section */}
      <section className="py-20 bg-gradient-to-b from-cream to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-forest-green mb-4">
              Partnership Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our range of collaboration models designed to create lasting environmental impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collaborationModels.map((model, index) => (
              <CollaborationCard key={model.title} model={model} index={index} />
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-forest-green/10 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-leaf-green/10 to-transparent rounded-full blur-3xl -z-10" />
      </section>

      {/* Benefits Section */}
      <section 
        ref={benefitsRef}
        className="py-20 bg-gradient-to-b from-white to-cream scroll-mt-28 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-forest-green mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us in creating a sustainable future while enhancing your organization's impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group bg-gradient-to-br from-white via-white to-cream rounded-2xl p-8 shadow-xl 
                           hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-leaf-green/5 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Decorative Corner */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-forest-green/10 to-transparent 
                                rounded-full blur-2xl opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />

                <div className="relative flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <div className="w-20 h-20 bg-gradient-to-br from-forest-green/10 to-leaf-green/10 rounded-2xl 
                                  flex items-center justify-center mb-6 group-hover:shadow-lg transform 
                                  group-hover:rotate-6 transition-all duration-500">
                    <div className="text-forest-green transform group-hover:scale-110 transition-transform duration-500">
                      {benefit.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-forest-green mb-3 
                                 group-hover:text-transparent group-hover:bg-clip-text 
                                 group-hover:bg-gradient-to-r group-hover:from-forest-green 
                                 group-hover:to-leaf-green transition-all duration-500">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-500">
                    {benefit.description}
                  </p>
                  <div className="text-leaf-green font-medium px-4 py-2 rounded-lg bg-forest-green/5 
                                  group-hover:bg-forest-green/10 transition-all duration-500">
                    {benefit.stats}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,175,80,0.1)_0%,transparent_70%)]" />
        </div>
      </section>

      {/* Contact Form Section */}
      <section 
        ref={formRef}
        className="py-20 bg-gradient-to-b from-cream to-white scroll-mt-28 relative overflow-hidden"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden"
          >
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-forest-green mb-4">
                Start Your Partnership Journey
              </h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-forest-green 
                             focus:ring-2 focus:ring-forest-green/20 transition-colors duration-300"
                    placeholder="Your organization"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-forest-green 
                             focus:ring-2 focus:ring-forest-green/20 transition-colors duration-300"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-forest-green 
                             focus:ring-2 focus:ring-forest-green/20 transition-colors duration-300"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-forest-green 
                             focus:ring-2 focus:ring-forest-green/20 transition-colors duration-300"
                    placeholder="Your phone"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partnership Interest
                </label>
                <select
                  name="partnershipType"
                  value={formData.partnershipType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-forest-green 
                           focus:ring-2 focus:ring-forest-green/20 transition-colors duration-300"
                  required
                >
                  <option value="">Select partnership type</option>
                  <option value="corporate">VanRaksha Partnership</option>
                  <option value="event">Event Sponsorship</option>
                  <option value="campaign">Eco-awareness Campaign</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-forest-green 
                           focus:ring-2 focus:ring-forest-green/20 transition-colors duration-300"
                  placeholder="Tell us about your partnership goals..."
                  required
                ></textarea>
              </div>

              <motion.button
                type="submit"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px -15px rgba(76, 175, 80, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-forest-green to-leaf-green text-white 
                         font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Submit Partnership Request
              </motion.button>
            </form>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-forest-green/10 to-transparent rounded-full blur-2xl -z-10" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-leaf-green/10 to-transparent rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <SuccessModal
            isOpen={showModal}
            message="Thank you for your interest! We'll be in touch soon."
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Partner; 
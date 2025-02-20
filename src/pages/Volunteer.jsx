import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGlobe, FaTree, FaStar, FaLeaf, FaUsers, FaSeedling, FaShieldAlt, FaBook, FaCalendarAlt } from 'react-icons/fa';
import SuccessModal from '../components/SuccessModal';
import Badge from '../components/VolunteerBadges';

const volunteerRoles = [
  {
    title: "Tree Planter",
    icon: <FaSeedling className="w-8 h-8 text-white" />,
    description: "Join our tree planting events and help expand urban forests",
    skills: ["Physical fitness", "Weekend availability", "Enthusiasm"],
    color: "from-forest-green to-leaf-green"
  },
  {
    title: "Tree Guardian",
    icon: <FaShieldAlt className="w-8 h-8 text-white" />,
    description: "Monitor and maintain planted trees to ensure their survival",
    skills: ["Basic tree care knowledge", "Regular commitment", "Attention to detail"],
    color: "from-leaf-green to-sage-green"
  },
  {
    title: "Community Educator",
    icon: <FaBook className="w-8 h-8 text-white" />,
    description: "Teach others about tree care and environmental conservation",
    skills: ["Communication skills", "Knowledge sharing", "Patience"],
    color: "from-sage-green to-forest-green"
  },
  {
    title: "Event Organizer",
    icon: <FaCalendarAlt className="w-8 h-8 text-white" />,
    description: "Help coordinate tree planting and community events",
    skills: ["Organization", "Leadership", "Planning"],
    color: "from-forest-green to-leaf-green"
  }
];

const ScrollProgress = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const percentage = (scrolled / documentHeight) * 100;
      setScrollPercentage(percentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      className="fixed top-0 left-0 h-1 bg-forest-green z-50"
      style={{ width: `${scrollPercentage}%` }}
    />
  );
};

// Update badges data
const badges = [
  {
    title: "Eco-Warrior",
    icon: <FaGlobe className="w-8 h-8" />,
    progress: 45,
    maxProgress: 100,
    color: "from-forest-green to-leaf-green"
  },
  {
    title: "Tree Guardian",
    icon: <FaTree className="w-8 h-8" />,
    progress: 75,
    maxProgress: 100,
    color: "from-leaf-green to-sage-green"
  },
  {
    title: "Community Hero",
    icon: <FaStar className="w-8 h-8" />,
    progress: 30,
    maxProgress: 100,
    color: "from-sage-green to-forest-green"
  }
];

// Add these animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Add glass card effect
const GlassCard = ({ children, className = "" }) => (
  <div className={`relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl 
                   border border-forest-green/10 hover:shadow-2xl transition-all duration-500 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 to-transparent opacity-20" />
    <div className="relative z-10">{children}</div>
  </div>
);

// Add decorative pattern
const DecorativePattern = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4CAF5010_1px,transparent_1px),linear-gradient(to_bottom,#4CAF5010_1px,transparent_1px)] bg-[size:14px_24px]" />
    <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-transparent to-cream/20" />
  </div>
);

// Enhanced FormField component with loading animation
const FormField = ({ label, type = "text", error, loading, ...props }) => (
  <motion.div
    variants={fadeInUp}
    className="group relative"
  >
    <label className="block text-forest-green font-medium mb-2">{label}</label>
    <div className="relative">
      {type === "textarea" ? (
        <motion.textarea
          disabled={loading}
          whileFocus={{ scale: 1.01 }}
          className="w-full px-6 py-4 rounded-xl border-2 border-forest-green/10 
                   focus:border-leaf-green focus:ring-4 focus:ring-leaf-green/20 
                   transition-all duration-300 bg-white/90 backdrop-blur-sm
                   hover:border-forest-green/20 resize-none disabled:opacity-50
                   disabled:cursor-not-allowed"
          rows="4"
          {...props}
        />
      ) : (
        <motion.input
          disabled={loading}
          whileFocus={{ scale: 1.01 }}
          className="w-full px-6 py-4 rounded-xl border-2 border-forest-green/10 
                   focus:border-leaf-green focus:ring-4 focus:ring-leaf-green/20 
                   transition-all duration-300 bg-white/90 backdrop-blur-sm
                   hover:border-forest-green/20 disabled:opacity-50
                   disabled:cursor-not-allowed"
          type={type}
          {...props}
        />
      )}
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-forest-green/20 border-t-forest-green rounded-full"
          />
        </div>
      )}
    </div>
    {error && (
      <motion.p 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-red-500 text-sm mt-2"
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);

// Enhanced Badge component with glass effect and improved design
const EnhancedBadge = ({ title, icon, progress, maxProgress, color = "from-forest-green to-leaf-green" }) => (
  <GlassCard className="p-6 transform hover:scale-105 transition-all duration-300 group">
    <div className="relative">
      {/* Decorative circles */}
      <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-forest-green/10 to-transparent rounded-full blur-xl group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-tr from-leaf-green/10 to-transparent rounded-full blur-xl group-hover:scale-110 transition-transform duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-all duration-500 group-hover:shadow-xl`}
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-forest-green to-leaf-green bg-clip-text text-transparent">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <FaLeaf className="w-4 h-4 text-sage-green" />
              <span className="text-sage-green text-sm">Level {Math.floor(progress / 20) + 1}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaUsers className="w-4 h-4 text-sage-green" />
              <span className="text-sage-green text-sm font-medium">Progress</span>
            </div>
            <span className="text-forest-green font-bold">{progress}%</span>
          </div>
          <div className="h-3 bg-cream/50 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${color} rounded-full shadow-lg`}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sage-green/70">Next Level</span>
            <span className="text-forest-green font-medium">{Math.min(Math.ceil(progress / 20) * 20, maxProgress)}pts</span>
          </div>
        </div>
      </div>
    </div>
  </GlassCard>
);

const VolunteerCard = ({ role, onClick, index }) => {
  // Define card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group cursor-pointer relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(34,197,94,0.3)] hover:-translate-y-2"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-forest-green/20 to-transparent rounded-full -translate-x-16 -translate-y-16 blur-2xl group-hover:opacity-70 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-leaf-green/20 to-transparent rounded-full translate-x-8 translate-y-8 blur-2xl group-hover:opacity-70 transition-opacity duration-500" />

      {/* Content container */}
      <div className="relative p-6 flex flex-col h-full">
        {/* Icon container */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform duration-500 shadow-lg`}>
          {role.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-forest-green mb-2 bg-gradient-to-r from-forest-green to-leaf-green bg-clip-text text-transparent">
          {role.title}
        </h3>

        {/* Description */}
        <p className="text-sage-green mb-4 line-clamp-3">
          {role.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-auto mb-4">
          {role.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-cream/70 rounded-lg text-forest-green text-sm hover:bg-cream transition-colors duration-300"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Apply button - appears on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onClick(role);
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-forest-green to-leaf-green text-white font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        >
          Apply Now
        </button>
      </div>
    </motion.div>
  );
};

// Add these new animation variants
const heroTextVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const floatingLeafVariants = {
  initial: { y: 0, rotate: 0, scale: 1 },
  animate: {
    y: [-20, 20, -20],
    rotate: [0, 10, -10, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Volunteer = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    availability: '',
    message: '',
    role: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const formRef = useRef(null);
  const rolesRef = useRef(null); // Add reference for roles section

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.availability) errors.availability = "Please select your availability";
    if (!formData.message.trim()) errors.message = "Please tell us about your interest";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowModal(true);
      setFormData({
        name: '',
        email: '',
        availability: '',
        message: '',
        role: ''
      });
      setFormErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      role: role.title,
      message: `I am interested in the ${role.title} role.`
    }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Add smooth scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Add scroll to top effect when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Use 'instant' instead of 'smooth' for immediate scroll
    });
  }, []); // Empty dependency array means this runs once when component mounts

  // Update scroll handler to scroll to roles section
  const scrollToRoles = () => {
    rolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      <ScrollProgress />
      
      {/* Enhanced Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-16"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply z-10" />
          <img 
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop" 
            alt="Forest Background" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Decorative Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-green/10 via-transparent to-cream z-10" />

        {/* Main Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto py-12 sm:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center space-y-8 sm:space-y-12"
          >
            {/* Enhanced Heading */}
            <motion.h1 
              variants={heroTextVariants}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight px-4"
            >
              <span className="inline-block text-white pb-2 sm:pb-4 drop-shadow-lg">
                Join VanRaksha's
              </span>
              <br />
              <span className="inline-block text-cream drop-shadow-lg">
                Mission
              </span>
            </motion.h1>

            {/* Enhanced Quote */}
            <motion.p
              variants={heroTextVariants}
              className="text-lg sm:text-xl md:text-2xl text-white font-light 
                         max-w-3xl mx-auto leading-relaxed italic relative px-8 sm:px-0"
            >
              <span className="hidden sm:block absolute -left-8 top-0 text-4xl text-cream opacity-50">"</span>
              Join VanRaksha in creating a greener tomorrow. Be part of the change!
              <span className="hidden sm:block absolute -right-8 bottom-0 text-4xl text-cream opacity-50">"</span>
            </motion.p>

            {/* Enhanced CTA Button */}
            <motion.div
              variants={heroTextVariants}
              className="flex justify-center px-4"
            >
              <motion.button
                onClick={scrollToRoles}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4 text-lg font-medium text-white 
                         bg-gradient-to-r from-forest-green/90 to-leaf-green/90 
                         rounded-xl shadow-lg overflow-hidden transition-all duration-500
                         hover:shadow-[0_10px_40px_-15px_rgba(34,197,94,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-leaf-green to-forest-green opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] 
                              bg-[length:250%_250%] group-hover:bg-[position:100%_100%] transition-[background-position] duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  Join as a Volunteer
                  <FaLeaf className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Volunteering Options Section */}
      <section ref={rolesRef} className="py-16 relative scroll-mt-24">
        <DecorativePattern />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-green mb-4"
            >
              Choose Your Role
            </motion.h2>
            <p className="text-lg text-sage-green max-w-2xl mx-auto">
              Select the role that best matches your interests and availability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {volunteerRoles.map((role, index) => (
              <VolunteerCard 
                key={role.title} 
                role={role} 
                onClick={handleRoleSelect}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Gamification Section */}
      <section className="py-16 relative">
        <DecorativePattern />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-green mb-12 text-center"
          >
            Earn Badges & Track Progress
          </motion.h2>

          {/* Enhanced Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {badges.map((badge, index) => (
              <EnhancedBadge key={index} {...badge} />
            ))}
          </div>

          {/* Enhanced Community Progress */}
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold text-forest-green mb-8">Community Impact</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-sage-green font-medium">Trees Planted This Year</span>
                  <span className="text-forest-green font-bold">1,234</span>
                </div>
                <div className="h-3 bg-cream/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-forest-green to-leaf-green rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-sage-green font-medium">Volunteer Hours</span>
                  <span className="text-forest-green font-bold">5,678</span>
                </div>
                <div className="h-3 bg-cream/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-leaf-green to-sage-green rounded-full"
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Enhanced Form Section */}
      <section ref={formRef} className="py-16 relative scroll-mt-24">
        <DecorativePattern />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={itemVariants}
            className="max-w-2xl mx-auto"
          >
            <GlassCard className="p-8 sm:p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-forest-green to-leaf-green bg-clip-text text-transparent mb-4">
                  {selectedRole ? `Join VanRaksha as ${selectedRole.title}` : 'Join Our Mission'}
                </h2>
                <p className="text-sage-green text-lg">
                  Fill out the form below and the VanRaksha team will get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {selectedRole && (
                  <div className="bg-cream/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedRole.color} flex items-center justify-center`}>
                        {selectedRole.icon}
                      </div>
                      <div>
                        <h3 className="text-forest-green font-semibold">{selectedRole.title}</h3>
                        <p className="text-sm text-sage-green">{selectedRole.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                <motion.div className="space-y-6">
                  <FormField 
                    label="Full Name" 
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={formErrors.name}
                    loading={isSubmitting}
                  />
                  <FormField 
                    label="Email" 
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={formErrors.email}
                    loading={isSubmitting}
                  />
                  <div className="group relative">
                    <label className="block text-forest-green font-medium mb-2">Availability</label>
                    <div className="relative">
                      <select
                        className="w-full px-6 py-4 rounded-xl border-2 border-forest-green/10 
                                 focus:border-leaf-green focus:ring-4 focus:ring-leaf-green/20 
                                 transition-all duration-300 bg-white/90 backdrop-blur-sm
                                 hover:border-forest-green/20 disabled:opacity-50
                                 disabled:cursor-not-allowed appearance-none"
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select your availability</option>
                        <option value="weekends">Weekends</option>
                        <option value="weekdays">Weekdays</option>
                        <option value="flexible">Flexible</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {formErrors.availability && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="text-red-500 text-sm mt-2"
                      >
                        {formErrors.availability}
                      </motion.p>
                    )}
                  </div>
                  <FormField 
                    label="Message" 
                    type="textarea"
                    placeholder="Tell us about your interest in volunteering..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    error={formErrors.message}
                    loading={isSubmitting}
                  />
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(45, 90, 39, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-forest-green to-leaf-green hover:from-leaf-green 
                           hover:to-sage-green text-white font-semibold rounded-xl shadow-lg 
                           transition-all duration-300 text-lg relative disabled:opacity-70
                           disabled:cursor-not-allowed disabled:hover:scale-100"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span className={`flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                    Submit Application
                    <FaLeaf className="w-5 h-5" />
                  </span>
                  {isSubmitting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full"
                      />
                    </div>
                  )}
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 to-transparent opacity-20" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-forest-green to-leaf-green rounded-full mx-auto mb-6 flex items-center justify-center">
                  <motion.svg 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-8 h-8 text-white" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <motion.path
                      d="M20 6L9 17L4 12"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </div>
                
                <h3 className="text-2xl font-bold text-forest-green text-center mb-4">
                  Thank You for Joining Us!
                </h3>
                
                <p className="text-sage-green text-center mb-8">
                  Our team will review your application and get back to you within 24 hours. Get ready to make a difference!
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-forest-green to-leaf-green text-white 
                           font-semibold rounded-xl shadow-lg transition-all duration-300"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Volunteer; 
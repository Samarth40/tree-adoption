import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SuccessModal from '../components/SuccessModal';
import Badge from '../components/VolunteerBadges';

const volunteerRoles = [
  {
    title: "Tree Planter",
    icon: "🌱",
    description: "Join our tree planting events and help expand urban forests",
    skills: ["Physical fitness", "Weekend availability", "Enthusiasm"],
    color: "from-green-400 to-green-600"
  },
  {
    title: "Tree Guardian",
    icon: "🌳",
    description: "Monitor and maintain planted trees to ensure their survival",
    skills: ["Basic tree care knowledge", "Regular commitment", "Attention to detail"],
    color: "from-emerald-400 to-emerald-600"
  },
  {
    title: "Community Educator",
    icon: "📚",
    description: "Teach others about tree care and environmental conservation",
    skills: ["Communication skills", "Knowledge sharing", "Patience"],
    color: "from-teal-400 to-teal-600"
  },
  {
    title: "Event Organizer",
    icon: "📅",
    description: "Help coordinate tree planting and community events",
    skills: ["Organization", "Leadership", "Planning"],
    color: "from-cyan-400 to-cyan-600"
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
      className="fixed top-0 left-0 h-1 bg-green-500 z-50"
      style={{ width: `${scrollPercentage}%` }}
    />
  );
};

// Add badges data
const badges = [
  {
    title: "Eco-Warrior",
    icon: "🌍",
    progress: 45,
    maxProgress: 100
  },
  {
    title: "Tree Guardian",
    icon: "🌳",
    progress: 75,
    maxProgress: 100
  },
  {
    title: "Community Hero",
    icon: "⭐",
    progress: 30,
    maxProgress: 100
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

const VolunteerCard = ({ role, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      whileHover={{ y: -12, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl 
                 transition-all duration-500 border border-forest-green/5"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(role)}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-transparent to-transparent"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative p-8 z-10">
        <motion.span
          className="text-6xl block mb-6"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
        >
          {role.icon}
        </motion.span>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <h3 className="text-2xl font-bold text-forest-green mb-4">{role.title}</h3>
          <p className="text-gray-600 mb-6">{role.description}</p>
        </motion.div>

        <motion.div className="space-y-3">
          {role.skills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + i * 0.1 }}
              className="flex items-center text-gray-500"
            >
              <svg className="w-5 h-5 mr-3 text-leaf-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              {skill}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Update the FormField component
const FormField = ({ label, type = "text", ...props }) => (
  <motion.div
    variants={fadeInUp}
    className="group"
  >
    <label className="block text-forest-green mb-2 font-medium">{label}</label>
    {type === "textarea" ? (
      <motion.textarea
        whileFocus={{ scale: 1.01 }}
        className="w-full px-6 py-4 rounded-xl border-2 border-forest-green/10 
                   focus:border-leaf-green focus:ring-4 focus:ring-leaf-green/20 
                   transition-all duration-300 bg-white/50 backdrop-blur-sm"
        rows="4"
        {...props}
      />
    ) : (
      <motion.input
        whileFocus={{ scale: 1.01 }}
        className="w-full px-6 py-4 rounded-xl border-2 border-forest-green/10 
                   focus:border-leaf-green focus:ring-4 focus:ring-leaf-green/20 
                   transition-all duration-300 bg-white/50 backdrop-blur-sm"
        type={type}
        {...props}
      />
    )}
  </motion.div>
);

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
    message: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add form validation here
    if (!formData.name || !formData.email || !formData.availability) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      // Add your form submission logic here
      // For now, we'll just show the success modal
      setShowModal(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-leaf-green origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Enhanced Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-16"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-green/5 via-transparent to-cream/20" />
        
        {/* Floating Decorative Elements */}
        <motion.div
          variants={floatingLeafVariants}
          initial="initial"
          animate="animate"
          className="absolute top-20 right-5 sm:right-20 text-6xl sm:text-8xl opacity-20"
        >
          🌳
        </motion.div>
        <motion.div
          variants={floatingLeafVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute bottom-20 left-5 sm:left-20 text-6xl sm:text-8xl opacity-20"
        >
          🌱
        </motion.div>
        <motion.div
          variants={floatingLeafVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute top-40 left-1/4 text-6xl opacity-10"
        >
          🍃
        </motion.div>

        {/* Main Content */}
        <div className="relative w-full max-w-7xl mx-auto py-12 sm:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center space-y-8 sm:space-y-12"
          >
            {/* Main Heading with Gradient */}
            <motion.h1 
              variants={heroTextVariants}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight px-4"
            >
              <span className="inline-block bg-gradient-to-r from-forest-green via-leaf-green to-forest-green 
                              bg-clip-text text-transparent pb-2 sm:pb-4">
                Join Our Green
              </span>
              <br />
              <span className="inline-block bg-gradient-to-r from-leaf-green to-forest-green 
                              bg-clip-text text-transparent">
                Mission
              </span>
            </motion.h1>

            {/* Animated Quote */}
            <motion.p
              variants={heroTextVariants}
              className="text-lg sm:text-xl md:text-2xl text-earth-brown/80 font-light 
                         max-w-3xl mx-auto leading-relaxed italic relative px-8 sm:px-0"
            >
              <span className="hidden sm:block absolute -left-8 top-0 text-4xl text-leaf-green opacity-50">"</span>
              Small actions today lead to a greener tomorrow. Be part of the change!
              <span className="hidden sm:block absolute -right-8 bottom-0 text-4xl text-leaf-green opacity-50">"</span>
            </motion.p>

            {/* Enhanced CTA Button */}
            <motion.div
              variants={heroTextVariants}
              className="flex justify-center px-4"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(45, 90, 39, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden px-6 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl 
                           font-semibold text-white bg-gradient-to-r from-leaf-green to-forest-green 
                           rounded-full shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center">
                  Join as a Volunteer
                  <motion.svg 
                    className="ml-2 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-sky-blue to-leaf-green opacity-0 
                              group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-forest-green/50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 2️⃣ Interactive Volunteering Options */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-green mb-3"
            >
              Choose Your Role
            </motion.h2>
            <p className="text-lg text-earth-brown/80 max-w-2xl mx-auto">
              Select the role that best matches your interests and availability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {volunteerRoles.map((role, index) => (
              <VolunteerCard 
                key={role.title} 
                role={role} 
                onClick={setSelectedRole}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ Gamification Features */}
      <section className="py-10 bg-gradient-to-b from-white to-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-green mb-8 text-center"
          >
            Earn Badges & Track Progress
          </motion.h2>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {badges.map((badge, index) => (
              <Badge key={index} {...badge} />
            ))}
          </div>

          {/* Community Progress */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-forest-green/10"
          >
            <h3 className="text-2xl font-bold text-forest-green mb-6">Community Impact</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Trees Planted This Year</span>
                  <span className="text-leaf-green font-bold">1,234</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-leaf-green to-forest-green rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Volunteer Hours</span>
                  <span className="text-leaf-green font-bold">5,678</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-leaf-green to-sky-blue rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4CAF5010_1px,transparent_1px),linear-gradient(to_bottom,#4CAF5010_1px,transparent_1px)] bg-[size:14px_24px]" />
        </div>
      </section>

      {/* 5️⃣ Easy Signup Process */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={itemVariants}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-cream to-white rounded-2xl shadow-xl p-8 border border-forest-green/10">
              <h2 className="text-3xl sm:text-4xl font-bold text-forest-green mb-8 text-center">
                Join Our Mission
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div className="space-y-5">
                  <FormField 
                    label="Name" 
                    placeholder="Your full name"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <FormField 
                    label="Email" 
                    type="email"
                    placeholder="you@example.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div className="group">
                    <label className="block text-forest-green mb-2 font-medium">Availability</label>
                    <select
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-forest-green/10 
                               focus:border-leaf-green focus:ring-4 focus:ring-leaf-green/20 
                               transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    >
                      <option value="">Select your availability</option>
                      <option value="weekends">Weekends</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <FormField 
                    label="Message" 
                    type="textarea"
                    placeholder="Tell us about your interest in volunteering..."
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(76, 175, 80, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-leaf-green to-forest-green hover:from-sky-blue 
                             hover:to-leaf-green text-white font-semibold py-4 rounded-xl shadow-lg 
                             transition-all duration-300 text-lg"
                  type="submit"
                >
                  Submit Application
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Thank you for signing up! We'll be in touch soon with next steps."
      />
    </div>
  );
};

export default Volunteer; 
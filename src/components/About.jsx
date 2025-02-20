import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const About = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const teamMembers = [
    {
      name: "Samarth Shinde",
      role: "Team Leader",
      avatar: "/ss1.jpg",
      github: "https://github.com/Samarth40",
      linkedin: "https://www.linkedin.com/in/samarth-shinde-791072271/",
      expertise: "Full Stack Development"
    },
    {
      name: "Rohit Gajbhiye",
      role: "Developer",
      avatar: "/rg.jpg",
      github: "https://github.com/rohitgajbhiye744",
      linkedin: "https://www.linkedin.com/in/rohit-gajbhiye-60306b251/",
      expertise: "Frontend Architecture"
    },
    {
      name: "Mrunali Patil",
      role: "Developer",
      avatar: "/mp1.jpg",
      github: "https://github.com/Mrunali394",
      linkedin: "https://www.linkedin.com/in/mrunali-patil-89a424320/",
      expertise: "Backend Development"
    },
    {
      name: "Sakshi Pawar",
      role: "Developer",
      avatar: "/sp1_LE_.jpg",
      github: "https://github.com/Sakshu4",
      linkedin: "https://www.linkedin.com/in/sakshi-pawar04/",
      expertise: "UI/UX Design"
    }
  ];

  const features = [
    {
      icon: "🌱",
      title: "Virtual Adoption",
      description: "NGO/organization tree care with periodic growth updates and status reports with images.",
      benefits: ["Real-time monitoring", "Professional care", "Regular updates", "Impact tracking"]
    },
    {
      icon: "🌿",
      title: "Physical Adoption",
      description: "User-managed tree care with tracking tools, care tips, and guidelines for hands-on involvement.",
      benefits: ["Hands-on experience", "Expert guidance", "Care resources", "Community support"]
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor tree growth, environmental impact, and receive care reminders through our interactive dashboard.",
      benefits: ["Growth analytics", "Impact metrics", "Care schedules", "Achievement badges"]
    },
    {
      icon: "🤝",
      title: "Community Engagement",
      description: "Connect with other environmental enthusiasts and share your conservation journey.",
      benefits: ["Event participation", "Knowledge sharing", "Local meetups", "Collaborative projects"]
    }
  ];

  const beneficiaries = [
    {
      title: "Environmental Organizations",
      description: "Partner with us to expand their reach and impact.",
      icon: "🏢",
      impact: "500+ trees planted monthly"
    },
    {
      title: "Local Communities",
      description: "Engage in environmental conservation efforts.",
      icon: "🏘️",
      impact: "50+ communities engaged"
    },
    {
      title: "Individual Adopters",
      description: "Make a direct impact on environmental conservation.",
      icon: "👤",
      impact: "1000+ active adopters"
    },
    {
      title: "Researchers",
      description: "Access valuable data on reforestation efforts.",
      icon: "🔬",
      impact: "10+ research collaborations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Enhanced Animations */}
        <motion.div 
          className="text-center mb-8 sm:mb-16 relative px-4 sm:px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div 
              className="absolute top-0 left-1/4 w-32 h-32 bg-forest-green/5 rounded-full blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-0 right-1/4 w-40 h-40 bg-sage-green/5 rounded-full blur-xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 p-3 bg-gradient-to-br from-forest-green/10 to-sage-green/10 rounded-full"
            whileHover={{ rotate: 360 }}
          >
            <span className="text-5xl">🌳</span>
          </motion.div>

          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest-green mb-4 sm:mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            About VanRaksha Platform
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-forest-green to-sage-green rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-sage-green max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Connecting people with trees they can adopt and track, creating a sustainable future through environmental conservation.
          </motion.p>
        </motion.div>

        {/* Vision Cards Section */}
        <motion.div 
          className="mb-8 sm:mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 px-4 sm:px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Impact Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group bg-gradient-to-br from-white to-cream rounded-2xl shadow-xl p-8 relative overflow-hidden backdrop-blur-sm"
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-forest-green/10 rounded-full -translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage-green/10 rounded-full translate-x-4 translate-y-4 group-hover:scale-150 transition-transform duration-700" />
            
            {/* Content Container */}
            <div className="relative z-10">
              {/* Icon with Ring Animation */}
              <motion.div 
                className="relative w-16 h-16 mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-forest-green/20 to-sage-green/20 rounded-xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                <div className="absolute inset-2 bg-white rounded-lg flex items-center justify-center text-4xl">
                  🌍
                </div>
                {/* Animated Ring */}
                <div className="absolute inset-0 border-2 border-forest-green/20 rounded-xl animate-pulse" />
              </motion.div>

              {/* Title with Gradient */}
              <h3 className="text-2xl font-bold mb-4 relative">
                <span className="bg-gradient-to-r from-forest-green to-sage-green bg-clip-text text-transparent">
                  Environmental Impact
                </span>
                {/* Underline animation */}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-forest-green to-sage-green"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </h3>

              {/* Content with Enhanced Typography */}
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Each tree adopted through our platform helps absorb <span className="font-semibold text-forest-green">48 pounds of CO₂</span> annually.
                </p>
                
                {/* Stats Container */}
                <div className="bg-white/50 rounded-xl p-4 transform group-hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Annual Impact</span>
                    <span className="text-forest-green font-semibold">48 lbs CO₂</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-forest-green to-sage-green"
                      initial={{ width: 0 }}
                      whileInView={{ width: "75%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-forest-green/10 text-forest-green rounded-full text-sm">
                    Carbon Reduction
                  </span>
                  <span className="px-3 py-1 bg-sage-green/10 text-sage-green rounded-full text-sm">
                    Eco-friendly
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Community Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group bg-gradient-to-br from-white to-cream rounded-2xl shadow-xl p-8 relative overflow-hidden backdrop-blur-sm"
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-forest-green/10 rounded-full -translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-sage-green/10 rounded-full translate-x-4 translate-y-4 group-hover:scale-150 transition-transform duration-700" />
            
            {/* Content Container */}
            <div className="relative z-10">
              {/* Icon with Ring Animation */}
              <motion.div 
                className="relative w-16 h-16 mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-forest-green/20 to-sage-green/20 rounded-xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                <div className="absolute inset-2 bg-white rounded-lg flex items-center justify-center text-4xl">
                  👥
                </div>
                {/* Animated Ring */}
                <div className="absolute inset-0 border-2 border-forest-green/20 rounded-xl animate-pulse" />
              </motion.div>

              {/* Title with Gradient */}
              <h3 className="text-2xl font-bold mb-4 relative">
                <span className="bg-gradient-to-r from-forest-green to-sage-green bg-clip-text text-transparent">
                  Growing Community
                </span>
                {/* Underline animation */}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-forest-green to-sage-green"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </h3>

              {/* Content with Enhanced Typography */}
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Join over <span className="font-semibold text-forest-green">10,000 tree adopters</span> worldwide making a difference.
                </p>
                
                {/* Stats Container */}
                <div className="bg-white/50 rounded-xl p-4 transform group-hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Community Growth</span>
                    <span className="text-forest-green font-semibold">10,000+</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-forest-green to-sage-green"
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-forest-green/10 text-forest-green rounded-full text-sm">
                    Global Network
                  </span>
                  <span className="px-3 py-1 bg-sage-green/10 text-sage-green rounded-full text-sm">
                    Active Community
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Future Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group bg-gradient-to-br from-white to-cream rounded-2xl shadow-xl p-8 relative overflow-hidden backdrop-blur-sm"
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-forest-green/10 rounded-full -translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage-green/10 rounded-full translate-x-4 translate-y-4 group-hover:scale-150 transition-transform duration-700" />
            
            {/* Content Container */}
            <div className="relative z-10">
              {/* Icon with Ring Animation */}
              <motion.div 
                className="relative w-16 h-16 mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-forest-green/20 to-sage-green/20 rounded-xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                <div className="absolute inset-2 bg-white rounded-lg flex items-center justify-center text-4xl">
                  🌱
                </div>
                {/* Animated Ring */}
                <div className="absolute inset-0 border-2 border-forest-green/20 rounded-xl animate-pulse" />
              </motion.div>

              {/* Title with Gradient */}
              <h3 className="text-2xl font-bold mb-4 relative">
                <span className="bg-gradient-to-r from-forest-green to-sage-green bg-clip-text text-transparent">
                  Future Growth
                </span>
                {/* Underline animation */}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-forest-green to-sage-green"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </h3>

              {/* Content with Enhanced Typography */}
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Our goal is to plant <span className="font-semibold text-forest-green">1 million trees</span> by 2025.
                </p>
                
                {/* Stats Container */}
                <div className="bg-white/50 rounded-xl p-4 transform group-hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progress to Goal</span>
                    <span className="text-forest-green font-semibold">250,000</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-forest-green to-sage-green"
                      initial={{ width: 0 }}
                      whileInView={{ width: "25%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-forest-green/10 text-forest-green rounded-full text-sm">
                    Sustainable Future
                  </span>
                  <span className="px-3 py-1 bg-sage-green/10 text-sage-green rounded-full text-sm">
                    Growth Target
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mb-8 sm:mb-16 px-4 sm:px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-forest-green mb-8 sm:mb-12 text-center relative">
            Core Features
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-forest-green to-sage-green rounded-full" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
                whileHover={{ scale: 1.02 }}
              >
                {/* Main Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-lg relative z-10 h-full transform-gpu transition-all duration-500 group-hover:translate-x-2 group-hover:translate-y-2">
                  {/* Icon Container */}
                  <div className="w-16 h-16 flex items-center justify-center text-3xl relative mb-6">
                    <div className="absolute inset-0 bg-forest-green/10 rounded-xl transform rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                      {feature.icon}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-forest-green mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-2">
                    {feature.description}
                  </p>

                  {/* Benefits List with Custom Bullets */}
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-leaf-green group-hover:scale-150 transition-transform duration-300" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Background Card - Creates depth effect */}
                <div className="absolute inset-0 bg-forest-green/20 rounded-[2rem] -z-10 transform-gpu transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          className="mb-8 sm:mb-16 px-4 sm:px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-forest-green mb-8 sm:mb-12 text-center relative">
            Our Team
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-forest-green to-sage-green rounded-full" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ scale: 1.02 }}
              >
                {/* Hexagonal Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 to-sage-green/5 clip-hex transform-gpu transition-all duration-500 group-hover:scale-105" />
                
                {/* Main Content */}
                <div className="relative bg-white/80 backdrop-blur-sm p-6 clip-hex-content">
                  {/* Avatar with Custom Frame */}
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-forest-green to-sage-green clip-hex rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                    <div className="absolute inset-1 bg-white clip-hex" />
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="absolute inset-2 object-cover clip-hex transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-forest-green mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sage-green text-sm mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm mb-4">{member.expertise}</p>
                    
                    {/* Social Links with Custom Design */}
                    <div className="flex items-center justify-center space-x-3">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-forest-green/10 to-sage-green/10 rounded-full text-forest-green text-sm font-medium group-hover:from-forest-green/20 group-hover:to-sage-green/20 transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-forest-green/10 to-sage-green/10 rounded-full text-forest-green text-sm font-medium group-hover:from-forest-green/20 group-hover:to-sage-green/20 transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Target Beneficiaries */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-4 sm:px-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-forest-green mb-8 sm:mb-12 text-center relative">
            Target Beneficiaries
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-forest-green to-sage-green rounded-full" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {beneficiaries.map((beneficiary, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative perspective-1000"
                whileHover={{ scale: 1.02 }}
              >
                {/* Card with 3D effect */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg transform-gpu transition-all duration-500 group-hover:rotate-y-12">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-forest-green/5 to-sage-green/5 rounded-full -translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-sage-green/5 to-forest-green/5 rounded-full translate-x-4 translate-y-4 group-hover:scale-150 transition-transform duration-700" />

                  {/* Icon with Floating Effect */}
                  <div className="relative z-10 mb-6">
                    <div className="w-16 h-16 relative">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-forest-green/20 to-sage-green/20 rounded-2xl"
                        animate={{ 
                          rotate: [0, 90, 180, 270, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center text-3xl">
                        {beneficiary.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-forest-green mb-3">
                      {beneficiary.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {beneficiary.description}
                    </p>

                    {/* Impact Metric with Custom Design */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-forest-green/10 to-sage-green/10 rounded-lg transform skew-x-6 group-hover:skew-x-0 transition-transform duration-300" />
                      <div className="relative p-4 text-center">
                        <span className="block text-forest-green font-bold">
                          {beneficiary.impact}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Border Animation */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-forest-green/20 rounded-3xl transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 sm:mb-16 mt-12 sm:mt-24 px-4 sm:px-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-forest-green mb-8 sm:mb-12 text-center relative">
            Frequently Asked Questions
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-forest-green to-sage-green rounded-full" />
          </h2>

          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {[
              {
                question: "How does VanRaksha's tree support program work?",
                answer: "VanRaksha's tree support program is a simple process where you can choose to either virtually or physically support a tree. Virtual support means an NGO/organization will care for your tree, while physical support allows you to plant and care for the tree yourself with our guidance and support."
              },
              {
                question: "What are the benefits of supporting a tree through VanRaksha?",
                answer: "Supporting a tree through VanRaksha helps combat climate change, creates wildlife habitats, and improves air quality. You'll receive regular updates about your tree's growth, impact metrics, and can participate in our community events. Each supported tree absorbs approximately 48 pounds of CO₂ annually."
              },
              {
                question: "How can I track my tree's progress?",
                answer: "Through our interactive dashboard, you can monitor your tree's growth, environmental impact, and receive care reminders. We provide regular photo updates, growth measurements, and impact statistics for virtually supported trees."
              },
              {
                question: "Can I support multiple trees?",
                answer: "Yes! You can support as many trees as you'd like. Each tree contributes to environmental conservation, and we offer special packages for multiple tree support initiatives. You can manage all your supported trees through a single dashboard."
              },
              {
                question: "What happens if my tree doesn't survive?",
                answer: "We have measures in place to ensure the highest survival rate for all supported trees. However, if a tree doesn't survive within the first year of support, we offer a free replacement or the option to support another tree at no additional cost."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ scale: 1.02 }}
              >
                {/* Main Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg relative z-10 overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-forest-green/5 to-sage-green/5 rounded-full -translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-sage-green/5 to-forest-green/5 rounded-full translate-x-4 translate-y-4 group-hover:scale-150 transition-transform duration-700" />

                  {/* Question Header */}
                  <div 
                    className="relative flex justify-between items-start sm:items-center cursor-pointer group"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-forest-green group-hover:text-leaf-green transition-colors duration-300 pr-8">
                      {faq.question}
                    </h3>
                    <motion.div
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-forest-green/10 to-sage-green/10 group-hover:from-forest-green/20 group-hover:to-sage-green/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        className="w-5 h-5 text-forest-green"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Answer Content */}
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative overflow-hidden"
                      >
                        <motion.div 
                          className="mt-4 text-gray-600 leading-relaxed pt-2"
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          exit={{ y: -10 }}
                        >
                          {faq.answer}
                        </motion.div>
                        {/* Decorative Line */}
                        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-forest-green/20 to-sage-green/20 rounded-full transform -translate-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Background Card - Creates depth effect */}
                <div className="absolute inset-0 bg-forest-green/10 rounded-2xl -z-10 transform-gpu transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 
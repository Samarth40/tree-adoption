import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  return (
    <div id="features" className="relative py-24 bg-white scroll-mt-16">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-forest-green mb-4">
            Features of Our Program
          </h2>
          <p className="text-xl text-sage-green">
            Discover what makes our tree adoption program unique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-xl shadow-xl transition-all duration-700 ease-in-out cursor-pointer [perspective:1000px] hover:shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1]
              }}
            >
              {/* Card Front */}
              <div className="p-8 transform-gpu group-hover:[transform:rotateY(180deg)] transition-transform duration-1000 ease-in-out [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
                <div className="text-6xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-forest-green mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>

              {/* Card Back */}
              <div className="absolute inset-0 p-6 bg-gradient-to-br from-forest-green to-sage-green rounded-xl [transform:rotateY(-180deg)] group-hover:[transform:rotateY(0)] transition-transform duration-1000 ease-in-out [backface-visibility:hidden] [-webkit-backface-visibility:hidden] overflow-hidden">
                <div className="h-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out delay-300">
                  <div className="text-3xl mb-3">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-3">
                    {feature.title}
                  </h4>
                  <ul className="space-y-1.5 text-center text-sm">
                    {feature.details.map((detail, i) => (
                      <li 
                        key={i} 
                        className="flex items-center justify-center"
                      >
                        <span className="mr-1.5">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors text-sm">
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: "🌱",
    title: "Personalized Tree Selection",
    description: "Choose from a variety of native tree species that best match your preferences and local environment.",
    details: [
      "Species matching algorithm",
      "Local climate consideration",
      "Growth space analysis",
      "Maintenance requirements"
    ]
  },
  {
    icon: "📱",
    title: "Digital Tree Tracking",
    description: "Monitor your tree's growth, health, and environmental impact through our interactive platform.",
    details: [
      "Real-time growth tracking",
      "Health status updates",
      "Environmental impact metrics",
      "Maintenance reminders"
    ]
  },
  {
    icon: "🤝",
    title: "Community Engagement",
    description: "Connect with other tree adopters and participate in local environmental conservation events.",
    details: [
      "Local event notifications",
      "Community forums",
      "Knowledge sharing",
      "Group activities"
    ]
  },
  {
    icon: "🌍",
    title: "Environmental Impact",
    description: "Track your contribution to carbon reduction and environmental preservation in real-time.",
    details: [
      "CO2 absorption tracking",
      "Biodiversity impact",
      "Ecosystem benefits",
      "Sustainability metrics"
    ]
  },
  {
    icon: "📸",
    title: "Regular Updates",
    description: "Receive photos and progress reports about your adopted tree throughout the year.",
    details: [
      "Seasonal photo updates",
      "Growth milestones",
      "Health assessments",
      "Environmental conditions"
    ]
  },
  {
    icon: "🎓",
    title: "Educational Resources",
    description: "Access comprehensive guides and expert advice on tree care and environmental conservation.",
    details: [
      "Expert care guides",
      "Video tutorials",
      "Seasonal tips",
      "Conservation insights"
    ]
  }
];

export default Features; 
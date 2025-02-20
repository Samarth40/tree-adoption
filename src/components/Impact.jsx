import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { 
  MdForest,
  MdPublic,
  MdPets,
  MdWaterDrop,
  MdNaturePeople
} from 'react-icons/md';

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  // Parse the numeric part and suffix
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (inView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const currentValue = Math.round(numericValue * progress);
        
        setDisplayValue(currentValue);

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [inView, numericValue]);

  return (
    <span ref={ref} className="text-3xl font-bold text-cream mb-2">
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const GlowingIcon = ({ Icon }) => (
  <div className="relative group">
    <Icon className="w-16 h-16 text-forest-green transition-all duration-300 group-hover:text-leaf-green" />
    <div className="absolute inset-0 w-16 h-16 bg-white/30 rounded-full filter blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
    <Icon className="absolute inset-0 w-16 h-16 text-white/90 transform scale-90" />
  </div>
);

const Impact = () => {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true });

  return (
    <div id="impact" className="relative py-24 scroll-mt-16">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-forest-green/80 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Environmental Impact
          </h2>
          <p className="text-xl text-cream">
            Together, we're making a measurable difference
          </p>
        </motion.div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center transform hover:-translate-y-2 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                {stat.icon}
              </motion.div>
              <AnimatedNumber value={stat.value} />
              <div className="text-lg text-cream/90">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-20 bg-white/10 backdrop-blur-sm rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-cream mb-6">
                Growing Impact Year by Year
              </h3>
              <ul className="space-y-4">
                {yearlyImpact.map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center text-cream"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <MdNaturePeople className="text-leaf-green mr-3 w-5 h-5" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div 
              className="relative h-64 rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3"
                alt="Forest growth"
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const impactStats = [
  {
    icon: <GlowingIcon Icon={MdForest} />,
    value: '10,000+',
    label: 'Trees Planted'
  },
  {
    icon: <GlowingIcon Icon={MdPublic} />,
    value: '500+',
    label: 'Tons of CO₂ Absorbed'
  },
  {
    icon: <GlowingIcon Icon={MdPets} />,
    value: '1,000+',
    label: 'Wildlife Habitats Created'
  },
  {
    icon: <GlowingIcon Icon={MdWaterDrop} />,
    value: '5M+',
    label: 'Gallons of Water Conserved'
  }
];

const yearlyImpact = [
  'Increased forest coverage by 15% in local areas',
  'Reduced urban heat island effect by 2.5°C',
  'Created sustainable ecosystems for 50+ species',
  'Engaged 10,000+ community members in conservation',
  'Established 20+ urban forests in cities'
];

export default Impact; 
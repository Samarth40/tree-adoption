import React from 'react';
import { motion } from 'framer-motion';

const SectionDivider = ({ variant = 'wave' }) => {
  const dividers = {
    wave: (
      <svg className="w-full h-24 fill-current text-white transform-gpu" viewBox="0 0 1440 74" preserveAspectRatio="none">
        <path d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 875.138 50.0141C710.527 46.3727 621.108 1.64949 456.464 0.0433865Z"></path>
      </svg>
    ),
    curve: (
      <svg className="w-full h-24 fill-current text-white transform-gpu" viewBox="0 0 1440 74" preserveAspectRatio="none">
        <path d="M0,0 C480,100 960,100 1440,0 L1440,74 L0,74 Z"></path>
      </svg>
    ),
    triangle: (
      <svg className="w-full h-24 fill-current text-white transform-gpu" viewBox="0 0 1440 74" preserveAspectRatio="none">
        <path d="M0,0 L1440,0 L720,74 Z"></path>
      </svg>
    )
  };

  return (
    <motion.div 
      className="absolute bottom-0 left-0 right-0 overflow-hidden leading-0 transform-gpu"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {dividers[variant]}
    </motion.div>
  );
};

export default SectionDivider; 
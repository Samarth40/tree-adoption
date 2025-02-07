import React from 'react';
import { motion } from 'framer-motion';

const AmbientBackground = () => {
  const floatingElements = Array(6).fill(null).map((_, i) => ({
    id: i,
    size: Math.random() * 40 + 20,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute opacity-10"
          style={{
            width: element.size,
            height: element.size,
            left: `${element.initialX}%`,
            top: `${element.initialY}%`,
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full text-forest-green"
            fill="currentColor"
          >
            <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default AmbientBackground; 
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ProgressBar = ({ label, value, color = "green" }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  React.useEffect(() => {
    if (inView) {
      controls.start({
        width: `${value}%`,
        transition: { duration: 1.5, ease: "easeOut" }
      });
    }
  }, [controls, inView, value]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className={`text-${color}-600 font-semibold`}>{value}%</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={controls}
          className={`h-full bg-${color}-500 rounded-full`}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 
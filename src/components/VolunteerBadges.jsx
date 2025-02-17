import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({ title, icon, progress, maxProgress }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-xl shadow-lg p-6 text-center"
  >
    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-2xl">
      {icon}
    </div>
    <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(progress / maxProgress) * 100}%` }}
        className="bg-green-500 h-2 rounded-full"
      />
    </div>
    <p className="text-sm text-gray-600">{progress}/{maxProgress} hours</p>
  </motion.div>
);

export default Badge; 
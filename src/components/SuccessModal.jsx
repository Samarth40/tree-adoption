import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaCheck, FaTimes } from 'react-icons/fa';

const SuccessModal = ({ isOpen, onClose, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-forest-green/20 to-transparent rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-leaf-green/20 to-transparent rounded-full translate-x-16 translate-y-16 blur-2xl" />
            
            {/* Success Icon Container */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
              className="relative mb-6"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-forest-green to-leaf-green rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                <div className="bg-white/90 w-16 h-16 rounded-xl flex items-center justify-center transform -rotate-12">
                  <FaCheck className="w-8 h-8 text-forest-green" />
                </div>
              </div>
              {/* Decorative Leaves */}
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-4"
              >
                <FaLeaf className="w-6 h-6 text-leaf-green/60" />
              </motion.div>
              <motion.div
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-2 -left-4"
              >
                <FaLeaf className="w-5 h-5 text-forest-green/60" />
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className="text-center relative">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-forest-green mb-4"
              >
                Success!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-6"
              >
                {message}
              </motion.p>
              
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={onClose}
                className="group bg-forest-green text-white px-8 py-3 rounded-xl hover:bg-forest-green/90 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Continue</span>
                <FaTimes className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>
            </div>

            {/* Decorative Dots */}
            <div className="absolute top-1/2 left-4 w-2 h-2 bg-forest-green/20 rounded-full" />
            <div className="absolute top-1/2 right-4 w-2 h-2 bg-leaf-green/20 rounded-full" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className="w-1.5 h-1.5 bg-forest-green/20 rounded-full" />
              <div className="w-1.5 h-1.5 bg-leaf-green/20 rounded-full" />
              <div className="w-1.5 h-1.5 bg-forest-green/20 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal; 
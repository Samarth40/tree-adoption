import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordGate = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const correctPassword = import.meta.env.VITE_APP_GATE_PASSWORD;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      onUnlock(true);
    } else {
      setError('Incorrect password. Please try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-forest-green to-sage-green flex items-center justify-center z-50">
      {/* Development Phase Banner */}
      <div className="absolute top-0 left-0 right-0 bg-yellow-500/90 text-white py-2 px-4 text-center backdrop-blur-sm">
        <p className="text-sm font-medium">
          🚧 Application is currently in development phase. Password protection will be removed after production. We apologize for any inconvenience.
        </p>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-6xl mb-4"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🌳
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Tree Adoption</h2>
          <p className="text-cream/80">Please enter the password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            className={`relative mb-6 ${isShaking ? 'animate-shake' : ''}`}
            animate={isShaking ? {
              x: [-10, 10, -10, 10, 0],
              transition: { duration: 0.4 }
            } : {}}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
              placeholder="Enter password"
              autoFocus
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  className="absolute -bottom-6 left-0 text-sm text-red-300"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-white text-forest-green rounded-xl font-semibold hover:bg-cream transition-colors relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Enter Application</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-forest-green/10 to-sage-green/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-cream/60 text-sm">
            Need the password? Contact our team
          </p>
          <p className="text-yellow-300/80 text-xs italic">
            Note: This password protection is temporary and will be removed once the application goes into production.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordGate; 
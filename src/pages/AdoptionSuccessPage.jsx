import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdoptionSuccessPage = () => {
  const location = useLocation();
  const { treeName, amount, duration, paymentId, adoptionDetails } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center"
            >
              <span className="text-5xl">🌳</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold text-forest-green">
              Congratulations! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              You've successfully adopted a {treeName} for {duration} year{duration > 1 ? 's' : ''}!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-cream/30 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-forest-green mb-4">Adoption Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Tree Species:</span><br />
                  {adoptionDetails?.species || treeName}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span><br />
                  {adoptionDetails?.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Duration:</span><br />
                  {duration} year{duration > 1 ? 's' : ''}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Environmental Impact:</span><br />
                  {adoptionDetails?.impact}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Amount Paid:</span><br />
                  ₹{amount}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Payment ID:</span><br />
                  {paymentId}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 space-y-4"
          >
            <p className="text-gray-600">
              We've sent a confirmation email with your adoption certificate and details.
              You can track your tree's progress in your dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 bg-forest-green text-white rounded-xl hover:bg-forest-green/90 transition-colors"
              >
                View My Tree
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center justify-center px-6 py-3 bg-sage-green/20 text-forest-green rounded-xl hover:bg-sage-green/30 transition-colors"
              >
                Adopt Another Tree
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdoptionSuccessPage; 
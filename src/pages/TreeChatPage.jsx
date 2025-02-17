import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TreeChatbot from '../components/TreeChatbot';
import { motion } from 'framer-motion';

const TreeChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tree, setTree] = useState(null);

  useEffect(() => {
    if (!location.state?.tree) {
      navigate('/dashboard');
      return;
    }
    setTree(location.state.tree);
  }, [location.state, navigate]);

  if (!tree) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-forest-green hover:text-forest-green/80 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to Dashboard</span>
        </button>

        {/* Tree Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={tree.images?.primary || 'https://images.unsplash.com/photo-1610847499832-918a1c3c6813'}
                alt={tree.common_names?.english || 'Tree'}
                className="w-24 h-24 rounded-lg object-cover shadow-md"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-forest-green mb-2">
                  {tree.common_names?.english || 'Your Tree'}
                </h1>
                <p className="text-sage-green italic">{tree.scientific_name}</p>
                <p className="text-gray-600 mt-1">{tree.location}</p>
              </div>
            </div>
            
            {/* Tree Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-forest-green/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Health</p>
                <p className="font-medium text-forest-green">{tree.health}</p>
              </div>
              <div className="bg-forest-green/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="font-medium text-forest-green">{tree.characteristics?.growth_rate}</p>
              </div>
              <div className="bg-forest-green/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium text-forest-green">{tree.characteristics?.age || 'Mature'}</p>
              </div>
              <div className="bg-forest-green/5 rounded-lg p-3">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-medium text-forest-green">{tree.progress}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Section Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl text-forest-green font-semibold">Chat with Your Tree</h2>
          <p className="text-sage-green text-sm">Ask questions and learn about your tree's journey</p>
        </div>

        {/* Enhanced Chatbot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <TreeChatbot
            treeData={{
              species: tree.scientific_name,
              age: tree.characteristics?.age || 'mature',
              location: tree.location,
              features: `${tree.characteristics?.height ? `Height: ${tree.characteristics.height.current}m, ` : ''}
                Growth Rate: ${tree.characteristics?.growth_rate || 'moderate'},
                Health: ${tree.health},
                Environmental Impact: ${tree.uses?.environmental?.join(', ')}`,
              medicinalUses: tree.uses?.medicinal || [],
              careGuidelines: tree.care_guidelines || {},
              progress: tree.progress
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TreeChatPage; 
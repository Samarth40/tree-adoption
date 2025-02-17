import React from 'react';
import { motion } from 'framer-motion';

const SuccessStory = ({ story }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden"
  >
    <div className="relative h-48">
      <img 
        src={story.beforeImage} 
        alt="Before" 
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 hover:opacity-100"
      />
      <img 
        src={story.afterImage} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
    <div className="p-6">
      <div className="flex items-center mb-4">
        <img 
          src={story.volunteerImage} 
          alt={story.volunteerName} 
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h3 className="font-bold text-gray-800">{story.volunteerName}</h3>
          <p className="text-sm text-gray-600">{story.role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic">"{story.testimonial}"</p>
    </div>
  </motion.div>
);

export default SuccessStory; 
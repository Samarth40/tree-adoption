import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaUsers, FaChartLine, FaCheck } from 'react-icons/fa';

const HomeAbout = () => {
  return (
    <div className="bg-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-forest-green sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-4 text-xl text-sage-green">
            Creating a sustainable future through VanaRaksha
          </p>
        </div>

        <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-3">
          <div className="group bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute w-24 h-24 bg-forest-green/5 rounded-full -top-12 -left-12 group-hover:scale-[6] transition-transform duration-700" />
              <div className="absolute w-32 h-32 bg-sage-green/5 rounded-full -bottom-16 -right-16 group-hover:scale-[4] transition-transform duration-700 delay-100" />
            </div>
            
            {/* Content wrapper */}
            <div className="relative">
              {/* Icon with ring effect */}
              <div className="relative inline-block">
                <div className="text-leaf-green text-4xl mb-4 relative z-10">
                  <FaLeaf />
                </div>
                <div className="absolute inset-0 bg-leaf-green/10 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
              
              {/* Text content with stagger effect */}
              <div className="transform-gpu transition-all duration-300">
                <h3 className="text-xl font-semibold text-forest-green mb-2 group-hover:translate-x-1">
                  Environmental Impact
                </h3>
                <p className="text-gray-600 group-hover:translate-x-2 transition-transform delay-75 duration-300">
                  Each adopted tree helps absorb CO₂, produce oxygen, and create habitats for wildlife.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute w-24 h-24 bg-forest-green/5 rounded-full -top-12 -left-12 group-hover:scale-[6] transition-transform duration-700" />
              <div className="absolute w-32 h-32 bg-sage-green/5 rounded-full -bottom-16 -right-16 group-hover:scale-[4] transition-transform duration-700 delay-100" />
            </div>
            
            {/* Content wrapper */}
            <div className="relative">
              {/* Icon with ring effect */}
              <div className="relative inline-block">
                <div className="text-leaf-green text-4xl mb-4 relative z-10">
                  <FaUsers />
                </div>
                <div className="absolute inset-0 bg-leaf-green/10 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
              
              {/* Text content with stagger effect */}
              <div className="transform-gpu transition-all duration-300">
                <h3 className="text-xl font-semibold text-forest-green mb-2 group-hover:translate-x-1">
                  Community Building
                </h3>
                <p className="text-gray-600 group-hover:translate-x-2 transition-transform delay-75 duration-300">
                  Join a community of environmental enthusiasts committed to making a difference.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute w-24 h-24 bg-forest-green/5 rounded-full -top-12 -left-12 group-hover:scale-[6] transition-transform duration-700" />
              <div className="absolute w-32 h-32 bg-sage-green/5 rounded-full -bottom-16 -right-16 group-hover:scale-[4] transition-transform duration-700 delay-100" />
            </div>
            
            {/* Content wrapper */}
            <div className="relative">
              {/* Icon with ring effect */}
              <div className="relative inline-block">
                <div className="text-leaf-green text-4xl mb-4 relative z-10">
                  <FaChartLine />
                </div>
                <div className="absolute inset-0 bg-leaf-green/10 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
              
              {/* Text content with stagger effect */}
              <div className="transform-gpu transition-all duration-300">
                <h3 className="text-xl font-semibold text-forest-green mb-2 group-hover:translate-x-1">
                  Track Your Impact
                </h3>
                <p className="text-gray-600 group-hover:translate-x-2 transition-transform delay-75 duration-300">
                  Monitor your tree's growth and environmental contribution through our platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-forest-green mb-6">
                Why Choose VanaRaksha?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-600">
                  <FaCheck className="text-leaf-green mr-2" />
                  Support local environmental conservation
                </li>
                <li className="flex items-center text-gray-600">
                  <FaCheck className="text-leaf-green mr-2" />
                  Receive regular updates about your tree
                </li>
                <li className="flex items-center text-gray-600">
                  <FaCheck className="text-leaf-green mr-2" />
                  Contribute to climate change mitigation
                </li>
                <li className="flex items-center text-gray-600">
                  <FaCheck className="text-leaf-green mr-2" />
                  Create lasting environmental impact
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3"
                alt="Forest"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAbout; 
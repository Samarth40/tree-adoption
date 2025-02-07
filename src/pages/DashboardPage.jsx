import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('my-trees');
  
  // Mock user data
  const userData = {
    name: "John Doe",
    treesAdopted: 4,
    totalImpact: "640kg CO₂",
    joinDate: "March 2024",
    nextMaintenance: "April 15, 2024",
    impactBadges: ["Early Adopter", "Carbon Reducer", "Wildlife Supporter"],
  };

  // Mock adopted trees data
  const adoptedTrees = [
    {
      id: 1,
      name: "Red Maple",
      adoptionDate: "2024-01-15",
      location: "North Garden",
      health: "Excellent",
      lastMaintenance: "2024-03-01",
      co2Absorbed: "120kg",
      image: "https://images.unsplash.com/photo-1477511801984-4ad318ed9846?ixlib=rb-4.0.3",
      progress: 85
    },
    {
      id: 2,
      name: "White Oak",
      adoptionDate: "2024-02-01",
      location: "East Garden",
      health: "Good",
      lastMaintenance: "2024-03-10",
      co2Absorbed: "180kg",
      image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3",
      progress: 92
    },
    {
      id: 3,
      name: "Eastern White Pine",
      adoptionDate: "2024-02-15",
      location: "West Garden",
      health: "Good",
      lastMaintenance: "2024-03-05",
      co2Absorbed: "150kg",
      image: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?ixlib=rb-4.0.3",
      progress: 78
    },
    {
      id: 4,
      name: "River Birch",
      adoptionDate: "2024-03-01",
      location: "South Garden",
      health: "Excellent",
      lastMaintenance: "2024-03-15",
      co2Absorbed: "190kg",
      image: "https://images.unsplash.com/photo-1502394202744-021cfbb17454?ixlib=rb-4.0.3",
      progress: 95
    }
  ];

  // Mock activity history
  const activityHistory = [
    {
      id: 1,
      type: "Maintenance",
      description: "Scheduled pruning completed for Red Maple",
      date: "2024-03-01",
      status: "Completed"
    },
    {
      id: 2,
      type: "Growth Milestone",
      description: "White Oak reached 10ft height",
      date: "2024-02-28",
      status: "Achievement"
    },
    {
      id: 3,
      type: "Impact",
      description: "Trees collectively absorbed 500kg CO₂",
      date: "2024-02-25",
      status: "Milestone"
    },
    {
      id: 4,
      type: "Adoption",
      description: "New tree adopted: River Birch",
      date: "2024-03-01",
      status: "New"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Overview Section */}
        <div className="mb-8">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-forest-green/5 rounded-full -translate-x-16 -translate-y-16" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-forest-green mb-2">Welcome back, {userData.name}!</h1>
                  <p className="text-sage-green">Member since {userData.joinDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-forest-green">{userData.treesAdopted} Trees</p>
                  <p className="text-sage-green">Total Impact: {userData.totalImpact}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.impactBadges.map((badge, index) => (
                  <span 
                    key={index}
                    className="bg-leaf-green/10 text-forest-green px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {['my-trees', 'activity', 'impact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-forest-green text-white shadow-lg'
                  : 'bg-white text-forest-green hover:bg-forest-green/5'
              }`}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeTab === 'my-trees' && (
            <motion.div
              key="trees"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adoptedTrees.map((tree) => (
                  <div key={tree.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex">
                      <div className="w-1/3">
                        <img 
                          src={tree.image} 
                          alt={tree.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-forest-green">{tree.name}</h3>
                            <p className="text-sage-green">{tree.location}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            tree.health === 'Excellent' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {tree.health}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Growth Progress</span>
                              <span className="text-forest-green font-medium">{tree.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-leaf-green rounded-full h-2 transition-all duration-500"
                                style={{ width: `${tree.progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">CO₂ Absorbed</span>
                            <span className="text-forest-green font-medium">{tree.co2Absorbed}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Last Maintenance</span>
                            <span className="text-forest-green font-medium">{tree.lastMaintenance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="space-y-6">
                {activityHistory.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        activity.type === 'Maintenance' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'Growth Milestone' ? 'bg-green-100 text-green-600' :
                        activity.type === 'Impact' ? 'bg-purple-100 text-purple-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {activity.type === 'Maintenance' ? '🔧' :
                         activity.type === 'Growth Milestone' ? '📈' :
                         activity.type === 'Impact' ? '🌍' : '🌱'}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.description}</h4>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'Achievement' ? 'bg-yellow-100 text-yellow-800' :
                      activity.status === 'Milestone' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'impact' && (
            <motion.div
              key="impact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-forest-green mb-4">Carbon Impact</h3>
                <div className="text-4xl font-bold text-leaf-green mb-2">{userData.totalImpact}</div>
                <p className="text-sage-green">Total CO₂ absorbed by your trees</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-forest-green mb-4">Wildlife Support</h3>
                <div className="text-4xl font-bold text-leaf-green mb-2">12 Species</div>
                <p className="text-sage-green">Wildlife species supported</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-forest-green mb-4">Oxygen Production</h3>
                <div className="text-4xl font-bold text-leaf-green mb-2">480kg</div>
                <p className="text-sage-green">Oxygen produced annually</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPage;
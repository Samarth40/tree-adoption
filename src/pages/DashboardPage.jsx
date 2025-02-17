import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import TreeEnrichmentService from '../services/treeEnrichmentService';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('my-trees');
  const [adoptedTrees, setAdoptedTrees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndTrees = async () => {
      if (!currentUser) {
        console.log('No current user found');
        return;
      }

      console.log('Starting to fetch data for user:', currentUser.uid);

      try {
        setIsLoading(true);
        setError(null);

        // Fetch user data
        const userRef = doc(db, 'users', currentUser.uid);
        console.log('Fetching user data from:', userRef.path);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          console.log('Found user data:', userSnap.data());
          const userData = userSnap.data();
          
          // Handle date formatting whether it's a string or Timestamp
          let joinDate;
          if (userData.createdAt?.toDate) {
            // If it's a Timestamp
            joinDate = new Date(userData.createdAt.toDate()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
          } else if (userData.createdAt) {
            // If it's a string
            joinDate = new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
          } else {
            // Fallback
            joinDate = 'Unknown';
          }

          setUserData({
            name: userData.displayName || "Tree Guardian",
            treesAdopted: userData.treesPlanted || 0,
            totalImpact: `${userData.totalImpact || 0}kg CO₂`,
            joinDate: joinDate,
            impactBadges: Array.isArray(userData.achievements) ? userData.achievements : ["First Tree Guardian"]
          });
        } else {
          console.log('No user document found');
        }

        // Fetch adoptions
        const adoptionsRef = collection(db, 'adoptions');
        const adoptionsQuery = query(adoptionsRef, where('userId', '==', currentUser.uid));
        console.log('Fetching adoptions for user:', currentUser.uid);
        const adoptionsSnapshot = await getDocs(adoptionsQuery);
        
        console.log('Found adoptions:', adoptionsSnapshot.size);

        const adoptionsData = [];
        for (const adoptionDoc of adoptionsSnapshot.docs) {
          const adoptionData = adoptionDoc.data();
          console.log('Processing adoption:', adoptionDoc.id, adoptionData);
          
          // Format tree ID - convert scientific name to valid Firestore ID
          let formattedTreeId = adoptionData.treeId;
          if (formattedTreeId && formattedTreeId.includes(' ')) {
            formattedTreeId = formattedTreeId
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, '')
              .slice(0, 30) + '_01';
          }
          
          // Fetch associated tree data
          const treeRef = doc(db, 'trees', formattedTreeId || 'neem_tree_01');
          console.log('Fetching tree data from:', treeRef.path);
          const treeSnap = await getDoc(treeRef);
          
          if (treeSnap.exists()) {
            const treeData = treeSnap.data();
            console.log('Found tree data:', treeData);
            adoptionsData.push({
              id: adoptionDoc.id,
              scientific_name: treeData.species?.scientific_name || adoptionData.species,
              common_names: {
                english: treeData.species?.common_name || adoptionData.treeName || 'Neem',
                local: treeData.species?.local_names?.hindi || 'नीम'
              },
              family: treeData.species?.family || 'Unknown',
              location: treeData.location?.address || adoptionData.location || 'Community Garden, Delhi',
              health: treeData.health_metrics?.overall_health || adoptionData.health || "Excellent",
              lastMaintenance: adoptionData.lastMaintenance?.toDate?.() 
                ? adoptionData.lastMaintenance.toDate().toLocaleDateString()
                : new Date().toLocaleDateString(),
              images: treeData.images || {
                primary: 'https://images.unsplash.com/photo-1610847499832-918a1c3c6813'
              },
              progress: treeData.health_metrics?.growth_progress || adoptionData.progress || 85,
              characteristics: treeData.characteristics || {
                height: { current: 12, potential: 35 },
                growth_rate: 'Fast',
                soil_preference: 'Well-draining soil',
                water_needs: 'Low to Moderate'
              },
              uses: {
                medicinal: treeData.cultural_significance?.medicinal_uses || [],
                environmental: [
                  `CO2 absorption: ${treeData.characteristics?.environmental_benefits?.co2_absorption_rate || 52}kg per year`,
                  `Water conservation: ${treeData.characteristics?.environmental_benefits?.water_conservation || 150}L per month`,
                  'Supports wildlife habitat'
                ]
              },
              care_guidelines: treeData.care_requirements || {
                watering: 'Water deeply but infrequently',
                pruning: 'Annual pruning in early spring',
                fertilization: 'Minimal fertilizer needs'
              }
            });
          } else {
            console.log('No tree document found for ID:', formattedTreeId, '. Using adoption data.');
            // Use adoption data as fallback
            adoptionsData.push({
              id: adoptionDoc.id,
              scientific_name: adoptionData.species || 'Scientific name not available',
              common_names: {
                english: adoptionData.treeName || 'Tree name not available',
                local: ''
              },
              family: 'Information not available',
              location: adoptionData.location || 'Location not specified',
              health: adoptionData.health || "Excellent",
              lastMaintenance: adoptionData.lastMaintenance?.toDate?.() 
                ? adoptionData.lastMaintenance.toDate().toLocaleDateString()
                : new Date().toLocaleDateString(),
              images: {
                primary: 'https://images.unsplash.com/photo-1610847499832-918a1c3c6813'
              },
              progress: adoptionData.progress || 85,
              characteristics: {
                height: { current: 0, potential: 0 },
                growth_rate: 'Information not available',
                soil_preference: 'Information not available',
                water_needs: 'Information not available'
              },
              uses: {
                medicinal: [],
                environmental: adoptionData.environmental_benefits || [
                  'CO2 absorption: 52kg per year',
                  'Water conservation: 150L per month',
                  'Supports wildlife habitat'
                ]
              },
              care_guidelines: {
                watering: 'Information not available',
                pruning: 'Information not available',
                fertilization: 'Information not available'
              }
            });
          }
        }

        console.log('Final processed adoptions data:', adoptionsData);
        setAdoptedTrees(adoptionsData);

      } catch (err) {
        console.error('Error fetching data:', err);
        console.error('Error stack:', err.stack);
        setError('Failed to load your trees. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndTrees();
  }, [currentUser]);

  // Format height display
  const formatHeight = (height = {}) => {
    if (!height || (!height.average && !height.maximum)) return 'Unknown';
    if (height.average && height.maximum) {
      return `${height.average}-${height.maximum}m`;
    }
    return `Up to ${height.maximum || height.average}m`;
  };

  const handleMintNFT = (tree) => {
    // Save tree data to localStorage and navigate to NFT dashboard
    localStorage.setItem('selectedTree', JSON.stringify(tree));
    // Navigate to NFT dashboard with the selected tree
    navigate('/nft', { state: { selectedTree: tree } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
                  <h1 className="text-3xl font-bold text-forest-green mb-2">
                    Welcome back, {userData?.name || 'Tree Guardian'}!
                  </h1>
                  <p className="text-sage-green">Member since {userData?.joinDate || 'Unknown'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-forest-green">{userData?.treesAdopted || 0} Trees</p>
                  <p className="text-sage-green">Total Impact: {userData?.totalImpact || '0kg CO₂'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(userData?.impactBadges || []).map((badge, index) => (
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
          {['my-trees', 'activity', 'care-guidelines'].map((tab) => (
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
              <div className="grid grid-cols-1 gap-6">
                {adoptedTrees.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <h3 className="text-xl text-forest-green mb-4">No Trees Adopted Yet</h3>
                    <p className="text-gray-600 mb-6">Start your journey by adopting your first tree!</p>
                    <Link 
                      to="/explore" 
                      className="inline-block bg-forest-green text-white px-6 py-3 rounded-xl hover:bg-forest-green/90 transition-colors"
                    >
                      Explore Trees
                    </Link>
                  </div>
                ) : (
                  adoptedTrees.map((tree) => (
                    <div key={tree.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 h-64 md:h-auto">
                          <img 
                            src={tree.images?.primary || 'https://images.unsplash.com/photo-1610847499832-918a1c3c6813'}
                            alt={tree.common_names?.english || 'Tree'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-full md:w-2/3 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-2xl font-semibold text-forest-green mb-1">
                                {tree.common_names?.english || 'Unknown Tree'}
                              </h3>
                              <p className="text-sage-green italic mb-1">{tree.scientific_name || 'Scientific name not available'}</p>
                              <p className="text-gray-600">{tree.location || 'Location not specified'}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              tree.health === 'Excellent' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {tree.health || 'Unknown'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-forest-green/5 rounded-lg p-3">
                              <p className="text-sm text-gray-600 mb-1">Height</p>
                              <p className="font-medium text-forest-green">
                                {formatHeight(tree.characteristics?.height)}
                              </p>
                            </div>
                            <div className="bg-forest-green/5 rounded-lg p-3">
                              <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
                              <p className="font-medium text-forest-green">
                                {tree.characteristics?.growth_rate || 'Unknown'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {(tree.uses?.medicinal?.length > 0) && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Medicinal Uses</h4>
                                <div className="flex flex-wrap gap-2">
                                  {tree.uses.medicinal.map((use, index) => (
                                    <span key={index} className="bg-leaf-green/10 text-forest-green px-3 py-1 rounded-full text-sm">
                                      {use}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {(tree.uses?.environmental?.length > 0) && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Environmental Benefits</h4>
                                <div className="flex flex-wrap gap-2">
                                  {tree.uses.environmental.map((benefit, index) => (
                                    <span key={index} className="bg-sage-green/10 text-forest-green px-3 py-1 rounded-full text-sm">
                                      {benefit}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="pt-4 border-t border-gray-100">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Growth Progress</span>
                                <span className="text-forest-green font-medium">{tree.progress || 0}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-leaf-green rounded-full h-2 transition-all duration-500"
                                  style={{ width: `${tree.progress || 0}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Last Maintenance</span>
                              <span className="text-forest-green font-medium">{tree.lastMaintenance || 'Not available'}</span>
                            </div>
                          </div>

                          {/* Add Mint NFT button */}
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={() => handleMintNFT(tree)}
                              className="bg-forest-green text-white px-6 py-3 rounded-xl hover:bg-forest-green/90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                              <span>Mint NFT</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                {adoptedTrees.map((tree) => (
                  <div key={tree.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <h3 className="text-xl font-semibold text-forest-green mb-4">{tree.common_names.english}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tree.uses.environmental.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3 bg-cream/30 rounded-lg p-4">
                          <span className="text-forest-green">🌿</span>
                          <p className="text-gray-700">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'care-guidelines' && (
            <motion.div
              key="care"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="space-y-8">
                {adoptedTrees.map((tree) => (
                  <div key={tree.id} className="border-b border-gray-100 pb-8 last:border-0">
                    <h3 className="text-2xl font-semibold text-forest-green mb-6">{tree.common_names.english}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-forest-green">Care Requirements</h4>
                        <div className="space-y-3">
                          <div className="bg-cream/30 rounded-lg p-4">
                            <p className="font-medium text-gray-700 mb-1">Soil Preference</p>
                            <p className="text-gray-600">{tree.characteristics.soil_preference}</p>
                          </div>
                          <div className="bg-cream/30 rounded-lg p-4">
                            <p className="font-medium text-gray-700 mb-1">Water Needs</p>
                            <p className="text-gray-600">{tree.characteristics.water_needs}</p>
                          </div>
                        </div>
                      </div>
                      {tree.care_guidelines && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-medium text-forest-green">Maintenance Guidelines</h4>
                          <div className="space-y-3">
                            {Object.entries(tree.care_guidelines).map(([key, value]) => (
                              <div key={key} className="bg-cream/30 rounded-lg p-4">
                                <p className="font-medium text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}</p>
                                <p className="text-gray-600">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPage;
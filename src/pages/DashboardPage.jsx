import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import TreeEnrichmentService from '../services/treeEnrichmentService';
import DashboardTreeEnrichmentService from '../services/dashboardTreeEnrichmentService';
import { Link, useNavigate } from 'react-router-dom';
import TreeChatbot from '../components/TreeChatbot';
import TreeCareNotification from '../components/TreeCareNotification';
import { FaWater, FaLeaf, FaCloudSun } from 'react-icons/fa';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('my-trees');
  const [adoptedTrees, setAdoptedTrees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTree, setActiveTree] = useState(null);

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
          
          // Get enriched data from AI service
          const enrichedData = await DashboardTreeEnrichmentService.enrichDashboardTree(
            adoptionData.species || adoptionData.scientific_name || 'Unknown species'
          );
          console.log('Enriched tree data:', enrichedData);
          
          // Get the image URL from adoption data
          let imageUrl = null;
          
          // Debug log for image data
          console.log('Adoption data image fields:', {
            hasImages: !!adoptionData.images,
            hasImage: !!adoptionData.image,
            hasSelectedImage: !!adoptionData.selectedImage,
            hasTreeImage: !!adoptionData.treeImage
          });

          // Try to get image from various possible fields
          if (adoptionData.images?.primary) {
            imageUrl = adoptionData.images.primary;
            console.log('Using primary image from images object:', imageUrl);
          } else if (adoptionData.selectedImage) {
            imageUrl = adoptionData.selectedImage;
            console.log('Using selectedImage:', imageUrl);
          } else if (adoptionData.treeImage) {
            imageUrl = adoptionData.treeImage;
            console.log('Using treeImage:', imageUrl);
          } else if (adoptionData.image) {
            imageUrl = adoptionData.image;
            console.log('Using image field:', imageUrl);
          }

          // If no image found, use a default
          if (!imageUrl) {
            imageUrl = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2313&q=80';
            console.log('No image found in adoption data, using default');
          }

          adoptionsData.push({
            id: adoptionDoc.id,
            ...adoptionData,
            // Format any timestamp fields
            adoptionDate: adoptionData.adoptionDate?.toDate?.() 
              ? adoptionData.adoptionDate.toDate().toLocaleDateString()
              : new Date().toLocaleDateString(),
            createdAt: adoptionData.createdAt?.toDate?.() 
              ? adoptionData.createdAt.toDate().toLocaleDateString()
              : new Date().toLocaleDateString(),
            updatedAt: adoptionData.updatedAt?.toDate?.() 
              ? adoptionData.updatedAt.toDate().toLocaleDateString()
              : new Date().toLocaleDateString(),
            lastMaintenance: adoptionData.lastMaintenance?.toDate?.() 
              ? adoptionData.lastMaintenance.toDate().toLocaleDateString()
              : new Date().toLocaleDateString(),
            image: imageUrl,
            // Keep original scientific name and merge with enriched data
            scientific_name: adoptionData.scientific_name || adoptionData.species,
            common_names: enrichedData.common_names,
            characteristics: {
              ...enrichedData.characteristics,
              // Preserve any existing characteristics if they exist
              ...adoptionData.characteristics
            },
            environmental_impact: enrichedData.environmental_impact,
            care_details: enrichedData.care_details,
            uses: {
              ...adoptionData.uses,
              environmental: enrichedData.environmental_impact.ecological_benefits
            }
          });
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
    console.log('Formatting height data:', height);
    
    if (!height) {
      console.log('No height data provided');
      return 'Unknown';
    }
    
    const avg = height.average ? parseFloat(height.average) : null;
    const max = height.maximum ? parseFloat(height.maximum) : null;
    
    console.log('Parsed height values:', { avg, max });
    
    if (!avg && !max) {
      console.log('No valid height values found');
      return 'Unknown';
    }
    
    if (avg && max) {
      console.log('Both average and maximum heights available');
      return `${avg}-${max}m`;
    }
    
    console.log('Using single height value');
    return `Up to ${max || avg}m`;
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
        <TreeCareNotification adoptedTrees={adoptedTrees} />
        
        {/* User Overview Section */}
        <div className="mb-8">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6 relative overflow-visible"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-forest-green/5 rounded-full -translate-x-16 -translate-y-16" />
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-forest-green mb-2">
                    Welcome back, {userData?.name || 'Tree Guardian'}!
                  </h1>
                  <p className="text-sage-green">Member since {userData?.joinDate || 'Unknown'}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
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

                <div className="flex flex-col items-end gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-forest-green">{userData?.treesAdopted || 0} Trees</p>
                    <p className="text-sage-green">Total Impact: {userData?.totalImpact || '0kg CO₂'}</p>
                  </div>

                  {/* Tree Avatars moved to right side */}
                  <div className="flex flex-wrap gap-2 justify-end">
                    {adoptedTrees.map((tree) => (
                      <motion.div
                        key={tree.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (activeTree === tree.id) {
                            navigate('/tree-chat', { state: { tree } });
                          } else {
                            setActiveTree(tree.id);
                          }
                        }}
                        className="relative cursor-pointer group"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-forest-green/20 group-hover:border-forest-green transition-all duration-300">
                          <img 
                            src={tree.image} 
                            alt={tree.common_names?.english || 'Tree'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {activeTree === tree.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg p-3 z-50"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                                <FaWater className="w-4 h-4 text-blue-500" />
                                <p className="text-sm text-blue-700">Water needed</p>
                              </div>
                              <div className="flex items-center gap-2 bg-yellow-50 p-2 rounded-lg">
                                <FaLeaf className="w-4 h-4 text-yellow-500" />
                                <p className="text-sm text-yellow-700">Health check due</p>
                              </div>
                              {tree.environmental_impact?.co2_absorption_rate && (
                                <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
                                  <FaCloudSun className="w-4 h-4 text-green-500" />
                                  <p className="text-sm text-green-700">{tree.environmental_impact.co2_absorption_rate}kg CO2 absorbed</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          3
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adoptedTrees.length === 0 ? (
                  <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-8 text-center">
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
                    <motion.div 
                      key={tree.id} 
                      className="bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex h-full">
                          {/* Image section */}
                          <div className="relative w-32 h-auto">
                            <div className="absolute inset-0 bg-black/5 transition-all duration-300" />
                            <img 
                              src={tree.image}
                              alt={tree.common_names?.english || 'Tree'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                if (!e.target.src.includes('unsplash')) {
                                  e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2613&q=80';
                                }
                              }}
                            />
                          </div>

                          {/* Content section */}
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                                  {tree.common_names?.english || 'Unknown Tree'}
                                </h3>
                                <p className="text-base text-gray-500 italic mt-0.5">
                                  {tree.scientific_name}
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-base font-medium ${
                                tree.health === 'Excellent' 
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-yellow-50 text-yellow-700'
                              }`}>
                                {tree.health || 'Good'}
                              </span>
                            </div>

                            {/* Growth Rate & Benefits */}
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center gap-1 text-base text-gray-600">
                                <svg className="w-3.5 h-3.5 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-gray-500">Growth:</span>
                                <span className="font-medium text-gray-700">
                                  {tree.characteristics?.growth_rate || 'Moderate'}
                                </span>
                              </div>

                              {tree.uses?.environmental && tree.uses.environmental.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {tree.uses.environmental.slice(0, 2).map((benefit, index) => (
                                    <span 
                                      key={index} 
                                      className="inline-block px-1.5 py-0.5 bg-forest-green/5 text-forest-green rounded text-base"
                                    >
                                      {benefit}
                                    </span>
                                  ))}
                                  {tree.uses.environmental.length > 2 && (
                                    <span className="text-xs text-gray-400">
                                      +{tree.uses.environmental.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3">
                              <div className="flex justify-between text-base mb-1">
                                <span className="text-gray-500">Progress</span>
                                <span className="text-forest-green font-medium">{tree.progress || 0}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                                <div 
                                  className="bg-forest-green h-full rounded-full transition-all duration-500"
                                  style={{ width: `${tree.progress || 0}%` }}
                                />
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-base text-gray-500">
                                Last maintained: {tree.lastMaintenance || 'Not available'}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleMintNFT(tree)}
                                  className="text-base bg-forest-green text-white px-2 py-1 rounded hover:bg-forest-green/90 transition-all duration-300 flex items-center gap-1 group"
                                >
                                  Mint NFT
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => navigate('/tree-chat', { state: { tree } })}
                                  className="text-base bg-leaf-green text-white px-2 py-1 rounded hover:bg-leaf-green/90 transition-all duration-300 flex items-center gap-1 group"
                                >
                                  Chat
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
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
                      {tree.care_details && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-medium text-forest-green">Maintenance Details</h4>
                          <div className="space-y-3">
                            {Object.entries(tree.care_details).map(([key, value]) => (
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
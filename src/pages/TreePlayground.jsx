import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import TreeImage from '../components/TreeImage';
import TreeEnrichmentService from '../services/treeEnrichmentService';
import treeData from '../data/treeData.json';

const DataSourceBadge = ({ isFallback }) => (
  <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-2 ${
    isFallback 
    ? 'bg-yellow-100 text-yellow-800' 
    : 'bg-forest-green/10 text-forest-green'
  }`}>
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      {isFallback ? (
        <path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2" />
      ) : (
        <path d="M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L19.5 17.8C19.7 18.8 18.9 19.6 18 19.4L13.5 18.5L10.7 21.3C10 22 8.7 22 8 21.3C7.3 20.6 7.3 19.3 8 18.6L10.8 15.8L9.9 11.1C9.7 10.1 10.5 9.3 11.4 9.5L15.9 10.4L18.7 7.6C19.4 6.9 20.7 6.9 21.4 7.5Z"/>
      )}
    </svg>
    {isFallback ? 'General Information' : 'AI Enhanced'}
  </span>
);

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
      <div className="text-center">
        <div className="w-20 h-20 relative mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-forest-green/30 rounded-full animate-ping"></div>
          <div className="absolute inset-2 border-4 border-forest-green/50 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute inset-4 border-4 border-forest-green/70 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <h2 className="text-2xl font-bold text-forest-green mb-4">AI Enhancement in Progress</h2>
        <div className="space-y-4">
          <p className="text-gray-600">Our AI is analyzing this tree to provide you with:</p>
          <ul className="text-left text-gray-600 space-y-2 mb-4">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Detailed Characteristics
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Traditional Uses
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Environmental Benefits
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Care Guidelines
            </li>
          </ul>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-forest-green/20">
              <motion.div 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-forest-green"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TreePlayground = () => {
  const { treeId } = useParams();
  const [tree, setTree] = useState(null);
  const [isEnriching, setIsEnriching] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAdoptionInfo, setShowAdoptionInfo] = useState(false);

  useEffect(() => {
    const loadTreeData = async () => {
      try {
        // Find the tree from treeData.json using treeId
        const selectedTree = treeData.find(t => t.scientific_name === decodeURIComponent(treeId));
        
        if (!selectedTree) {
          console.error('Tree not found');
          return;
        }

        // Set initial tree data
        setTree(selectedTree);

        // Enrich with AI data
        const enrichedData = await TreeEnrichmentService.enrichTreeData(selectedTree);
        setTree(enrichedData);
        setIsEnriching(false);
      } catch (error) {
        console.error('Error loading tree data:', error);
        setIsEnriching(false);
      }
    };

    loadTreeData();
  }, [treeId]);

  if (!tree) {
    return <LoadingOverlay />;
  }

  // Format height and spread values
  const formatMeasurement = (measurement) => {
    if (!measurement) return 'Unknown';
    if (typeof measurement === 'object') {
      const { average, maximum } = measurement;
      if (average && maximum) return `${average}-${maximum}m`;
      return `Up to ${maximum || average}m`;
    }
    return `${measurement}m`;
  };

  const adoptionGuidelines = [
    {
      title: "Watering",
      guideline: tree.care_guidelines?.watering || "Regular watering schedule based on seasonal needs"
    },
    {
      title: "Soil Care",
      guideline: tree.characteristics?.soil_preference || "Annual soil health maintenance and mulching"
    },
    {
      title: "Pruning",
      guideline: tree.care_guidelines?.pruning || "Periodic pruning and shape maintenance"
    },
    {
      title: "Protection",
      guideline: tree.characteristics?.climate_tolerance || "Protection from extreme weather conditions"
    },
    {
      title: "Health Monitoring",
      guideline: tree.care_guidelines?.pest_management || "Regular monitoring for pests and diseases"
    },
    {
      title: "Documentation",
      guideline: "Documentation of growth and development"
    }
  ];

  const faqs = [
    {
      question: `Why should I adopt a ${tree.common_names.english || tree.scientific_name.split(' ')[0]}?`,
      answer: tree.environmental_benefits?.[0] || "This tree species plays a vital role in our ecosystem and needs protection."
    },
    {
      question: "What are my responsibilities as a tree adopter?",
      answer: "As an adopter, you'll need to ensure regular care, maintenance, and monitoring of your tree's health and growth."
    },
    {
      question: "How long is the adoption commitment?",
      answer: "We recommend a minimum one-year commitment to ensure the tree establishes itself properly."
    },
    {
      question: "What support will I receive?",
      answer: "You'll receive regular guidance, expert advice, and access to our community of tree adopters."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-28">
      <AnimatePresence>
        {isEnriching && <LoadingOverlay />}
      </AnimatePresence>

      {/* Image Design Section */}
      <div className="bg-cream/20 px-12 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with Stats */}
          <div className="flex gap-10 mb-12">
            {/* Hero Image Container */}
            <div className="relative rounded-3xl overflow-hidden flex-1 group">
              <div className="relative h-[500px] overflow-hidden">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <TreeImage
                    src={selectedImage || tree.images?.primary || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2613&q=80"}
                    alt={tree.common_names?.english || tree.scientific_name}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2613&q=80";
                    }}
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute inset-0 p-12 flex flex-col justify-between">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                      {tree.common_names.english || tree.scientific_name.split(' ')[0]}
                    </h1>
                    <p className="text-2xl text-white/90 mb-6 italic drop-shadow-lg">
                      {tree.scientific_name}
                    </p>
                    <p className="text-lg text-white/80 mb-8 max-w-2xl leading-relaxed drop-shadow-lg">
                      By adopting this tree, you'll contribute to environmental conservation and create a lasting legacy for future generations.
                    </p>
                  </motion.div>

                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        to={`/adopt/${encodeURIComponent(tree.scientific_name)}`}
                        className="bg-forest-green text-white px-8 py-4 rounded-xl hover:bg-forest-green/90 transition-all flex items-center gap-2 text-lg group relative overflow-hidden shadow-lg"
                      >
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative">Learn About Adoption</span>
                        <svg className="w-6 h-6 transform transition-transform group-hover:translate-x-1 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-3 w-[140px]">
                      {(() => {
                        // Get all images excluding the primary image
                        const additionalImages = tree.images.all
                          ?.filter(img => 
                            img.url && 
                            img.url !== tree.images.primary && 
                            typeof img.url === 'string' && 
                            img.url.trim() !== '' && 
                            img.url !== 'undefined' && 
                            img.url !== 'null'
                          )
                          .map(img => img.url) || [];

                        // Take only the first 3 unique additional images
                        const uniqueAdditionalImages = [...new Set(additionalImages)].slice(0, 3);

                        // Create final array with primary image and unique additional images
                        const finalImages = [tree.images.primary, ...uniqueAdditionalImages];

                        // Set initial selected image if not set
                        if (!selectedImage && finalImages.length > 0) {
                          setSelectedImage(finalImages[0]);
                        }

                        return finalImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(image)}
                            className={`w-16 h-16 rounded-xl overflow-hidden transition-all transform hover:scale-105 ${
                              selectedImage === image 
                                ? 'ring-2 ring-white scale-105 shadow-lg' 
                                : 'hover:ring-2 hover:ring-white/50 hover:shadow-md'
                            }`}
                          >
                            <img 
                              src={image}
                              alt={`Tree view ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09";
                              }}
                            />
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats - Vertical Layout */}
            <div className="w-[250px] h-[500px] flex flex-col justify-between">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-forest-green/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start gap-4 relative">
                  <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">🌳</span>
                  <div>
                    <h3 className="text-xl font-semibold text-forest-green mb-2">Family</h3>
                    <p className="text-xl text-gray-700">{tree.family || 'Arecaceae'}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-forest-green/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start gap-4 relative">
                  <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">📏</span>
                  <div>
                    <h3 className="text-xl font-semibold text-forest-green mb-2">Maximum Height</h3>
                    <p className="text-xl text-gray-700">20-30 meters</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-forest-green/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start gap-4 relative">
                  <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">🌱</span>
                  <div>
                    <h3 className="text-xl font-semibold text-forest-green mb-2">Growth Rate</h3>
                    <p className="text-xl text-gray-700">Grows slowly, up to 1 meter per year</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Traditional Wisdom and Environmental Benefits */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Traditional Wisdom Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-forest-green/10 rounded-lg flex items-center justify-center"
                >
                  <span className="text-2xl">🌿</span>
                </motion.div>
                <h2 className="text-2xl font-bold text-forest-green">Traditional Wisdom</h2>
              </div>

              <div className="space-y-4">
                {/* Medical Benefits */}
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="group relative bg-cream/30 rounded-lg p-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">💊</span>
                    <div>
                      <h3 className="text-lg font-semibold text-forest-green group-hover:text-forest-green/80 transition-colors">
                        Medical Benefits
                      </h3>
                      <div className="mt-2 space-y-2">
                        {tree.uses.medicinal?.slice(0, 2).map((use, index) => (
                          <p key={index} className="text-gray-700">
                            {typeof use === 'object' ? use.use : use}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Cultural Heritage */}
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="group relative bg-cream/30 rounded-lg p-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">🏺</span>
                    <div>
                      <h3 className="text-lg font-semibold text-forest-green group-hover:text-forest-green/80 transition-colors">
                        Cultural Heritage
                      </h3>
                      <div className="mt-2 space-y-2">
                        {tree.uses.cultural?.slice(0, 2).map((use, index) => (
                          <p key={index} className="text-gray-700">
                            {typeof use === 'object' ? use.use : use}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Environmental Benefits Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-forest-green/10 rounded-lg flex items-center justify-center"
                >
                  <span className="text-2xl">🌍</span>
                </motion.div>
                <h2 className="text-2xl font-bold text-forest-green">Environmental Benefits</h2>
              </div>

              <div className="space-y-3">
                {(tree.environmental_benefits || [
                  "Carbon: 100 tons/hectare",
                  "Temperature regulation",
                  "Soil erosion prevention"
                ]).map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="group bg-cream/30 rounded-lg p-4 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {index === 0 ? "🌳" : index === 1 ? "🌡️" : "🌱"}
                        </span>
                        <p className="text-gray-700 group-hover:text-forest-green transition-colors">
                          {benefit}
                        </p>
                      </div>
                      <div className="w-16 h-1 bg-forest-green/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.8, delay: index * 0.2 }}
                          className="h-full bg-forest-green/30"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Adoption CTA Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all mb-8">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🤝</span>
                  <h2 className="text-3xl font-bold text-forest-green">Make a Lasting Impact</h2>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  By adopting this tree, you'll contribute to environmental conservation and create a lasting legacy for future generations.
                </p>
                <Link
                  to={`/adopt/${encodeURIComponent(tree.scientific_name)}`}
                  className="bg-forest-green text-white px-6 py-3 rounded-xl hover:bg-forest-green/90 transition-all flex items-center gap-2 text-lg font-medium group w-fit"
                >
                  <span>Adopt Now</span>
                  <svg 
                    className="w-6 h-6 transform transition-transform group-hover:translate-x-1"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="bg-cream/20 rounded-xl p-4">
                <h3 className="text-xl font-semibold text-forest-green flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎯</span>
                  Impact Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                    <span className="text-2xl">🌳</span>
                    <div>
                      <p className="font-medium text-forest-green">Carbon Absorption</p>
                      <p className="text-gray-600">52kg CO₂ per year</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                    <span className="text-2xl">💧</span>
                    <div>
                      <p className="font-medium text-forest-green">Water Conservation</p>
                      <p className="text-gray-600">150L per month</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                    <span className="text-2xl">🦋</span>
                    <div>
                      <p className="font-medium text-forest-green">Biodiversity Support</p>
                      <p className="text-gray-600">Habitat for local species</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Traditional Uses */}
          {(tree.uses.medicinal?.length > 0 || tree.uses.cultural?.length > 0) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-forest-green/10 rounded-lg flex items-center justify-center"
                >
                  <span className="text-2xl">🌿</span>
                </motion.div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-forest-green">Traditional Wisdom</h2>
                  <DataSourceBadge isFallback={tree.uses.is_fallback} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {tree.uses.medicinal?.length > 0 && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="group bg-cream/30 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-1">💊</span>
                      <div>
                        <h3 className="text-lg font-semibold text-forest-green group-hover:text-forest-green/80 transition-colors">
                          Medicinal Benefits
                        </h3>
                        <div className="mt-2 space-y-2">
                          {tree.uses.medicinal.map((use, index) => {
                            const useText = typeof use === 'object' ? use.use : use;
                            const scientificBasis = typeof use === 'object' ? use.scientific_basis : null;
                            
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex items-start gap-2">
                                  <span className="text-forest-green mt-1">•</span>
                                  <p className="text-gray-700">{useText}</p>
                                </div>
                                {scientificBasis && (
                                  <p className="text-sm text-forest-green/70 italic ml-4">
                                    Scientific basis: {scientificBasis}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {tree.uses.cultural?.length > 0 && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="group bg-cream/30 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-1">🏺</span>
                      <div>
                        <h3 className="text-lg font-semibold text-forest-green group-hover:text-forest-green/80 transition-colors">
                          Cultural Heritage
                        </h3>
                        <div className="mt-2 space-y-2">
                          {tree.uses.cultural.map((use, index) => {
                            const useText = typeof use === 'object' ? use.use : use;
                            const significance = typeof use === 'object' ? use.significance : null;
                            
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex items-start gap-2">
                                  <span className="text-forest-green mt-1">•</span>
                                  <p className="text-gray-700">{useText}</p>
                                </div>
                                {significance && (
                                  <p className="text-sm text-forest-green/70 italic ml-4">
                                    Significance: {significance}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {tree.ai_enhanced && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mb-8"
            >
              {/* Characteristics */}
              {tree.characteristics.ai_enhanced && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-transparent to-sage-green/5 rounded-xl" />
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-forest-green/5 rounded-full blur-2xl" />
                  <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-sage-green/5 rounded-full blur-2xl" />
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md hover:shadow-xl transition-all relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent rounded-xl group-hover:from-forest-green/[0.04] transition-all duration-500" />
                    <h2 className="text-3xl font-bold text-forest-green mb-6 flex items-center gap-3">
                      <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">🌱</span>
                      Tree Characteristics
                      <DataSourceBadge isFallback={tree.characteristics.is_fallback} />
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(tree.characteristics).map(([key, value]) => {
                        if (key !== 'ai_enhanced' && value && typeof value !== 'object') {
                          return (
                            <motion.div
                              key={key}
                              whileHover={{ scale: 1.02 }}
                              className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative group/card overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-forest-green/5 rounded-full blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                              <h3 className="text-lg font-semibold text-forest-green mb-3 capitalize flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-forest-green rounded-full"></span>
                                {key.replace(/_/g, ' ')}
                              </h3>
                              <p className="text-lg text-gray-700 relative">{value}</p>
                            </motion.div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Care Guidelines */}
              {tree.care_guidelines && Object.keys(tree.care_guidelines).length > 0 && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-transparent to-sage-green/5 rounded-xl" />
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-forest-green/5 rounded-full blur-2xl" />
                  <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-sage-green/5 rounded-full blur-2xl" />
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md hover:shadow-xl transition-all relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent rounded-xl group-hover:from-forest-green/[0.04] transition-all duration-500" />
                    <h2 className="text-3xl font-bold text-forest-green mb-6 flex items-center gap-3">
                      <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">🌿</span>
                      Care Guidelines
                      <DataSourceBadge isFallback={tree.is_fallback} />
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {Object.entries(tree.care_guidelines).map(([key, value]) => (
                        <motion.div
                          key={key}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative group/card overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-forest-green/5 rounded-full blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                          <h3 className="text-lg font-semibold text-forest-green mb-3 capitalize flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-forest-green rounded-full"></span>
                            {key.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-lg text-gray-700 relative">{value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Uses */}
              {tree.uses.ai_enhanced && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-transparent to-sage-green/5 rounded-xl" />
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-forest-green/5 rounded-full blur-2xl" />
                  <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-sage-green/5 rounded-full blur-2xl" />
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md hover:shadow-xl transition-all relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent rounded-xl group-hover:from-forest-green/[0.04] transition-all duration-500" />
                    <h2 className="text-3xl font-bold text-forest-green mb-6 flex items-center gap-3">
                      <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">🎯</span>
                      Tree Uses
                      <DataSourceBadge isFallback={tree.uses.is_fallback} />
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {Object.entries(tree.uses).map(([key, value]) => {
                        if (key !== 'ai_enhanced' && Array.isArray(value) && value.length > 0) {
                          return (
                            <motion.div
                              key={key}
                              whileHover={{ scale: 1.02 }}
                              className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative group/card overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-forest-green/5 rounded-full blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                              <h3 className="text-lg font-semibold text-forest-green mb-3 capitalize flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-forest-green rounded-full"></span>
                                {key.replace(/_/g, ' ')}
                              </h3>
                              <ul className="space-y-2">
                                {value.map((item, index) => {
                                  const itemText = typeof item === 'object' ? item.use : item;
                                  const scientificBasis = typeof item === 'object' ? item.scientific_basis : null;
                                  
                                  return (
                                    <li key={index} className="flex flex-col gap-1">
                                      <div className="flex items-start gap-2">
                                        <span className="text-forest-green mt-1">•</span>
                                        <span className="text-lg text-gray-700">{itemText}</span>
                                      </div>
                                      {scientificBasis && (
                                        <p className="ml-4 text-sm text-forest-green/70 italic">
                                          Scientific basis: {scientificBasis}
                                        </p>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </motion.div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Fun Facts */}
              {tree.fun_facts && tree.fun_facts.length > 0 && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-transparent to-sage-green/5 rounded-xl" />
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-forest-green/5 rounded-full blur-2xl" />
                  <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-sage-green/5 rounded-full blur-2xl" />
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md hover:shadow-xl transition-all relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent rounded-xl group-hover:from-forest-green/[0.04] transition-all duration-500" />
                    <h2 className="text-3xl font-bold text-forest-green mb-6 flex items-center gap-3">
                      <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">✨</span>
                      Fun Facts
                      <DataSourceBadge isFallback={tree.uses.is_fallback} />
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tree.fun_facts.map((fact, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative group/card overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-forest-green/[0.02] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-forest-green/5 rounded-full blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                          <p className="text-lg text-gray-700 relative">{fact}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {tree.is_fallback && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Some information shown is general knowledge about trees. Specific details about this tree species may vary.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreePlayground; 
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
    <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10">
      <AnimatePresence>
        {isEnriching && <LoadingOverlay />}
      </AnimatePresence>
      
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
          <TreeImage
            src={selectedImage || tree.images.primary}
            alt={tree.common_names.english || tree.scientific_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 h-full">
          <div className="max-w-7xl mx-auto px-6 h-full">
            <div className="flex flex-col h-full pt-8">
              {/* Back Navigation */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors group self-start"
              >
                <svg 
                  className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-lg font-medium">Return to Forest</span>
              </Link>

              {/* Tree Title */}
              <div className="flex-grow flex items-center">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h1 className="text-6xl font-bold text-white">
                      {tree.common_names.english || tree.scientific_name.split(' ')[0]}
                    </h1>
                    <p className="text-3xl italic text-white/80">{tree.scientific_name}</p>
                    {tree.common_names.local && (
                      <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                        <span className="text-xl text-white">{tree.common_names.local}</span>
                      </div>
                    )}
                    <Link
                      to={`/adopt/${encodeURIComponent(tree.scientific_name)}`}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-forest-green text-white rounded-xl hover:bg-forest-green/90 transition-all group text-lg font-medium shadow-lg hover:shadow-xl"
                    >
                      <span>Adopt This Tree</span>
                      <svg 
                        className="w-6 h-6 transform transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Image Gallery */}
              {tree.images.all?.length > 1 && (
                <div className="pb-8">
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {tree.images.all.slice(0, 5).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image.url)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-transform hover:scale-105
                          ${image.url === (selectedImage || tree.images.primary) ? 'ring-2 ring-white scale-105' : 'ring-1 ring-white/50'}`}
                      >
                        <img
                          src={image.url}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-30">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Stats */}
          {tree.family && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-3xl mb-4 block">🌳</span>
              <h3 className="text-forest-green font-semibold mb-2">Family</h3>
              <p className="text-2xl text-forest-green/80">{tree.family}</p>
            </motion.div>
          )}
          {tree.characteristics?.height?.maximum && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-3xl mb-4 block">📏</span>
              <h3 className="text-forest-green font-semibold mb-2">Maximum Height</h3>
              <p className="text-2xl text-forest-green/80">{formatMeasurement(tree.characteristics.height)}</p>
            </motion.div>
          )}
          {tree.characteristics.growth_rate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-3xl mb-4 block">🌱</span>
              <h3 className="text-forest-green font-semibold mb-2">Growth Rate</h3>
              <p className="text-2xl text-forest-green/80">{tree.characteristics.growth_rate}</p>
            </motion.div>
          )}
        </div>

        {/* Adoption CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-forest-green mb-6">Make a Lasting Impact</h2>
              <p className="text-lg text-gray-700 mb-8">
                By adopting this tree, you'll contribute to environmental conservation and create a lasting legacy for future generations.
              </p>
              <Link
                to={`/adopt/${encodeURIComponent(tree.scientific_name)}`}
                className="bg-forest-green text-white px-8 py-4 rounded-xl hover:bg-forest-green/90 transition-colors flex items-center gap-3 text-lg font-medium group w-fit"
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
            <div className="relative">
              {tree.environmental_benefits?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-forest-green flex items-center gap-2">
                    <span className="text-2xl">🌍</span>
                    Environmental Benefits
                    <DataSourceBadge isFallback={tree.is_fallback} />
                  </h3>
                  <ul className="space-y-3">
                    {tree.environmental_benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-forest-green mt-1">•</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Adoption Information */}
        {showAdoptionInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-8"
          >
            {/* Guidelines */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-forest-green mb-8 flex items-center gap-3">
                <span className="text-3xl">🤝</span>
                Adoption Guidelines
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {adoptionGuidelines.map((guideline, index) => (
                  <div
                    key={index}
                    className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <h3 className="text-lg font-semibold text-forest-green mb-3">{guideline.title}</h3>
                    <p className="text-gray-700">{guideline.guideline}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-forest-green mb-8 flex items-center gap-3">
                <span className="text-3xl">❓</span>
                Common Questions
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <h3 className="text-lg font-semibold text-forest-green mb-3">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Traditional Uses */}
        {(tree.uses.medicinal?.length > 0 || tree.uses.cultural?.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-forest-green mb-8 flex items-center gap-3">
                <span className="text-3xl">🌿</span>
                Traditional Wisdom
                <DataSourceBadge isFallback={tree.uses.is_fallback} />
              </h2>
              <div className="space-y-8">
                {tree.uses.medicinal?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-forest-green mb-6">Medicinal Benefits</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {tree.uses.medicinal.map((use, index) => {
                        const useText = typeof use === 'object' ? use.use : use;
                        const scientificBasis = typeof use === 'object' ? use.scientific_basis : null;
                        
                        return (
                          <div
                            key={index}
                            className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                          >
                            <p className="text-gray-700">{useText}</p>
                            {scientificBasis && (
                              <p className="mt-2 text-sm text-forest-green/70 italic">
                                Scientific basis: {scientificBasis}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {tree.uses.cultural?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-forest-green mb-6">Cultural Heritage</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {tree.uses.cultural.map((use, index) => (
                        <div
                          key={index}
                          className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                        >
                          <p className="text-gray-700">{use}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* AI Enhanced Sections */}
        {tree.ai_enhanced && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 mb-16"
          >
            {/* Characteristics */}
            {tree.characteristics.ai_enhanced && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-forest-green mb-8 flex items-center gap-3">
                  <span className="text-3xl">🌱</span>
                  Tree Characteristics
                  <DataSourceBadge isFallback={tree.characteristics.is_fallback} />
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(tree.characteristics).map(([key, value]) => {
                    if (key !== 'ai_enhanced' && value && typeof value !== 'object') {
                      return (
                        <div key={key} className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                          <h3 className="text-lg font-semibold text-forest-green mb-3 capitalize">
                            {key.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-gray-700">{value}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Care Guidelines */}
            {tree.care_guidelines && Object.keys(tree.care_guidelines).length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-forest-green mb-8 flex items-center gap-3">
                  <span className="text-3xl">🌿</span>
                  Care Guidelines
                  <DataSourceBadge isFallback={tree.is_fallback} />
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {Object.entries(tree.care_guidelines).map(([key, value]) => (
                    <div key={key} className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                      <h3 className="text-lg font-semibold text-forest-green mb-3 capitalize">
                        {key.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-gray-700">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uses */}
            {tree.uses.ai_enhanced && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-forest-green mb-8 flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  Tree Uses
                  <DataSourceBadge isFallback={tree.uses.is_fallback} />
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {Object.entries(tree.uses).map(([key, value]) => {
                    if (key !== 'ai_enhanced' && Array.isArray(value) && value.length > 0) {
                      return (
                        <div key={key} className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                          <h3 className="text-lg font-semibold text-forest-green mb-3 capitalize">
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
                                    <span className="text-gray-700">{itemText}</span>
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
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Fun Facts */}
            {tree.fun_facts && tree.fun_facts.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-forest-green mb-8 flex items-center gap-3">
                  <span className="text-3xl">✨</span>
                  Fun Facts
                  <DataSourceBadge isFallback={tree.uses.is_fallback} />
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tree.fun_facts.map((fact, index) => (
                    <div key={index} className="bg-white/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                      <p className="text-gray-700">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* Add a notice when using fallback data */}
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
  );
};

export default TreePlayground; 
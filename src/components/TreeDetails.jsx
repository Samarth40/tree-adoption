import React, { useState, useEffect } from 'react';
import TreeImage from './TreeImage';
import TreeEnrichmentService from '../services/treeEnrichmentService';

const TreeDetails = ({ tree, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedTree, setEnrichedTree] = useState(tree);
  const [activeTab, setActiveTab] = useState('overview');

  if (!tree) return null;

  // Use selected image or primary image
  const displayImage = selectedImage || tree.images.primary;

  useEffect(() => {
    const enrichTree = async () => {
      try {
        setIsEnriching(true);
        const enrichedData = await TreeEnrichmentService.enrichTreeData(tree);
        setEnrichedTree(enrichedData);
      } catch (error) {
        console.error('Error enriching tree data:', error);
      } finally {
        setIsEnriching(false);
      }
    };

    enrichTree();
  }, [tree]);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Classification */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-forest-green/5 rounded-xl p-4">
                <h3 className="text-forest-green font-semibold mb-2 text-sm">Family</h3>
                <p className="text-lg text-gray-700">{tree.family}</p>
              </div>
              <div className="bg-forest-green/5 rounded-xl p-4">
                <h3 className="text-forest-green font-semibold mb-2 text-sm">Genus</h3>
                <p className="text-lg text-gray-700">{tree.genus}</p>
              </div>
              <div className="bg-forest-green/5 rounded-xl p-4">
                <h3 className="text-forest-green font-semibold mb-2 text-sm">Height</h3>
                <p className="text-lg text-gray-700">{formatHeight(tree.characteristics.height)}</p>
              </div>
              <div className="bg-forest-green/5 rounded-xl p-4">
                <h3 className="text-forest-green font-semibold mb-2 text-sm">Growth Rate</h3>
                <p className="text-lg text-gray-700">{tree.characteristics.growth_rate || 'Unknown'}</p>
              </div>
            </div>

            {/* Description */}
            {tree.description && (
              <div className="bg-cream rounded-xl p-6">
                <h3 className="text-xl font-semibold text-forest-green mb-4">About This Tree</h3>
                <p className="text-gray-700 leading-relaxed">{tree.description}</p>
              </div>
            )}

            {/* Distribution */}
            {tree.distribution.length > 0 && (
              <div className="bg-forest-green/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-forest-green mb-4">Native Distribution</h3>
                <div className="flex flex-wrap gap-2">
                  {tree.distribution.map((region, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'characteristics':
        return (
          <div className="space-y-6">
            {/* Basic Characteristics */}
            <div className="bg-cream/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-forest-green mb-4">Physical Characteristics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tree.characteristics.height.average || tree.characteristics.height.maximum ? (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌲</span>
                    <div>
                      <p className="font-medium text-gray-700">Height</p>
                      <p className="text-gray-600">{formatHeight(tree.characteristics.height)}</p>
                    </div>
                  </div>
                ) : null}
                {(tree.characteristics.spread.average || tree.characteristics.spread.maximum) && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌿</span>
                    <div>
                      <p className="font-medium text-gray-700">Spread</p>
                      <p className="text-gray-600">{formatSpread(tree.characteristics.spread)}</p>
                    </div>
                  </div>
                )}
                {tree.characteristics.growth_rate && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📈</span>
                    <div>
                      <p className="font-medium text-gray-700">Growth Rate</p>
                      <p className="text-gray-600">{tree.characteristics.growth_rate}</p>
                    </div>
                  </div>
                )}
                {tree.characteristics.leaf_retention && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🍃</span>
                    <div>
                      <p className="font-medium text-gray-700">Leaf Retention</p>
                      <p className="text-gray-600">{tree.characteristics.leaf_retention}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Enhanced Characteristics */}
            {enrichedTree.enriched_data?.characteristics && Object.keys(enrichedTree.enriched_data.characteristics).length > 0 && (
              <div className="bg-cream/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-forest-green mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Additional Characteristics
                  <span className="text-xs bg-forest-green/10 text-forest-green px-2 py-1 rounded-full">AI Enhanced</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(enrichedTree.enriched_data.characteristics).map(([key, value]) => (
                    <div key={key} className="bg-white/50 rounded-lg p-4">
                      <p className="font-medium text-gray-700 capitalize mb-1">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-gray-600">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'uses':
        return (
          <div className="space-y-6">
            {/* Uses */}
            <div className="bg-sage-green/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-forest-green mb-4">Traditional Uses</h3>
              <div className="space-y-6">
                {tree.uses.medicinal.length > 0 && (
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🌿</span>
                      <p className="font-medium text-gray-700">Medicinal Uses</p>
                    </div>
                    <ul className="list-disc list-inside text-gray-600 ml-1 space-y-2">
                      {tree.uses.medicinal.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {tree.uses.commercial.length > 0 && (
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💼</span>
                      <p className="font-medium text-gray-700">Commercial Uses</p>
                    </div>
                    <ul className="list-disc list-inside text-gray-600 ml-1 space-y-2">
                      {tree.uses.commercial.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {tree.uses.cultural.length > 0 && (
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">✨</span>
                      <p className="font-medium text-gray-700">Cultural Significance</p>
                    </div>
                    <ul className="list-disc list-inside text-gray-600 ml-1 space-y-2">
                      {tree.uses.cultural.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {tree.uses.edible && (
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🍽️</span>
                      <p className="font-medium text-gray-700">Edible Parts</p>
                    </div>
                    <ul className="list-disc list-inside text-gray-600 ml-1 space-y-2">
                      {tree.uses.edible_parts.map((part, index) => (
                        <li key={index}>{part}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'ai-insights':
    return (
          <div className="space-y-6">
            {/* Environmental Benefits */}
            {enrichedTree.environmental_benefits?.length > 0 && (
              <div className="bg-forest-green/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-forest-green mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌍</span>
                  Environmental Benefits
                  <span className="text-xs bg-forest-green/10 text-forest-green px-2 py-1 rounded-full">AI Enhanced</span>
                </h3>
                <ul className="space-y-2">
                  {enrichedTree.environmental_benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 bg-white/50 rounded-lg p-3">
                      <span className="text-forest-green">•</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cultivation Guide */}
            {enrichedTree.cultivation?.length > 0 && (
              <div className="bg-sage-green/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-forest-green mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  Growing Guide
                  <span className="text-xs bg-forest-green/10 text-forest-green px-2 py-1 rounded-full">AI Enhanced</span>
                </h3>
                <ul className="space-y-2">
                  {enrichedTree.cultivation.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 bg-white/50 rounded-lg p-3">
                      <span className="text-forest-green">•</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Historical Significance */}
            {enrichedTree.historical_significance && (
              <div className="bg-cream/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-forest-green mb-4 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  Historical Significance
                  <span className="text-xs bg-forest-green/10 text-forest-green px-2 py-1 rounded-full">AI Enhanced</span>
                </h3>
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {enrichedTree.historical_significance}
                  </p>
                </div>
              </div>
            )}

            {/* Conservation Status */}
            {enrichedTree.conservation_status && (
              <div className="bg-forest-green/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-forest-green mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌿</span>
                  Conservation Status
                  <span className="text-xs bg-forest-green/10 text-forest-green px-2 py-1 rounded-full">AI Enhanced</span>
        </h3>
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {enrichedTree.conservation_status}
                  </p>
                </div>
              </div>
            )}
      </div>
    );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative animate-modal">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2.5 rounded-full hover:bg-forest-green hover:text-white transition-all duration-200 shadow-lg group"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* AI Enrichment Loading Indicator */}
        {isEnriching && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-forest-green text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Enriching tree information...</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Panel - Image Gallery */}
          <div className="lg:w-1/2 bg-forest-green/5">
            <div className="relative h-72 lg:h-full">
              <div className="absolute inset-0">
                <img
                  src={displayImage}
                  alt={tree.common_names.english || tree.scientific_name}
                  className="w-full h-full object-contain bg-black/20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Title Overlay */}
              <div className="absolute top-6 left-6 right-6 z-10">
                <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl max-w-lg">
                  <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {tree.common_names.english || tree.scientific_name.split(' ')[0]}
                </h2>
                  <p className="text-xl text-cream/90 italic mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  {tree.scientific_name}
                </p>
                  {tree.common_names.local && (
                    <div className="inline-block px-4 py-2 bg-white/10 rounded-lg">
                      <span className="text-cream font-medium">Local Name: </span>
                      <span className="text-white font-semibold">{tree.common_names.local}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Image Gallery Thumbnails */}
              {tree.images.all && tree.images.all.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 snap-x">
                  {tree.images.all.map((image, index) => (
                    <div
                      key={image.url}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer snap-start
                        ${image.url === displayImage ? 'border-forest-green shadow-lg scale-105' : 'border-white/50 hover:border-white'}`}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <img 
                        src={image.url} 
                        alt={`View ${index + 1}`} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 px-6 pt-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'text-forest-green border-b-2 border-forest-green'
                    : 'text-gray-500 hover:text-forest-green'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('characteristics')}
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                  activeTab === 'characteristics'
                    ? 'text-forest-green border-b-2 border-forest-green'
                    : 'text-gray-500 hover:text-forest-green'
                }`}
              >
                Characteristics
              </button>
              <button
                onClick={() => setActiveTab('uses')}
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                  activeTab === 'uses'
                    ? 'text-forest-green border-b-2 border-forest-green'
                    : 'text-gray-500 hover:text-forest-green'
                }`}
              >
                Uses
              </button>
              <button
                onClick={() => setActiveTab('ai-insights')}
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors flex items-center gap-1 ${
                  activeTab === 'ai-insights'
                    ? 'text-forest-green border-b-2 border-forest-green'
                    : 'text-gray-500 hover:text-forest-green'
                }`}
              >
                AI Insights
                <span className="px-1.5 py-0.5 text-xs bg-forest-green/10 text-forest-green rounded-full">AI</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderTabContent()}
              
              {/* Metadata - Always visible */}
              <div className="text-sm text-gray-500 pt-4 mt-4 border-t border-gray-100">
                <p>Last updated: {new Date(tree.metadata.last_updated).toLocaleDateString()}</p>
                <p>Source: <a href={tree.metadata.sources.gbif} target="_blank" rel="noopener noreferrer" className="text-forest-green hover:underline">GBIF Database</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatHeight = (height) => {
  if (!height.average && !height.maximum) return 'Unknown';
  if (height.average && height.maximum) {
    return `${height.average}-${height.maximum}m`;
  }
  return `Up to ${height.maximum || height.average}m`;
};

const formatSpread = (spread) => {
  if (!spread.average && !spread.maximum) return 'Unknown';
  if (spread.average && spread.maximum) {
    return `${spread.average}-${spread.maximum}m`;
  }
  return `Up to ${spread.maximum || spread.average}m`;
};

export default TreeDetails; 
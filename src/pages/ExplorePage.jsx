import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TreeImage from '../components/TreeImage';
import treeData from '../data/treeData.json';
import TreeDetails from '../components/TreeDetails';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    searchTerm: '',
    activeSearchTerm: '',
    sortBy: 'random'
  });
  const [selectedTree, setSelectedTree] = useState(null);
  const [randomSeed, setRandomSeed] = useState(Math.random());

  const TREES_PER_PAGE = 12;

  const getSortedTrees = (trees) => {
    if (filters.sortBy === 'random') {
      return [...trees].sort(() => 0.5 - Math.random());
    }
    return trees;
  };

  const getFilteredTrees = () => {
    let filteredTrees = [...treeData];
    
    if (filters.activeSearchTerm) {
      const searchTerm = filters.activeSearchTerm.toLowerCase().trim();
      
      filteredTrees = filteredTrees.filter(tree => {
        // Get the display name that's shown on the card
        const displayName = tree.common_names.english || tree.scientific_name.split(' ')[0];
        
        const searchableFields = [
          displayName,
          tree.scientific_name,
          tree.common_names.english,
          tree.common_names.local,
          tree.family,
          tree.genus
        ].filter(Boolean).map(field => field.toLowerCase());

        // Check if any searchable field includes the search term
        return searchableFields.some(field => field.includes(searchTerm));
      });
    }

    return getSortedTrees(filteredTrees);
  };

  useEffect(() => {
    setRandomSeed(Math.random());
  }, []);

  const filteredTrees = getFilteredTrees();
  const totalPages = Math.ceil(filteredTrees.length / TREES_PER_PAGE);
  const currentTrees = filteredTrees.slice(
    (currentPage - 1) * TREES_PER_PAGE,
    currentPage * TREES_PER_PAGE
  );

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleFilterChange('activeSearchTerm', filters.searchTerm);
    }
  };

  const clearSearch = () => {
    setFilters(prev => ({
      ...prev,
      searchTerm: '',
      activeSearchTerm: ''
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTreeSelect = (tree) => {
    localStorage.setItem('selectedTree', JSON.stringify(tree));
    navigate(`/playground/${encodeURIComponent(tree.scientific_name)}`);
  };

  const getTreeType = (tree) => {
    if (tree.uses.medicinal.length > 0) return 'medicinal';
    if (tree.uses.cultural.some(use => use.toLowerCase().includes('sacred'))) return 'sacred';
    if (tree.uses.commercial.length > 0) return 'commercial';
    return 'default';
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

  if (filteredTrees.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl text-forest-green mb-4">No trees found</h2>
          <p className="text-sage-green">
            Try adjusting your search or filter options.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10">
      <div className="relative bg-gradient-to-b from-forest-green/10 to-transparent pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-forest-green/5 rounded-full blur-[100px] -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage-green/5 rounded-full blur-[100px] translate-y-1/2"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="inline-block mb-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-forest-green/10 text-forest-green">
              <span className="mr-2">🌿</span>
              Explore Our Collection
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-forest-green mb-6 leading-tight">
            Sacred Tree Collection
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover the rich heritage of Indian trees, their medicinal properties, and cultural significance
          </p>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-forest-green mb-2">{treeData.length}+</div>
              <div className="text-sm text-gray-600 font-medium">Sacred Trees</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-forest-green mb-2">100+</div>
              <div className="text-sm text-gray-600 font-medium">Medicinal Uses</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-forest-green mb-2">50+</div>
              <div className="text-sm text-gray-600 font-medium">Regions</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-forest-green/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-sage-green/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-forest-green/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by tree name, family, or genus (press Enter to search)..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-forest-green/10 focus:border-forest-green/30 focus:outline-none bg-white/50 backdrop-blur-sm text-lg transition-all duration-300"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                onKeyDown={handleSearch}
              />
              {filters.searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-4 flex items-center text-forest-green/40 hover:text-forest-green transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center justify-between">
                <span>
                  Showing {currentTrees.length} of {filteredTrees.length} trees
                </span>
                {filters.activeSearchTerm && (
                  <span className="text-forest-green">
                    Search results for "{filters.activeSearchTerm}"
                  </span>
                )}
              </div>
              {!filters.activeSearchTerm && (
                <div className="text-gray-400 flex flex-wrap gap-2">
                  <span>Try searching for:</span>
                  <button 
                    onClick={() => {
                      handleFilterChange('searchTerm', 'medicinal');
                      handleFilterChange('activeSearchTerm', 'medicinal');
                    }}
                    className="text-forest-green hover:underline"
                  >
                    medicinal
                  </button>
                  <span>•</span>
                  <button 
                    onClick={() => {
                      handleFilterChange('searchTerm', 'sacred');
                      handleFilterChange('activeSearchTerm', 'sacred');
                    }}
                    className="text-forest-green hover:underline"
                  >
                    sacred
                  </button>
                  <span>•</span>
                  <button 
                    onClick={() => {
                      handleFilterChange('searchTerm', 'fast growing');
                      handleFilterChange('activeSearchTerm', 'fast growing');
                    }}
                    className="text-forest-green hover:underline"
                  >
                    fast growing
                  </button>
                </div>
              )}
            </div>

            {filters.activeSearchTerm && filteredTrees.length === 0 && (
              <div className="bg-cream/50 rounded-xl p-4 text-center">
                <p className="text-gray-600 mb-2">No trees found matching "{filters.activeSearchTerm}"</p>
                <p className="text-sm text-gray-500">
                  Try searching for tree names, families, or genus
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <div key={randomSeed} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentTrees.map((tree) => (
            <motion.div
              key={tree.scientific_name}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tree.common_names.english || tree.scientific_name.split(' ')[0]}
                  </h3>
                  <p className="text-cream/90 text-sm italic mb-4">
                    {tree.scientific_name}
                  </p>
                  <button
                    onClick={() => handleTreeSelect(tree)}
                    className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-lg hover:bg-white/30 transition-colors duration-300 font-medium flex items-center justify-center gap-2 group/btn"
                  >
                    <span>View Details</span>
                    <svg 
                      className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden">
                <TreeImage
                  src={tree.images.primary}
                  alt={tree.common_names.english || tree.scientific_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  treeType={getTreeType(tree)}
                />

                <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-[5]">
                  {tree.uses.medicinal.length > 0 && (
                    <span className="px-3 py-1 bg-leaf-green/20 text-white text-xs rounded-full font-medium backdrop-blur-sm border border-white/10">
                      🌿 Medicinal
                    </span>
                  )}
                  {tree.uses.cultural.some(use => use.toLowerCase().includes('sacred')) && (
                    <span className="px-3 py-1 bg-sage-green/20 text-white text-xs rounded-full font-medium backdrop-blur-sm border border-white/10">
                      ✨ Sacred
                    </span>
                  )}
                  {tree.uses.commercial.length > 0 && (
                    <span className="px-3 py-1 bg-blue-400/20 text-white text-xs rounded-full font-medium backdrop-blur-sm border border-white/10">
                      💼 Commercial
                    </span>
                  )}
                  {tree.uses.edible && (
                    <span className="px-3 py-1 bg-amber-400/20 text-white text-xs rounded-full font-medium backdrop-blur-sm border border-white/10">
                      🍽️ Edible
                    </span>
                  )}
                </div>

                {tree.images.all?.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/40 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-white/10 z-[5]">
                    +{tree.images.all.length - 1} photos
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                      {tree.common_names.english || tree.scientific_name.split(' ')[0]}
                    </h3>
                    <p className="text-cream/80 text-sm italic line-clamp-1">
                      {tree.scientific_name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {tree.family && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/5">
                        <p className="text-xs text-cream/60 mb-0.5">Family</p>
                        <p className="text-sm text-white font-medium line-clamp-1">{tree.family}</p>
                      </div>
                    )}
                    {(tree.characteristics.height.average || tree.characteristics.height.maximum) && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/5">
                        <p className="text-xs text-cream/60 mb-0.5">Height</p>
                        <p className="text-sm text-white font-medium line-clamp-1">
                          {formatHeight(tree.characteristics.height)}
                        </p>
                      </div>
                    )}
                  </div>

                  {tree.common_names.local && (
                    <div className="mt-2 inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/5">
                      <span className="text-cream/80 text-sm">{tree.common_names.local}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="my-12 pb-16 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-3 rounded-xl bg-forest-green text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-forest-green/90 transition-colors"
            >
              Previous
            </button>
            <span className="px-6 py-3 text-forest-green bg-white/50 backdrop-blur-sm rounded-xl font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-3 rounded-xl bg-forest-green text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-forest-green/90 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {selectedTree && (
          <TreeDetails
            tree={selectedTree}
            onClose={() => setSelectedTree(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ExplorePage; 
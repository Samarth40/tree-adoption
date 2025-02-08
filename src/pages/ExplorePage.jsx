import React, { useState } from 'react';
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
    growthRate: '',
    region: '',
    useType: ''
  });
  const [selectedTree, setSelectedTree] = useState(null);

  const TREES_PER_PAGE = 12;

  // Filter and paginate trees
  const getFilteredTrees = () => {
    let filteredTrees = [...treeData];
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredTrees = filteredTrees.filter(tree => 
        tree.scientific_name.toLowerCase().includes(searchTerm) ||
        tree.common_names.english?.toLowerCase().includes(searchTerm) ||
        tree.family?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.growthRate) {
      filteredTrees = filteredTrees.filter(tree => 
        tree.characteristics.growth_rate?.toLowerCase() === filters.growthRate.toLowerCase()
      );
    }

    if (filters.region) {
      filteredTrees = filteredTrees.filter(tree =>
        tree.distribution.some(region =>
          region.toLowerCase().includes(filters.region.toLowerCase())
        )
      );
    }

    if (filters.useType) {
      filteredTrees = filteredTrees.filter(tree => {
        const useType = filters.useType.toLowerCase();
        return (
          tree.uses.commercial.some(use => use.toLowerCase().includes(useType)) ||
          tree.uses.medicinal.some(use => use.toLowerCase().includes(useType)) ||
          tree.uses.cultural.some(use => use.toLowerCase().includes(useType))
        );
      });
    }

    return filteredTrees;
  };

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
    <div className="min-h-screen bg-cream py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-forest-green mb-4">
            Explore Indian Trees
          </h1>
          <p className="text-xl text-sage-green">
            Discover the rich diversity of Indian trees and their cultural significance
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search trees..."
              className="w-full px-4 py-2 rounded-lg border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-forest-green"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
            <select
              className="w-full px-4 py-2 rounded-lg border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-forest-green"
              value={filters.growthRate}
              onChange={(e) => handleFilterChange('growthRate', e.target.value)}
            >
              <option value="">All Growth Rates</option>
              <option value="Slow">Slow</option>
              <option value="Moderate">Moderate</option>
              <option value="Fast">Fast</option>
            </select>
            <select
              className="w-full px-4 py-2 rounded-lg border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-forest-green"
              value={filters.useType}
              onChange={(e) => handleFilterChange('useType', e.target.value)}
            >
              <option value="">All Uses</option>
              <option value="Medicinal">Medicinal</option>
              <option value="Commercial">Commercial</option>
              <option value="Sacred">Sacred</option>
            </select>
            <select
              className="w-full px-4 py-2 rounded-lg border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-forest-green"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="">All Regions</option>
              <option value="North">North India</option>
              <option value="South">South India</option>
              <option value="Central">Central India</option>
              <option value="Western">Western India</option>
              <option value="Eastern">Eastern India</option>
            </select>
          </div>
        </div>

        {/* Tree Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentTrees.map((tree) => (
            <motion.div
              key={tree.scientific_name}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hover Overlay with Quick Actions */}
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

              {/* Main Card Content */}
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* Image */}
                <TreeImage
                  src={tree.images.primary}
                  alt={tree.common_names.english || tree.scientific_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  treeType={getTreeType(tree)}
                />

                {/* Top Tags */}
                <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-[5]">
                  {/* Tree Type Tags - Only show if they exist */}
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

                {/* Image Count Badge */}
                {tree.images.all?.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/40 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-white/10 z-[5]">
                    +{tree.images.all.length - 1} photos
                  </div>
                )}

                {/* Bottom Info Panel */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                  {/* Names */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                      {tree.common_names.english || tree.scientific_name.split(' ')[0]}
                    </h3>
                    <p className="text-cream/80 text-sm italic line-clamp-1">
                      {tree.scientific_name}
                    </p>
                  </div>

                  {/* Quick Info Grid - Only show if data exists */}
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

                  {/* Local Name - Only show if exists */}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-forest-green text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-forest-green">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-forest-green text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Tree Details Modal */}
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
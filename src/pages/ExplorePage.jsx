import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TreeDetails from '../components/TreeDetails';
import TreeService from '../services/treeService';

// Sample tree data for development (remove in production)
const sampleTrees = [
  {
    id: 1,
    common_name: 'Red Maple',
    scientific_name: 'Acer rubrum',
    family: 'Sapindaceae',
    maximum_height: 30,
    native_status: 'Native to North America',
    image: 'https://images.unsplash.com/photo-1477511801984-4ad318ed9846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Known for its stunning fall colors and adaptability to various environments.',
    growth_rate: 'Fast',
    water_needs: 'Moderate',
    sunlight: 'Full Sun to Partial Shade',
    maintenance: 'Low',
    benefits: ['Air Purification', 'Shade', 'Wildlife Habitat'],
    adoption_impact: '120kg CO₂ absorbed per year'
  },
  {
    id: 2,
    common_name: 'White Oak',
    scientific_name: 'Quercus alba',
    family: 'Fagaceae',
    maximum_height: 35,
    native_status: 'Native to Eastern USA',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A majestic tree known for its strong wood and important wildlife value.',
    growth_rate: 'Slow',
    water_needs: 'Moderate',
    sunlight: 'Full Sun',
    maintenance: 'Low',
    benefits: ['Long-lived', 'Wildlife Support', 'Strong Wood'],
    adoption_impact: '180kg CO₂ absorbed per year'
  },
  {
    id: 3,
    common_name: 'Eastern White Pine',
    scientific_name: 'Pinus strobus',
    family: 'Pinaceae',
    maximum_height: 40,
    native_status: 'Native to Eastern North America',
    image: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'An evergreen conifer with soft, bluish-green needles.',
    growth_rate: 'Moderate',
    water_needs: 'Low',
    sunlight: 'Full Sun',
    maintenance: 'Low',
    benefits: ['Year-round Green', 'Wind Break', 'Privacy Screen'],
    adoption_impact: '150kg CO₂ absorbed per year'
  },
  {
    id: 4,
    common_name: 'Sugar Maple',
    scientific_name: 'Acer saccharum',
    family: 'Sapindaceae',
    maximum_height: 25,
    native_status: 'Native to Eastern North America',
    image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Famous for maple syrup production and brilliant fall colors.',
    growth_rate: 'Moderate',
    water_needs: 'Moderate',
    sunlight: 'Full Sun to Partial Shade',
    maintenance: 'Moderate',
    benefits: ['Maple Syrup', 'Fall Colors', 'Shade'],
    adoption_impact: '110kg CO₂ absorbed per year'
  },
  {
    id: 5,
    common_name: 'Weeping Willow',
    scientific_name: 'Salix babylonica',
    family: 'Salicaceae',
    maximum_height: 20,
    native_status: 'Introduced',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Known for its distinctive drooping branches and waterside habitat.',
    growth_rate: 'Fast',
    water_needs: 'High',
    sunlight: 'Full Sun',
    maintenance: 'Moderate',
    benefits: ['Erosion Control', 'Shade', 'Aesthetic Value'],
    adoption_impact: '90kg CO₂ absorbed per year'
  },
  {
    id: 6,
    common_name: 'River Birch',
    scientific_name: 'Betula nigra',
    family: 'Betulaceae',
    maximum_height: 28,
    native_status: 'Native to Eastern USA',
    image: 'https://images.unsplash.com/photo-1502394202744-021cfbb17454?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Features distinctive peeling bark and excellent flood tolerance.',
    growth_rate: 'Fast',
    water_needs: 'High',
    sunlight: 'Full Sun to Partial Shade',
    maintenance: 'Low',
    benefits: ['Flood Tolerance', 'Attractive Bark', 'Bird Habitat'],
    adoption_impact: '100kg CO₂ absorbed per year'
  }
];

const ExplorePage = () => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    height: 'all',
    growth: 'all'
  });
  const [selectedTree, setSelectedTree] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTrees(1, true);
  }, [selectedFilters]);

  const fetchTrees = async (page, isNewSearch = false) => {
    try {
      setLoading(true);
      // For development, use sample data instead of API call
      const treesPerPage = 6;
      const start = (page - 1) * treesPerPage;
      const end = start + treesPerPage;
      const paginatedTrees = sampleTrees.slice(start, end);
      
      if (isNewSearch) {
        setTrees(paginatedTrees);
      } else {
        setTrees(prevTrees => [...prevTrees, ...paginatedTrees]);
      }
      setHasMore(end < sampleTrees.length);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching trees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const filteredTrees = trees.filter(tree => {
    const matchesSearch = tree.common_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tree.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Header Section - Equal padding top and bottom */}
      <div className="pt-36 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-forest-green via-leaf-green to-forest-green bg-clip-text text-transparent pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Discover Your Perfect Tree
              </motion.h1>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-forest-green via-leaf-green to-forest-green rounded-full opacity-60" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search trees by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-sage-green/20 focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 transition-all duration-200 bg-white/50"
                />
                <motion.svg 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-green"
                  whileHover={{ scale: 1.1 }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </motion.svg>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div>
              <select
                value={selectedFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-sage-green/20 focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 transition-all duration-200 bg-white/50"
              >
                <option value="all">All Types</option>
                <option value="deciduous">Deciduous</option>
                <option value="evergreen">Evergreen</option>
                <option value="fruit">Fruit Trees</option>
              </select>
            </div>

            <div>
              <select
                value={selectedFilters.height}
                onChange={(e) => handleFilterChange('height', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-sage-green/20 focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 transition-all duration-200 bg-white/50"
              >
                <option value="all">All Heights</option>
                <option value="small">Small (0-20ft)</option>
                <option value="medium">Medium (20-40ft)</option>
                <option value="large">Large (40ft+)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Trees Grid */}
        <div className="mt-12 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredTrees.map((tree, index) => (
                <motion.div
                  key={tree.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Tree Image with Impact Badge */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={tree.image}
                      alt={tree.common_name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 bg-forest-green/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {tree.adoption_impact}
                    </div>
                  </div>

                  {/* Tree Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-forest-green group-hover:text-leaf-green transition-colors duration-300">
                          {tree.common_name}
                        </h3>
                        <p className="text-sm italic text-sage-green">
                          {tree.scientific_name}
                        </p>
                      </div>
                      <span className="bg-cream/50 text-forest-green px-2 py-1 rounded-lg text-sm">
                        {tree.growth_rate} Growth
                      </span>
                    </div>

                    {/* Tree Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <span className="w-5 h-5 mr-2 text-leaf-green">🌿</span>
                        <span className="text-sm">{tree.family}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="w-5 h-5 mr-2 text-leaf-green">🌍</span>
                        <span className="text-sm">{tree.native_status}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="w-5 h-5 mr-2 text-leaf-green">💧</span>
                        <span className="text-sm">{tree.water_needs} Water Needs</span>
                      </div>
                    </div>

                    {/* Benefits Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tree.benefits.map((benefit, i) => (
                        <span 
                          key={i}
                          className="bg-sage-green/10 text-forest-green px-2 py-1 rounded-full text-xs"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTree(tree)}
                      className="mt-6 w-full bg-cream hover:bg-forest-green text-forest-green hover:text-white py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2"
                    >
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-forest-green border-t-transparent rounded-full mx-auto"
              />
              <p className="mt-4 text-forest-green text-lg">Loading trees...</p>
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <button
                onClick={() => fetchTrees(currentPage + 1)}
                className="px-8 py-3 bg-forest-green text-white rounded-xl hover:bg-leaf-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Load More Trees
              </button>
            </motion.div>
          )}

          {/* No Results Message */}
          {!loading && filteredTrees.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-cream/50 rounded-2xl shadow-lg"
            >
              <p className="text-forest-green text-lg">
                No trees found matching your search criteria.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Tree Details Modal */}
      <AnimatePresence>
        {selectedTree && (
          <TreeDetails
            tree={selectedTree}
            onClose={() => setSelectedTree(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExplorePage; 
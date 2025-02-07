import React, { useState, useEffect } from 'react';
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
    image: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?ixlib=rb-4.0.3',
  },
  {
    id: 2,
    common_name: 'White Oak',
    scientific_name: 'Quercus alba',
    family: 'Fagaceae',
    maximum_height: 35,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3',
  },
  {
    id: 3,
    common_name: 'Eastern White Pine',
    scientific_name: 'Pinus strobus',
    family: 'Pinaceae',
    maximum_height: 40,
    image: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?ixlib=rb-4.0.3',
  },
  {
    id: 4,
    common_name: 'American Beech',
    scientific_name: 'Fagus grandifolia',
    family: 'Fagaceae',
    maximum_height: 25,
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3',
  },
  {
    id: 5,
    common_name: 'Weeping Willow',
    scientific_name: 'Salix babylonica',
    family: 'Salicaceae',
    maximum_height: 20,
    image: 'https://images.unsplash.com/photo-1636403803695-761f8336cd41?ixlib=rb-4.0.3',
  },
  {
    id: 6,
    common_name: 'River Birch',
    scientific_name: 'Betula nigra',
    family: 'Betulaceae',
    maximum_height: 28,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3',
  },
];

const ExplorePage = () => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    searchTerm: '',
    order: 'asc'
  });
  const [selectedTree, setSelectedTree] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter options based on USDA data
  const filterOptions = {
    order: [
      { value: 'asc', label: 'A to Z', icon: '🔤' },
      { value: 'desc', label: 'Z to A', icon: '🔤' }
    ]
  };

  useEffect(() => {
    fetchTrees(1, true);
  }, [filters]); // Refetch when filters change

  const fetchTrees = async (page, isNewSearch = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to fetch trees...');

      const response = await TreeService.fetchTrees(page, filters);
      console.log('Fetched trees:', response);

      const newTrees = response.trees;
      setHasMore(page < response.last_page);
      
      if (isNewSearch) {
        setTrees(newTrees);
      } else {
        setTrees(prevTrees => [...prevTrees, ...newTrees]);
      }
      setCurrentPage(page);
    } catch (error) {
      console.error('Error in fetchTrees:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchTrees(currentPage + 1);
    }
  };

  const handleTreeSelect = async (tree) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching details for tree:', tree.id);

      const detailedTree = await TreeService.fetchTreeDetails(tree.id);
      console.log('Fetched tree details:', detailedTree);
      setSelectedTree(detailedTree);
    } catch (error) {
      console.error('Error in handleTreeSelect:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter trees based on search term
  const filteredTrees = trees.filter((tree) => {
    const matchesSearch = 
      tree.common_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const renderFilterOption = (option) => (
    <div className="flex items-center">
      <span className="mr-2">{option.icon}</span>
      {option.label}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with parallax effect */}
        <div className="text-center mb-16 relative overflow-hidden rounded-3xl bg-forest-green p-8 shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09')] bg-cover bg-center"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Explore Our Trees
            </h1>
            <p className="text-xl text-cream max-w-2xl mx-auto">
              Discover native trees and find your perfect match for adoption
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search trees by name..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-sage-green focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort Order */}
            <div className="flex justify-end">
              <select
                className="px-4 py-2 rounded-lg border-2 border-sage-green focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 transition-all duration-200"
                value={filters.order}
                onChange={(e) => handleFilterChange('order', e.target.value)}
              >
                {filterOptions.order.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center py-6 mb-8 bg-red-50 rounded-xl shadow-lg">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={() => fetchTrees(1, true)}
              className="mt-2 px-6 py-2 bg-leaf-green text-white rounded-lg hover:bg-sage-green transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tree Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrees.map((tree) => (
            <div
              key={tree.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden">
                {tree.image ? (
                  <img
                    src={tree.image}
                    alt={tree.common_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-sage-green/10 flex items-center justify-center">
                    <span className="text-4xl">🌳</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-forest-green group-hover:text-leaf-green transition-colors duration-200">
                  {tree.common_name}
                </h3>
                {tree.scientific_name && (
                  <p className="mt-2 text-sm text-sage-green italic">
                    {tree.scientific_name}
                  </p>
                )}
                <div className="mt-4 space-y-2">
                  {tree.family && (
                    <p className="text-gray-600 flex items-center">
                      <span className="w-4 h-4 mr-2">🌿</span>
                      <span className="font-semibold">Family:</span> {tree.family}
                    </p>
                  )}
                  {tree.growth_habit && (
                    <p className="text-gray-600 flex items-center">
                      <span className="w-4 h-4 mr-2">🌳</span>
                      <span className="font-semibold">Growth:</span> {tree.growth_habit}
                    </p>
                  )}
                  {tree.native_status && (
                    <p className="text-gray-600 flex items-center">
                      <span className="w-4 h-4 mr-2">🌎</span>
                      <span className="font-semibold">Native Status:</span> {tree.native_status}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tree.edible && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-sage-green/10 text-forest-green">
                      <span className="mr-1">🍽️</span> Edible
                    </span>
                  )}
                  {tree.drought_tolerance && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-sage-green/10 text-forest-green">
                      <span className="mr-1">🌵</span> {tree.drought_tolerance} Drought Tolerance
                    </span>
                  )}
                  {tree.toxicity && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                      <span className="mr-1">⚠️</span> {tree.toxicity}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleTreeSelect(tree)}
                  className="mt-6 w-full bg-cream text-forest-green py-3 px-6 rounded-lg hover:bg-leaf-green hover:text-white transition-all duration-200 shadow-md hover:shadow-xl font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-forest-green border-t-transparent"></div>
            <p className="mt-4 text-forest-green text-lg">Loading trees...</p>
          </div>
        )}

        {/* Load More Button */}
        {!loading && hasMore && filteredTrees.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Showing {filteredTrees.length} of {trees.length} trees
            </p>
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-forest-green text-white rounded-xl hover:bg-leaf-green transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center mx-auto"
            >
              <span>Load More Trees</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredTrees.length === 0 && (
          <div className="text-center py-12 bg-cream rounded-xl shadow-lg">
            <p className="text-forest-green text-lg">
              No trees found matching your search criteria.
            </p>
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
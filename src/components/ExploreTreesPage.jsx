import React, { useState, useEffect } from 'react';
import TreeDetails from './TreeDetails';

const ExploreTreesPage = () => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTree, setSelectedTree] = useState(null);

  // Note: You'll need to get an API key from Trefle.io and store it securely
  const TREFLE_API_KEY = 'YOUR_API_KEY';
  const UNSPLASH_API_KEY = 'YOUR_UNSPLASH_API_KEY';

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      setLoading(true);
      // Using a CORS proxy to avoid CORS issues
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://trefle.io/api/v1/plants?token=${TREFLE_API_KEY}&filter[ligneous_type]=tree`
      );
      const data = await response.json();
      
      // Enhance tree data with Unsplash images
      const treesWithImages = await Promise.all(
        data.data.map(async (tree) => {
          const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${tree.common_name}+tree&client_id=${UNSPLASH_API_KEY}&per_page=1`
          );
          const imageData = await imageResponse.json();
          return {
            ...tree,
            image: imageData.results[0]?.urls.regular || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
          };
        })
      );

      setTrees(treesWithImages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trees:', error);
      setLoading(false);
    }
  };

  const filteredTrees = trees.filter((tree) => {
    const matchesSearch = tree.common_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tree.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && tree.ligneous_type === filter;
  });

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-forest-green mb-4">
            Explore Our Trees
          </h1>
          <p className="text-xl text-sage-green">
            Discover and learn about various tree species available for adoption
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search trees by name..."
                className="w-full px-4 py-2 rounded-md border border-sage-green focus:outline-none focus:ring-2 focus:ring-forest-green"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-auto px-4 py-2 rounded-md border border-sage-green focus:outline-none focus:ring-2 focus:ring-forest-green"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Trees</option>
                <option value="deciduous">Deciduous</option>
                <option value="evergreen">Evergreen</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green mx-auto"></div>
            <p className="mt-4 text-forest-green">Loading trees...</p>
          </div>
        ) : (
          /* Tree Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrees.map((tree) => (
              <div key={tree.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={tree.image}
                    alt={tree.common_name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-forest-green">
                    {tree.common_name || 'Unknown'}
                  </h3>
                  <p className="mt-2 text-sm text-sage-green italic">
                    {tree.scientific_name}
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Family:</span> {tree.family}
                    </p>
                    {tree.maximum_height && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Max Height:</span> {tree.maximum_height}m
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedTree(tree)}
                    className="mt-6 w-full bg-leaf-green text-white py-2 px-4 rounded-md hover:bg-sage-green transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredTrees.length === 0 && (
          <div className="text-center py-12">
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

export default ExploreTreesPage; 
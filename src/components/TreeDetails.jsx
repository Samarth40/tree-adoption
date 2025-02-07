import React from 'react';

const TreeDetails = ({ tree, onClose }) => {
  if (!tree) return null;

  const renderSection = (title, content) => {
    if (!content) return null;
    return (
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-forest-green mb-4 flex items-center">
          {title}
        </h3>
        {content}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-cream to-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-forest-green hover:text-white transition-all duration-200 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Section */}
          <div className="lg:w-1/2 relative">
            <div className="h-64 lg:h-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <img
                src={tree.image}
                alt={tree.common_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
                  {tree.common_name}
                </h2>
                <p className="text-xl italic text-cream">
                  {tree.scientific_name}
                </p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-6 overflow-y-auto max-h-[90vh] lg:max-h-[800px] space-y-6 bg-cream/20">
            {renderSection("Tree Details",
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span className="w-6 h-6 mr-3">🌳</span>
                  <span className="font-medium">Family:</span>
                  <span className="ml-2">{tree.family}</span>
                </li>
                {tree.maximum_height && (
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 mr-3">📏</span>
                    <span className="font-medium">Maximum Height:</span>
                    <span className="ml-2">{tree.maximum_height}m</span>
                  </li>
                )}
                {tree.cycle && (
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 mr-3">🔄</span>
                    <span className="font-medium">Life Cycle:</span>
                    <span className="ml-2">{tree.cycle}</span>
                  </li>
                )}
                {tree.growth_rate && (
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 mr-3">⚡</span>
                    <span className="font-medium">Growth Rate:</span>
                    <span className="ml-2">{tree.growth_rate}</span>
                  </li>
                )}
              </ul>
            )}

            {renderSection("Care Requirements",
              <ul className="space-y-3">
                {tree.watering && (
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 mr-3">💧</span>
                    <span className="font-medium">Watering:</span>
                    <span className="ml-2">{tree.watering}</span>
                  </li>
                )}
                {tree.sunlight && (
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 mr-3">☀️</span>
                    <span className="font-medium">Sunlight:</span>
                    <span className="ml-2">{Array.isArray(tree.sunlight) ? tree.sunlight.join(', ') : tree.sunlight}</span>
                  </li>
                )}
                {tree.maintenance && (
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 mr-3">🔧</span>
                    <span className="font-medium">Maintenance:</span>
                    <span className="ml-2">{tree.maintenance}</span>
                  </li>
                )}
              </ul>
            )}

            {tree.description && renderSection("About This Tree",
              <p className="text-gray-700 leading-relaxed">
                {tree.description}
              </p>
            )}

            {/* Adoption Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-forest-green mb-4">Ready to Adopt?</h3>
              <p className="text-gray-700 mb-6">
                By adopting this {tree.common_name.toLowerCase()}, you'll be contributing to:
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center">
                    <span className="text-leaf-green mr-2">✓</span>
                    Local biodiversity conservation
                  </li>
                  <li className="flex items-center">
                    <span className="text-leaf-green mr-2">✓</span>
                    Carbon footprint reduction
                  </li>
                  <li className="flex items-center">
                    <span className="text-leaf-green mr-2">✓</span>
                    Urban greenery enhancement
                  </li>
                </ul>
              </p>
              <button className="w-full bg-forest-green text-white py-4 px-6 rounded-lg hover:bg-leaf-green transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium text-lg">
                Adopt This Tree
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeDetails; 
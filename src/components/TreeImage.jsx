import React, { useState } from 'react';
import { DEFAULT_IMAGES, TREE_TYPE_IMAGES } from '../constants/imageConstants';

const TreeImage = ({ 
  src, 
  alt, 
  className, 
  treeType = 'default',
  googleSearchUrl,
  onClick,
  ...props 
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get fallback image based on tree type
  const getFallbackImage = () => {
    return TREE_TYPE_IMAGES[treeType] || DEFAULT_IMAGES.TREE_PLACEHOLDER;
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleImageClick = (e) => {
    if (error && googleSearchUrl) {
      e.preventDefault();
      window.open(googleSearchUrl, '_blank');
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={error ? getFallbackImage() : src}
        alt={alt}
        className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} ${error && googleSearchUrl ? 'cursor-pointer' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        onClick={handleImageClick}
        {...props}
      />
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-50 text-red-600 text-xs p-1 text-center">
          {googleSearchUrl ? (
            <span>Click to search for tree images on Google</span>
          ) : (
            <span>Original image unavailable</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TreeImage; 
// Default tree images for different categories
export const DEFAULT_IMAGES = {
  TREE_PLACEHOLDER: '/images/tree-placeholder.jpg',
  MEDICINAL_TREE: '/images/medicinal-tree-placeholder.jpg',
  SACRED_TREE: '/images/sacred-tree-placeholder.jpg',
  COMMERCIAL_TREE: '/images/commercial-tree-placeholder.jpg'
};

// CDN base URL - replace with your actual CDN URL
export const CDN_BASE_URL = 'https://your-cdn-url.com/trees';

// Mapping of tree types to their default images
export const TREE_TYPE_IMAGES = {
  medicinal: DEFAULT_IMAGES.MEDICINAL_TREE,
  sacred: DEFAULT_IMAGES.SACRED_TREE,
  commercial: DEFAULT_IMAGES.COMMERCIAL_TREE,
  default: DEFAULT_IMAGES.TREE_PLACEHOLDER
}; 
import treeData from '../data/treeData_temp_100.json';
import TreeEnrichmentService from './treeEnrichmentService';

const TREES_PER_PAGE = 12;

class TreeService {
  static getAllTrees() {
    return treeData.map(tree => ({
      ...tree,
      // Image is already included in the tree data
      additionalImages: tree.images.all || []
    }));
  }

  static async fetchTrees(page = 1, filters = {}) {
    try {
      let trees = this.getAllTrees();
      
      // Apply search filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        trees = trees.filter(tree => 
          tree.common_names.english.toLowerCase().includes(searchTerm) ||
          tree.scientific_name.toLowerCase().includes(searchTerm) ||
          tree.family.toLowerCase().includes(searchTerm) ||
          Object.values(tree.common_names).some(name => 
            name.toLowerCase().includes(searchTerm)
          )
        );
      }

      // Apply growth rate filter
      if (filters.growthRate) {
        trees = trees.filter(tree => 
          tree.characteristics.growth_rate.toLowerCase().includes(filters.growthRate.toLowerCase())
        );
      }

      // Apply region filter
      if (filters.region) {
        trees = trees.filter(tree =>
          tree.distribution.some(region =>
            region.toLowerCase().includes(filters.region.toLowerCase())
          )
        );
      }

      // Apply use type filter
      if (filters.useType) {
        trees = trees.filter(tree => {
          const useType = filters.useType.toLowerCase();
          return (
            tree.uses.commercial.some(use => use.toLowerCase().includes(useType)) ||
            tree.uses.medicinal.some(use => use.toLowerCase().includes(useType)) ||
            tree.uses.cultural.some(use => use.toLowerCase().includes(useType))
          );
        });
      }

      // Calculate pagination
      const start = (page - 1) * TREES_PER_PAGE;
      const end = start + TREES_PER_PAGE;
      const paginatedTrees = trees.slice(start, end);

      return {
        trees: paginatedTrees,
        total: trees.length,
        current_page: page,
        last_page: Math.ceil(trees.length / TREES_PER_PAGE),
        per_page: TREES_PER_PAGE
      };
    } catch (error) {
      console.error('Error fetching trees:', error);
      throw error;
    }
  }

  static async fetchTreeDetails(treeId) {
    try {
      const tree = this.getAllTrees().find(t => t.scientific_name === treeId);
      if (!tree) {
        throw new Error('Tree not found');
      }

      // Enrich tree data with AI-generated information
      const enrichedTree = await TreeEnrichmentService.enrichTreeData(tree);
      return enrichedTree;
    } catch (error) {
      console.error('Error fetching tree details:', error);
      throw error;
    }
  }

  // Helper method to get trees by family
  static getTreesByFamily(family) {
    return this.getAllTrees().filter(tree => tree.family === family);
  }

  // Helper method to get trees by distribution
  static getTreesByRegion(region) {
    return this.getAllTrees().filter(tree => 
      tree.distribution.some(dist => 
        dist.toLowerCase().includes(region.toLowerCase())
      )
    );
  }

  // Helper method to get trees by use
  static getTreesByUse(useType) {
    return this.getAllTrees().filter(tree => {
      const type = useType.toLowerCase();
      return (
        tree.uses.commercial.some(use => use.toLowerCase().includes(type)) ||
        tree.uses.medicinal.some(use => use.toLowerCase().includes(type)) ||
        tree.uses.cultural.some(use => use.toLowerCase().includes(type))
      );
    });
  }

  // Helper method to get medicinal trees
  static getMedicinalTrees() {
    return this.getAllTrees().filter(tree => tree.uses.medicinal.length > 0);
  }

  // Helper method to get sacred trees
  static getSacredTrees() {
    return this.getAllTrees().filter(tree => 
      tree.uses.cultural.some(use => 
        use.toLowerCase().includes('sacred')
      )
    );
  }
}

export default TreeService;
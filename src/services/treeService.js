const TREES_PER_PAGE = 12;

// Common tree species for image search
const TREE_SPECIES = {
  'Maple': ['Acer rubrum', 'Acer saccharum'],
  'Oak': ['Quercus alba', 'Quercus rubra'],
  'Pine': ['Pinus strobus', 'Pinus resinosa'],
  'Birch': ['Betula papyrifera', 'Betula alleghaniensis'],
  'Elm': ['Ulmus americana', 'Ulmus rubra'],
  'Willow': ['Salix alba', 'Salix babylonica'],
  'Cherry': ['Prunus serotina', 'Prunus avium'],
  'Beech': ['Fagus grandifolia'],
  'Ash': ['Fraxinus americana', 'Fraxinus pennsylvanica'],
  'Hickory': ['Carya ovata', 'Carya glabra']
};

class TreeService {
  static getLocalTreeData() {
    return Object.entries(TREE_SPECIES).map(([commonName, scientificNames], index) => ({
      id: index + 1,
      common_name: commonName,
      scientific_name: scientificNames[0],
      family: this.getFamilyFromScientificName(scientificNames[0]),
      description: this.getTreeDescription(commonName),
      image: `https://source.unsplash.com/800x600/?${encodeURIComponent(commonName + ' tree')}`,
      images: [
        `https://source.unsplash.com/800x600/?${encodeURIComponent(commonName + ' tree')}`,
        `https://source.unsplash.com/800x600/?${encodeURIComponent(scientificNames[0])}`,
        `https://source.unsplash.com/800x600/?${encodeURIComponent(commonName + ' forest')}`
      ],
      growth_habit: 'Tree',
      native_status: 'Native',
      observations_count: Math.floor(Math.random() * 1000) + 100,
      specifications: {
        average_height: Math.floor(Math.random() * 20) + 10,
        maximum_height: Math.floor(Math.random() * 30) + 20,
        growth_rate: ['Slow', 'Moderate', 'Fast'][Math.floor(Math.random() * 3)],
        growth_period: 'Year Round',
        growth_months: ['Spring', 'Summer', 'Fall']
      },
      growing_conditions: {
        light: ['Full Sun', 'Partial Shade'][Math.floor(Math.random() * 2)],
        soil_texture: ['Loamy', 'Sandy', 'Clay'][Math.floor(Math.random() * 3)],
        soil_humidity: ['Moist', 'Well-drained'][Math.floor(Math.random() * 2)],
        atmospheric_humidity: ['Moderate', 'High'][Math.floor(Math.random() * 2)]
      }
    }));
  }

  static getFamilyFromScientificName(scientificName) {
    const families = {
      'Acer': 'Aceraceae',
      'Quercus': 'Fagaceae',
      'Pinus': 'Pinaceae',
      'Betula': 'Betulaceae',
      'Ulmus': 'Ulmaceae',
      'Salix': 'Salicaceae',
      'Prunus': 'Rosaceae',
      'Fagus': 'Fagaceae',
      'Fraxinus': 'Oleaceae',
      'Carya': 'Juglandaceae'
    };
    const genus = scientificName.split(' ')[0];
    return families[genus] || 'Unknown';
  }

  static getTreeDescription(commonName) {
    const descriptions = {
      'Maple': 'Known for its stunning fall colors and maple syrup production. These trees are hardy and adaptable.',
      'Oak': 'Majestic and long-lived trees that provide essential habitat for wildlife and produce acorns.',
      'Pine': 'Evergreen trees with needle-like leaves, providing year-round greenery and winter interest.',
      'Birch': 'Distinctive white-barked trees that add winter interest and are important for wildlife.',
      'Elm': 'Stately trees with vase-shaped crowns, historically important in urban landscapes.',
      'Willow': 'Fast-growing trees often found near water, with distinctive drooping branches.',
      'Cherry': 'Beautiful flowering trees that produce fruit for wildlife and stunning spring blossoms.',
      'Beech': 'Slow-growing trees with smooth gray bark and dense shade-providing canopy.',
      'Ash': 'Valuable hardwood trees with compound leaves and excellent shade properties.',
      'Hickory': 'Strong hardwood trees that produce edible nuts and provide excellent shade.'
    };
    return descriptions[commonName] || 'A beautiful tree species native to various regions.';
  }

  static async fetchTrees(page = 1, filters = {}) {
    return this.getLocalTreeDataPaginated(page, filters);
  }

  static getLocalTreeDataPaginated(page = 1, filters = {}) {
    let trees = this.getLocalTreeData();
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      trees = trees.filter(tree => 
        tree.common_name.toLowerCase().includes(searchTerm) ||
        tree.scientific_name.toLowerCase().includes(searchTerm)
      );
    }

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
  }

  static async fetchTreeDetails(treeId) {
    return this.getLocalTreeDetail(treeId);
  }

  static getLocalTreeDetail(treeId) {
    const trees = this.getLocalTreeData();
    const tree = trees.find(t => t.id === parseInt(treeId));
    if (!tree) {
      throw new Error('Tree not found');
    }
    return tree;
  }
}

export default TreeService;
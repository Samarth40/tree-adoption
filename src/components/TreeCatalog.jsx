import React from 'react';

const trees = [
  {
    id: 1,
    name: 'Maple Tree',
    species: 'Acer saccharum',
    location: 'North Garden',
    image: 'https://images.unsplash.com/photo-1477511801984-4ad318ed9846?ixlib=rb-4.0.3',
  },
  {
    id: 2,
    name: 'Oak Tree',
    species: 'Quercus robur',
    location: 'East Garden',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3',
  },
  {
    id: 3,
    name: 'Pine Tree',
    species: 'Pinus sylvestris',
    location: 'West Garden',
    image: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?ixlib=rb-4.0.3',
  },
  {
    id: 4,
    name: 'Cherry Blossom',
    species: 'Prunus serrulata',
    location: 'South Garden',
    image: 'https://images.unsplash.com/photo-1516334029430-07a8fc1fabad?ixlib=rb-4.0.3',
  },
  {
    id: 5,
    name: 'Willow Tree',
    species: 'Salix babylonica',
    location: 'Riverside',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3',
  },
  {
    id: 6,
    name: 'Birch Tree',
    species: 'Betula pendula',
    location: 'Central Park',
    image: 'https://images.unsplash.com/photo-1501261379837-c3b516c6b235?ixlib=rb-4.0.3',
  },
];

const TreeCatalog = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-forest-green sm:text-4xl">
            Available Trees for Adoption
          </h2>
          <p className="mt-4 text-xl text-sage-green">
            Choose a tree to start your environmental journey
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {trees.map((tree) => (
            <div key={tree.id} className="bg-cream rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={tree.image}
                  alt={tree.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-200"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-forest-green">{tree.name}</h3>
                <p className="mt-2 text-sage-green">{tree.species}</p>
                <p className="text-earth-brown">{tree.location}</p>
                <button className="mt-4 w-full bg-leaf-green text-white py-2 px-4 rounded-md hover:bg-sage-green transition-colors duration-200">
                  Adopt This Tree
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreeCatalog; 
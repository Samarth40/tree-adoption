import React from 'react';

const Impact = () => {
  return (
    <div id="impact" className="relative py-24 scroll-mt-16">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-forest-green/80 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Environmental Impact
          </h2>
          <p className="text-xl text-cream">
            Together, we're making a measurable difference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-5xl mb-4 text-cream">{stat.icon}</div>
              <div className="text-3xl font-bold text-cream mb-2">{stat.value}</div>
              <div className="text-lg text-cream/90">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-cream mb-6">
                Growing Impact Year by Year
              </h3>
              <ul className="space-y-4">
                {yearlyImpact.map((item, index) => (
                  <li key={index} className="flex items-center text-cream">
                    <span className="text-leaf-green mr-3">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3"
                alt="Forest growth"
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const impactStats = [
  {
    icon: '🌳',
    value: '10,000+',
    label: 'Trees Planted'
  },
  {
    icon: '🌍',
    value: '500+',
    label: 'Tons of CO₂ Absorbed'
  },
  {
    icon: '🦋',
    value: '1,000+',
    label: 'Wildlife Habitats Created'
  },
  {
    icon: '💧',
    value: '5M+',
    label: 'Gallons of Water Conserved'
  }
];

const yearlyImpact = [
  'Increased forest coverage by 15% in local areas',
  'Reduced urban heat island effect by 2.5°C',
  'Created sustainable ecosystems for 50+ species',
  'Engaged 10,000+ community members in conservation',
  'Established 20+ urban forests in cities'
];

export default Impact; 
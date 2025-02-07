import React from 'react';

const CallToAction = () => {
  return (
    <div className="relative py-24">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-forest-green/75 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 md:p-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-cream mb-10">
              Join thousands of environmental champions who are already part of our tree adoption program. Your small action today can create a lasting impact for generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-leaf-green text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-sage-green transform hover:-translate-y-1 transition-all duration-200">
                Adopt Your Tree Today
              </button>
              <button className="px-8 py-4 bg-white/90 backdrop-blur-sm text-forest-green text-lg font-semibold rounded-lg shadow-lg hover:bg-white transform hover:-translate-y-1 transition-all duration-200">
                Schedule a Visit
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-cream">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-cream/80">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const benefits = [
  {
    icon: '🌱',
    title: 'Easy to Start',
    description: 'Begin your environmental journey with just a few clicks'
  },
  {
    icon: '🤝',
    title: 'Ongoing Support',
    description: 'Get expert guidance and community support throughout your journey'
  },
  {
    icon: '🌍',
    title: 'Real Impact',
    description: 'Make a tangible difference in the fight against climate change'
  }
];

export default CallToAction; 
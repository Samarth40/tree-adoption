import React from 'react';

const Testimonials = () => {
  return (
    <div id="testimonials" className="relative py-24 bg-cream scroll-mt-16">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-forest-green mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-sage-green">
            Hear from people who have already made an impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-forest-green">
                    {testimonial.name}
                  </h3>
                  <p className="text-sage-green">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <div className="flex text-leaf-green">
                {'★'.repeat(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-forest-green text-white rounded-lg shadow-lg hover:bg-sage-green transform hover:-translate-y-1 transition-all duration-200">
            Share Your Story
          </button>
        </div>
      </div>
    </div>
  );
};

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Portland, OR",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3",
    quote: "Adopting a tree has been an incredible journey. Watching it grow and knowing I'm contributing to a greener future is so rewarding.",
    rating: 5
  },
  {
    name: "Michael Chen",
    location: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
    quote: "The digital tracking feature is amazing! I love getting updates about my tree's growth and impact on the environment.",
    rating: 5
  },
  {
    name: "Emma Wilson",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3",
    quote: "This program has helped me teach my kids about environmental responsibility in a tangible way. They love their adopted maple tree!",
    rating: 5
  }
];

export default Testimonials; 
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CommunityPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3",
        location: "North Garden"
      },
      content: "Just spotted a beautiful Red Maple in North Garden! Anyone interested in adoption? 🌳",
      timestamp: "2024-03-15T10:30:00",
      image: "https://images.unsplash.com/photo-1477511801984-4ad318ed9846?ixlib=rb-4.0.3",
      likes: 12,
      replies: 3,
      tags: ["#RedMaple", "#NorthGarden", "#Adoption"]
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
        location: "East Garden"
      },
      content: "@SarahJohnson That's a gorgeous specimen! The fall colors will be amazing. I've adopted one last month and it's doing great! 🍁",
      timestamp: "2024-03-15T10:35:00",
      likes: 8,
      replies: 1,
      tags: ["#TreeCare", "#Community"]
    }
  ]);

  const [selectedArea, setSelectedArea] = useState('all');
  const [messageInput, setMessageInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPlantInfo, setShowPlantInfo] = useState(false);
  const [plantAnalysis, setPlantAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const areas = [
    { id: 'all', name: 'All Areas' },
    { id: 'north', name: 'North Garden' },
    { id: 'east', name: 'East Garden' },
    { id: 'south', name: 'South Garden' },
    { id: 'west', name: 'West Garden' },
    { id: 'central', name: 'Central Park' }
  ];

  // Mock function for plant recognition (replace with actual Gemini AI integration)
  const analyzePlant = async (image) => {
    setIsAnalyzing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPlantAnalysis({
      name: "Red Maple (Acer rubrum)",
      confidence: 0.95,
      characteristics: [
        "Deciduous tree",
        "Height: 20-30m",
        "Native to Eastern North America",
        "Known for brilliant fall colors"
      ],
      care_tips: [
        "Full sun to partial shade",
        "Regular watering",
        "Well-draining soil",
        "Moderate maintenance"
      ]
    });
    setIsAnalyzing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        analyzePlant(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() || selectedImage) {
      const newMessage = {
        id: messages.length + 1,
        user: {
          name: "Current User",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3",
          location: "Central Park"
        },
        content: messageInput,
        timestamp: new Date().toISOString(),
        image: selectedImage,
        likes: 0,
        replies: 0,
        tags: messageInput.match(/#\w+/g) || []
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
      setSelectedImage(null);
      setPlantAnalysis(null);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-forest-green mb-4">Community Garden</h1>
          <p className="text-sage-green text-lg">Connect with local tree enthusiasts and share your green journey</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Area Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-forest-green mb-4">Filter by Area</h3>
              <div className="space-y-2">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => setSelectedArea(area.id)}
                    className={`w-full px-4 py-2 rounded-lg text-left transition-all duration-300 ${
                      selectedArea === area.id
                        ? 'bg-forest-green text-white'
                        : 'hover:bg-forest-green/5 text-forest-green'
                    }`}
                  >
                    {area.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-forest-green mb-4">Active Members</h3>
              <div className="space-y-4">
                {['Sarah Johnson', 'Mike Chen', 'Emma Wilson'].map((user, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{user}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Messages Container */}
              <div 
                ref={chatContainerRef}
                className="h-[600px] overflow-y-auto p-6 space-y-6"
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-cream/30 rounded-xl p-4"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={message.user.avatar}
                          alt={message.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-forest-green">{message.user.name}</span>
                              <span className="text-sm text-sage-green ml-2">· {message.user.location}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{message.content}</p>
                          {message.image && (
                            <div className="mb-3">
                              <img
                                src={message.image}
                                alt="Shared plant"
                                className="rounded-lg max-h-64 object-cover"
                              />
                            </div>
                          )}
                          <div className="flex items-center space-x-4 text-sm">
                            <button className="text-sage-green hover:text-forest-green transition-colors">
                              ❤️ {message.likes}
                            </button>
                            <button className="text-sage-green hover:text-forest-green transition-colors">
                              💬 {message.replies}
                            </button>
                            <div className="flex-1"></div>
                            {message.tags?.map((tag, index) => (
                              <span
                                key={index}
                                className="text-leaf-green hover:text-forest-green cursor-pointer"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Plant Analysis Modal */}
              <AnimatePresence>
                {showPlantInfo && plantAnalysis && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="bg-white rounded-xl p-6 max-w-lg w-full"
                    >
                      <h3 className="text-2xl font-bold text-forest-green mb-4">{plantAnalysis.name}</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-forest-green mb-2">Characteristics:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {plantAnalysis.characteristics.map((char, index) => (
                              <li key={index} className="text-gray-700">{char}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-forest-green mb-2">Care Tips:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {plantAnalysis.care_tips.map((tip, index) => (
                              <li key={index} className="text-gray-700">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPlantInfo(false)}
                        className="mt-6 w-full bg-forest-green text-white py-2 rounded-lg hover:bg-leaf-green transition-colors"
                      >
                        Close
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message Input */}
              <div className="border-t border-gray-100 p-4">
                <form onSubmit={handleSendMessage} className="space-y-4">
                  {selectedImage && (
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="max-h-48 rounded-lg object-cover"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                      >
                        ✕
                      </button>
                      {isAnalyzing ? (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mx-auto mb-2"></div>
                            <p>Analyzing plant...</p>
                          </div>
                        </div>
                      ) : plantAnalysis && (
                        <button
                          onClick={() => setShowPlantInfo(true)}
                          className="absolute bottom-2 right-2 bg-forest-green text-white px-3 py-1 rounded-lg hover:bg-leaf-green transition-colors"
                        >
                          View Plant Info
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-sage-green hover:text-forest-green transition-colors"
                    >
                      📷
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Share your thoughts... Use @ to mention users and # for tags"
                      className="flex-1 bg-cream/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                    />
                    <button
                      type="submit"
                      className="bg-forest-green text-white px-4 py-2 rounded-xl hover:bg-leaf-green transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage; 
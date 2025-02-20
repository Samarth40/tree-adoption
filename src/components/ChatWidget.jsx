import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTree, FaLeaf, FaSpinner, FaPaperPlane, FaInfoCircle, FaHandHoldingHeart, FaWallet, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Navigation paths mapping
const navigationPaths = {
  explore: {
    path: '/explore',
    description: 'Browse and adopt trees'
  },
  dashboard: {
    path: '/dashboard',
    description: 'View your adopted trees and impact'
  },
  nft: {
    path: '/nft',
    description: 'NFT dashboard and minting'
  },
  community: {
    path: '/community',
    description: 'Community events and forums'
  },
  profile: {
    path: '/profile',
    description: 'Manage your profile'
  },
  impact: {
    path: '/impact',
    description: 'Track environmental impact'
  }
};

const ChatWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize conversation with system message
      const systemMessage = {
        role: 'system',
        content: `You are VanaRaksha Assistant, a helpful AI chatbot for the VanaRaksha tree adoption platform. 
        Your role is to help users understand and navigate:
        - The tree adoption process and its benefits
        - Our NFT-based digital certificates
        - Environmental impact tracking
        - Community features and events
        - Platform features and services
        - Costs and payment options

        Navigation Paths (always include these exact paths when directing users):
        - /explore - Browse and adopt trees
        - /dashboard - View adopted trees and impact
        - /nft - NFT dashboard and minting
        - /community - Community events and forums
        - /profile - Manage profile
        - /impact - Track environmental impact
        
        When providing navigation guidance:
        1. Always include the exact path (e.g., "/explore")
        2. Format links with [Text](/path) syntax
        3. Provide clear, step-by-step instructions
        4. Explain what they'll find at the destination
        
        Key points to remember:
        - Be friendly and engaging
        - Use 1-2 relevant emojis per message
        - Keep responses concise (under 150 words)
        - Provide specific, actionable information
        - Encourage tree adoption and environmental conservation
        - Share relevant statistics about environmental impact
        - Guide users to appropriate platform features
        
        Current features:
        - Tree adoption with NFT certificates
        - Real-time impact tracking
        - Community events and workshops
        - AI-powered tree chat
        - Regular photo and growth updates
        - Environmental impact reports`
      };
      setConversationHistory([systemMessage]);
      
      handleBotResponse("Welcome to VanaRaksha! 🌳 I'm here to help you learn about tree adoption and our platform. What would you like to know about?", true);
    }
  }, [isOpen]);

  const generateResponse = async (userMessage) => {
    try {
      // Add user message to conversation history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      // Keep only last 10 messages to avoid token limits
      const limitedHistory = updatedHistory.length > 10 
        ? [updatedHistory[0], ...updatedHistory.slice(-9)]
        : updatedHistory;

      const payload = {
        model: 'deepseek/deepseek-chat',
        messages: limitedHistory,
        temperature: 0.7,
        max_tokens: 150,
        stream: false
      };

      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'VanaRaksha Assistant'
          }
        }
      );

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenRouter');
      }

      const aiResponse = response.data.choices[0].message.content;
      
      // Update conversation history
      setConversationHistory([
        ...limitedHistory,
        { role: 'assistant', content: aiResponse }
      ]);

      return aiResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('I apologize, but I\'m having trouble responding right now. Please try again in a moment. 🙏');
    }
  };

  const processNavigationLinks = (response) => {
    // Match markdown-style links: [text](/path)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return response.replace(linkRegex, (match, text, path) => {
      // Create a clickable link with enhanced styling
      return `<a href="${path}" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-forest-green/10 text-forest-green hover:bg-forest-green hover:text-white transition-all duration-300 font-medium">
        <span>${text}</span>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>`;
    });
  };

  const handleBotResponse = async (response, isInitial = false) => {
    // Process response for navigation links
    const processedResponse = processNavigationLinks(response);
    
    const botMessage = {
      text: processedResponse,
      isBot: true,
      timestamp: new Date(),
      hasLinks: response.includes('[') && response.includes('](/')
    };

    if (isInitial) {
      setMessages([botMessage]);
    } else {
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleLinkClick = (e) => {
    if (e.target.tagName === 'A' && e.target.href) {
      e.preventDefault();
      const path = new URL(e.target.href).pathname;
      navigate(path);
    }
  };

  const getSuggestedQuestions = () => [
    { text: "How can I adopt a tree?", icon: <FaHandHoldingHeart /> },
    { text: "What's the environmental impact?", icon: <FaLeaf /> },
    { text: "Tell me about NFT certificates", icon: <FaWallet /> },
    { text: "How do I get started?", icon: <FaUserPlus /> }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Generate AI response
      const response = await generateResponse(inputText);
      handleBotResponse(response);
    } catch (error) {
      handleBotResponse(error.message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionClick = (question) => {
    setInputText(question);
    handleSubmit({ preventDefault: () => {}, target: { value: question } });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-8 left-8 w-14 h-14 rounded-full bg-forest-green text-white shadow-enhanced glass flex items-center justify-center transform-gpu z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaTree className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="fixed bottom-28 left-8 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-forest-green/10 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-forest-green text-white relative">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-full">
                  <FaTree className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">VanaRaksha Assistant</h3>
                  <p className="text-sm text-white/80">Ask me anything about tree adoption!</p>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close chat"
                >
                  <svg 
                    className="w-4 h-4 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
              onClick={handleLinkClick}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                      message.isBot
                        ? 'bg-white text-gray-800 border border-gray-100'
                        : 'bg-forest-green text-white'
                    }`}
                  >
                    {message.hasLinks ? (
                      <div 
                        className="text-sm whitespace-pre-wrap space-y-2"
                        dangerouslySetInnerHTML={{ __html: message.text }}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    )}
                    <p className="text-xs mt-1 opacity-50">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex space-x-2">
                      <motion.div 
                        className="w-2 h-2 bg-forest-green rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ 
                          duration: 0.6, 
                          repeat: Infinity,
                          delay: 0 
                        }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-forest-green rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ 
                          duration: 0.6, 
                          repeat: Infinity,
                          delay: 0.2 
                        }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-forest-green rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ 
                          duration: 0.6, 
                          repeat: Infinity,
                          delay: 0.4 
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length < 3 && (
              <div className="p-4 border-t border-gray-100 bg-white">
                <p className="text-sm text-gray-600 mb-3 font-medium">Suggested questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {getSuggestedQuestions().map((question, index) => (
                    <motion.button
                      key={index}
                      className="flex items-center gap-2 text-sm bg-gray-50 hover:bg-forest-green/5 text-forest-green px-3 py-2 rounded-xl transition-colors text-left border border-gray-100"
                      onClick={() => handleQuestionClick(question.text)}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {question.icon}
                      <span className="truncate">{question.text}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 transition-all duration-300"
                />
                <motion.button
                  type="submit"
                  className="p-3 bg-forest-green text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputText.trim() || isTyping}
                >
                  {isTyping ? (
                    <FaSpinner className="w-5 h-5 animate-spin" />
                  ) : (
                    <FaPaperPlane className="w-5 h-5" />
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget; 
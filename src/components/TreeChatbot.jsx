import React, { useState, useRef, useEffect } from 'react';
import aiService from '../services/aiService';

const TreeChatbot = ({ treeData }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationContext, setConversationContext] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when component mounts
    if (messages.length === 0) {
      const welcomeMessage = {
        text: `Hello! I'm your ${treeData.species || 'tree'} from ${treeData.location || 'the garden'}. 
        I'm excited to chat with you about my growth, characteristics, and how I contribute to the environment. 
        Feel free to ask me anything about my species, care needs, or environmental impact! What would you like to know?`,
        sender: 'tree'
      };
      setMessages([welcomeMessage]);
      setConversationContext([welcomeMessage]);
    }
  }, []); // Only run once on mount

  const generateFollowUpQuestion = (response) => {
    // Based on the tree's response, generate relevant follow-up questions
    const topics = {
      growth: ['How tall can you grow?', 'What helps you grow faster?', 'How old are you now?'],
      care: ['What kind of soil do you prefer?', 'How often do you need water?', 'Do you need special care in different seasons?'],
      environment: ['How do you help the local ecosystem?', 'What wildlife do you support?', 'How much CO2 do you absorb?'],
      characteristics: ['What makes your species unique?', 'Do you produce fruits or flowers?', 'How do your leaves change with seasons?']
    };

    const responseLower = response.toLowerCase();
    let relevantTopics = [];

    if (responseLower.includes('grow') || responseLower.includes('height') || responseLower.includes('progress')) {
      relevantTopics = [...relevantTopics, ...topics.growth];
    }
    if (responseLower.includes('care') || responseLower.includes('water') || responseLower.includes('soil')) {
      relevantTopics = [...relevantTopics, ...topics.care];
    }
    if (responseLower.includes('environment') || responseLower.includes('ecosystem') || responseLower.includes('wildlife')) {
      relevantTopics = [...relevantTopics, ...topics.environment];
    }
    if (responseLower.includes('species') || responseLower.includes('unique') || responseLower.includes('characteristic')) {
      relevantTopics = [...relevantTopics, ...topics.characteristics];
    }

    // If no specific topics matched, use a mix of questions
    if (relevantTopics.length === 0) {
      relevantTopics = [...topics.growth, ...topics.care, ...topics.environment, ...topics.characteristics];
    }

    // Return 2-3 random relevant follow-up questions
    return relevantTopics
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 2);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Add user message to chat
    const newUserMessage = { text: userMessage, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);

    // Update conversation context
    const updatedContext = [...conversationContext, newUserMessage].slice(-5);
    setConversationContext(updatedContext);

    try {
      console.log('Sending message to AI service:', {
        message: userMessage,
        contextLength: updatedContext.length
      });

      // Get response from AI with enhanced context
      const response = await aiService.generateTreeResponse(userMessage, {
        ...treeData,
        context: {
          previousMessages: updatedContext,
          totalMessages: messages.length
        }
      });
      
      console.log('Received response from AI service:', {
        responseLength: response.length,
        hasResponse: !!response
      });

      if (!response) {
        throw new Error('Empty response received from AI service');
      }

      // Add tree's response to chat
      const treeResponse = { text: response, sender: 'tree' };
      setMessages(prev => [...prev, treeResponse]);
      setConversationContext(prev => [...prev, treeResponse]);

      // Generate and add follow-up suggestions
      const followUpQuestions = generateFollowUpQuestion(response);
      if (followUpQuestions.length > 0) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              text: "You might also want to ask:",
              sender: 'tree',
              isFollowUp: true,
              suggestions: followUpQuestions
            }
          ]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error in chat interaction:', error);
      setError(error.message);
      setMessages(prev => [...prev, {
        text: error.message || "I'm having trouble processing that right now. Could you try asking in a different way?",
        sender: 'tree',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = () => {
    const suggestions = [
      "How do you help the environment?",
      "What's special about your species?",
      "How fast do you grow?",
      "What kind of care do you need?",
    ];
    if (treeData.medicinalUses?.length > 0) {
      suggestions.push("What are your medicinal properties?");
    }
    return suggestions;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(space.24))] sm:h-[500px] bg-white rounded-2xl shadow-lg border border-forest-green/10 max-w-full mx-auto">
      {error && (
        <div className="px-3 sm:px-4 py-2 bg-red-50 border-b border-red-100">
          <p className="text-xs sm:text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'tree' && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-leaf-green/10 flex items-center justify-center mr-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-forest-green" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.16 2.652a1 1 0 011.494.237l1.757 2.636a1 1 0 001.494.237l1.757-2.636a1 1 0 011.494-.237l2.636 1.757a1 1 0 01.237 1.494l-2.636 1.757a1 1 0 00-.237 1.494l2.636 1.757a1 1 0 01-.237 1.494l-2.636 1.757a1 1 0 00-1.494.237L8.901 17.348a1 1 0 01-1.494.237l-1.757-2.636a1 1 0 00-1.494-.237L1.52 16.47a1 1 0 01-1.494-.237l-1.757-2.636a1 1 0 01.237-1.494l2.636-1.757a1 1 0 000-1.494L.52 6.348a1 1 0 01-.237-1.494l1.757-2.636a1 1 0 011.494-.237l2.636 1.757z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-forest-green text-white ml-auto'
                  : message.isFollowUp
                  ? 'bg-cream/50 text-gray-800'
                  : message.isError
                  ? 'bg-red-50 text-red-600'
                  : 'bg-leaf-green/10 text-gray-800'
              }`}
            >
              <p className="text-xs sm:text-sm leading-relaxed break-words">{message.text}</p>
              {message.isFollowUp && message.suggestions && (
                <div className="mt-2 space-y-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputMessage(suggestion);
                        handleSendMessage({ preventDefault: () => {}, target: { value: suggestion } });
                      }}
                      className="block w-full text-left text-xs sm:text-sm text-forest-green hover:text-forest-green/80 transition-colors"
                    >
                      • {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {message.sender === 'user' && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-forest-green/10 flex items-center justify-center ml-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-forest-green" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-leaf-green/10 flex items-center justify-center mr-2 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-forest-green animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div className="bg-leaf-green/10 text-gray-800 rounded-2xl px-3 sm:px-4 py-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-forest-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-forest-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-forest-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
        <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-forest-green/10 bg-cream/20">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {getSuggestions().map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputMessage(suggestion);
                  handleSendMessage({ preventDefault: () => {}, target: { value: suggestion } });
                }}
                className="text-xs sm:text-sm bg-forest-green/5 text-forest-green px-2 sm:px-3 py-1 rounded-full hover:bg-forest-green/10 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="border-t border-forest-green/10 bg-white p-3 sm:p-4">
        <div className="flex space-x-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-forest-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-green/30 focus:border-forest-green/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-forest-green text-white px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-xl hover:bg-forest-green/90 focus:outline-none focus:ring-2 focus:ring-forest-green disabled:opacity-50 transition-colors whitespace-nowrap shadow-sm"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default TreeChatbot; 
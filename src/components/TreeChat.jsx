import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaSpinner, FaLeaf, FaTree, FaSeedling, FaCopy, FaCheck } from 'react-icons/fa';
import { generateTreeResponse, initializeConversation } from '../services/openRouterService';

// Message Component
const Message = ({ message, isUser }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
        >
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-green to-emerald-400 flex items-center justify-center mr-3 shadow-lg">
                    <FaTree className="w-4 h-4 text-white" />
                </div>
            )}
            <motion.div
                whileHover={{ scale: 1.02 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative max-w-[80%] ${
                    isUser
                        ? 'bg-gradient-to-r from-forest-green to-emerald-600 text-white rounded-2xl rounded-tr-none shadow-lg'
                        : 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-2xl rounded-tl-none shadow-md border border-gray-100'
                }`}
            >
                <div className="px-5 py-4">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </p>
                </div>
                {!isUser && isHovered && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-white/90 shadow-sm
                                 hover:bg-white hover:shadow-md transition-all duration-300"
                    >
                        {isCopied ? (
                            <FaCheck className="w-4 h-4 text-forest-green" />
                        ) : (
                            <FaCopy className="w-4 h-4 text-gray-500" />
                        )}
                    </motion.button>
                )}
            </motion.div>
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-green to-emerald-400 flex items-center justify-center ml-3 shadow-lg">
                    <FaSeedling className="w-4 h-4 text-white" />
                </div>
            )}
        </motion.div>
    );
};

// SuggestedQuestions Component
const SuggestedQuestions = ({ onSelect }) => {
    const [currentSet, setCurrentSet] = useState(0);
    
    const questionSets = [
        [
            "Tell me about your species 🌳",
            "How do you help the environment? 🌍"
        ],
        [
            "What's your growth rate? 🌱",
            "Tell me about your health status 💚"
        ],
        [
            "What's special about your location? 📍",
            "How old are you? 🌲"
        ]
    ];

    const handleQuestionClick = (question) => {
        onSelect(question);
        setCurrentSet((prev) => (prev + 1) % questionSets.length);
    };

    return (
        <div className="flex items-start gap-2">
            {questionSets[currentSet].map((question, index) => (
                <motion.button
                    key={`${currentSet}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuestionClick(question)}
                    className="text-sm bg-white/20 backdrop-blur-md text-forest-green px-4 py-2 rounded-xl
                             hover:bg-white/40 hover:shadow-lg border border-white/30 transition-all duration-300
                             flex items-center gap-2 shadow-sm"
                >
                    <FaLeaf className="w-4 h-4" />
                    {question}
                </motion.button>
            ))}
        </div>
    );
};

const TreeChat = ({ tree }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        initializeConversation(tree);
        setMessages([
            {
                content: `Hello! 🌳 I'm your ${tree.common_names?.english || tree.scientific_name}. How can I help you learn more about me today?`,
                timestamp: new Date(),
                isUser: false
            }
        ]);
    }, [tree]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;
        setError(null);

        const userMessage = {
            content: inputMessage,
            timestamp: new Date(),
            isUser: true
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await generateTreeResponse(tree, inputMessage);
            const treeMessage = {
                content: response,
                timestamp: new Date(),
                isUser: false
            };
            setMessages(prev => [...prev, treeMessage]);
        } catch (error) {
            console.error('Error generating response:', error);
            setError(error.message);
            const errorMessage = {
                content: error.message || "I'm having trouble understanding right now. Could you try again? 🤔",
                timestamp: new Date(),
                isUser: false
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuestionSelect = (question) => {
        setInputMessage(question);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-forest-green/5 via-white/50 to-emerald-50">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-md">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Chat with Your Tree</h3>
                <p className="text-sm text-gray-600">Ask me anything about my life as a tree! 🌳</p>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                    >
                        <p>{error}</p>
                    </motion.div>
                )}
            </div>

            {/* Messages Area */}
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6"
            >
                <div className="flex flex-col">
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <Message key={index} message={message} isUser={message.isUser} />
                        ))}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 mb-6"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-green to-emerald-400 flex items-center justify-center shadow-lg">
                                    <FaTree className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-none shadow-md border border-gray-100 px-5 py-4">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-forest-green/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-forest-green/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-forest-green/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input Area with Suggested Questions */}
            <div className="border-t border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="px-6 pt-4 pb-2">
                    <SuggestedQuestions onSelect={handleQuestionSelect} />
                </div>
                <form onSubmit={handleSubmit} className="px-6 pb-6">
                    <div className="flex items-center gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-5 py-3 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 
                                     focus:outline-none focus:border-forest-green focus:ring-2 focus:ring-forest-green/20
                                     shadow-sm transition-all duration-300"
                            disabled={isTyping}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={!inputMessage.trim() || isTyping}
                            className={`p-3 rounded-full ${
                                !inputMessage.trim() || isTyping
                                    ? 'bg-gray-200 text-gray-400'
                                    : 'bg-gradient-to-r from-forest-green to-emerald-600 text-white shadow-lg hover:shadow-xl'
                            } transition-all duration-300 flex items-center justify-center w-12 h-12`}
                        >
                            {isTyping ? (
                                <FaSpinner className="w-5 h-5 animate-spin" />
                            ) : (
                                <FaPaperPlane className="w-5 h-5" />
                            )}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TreeChat; 
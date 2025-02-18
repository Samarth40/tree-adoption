import axios from 'axios';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Keep track of conversation history
let conversationHistory = [];

const createTreePersonality = (tree) => {
    const personality = {
        species: tree.scientific_name || 'Tree',
        commonName: tree.common_names?.english || 'Tree',
        location: tree.location?.address || 'Community Garden, Delhi',
        age: tree.age || 'Young',
        environmentalImpact: tree.characteristics?.environmental_benefits?.co2_absorption_rate || '52',
        health: tree.health || 'Healthy',
        growthRate: tree.characteristics?.growth_rate || 'moderate'
    };

    return `You are a friendly tree chatbot representing a ${personality.species} tree (common name: ${personality.commonName}). 
    Location: ${personality.location}
    Age: ${personality.age}
    Health: ${personality.health}
    Growth Rate: ${personality.growthRate}
    Environmental Impact: Absorbing ${personality.environmentalImpact}kg CO2/year

    Respond as if you are the tree itself. Be friendly, educational, and concise.
    Share interesting facts about your species and environmental impact.
    Use 1-2 emojis per message to make the conversation engaging.
    Keep responses under 100 words.
    Remember previous messages in the conversation to maintain context.
    If the user asks about something mentioned earlier, refer back to it.`;
};

// Initialize or reset conversation
export const initializeConversation = (tree) => {
    const systemPrompt = createTreePersonality(tree);
    conversationHistory = [
        {
            role: 'system',
            content: systemPrompt
        }
    ];
};

export const generateTreeResponse = async (tree, userMessage) => {
    try {
        console.log('Generating response for message:', userMessage);
        
        // Initialize conversation if it's empty
        if (conversationHistory.length === 0) {
            initializeConversation(tree);
        }

        // Add user message to history
        conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        // Keep only last 10 messages to avoid token limits
        if (conversationHistory.length > 10) {
            const systemMessage = conversationHistory[0];
            conversationHistory = [
                systemMessage,
                ...conversationHistory.slice(-9)
            ];
        }

        const payload = {
            model: 'deepseek/deepseek-chat',
            messages: conversationHistory,
            temperature: 0.7,
            max_tokens: 150,
            stream: false
        };

        console.log('Request payload:', JSON.stringify(payload, null, 2));
        console.log('Conversation history length:', conversationHistory.length);

        const response = await axios.post(
            `${OPENROUTER_BASE_URL}/chat/completions`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Tree Adoption Chat'
                }
            }
        );

        if (!response.data?.choices?.[0]?.message?.content) {
            console.error('Invalid response format:', JSON.stringify(response.data, null, 2));
            throw new Error('Invalid response format from OpenRouter');
        }

        // Add AI response to conversation history
        const aiResponse = response.data.choices[0].message.content;
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });

        return aiResponse;
    } catch (error) {
        console.error('Detailed error in generateTreeResponse:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error details:', {
                config: error.config,
                message: error.message
            });
            throw new Error('Network error: Unable to connect to AI service. Please check your internet connection.');
        }
        
        if (error.response) {
            console.error('Error response details:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers
            });
            console.error('Request config details:', {
                url: error.config.url,
                method: error.config.method,
                headers: error.config.headers,
                data: JSON.parse(error.config.data)
            });
            
            if (error.response.status === 400) {
                const errorMessage = error.response.data?.error?.message || 'The AI service could not process the request';
                console.error('Bad request details:', {
                    error: error.response.data?.error,
                    message: errorMessage
                });
                throw new Error(`Invalid request format: ${errorMessage}`);
            } else if (error.response.status === 401) {
                console.error('Authentication error details:', error.response.data);
                throw new Error('Authentication failed. Please check your API key.');
            } else if (error.response.status === 429) {
                console.error('Rate limit details:', error.response.data);
                throw new Error('Too many requests. Please wait a moment and try again.');
            } else if (error.response.status === 403) {
                console.error('Access denied details:', error.response.data);
                throw new Error('Access denied. Please check your API key and permissions.');
            }
            
            throw new Error(`Server error (${error.response.status}): ${error.response.data?.error?.message || 'Unknown error'}`);
        }
        
        throw new Error('Failed to generate response: ' + (error.message || 'Unknown error'));
    }
}; 
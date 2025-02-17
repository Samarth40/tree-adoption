import axios from 'axios';

class AIService {
  constructor() {
    this.huggingFaceConfig = {
      apiKey: import.meta.env.VITE_HUGGING_FACE_API_KEY,
      baseURL: 'https://api-inference.huggingface.co/models'
    };
  }

  async generateTreeResponse(message, treeData) {
    const systemPrompt = this.generateSystemPrompt(treeData);
    console.log('Generating response for message:', message);

    try {
      // Validate API key
      if (!this.huggingFaceConfig.apiKey) {
        throw new Error('HuggingFace API key is missing. Please check your .env file.');
      }

      // Log the request being made
      console.log('Making request to HuggingFace with context:', {
        message,
        systemPrompt: systemPrompt.slice(0, 100) + '...',
        previousMessages: treeData.context?.previousMessages?.length || 0
      });

      // First try with primary model
      try {
        const response = await this.callHuggingFaceModel(
          'google/flan-t5-xl',
          systemPrompt,
          message,
          treeData.context?.previousMessages || []
        );
        
        if (response) {
          return response;
        }
      } catch (primaryError) {
        console.log('Primary model failed, trying backup model:', primaryError);
      }

      // Fallback to backup model
      const response = await this.callHuggingFaceModel(
        'facebook/opt-1.3b',
        systemPrompt,
        message,
        treeData.context?.previousMessages || []
      );

      if (!response) {
        throw new Error('No response received from any model');
      }

      return response;

    } catch (error) {
      console.error('Error in generateTreeResponse:', error);
      
      if (error.response?.status === 401) {
        return "I'm having trouble authenticating. Please check if your HuggingFace API key is valid.";
      } else if (error.response?.status === 429) {
        return "I'm receiving too many requests right now. Please try again in a moment.";
      } else if (error.response?.status === 503) {
        return "I'm currently warming up. Please try again in a few seconds.";
      }
      
      return "I'm having trouble communicating right now. Please try again in a moment.";
    }
  }

  generateSystemPrompt(treeData) {
    const basePrompt = `You are a ${treeData.species || 'tree'} having a conversation. 
    Context about you:
    - Age: ${treeData.age || 'mature'}
    - Location: ${treeData.location || 'a beautiful garden'}
    - Features: ${treeData.features || 'strong branches and vibrant leaves'}
    ${treeData.medicinalUses?.length ? `- Medicinal Uses: ${treeData.medicinalUses.join(', ')}` : ''}
    
    Care Guidelines:
    ${Object.entries(treeData.careGuidelines || {})
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')}

    Personality: You are wise, nurturing, passionate about environmental conservation, proud of your species, and friendly.
    Current Growth Progress: ${treeData.progress}%

    Task: Respond to the user's message in a friendly, informative way, sharing your experiences and knowledge.
    Rules:
    1. Keep responses concise (2-4 sentences)
    2. Be personal and relate to your characteristics
    3. Share specific details about your species and location
    4. Express emotions about environmental topics
    5. Use tree-related metaphors occasionally

    Question: "${message}"
    Response:`;

    return basePrompt;
  }

  async callHuggingFaceModel(model, systemPrompt, message, previousMessages = []) {
    try {
      console.log('Trying model:', model);

      // Format conversation history
      const conversationHistory = previousMessages
        .map(msg => `${msg.sender === 'user' ? 'Human' : 'Tree'}: ${msg.text}`)
        .join('\n');

      // Prepare the input text
      const inputText = `${systemPrompt}\n\nPrevious conversation:\n${conversationHistory}\n\nHuman: ${message}\nTree:`;

      // Make request to HuggingFace's API
      const response = await axios.post(
        `${this.huggingFaceConfig.baseURL}/${model}`,
        {
          inputs: inputText,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.huggingFaceConfig.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && Array.isArray(response.data)) {
        // Handle array response format
        const generatedText = response.data[0]?.generated_text || response.data[0]?.text || '';
        return this.cleanResponse(generatedText);
      } else if (response.data && typeof response.data === 'object') {
        // Handle object response format
        const generatedText = response.data.generated_text || response.data.text || '';
        return this.cleanResponse(generatedText);
      }

      throw new Error('Invalid response format from model');

    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      throw error;
    }
  }

  cleanResponse(text) {
    // Remove any "Tree:" or "Assistant:" prefixes
    text = text.replace(/^(Tree|Assistant):\s*/i, '');
    
    // Remove any "Human:" or subsequent conversation
    text = text.split(/Human:/i)[0].trim();
    
    // Clean up any markdown or special characters
    text = text.replace(/```/g, '').trim();
    
    // Ensure the response isn't too long
    if (text.length > 500) {
      text = text.substring(0, 497) + '...';
    }
    
    return text || "I'm not sure how to respond to that. Could you try asking in a different way?";
  }
}

export default new AIService(); 
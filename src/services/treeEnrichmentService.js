import axios from 'axios';

class TreeEnrichmentService {
  static async enrichTreeData(tree) {
    try {
      // Structure the prompt for comprehensive tree information
      const prompt = `
        As a botanical expert, provide detailed information about this tree in JSON format:
        Tree: ${tree.scientific_name} (${tree.common_names?.english || 'Unknown common name'})
        Family: ${tree.family}
        Description: ${tree.description || 'A tree species'}

        Please provide comprehensive information in this exact JSON structure, ensuring all fields have meaningful content:
        {
          "characteristics": {
            "growth_rate": "Detailed growth rate description",
            "soil_preference": "Specific soil requirements and preferences",
            "water_needs": "Water requirements and frequency",
            "sunlight_requirements": "Sunlight preferences and tolerance",
            "climate_tolerance": "Temperature range and climate adaptability",
            "root_system": "Root system characteristics and spread",
            "height": {
              "average": "Average height in meters",
              "maximum": "Maximum height in meters"
            }
          },
          "uses": {
            "medicinal": [
              {
                "use": "Specific medicinal application",
                "scientific_basis": "Scientific explanation of medicinal properties"
              }
            ],
            "commercial": ["List of commercial applications"],
            "cultural": ["Cultural significance and traditional uses"],
            "ecological": ["Ecological roles and environmental contributions"]
          },
          "environmental_benefits": [
            "Carbon sequestration capacity",
            "Wildlife habitat support",
            "Soil conservation impact",
            "Air quality improvement"
          ],
          "cultivation": [
            "Optimal growing conditions",
            "Maintenance requirements",
            "Disease resistance information",
            "Growth patterns and characteristics"
          ],
          "historical_significance": "Detailed historical importance and traditional uses",
          "conservation_status": "Current conservation status and potential threats",
          "fun_facts": [
            "Interesting fact about the tree's unique features",
            "Notable historical use or significance",
            "Unique biological characteristic"
          ],
          "care_guidelines": {
            "watering": "Detailed watering schedule and requirements",
            "pruning": "Pruning guidelines and best practices",
            "fertilization": "Fertilization recommendations and timing",
            "pest_management": "Common pests and management strategies"
          }
        }

        Focus on providing accurate, detailed information for ALL fields. If specific information is not known, provide reasonable insights based on the tree's family and general characteristics.
      `;

      // Call to Hugging Face Inference API
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
        {
          inputs: prompt,
          parameters: {
            max_length: 2000,
            temperature: 0.7,
            top_p: 0.85,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // Parse and structure the AI response
      let enrichedData = this.parseAIResponse(response.data[0].generated_text);
      const isAIGenerated = enrichedData && Object.keys(enrichedData).length > 0;

      // Merge with existing characteristics
      const mergedCharacteristics = {
        ...tree.characteristics,
        growth_rate: enrichedData.characteristics?.growth_rate || "Moderate growth rate typical for this species",
        soil_preference: enrichedData.characteristics?.soil_preference || "Adaptable to various soil conditions",
        water_needs: enrichedData.characteristics?.water_needs || "Regular watering needed for optimal growth",
        sunlight_requirements: enrichedData.characteristics?.sunlight_requirements || "Prefers full sun to partial shade",
        climate_tolerance: enrichedData.characteristics?.climate_tolerance || "Adaptable to local climate conditions",
        root_system: enrichedData.characteristics?.root_system || "Typical root system for its species",
        height: {
          ...tree.characteristics.height,
          average: tree.characteristics.height?.average || enrichedData.characteristics?.height?.average || null,
          maximum: tree.characteristics.height?.maximum || enrichedData.characteristics?.height?.maximum || null
        },
        ai_enhanced: true,
        is_fallback: !isAIGenerated
      };

      // Merge with existing uses
      const mergedUses = {
        ...tree.uses,
        medicinal: tree.uses.medicinal.length > 0 ? tree.uses.medicinal : [{
          use: "May have traditional medicinal properties",
          scientific_basis: "Further research needed to confirm medicinal benefits",
          is_fallback: !isAIGenerated
        }],
        commercial: tree.uses.commercial.length > 0 ? tree.uses.commercial : ["Potential for sustainable resource use"],
        cultural: tree.uses.cultural.length > 0 ? tree.uses.cultural : ["Historical significance in local ecosystems"],
        ecological: enrichedData.uses?.ecological || ["Contributes to local biodiversity"],
        ai_enhanced: true,
        is_fallback: !isAIGenerated
      };

      // Return merged data
      return {
        ...tree,
        characteristics: mergedCharacteristics,
        uses: mergedUses,
        environmental_benefits: enrichedData.environmental_benefits || [
          "Carbon dioxide absorption and oxygen production",
          "Provides habitat for local wildlife",
          "Helps prevent soil erosion",
          "Contributes to urban cooling"
        ],
        cultivation: enrichedData.cultivation || [
          "Plant in well-draining soil",
          "Ensure adequate sunlight exposure",
          "Regular maintenance recommended",
          "Monitor for typical tree health issues"
        ],
        historical_significance: enrichedData.historical_significance || "Part of the local ecological heritage",
        conservation_status: enrichedData.conservation_status || "Status being monitored for conservation needs",
        fun_facts: enrichedData.fun_facts || [
          "Each mature tree of this species can process significant amounts of CO2 annually",
          "Provides shelter and food for various wildlife species",
          "Contributes to local ecosystem stability"
        ],
        care_guidelines: enrichedData.care_guidelines || {
          watering: "Regular watering schedule based on local climate",
          pruning: "Annual pruning to maintain health and shape",
          fertilization: "Seasonal fertilization as needed",
          pest_management: "Regular monitoring for common tree pests"
        },
        ai_enhanced: true,
        is_fallback: !isAIGenerated,
        data_source: isAIGenerated ? "ai_generated" : "fallback_content",
        images: tree.images || {
          primary: "default-tree-image.jpg",
          all: []
        }
      };

    } catch (error) {
      console.error('Error enriching tree data:', error);
      
      // Return tree with default AI-enhanced data if API fails
      return {
        ...tree,
        characteristics: {
          ...tree.characteristics,
          growth_rate: "Moderate growth rate",
          soil_preference: "Adaptable to various soil conditions",
          water_needs: "Regular watering needed",
          sunlight_requirements: "Full sun to partial shade",
          climate_tolerance: "Adaptable to local climate",
          root_system: "Typical root system",
          ai_enhanced: true,
          is_fallback: true
        },
        uses: {
          ...tree.uses,
          medicinal: tree.uses.medicinal.length > 0 ? tree.uses.medicinal : [{
            use: "May have traditional medicinal properties",
            scientific_basis: "Further research needed",
            is_fallback: true
          }],
          commercial: tree.uses.commercial.length > 0 ? tree.uses.commercial : ["Sustainable resource potential"],
          cultural: tree.uses.cultural.length > 0 ? tree.uses.cultural : ["Local ecological significance"],
          ecological: ["Biodiversity support", "Ecosystem services"],
          ai_enhanced: true,
          is_fallback: true
        },
        environmental_benefits: [
          "Carbon sequestration",
          "Wildlife habitat",
          "Soil conservation",
          "Air quality improvement"
        ],
        cultivation: [
          "Plant in suitable soil",
          "Ensure proper sunlight",
          "Regular maintenance",
          "Health monitoring"
        ],
        historical_significance: "Part of natural heritage",
        conservation_status: "Status monitored",
        fun_facts: [
          "Important for local ecosystem",
          "Provides multiple environmental benefits",
          "Contributes to biodiversity"
        ],
        care_guidelines: {
          watering: "Regular watering needed",
          pruning: "Annual maintenance",
          fertilization: "As needed",
          pest_management: "Regular monitoring"
        },
        ai_enhanced: true,
        is_fallback: true,
        data_source: "fallback_content",
        images: tree.images || {
          primary: "default-tree-image.jpg",
          all: []
        }
      };
    }
  }

  static parseAIResponse(response) {
    try {
      // First, try to find JSON-like content within the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonContent = jsonMatch[0];
        return JSON.parse(jsonContent);
      }

      // If no JSON found, return default structure
      return {
        characteristics: {},
        uses: {
          medicinal: [],
          commercial: [],
          cultural: [],
          ecological: []
        },
        environmental_benefits: [],
        cultivation: [],
        historical_significance: "",
        conservation_status: "",
        fun_facts: [],
        care_guidelines: {}
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        characteristics: {},
        uses: {
          medicinal: [],
          commercial: [],
          cultural: [],
          ecological: []
        },
        environmental_benefits: [],
        cultivation: [],
        historical_significance: "",
        conservation_status: "",
        fun_facts: [],
        care_guidelines: {}
      };
    }
  }
}

export default TreeEnrichmentService; 
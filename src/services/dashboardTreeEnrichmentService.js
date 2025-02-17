import axios from 'axios';

class DashboardTreeEnrichmentService {
    static async enrichDashboardTree(scientificName) {
        try {
            const prompt = `
                As a botanical expert, provide detailed information about the tree species "${scientificName}" in JSON format.
                Focus on providing accurate, detailed information for a tree dashboard display.
                Include common names (both English and local Hindi name), height details, growth characteristics,
                and environmental impact. Structure the response as follows:

                {
                    "common_names": {
                        "english": "Common English name",
                        "hindi": "Hindi name if available"
                    },
                    "characteristics": {
                        "height": {
                            "current": "Average current height in meters",
                            "potential": "Maximum potential height in meters"
                        },
                        "growth_rate": "Fast/Moderate/Slow with brief explanation",
                        "soil_preference": "Detailed soil requirements",
                        "water_needs": "Water requirement details"
                    },
                    "environmental_impact": {
                        "co2_absorption": "Annual CO2 absorption in kg",
                        "water_conservation": "Monthly water conservation in liters",
                        "wildlife_benefits": ["List of wildlife benefits"],
                        "ecological_benefits": ["List of ecological benefits"]
                    },
                    "care_details": {
                        "watering_schedule": "Detailed watering information",
                        "pruning_needs": "Pruning requirements",
                        "fertilization": "Fertilization recommendations",
                        "special_care": "Any special care instructions"
                    }
                }
            `;

            // Call Hugging Face API
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
                {
                    inputs: prompt,
                    parameters: {
                        max_length: 1000,
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

            const enrichedData = this.parseAIResponse(response.data[0].generated_text);
            return this.validateAndCleanData(enrichedData, scientificName);
        } catch (error) {
            console.error('Error enriching dashboard tree data:', error);
            return this.getFallbackData(scientificName);
        }
    }

    static parseAIResponse(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (error) {
            console.error('Error parsing AI response:', error);
            return null;
        }
    }

    static validateAndCleanData(data, scientificName) {
        console.log('Validating and cleaning data for:', scientificName);
        console.log('Raw data received:', data);

        if (!data) {
            console.log('No data received, using fallback data');
            return this.getFallbackData(scientificName);
        }

        // Log height data before processing
        console.log('Raw height data:', {
            current: data.characteristics?.height?.current,
            potential: data.characteristics?.height?.potential
        });

        const heightAverage = this.extractNumber(data.characteristics?.height?.current);
        const heightMaximum = this.extractNumber(data.characteristics?.height?.potential);

        console.log('Processed height numbers:', {
            average: heightAverage,
            maximum: heightMaximum
        });

        // Log growth rate before processing
        console.log('Raw growth rate:', data.characteristics?.growth_rate);
        const processedGrowthRate = this.determineGrowthRate(data.characteristics?.growth_rate);
        console.log('Processed growth rate:', processedGrowthRate);

        const cleanedData = {
            common_names: {
                english: data.common_names?.english || `${scientificName.split(' ')[0]} Tree`,
                hindi: data.common_names?.hindi || "स्थानीय नाम उपलब्ध नहीं"
            },
            characteristics: {
                height: {
                    average: heightAverage || "15",
                    maximum: heightMaximum || (heightAverage ? (parseInt(heightAverage) * 1.5).toString() : "30")
                },
                growth_rate: processedGrowthRate,
                soil_preference: data.characteristics?.soil_preference || "Well-draining, fertile soil with good organic content",
                water_needs: data.characteristics?.water_needs || "Regular watering, allowing soil to dry between waterings"
            },
            environmental_impact: {
                co2_absorption: data.environmental_impact?.co2_absorption || "52 kg per year",
                water_conservation: data.environmental_impact?.water_conservation || "150 liters per month",
                wildlife_benefits: data.environmental_impact?.wildlife_benefits || [
                    "Provides habitat for local birds",
                    "Supports beneficial insects",
                    "Shelter for small mammals"
                ],
                ecological_benefits: data.environmental_impact?.ecological_benefits || [
                    "Improves air quality",
                    "Reduces soil erosion",
                    "Enhances biodiversity",
                    "Creates microclimate"
                ]
            },
            care_details: {
                watering_schedule: data.care_details?.watering_schedule || "Water deeply once per week, adjust based on rainfall",
                pruning_needs: data.care_details?.pruning_needs || "Annual pruning in early spring to maintain shape and remove dead branches",
                fertilization: data.care_details?.fertilization || "Apply balanced fertilizer twice a year in spring and fall",
                special_care: data.care_details?.special_care || "Monitor for pests and diseases regularly, mulch around base"
            }
        };

        console.log('Final cleaned data:', {
            height: cleanedData.characteristics.height,
            growth_rate: cleanedData.characteristics.growth_rate
        });

        return cleanedData;
    }

    static extractNumber(value) {
        console.log('Extracting number from:', value);
        if (!value) {
            console.log('No value provided to extract number from');
            return null;
        }

        // Handle range format (e.g., "12-15" or "12 to 15")
        const rangeMatch = value.match(/(\d+)(?:[-\s]+to[\s-]+|[-\s]+)(\d+)/);
        if (rangeMatch) {
            const [_, first, second] = rangeMatch;
            // For ranges, use the average
            return Math.round((parseInt(first) + parseInt(second)) / 2).toString();
        }

        // Handle single numbers
        const singleMatch = value.match(/\d+/);
        if (singleMatch) {
            return singleMatch[0];
        }

        console.log('No valid number found in:', value);
        return null;
    }

    static determineGrowthRate(rate) {
        console.log('Determining growth rate from:', rate);
        if (!rate) {
            console.log('No growth rate provided, using default: Moderate');
            return "Moderate";
        }
        
        const lowerRate = rate.toLowerCase();
        console.log('Lowercase growth rate:', lowerRate);

        if (lowerRate.includes('fast')) {
            console.log('Detected fast growth rate');
            return "Fast";
        }
        if (lowerRate.includes('slow')) {
            console.log('Detected slow growth rate');
            return "Slow";
        }
        console.log('Using default growth rate: Moderate');
        return "Moderate";
    }

    static getFallbackData(scientificName) {
        return {
            common_names: {
                english: `${scientificName.split(' ')[0]} Tree`,
                hindi: "स्थानीय नाम उपलब्ध नहीं"
            },
            characteristics: {
                height: {
                    average: "15",
                    maximum: "30"
                },
                growth_rate: "Moderate",
                soil_preference: "Well-draining, fertile soil with good organic content",
                water_needs: "Regular watering, allowing soil to dry between waterings"
            },
            environmental_impact: {
                co2_absorption: "52 kg per year",
                water_conservation: "150 liters per month",
                wildlife_benefits: [
                    "Provides habitat for local birds",
                    "Supports beneficial insects",
                    "Shelter for small mammals"
                ],
                ecological_benefits: [
                    "Improves air quality",
                    "Reduces soil erosion",
                    "Enhances biodiversity",
                    "Creates microclimate"
                ]
            },
            care_details: {
                watering_schedule: "Water deeply once per week, adjust based on rainfall",
                pruning_needs: "Annual pruning in early spring to maintain shape and remove dead branches",
                fertilization: "Apply balanced fertilizer twice a year in spring and fall",
                special_care: "Monitor for pests and diseases regularly, mulch around base"
            }
        };
    }
}

export default DashboardTreeEnrichmentService; 
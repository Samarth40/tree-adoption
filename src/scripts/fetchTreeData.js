import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// USDA PLANTS Database API endpoint
const USDA_API = 'https://plants.usda.gov/api/plants/v1';
const USDA_IMAGE_BASE = 'https://plants.sc.egov.usda.gov/ImageLibrary/standard';

// Minimum image dimensions for verification
const MIN_IMAGE_WIDTH = 800;
const MIN_IMAGE_HEIGHT = 600;
const MAX_RETRIES = 3;
const BATCH_SIZE = 10;

// API endpoints
const TREFLE_API = 'https://trefle.io/api/v1';

// Load environment variables
dotenv.config();

// Common, well-documented tree species with USDA symbols and Trefle slugs
const TREE_SPECIES = [
  { scientific_name: "Quercus alba", common_name: "White Oak", symbol: "QUAL", trefle_slug: "quercus-alba" },
  { scientific_name: "Acer saccharum", common_name: "Sugar Maple", symbol: "ACSA3", trefle_slug: "acer-saccharum" },
  { scientific_name: "Pinus strobus", common_name: "Eastern White Pine", symbol: "PIST", trefle_slug: "pinus-strobus" },
  { scientific_name: "Betula papyrifera", common_name: "Paper Birch", symbol: "BEPA", trefle_slug: "betula-papyrifera" },
  { scientific_name: "Fagus grandifolia", common_name: "American Beech", symbol: "FAGR", trefle_slug: "fagus-grandifolia" }
];

async function fetchTrefleData(slug) {
  try {
    const response = await axios.get(`${TREFLE_API}/species/${slug}?token=${process.env.TREFLE_TOKEN}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching Trefle data for ${slug}:`, error.message);
    return null;
  }
}

async function getUSDAImages(symbol) {
  const imageTypes = ['flower', 'habit', 'leaf', 'fruit'];
  const images = [];

  for (const type of imageTypes) {
    const imageUrl = `${USDA_IMAGE_BASE}/${symbol}_${type}.jpg`;
    try {
      const response = await axios.head(imageUrl);
      if (response.status === 200) {
        images.push(imageUrl);
      }
    } catch (error) {
      // Image doesn't exist, skip
      continue;
    }
  }

  return images;
}

async function fetchTreeData(limit = 5) {
  try {
    console.log('🌳 Starting tree data collection...');
    const trees = [];
    const totalTrees = Math.min(TREE_SPECIES.length, limit);

    for (let i = 0; i < totalTrees; i++) {
      const baseTree = TREE_SPECIES[i];
      const progress = ((i / totalTrees) * 100).toFixed(1);
      
      try {
        console.log(`\n🌳 [${progress}%] Processing ${baseTree.scientific_name} (${i + 1}/${totalTrees})`);

        // Fetch Trefle data
        const trefleData = await fetchTrefleData(baseTree.trefle_slug);
        if (!trefleData) {
          console.log(`⚠️ No Trefle data found for ${baseTree.scientific_name}, skipping...`);
          continue;
        }

        // Fetch USDA images
        const images = await getUSDAImages(baseTree.symbol);
        if (images.length === 0) {
          console.log(`⚠️ No USDA images found for ${baseTree.scientific_name}, skipping...`);
          continue;
        }

        const treeData = {
          scientific_name: trefleData.scientific_name,
          common_names: {
            english: baseTree.common_name,
            local: trefleData.common_names?.eng?.join(', ') || ''
          },
          family: trefleData.family,
          genus: trefleData.genus,
          distribution: trefleData.distributions?.native?.map(d => d.name) || [],
          habitat: {
            soil_texture: trefleData.growth?.soil_texture || [],
            light: trefleData.growth?.light || null,
            atmospheric_humidity: trefleData.growth?.atmospheric_humidity || null,
            minimum_temperature: trefleData.growth?.minimum_temperature?.deg_c,
            maximum_temperature: trefleData.growth?.maximum_temperature?.deg_c
          },
          characteristics: {
            height: {
              average: Math.round(trefleData.specifications?.average_height?.cm / 100) || null,
              maximum: Math.round(trefleData.specifications?.maximum_height?.cm / 100) || null
            },
            spread: {
              average: Math.round(trefleData.specifications?.average_spread?.cm / 100) || null,
              maximum: Math.round(trefleData.specifications?.maximum_spread?.cm / 100) || null
            },
            growth_rate: trefleData.growth?.growth_rate || null,
            growth_months: trefleData.growth?.growth_months || [],
            leaf_retention: trefleData.growth?.leaf_retention || null,
            leaf_color: trefleData.growth?.leaf_color || null,
            flower_color: trefleData.flower?.color || null,
            bloom_months: trefleData.growth?.bloom_months || []
          },
          uses: {
            commercial: trefleData.uses?.commercial || [],
            medicinal: trefleData.uses?.medicinal || [],
            cultural: trefleData.uses?.cultural || [],
            edible: trefleData.edible || false,
            edible_parts: trefleData.edible_part || []
          },
          images: {
            primary: images[0],
            flower: images.find(img => img.includes('flower')),
            habit: images.find(img => img.includes('habit')),
            leaf: images.find(img => img.includes('leaf')),
            fruit: images.find(img => img.includes('fruit'))
          },
          description: trefleData.main_species?.description || trefleData.description || null,
          metadata: {
            last_updated: new Date().toISOString(),
            usda_symbol: baseTree.symbol,
            trefle_slug: baseTree.trefle_slug,
            sources: {
              trefle: `https://trefle.io/api/v1/species/${baseTree.trefle_slug}`,
              usda: `https://plants.usda.gov/home/plantProfile?symbol=${baseTree.symbol}`
            }
          }
        };

        trees.push(treeData);
        console.log(`✅ Added ${baseTree.scientific_name} with ${images.length} images`);

        // Save progress every 5 trees
        if ((i + 1) % 5 === 0) {
          await saveProgress(trees, false, i + 1);
        }

      } catch (error) {
        console.error(`❌ Error processing ${baseTree.scientific_name}:`, error.message);
        continue;
      }

      // Delay between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Save final results
    await saveProgress(trees, true);
    
    console.log(`\n🎉 Successfully collected data for ${trees.length} trees!`);
    console.log('📁 Final data saved to indianTreeData.json');
    
    return trees;

  } catch (error) {
    console.error('❌ Error in main process:', error);
    throw error;
  }
}

async function saveProgress(trees, isFinal = false, processedCount = 0) {
  const fileName = isFinal ? 'indianTreeData.json' : `indianTreeData_temp_${processedCount}.json`;
  const filePath = path.join(__dirname, '..', 'data', fileName);
  await fs.writeFile(filePath, JSON.stringify(trees, null, 2));
  
  if (!isFinal) {
    console.log(`💾 Progress saved: ${processedCount} trees processed`);
  }
}

// Execute the script
fetchTreeData(5)  // Start with 5 trees as a test
  .then(() => console.log('✨ Script completed successfully'))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }); 
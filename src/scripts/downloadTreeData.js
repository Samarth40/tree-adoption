import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GBIF API endpoint
const GBIF_API = 'https://api.gbif.org/v1';
const BATCH_SIZE = 100; // Number of trees to process in each batch
const TOTAL_TREES = 2000;

async function fetchTreeList() {
  console.log('🔍 Fetching list of tree species...');
  const trees = [];
  let offset = 0;

  while (trees.length < TOTAL_TREES) {
    try {
      const response = await axios.get(
        `${GBIF_API}/species/search?rank=SPECIES&highertaxonKey=7707728&status=ACCEPTED&limit=100&offset=${offset}`
      );

      const newTrees = response.data.results
        .filter(species => species.taxonomicStatus === 'ACCEPTED')
        .map(species => ({
          name: species.scientificName,
          key: species.key
        }));

      trees.push(...newTrees);
      offset += 100;

      console.log(`📋 Found ${trees.length} species so far...`);
      
      if (response.data.endOfRecords) break;
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching tree list:', error.message);
      break;
    }
  }

  return trees.slice(0, TOTAL_TREES);
}

async function fetchSpeciesData(speciesKey) {
  try {
    const detailResponse = await axios.get(`${GBIF_API}/species/${speciesKey}`);
    return detailResponse.data;
  } catch (error) {
    console.error(`Error fetching data for species ${speciesKey}:`, error.message);
    return null;
  }
}

async function fetchSpeciesImages(scientificName) {
  try {
    const response = await axios.get(
      `${GBIF_API}/occurrence/search?scientificName=${encodeURIComponent(scientificName)}&mediaType=StillImage&limit=5`
    );
    return response.data.results
      .filter(result => result.media?.[0]?.identifier)
      .map(result => ({
        url: result.media[0].identifier,
        license: result.media[0].license,
        rightsHolder: result.media[0].rightsHolder
      }));
  } catch (error) {
    console.error(`Error fetching images for ${scientificName}:`, error.message);
    return [];
  }
}

async function processBatch(trees, startIndex, batchSize) {
  const batch = trees.slice(startIndex, startIndex + batchSize);
  const processedTrees = [];

  for (const [index, tree] of batch.entries()) {
    const progress = ((startIndex + index + 1) / TOTAL_TREES * 100).toFixed(1);
    console.log(`\n📥 [${progress}%] Processing ${tree.name} (${startIndex + index + 1}/${TOTAL_TREES})`);
    
    const speciesData = await fetchSpeciesData(tree.key);
    if (!speciesData) {
      console.log(`⚠️ No data found for ${tree.name}, skipping...`);
      continue;
    }

    const images = await fetchSpeciesImages(tree.name);
    
    const processedTree = {
      scientific_name: tree.name,
      common_names: {
        english: speciesData.vernacularNames?.find(n => n.language === 'eng')?.vernacularName || '',
        local: speciesData.vernacularNames?.find(n => n.language === 'hin')?.vernacularName || ''
      },
      family: speciesData.family,
      genus: speciesData.genus,
      distribution: speciesData.distributions || [],
      habitat: {
        soil_texture: [],
        light: null,
        atmospheric_humidity: null,
        minimum_temperature: null,
        maximum_temperature: null
      },
      characteristics: {
        height: {
          average: null,
          maximum: null
        },
        spread: {
          average: null,
          maximum: null
        },
        growth_rate: null,
        growth_months: [],
        leaf_retention: null,
        leaf_color: null,
        flower_color: [],
        bloom_months: []
      },
      uses: {
        commercial: [],
        medicinal: [],
        cultural: [],
        edible: false,
        edible_parts: []
      },
      images: {
        primary: images[0]?.url || null,
        all: images.map(img => ({
          url: img.url,
          license: img.license,
          rightsHolder: img.rightsHolder
        }))
      },
      description: speciesData.descriptions?.[0]?.description || null,
      metadata: {
        last_updated: new Date().toISOString(),
        gbif_id: tree.key,
        sources: {
          gbif: `https://www.gbif.org/species/${tree.key}`
        }
      }
    };

    processedTrees.push(processedTree);
    console.log(`✅ Successfully processed ${tree.name}`);
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return processedTrees;
}

async function saveProgress(trees, isFinal = false, processedCount = 0) {
  const fileName = isFinal ? 'treeData.json' : `treeData_temp_${processedCount}.json`;
  const filePath = path.join(__dirname, '..', 'data', fileName);
  await fs.writeFile(filePath, JSON.stringify(trees, null, 2));
  
  if (!isFinal) {
    console.log(`💾 Progress saved: ${processedCount} trees processed`);
  }
}

async function downloadTrees() {
  console.log('🌳 Starting tree data download...');
  
  // Get list of trees
  const treeList = await fetchTreeList();
  console.log(`📋 Found ${treeList.length} tree species`);

  const allTrees = [];
  
  // Process trees in batches
  for (let i = 0; i < treeList.length; i += BATCH_SIZE) {
    const processedBatch = await processBatch(treeList, i, BATCH_SIZE);
    allTrees.push(...processedBatch);
    
    // Save progress after each batch
    await saveProgress(allTrees, false, allTrees.length);
  }

  // Save final results
  await saveProgress(allTrees, true);
  
  console.log(`\n🎉 Successfully downloaded data for ${allTrees.length} trees!`);
  console.log('📁 Final data saved to treeData.json');
  
  return allTrees;
}

// Execute the script
downloadTrees()
  .then(() => console.log('✨ Download completed successfully'))
  .catch(error => {
    console.error('💥 Download failed:', error);
    process.exit(1);
  }); 
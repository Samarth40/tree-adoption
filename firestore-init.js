import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Collection initialization functions
async function initializeCollections() {
  try {
    // Initialize Users Collection with enhanced fields
    const usersCollection = db.collection('users');
    await usersCollection.doc('sample_user').set({
      email: 'sample@example.com',
      displayName: 'Sample User',
      avatarUrl: 'https://example.com/avatar.jpg',
      treesPlanted: 1,
      impact: {
        co2Absorbed: 52, // in kg (matching the single Neem tree's absorption rate)
        waterConserved: 150, // in liters (matching the single Neem tree's conservation rate)
        wildlifeSupported: 3 // number of species (matching the single Neem tree's wildlife support)
      },
      achievements: ['first_tree'], // Remove eco_warrior since user only has one tree
      joinDate: FieldValue.serverTimestamp(),
      lastActive: FieldValue.serverTimestamp(),
      isAdmin: false,
      isProfileComplete: true,
      location: {
        city: 'Delhi', // Match the tree's location
        country: 'India',
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090
        }
      }
    });

    // Initialize Trees Collection with one detailed sample
    const treesCollection = db.collection('trees');
    await treesCollection.doc('neem_tree_01').set({
      species: {
        scientific_name: 'Azadirachta indica',
        common_name: 'Neem',
        family: 'Meliaceae',
        local_names: {
          hindi: 'नीम',
          sanskrit: 'अरिष्ट',
          tamil: 'வேம்பு'
        }
      },
      characteristics: {
        height: {
          current: 12,
          potential: 35
        },
        age: 3,
        growth_rate: 'Fast',
        native_to: ['India', 'Bangladesh', 'Nepal', 'Sri Lanka'],
        environmental_benefits: {
          co2_absorption_rate: 52, // kg per year
          water_conservation: 150, // liters per month
          wildlife_support: true,
          air_purification: 'High',
          soil_improvement: 'Excellent'
        },
        seasonal_changes: {
          spring: 'New leaves and flowering',
          summer: 'Dense foliage',
          monsoon: 'Maximum growth',
          winter: 'Moderate growth'
        }
      },
      care_requirements: {
        water_needs: 'Low to Moderate',
        sunlight: 'Full Sun',
        soil_type: 'Well-draining, All types',
        maintenance_frequency: 'Monthly',
        pruning_schedule: 'Yearly',
        fertilizer_needs: 'Minimal',
        disease_resistance: 'High'
      },
      cultural_significance: {
        medicinal_uses: [
          'Natural antiseptic',
          'Skin care',
          'Dental hygiene',
          'Immune system booster'
        ],
        traditional_uses: [
          'Ayurvedic medicine',
          'Natural pesticide',
          'Air purification',
          'Sacred tree in many cultures'
        ]
      },
      status: 'available',
      health_metrics: {
        overall_health: 'Excellent',
        last_inspection: FieldValue.serverTimestamp(),
        growth_progress: 85, // percentage
        leaf_density: 'High',
        pest_resistance: 'Strong'
      },
      location: {
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090
        },
        address: 'Community Garden, Delhi',
        area: 'Central Park',
        soil_conditions: 'Rich loamy soil',
        planting_date: FieldValue.serverTimestamp()
      },
      images: {
        main: 'https://example.com/neem-tree-main.jpg',
        seasonal: {
          spring: 'https://example.com/neem-spring.jpg',
          summer: 'https://example.com/neem-summer.jpg',
          monsoon: 'https://example.com/neem-monsoon.jpg',
          winter: 'https://example.com/neem-winter.jpg'
        }
      },
      created_at: FieldValue.serverTimestamp(),
      last_updated: FieldValue.serverTimestamp()
    });

    // Update adoption to reference the new tree
    const adoptionsCollection = db.collection('adoptions');
    await adoptionsCollection.doc('sample_adoption').set({
      userId: 'sample_user',
      treeId: 'neem_tree_01',
      status: 'active',
      adoptionDate: FieldValue.serverTimestamp(),
      lastMaintenance: FieldValue.serverTimestamp(),
      healthStatus: 'excellent',
      maintenanceSchedule: [
        {
          type: 'watering',
          frequency: 'weekly',
          nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          instructions: 'Water deeply but infrequently to encourage deep root growth'
        },
        {
          type: 'pruning',
          frequency: 'quarterly',
          nextDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          instructions: 'Remove dead or crossing branches to maintain shape'
        },
        {
          type: 'health_check',
          frequency: 'monthly',
          nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          instructions: 'Check for pest infestations and disease symptoms'
        }
      ],
      impactMetrics: {
        co2Absorbed: 52,
        waterConserved: 150,
        wildlifeSupported: 3,
        airQualityImprovement: 'High',
        biodiversityContribution: 'Moderate'
      },
      adoptionJourney: {
        milestones: ['First Growth Spurt', 'First Flowering', 'First Year Complete'],
        nextMilestone: 'Canopy Development',
        growthProgress: 85
      }
    });

    // Update maintenance to reference the new tree
    const maintenanceCollection = db.collection('maintenance');
    await maintenanceCollection.doc('sample_maintenance').set({
      adoptionId: 'sample_adoption',
      treeId: 'neem_tree_01',
      userId: 'sample_user',
      type: 'health_check',
      date: FieldValue.serverTimestamp(),
      notes: 'Tree showing excellent growth. New leaves developing well.',
      healthStatus: 'excellent',
      vitalSigns: {
        leafColor: 'Deep Green',
        soilMoisture: 'Adequate',
        pestPresence: 'None',
        newGrowth: 'Visible'
      },
      images: [],
      recommendations: [
        'Continue regular watering schedule',
        'Monitor for seasonal changes',
        'Prepare for upcoming flowering season'
      ],
      nextScheduledDate: FieldValue.serverTimestamp()
    });

    // Initialize Impact Collection
    const impactCollection = db.collection('impact');
    await impactCollection.doc('global_impact').set({
      totalTrees: 1,
      totalCO2Absorbed: 52, // kg (from one Neem tree)
      totalWaterConserved: 150, // liters (from one Neem tree)
      totalWildlifeSupported: 3,
      lastUpdated: FieldValue.serverTimestamp(),
      monthlyStats: {
        [new Date().toISOString().slice(0, 7)]: {
          treesPlanted: 1,
          co2Absorbed: 52,
          waterConserved: 150,
          wildlifeSupported: 3
        }
      }
    });

    // Initialize Achievements Collection
    const achievementsCollection = db.collection('achievements');
    await achievementsCollection.doc('first_tree').set({
      title: 'First Tree Guardian',
      description: 'Adopted your first tree',
      requirement: 1,
      icon: '🌱',
      xpPoints: 100
    });

    // Initialize Activities Collection
    const activitiesCollection = db.collection('activities');
    await activitiesCollection.doc('sample_activity').set({
      userId: 'sample_user',
      type: 'tree_adoption',
      details: {
        treeId: 'neem_tree_01',
        action: 'adopted'
      },
      timestamp: FieldValue.serverTimestamp()
    });
    
    console.log('Successfully initialized all collections!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing collections:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeCollections(); 
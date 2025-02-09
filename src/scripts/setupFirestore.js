const { initializeApp } = require('firebase/app');
const { 
  getFirestore,
  collection, 
  addDoc, 
  serverTimestamp 
} = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initial data for collections
const initialData = {
  users: [
    {
      displayName: "Demo User",
      email: "demo@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      treesPlanted: 5,
      impact: 250,
      isProfileComplete: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ],
  stories: [
    {
      title: "My First Tree Planting Experience",
      content: "Today I planted my first tree in the community garden. It was an amazing experience!",
      imageUrl: "https://images.unsplash.com/photo-1588449668365-d15e397f6787",
      userId: "demo-user",
      userDisplayName: "Demo User",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      likes: 0,
      comments: [],
      likedBy: [],
      createdAt: serverTimestamp()
    }
  ],
  events: [
    {
      title: "Community Tree Planting Day",
      description: "Join us for a day of tree planting in the city park. All tools will be provided!",
      date: new Date("2024-05-01"),
      location: "City Park",
      maxParticipants: 50,
      participantCount: 0,
      participants: [],
      status: "upcoming",
      userId: "demo-user",
      userDisplayName: "Demo User",
      createdAt: serverTimestamp()
    }
  ],
  discussions: [
    {
      title: "Best practices for tree care",
      content: "What are your tips for taking care of newly planted trees?",
      userId: "demo-user",
      userDisplayName: "Demo User",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      tags: ["tree care", "tips", "beginners"],
      replyCount: 0,
      views: 0,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    }
  ]
};

// Function to create collections
const setupFirestoreCollections = async () => {
  try {
    // Create each collection and add initial data
    for (const [collectionName, documents] of Object.entries(initialData)) {
      const collectionRef = collection(db, collectionName);
      
      for (const doc of documents) {
        await addDoc(collectionRef, doc);
        console.log(`Added document to ${collectionName}`);
      }
    }
    
    console.log('Successfully set up all collections!');
  } catch (error) {
    console.error('Error setting up collections:', error);
    throw error;
  }
};

// Run the setup
setupFirestoreCollections(); 
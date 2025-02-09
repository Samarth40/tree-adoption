import { setupFirestoreCollections } from './setupFirestore';

const initializeFirestore = async () => {
  try {
    console.log('Starting Firestore initialization...');
    await setupFirestoreCollections();
    console.log('Firestore initialization completed successfully!');
  } catch (error) {
    console.error('Error during Firestore initialization:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeFirestore(); 
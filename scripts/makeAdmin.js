import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Function to make a user an admin
async function makeUserAdmin(email) {
  try {
    // Get user by email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log('No user found with email:', email);
      process.exit(1);
    }

    // Update the first matching user document
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      isAdmin: true,
      updatedAt: new Date().toISOString()
    });

    console.log(`Successfully made user ${email} an admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error making user admin:', error);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log('Please provide an email address');
  console.log('Usage: node makeAdmin.js user@example.com');
  process.exit(1);
}

makeUserAdmin(email); 
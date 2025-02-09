const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Function to make a user an admin
async function makeUserAdmin(email) {
  try {
    // Get user by email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log('No user found with that email');
      process.exit(1);
    }

    // Update the first matching user document
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      isAdmin: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
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
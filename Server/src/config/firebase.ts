import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // or use admin.credential.cert(serviceAccount)
});

export default admin;

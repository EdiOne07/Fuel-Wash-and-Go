// import { auth } from '../firebase/firebaseconfig';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// export const registerUser = async (email: string, username: string, location: string, password: string) => {
//   // Create a user in Firebase
//   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//   const firebaseUid = userCredential.user.uid;

//   // Send user data to backend
//   const response = await fetch('http://localhost:3000/api/register', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${await userCredential.user.getIdToken()}`,
//     },
//     body: JSON.stringify({
//       email,
//       username,
//       location,
//     }),
//   });

//   if (!response.ok) {
//     const data = await response.json();
//     throw new Error(data.error || 'Failed to register user');
//   }

//   return response.json();
// };

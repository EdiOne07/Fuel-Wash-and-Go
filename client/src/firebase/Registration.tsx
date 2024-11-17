// // src/components/Register.tsx
// import React, { useState } from 'react';
// import { auth } from '../firebase/firebaseconfig'
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// const Register: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [location, setLocation] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleRegister = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setError('');

//     try {
//       // Create user with Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const firebaseUid = userCredential.user.uid;

//       // Send user data to your backend API
//       const response = await fetch('http://localhost:3000/api/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${await userCredential.user.getIdToken()}`,
//         },
//         body: JSON.stringify({
//           email,
//           username,
//           location,
//         }),
//       });

//       if (!response.ok) {
//         const { error } = await response.json();
//         throw new Error(error || 'Failed to register user');
//       }

//       alert('User registered successfully');
//     } catch (error: any) {
//       setError(error.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <div>
//           <label>Email:</label>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         </div>
//         <div>
//           <label>Username:</label>
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         </div>
//         <div>
//           <label>Location:</label>
//           <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <button type="submit">Register</button>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default Register;

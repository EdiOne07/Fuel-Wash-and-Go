// // src/GoogleLoginButton.tsx
// import React from 'react';
// import { useGoogleLogin } from '@react-oauth/google';
// import { auth } from './firebaseconfig'
// import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

// export const GoogleLoginButton: React.FC = () => {
//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       const credential = GoogleAuthProvider.credential(tokenResponse.id_token);
//       try {
//         await signInWithCredential(auth, credential);
//         console.log('User signed in successfully');
//       } catch (error) {
//         console.error('Error signing in with credential:', error);
//       }
//     },
//     onError: () => {
//       console.error('Login Failed');
//     },
//   });

//   return (
//     <button onClick={() => login()}>
//       Sign in with Google
//     </button>
//   );
// };

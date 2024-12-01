
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA_sCYLNGzVrgZBSL4mvmBYCtuW4Wb7Seo",
  authDomain: "fuelwashandgo.firebaseapp.com",
  projectId: "fuelwashandgo",
  storageBucket: "fuelwashandgo.firebasestorage.app",
  messagingSenderId: "577138600679",
  appId: "1:577138600679:web:2e6acad504dcacd5749042",
  measurementId: "G-E3G0TQRBGR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const googleProvider=new GoogleAuthProvider();

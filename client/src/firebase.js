// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-9c244.firebaseapp.com",
  projectId: "mern-estate-9c244",
  storageBucket: "mern-estate-9c244.firebasestorage.app",
  messagingSenderId: "425702968543",
  appId: "1:425702968543:web:337ba3a5deacb748876d6a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
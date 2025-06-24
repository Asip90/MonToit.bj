// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3kX4ndjOTpGpKltmm6MNAJfVlImpt3es",
  authDomain: "chezmoiapi.firebaseapp.com",
  projectId: "chezmoiapi",
  storageBucket: "chezmoiapi.firebasestorage.app",
  messagingSenderId: "907776089211",
  appId: "1:907776089211:web:b6b0acd519d1fb644bd6de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//  persistance avec AsyncStorage

const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);
// const auth = getAuth(app); // Pas de persistence native, mais fonctionne dans Expo Go
// export default auth;

export  {auth , db, storage}; 

// Success! Your new application key has been created. It will only appear here once.

// keyID:
// 005676d32bdf3a90000000001
// keyName:
// ReactNativeApp
// applicationKey:
// K0055NOaOic2r9VnTedr2MM07kgBryA


///cloudinary 
//name:dfpxwlhu0
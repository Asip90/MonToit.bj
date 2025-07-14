// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import { getAuth } from "firebase/auth";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA3kX4ndjOTpGpKltmm6MNAJfVlImpt3es",
//   authDomain: "chezmoiapi.firebaseapp.com",
//   projectId: "chezmoiapi",
//   storageBucket: "chezmoiapi.firebasestorage.app",
//   messagingSenderId: "907776089211",
//   appId: "1:907776089211:web:b6b0acd519d1fb644bd6de"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);


// //  persistance avec AsyncStorage

// const auth = getAuth(app)
// const db = getFirestore(app);
// const storage = getStorage(app);
// // const auth = getAuth(app); // Pas de persistence native, mais fonctionne dans Expo Go
// // export default auth;

// export  {auth , db, storage}; 

// // Success! Your new application key has been created. It will only appear here once.

// // keyID:
// // 005676d32bdf3a90000000001
// // keyName:
// // ReactNativeApp
// // applicationKey:
// // K0055NOaOic2r9VnTedr2MM07kgBryA


// ///cloudinary 
// //name:dfpxwlhu0


// Import des fonctions Firebase
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import { initializeApp } from 'firebase/app';
// import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// // Configuration Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyA3kX4ndjOTpGpKltmm6MNAJfVlImpt3es",
//   authDomain: "chezmoiapi.firebaseapp.com",
//   projectId: "chezmoiapi",
//   storageBucket: "chezmoiapi.appspot.com",
//   messagingSenderId: "907776089211",
//   appId: "1:907776089211:web:b6b0acd519d1fb644bd6de"
// };
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);

// const auth = getAuth(app);

// // Configuration manuelle de la persistance
// (async () => {
//   try {
//     await setPersistence(auth, {
//       type: 'local',
//       async getItem(key) {
//         return await AsyncStorage.getItem(key);
//       },
//       async setItem(key, value) {
//         return await AsyncStorage.setItem(key, value);
//       },
//       async removeItem(key) {
//         return await AsyncStorage.removeItem(key);
//       }
//     });
//   } catch (error) {
//     console.error('Persistence setup failed:', error);
//   }
// })();



// export { auth, db, storage };
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyA3kX4ndjOTpGpKltmm6MNAJfVlImpt3es",
//   authDomain: "chezmoiapi.firebaseapp.com",
//   projectId: "chezmoiapi",
//   storageBucket: "chezmoiapi.appspot.com",
//   messagingSenderId: "907776089211",
//   appId: "1:907776089211:web:b6b0acd519d1fb644bd6de"
// };

// // Initialisation
// const app = initializeApp(firebaseConfig);

// // Solution simplifiée et stable
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// // Configuration manuelle de la persistance
// (async () => {
//   try {
//     await auth._setPersistence({
//       type: 'LOCAL',
//       async getItem(key) {
//         return await AsyncStorage.getItem(key);
//       },
//       async setItem(key, value) {
//         return await AsyncStorage.setItem(key, value);
//       },
//       async removeItem(key) {
//         return await AsyncStorage.removeItem(key);
//       }
//     });
//     console.log("Persistence configured successfully");
//   } catch (error) {
//     console.warn("Persistence setup warning:", error.message);
//   }
// })();

// export { auth, db, storage };

// import { initializeApp } from 'firebase/app';
// import { initializeAuth, getReactNativePersistence } from '@firebase/auth'
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Configuration Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyA3kX4ndjOTpGpKltmm6MNAJfVlImpt3es",
//   authDomain: "chezmoiapi.firebaseapp.com",
//   projectId: "chezmoiapi",
//   storageBucket: "chezmoiapi.appspot.com",
//   messagingSenderId: "907776089211",
//   appId: "1:907776089211:web:b6b0acd519d1fb644bd6de"
// };

// // Initialisation de l'application
// const app = initializeApp(firebaseConfig);

// // ✅ Auth avec persistance officielle
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// // Firestore et Storage
// const db = getFirestore(app);
// const storage = getStorage(app);

// export { auth, db, storage };
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

import { getAuth } from 'firebase/auth'; // Utilisé pour web
import { initializeAuth, getReactNativePersistence } from '@firebase/auth'; // Pour mobile uniquement
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3kX4ndjOTpGpKltmm6MNAJfVlImpt3es",
  authDomain: "chezmoiapi.firebaseapp.com",
  projectId: "chezmoiapi",
  storageBucket: "chezmoiapi.appspot.com",
  messagingSenderId: "907776089211",
  appId: "1:907776089211:web:b6b0acd519d1fb644bd6de"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// ✅ Adapter Auth selon la plateforme
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app); // Web : pas besoin de persistence personnalisée
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

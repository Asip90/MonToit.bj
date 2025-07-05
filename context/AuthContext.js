// //  context/AuthContext.js (ou UserProvider.js)
// import React, { createContext, useState, useEffect } from 'react';
// import { auth, db } from '../src/api/FirebaseConfig'; // Tes instances Firebase
// // import { onAuthStateChanged, signOut } from 'firebase/auth'; // signOut est pour la déconnexion
// import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
// import { doc, getDoc } from 'firebase/firestore';
// import { Alert } from 'react-native'; // Pour les alertes

// export const UserContext = createContext(null); // Exporte le contexte

// export const UserProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null); // Pour les données de Firestore (users/{uid}) + uid, email, etc.
//   const [userLoading, setUserLoading] = useState(true); // True tant que l'état initial n'est pas connu

//   useEffect(() => {
//     console.log("UserProvider: Abo. onAuthStateChanged");
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       // firebaseUser est l'objet utilisateur de Firebase Auth, ou null
//       console.log("UserProvider: onAuthStateChanged -> firebaseUser:", firebaseUser ? firebaseUser.uid : null);
//       // setUserLoading(true); // Pas besoin de le remettre à true ici, il est déjà true initialement
//                            // et on le met à false dans le finally.

//       try {
//         if (firebaseUser) {
//           // Utilisateur connecté avec Firebase Auth
//           const userDocRef = doc(db, 'users', firebaseUser.uid);
//           const userDocSnap = await getDoc(userDocRef);

//           let newUserDataProfile;
//           if (userDocSnap.exists()) {
//             newUserDataProfile = { uid: firebaseUser.uid, email: firebaseUser.email, ...userDocSnap.data() };
//             console.log("UserProvider: Données Firestore trouvées:", newUserDataProfile);
//           } else {
//             // Si le document n'existe pas dans Firestore, utilise les infos de Firebase Auth
//             // et peut-être un nom par défaut. Tu pourrais vouloir créer le document ici.
//             console.warn(`UserProvider: Doc. utilisateur non trouvé pour ${firebaseUser.uid}. Utilisation des données d'auth.`);
//             newUserDataProfile = {
//               uid: firebaseUser.uid,
//               email: firebaseUser.email,
//               userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Nouvel Utilisateur', // Fallback
//               photoURL: firebaseUser.photoURL || null,
//               // Ajoute d'autres champs par défaut que tes écrans pourraient attendre
//               name: firebaseUser.displayName?.split(' ')[0] || '',
//               surname: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
//             };
//           }
//           // Mise à jour de l'état seulement si les données ont réellement changé
//           setUserData(prevData => {
//             if (JSON.stringify(prevData) !== JSON.stringify(newUserDataProfile)) {
//               return newUserDataProfile;
//             }
//             return prevData;
//           });

//         } else {
//           // Utilisateur déconnecté
//           console.log("UserProvider: Utilisateur déconnecté, setUserData à null.");
//           setUserData(null);
//         }
//       } catch (error) {
//         console.error('UserProvider: Erreur dans onAuthStateChanged (récupération Firestore):', error);
//         setUserData(null); // En cas d'erreur, s'assurer que l'état est propre
//       } finally {
//         console.log("UserProvider: onAuthStateChanged - setUserLoading(false)");
//         setUserLoading(false); // L'état initial est maintenant connu
//       }
//     });

//     return () => {
//       console.log("UserProvider: Nettoyage onAuthStateChanged.");
//       unsubscribe();
//     };
//   }, []); // Dépendances vides: s'exécute une fois au montage

//   const logoutUser = async () => {
//     console.log("UserProvider: Tentative de déconnexion...");
//     // setUserLoading(true); // Optionnel ici, car onAuthStateChanged va gérer le loading
//     try {
//       await signOut(auth); // Déconnecte de Firebase Auth
//       // onAuthStateChanged sera appelé automatiquement avec firebaseUser = null,
      
//       console.log("UserProvider: signOut de Firebase Auth réussi.");
//       return true; // Indique le succès
//     } catch (error) {
//       console.error("UserProvider: Erreur lors de signOut Firebase Auth:", error);
//       Alert.alert("Erreur de Déconnexion", "Impossible de se déconnecter. Veuillez réessayer.");
//       return false; // Indique l'échec
//     }
//     // finally {
//     //   setUserLoading(false); // Géré par onAuthStateChanged
//     // }
//   };

//   // Fonction pour que EditProfileScreen puisse mettre à jour le contexte
//   // après une modification réussie du profil dans Firestore.
//   const setUserDataInContext = (updatedFirestoreData) => {
//     if (userData) { // S'assure qu'il y a un utilisateur à mettre à jour
//         const newContextData = { ...userData, ...updatedFirestoreData };
//         setUserData(prevData => {
//             if (JSON.stringify(prevData) !== JSON.stringify(newContextData)) {
//                 console.log("UserProvider: setUserDataInContext AVEC NOUVELLES DONNÉES", newContextData);
//                 return newContextData;
//             }
//             console.log("UserProvider: setUserDataInContext - données inchangées.");
//             return prevData;
//         });
//     }
//   };

//   // Les valeurs que le contexte va fournir à ses enfants
//   const contextValue = {
//     userData,
//     userLoading,
//     logoutUser, // On fournit la fonction logoutUser
//     setUserDataInContext // On fournit la fonction pour mettre à jour le contexte
//   };

//   console.log("UserProvider: Rendu. userData:", userData ? userData.uid : null, "userLoading:", userLoading);

//   return (
//     <UserContext.Provider value={contextValue}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// import React, { createContext, useState, useEffect, useCallback } from 'react';
// import { getAuth, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { Alert } from 'react-native';
// import { db } from '../src/api/FirebaseConfig'; // Assurez-vous que le chemin est correct
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null);
//   const [userLoading, setUserLoading] = useState(true);
//   const auth = getAuth();

//   // Configurer la persistance locale
//   useEffect(() => {
//     const configurePersistence = async () => {
//       try {
//         await setPersistence(auth, browserLocalPersistence);
//         console.log("Persistance locale configurée avec succès");
//       } catch (error) {
//         console.error("Erreur configuration persistance:", error);
//       }
//     };
//     configurePersistence();
//   }, [auth]);

//   // Charger les données utilisateur depuis le stockage local au démarrage
//   const loadCachedUserData = useCallback(async () => {
//     try {
//       const cachedUser = await AsyncStorage.getItem('cachedUserData');
//       if (cachedUser) {
//         const parsedUser = JSON.parse(cachedUser);
//         setUserData(parsedUser);
//         console.log("Données utilisateur chargées depuis le cache");
//       }
//     } catch (error) {
//       console.error("Erreur lecture cache utilisateur:", error);
//     }
//   }, []);

//   // Sauvegarder les données utilisateur dans le stockage local
//   const cacheUserData = useCallback(async (data) => {
//     try {
//       if (data) {
//         await AsyncStorage.setItem('cachedUserData', JSON.stringify(data));
//         console.log("Données utilisateur sauvegardées dans le cache");
//       } else {
//         await AsyncStorage.removeItem('cachedUserData');
//         console.log("Cache utilisateur nettoyé");
//       }
//     } catch (error) {
//       console.error("Erreur sauvegarde cache utilisateur:", error);
//     }
//   }, []);

//   // Gérer l'état d'authentification
//   useEffect(() => {
//     let unsubscribe;

//     const handleAuthStateChange = async (firebaseUser) => {
//       console.log("Changement état auth:", firebaseUser?.uid || "null");
      
//       try {
//         if (firebaseUser) {
//           // Récupérer les données supplémentaires depuis Firestore
//           const userDocRef = doc(db, 'users', firebaseUser.uid);
//           const userDocSnap = await getDoc(userDocRef);

//           const userProfile = {
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//             ...(userDocSnap.exists() ? userDocSnap.data() : {
//               userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Utilisateur',
//               name: firebaseUser.displayName?.split(' ')[0] || '',
//               surname: firebaseUser.displayName?.slice(1).join(' ') || '',
//               photoURL: firebaseUser.photoURL || null
//             })
//           };

//           setUserData(userProfile);
//           await cacheUserData(userProfile);
//         } else {
//           setUserData(null);
//           await cacheUserData(null);
//         }
//       } catch (error) {
//         console.error("Erreur traitement changement auth:", error);
//         setUserData(null);
//         await cacheUserData(null);
//       } finally {
//         if (userLoading) setUserLoading(false);
//       }
//     };

//     const initAuth = async () => {
//       await loadCachedUserData();
//       unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
//     };

//     initAuth();

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//   }, [auth, cacheUserData, loadCachedUserData, userLoading]);

//   // Déconnexion
//   const logoutUser = useCallback(async () => {
//     try {
//       await signOut(auth);
//       return true;
//     } catch (error) {
//       console.error("Erreur déconnexion:", error);
//       Alert.alert("Erreur", "La déconnexion a échoué");
//       return false;
//     }
//   }, [auth]);

//   // Mise à jour des données utilisateur
//   const updateUserData = useCallback(async (updatedData) => {
//     if (!userData) return;

//     const newUserData = { ...userData, ...updatedData };
//     setUserData(newUserData);
//     await cacheUserData(newUserData);
//   }, [userData, cacheUserData]);

//   // Valeur du contexte
//   const contextValue = {
//     userData,
//     userLoading,
//     logoutUser,
//     updateUserData
//   };

//   return (
//     <UserContext.Provider value={contextValue}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// import React, { createContext, useState, useEffect, useCallback } from 'react';
// import { getAuth, onAuthStateChanged, signOut, setPersistence, inMemoryPersistence, initializeAuth } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { Alert } from 'react-native';
// import { db, app } from '../src/api/FirebaseConfig';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as firebaseAuth from 'firebase/auth';

// export const UserContext = createContext(null);

// const reactNativePersistence = {
//   type: 'reactNative',
//   async setItem(key, value) {
//     try {
//       await AsyncStorage.setItem(key, value);
//     } catch (error) {
//       console.error("Error saving to AsyncStorage:", error);
//     }
//   },
//   async getItem(key) {
//     try {
//       return await AsyncStorage.getItem(key);
//     } catch (error) {
//       console.error("Error reading from AsyncStorage:", error);
//       return null;
//     }
//   },
//   async removeItem(key) {
//     try {
//       await AsyncStorage.removeItem(key);
//     } catch (error) {
//       console.error("Error removing from AsyncStorage:", error);
//     }
//   }
// };

// export const UserProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null);
//   const [userLoading, setUserLoading] = useState(true);
//   const [auth, setAuth] = useState(null);

//   // Initialisation de l'authentification avec persistance
//  useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, (user) => {
//     if (user) {
//       // Charger les données utilisateur
//     } else {
//       setUserData(null);
//     }
//     setUserLoading(false);
//   });
//   return () => unsubscribe();
// }, [auth]);

//   // Charger les données utilisateur depuis le cache
//   const loadCachedUserData = useCallback(async () => {
//     try {
//       const cachedUser = await AsyncStorage.getItem('cachedUserData');
//       if (cachedUser) {
//         const parsedUser = JSON.parse(cachedUser);
//         setUserData(parsedUser);
//         console.log("User data loaded from cache");
//       }
//     } catch (error) {
//       console.error("Error reading user cache:", error);
//     }
//   }, []);

//   // Sauvegarder les données utilisateur
//   const cacheUserData = useCallback(async (data) => {
//     try {
//       if (data) {
//         await AsyncStorage.setItem('cachedUserData', JSON.stringify(data));
//         console.log("User data saved to cache");
//       } else {
//         await AsyncStorage.removeItem('cachedUserData');
//         console.log("User cache cleared");
//       }
//     } catch (error) {
//       console.error("Error saving user cache:", error);
//     }
//   }, []);

//   // Gérer les changements d'état d'authentification
//   useEffect(() => {
//     if (!auth) return;

//     let unsubscribe;

//     const handleAuthStateChange = async (firebaseUser) => {
//       console.log("Auth state changed:", firebaseUser?.uid || "null");
      
//       try {
//         if (firebaseUser) {
//           // Récupérer les données supplémentaires depuis Firestore
//           const userDocRef = doc(db, 'users', firebaseUser.uid);
//           const userDocSnap = await getDoc(userDocRef);

//           const userProfile = {
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//             emailVerified: firebaseUser.emailVerified,
//             ...(userDocSnap.exists() ? userDocSnap.data() : {
//               userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Utilisateur',
//               name: firebaseUser.displayName?.split(' ')[0] || '',
//               surname: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
//               photoURL: firebaseUser.photoURL || null
//             })
//           };

//           setUserData(userProfile);
//           await cacheUserData(userProfile);
//         } else {
//           setUserData(null);
//           await cacheUserData(null);
//         }
//       } catch (error) {
//         console.error("Error processing auth change:", error);
//         setUserData(null);
//         await cacheUserData(null);
//       } finally {
//         if (userLoading) setUserLoading(false);
//       }
//     };

//     const initAuth = async () => {
//       await loadCachedUserData();
//       unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
//     };

//     initAuth();

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//   }, [auth, cacheUserData, loadCachedUserData, userLoading]);

//   // Déconnexion
//   const logoutUser = useCallback(async () => {
//     if (!auth) return false;

//     try {
//       await signOut(auth);
//       return true;
//     } catch (error) {
//       console.error("Logout error:", error);
//       Alert.alert("Erreur", "La déconnexion a échoué");
//       return false;
//     }
//   }, [auth]);

//   // Mise à jour des données utilisateur
//   const updateUserData = useCallback(async (updatedData) => {
//     if (!userData) return;

//     const newUserData = { ...userData, ...updatedData };
//     setUserData(newUserData);
//     await cacheUserData(newUserData);
//   }, [userData, cacheUserData]);

//   // Valeur du contexte
//   const contextValue = {
//     userData,
//     userLoading,
//     auth,
//     logoutUser,
//     updateUserData
//   };

//   return (
//     <UserContext.Provider value={contextValue}>
//       {children}
//     </UserContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { db, auth } from '../src/api/FirebaseConfig'; // Importez auth depuis votre config
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Gestion de l'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          const userProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            ...(userDocSnap.exists() ? userDocSnap.data() : {
              userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Utilisateur',
              name: firebaseUser.displayName?.split(' ')[0] || '',
              surname: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              photoURL: firebaseUser.photoURL || null
            })
          };

          setUserData(userProfile);
          await AsyncStorage.setItem('@last_user', JSON.stringify({
            uid: firebaseUser.uid,
            lastLogin: new Date().toISOString()
          }));
        } else {
          setUserData(null);
          await AsyncStorage.removeItem('@last_user');
        }
      } catch (error) {
        console.error("Auth error:", error);
        setUserData(null);
      } finally {
        setUserLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Déconnexion
  const logoutUser = useCallback(async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Erreur", error.message);
      return false;
    }
  }, []);

  // Valeur du contexte
  const contextValue = {
    userData,
    userLoading,
    auth, // Maintenant stable car importé depuis FirebaseConfig
    logoutUser,
    updateUserData: async (newData) => {
      setUserData(prev => ({ ...prev, ...newData }));
    }
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
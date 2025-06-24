//  context/AuthContext.js (ou UserProvider.js)
import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../src/api/FirebaseConfig'; // Tes instances Firebase
// import { onAuthStateChanged, signOut } from 'firebase/auth'; // signOut est pour la déconnexion
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native'; // Pour les alertes

export const UserContext = createContext(null); // Exporte le contexte

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Pour les données de Firestore (users/{uid}) + uid, email, etc.
  const [userLoading, setUserLoading] = useState(true); // True tant que l'état initial n'est pas connu

  useEffect(() => {
    console.log("UserProvider: Abo. onAuthStateChanged");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // firebaseUser est l'objet utilisateur de Firebase Auth, ou null
      console.log("UserProvider: onAuthStateChanged -> firebaseUser:", firebaseUser ? firebaseUser.uid : null);
      // setUserLoading(true); // Pas besoin de le remettre à true ici, il est déjà true initialement
                           // et on le met à false dans le finally.

      try {
        if (firebaseUser) {
          // Utilisateur connecté avec Firebase Auth
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let newUserDataProfile;
          if (userDocSnap.exists()) {
            newUserDataProfile = { uid: firebaseUser.uid, email: firebaseUser.email, ...userDocSnap.data() };
            console.log("UserProvider: Données Firestore trouvées:", newUserDataProfile);
          } else {
            // Si le document n'existe pas dans Firestore, utilise les infos de Firebase Auth
            // et peut-être un nom par défaut. Tu pourrais vouloir créer le document ici.
            console.warn(`UserProvider: Doc. utilisateur non trouvé pour ${firebaseUser.uid}. Utilisation des données d'auth.`);
            newUserDataProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Nouvel Utilisateur', // Fallback
              photoURL: firebaseUser.photoURL || null,
              // Ajoute d'autres champs par défaut que tes écrans pourraient attendre
              name: firebaseUser.displayName?.split(' ')[0] || '',
              surname: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
            };
          }
          // Mise à jour de l'état seulement si les données ont réellement changé
          setUserData(prevData => {
            if (JSON.stringify(prevData) !== JSON.stringify(newUserDataProfile)) {
              return newUserDataProfile;
            }
            return prevData;
          });

        } else {
          // Utilisateur déconnecté
          console.log("UserProvider: Utilisateur déconnecté, setUserData à null.");
          setUserData(null);
        }
      } catch (error) {
        console.error('UserProvider: Erreur dans onAuthStateChanged (récupération Firestore):', error);
        setUserData(null); // En cas d'erreur, s'assurer que l'état est propre
      } finally {
        console.log("UserProvider: onAuthStateChanged - setUserLoading(false)");
        setUserLoading(false); // L'état initial est maintenant connu
      }
    });

    return () => {
      console.log("UserProvider: Nettoyage onAuthStateChanged.");
      unsubscribe();
    };
  }, []); // Dépendances vides: s'exécute une fois au montage

  const logoutUser = async () => {
    console.log("UserProvider: Tentative de déconnexion...");
    // setUserLoading(true); // Optionnel ici, car onAuthStateChanged va gérer le loading
    try {
      await signOut(auth); // Déconnecte de Firebase Auth
      // onAuthStateChanged sera appelé automatiquement avec firebaseUser = null,
      
      console.log("UserProvider: signOut de Firebase Auth réussi.");
      return true; // Indique le succès
    } catch (error) {
      console.error("UserProvider: Erreur lors de signOut Firebase Auth:", error);
      Alert.alert("Erreur de Déconnexion", "Impossible de se déconnecter. Veuillez réessayer.");
      return false; // Indique l'échec
    }
    // finally {
    //   setUserLoading(false); // Géré par onAuthStateChanged
    // }
  };

  // Fonction pour que EditProfileScreen puisse mettre à jour le contexte
  // après une modification réussie du profil dans Firestore.
  const setUserDataInContext = (updatedFirestoreData) => {
    if (userData) { // S'assure qu'il y a un utilisateur à mettre à jour
        const newContextData = { ...userData, ...updatedFirestoreData };
        setUserData(prevData => {
            if (JSON.stringify(prevData) !== JSON.stringify(newContextData)) {
                console.log("UserProvider: setUserDataInContext AVEC NOUVELLES DONNÉES", newContextData);
                return newContextData;
            }
            console.log("UserProvider: setUserDataInContext - données inchangées.");
            return prevData;
        });
    }
  };

  // Les valeurs que le contexte va fournir à ses enfants
  const contextValue = {
    userData,
    userLoading,
    logoutUser, // On fournit la fonction logoutUser
    setUserDataInContext // On fournit la fonction pour mettre à jour le contexte
  };

  console.log("UserProvider: Rendu. userData:", userData ? userData.uid : null, "userLoading:", userLoading);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// context/AuthContext.js

// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { auth, db } from '../src/api/FirebaseConfig';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { Alert } from 'react-native';

// // 1. On garde le nom UserContext, mais on ne l'exportera plus directement
// const UserContext = createContext(null);

// // 2. Le Provider reste le même
// export const AuthProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null);
//   const [userLoading, setUserLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       try {
//         if (firebaseUser) {
//           const userDocRef = doc(db, 'users', firebaseUser.uid);
//           const userDocSnap = await getDoc(userDocRef);
          
//           let profileData;
//           if (userDocSnap.exists()) {
//             profileData = { uid: firebaseUser.uid, email: firebaseUser.email, ...userDocSnap.data() };
//           } else {
//             profileData = {
//               uid: firebaseUser.uid,
//               email: firebaseUser.email,
//               userName: firebaseUser.displayName || 'Nouvel Utilisateur',
//             };
//           }
//           setUserData(profileData);
//         } else {
//           setUserData(null);
//         }
//       } catch (error) {
//         console.error('Erreur dans AuthContext:', error);
//         setUserData(null);
//       } finally {
//         setUserLoading(false);
//       }
//     });

//     return unsubscribe;
//   }, []);

//   const logoutUser = async () => {
//     try {
//       await signOut(auth);
//       return true;
//     } catch (error) {
//       Alert.alert("Erreur", "Impossible de se déconnecter.");
//       return false;
//     }
//   };

//   // ... votre fonction setUserDataInContext est parfaite ...

//   const contextValue = {
//     user: userData,
//     loading: userLoading,
//     isAuthenticated: !!userData, // On ajoute ce booléen très pratique !
//     logout: logoutUser,
//     // setUserDataInContext, // Décommentez si vous l'utilisez
//   };

//   return (
//     <UserContext.Provider value={contextValue}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// 3. On crée et on exporte un HOOK PERSONNALISÉ
// C'est la meilleure façon de consommer le contexte dans vos composants.
// export const useAuth = () => {
//   return useContext(UserContext);
// };
// import 'react-native-gesture-handler';
// import { registerRootComponent } from 'expo';
// import React, { useState } from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

// import AuthStack from './navigation/AuthStack';
// import DrawerNavigator from './navigation/DrawerNavigator';
// import CustomHeader from './components/navigation/CustomHeader';

// const App = () => {
//   // Remplacez cette logique par votre système d'authentification (ex: via un Context)
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
// const handleLoginSuccess = () => {
//     console.log("Message reçu ! On fait entrer l'utilisateur.");
//     setIsAuthenticated(true);
//   };
//    const handleLogout = () => {
//       setIsAuthenticated(false);
//   }
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         {/* {isAuthenticated ? <DrawerNavigator /> : <AuthStack />} */}
//         {/* <DrawerNavigator /> */}
//         {/* <CustomHeader/> */}
      
//       {isAuthenticated ? 
//           // Si on est connecté, on passe la fonction de déconnexion au DrawerNavigator
//           <DrawerNavigator onLogout={handleLogout} /> 
//           :
//        <AuthStack onLoginSuccess={handleLoginSuccess} />
//         }
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// };
// export default App ;
// // Créez un nouveau fichier, par exemple `navigation/RootNavigator.js`

// // App.js (version finale et très simple)

// // import 'react-native-gesture-handler';
// // import { registerRootComponent } from 'expo';
// // import React from 'react';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // import { AuthProvider } from './context/AuthContext';
// // import RootNavigator from './navigation/RootNavigator'; // Importez le nouveau composant

// // const App = () => {
// //   return (
// //     <SafeAreaProvider>
// //       <AuthProvider>
// //         <RootNavigator />
// //       </AuthProvider>
// //     </SafeAreaProvider>
// //   );
// // };

// // export default App ;

// App.js

// import 'react-native-gesture-handler';
// import { registerRootComponent } from 'expo';
// import React, { useState, useEffect } from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './src/api/FirebaseConfig'; // Assurez-vous que ce chemin est bon
// import { UserProvider } from './context/AuthContext'; // Importer le contexte d'authentification
// import AuthStack from './navigation/AuthStack';
// import DrawerNavigator from './navigation/DrawerNavigator';
// import { View, ActivityIndicator } from 'react-native'; // Pour un écran de chargement

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true); // On commence par charger

//   // C'est la caméra de surveillance !
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       // Cette fonction est appelée automatiquement par Firebase
//       // chaque fois que quelqu'un se connecte ou se déconnecte.

//       if (user) {
//         // Un utilisateur est connecté !
//         setIsAuthenticated(true);
//       } else {
//         // Personne n'est connecté.
//         setIsAuthenticated(false);
//       }
//       setIsLoading(false); // On a fini de vérifier, on peut arrêter de charger
//     });

//     // On éteint la caméra quand l'application se ferme
//     return unsubscribe;
//   }, []); // Le [] vide signifie : "Allume la caméra une seule fois au démarrage"

//   // Si on est en train de vérifier, on affiche un spinner
//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaProvider>
     
//       <NavigationContainer>
//          <UserProvider>
//          <View style={{ flex: 1 , paddingTop: 20 }}>
//           {isAuthenticated ? <DrawerNavigator /> : <AuthStack />}
//         </View>
//       </UserProvider>
       
        
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// };

// export default App
// import 'react-native-gesture-handler';
// import { registerRootComponent } from 'expo';
// import React, { useState, useEffect } from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './src/api/FirebaseConfig';
// import { UserProvider } from './context/AuthContext';
// import AuthStack from './navigation/AuthStack';
// import DrawerNavigator from './navigation/DrawerNavigator';
// import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
// import { useFonts } from '@expo-google-fonts/inter';
// import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [fontsLoaded] = useFonts({
//     InterRegular: Inter_400Regular,
//     InterMedium: Inter_500Medium,
//     InterSemiBold: Inter_600SemiBold,
//     InterBold: Inter_700Bold,
//   });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setIsAuthenticated(!!user);
//       setIsLoading(false);
//     });
//     return unsubscribe;
//   }, []);

//   if (isLoading || !fontsLoaded) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2bb673" />
//         <Text style={styles.loadingText}>Chargement...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <UserProvider>
//           <View style={styles.appContainer}>
//             {isAuthenticated ? <DrawerNavigator /> : <AuthStack />}
//           </View>
//         </UserProvider>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//   },
//   loadingText: {
//     marginTop: 15,
//     fontFamily: 'InterMedium',
//     fontSize: 16,
//     color: '#2bb673',
//   },
//   appContainer: {
//     flex: 1,
//     paddingTop: 15,
//     marginTop: 15,
//     backgroundColor: '#f8f8f8',
//   },
// });

// export default App
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/api/FirebaseConfig';
import { UserProvider } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import DrawerNavigator from './navigation/DrawerNavigator';
import { View, ActivityIndicator, StyleSheet, StatusBar, Platform } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    InterRegular: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
  });
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading || !fontsLoaded) {
    return (
      <View style={[
        styles.loadingContainer,
        { paddingTop: insets.top }
      ]}>
        <ActivityIndicator size="large" color="#2bb673" />
      </View>
    );
  }

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#2bb673" // Couleur verte de Zameen
      />
      <View style={[
        styles.appContainer,
        { 
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right
        }
      ]}>
        {isAuthenticated ? <DrawerNavigator /> : <AuthStack />}
      {/* <DrawerNavigator /> */}
      </View>
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#0000',
  },
});

export default App;
// ```

// ### Principales améliorations :

// 1. **Intégration de la police Inter** :
//    - Installation via `@expo-google-fonts/inter`
//    - Chargement asynchrone des polices
//    - 4 variantes de poids disponibles

// 2. **Styles optimisés** :
//    - Arrière-plan cohérent avec Zameen (#f8f8f8)
//    - Couleur verte caractéristique (#2bb673)
//    - Gestion propre des états de chargement

// 3. **Structure maintenue** :
//    - Même logique d'authentification
//    - Même architecture de navigation
//    - Compatibilité totale avec vos stacks existantes

// 4. **Affichage amélioré** :
//    - Écran de chargement stylisé
//    - Texte pendant le chargement
//    - Indicateur d'activité vert

// ### Pour compléter l'intégration :

// 1. Dans vos composants enfants, utilisez désormais :
// ```jsx
// <Text style={{ fontFamily: 'InterSemiBold' }}>Titre important</Text>
// <Text style={{ fontFamily: 'InterRegular' }}>Texte normal</Text>
// ```

// 2. Pour une cohérence totale, ajoutez cette configuration dans votre `theme.js` si vous utilisez React Navigation :
// ```jsx
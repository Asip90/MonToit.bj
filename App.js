
// import 'react-native-gesture-handler';
// import { registerRootComponent } from 'expo';
// import React, { useState, useEffect } from 'react';
// import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './src/api/FirebaseConfig';
// import { UserProvider } from './context/AuthContext';
// import AuthStack from './navigation/AuthStack';
// import DrawerNavigator from './navigation/DrawerNavigator';
// import { View, ActivityIndicator, StyleSheet, StatusBar, Platform } from 'react-native';
// import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
// import { COLORS } from './constants/Theme';
// import * as Updates from 'expo-updates';

// const checkForUpdates = async () => {
//   try {
//     const update = await Updates.checkForUpdateAsync();
//     if (update.isAvailable) {
//       await Updates.fetchUpdateAsync();
//       await Updates.reloadAsync();
//     }
//   } catch (e) {
//     console.log("Erreur update", e);
//   }
// };

// // Appelez cette fonction au lancement ou via un bouton

// const AppContent = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [fontsLoaded] = useFonts({
//     InterRegular: Inter_400Regular,
//     InterMedium: Inter_500Medium,
//     InterSemiBold: Inter_600SemiBold,
//     InterBold: Inter_700Bold,
//   });
//   const insets = useSafeAreaInsets();
  
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setIsAuthenticated(!!user);
//       setIsLoading(false);
//     });
//     return unsubscribe;
//   }, []);
//   checkForUpdates;
  
//   if (isLoading || !fontsLoaded) {
//     return (
//       <View style={[
//         styles.loadingContainer,
//         { paddingTop: insets.top }
//       ]}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   return (
//     <>
//       <StatusBar 
//         barStyle="light-content" 
//         backgroundColor="#2bb673" // Couleur verte de Zameen
//       />
//       <View style={[
//         styles.appContainer,
//         { 
//           paddingTop: insets.top,
//           paddingBottom: insets.bottom,
//           paddingLeft: insets.left,
//           paddingRight: insets.right
//         }
//       ]}>
        
//         {isAuthenticated ? <DrawerNavigator /> : <AuthStack />}
//       {/* <DrawerNavigator /> */}
//       </View>
//     </>
//   );
// };

// const App = () => {
  
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <UserProvider>
//           <AppContent />
//         </UserProvider>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//   },
//   appContainer: {
//     flex: 1,
//     backgroundColor: '#0000',
//   },
// });

// export default App;

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  StatusBar, 
  Text,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import { auth } from './src/api/FirebaseConfig';
import { UserProvider } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import DrawerNavigator from './navigation/DrawerNavigator';
import { useFonts } from '@expo-google-fonts/inter';
import { COLORS } from './constants/Theme';
import * as Updates from 'expo-updates';
import { Ionicons } from '@expo/vector-icons';
import { useAutoUpdate } from './hook/useAutoUpdate'; // Hook pour la mise à jour automatique
const AppContent = () => {
  const [state, setState] = useState({
    isAuthenticated: false,
    isLoading: true,
    networkError: false
  });

  const insets = useSafeAreaInsets();
  
  const [fontsLoaded] = useFonts({
    InterRegular: require('./assets/fonts/Inter_18pt-Regular.ttf'),
    InterMedium: require('./assets/fonts/Inter_18pt-Medium.ttf'),
    InterSemiBold: require('./assets/fonts/Inter_18pt-SemiBold.ttf'),
    InterBold: require('./assets/fonts/Inter_18pt-Bold.ttf'),
  });

//   useEffect(() => {
//     // Vérification réseau
//     const unsubscribeNetInfo = NetInfo.addEventListener(state => {
//       setState(prev => ({
//         ...prev,
//         networkError: !state.isConnected
//       }));
//     });
//      if (!__DEV__) {
//   try {
//      const update = async () => { await Updates.checkForUpdateAsync();
//     if (update.isAvailable) {
//       await Updates.fetchUpdateAsync();
//       await Updates.reloadAsync();
//     }
//   }} catch (e) {
//     console.error("Erreur de mise à jour:", e);
//   }
// }


//     // Vérification auth + mises à jour
//     const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
//       // if (!__DEV__) {
//       //   try {
//       //     const update = await Updates.checkForUpdateAsync();
//       //     if (update.isAvailable) {
//       //       await Updates.fetchUpdateAsync();
//       //       await Updates.reloadAsync();
//       //     }
//       //   } catch (e) {
//       //     console.error("Erreur de mise à jour:", e);
//       //   }
//       // }
      
//       setState({
//         isAuthenticated: !!user,
//         isLoading: false,
//         networkError: false
//       });
//     });

//     // Nettoyage
//     return () => {
//       unsubscribeNetInfo();
//       unsubscribeAuth();
//     };
//   }, []);

  // Vérification automatique du réseau toutes les 5s si offline
  useEffect(() => {
  // 1. Vérification réseau
  const unsubscribeNetInfo = NetInfo.addEventListener(state => {
    setState(prev => ({
      ...prev,
      networkError: !state.isConnected
    }));
  });

  // 2. Mise à jour OTA au démarrage
  if (!__DEV__) {
    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.error("Erreur de mise à jour OTA :", e);
      }
    })();
  }

  // 3. Auth Firebase
  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    setState({
      isAuthenticated: !!user,
      isLoading: false,
      networkError: false
    });
  });

  // 4. Nettoyage
  return () => {
    unsubscribeNetInfo();
    unsubscribeAuth();
  };
}, []);

  
  useEffect(() => {
    if (!state.networkError) return;
    
    const interval = setInterval(() => {
      NetInfo.fetch().then(networkState => {
        if (networkState.isConnected) {
          setState(prev => ({...prev, networkError: false }));
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [state.networkError]);

 const { status, progress } = useAutoUpdate();

if (state.isLoading || !fontsLoaded || status !== 'done') {
  let message = 'Chargement de MonToit.bj...';
  if (status === 'checking') message = 'Vérification des mises à jour...';
  else if (status === 'downloading') message = `Téléchargement de la mise à jour (${progress}%)...`;
  else if (status === 'reloading') message = 'Redémarrage de l’application...';
  else if (status === 'error') message = 'Erreur lors de la mise à jour.';

  return (
    <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}


  if (state.networkError) {
    return (
      <View style={[styles.offlineContainer, { paddingTop: insets.top }]}>
        <Ionicons name="wifi-off" size={50} color={COLORS.darkGray} />
        <Text style={styles.offlineText}>
          Oups! Pas de connexion internet.{'\n'}
          Vérifiez vos données mobiles ou WiFi.
        </Text>
        
        <TouchableOpacity 
          style={styles.offlineButton}
          onPress={() => NetInfo.fetch().then(networkState => {
            setState(prev => ({...prev, networkError: !networkState.isConnected }));
          })}
        >
          <Text style={styles.offlineButtonText}>RÉESSAYER</Text>
        </TouchableOpacity>

        <Text style={styles.contactText}>
          Besoin d'aide ? Appelez le {'\n'}
          <Text style={styles.contactNumber}>+229 XX XX XX XX</Text>
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.primary} 
      />
      <View style={[
        styles.appContainer,
        { 
          paddingTop: insets.top,
          paddingBottom: insets.bottom 
        }
      ]}>
        {state.isAuthenticated ? (
          <DrawerNavigator />
        ) : (
          <AuthStack />
        )}
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
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 15,
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: COLORS.primary,
  },
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 30,
  },
  offlineText: {
    marginTop: 20,
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    fontFamily: 'InterMedium',
    lineHeight: 24,
  },
  offlineButton: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  offlineButtonText: {
    color: COLORS.white,
    fontFamily: 'InterSemiBold',
    fontSize: 15,
  },
  contactText: {
    marginTop: 40,
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactNumber: {
    color: COLORS.primary,
    fontFamily: 'InterBold',
  },
});

export default App;
// // // navigation/DrawerNavigator.js

// // import React from 'react';
// // import { createDrawerNavigator } from '@react-navigation/drawer';
// // import { Ionicons } from '@expo/vector-icons';

// // // Importer le Stack principal qui contient les onglets et les autres écrans
// // import MainStack from './MainStack'; 

// // // Importer les écrans accessibles depuis le menu
// // import MyListingsScreen from '../screens/drawer/MyListingScreen';
// // import SettingsScreen from '../screens/drawer/SettingScreen';
// // import HelpScreen from '../screens/drawer/HelpScreen';

// // // Importer nos constantes
// // import { COLORS } from '../constants/Colors';

// // const Drawer = createDrawerNavigator();

// // export default function DrawerNavigator() {
// //   return (
// //     <Drawer.Navigator
// //       screenOptions={{
// //         headerShown: false, // Tous nos headers sont dans le MainStack
// //         drawerActiveTintColor: COLORS.primary, // Couleur du texte de l'élément actif
// //         drawerInactiveTintColor: COLORS.textSecondary, // Couleur du texte des éléments inactifs
// //         drawerLabelStyle: {
// //           marginLeft: -25, // Aligne le texte avec l'icône
// //           fontSize: 15,
// //         },
// //       }}
// //     >
// //       {/* L'écran principal de l'application */}
// //       <Drawer.Screen
// //         name="Accueil"
// //         component={MainStack}
// //         options={{
// //           drawerIcon: ({ color }) => (
// //             <Ionicons name="home-outline" size={22} color={color} />
// //           ),
// //         }}
// //       />
      
// //       {/* Les autres liens du menu */}
// //       <Drawer.Screen
// //         name="Mes Annonces"
// //         component={MyListingsScreen}
// //         options={{
// //           drawerIcon: ({ color }) => (
// //             <Ionicons name="list-outline" size={22} color={color} />
// //           ),
// //           // On réactive un header ici si cet écran n'est pas dans le MainStack
// //           // et qu'on veut qu'il en ait un.
// //           headerShown: true, 
// //           headerTitle: 'Mes Annonces',
// //         }}
// //       />

// //       <Drawer.Screen
// //         name="Paramètres"
// //         component={SettingsScreen}
// //         options={{
// //           drawerIcon: ({ color }) => (
// //             <Ionicons name="settings-outline" size={22} color={color} />
// //           ),
// //           headerShown: true,
// //           headerTitle: 'Paramètres',
// //         }}
// //       />

// //       <Drawer.Screen
// //         name="Aide et Support"
// //         component={HelpScreen}
// //         options={{
// //           drawerIcon: ({ color }) => (
// //             <Ionicons name="help-buoy-outline" size={22} color={color} />
// //           ),
// //           headerShown: true,
// //           headerTitle: 'Aide & Support',
// //         }}
// //       />

// //       {/* Pour la déconnexion, il est souvent préférable d'ajouter un composant personnalisé
// //           dans le drawerContent qui gère cette logique, mais pour commencer, un écran
// //           qui se déconnecte immédiatement est une option. */}

// //     </Drawer.Navigator>
// //   );
// // }

// import React from 'react';
// import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
// import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
// import {useContext} from 'react';
// // Screens
// import MainStack from './MainStack';
// import MyListingsScreen from '../screens/drawer/MyListingScreen';
// import SettingsScreen from '../screens/drawer/SettingScreen';
// import HelpScreen from '../screens/drawer/HelpScreen';
// import { UserContext } from '../context/AuthContext'; 
// import { Alert } from 'react-native';
//   // ... (tes autres états et fonctions) ...


// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
//   const { userData, logoutUser } = useContext(UserContext);

//   const handleLogout = () => {
//     Alert.alert(
//       "Déconnexion",
//       "Êtes-vous sûr de vouloir vous déconnecter ?",
//       [
//         { text: "Annuler", style: "cancel" },
//         {
//           text: "Se Déconnecter",
//           onPress: async () => { // Garde async ici
//             if (logoutUser && typeof logoutUser === 'function') { // Vérifie que logoutUser est une fonction
//               console.log("SettingsScreen: Appel de logoutUser...");
//               const success = await logoutUser(); // Attend la fin de la déconnexion
//               if (success) {
//                 console.log("SettingsScreen: Déconnexion réussie (confirmée par le contexte).");
//                 // La redirection devrait être automatique grâce à Routes.js
//                 // Si tu as besoin de forcer une navigation spécifique après la déconnexion (rarement nécessaire avec cette structure) :
//                 // navigation.dispatch(
//                 //   CommonActions.reset({
//                 //     index: 0,
//                 //     routes: [{ name: 'AuthStackName' }], // Le nom de ton Stack d'authentification dans Routes.js
//                 //   })
//                 // );
//               } else {
//                 // L'alerte d'erreur est déjà gérée dans logoutUser du contexte.
//                 console.log("SettingsScreen: La déconnexion a échoué (signalé par le contexte).");
//               }
//             } else {
//               console.error("SettingsScreen: logoutUser n'est pas une fonction ou n'est pas disponible dans le contexte.");
//               Alert.alert("Erreur", "La fonction de déconnexion n'est pas disponible.");
//             }
//           },
//           style: "destructive",
//         },
//       ]
//     );
//   };
//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
//       {/* Header du drawer */}
//       <View style={styles.drawerHeader}>
//         <TouchableOpacity style={styles.closeButton} onPress={() => props.navigation.closeDrawer()}>
//           <Ionicons name="close" size={28} color="#555" />
//         </TouchableOpacity>
        
//         <View style={styles.profileContainer}>
//           <Image 
//             source={require('../assets/images/default-profile.jpg')} 
//             style={styles.profileImage}
//           />
//           <View style={styles.profileText}>
//             <Text style={styles.profileName}>John Doe</Text>
//             <Text style={styles.profileEmail}>john.doe@example.com</Text>
//           </View>
//         </View>
        
//         <TouchableOpacity style={styles.editProfileButton}>
//           <Text style={styles.editProfileText}>Modifier le profil</Text>
//         </TouchableOpacity>
//       </View>
      
//       {/* Section principale */}
//       <View style={styles.mainDrawerSection}>
//         <DrawerItemList {...props} />
        
//         {/* Section supplémentaire */}
//         <TouchableOpacity style={styles.drawerItem}>
//           <View style={styles.drawerIconContainer}>
//             <MaterialIcons name="payment" size={22} color="#2bb673" />
//           </View>
//           <Text style={styles.drawerLabel}>Paiements</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.drawerItem}>
//           <View style={styles.drawerIconContainer}>
//             <MaterialCommunityIcons name="star-circle-outline" size={22} color="#2bb673" />
//           </View>
//           <Text style={styles.drawerLabel}>Évaluer l'application</Text>
//         </TouchableOpacity>
//       </View>
      
//       {/* Footer du drawer */}
//       <View style={styles.drawerFooter}>
//         <TouchableOpacity onPress={handleLogout}  style={styles.logoutButton}>
//           <FontAwesome name="sign-out" size={20} color="#e74c3c" />
//           <Text style={styles.logoutText}>Déconnexion</Text>
//         </TouchableOpacity>
        
//         <View style={styles.appInfo}>
//           <Text style={styles.appVersion}>Version 1.0.0</Text>
//           <Text style={styles.appCopyright}>© 2023 MonToit.bj</Text>
//         </View>
//       </View>
//     </DrawerContentScrollView>
//   );
// };

// export default function AppDrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         drawerType: 'front',
//         overlayColor: 'rgba(0,0,0,0.2)',
//         drawerStyle: styles.drawer,
//         sceneContainerStyle: styles.sceneContainer,
//         headerShown: false,
//         swipeEdgeWidth: 50,
//       }}
//     >
//       <Drawer.Screen
//         name="Accueil"
//         component={MainStack}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={22} color="#2bb673" />
//           ),
//           drawerLabel: 'Accueil',
//           drawerLabelStyle: styles.drawerLabel,
//         }}
//       />
      
//       <Drawer.Screen
//         name="Mes Annonces"
//         component={MyListingsScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="format-list-bulleted" size={22} color="#2bb673" />
//           ),
//           drawerLabel: 'Mes Annonces',
//           drawerLabelStyle: styles.drawerLabel,
//         }}
//       />
      
//       <Drawer.Screen
//         name="Paramètres"
//         component={SettingsScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="settings-outline" size={22} color="#2bb673" />
//           ),
//           drawerLabel: 'Paramètres',
//           drawerLabelStyle: styles.drawerLabel,
//         }}
//       />
      
//       <Drawer.Screen
//         name="Aide & Support"
//         component={HelpScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialCommunityIcons name="help-circle-outline" size={22} color="#2bb673" />
//           ),
//           drawerLabel: 'Aide & Support',
//           drawerLabelStyle: styles.drawerLabel,
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   sceneContainer: {
//     backgroundColor: 'white',
//   },
//   drawerContainer: {
//     flex: 1,
//     paddingTop: 0,
//   },
//   drawer: {
//     width: '85%',
//     backgroundColor: 'white',
//     flex: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 2, height: 0 },
//     shadowOpacity: 0.15,
//     shadowRadius: 15,
//     elevation: 10,
//   },
//   drawerHeader: {
//     padding: 20,
//     paddingTop: 50,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   closeButton: {
//     alignSelf: 'flex-end',
//     marginBottom: 20,
//   },
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   profileImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 15,
//   },
//   profileText: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 3,
//   },
//   profileEmail: {
//     fontSize: 14,
//     color: '#777',
//   },
//   editProfileButton: {
//     alignSelf: 'flex-start',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderWidth: 1,
//     borderColor: '#2bb673',
//     borderRadius: 4,
//     marginTop: 5,
//   },
//   editProfileText: {
//     color: '#2bb673',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   mainDrawerSection: {
//     flex: 1,
//     paddingTop: 10,
//   },
//   drawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//   },
//   drawerIconContainer: {
//     width: 30,
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   drawerLabel: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   drawerFooter: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     marginBottom: 15,
//   },
//   logoutText: {
//     color: '#e74c3c',
//     fontSize: 16,
//     fontWeight: '500',
//     marginLeft: 10,
//   },
//   appInfo: {
//     alignItems: 'center',
//   },
//   appVersion: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 3,
//   },
//   appCopyright: {
//     fontSize: 12,
//     color: '#999',
//   },
// });

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useContext } from 'react';
import { COLORS, SIZES, FONTS } from '../constants/Theme'; // Import des constantes
// Screens
import MainStack from './MainStack';
import MyListingsScreen from '../screens/drawer/MyListingScreen';
import SettingsScreen from '../screens/drawer/SettingScreen';
import HelpScreen from '../screens/drawer/HelpScreen';
import { UserContext } from '../context/AuthContext'; 
import { Alert } from 'react-native';
import PostAdScreen from '../screens/modals/PostAdScreen';
import EditListingScreen from '../screens/drawer/EditListingScreen';
import MylistingStack from './MylistingStack';
import FeedbackScreen from '../screens/drawer/FeedBackScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { userData, logoutUser } = useContext(UserContext);

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se Déconnecter",
          onPress: async () => {
            if (logoutUser && typeof logoutUser === 'function') {
              const success = await logoutUser();
              if (!success) {
                Alert.alert("Erreur", "La déconnexion a échoué");
              }
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* Header du drawer */}
      <View style={styles.drawerHeader}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => props.navigation.closeDrawer()}
        >
          <Ionicons name="close" size={28} color={COLORS.gray} />
        </TouchableOpacity>
        
        <View style={styles.profileContainer}>
          <Image 
            source={userData?.photoURL ? { uri: userData.photoURL } : require('../assets/images/default-profile.jpg')} 
            style={styles.profileImage}
          />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>
              {userData?.displayName || 'Utilisateur'}
            </Text>
            <Text style={styles.profileEmail}>
              {userData?.email || 'email@exemple.com'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Modifier le profil</Text>
        </TouchableOpacity>
      </View>
      
      {/* Section principale */}
      <View style={styles.mainDrawerSection}>
        <DrawerItemList {...props} />
        
        {/* Section supplémentaire */}
        <TouchableOpacity style={styles.drawerItem}>
          <View style={styles.drawerIconContainer}>
            <MaterialIcons name="payment" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.drawerLabel}>Paiements</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.drawerItem}>
          <View style={styles.drawerIconContainer}>
            <MaterialCommunityIcons name="star-circle-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.drawerLabel}>Évaluer l'application</Text>
        </TouchableOpacity>
      </View>
      
      {/* Footer du drawer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <FontAwesome name="sign-out" size={20} color={COLORS.error || '#e74c3c'} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
        
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2023 MonToit.bj</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.2)',
        drawerStyle: styles.drawer,
        sceneContainerStyle: styles.sceneContainer,
        headerShown: false,
        swipeEdgeWidth: 50,
        drawerActiveBackgroundColor: COLORS.lightGray,
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.black,
      }}
    >
      <Drawer.Screen
        name="Accueil"
        component={MainStack}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
          drawerLabelStyle: styles.drawerLabel,
        }}
      />
      <Drawer.Screen
        name="Poster une annonce"
        component={PostAdScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name='add' size={22} color={color} />
          ),
          drawerLabelStyle: styles.drawerLabel,
        }}
      />
      <Drawer.Screen
        name="Mes Annonces"
        component={MylistingStack}
        options={{
          // headerShown: true,
          // headerTitle: 'Mes Annonces gh',  

          drawerIcon: ({ color }) => (
            <MaterialIcons name="format-list-bulleted" size={22} color={color} />
          ),
          drawerLabelStyle: styles.drawerLabel,
        }}
      />
      
      <Drawer.Screen
        name="Paramètres"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
          drawerLabelStyle: styles.drawerLabel,
        }}
      />
      
      <Drawer.Screen
        name="Aide & Support"
        component={HelpScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="help-circle-outline" size={22} color={color} />
          ),
          drawerLabelStyle: styles.drawerLabel,
        }}
      />
      <Drawer.Screen
        name="Avis & Évaluations"
        component={FeedbackScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name='star' size={22} color={color} />
          ),
          drawerLabelStyle: styles.drawerLabel,
        }}
      />
      {/* <Drawer.Screen 
        name="EditListing" 
        component={EditListingScreen} 
        options={{ headerShown: false }} 
      /> */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  sceneContainer: {
    backgroundColor: COLORS.white,
  },
  drawerContainer: {
    flex: 1,
    paddingTop: 0,
  },
  drawer: {
    width: '85%',
    backgroundColor: COLORS.white,
    flex: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  drawerHeader: {
    padding: SIZES.padding,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.base * 2,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SIZES.base * 2,
    backgroundColor: COLORS.lightGray,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    ...FONTS.h4,
    color: COLORS.black,
    marginBottom: SIZES.base / 2,
  },
  profileEmail: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base * 1.5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius / 2,
    marginTop: SIZES.base,
  },
  editProfileText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: '500',
  },
  mainDrawerSection: {
    flex: 1,
    paddingTop: SIZES.base,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding,
  },
  drawerIconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: SIZES.base * 2,
  },
  drawerLabel: {
    ...FONTS.body3,
    color: COLORS.black,
    fontWeight: '500',
  },
  drawerFooter: {
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    marginBottom: SIZES.base * 2,
  },
  logoutText: {
    ...FONTS.body3,
    color: COLORS.error || '#e74c3c',
    fontWeight: '500',
    marginLeft: SIZES.base,
  },
  appInfo: {
    alignItems: 'center',
  },
  appVersion: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  appCopyright: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
});
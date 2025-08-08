

// import React from 'react';
// import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
// import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
// import { useContext } from 'react';
// import { COLORS, SIZES, FONTS } from '../constants/Theme'; // Import des constantes
// // Screens
// import MainStack from './MainStack';
// import MyListingsScreen from '../screens/drawer/MyListingScreen';
// import SettingsScreen from '../screens/drawer/SettingScreen';
// import HelpScreen from '../screens/drawer/HelpScreen';
// import { UserContext } from '../context/AuthContext'; 
// import { Alert } from 'react-native';
// import PostAdScreen from '../screens/modals/PostAdScreen';
// import EditListingScreen from '../screens/drawer/EditListingScreen';
// import MylistingStack from './MylistingStack';
// import FeedbackScreen from '../screens/drawer/FeedBackScreen';

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
//           onPress: async () => {
//             if (logoutUser && typeof logoutUser === 'function') {
//               const success = await logoutUser();
//               if (!success) {
//                 Alert.alert("Erreur", "La déconnexion a échoué");
//               }
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
//         <TouchableOpacity 
//           style={styles.closeButton} 
//           onPress={() => props.navigation.closeDrawer()}
//         >
//           <Ionicons name="close" size={28} color={COLORS.gray} />
//         </TouchableOpacity>
        
//         <View style={styles.profileContainer}>
//           <Image 
//             source={userData?.photoURL ? { uri: userData.photoURL } : require('../assets/images/default-profile.jpg')} 
//             style={styles.profileImage}
//           />
//           <View style={styles.profileText}>
//             <Text style={styles.profileName}>
//               {userData?.displayName || 'Utilisateur'}
//             </Text>
//             <Text style={styles.profileEmail}>
//               {userData?.email || 'email@exemple.com'}
//             </Text>
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
//             <MaterialIcons name="payment" size={22} color={COLORS.primary} />
//           </View>
//           <Text style={styles.drawerLabel}>Paiements</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.drawerItem}>
//           <View style={styles.drawerIconContainer}>
//             <MaterialCommunityIcons name="star-circle-outline" size={22} color={COLORS.primary} />
//           </View>
//           <Text style={styles.drawerLabel}>Évaluer l'application</Text>
//         </TouchableOpacity>
//       </View>
      
//       {/* Footer du drawer */}
//       <View style={styles.drawerFooter}>
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//           <FontAwesome name="sign-out" size={20} color={COLORS.error || '#e74c3c'} />
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
//         drawerActiveBackgroundColor: COLORS.lightGray,
//         drawerActiveTintColor: COLORS.primary,
//         drawerInactiveTintColor: COLORS.black,
//       }}
//     >
//       <Drawer.Screen
//         name="Accueil"
//         component={MainStack}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={22} color={color} />
//           ),
//           drawerLabelStyle: styles.drawerLabel,
//         }}
//       />
//       <Drawer.Screen
//         name="Poster une annonce"
//         component={PostAdScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name='add' size={22} color={color} />
//           ),
//           drawerLabelStyle: styles.drawerLabel,
//         }}
//       />
//       <Drawer.Screen
//         name="Mes Annonces"
//         component={MylistingStack}
//         options={{
//           // headerShown: true,
//           // headerTitle: 'Mes Annonces gh',  

//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="format-list-bulleted" size={22} color={color} />
//           ),
//           drawerLabelStyle: styles.drawerLabel,
//         }}
//       />
      
//       <Drawer.Screen
//         name="Paramètres"
//         component={SettingsScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="settings-outline" size={22} color={color} />
//           ),
//           drawerLabelStyle: styles.drawerLabel,
//         }}
//       />
      
//       <Drawer.Screen
//         name="Aide & Support"
//         component={HelpScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialCommunityIcons name="help-circle-outline" size={22} color={color} />
//           ),
//           drawerLabelStyle: styles.drawerLabel,
//         }}
//       />
//       <Drawer.Screen
//         name="Avis & Évaluations"
//         component={FeedbackScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialCommunityIcons name='star' size={22} color={color} />
//           ),
//           drawerLabelStyle: styles.drawerLabel,
//         }}
//       />
//       {/* <Drawer.Screen 
//         name="EditListing" 
//         component={EditListingScreen} 
//         options={{ headerShown: false }} 
//       /> */}
//     </Drawer.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   sceneContainer: {
//     backgroundColor: COLORS.white,
//   },
//   drawerContainer: {
//     flex: 1,
//     paddingTop: 0,
//   },
//   drawer: {
//     width: '85%',
//     backgroundColor: COLORS.white,
//     flex: 1,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 2, height: 0 },
//     shadowOpacity: 0.15,
//     shadowRadius: 15,
//     elevation: 10,
//   },
//   drawerHeader: {
//     padding: SIZES.padding,
//     paddingTop: 50,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   closeButton: {
//     alignSelf: 'flex-end',
//     marginBottom: SIZES.base * 2,
//   },
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: SIZES.base * 2,
//   },
//   profileImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: SIZES.base * 2,
//     backgroundColor: COLORS.lightGray,
//   },
//   profileText: {
//     flex: 1,
//   },
//   profileName: {
//     ...FONTS.h4,
//     color: COLORS.black,
//     marginBottom: SIZES.base / 2,
//   },
//   profileEmail: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//   },
//   editProfileButton: {
//     alignSelf: 'flex-start',
//     paddingVertical: SIZES.base,
//     paddingHorizontal: SIZES.base * 1.5,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: SIZES.radius / 2,
//     marginTop: SIZES.base,
//   },
//   editProfileText: {
//     ...FONTS.body4,
//     color: COLORS.primary,
//     fontWeight: '500',
//   },
//   mainDrawerSection: {
//     flex: 1,
//     paddingTop: SIZES.base,
//   },
//   drawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: SIZES.base * 1.5,
//     paddingHorizontal: SIZES.padding,
//   },
//   drawerIconContainer: {
//     width: 30,
//     alignItems: 'center',
//     marginRight: SIZES.base * 2,
//   },
//   drawerLabel: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     fontWeight: '500',
//   },
//   drawerFooter: {
//     padding: SIZES.padding,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.lightGray,
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: SIZES.base,
//     marginBottom: SIZES.base * 2,
//   },
//   logoutText: {
//     ...FONTS.body3,
//     color: COLORS.error || '#e74c3c',
//     fontWeight: '500',
//     marginLeft: SIZES.base,
//   },
//   appInfo: {
//     alignItems: 'center',
//   },
//   appVersion: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginBottom: SIZES.base / 2,
//   },
//   appCopyright: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//   },
// });
// import React, { useContext } from 'react';
// import { 
//   View, 
//   StyleSheet, 
//   TouchableOpacity, 
//   Image, 
//   Text, 
//   Alert,
//   Dimensions 
// } from 'react-native';
// import { 
//   createDrawerNavigator, 
//   DrawerContentScrollView, 
//   DrawerItemList 
// } from '@react-navigation/drawer';
// import { 
//   Ionicons, 
//   MaterialIcons, 
//   MaterialCommunityIcons, 
//   FontAwesome 
// } from '@expo/vector-icons';
// import { COLORS, SIZES, FONTS } from '../constants/Theme';
// import { UserContext } from '../context/AuthContext';
// import MainStack from './MainStack';
// import PostAdScreen from '../screens/modals/PostAdScreen';
// import MylistingStack from './MylistingStack';
// import SettingsScreen from '../screens/drawer/SettingScreen';
// import HelpScreen from '../screens/drawer/HelpScreen';
// import FeedbackScreen from '../screens/drawer/FeedBackScreen';
// import { useNavigation } from '@react-navigation/native';
// import { CommonActions } from '@react-navigation/native';

// const { width } = Dimensions.get('window');
// const isSmallScreen = width < 375;

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
//   const { userData, logoutUser } = useContext(UserContext);
//   const navigation = useNavigation();
//   const handleEditProfile = () => {
//     navigation.dispatch(
//       CommonActions.navigate({
//         name: 'Profile', // Nom de votre onglet de profil
//         params: {
//           screen: 'MonProfilPrincipal',
//           params: {
//             screen: 'EditProfile',
//             params: { userData } // Passage des données si nécessaire
//           }
//         }
//       })
//     );
//   };
//   const handleLogout = () => {
//     Alert.alert(
//       "Déconnexion",
//       "Êtes-vous sûr de vouloir vous déconnecter ?",
//       [
//         { 
//           text: "Annuler", 
//           style: "cancel" 
//         },
//         {
//           text: "Se Déconnecter",
//           onPress: async () => {
//             try {
//               await logoutUser?.();
//             } catch (error) {
//               Alert.alert("Erreur", "La déconnexion a échoué");
//             }
//           },
//           style: "destructive",
//         },
//       ]
//     );
//   };

//   return (
//     <DrawerContentScrollView 
//       {...props} 
//       contentContainerStyle={styles.drawerContainer}
//     >
//       {/* Header */}
//       <View style={styles.drawerHeader}>
//         <TouchableOpacity 
//           style={styles.closeButton} 
//           onPress={() => props.navigation.closeDrawer()}
//         >
//           <Ionicons 
//             name="close" 
//             size={isSmallScreen ? 24 : 28} 
//             color={COLORS.gray} 
//           />
//         </TouchableOpacity>
        
//         <View style={styles.profileContainer}>
//           <Image 
//             source={userData?.photoURL ? 
//               { uri: userData.photoURL } : 
//               require('../assets/images/default-profile.jpg')} 
//             style={styles.profileImage}
//           />
//           <View style={styles.profileText}>
//             <Text style={styles.profileName} numberOfLines={1}>
//               {userData?.displayName || 'Utilisateur'}
//             </Text>
//             <Text style={styles.profileEmail} numberOfLines={1}>
//               {userData?.email || 'email@exemple.com'}
//             </Text>
//           </View>
//         </View>
        
//         <TouchableOpacity 
//           style={styles.editProfileButton}
//           onPress={handleEditProfile}
//         >
//           <Text style={styles.editProfileText}>Voir le profil</Text>
//         </TouchableOpacity>
//       </View>
      
//       {/* Menu principal */}
//       <View style={styles.mainDrawerSection}>
//         <DrawerItemList 
//           {...props} 
//           itemStyle={styles.drawerItem}
//         />
// {/*         
//         <TouchableOpacity 
//           style={styles.drawerItem}
//           onPress={() => props.navigation.navigate('Payments')}
//         >
//           <View style={styles.drawerIconContainer}>
//             <MaterialIcons 
//               name="payment" 
//               size={isSmallScreen ? 20 : 22} 
//               color={COLORS.primary} 
//             />
//           </View>
//           <Text style={styles.drawerLabel}>Paiements</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.drawerItem}
//           onPress={() => props.navigation.navigate('RateApp')}
//         >
//           <View style={styles.drawerIconContainer}>
//             <MaterialCommunityIcons 
//               name="star-circle-outline" 
//               size={isSmallScreen ? 20 : 22} 
//               color={COLORS.primary} 
//             />
//           </View>
//           <Text style={styles.drawerLabel}>Évaluer l'application</Text>
//         </TouchableOpacity> */}
//       </View>
      
//       {/* Footer */}
//       <View style={styles.drawerFooter}>
//         <TouchableOpacity 
//           onPress={handleLogout} 
//           style={styles.logoutButton}
//         >
//           <FontAwesome 
//             name="sign-out" 
//             size={isSmallScreen ? 18 : 20} 
//             color={COLORS.error || '#e74c3c'} 
//           />
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

// const AppDrawerNavigator = () => {
//   const drawerScreenOptions = {
//     drawerIconSize: isSmallScreen ? 20 : 22,
//     drawerLabelStyle: styles.drawerLabel,
//     drawerActiveBackgroundColor: COLORS.lightGray,
//     drawerActiveTintColor: COLORS.primary,
//     drawerInactiveTintColor: COLORS.black,
//   };

//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         drawerType: 'front',
//         overlayColor: 'rgba(0,0,0,0.2)',
//         drawerStyle: styles.drawer,
//         sceneContainerStyle: styles.sceneContainer,
//         headerShown: false,
//         swipeEdgeWidth: isSmallScreen ? 40 : 50,
//         ...drawerScreenOptions
//       }}
//     >
//       <Drawer.Screen
//         name="Accueil"
//         component={MainStack}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={drawerScreenOptions.drawerIconSize} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Poster une annonce"
//         component={PostAdScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="add" size={drawerScreenOptions.drawerIconSize} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Mes Annonces"
//         component={MylistingStack}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons 
//               name="format-list-bulleted" 
//               size={drawerScreenOptions.drawerIconSize} 
//               color={color} 
//             />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Paramètres"
//         component={SettingsScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons 
//               name="settings-outline" 
//               size={drawerScreenOptions.drawerIconSize} 
//               color={color} 
//             />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Aide & Support"
//         component={HelpScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialCommunityIcons 
//               name="help-circle-outline" 
//               size={drawerScreenOptions.drawerIconSize} 
//               color={color} 
//             />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Avis & Évaluations"
//         component={FeedbackScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialCommunityIcons 
//               name="star" 
//               size={drawerScreenOptions.drawerIconSize} 
//               color={color} 
//             />
//           ),
//         }}
//       />
//     </Drawer.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   sceneContainer: {
//     backgroundColor: COLORS.white,
//   },
//   drawerContainer: {
//     flex: 1,
//     paddingTop: 0,
//   },
//   drawer: {
//     width: isSmallScreen ? '80%' : '85%',
//     backgroundColor: COLORS.white,
//     flex: 1,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 2, height: 0 },
//     shadowOpacity: 0.15,
//     shadowRadius: 15,
//     elevation: 10,
//   },
//   drawerHeader: {
//     padding: isSmallScreen ? SIZES.padding / 1.5 : SIZES.padding,
//     paddingTop: isSmallScreen ? 40 : 50,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   closeButton: {
//     alignSelf: 'flex-end',
//     marginBottom: isSmallScreen ? SIZES.base : SIZES.base * 2,
//   },
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: isSmallScreen ? SIZES.base : SIZES.base * 2,
//   },
//   profileImage: {
//     width: isSmallScreen ? 50 : 60,
//     height: isSmallScreen ? 50 : 60,
//     borderRadius: isSmallScreen ? 25 : 30,
//     marginRight: isSmallScreen ? SIZES.base : SIZES.base * 2,
//     backgroundColor: COLORS.lightGray,
//   },
//   profileText: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: isSmallScreen ? FONTS.h4.fontSize - 2 : FONTS.h4.fontSize,
//     fontFamily: FONTS.h4.fontFamily,
//     color: COLORS.black,
//     marginBottom: SIZES.base / 2,
//   },
//   profileEmail: {
//     fontSize: isSmallScreen ? FONTS.body4.fontSize - 1 : FONTS.body4.fontSize,
//     fontFamily: FONTS.body4.fontFamily,
//     color: COLORS.gray,
//   },
//   editProfileButton: {
//     alignSelf: 'flex-start',
//     paddingVertical: isSmallScreen ? SIZES.base / 1.5 : SIZES.base,
//     paddingHorizontal: isSmallScreen ? SIZES.base : SIZES.base * 1.5,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: SIZES.radius / 2,
//     marginTop: isSmallScreen ? SIZES.base / 1.5 : SIZES.base,
//   },
//   editProfileText: {
//     fontSize: isSmallScreen ? FONTS.body4.fontSize - 1 : FONTS.body4.fontSize,
//     fontFamily: FONTS.body4.fontFamily,
//     color: COLORS.primary,
//     fontWeight: '500',
//   },
//   mainDrawerSection: {
//     flex: 1,
//     paddingTop: SIZES.base,
//   },
//   drawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: isSmallScreen ? SIZES.base : SIZES.base * 1.5,
//     paddingHorizontal: isSmallScreen ? SIZES.padding / 1.5 : SIZES.padding,
//   },
//   drawerIconContainer: {
//     width: 30,
//     alignItems: 'center',
//     marginRight: isSmallScreen ? SIZES.base : SIZES.base * 2,
//   },
//   drawerLabel: {
//     fontSize: isSmallScreen ? FONTS.body3.fontSize - 1 : FONTS.body3.fontSize,
//     fontFamily: FONTS.body3.fontFamily,
//     color: COLORS.black,
//     fontWeight: '500',
//   },
//   drawerFooter: {
//     padding: isSmallScreen ? SIZES.padding / 1.5 : SIZES.padding,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.lightGray,
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: isSmallScreen ? SIZES.base / 1.5 : SIZES.base,
//     marginBottom: isSmallScreen ? SIZES.base : SIZES.base * 2,
//   },
//   logoutText: {
//     fontSize: isSmallScreen ? FONTS.body3.fontSize - 1 : FONTS.body3.fontSize,
//     fontFamily: FONTS.body3.fontFamily,
//     color: COLORS.error,
//     fontWeight: '500',
//     marginLeft: SIZES.base,
//   },
//   appInfo: {
//     alignItems: 'center',
//   },
//   appVersion: {
//     fontSize: isSmallScreen ? FONTS.body4.fontSize - 1 : FONTS.body4.fontSize,
//     fontFamily: FONTS.body4.fontFamily,
//     color: COLORS.gray,
//     marginBottom: SIZES.base / 2,
//   },
//   appCopyright: {
//     fontSize: isSmallScreen ? FONTS.body4.fontSize - 1 : FONTS.body4.fontSize,
//     fontFamily: FONTS.body4.fontFamily,
//     color: COLORS.gray,
//   },
// });

// export default AppDrawerNavigator;
import React, { useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Text, 
  Alert,
  Dimensions,
  Animated
} from 'react-native';
import { 
  createDrawerNavigator, 
  DrawerContentScrollView, 
  DrawerItemList 
} from '@react-navigation/drawer';
import { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons, 
  FontAwesome 
} from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/Theme';
import { UserContext } from '../context/AuthContext';
import MainStack from './MainStack';
import PostAdScreen from '../screens/modals/PostAdScreen';
import MylistingStack from './MylistingStack';
import SettingsScreen from '../screens/drawer/SettingScreen';
import HelpScreen from '../screens/drawer/HelpScreen';
import FeedbackScreen from '../screens/drawer/FeedBackScreen';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

const Drawer = createDrawerNavigator();

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CustomDrawerContent = (props) => {
  const { userData, logoutUser } = useContext(UserContext);
  const navigation = useNavigation();

  const handleEditProfile = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Profile',
        params: {
          screen: 'MonProfilPrincipal',
          params: {
            screen: 'EditProfile',
            params: { userData }
          }
        }
      })
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se Déconnecter",
          onPress: async () => {
            try {
              await logoutUser?.();
            } catch {
              Alert.alert("Erreur", "La déconnexion a échoué");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Animation simple pour bouton
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.timing(fadeAnim, { toValue: 0.7, duration: 150, useNativeDriver: true }).start();
  const onPressOut = () => Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => props.navigation.closeDrawer()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={isSmallScreen ? 24 : 28} color={COLORS.gray} />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <Image 
            source={userData?.photoURL ? { uri: userData.photoURL } : require('../assets/images/default-profile.jpg')} 
            style={styles.profileImage}
          />
          <View style={styles.profileText}>
            <Text style={styles.profileName} numberOfLines={1}>
              {userData?.displayName || 'Utilisateur'}
            </Text>
            <Text style={styles.profileEmail} numberOfLines={1}>
              {userData?.email || 'email@exemple.com'}
            </Text>
          </View>
        </View>

        <AnimatedTouchable
          style={[styles.editProfileButton, { opacity: fadeAnim }]}
          onPress={handleEditProfile}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.8}
        >
          <Ionicons name="person-circle-outline" size={20} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={styles.editProfileText}>Voir le profil</Text>
        </AnimatedTouchable>
      </View>

      {/* Menu principal */}
      <View style={styles.mainDrawerSection}>
        <DrawerItemList {...props} itemStyle={styles.drawerItem} labelStyle={styles.drawerLabel} />
      </View>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <AnimatedTouchable
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <FontAwesome name="sign-out" size={isSmallScreen ? 18 : 20} color={COLORS.error} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </AnimatedTouchable>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2023 MonToit.bj</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const AppDrawerNavigator = () => {
  const drawerScreenOptions = {
    drawerIconSize: isSmallScreen ? 20 : 22,
    drawerLabelStyle: styles.drawerLabel,
    drawerActiveBackgroundColor: COLORS.lightGray,
    drawerActiveTintColor: COLORS.primary,
    drawerInactiveTintColor: COLORS.black,
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.2)',
        drawerStyle: styles.drawer,
        sceneContainerStyle: styles.sceneContainer,
        headerShown: false,
        swipeEdgeWidth: isSmallScreen ? 40 : 50,
        ...drawerScreenOptions
      }}
    >
      <Drawer.Screen
        name="Accueil"
        component={MainStack}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={drawerScreenOptions.drawerIconSize} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Poster une annonce"
        component={PostAdScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="add" size={drawerScreenOptions.drawerIconSize} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Mes Annonces"
        component={MylistingStack}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="format-list-bulleted" size={drawerScreenOptions.drawerIconSize} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Paramètres"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={drawerScreenOptions.drawerIconSize} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Aide & Support"
        component={HelpScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="help-circle-outline" size={drawerScreenOptions.drawerIconSize} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Avis & Évaluations"
        component={FeedbackScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="star" size={drawerScreenOptions.drawerIconSize} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  sceneContainer: {
    backgroundColor: COLORS.white,
  },
  drawerContainer: {
    flex: 1,
    paddingTop: 0,
  },
  drawer: {
    width: isSmallScreen ? '80%' : '85%',
    backgroundColor: COLORS.white,
    flex: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerHeader: {
    padding: isSmallScreen ? SIZES.padding / 1.5 : SIZES.padding,
    // paddingTop: isSmallScreen ? 45 : 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: `rgba(71, 149, 45, 0.05)`, // léger dégradé bleu
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: isSmallScreen ? SIZES.base : SIZES.base * 2,
    padding: 6,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallScreen ? SIZES.base : SIZES.base * 2,
  },
  profileImage: {
    width: isSmallScreen ? 56 : 70,
    height: isSmallScreen ? 56 : 70,
    borderRadius: isSmallScreen ? 28 : 35,
    marginRight: isSmallScreen ? SIZES.base : SIZES.base * 2,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: isSmallScreen ? FONTS.h4.fontSize + 1 : FONTS.h4.fontSize + 2,
    fontFamily: FONTS.h4.fontFamily,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: SIZES.base / 3,
  },
  profileEmail: {
    fontSize: isSmallScreen ? FONTS.body4.fontSize : FONTS.body4.fontSize + 1,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.gray,
    fontWeight: '500',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: isSmallScreen ? SIZES.base / 1.5 : SIZES.base,
    paddingVertical: isSmallScreen ? 8 : 10,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  editProfileText: {
    fontSize: isSmallScreen ? FONTS.body4.fontSize : FONTS.body4.fontSize + 1,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.primary,
    fontWeight: '700',
  },
  mainDrawerSection: {
    flex: 1,
    paddingTop: SIZES.base,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? SIZES.base * 1.3 : SIZES.base * 1.8,
    paddingHorizontal: isSmallScreen ? SIZES.padding / 1.5 : SIZES.padding,
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  drawerLabel: {
    fontSize: isSmallScreen ? FONTS.body3.fontSize : FONTS.body3.fontSize + 1,
    fontFamily: FONTS.body3.fontFamily,
    color: COLORS.black,
    fontWeight: '600',
  },
  drawerFooter: {
    padding: isSmallScreen ? SIZES.padding / 1.5 : SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? SIZES.base : SIZES.base * 1.3,
    marginBottom: isSmallScreen ? SIZES.base : SIZES.base * 1.5,
    borderRadius: 30,
    backgroundColor: COLORS.error + '20', // rouge clair transparent
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: isSmallScreen ? FONTS.body3.fontSize : FONTS.body3.fontSize + 1,
    fontFamily: FONTS.body3.fontFamily,
    color: COLORS.error,
    fontWeight: '700',
    marginLeft: SIZES.base,
  },
  appInfo: {
    alignItems: 'center',
  },
  appVersion: {
    fontSize: isSmallScreen ? FONTS.body4.fontSize : FONTS.body4.fontSize + 1,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  appCopyright: {
    fontSize: isSmallScreen ? FONTS.body4.fontSize : FONTS.body4.fontSize + 1,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.gray,
  },
});

export default AppDrawerNavigator;

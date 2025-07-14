// // Exemple si tu as un ProfileStackNavigator.js
// import Profile from '../screens/main/profile/Profile'; // Assure-toi de l'importer
// import EditProfileScreen from '../screens/main/profile/EditProfileScreen'; // Assure-toi de l'importer

// import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Utilise createNativeStackNavigator pour les stacks natifs
// import SettingScreen from '../screens/drawer/SettingScreen';
// import FavoritesScreen from '../screens/main/FavoritesScreen';
// import MyListingsScreen from '../screens/drawer/MyListingScreen';
// import PostAdScreen from '../screens/modals/PostAdScreen';
// import AuthStack from './AuthStack';
// <<<<<<< HEAD
// =======
// import SubscriptionScreen from '../screens/main/profile/SubscriptionScreen';
// >>>>>>> 9e4ba82 (refonte complet de tous les pages)
// const ProfileStack = createNativeStackNavigator(); // Ou createStackNavigator

// const ProfileStackNavigator = () => (
//   <ProfileStack.Navigator>
//     <ProfileStack.Screen name="MonProfilPrincipal"  component={Profile} options={{headerShown: false}} />
//     <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Modifier le Profil' }} />
//     <ProfileStack.Screen name="Settings" component={SettingScreen} options={{headerShown: false}} />
//     <ProfileStack.Screen name="Favorites" component={FavoritesScreen} options={{headerShown: false}} />
//     <ProfileStack.Screen name="MyProperties" component={MyListingsScreen} options={{headerShown: false}}/>
//     <ProfileStack.Screen name="PostAd" component={PostAdScreen} options={{headerShown: false}}/>
//     <ProfileStack.Screen name="Auth" component={AuthStack} options={{headerShown: false}}/>
// <<<<<<< HEAD
// =======
//     <ProfileStack.Screen name="Subscription" component={SubscriptionScreen} options={{headerShown: false}}/>
// >>>>>>> 9e4ba82 (refonte complet de tous les pages)
    
//   </ProfileStack.Navigator>
// );
// export default ProfileStackNavigator;

// // Et dans ton BottomTabNavigator :
// // <Tab.Screen name="ProfilTab" component={ProfileStackNavigator} ... />


// Exemple si tu as un ProfileStackNavigator.js
import Profile from '../screens/main/profile/Profile'; // Assure-toi de l'importer
import EditProfileScreen from '../screens/main/profile/EditProfileScreen'; // Assure-toi de l'importer
import SubscriptionScreen from '../screens/main/profile/SubscriptionScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Utilise createNativeStackNavigator pour les stacks natifs
import SettingScreen from '../screens/drawer/SettingScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import MyListingsScreen from '../screens/drawer/MyListingScreen';
import PostAdScreen from '../screens/modals/PostAdScreen';
import AuthStack from './AuthStack';
import AppDrawerNavigator from './DrawerNavigator';

const ProfileStack = createNativeStackNavigator(); // Ou createStackNavigator

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="MonProfilPrincipal"
      component={Profile}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ title: 'Modifier le Profil' }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={SettingScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="MyProperties"
      component={MyListingsScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="PostAd"
      component={PostAdScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="Auth"
      component={AuthStack}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="Subscription"
      component={SubscriptionScreen}
      options={{ headerShown: false }}
    />
    
  </ProfileStack.Navigator>
);

export default ProfileStackNavigator;

// Et dans ton BottomTabNavigator :
// <Tab.Screen name="ProfilTab" component={ProfileStackNavigator} ... />



// import React from 'react';
// import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// // Screens
// import HomeScreen from '../screens/main/HomeScreen';
// import FavoritesScreen from '../screens/main/FavoritesScreen';
// import SearchScreen from '../screens/modals/SearchScreen'; // Importez votre SearchScreen
// import PostAdScreen from '../screens/modals/PostAdScreen'; // Importez votre PostAdScreen
// import MessageStackNavigator from './MessageStackNavigator';
// import ProfileStackNavigator from './ProfileStackNavigator';

// const Tab = createBottomTabNavigator();

// export default function ZameenTabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: true,
//         tabBarStyle: styles.tabBar,
//         tabBarActiveTintColor: '#2bb673',
//         tabBarInactiveTintColor: '#8e8e93',
//         tabBarLabelStyle: styles.tabLabel,
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <View style={styles.iconContainer}>
//               <MaterialCommunityIcons 
//                 name={focused ? 'home' : 'home-outline'} 
//                 size={26} 
//                 color={color} 
//               />
//               {focused && <View style={styles.activeIndicator} />}
//             </View>
//           ),
//           tabBarLabel: 'Accueil',
//         }}
//       />
      
//       <Tab.Screen
//         name="Saved"
//         component={FavoritesScreen}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <View style={styles.iconContainer}>
//               <MaterialIcons 
//                 name={focused ? 'favorite' : 'favorite-border'} 
//                 size={26} 
//                 color={color} 
//               />
//               {focused && <View style={styles.activeIndicator} />}
//             </View>
//           ),
//           tabBarLabel: 'Favoris',
//         }}
//       />
      
//       {/* Écran de recherche au centre */}
//       <Tab.Screen
//         name="Search"
//         component={SearchScreen}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <View style={styles.iconContainer}>
//               <MaterialIcons 
//                 name={focused ? 'search' : 'search'} 
//                 size={26} 
//                 color={color} 
//               />
//               {focused && <View style={styles.activeIndicator} />}
//             </View>
//           ),
//           tabBarLabel: 'Recherche',
//         }}
//       />
      
//       {/* Écran de publication à côté du profil */}
//       <Tab.Screen
//         name="PostAd"
//         component={PostAdScreen}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <View style={styles.iconContainer}>
//               <Ionicons 
//                 name={focused ? 'add-circle' : 'add-circle-outline'} 
//                 size={26} 
//                 color={color} 
//               />
//               {focused && <View style={styles.activeIndicator} />}
//             </View>
//           ),
//           tabBarLabel: 'Publier',
//         }}
//         listeners={({ navigation }) => ({
//           tabPress: (e) => {
//             e.preventDefault();
//             navigation.navigate('PostAdFlow');
//           },
//         })}
//       />
      
//       <Tab.Screen
//         name="Profile"
//         component={ProfileStackNavigator}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <View style={styles.iconContainer}>
//               <MaterialCommunityIcons 
//                 name={focused ? 'account' : 'account-outline'} 
//                 size={26} 
//                 color={color} 
//               />
//               {focused && <View style={styles.activeIndicator} />}
//             </View>
//           ),
//           tabBarLabel: 'Profil',
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     height: 70,
//     backgroundColor: 'white',
//     borderTopWidth: 0,
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     paddingHorizontal: 10,
//   },
//   tabLabel: {
//     fontSize: 12,
//     fontWeight: '500',
//     paddingBottom: 4,
//   },
//   iconContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     top: 8,
//   },
//   activeIndicator: {
//     position: 'absolute',
//     bottom: -12,
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#2bb673',
//   },
//   // Styles pour le bouton central si vous voulez le garder spécial
//   centerButton: {
//     top: -20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 70,
//     height: 70,
//   },
//   centerButtonIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#2bb673',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 6,
//   },
// });

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/Theme';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import SearchScreen from '../screens/modals/SearchScreen';
import PostAdScreen from '../screens/modals/PostAdScreen';
import MessageStackNavigator from './MessageStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator();

export default function ZameenTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Acceuil"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name={focused ? 'home' : 'home-outline'} 
                size={24} 
                color={color} 
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
          tabBarLabel: 'Acceuil',
        }}
      />
      
      <Tab.Screen
        name="MesFavories"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <MaterialIcons 
                name={focused ? 'favorite' : 'favorite-border'} 
                size={24} 
                color={color} 
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
          tabBarLabel: 'Favoris',
        }}
      />
      
      {/* Bouton central - Search */}
      <Tab.Screen
        name="Recherche"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButton}>
              <View style={[
                styles.centerButtonIcon, 
                focused && styles.centerButtonActive
              ]}>
                <FontAwesome 
                  name="search" 
                  size={20} 
                  color={focused ? COLORS.white : COLORS.primary} 
                />
              </View>
            </View>
          ),
          tabBarLabel: 'Recherche',
        }}
      />
      
      <Tab.Screen
        name="Messages"
        component={MessageStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'MessagesList';
          return {
            tabBarStyle: (routeName === 'ChatScreen') ? { display: 'none' } : styles.tabBar,
            tabBarIcon: ({ focused, color }) => (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons 
                  name={focused ? 'message-text' : 'message-text-outline'} 
                  size={24} 
                  color={color} 
                />
                {focused && <View style={styles.activeIndicator} />}
              </View>
            ),
            tabBarLabel: 'Messages',
          };
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name={focused ? 'account' : 'account-outline'} 
                size={24} 
                color={color} 
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
          tabBarLabel: 'Profile',
        }}
      />
       {/* Écran de publication à côté du profil */}
       {/* <Tab.Screen
        name="PostAd"
        component={PostAdScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons 
                name={focused ? 'add-circle' : 'add-circle-outline'} 
                size={26} 
                color={color} 
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
          tabBarLabel: 'Publier',
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('PostAdFlow');
          },
        })}
      /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 70,
    // borderRadius: 35,
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingHorizontal: 10,
  },
  tabLabel: {
    fontSize: SIZES.body4,
    fontWeight: '500',
    paddingBottom: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 8,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  centerButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  centerButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
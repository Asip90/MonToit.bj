

// import React from 'react';
// import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
// import { COLORS, SIZES } from '../constants/Theme';

// // Screens
// import HomeScreen from '../screens/main/HomeScreen';
// import FavoritesScreen from '../screens/main/FavoritesScreen';
// import SearchScreen from '../screens/modals/SearchScreen';
// import PostAdScreen from '../screens/modals/PostAdScreen';
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
//         tabBarActiveTintColor: COLORS.primary,
//         tabBarInactiveTintColor: COLORS.gray,
//         tabBarLabelStyle: styles.tabLabel,
//       }}
//     >
//       <Tab.Screen
//         name="Acceuil"
//         component={HomeScreen}
        
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <View style={styles.iconContainer}>
//               <MaterialCommunityIcons 
//                 name={focused ? 'home' : 'home-outline'} 
//                 size={24} 
//                 color={color} 
//               />
//               {focused && <View style={styles.activeIndicator} />}
//             </View>
//           ),
//           tabBarLabel: 'Acceuil',
//         }}
//       />
      
//       <Tab.Screen
//         name="MesFavories"
//         component={FavoritesScreen}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <View style={styles.iconContainer}>
//               <MaterialIcons 
//                 name={focused ? 'favorite' : 'favorite-border'} 
//                 size={24} 
//                 color={color} 
//               />
//               {focused && <View style={styles.activeIndicator} />}
//             </View>
//           ),
//           tabBarLabel: 'Favoris',
//         }}
//       />
      
//       {/* Bouton central - Search */}
//       <Tab.Screen
//         name="Recherche"
//         component={SearchScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View style={styles.centerButton}>
//               <View style={[
//                 styles.centerButtonIcon, 
//                 focused && styles.centerButtonActive
//               ]}>
//                 <FontAwesome 
//                   name="search" 
//                   size={20} 
//                   color={focused ? COLORS.white : COLORS.primary} 
//                 />
//               </View>
//             </View>
//           ),
//           tabBarLabel: 'Recherche',
//         }}
//       />
      
//       <Tab.Screen
//         name="Messages"
//         component={MessageStackNavigator}
//         options={({ route }) => {
//           const routeName = getFocusedRouteNameFromRoute(route) ?? 'MessagesList';
//           return {
//             tabBarStyle: (routeName === 'ChatScreen') ? { display: 'none' } : styles.tabBar,
//             tabBarIcon: ({ focused, color }) => (
//               <View style={styles.iconContainer}>
//                 <MaterialCommunityIcons 
//                   name={focused ? 'message-text' : 'message-text-outline'} 
//                   size={24} 
//                   color={color} 
//                 />
//                 {focused && <View style={styles.activeIndicator} />}
//               </View>
//             ),
//             tabBarLabel: 'Messages',
//           };
//         }}
//       />
      
//       <Tab.Screen
//         name="Profile"
//         component={ProfileStackNavigator}
//         options={{
//           tabBarIcon: ({ focused, color }) => (
//             <View style={styles.iconContainer}>
//               <MaterialCommunityIcons 
//                 name={focused ? 'account' : 'account-outline'} 
//                 size={24} 
//                 color={color} 
//               />
//               {focused && <View style={styles.activeIndicator} />}
//             </View>
//           ),
//           tabBarLabel: 'Profile',
//         }}
//       />
//        {/* Écran de publication à côté du profil */}
//        {/* <Tab.Screen
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
//       /> */}
//     </Tab.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     // position: 'absolute',
//     bottom: 0,
//     // left: 16,
//     // right: 16,
//     height: 70,
//     width: '100%',
//     // marginLeft: 25,
//     // borderRadius: 35,
//     backgroundColor: COLORS.white,
//     borderTopWidth: 0,
//     elevation: 10,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     paddingHorizontal: 10,
//   },
//   tabLabel: {
//     fontSize: SIZES.body4,
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
//     bottom: -8,
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: COLORS.primary,
//   },
//   centerButton: {
//     top: -20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 60,
//     height: 60,
//   },
//   centerButtonIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     backgroundColor: COLORS.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerButtonActive: {
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
// });
// ZameenTabNavigator.js
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Platform,
  Text
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/Theme';

// Screens (garde tes imports existants)
import HomeScreen from '../screens/main/HomeScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import SearchScreen from '../screens/modals/SearchScreen';
import PostAdScreen from '../screens/modals/PostAdScreen';
import MessageStackNavigator from './MessageStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = 70;
const INDICATOR_SIZE = 6;
const ICON_UP = -8;
const ICON_SCALE_FOCUSED = 1.15;
const ICON_SCALE_NORMAL = 1.0;

function AnimatedTabBar({ state, descriptors, navigation }) {
  const routes = state.routes;
  const focusedIndex = state.index;

  const containerWidth = useRef(0);
  const [tabWidth, setTabWidth] = useState(0);

  // indicator position (pixels)
  const indicator = useRef(new Animated.Value(0)).current;

  // scales for icons (one Animated.Value per tab)
  const iconScales = useRef(routes.map((_, i) => new Animated.Value(i === focusedIndex ? ICON_SCALE_FOCUSED : ICON_SCALE_NORMAL))).current;

  // translateY for icons (small lift on focus)
  const iconTranslateYs = useRef(routes.map((_, i) => new Animated.Value(i === focusedIndex ? ICON_UP : 0))).current;

  // center button special scale
  const centerScale = useRef(new Animated.Value(routes[2] && focusedIndex === 2 ? 1 : 1)).current;

  // animate indicator when focusedIndex or tabWidth changes
  useEffect(() => {
    if (tabWidth <= 0) return;
    const targetX = focusedIndex * tabWidth + tabWidth / 2 - INDICATOR_SIZE / 2;
    Animated.spring(indicator, {
      toValue: targetX,
      useNativeDriver: true,
      stiffness: 200,
      damping: 18,
      mass: 0.8,
    }).start();
  }, [focusedIndex, tabWidth, indicator]);

  // animate icon scales / translateY for the changed index
  useEffect(() => {
    // animate all: focused => enlarged, others => normal
    iconScales.forEach((av, i) => {
      Animated.spring(av, {
        toValue: i === focusedIndex ? ICON_SCALE_FOCUSED : ICON_SCALE_NORMAL,
        useNativeDriver: true,
        damping: 12,
        mass: 0.6,
      }).start();
    });
    iconTranslateYs.forEach((tv, i) => {
      Animated.spring(tv, {
        toValue: i === focusedIndex ? ICON_UP : 0,
        useNativeDriver: true,
        damping: 12,
        mass: 0.6,
      }).start();
    });

    // center button pulse when focused
    Animated.spring(centerScale, {
      toValue: focusedIndex === 2 ? 1.06 : 1,
      useNativeDriver: true,
      damping: 10,
      mass: 0.6,
    }).start();
  }, [focusedIndex]);

  // Handle layout to compute tab width
  const onLayoutContainer = (e) => {
    const w = e.nativeEvent.layout.width;
    containerWidth.current = w;
    setTabWidth(w / routes.length);
  };

  // Render a single tab button
  const renderTab = (route, index) => {
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel ?? options.title ?? route.name;
    const focused = focusedIndex === index;

    // icon selection
    const Icon = ({ color, size }) => {
      switch (route.name) {
        case 'Acceuil':
          return <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
        case 'MesFavories':
          return <MaterialIcons name={focused ? 'favorite' : 'favorite-border'} size={size} color={color} />;
        case 'Recherche':
          return <FontAwesome name="search" size={size} color={color} />;
        case 'Messages':
          return <MaterialCommunityIcons name={focused ? 'message-text' : 'message-text-outline'} size={size} color={color} />;
        case 'Profile':
          return <MaterialCommunityIcons name={focused ? 'account' : 'account-outline'} size={size} color={color} />;
        default:
          return <Ionicons name="ellipse" size={size} color={color} />;
      }
    };

    // center button special rendering
    if (route.name === 'Recherche') {
      return (
        <View key={route.key} style={styles.centerWrapper}>
          <TouchableWithoutFeedback
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) navigation.navigate(route.name);
            }}
          >
            <Animated.View style={[
              styles.centerButton,
              {
                transform: [{ scale: centerScale }, { translateY: -10 }],
                shadowOpacity: 0.25,
                shadowRadius: 8,
              }
            ]}>
              <Animated.View style={[styles.centerIconWrap, focused && styles.centerIconWrapActive]}>
                <FontAwesome name="search" size={22} color={focused ? COLORS.white : COLORS.primary} />
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
          <View style={{ height: 8 }} />
        </View>
      );
    }

    // regular tab
    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={focused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        key={route.key}
        activeOpacity={0.8}
        style={styles.tabButton}
      >
        <Animated.View style={{ transform: [{ translateY: iconTranslateYs[index] }, { scale: iconScales[index] }] }}>
          <Icon color={focused ? COLORS.primary : COLORS.gray} size={24} />
        </Animated.View>
        <Animated.Text style={[styles.tabLabel, { color: focused ? COLORS.primary : COLORS.gray }]}>
          {label}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={styles.container} onLayout={onLayoutContainer}>
      {/* top shadow line */}
      <View style={styles.topShadow} pointerEvents="none" />

      <View style={styles.row}>
        {routes.map((r, i) => renderTab(r, i))}
      </View>

      {/* Indicator: small rounded dot that slides under active icon */}
      {tabWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: INDICATOR_SIZE,
              transform: [{ translateX: indicator }],
            },
          ]}
          pointerEvents="none"
        />
      )}
    </Animated.View>
  );
}

export default function ZameenTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // on gère le label dans custom bar
        tabBarStyle: { height: TAB_BAR_HEIGHT, backgroundColor: 'transparent' },
      }}
      tabBar={(props) => <AnimatedTabBar {...props} />}
    >
      <Tab.Screen name="Acceuil" component={HomeScreen} options={{ tabBarLabel: 'Acceuil' }} />
      <Tab.Screen name="MesFavories" component={FavoritesScreen} options={{ tabBarLabel: 'Favoris' }} />
      <Tab.Screen name="Recherche" component={SearchScreen} options={{ tabBarLabel: 'Recherche' }} />
      <Tab.Screen
        name="Messages"
        component={MessageStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'MessagesList';
          // si ChatScreen, hide tab bar completely (comme avant)
          return {
            tabBarStyle: (routeName === 'ChatScreen') ? { display: 'none' } : undefined,
            tabBarLabel: 'Messages',
          };
        }}
      />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_HEIGHT,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // paddingHorizontal: 10,
    // to avoid overlaying content badly on Android
    elevation: 0,
  },
  topShadow: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // bar shadow
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
  },
  tabLabel: {
    fontSize: SIZES.body5 || 11,
    marginTop: 2,
    fontWeight: '600',
  },

  // center button styles
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    // shadow
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
  },
  centerIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIconWrapActive: {
    backgroundColor: COLORS.primary,
  },

  indicator: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    backgroundColor: COLORS.primary,
    zIndex: 20,
  },
});

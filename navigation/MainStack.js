// navigation/MainStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importer les composants et écrans que ce Stack va gérer
import TabNavigator from './TabNavigator';

// import PropertyDetailsScreen from '../screens/stack/PropertyDetailsScreen';
// import SearchResultsScreen from '../screens/stack/SearchResultsScreen';
import HelpScreen from '../screens/drawer/HelpScreen'; // Écran d'aide
import MyListingsScreen from '../screens/drawer/MyListingScreen'; // Écran de mes annonces
import SettingsScreen from '../screens/drawer/SettingScreen'; // Écran de paramètres    
import PostAdScreen from '../screens/modals/PostAdScreen'; // Écran de publication d'annonce
import { COLORS } from '../constants/Colors'; // Importer les couleurs si nécessaire
import PostDetail from '../screens/modals/PostDetailScreen';
import PostDetailScreen from '../screens/modals/PostDetailScreen';
import CategoryResultsScreen from '../screens/modals/CategoryResultsScreen';
import SearchScreen from '../screens/modals/SearchScreen';
import SearchResultsScreen from '../screens/modals/SearchResultsScreen';
import MessageStackNavigator from './MessageStackNavigator';
import EditListingScreen from '../screens/drawer/EditListingScreen';
// Importer les écrans de navigation
// pour les écrans de type "Stack" (comme les détails d'une propriété, etc.)            
// Initialisation du navigateur de type "Stack"
const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator
     screenOptions={{
        headerShown: false,
      }}
     
    >
      {/* 
        ÉCRAN N°1 : Le TabNavigator.
        C'est l'écran principal affiché par défaut dans ce Stack.
      */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        // Très important : on désactive le header pour cet écran spécifique,
        // car le Stack.Navigator en fournit déjà un. Sinon, on aurait un double header.
        // options={{ headerShown: true }}
      />
      
      {/* 
        ÉCRAN N°2 : La page de détail d'une propriété.
        Cet écran s'affichera par-dessus la barre d'onglets.
      */}
      {/* <Stack.Screen
        name="PropertyDetails"
        component={Property}
        
        options={{ title: 'Détails du bien' }} 
      /> */}

      {/* 
        ÉCRAN N°3 : L'écran des résultats de recherche.
        Il s'ouvre quand on utilise la barre de recherche dans le header.
      */}
      {/* <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ title: 'Résultats de recherche' }}
      /> */}

      {/* 
        ÉCRAN N°4 : Le flux de publication d'annonce.
        On le configure comme une "modale" pour qu'il glisse depuis le bas.
      */}
      <Stack.Screen
        name="PostAdFlow"
        component={PostAdScreen}
        options={{
          presentation: 'modal', // Animation de type modale
          headerShown: false,    // La modale gère son propre header (ex: un bouton "Fermer")
        }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        // options={{ title: 'Aide & Support' }}
      />
      <Stack.Screen
        name="CategoryResults"
        component={CategoryResultsScreen}
        options={{
          presentation: 'modal', // Animation de type modale
          headerShown: false,    // La modale gère son propre header (ex: un bouton "Fermer")
        }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          presentation: 'modal', // Animation de type modale
          headerShown: false,    // La modale gère son propre header (ex: un bouton "Fermer")
        }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{
          presentation: 'modal', // Animation de type modale
          headerShown: false,    // La modale gère son propre header (ex: un bouton "Fermer")
        }}
      />
      <Stack.Screen
        name="MessageStack"
        component={MessageStackNavigator}
        options={{
          presentation: 'modal', // Animation de type modale
          headerShown: false,    // La modale gère son propre header (ex: un bouton "Fermer")
        }}
      />
      <Stack.Screen 
        name="EditListing" 
        component={EditListingScreen} 
        options={{ headerShown: false }} 
      />

    </Stack.Navigator>
  );
}
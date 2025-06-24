// // navigators/MessageStackNavigator.js (Nouveau fichier)
// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import MessagesList from '../screens/messages/MessagesList'; // Votre liste de conversations
// import ChatScreen from '../screens/messages/ChatScreen'; // Votre nouvel écran de chat

// const Stack = createNativeStackNavigator();

// const MessageStackNavigator = () => {
//   return (
//     <Stack.Navigator >
      
//       <Stack.Screen 
        
//         name="MessagesList" 
//         component={MessagesList} 
//         options={{ 
//           title: 'Messages', // Titre de l'écran de liste de messages
//           headerShown: false, // Afficher le header pour cet écran
//           headerStyle: { backgroundColor: '#f8f8f8' }, // Style du header
//           headerTitleStyle: { color: '#333' }, // Style du titre du header
//         }}
//       />
//       <Stack.Screen 
//         name="ChatScreen" 
//         component={ChatScreen} 
//          // Assurez-vous que le chemin est correct
//           //  options={{ tabBarVisible: false }} // Cache le bottom tab
//         options={({ route }) => ({ title:   route.params?.receiverName}) {tabBarVisible: false}} // route.params.contactUserName||Le titre peut être défini dynamiquement
//       />
//     </Stack.Navigator>
//   );
// };

// export default MessageStackNavigator;

// navigators/MessageStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessagesList from '../screens/main/messages/MessagesList';
import ChatScreen from '../screens/main/messages/ChatScreen';
import { COLORS } from '../constants/Theme'; // Assurez-vous d'importer vos constantes de couleurs

const Stack = createNativeStackNavigator();

const MessageStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MessagesList" 
        component={MessagesList} 
        options={{ 
          title: 'Messages',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ChatScreen" 
        component={ChatScreen} 
        options={({ route }) => ({ 
          title: route.params?.receiverName || 'Chat',
          // Pour React Navigation v6+, on utilise tabBarStyle pour cacher le bottom tab
          tabBarStyle: { display: 'none' },
          // Options de style du header
          headerStyle: {
            backgroundColor: COLORS.primary, // Utilisez votre couleur Zameen
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      />
    </Stack.Navigator>
  );
};

export default MessageStackNavigator;
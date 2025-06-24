import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyListingsScreen from '../screens/drawer/MyListingScreen';
import EditListingScreen from '../screens/drawer/EditListingScreen';
import PostAdScreen from '../screens/modals/PostAdScreen';

const Stack = createNativeStackNavigator();
const MylistingStack = ()=>{
  
   return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyListings" component={MyListingsScreen} />
        <Stack.Screen name="EditListing" component={EditListingScreen} />
        <Stack.Screen name="PostAdScreen" component={PostAdScreen} options={{ headerShown: false, title: 'Poster une annonce' }} />
        </Stack.Navigator>
)
}

export default MylistingStack
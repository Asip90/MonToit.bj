import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from '../screens/auth/LogInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';



const Stack = createNativeStackNavigator();

const AuthStack = () => {


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }} 
      />
    <Stack.Screen name="LogIn" component={LogInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: true, title: 'INSCRIPTION' }} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: true, title: 'MOTS DE PASSE OUBLIE' }} />
  </Stack.Navigator>
    )
}

export default AuthStack
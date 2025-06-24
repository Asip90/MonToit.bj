import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../screens/home/Home';
import Profile from '../screens/profile';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons  } from '@expo/vector-icons';
import Messages from '../screens/Messages/Messages';
import Parameter from '../screens/parameter';
import Notification from '../screens/Notifications/notification';
import { COLORS } from '../outils/constant';
import { styles } from './styles';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
        //   position: 'absolute',
          backgroundColor: COLORS.main,
          // borderTopWidth: 0,
          // elevation: 0,
        }
      }}
    >
      <Tab.Screen 
        name="home" 
        component={Home}
        style = {styles.icon}
        options={{
          tabBarLabelStyle: {
            color: styles.icon.Colors,
          },
          tabBarIcon: () => (
            <MaterialCommunityIcons name="home"  size={24} color={styles.icon.Colors} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Notification" 
        component={Notification}
        options={{
          tabBarLabelStyle: {
            color: styles.icon.Colors,
          },
          tabBarIcon: () => (
            <MaterialCommunityIcons name='notification-clear-all' size={24}   color={styles.icon.Colors}/>
          ),
        }}
      />
       <Tab.Screen 
        name="Messages" 
        component={Messages}
        options={{
          tabBarLabelStyle: {
            color: styles.icon.Colors,
          },
          tabBarIcon: () => (
            <MaterialCommunityIcons name='message' size={24}    color={styles.icon.Colors}/>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name='account' size={24}   color={styles.icon.Colors}/>
          ),
          tabBarLabelStyle: {
            color: styles.icon.Colors,
          },
        }}
      />
      <Tab.Screen 
        name="Parameter" 
        component={Parameter}
        options={{
          tabBarLabelStyle: {
            color: styles.icon.Colors,
          },
          tabBarIcon: () => (
            <AntDesign name="setting" size={24} color={styles.icon.Colors}/>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTab;

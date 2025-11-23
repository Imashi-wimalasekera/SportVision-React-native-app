import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreenFixed';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let name = 'circle';
        if (route.name === 'Home') name = 'home';
        else if (route.name === 'Favourites') name = 'heart';
        else if (route.name === 'Notifications') name = 'bell';
        else if (route.name === 'Profile') name = 'user';
        return <Feather name={name} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

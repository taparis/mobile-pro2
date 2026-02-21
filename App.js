import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'

import Profile from './src/screens/Profile';
import Planner from './src/screens/Planner';
import Timetable from './src/screens/Timetable';
import Dashboard from './src/screens/Dashboard';

const Tap = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tap.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Timetable') {
            iconName = focused ? 'time' : 'time-outline'
          } else if (route.name === 'Planner') {
            iconName = focused ? 'newspaper' : 'newspaper-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }
          return <Ionicons name={iconName} color={color} size={size} />
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'black',
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'pink',
        },
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: 'pink',
          position: 'absolute',
          elevation: 10
        }
      })}>
        <Tap.Screen
          name='Dashboard'
          component={Dashboard}
          options={{ title: 'Dashboard' }}
        />
        <Tap.Screen
          name='Timetable'
          component={Timetable}
          options={{ title: 'Timetable' }}
        />
        <Tap.Screen
          name='Planner'
          component={Planner}
          options={{ title: 'Activity & Planner' }}
        />
        <Tap.Screen
          name='Profile'
          component={Profile}
          options={{ title: 'Profile' }}
        />
      </Tap.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});
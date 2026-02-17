import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'

import Profile from './src/screens/Profile';
import Planner from './src/screens/ActivitynPlanner';
import TimeTable from './src/screens/TimeTable';
import Dashboard from './src/screens/Dashboard';
import EditProfile from './src/screens/EditProfile';

const Tap = createBottomTabNavigator()

const Stack = createNativeStackNavigator()

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'pink',
        },
        headerTintColor: 'black',
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Tap.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'TimeTable') {
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
          options={{ title: 'Home' }}
        />
        <Tap.Screen
          name='TimeTable'
          component={TimeTable}
          options={{ title: 'TimeTable' }}
        />
        <Tap.Screen
          name='Planner'
          component={Planner}
          options={{ title: 'Activity & Planner' }}
        />
        <Tap.Screen
          name='Profile'
          component={ProfileStackNavigator}
          options={{ headerShown: false }}
        />
      </Tap.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});
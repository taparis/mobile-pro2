import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Profile from "./src/screens/Profile";
import Planner from "./src/screens/ActivitynPlanner";
import TimeTable from "./src/screens/TimeTable";
import Dashboard from "./src/screens/Dashboard";
import EditProfile from "./src/screens/EditProfile";
import DetailClass from "./src/screens/DetailClass";
import AddClass from "./src/screens/AddClass";
import EditClass from "./src/screens/EditClass";
import DetailExam from "./src/screens/DetailExam";
import { ClassProvider } from "./src/context/ClassContext";
import Register from "./src/screens/Register";
import Login from "./src/screens/Login";
import { UserProvider } from './src/context/UserContext';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "pink",
        },
        headerTintColor: "black",
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={Profile}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "Edit Profile" }}
      />
    </Stack.Navigator>
  );
};

const TimeTableStack = createNativeStackNavigator();

const TimeTableStackNavigator = () => {
  return (
    <ClassProvider>
      <TimeTableStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "pink",
          },
          headerTintColor: "black",
        }}
      >
        <TimeTableStack.Screen
          name="TimeTableHome"
          component={TimeTable}
          options={{ title: "TimeTable" }}
        />
        <TimeTableStack.Screen
          name="DetailClass"
          component={DetailClass}
          options={({ navigation }) => ({
            title: "Detail Class",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("AddClass", { type: "class" })}
                style={{}}
              >
                <Ionicons name="add-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />

        <TimeTableStack.Screen
          name="DetailExam"
          component={DetailExam}
          options={({ navigation }) => ({
            title: "Detail Exam",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("EditClass")}
                style={{}}
              >
                <Ionicons name="add-outline" size={28} color="black" />
              </TouchableOpacity>
            ),
          })}
        />

        <TimeTableStack.Screen
          name="EditClass"
          component={EditClass}
          options={{ title: "Edit Class" }}
        />
        <TimeTableStack.Screen
          name="AddClass"
          component={AddClass}
          options={{ title: "Add Class" }}
        />
      </TimeTableStack.Navigator>
    </ClassProvider>
  );
};

const MainTabStack = createNativeStackNavigator();

const MainTab = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Dashboard") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "TimeTable") {
              iconName = focused ? "time" : "time-outline";
            } else if (route.name === "Planner") {
              iconName = focused ? "newspaper" : "newspaper-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }
            return <Ionicons name={iconName} color={color} size={size} />;
          },
          tabBarActiveTintColor: "red",
          tabBarInactiveTintColor: "black",
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: "pink",
          },
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "pink",
            position: "absolute",
            elevation: 10,
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            title: 'Dashboard', headerShown: true,
            headerTitleStyle: { fontWeight: 'bold', fontSize: 30 },
            headerTitleContainerStyle: { left: 8 }
          }}
        />
        <Tab.Screen
          name="TimeTable"
          component={TimeTableStackNavigator}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Planner"
          component={Planner}
          options={{ title: "Activity & Planner" }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackNavigator}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
    <NavigationContainer>
      <MainTabStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "pink",
          },
          headerTintColor: "black",
        }}
      >
        <MainTabStack.Screen
          name="Register"
          component={Register}
          options={{ title: "Register" }}
        />
        <MainTabStack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login" }}
        />
        <MainTabStack.Screen
          name="MainTab"
          component={MainTab}
          options={{ headerShown: false }}
        />
      </MainTabStack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({});

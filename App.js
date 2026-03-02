import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Profile from "./src/screens/Profile";
import Planner from "./src/screens/ActivityPlannerScreen";
import AddPlannerScreen from "./src/screens/AddPlannerScreen";
import TimeTable from "./src/screens/TimeTable";
import Dashboard from "./src/screens/Dashboard";
import EditProfile from "./src/screens/EditProfile";
import DetailClass from "./src/screens/DetailClass";
import AddClass from "./src/screens/AddClass";
import EditClass from "./src/screens/EditClass";
import DetailExam from "./src/screens/DetailExam";
import AddExam from "./src/screens/AddExam";
import EditExam from "./src/screens/EditExam";
import Register from "./src/screens/Register";
import Login from "./src/screens/Login";

import { ClassProvider } from "./src/context/ClassContext";
import { UserProvider } from "./src/context/UserContext";
import { PlannerProvider } from "./src/context/PlannerContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TimeTableStack = createNativeStackNavigator();
const MainTabStack = createNativeStackNavigator();

const ProfileStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "pink" },
      headerTintColor: "black",
    }}
  >
    <Stack.Screen name="ProfileHome" component={Profile} options={{ title: "Profile", headerTitleStyle: { fontWeight: "bold", fontSize: 30 } }} />
    <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: "Edit Profile" }} />
  </Stack.Navigator>
);


const TimeTableStackNavigator = () => (
  <TimeTableStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "pink" },
      headerTintColor: "black",
    }}
  >
    <TimeTableStack.Screen
      name="TimeTableHome"
      component={TimeTable}
      options={{ title: "TimeTable",
        headerTitleStyle: { fontWeight: "bold", fontSize: 30 }
      }}
    />
    <TimeTableStack.Screen
      name="DetailClass"
      component={DetailClass}
      options={({ navigation }) => ({
        title: "Detail Class",
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddClass", { type: "class" })}>
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
          <TouchableOpacity onPress={() => navigation.navigate("AddExam")}>
            <Ionicons name="add-outline" size={28} color="black" />
          </TouchableOpacity>
        ),
      })}
    />
    <TimeTableStack.Screen name="EditClass" component={EditClass} options={{ title: "Edit Class" }} />
    <TimeTableStack.Screen name="AddClass" component={AddClass} options={{ title: "Add Class" }} />
    <TimeTableStack.Screen name="EditExam" component={EditExam} options={{ title: "Edit Exam" }} />
    <TimeTableStack.Screen name="AddExam" component={AddExam} options={{ title: "Add Exam" }} />
  </TimeTableStack.Navigator>
);

const MainTab = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        const icons = {
          Dashboard: focused ? "home" : "home-outline",
          TimeTable: focused ? "time" : "time-outline",
          Planner: focused ? "newspaper" : "newspaper-outline",
          Profile: focused ? "person" : "person-outline",
        };
        return <Ionicons name={icons[route.name]} color={color} size={size} />;
      },
      tabBarActiveTintColor: "red",
      tabBarInactiveTintColor: "black",
      headerTintColor: "black",
      headerStyle: { backgroundColor: "pink" },
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
        title: "Dashboard",
        headerShown: true,
        headerTitleStyle: { fontWeight: "bold", fontSize: 30 },
        headerTitleContainerStyle: { left: 8 },
      }}
    />
    <Tab.Screen
      name="TimeTable"
      component={TimeTableStackNavigator}
      options={{ headerShown: false,
        headerTitleStyle: { fontWeight: "bold", fontSize: 30 }
       }}
    />
    <Tab.Screen name="Planner" component={PlannerStackNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const PlannerStack = createNativeStackNavigator();

const PlannerStackNavigator = () => {
  return (
    <PlannerProvider>
      <PlannerStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "pink" },
          headerTintColor: "black",
        }}
      >
        <PlannerStack.Screen
          name="PlannerHome"
          component={Planner}
          options={{ title: "Activity & Planner",
            headerTitleStyle: { fontWeight: "bold", fontSize: 30 }
           }}  // ← ชื่อ header
        />
        <PlannerStack.Screen
          name="AddPlanner"
          component={AddPlannerScreen}
          options={{ title: "Add Activity & Planner",
            headerTitleStyle: { fontWeight: "bold", fontSize: 25 }
          }}
        />
        <PlannerStack.Screen
          name="EditPlanner"
          component={AddPlannerScreen}
          options={{ title: "Edit Activity & Planner",
            headerTitleStyle: { fontWeight: "bold", fontSize: 25 }
          }}
        />
      </PlannerStack.Navigator>
    </PlannerProvider>
  );
};

export default function App() {
  return (
    <UserProvider>
      <ClassProvider>
        <NavigationContainer>
          <MainTabStack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "pink" },
              headerTintColor: "black",
            }}
          >
            {/* <MainTabStack.Screen name="Register" component={Register} options={{ title: "Register" }} /> */}
            {/* <MainTabStack.Screen name="Login" component={Login} options={{ title: "Login" }} /> */}
            <MainTabStack.Screen
              name="MainTab"
              component={MainTab}
              options={{ headerShown: false }}
            />
          </MainTabStack.Navigator>
        </NavigationContainer>
      </ClassProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({});
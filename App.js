import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screens
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

// Context Providers
import { ClassProvider } from "./src/context/ClassContext";
import { UserContext, UserProvider } from "./src/context/UserContext";
import { PlannerProvider } from "./src/context/PlannerContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TimeTableStack = createNativeStackNavigator();
const PlannerStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Profile
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerStyle: { backgroundColor: "pink" }, headerTintColor: "black" }}>
    <ProfileStack.Screen
      name="ProfileHome"
      component={Profile}
      options={{ title: "Profile", headerTitleStyle: { fontWeight: "bold", fontSize: 30 } }} />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ title: "Edit Profile" }} />
  </ProfileStack.Navigator>
);

//TimeTable
const TimeTableStackNavigator = () => (
  <TimeTableStack.Navigator screenOptions={{ headerStyle: { backgroundColor: "pink" }, headerTintColor: "black" }}>
    <TimeTableStack.Screen
      name="TimeTableHome"
      component={TimeTable}
      options={{ title: "TimeTable", headerTitleStyle: { fontWeight: "bold", fontSize: 30 } }} />
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
      })} />
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
      })} />
    <TimeTableStack.Screen
      name="EditClass"
      component={EditClass}
      options={{ title: "Edit Class" }} />
    <TimeTableStack.Screen
      name="AddClass"
      component={AddClass}
      options={{ title: "Add Class" }} />
    <TimeTableStack.Screen
      name="EditExam"
      component={EditExam}
      options={{ title: "Edit Exam" }} />
    <TimeTableStack.Screen
      name="AddExam"
      component={AddExam}
      options={{ title: "Add Exam" }} />
  </TimeTableStack.Navigator>
);

//Planner
const PlannerStackNavigator = () => (
  <PlannerStack.Navigator screenOptions={{ headerStyle: { backgroundColor: "pink" }, headerTintColor: "black" }}>
    <PlannerStack.Screen
      name="PlannerHome"
      component={Planner}
      options={{ title: "Activity & Planner", headerTitleStyle: { fontWeight: "bold", fontSize: 30 } }} />
    <PlannerStack.Screen
      name="AddPlanner"
      component={AddPlannerScreen}
      options={{ title: "Add Activity & Planner" }} />
    <PlannerStack.Screen
      name="EditPlanner"
      component={AddPlannerScreen}
      options={{ title: "Edit Activity & Planner" }} />
  </PlannerStack.Navigator>
);

//BottomTab
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
      headerStyle: { backgroundColor: "pink" },
      tabBarStyle: { height: 60, backgroundColor: "pink", paddingBottom: 5, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    })}
  >
    <Tab.Screen
      name="Dashboard"
      component={Dashboard}
      options={{ title: "Dashboard", headerTitleStyle: { fontWeight: "bold", fontSize: 30 } }} />
    <Tab.Screen
      name="TimeTable"
      component={TimeTableStackNavigator}
      options={{ headerShown: false }} />
    <Tab.Screen
      name="Planner"
      component={PlannerStackNavigator}
      options={{ headerShown: false }} />
    <Tab.Screen
      name="Profile"
      component={ProfileStackNavigator}
      options={{ headerShown: false }} />
  </Tab.Navigator>
);

//Auth
const AppContent = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="pink" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainApp" component={MainTab} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <UserProvider>
      <ClassProvider>
        <PlannerProvider>
          <AppContent />
        </PlannerProvider>
      </ClassProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({});
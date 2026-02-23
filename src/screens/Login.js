import React, { useState, useContext } from "react";
import {View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView} from "react-native";
import { UserContext } from "../context/UserContext";
import TextFormInput from "../components/TextFormInput";

const Login = ({ navigation }) => {
  const { state } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill in all fields.");
    }

    const foundUser = state.users?.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      return Alert.alert("Error", "Invalid email or password.");
    }

    Alert.alert("Success", "Login successful!", [
      {
        text: "OK",
        onPress: () => navigation.replace("MainTab")
      }
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Login</Text>

      <TextFormInput
        label="Email"
        value={email}
        placeholder="Enter your email"
        onChangeText={setEmail}
      />

      <TextFormInput
        label="Password"
        value={password}
        placeholder="Enter your password"
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerRedirect}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.redirectText}>
          Don't have an account?{" "}
          <Text style={{ color: "#ff6d9b", fontWeight: "bold" }}>
            Sign Up
          </Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#ff6d9b",
    padding: 15,
    marginTop: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerRedirect: {
    marginTop: 20,
    alignItems: "center",
  },
  redirectText: {
    fontSize: 14,
    color: "#555",
  },
});

export default Login;
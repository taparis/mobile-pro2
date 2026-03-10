import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { UserContext } from "../context/UserContext";
import TextFormInput from "../components/TextFormInput";
import { FontText } from "../components/CustomFont";

import { auth } from "../service/firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ navigation }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill in all fields.");
    }

    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log("Login Successful")
    } catch (error) {
      console.error(error)
      let errorMessage = "Invalid input"
      if (error.code === 'auth/user-not-found') errorMessage = " No user found"
      if (error.code === 'auth/wrong-password') errorMessage = " ่Invalid Password"
      if (error.code === 'auth/invalid-email') errorMessage = " Invalid Email"

      Alert.alert("Login Failed", errorMessage)
    } finally {
      setLoading(false)
    }
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <FontText style={styles.header}>Login</FontText>

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
        <FontText style={styles.buttonText}>Login</FontText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerRedirect}
        onPress={() => navigation.navigate("Register")}
      >
        <FontText style={styles.redirectText}>
          Don't have an account?{" "}
          <FontText style={{ color: "#ff6d9b", fontWeight: "bold" }}>
            Sign Up
          </FontText>
        </FontText>
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
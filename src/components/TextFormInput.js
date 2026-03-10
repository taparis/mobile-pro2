import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { FontText } from "./CustomFont";

const TextFormInput = ({ label, value, onChangeText, placeholder, secureTextEntry = false }) => {
  return (
    <View style={styles.container}>
      <FontText style={styles.label}>{label}</FontText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: 'pink',
    borderRadius: 10,
    paddingHorizontal: 13,
    width: '100%',
    fontSize: 16,
    marginBottom: 5,
    backgroundColor: 'white'
  },
});

export default TextFormInput;

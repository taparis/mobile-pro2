import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const TextFormInput = ({
  label,
  value,
  onChangeText,
  placeholder
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
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
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
  },
});

export default TextFormInput;

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const SelectFormInput = ({
  label,
  value,
  onValueChange,
  placeholder,
  options = []
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
        >
          <Picker.Item label={placeholder} value="" />
          {options.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
          ))}
        </Picker>
      </View>
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
  pickerWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default SelectFormInput;

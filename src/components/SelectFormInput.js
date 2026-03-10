import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontText } from "./CustomFont";

const SelectFormInput = ({ label, value, onValueChange, placeholder, options = [] }) => {
  return (
    <View style={styles.container}>
      <FontText style={styles.label}>{label}</FontText>
      <View style={styles.pickerBorder}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          dropdownIconColor="pink"
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
    fontSize: 18,
    marginBottom: 5,
  },
  pickerBorder: {
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

export default SelectFormInput;

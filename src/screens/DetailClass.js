import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClassContext } from "../context/ClassContext";

const DetailClass = ({ navigation}) => {
  const { classes } = useContext(ClassContext);


  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.frame}>
            <View style={styles.infoBox}>
              <Text style={styles.text}>{item.code}</Text>
              <Text style={styles.text}>{item.subject}</Text>
              <Text style={styles.text}>{item.room}</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("EditClass", { item: item })
              }
            >
              <Ionicons name="create-outline" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  frame: {
    flexDirection: "row",
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "pink",
    alignItems: "center",
    backgroundColor: "pink",
    marginTop: 20,
  },
  infoBox: {
    marginLeft: 15,
    flex: 1,
    alignItems: "center",
  },
  editButton: {
    
  },
});

export default DetailClass;

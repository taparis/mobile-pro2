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

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("th-TH");
};

const getDayName = (date) => {
  if (!date) return "";

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(date).getDay()];
};

const getDayColor = (date) => {
  const day = new Date(date).getDay();

  const colors = [
    "#FFD6D6", // Sun
    "#FFE66D", // Mon (เหลือง)
    "#FFB3D1", // Tue (ชมพู)
    "#B5EAD7", // Wed
    "#C7CEEA", // Thu
    "#FFDAC1", // Fri
    "#E2F0CB", // Sat
  ];

  return colors[day];
};

const formatTime = (time) => {
  if (!time) return "--:--";
  return new Date(time).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
const DetailClass = ({ navigation }) => {

  const { classes } = useContext(ClassContext);

  const sortedClasses = classes
    .filter((i) => i.type !== "exams")
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;

      const dayA = new Date(a.date).getDay();
      const dayB = new Date(b.date).getDay();

      if (dayA !== dayB) {
        return dayA - dayB;
      }

      return new Date(a.starts) - new Date(b.starts);
    });



  return (
    <View style={styles.container}>
      <FlatList
        data={sortedClasses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.frame}>

            <View
              style={[
                styles.dayBox,
                { backgroundColor: getDayColor(item.date) }
              ]}
            >
              <Text style={styles.date}>
                {getDayName(item.date)}
              </Text>
              <Text style={styles.time}>
                {formatTime(item.starts)} - {formatTime(item.ends)}
              </Text>
            </View>

            {/* เพิ่มข้อมูลตารางเรียน */}
            <View style={styles.infoBox}>
              <Text style={styles.text}>{item.code}</Text>
              <Text style={styles.text}>{item.subject}</Text>
              <Text style={styles.text}>{item.room}</Text>
            </View>


            {/* ปุ่มกดเพิ่มข้อมูลตารางเรียน   */}
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  frame: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBD1D8",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 20,
    position: "relative"
  },
  infoBox: {
    marginLeft: 15,
    flex: 1,
    justifyContent: "center",
    //paddingRight: 35,
  },
  editButton: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  dayBox: {
    width: 150,
    height: 90,
    borderRadius: 20,
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  date: {
    fontWeight: "bold",
    fontSize: 18,
  },
  time: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "500",
  },

});

export default DetailClass;

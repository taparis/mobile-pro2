import { Ionicons } from "@expo/vector-icons";
import React, { act, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";

const TimeTable = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("class");

  return (
    <View style={styles.container}>
      <View style={styles.buttonSchedule}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "class" && styles.activeTab]}
          onPress={() => setActiveTab("class")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "class" && styles.activeTabText,
            ]}
          >
            Class Schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "exam" && styles.activeTab]}
          onPress={() => setActiveTab("exam")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "exam" && styles.activeTabText,
            ]}
          >
            Exam Schedule
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.classText}>
          {activeTab === "class" ? "Class Schedule" : "Exam Schedule"}
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              activeTab === "class" ? "DetailClass" : "DetailExam",
            )
          }
        >
          <Ionicons name="create-outline" size={40} color="black" />
        </TouchableOpacity>
      </View>

      {activeTab === "class" ? (
        <Text style={styles.placeholder}>ตารางเรียน</Text>
    ) :(
        <Text style={styles.placeholder}>ตารางสอบ</Text>
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  buttonSchedule: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,

  },
  tabButton: {
    width: "50%",
    padding: 15,
    marginTop: 15,
    backgroundColor: "pink",
    borderRadius: 60,
    alignItems: "center",
    marginLeft: 5
  },
  tabText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    
  },
  activeTab: {
    backgroundColor: "#FF5C8A",
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
   
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
    width: "90%",
  },
  classText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    marginTop: 30,
    textAlign: "center",
    color: "#302e2e",
  },
});

export default TimeTable;

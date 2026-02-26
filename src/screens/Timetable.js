import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ClassContext } from "../context/ClassContext";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const DAY_COLORS = ["#FFE66D", "#FFB3D1", "#B5EAD7", "#C7CEEA", "#FFDAC1"];
const DAY_WIDTH = 55;
const TIME_WIDTH = 50;

const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 40;

const TimeTable = ({ navigation }) => {
  const { classes, exams } = useContext(ClassContext);

  const [mode, setMode] = useState("class");

  const getDayIndex = (date) => {
    if (!date) return -1;
    const map = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
    const day = new Date(date).getDay();
    return map[day] ?? -1;
  };

  const getTopPosition = (time) => {
    const d = new Date(time);
    return ((d.getHours() - START_HOUR) * 60 + d.getMinutes()) / 60 * HOUR_HEIGHT;
  };

  const getHeight = (start, end) => {
    const diff = (new Date(end) - new Date(start)) / 60000;
    return Math.max((diff / 60) * HOUR_HEIGHT, 20);
  };

  const classData = classes.filter(
    (i) => i.type !== "exams" && i.date && i.starts && i.ends
  );

  const examData = (exams || []).filter(
    (i) => i.date && i.starts && i.ends
  );

  const displayData = mode === "exams" ? examData : classData;

  const renderDayHeader = () => (
    <View style={styles.dayHeaderRow}>
      <View style={{ width: TIME_WIDTH }} />
      {DAYS.map((day, index) => (
        <View key={index} style={[styles.dayHeader, { backgroundColor: DAY_COLORS[index] }]}>
          <Text style={styles.dayHeaderText}>{day}</Text>
        </View>
      ))}
    </View>
  );

  const renderHourLines = () => {
    const hours = [];
    for (let i = START_HOUR; i <= END_HOUR; i++) {
      const top = (i - START_HOUR) * HOUR_HEIGHT;
      hours.push(
        <View key={i}>
          <View style={[styles.hourLine, { top }]} />
          <Text style={[styles.hourText, { top: top - 9 }]}>
            {String(i).padStart(2, "0")}:00
          </Text>
        </View>
      );
    }
    return hours;
  };

  const renderDayColumns = () =>
    DAYS.map((_, i) => (
      <View
        key={i}
        style={[styles.dayColumn, { left: TIME_WIDTH + i * DAY_WIDTH }]}
      />
    ));

  return (
    <View style={styles.container}>

      {/* BUTTON CARD */}
      <View style={styles.buttonCard}>
        <Text style={styles.cardTitle}>Timetable</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.tabButton, mode === "class" && styles.activeTabButton]}
            onPress={() => setMode("class")}
          >
            <Text style={[styles.tabButtonText, mode === "class" && styles.activeTabText]}>
              Class{"\n"}Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, mode === "exams" && styles.activeTabButton]}
            onPress={() => setMode("exams")}
          >
            <Text style={[styles.tabButtonText, mode === "exams" && styles.activeTabText]}>
              Exam{"\n"}Schedule
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TITLE ROW */}
      <View style={styles.titleRow}>
        <Text style={styles.classText}>
          {mode === "exams" ? "Exam Schedule" : "Class Schedule"}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(mode === "exams" ? "DetailExam" : "DetailClass")
          }
        >
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* TABLE */}
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.table}>
          {renderDayHeader()}
          <View style={styles.gridArea}>
            {renderHourLines()}
            {renderDayColumns()}

            {displayData.map((item, index) => {
              const dayIdx = getDayIndex(item.date);
              if (dayIdx < 0) return null;
              const left = TIME_WIDTH + dayIdx * DAY_WIDTH;

              return (
                <View
                  key={index}
                  style={[
                    styles.classBlock,
                    {
                      left,
                      top: getTopPosition(item.starts),
                      height: getHeight(item.starts, item.ends),
                    },
                  ]}
                >
                  <Text style={styles.classBlockText} numberOfLines={2}>{item.code}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TimeTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  // BUTTON CARD
  buttonCard: {
    width: "90%",
    backgroundColor: "#ffb6c1",
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#ffcfe0",
    borderRadius: 20,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#ff68b9",
  },
  tabButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  activeTabText: {
    color: "#fff",
  },

  // TITLE
  titleRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 6,
  },
  classText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  // TABLE
  scrollArea: {
    width: "90%",
  },
  table: {
    width: TIME_WIDTH + DAY_WIDTH * 5,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  dayHeaderRow: {
    flexDirection: "row",
    height: 36,
  },
  dayHeader: {
    width: DAY_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  dayHeaderText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  gridArea: {
    height: (END_HOUR - START_HOUR) * HOUR_HEIGHT,
    position: "relative",
  },
  hourLine: {
    position: "absolute",
    left: TIME_WIDTH,
    right: 0,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  hourText: {
    position: "absolute",
    left: 3,
    fontSize: 10,
    color: "#fff",
    backgroundColor: "#f3a6c4",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  dayColumn: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#e0e0e0",
  },
  classBlock: {
    position: "absolute",
    width: DAY_WIDTH - 6,
    marginLeft: 3,
    backgroundColor: "#ffb6c1",
    borderRadius: 8,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  classBlockText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
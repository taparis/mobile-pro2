import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ClassContext } from "../context/ClassContext";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const DAY_BG_COLORS = ["#FFE66D", "#FFB3D1", "#B5EAD7", "#C7CEEA", "#FFDAC1"];
const DAY_TO_COL = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };

const DAY_WIDTH = 55;
const TIME_WIDTH = 50;
const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 40;

const getTopPosition = (time) => {
  const d = new Date(time);
  return ((d.getHours() - START_HOUR) * 60 + d.getMinutes()) / 60 * HOUR_HEIGHT;
};

const getHeight = (start, end) => {
  const diffMin = (new Date(end) - new Date(start)) / 60000;
  return Math.max((diffMin / 60) * HOUR_HEIGHT, 18);
};

const TimeTable = ({ navigation }) => {
  const { classes, exams } = useContext(ClassContext);
  const [mode, setMode] = useState("class");

  // Class: จาก classes[] เท่านั้น
  const classData = classes.filter((i) => i.date && i.starts && i.ends);

  // Exam: จาก exams[] เท่านั้น
  const examData = exams.filter((i) => i.date && i.starts && i.ends);

  const displayData = mode === "exams" ? examData : classData;

  const renderDayHeader = () => (
    <View style={styles.dayHeaderRow}>
      <View style={{ width: TIME_WIDTH }} />
      {DAYS.map((day, i) => (
        <View key={i} style={[styles.dayHeader, { backgroundColor: DAY_BG_COLORS[i] }]}>
          <Text style={styles.dayHeaderText}>{day}</Text>
        </View>
      ))}
    </View>
  );

  const renderHourLines = () => {
    const rows = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      const top = (h - START_HOUR) * HOUR_HEIGHT;
      rows.push(
        <View key={h}>
          <View style={[styles.hourLine, { top }]} />
          <Text style={[styles.hourText, { top: top - 9 }]}>
            {String(h).padStart(2, "0")}:00
          </Text>
        </View>
      );
    }
    return rows;
  };

  const renderDayColumns = () =>
    DAYS.map((_, i) => (
      <View key={i} style={[styles.dayColumn, { left: TIME_WIDTH + i * DAY_WIDTH }]} />
    ));

  const renderBlocks = () =>
    displayData.map((item, index) => {
      const colIdx = DAY_TO_COL[new Date(item.date).getDay()];
      if (colIdx === undefined) return null;

      const left = TIME_WIDTH + colIdx * DAY_WIDTH;
      const top = getTopPosition(item.starts);
      const height = getHeight(item.starts, item.ends);
      const blockColor = DAY_BG_COLORS[colIdx];

      return (
        <View
          key={item.id || index}
          style={[
            styles.classBlock,
            { left: left + 2, top, height, width: DAY_WIDTH - 6, backgroundColor: blockColor },
          ]}
        >
          <Text style={styles.classBlockText} numberOfLines={3}>
            {item.code || item.subject}
          </Text>
        </View>
      );
    });

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
            <Text style={styles.tabButtonText}>Class{"\n"}Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, mode === "exams" && styles.activeTabButton]}
            onPress={() => setMode("exams")}
          >
            <Text style={styles.tabButtonText}>Exam{"\n"}Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TITLE ROW */}
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>
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

      {/* TABLE — แสดงตารางเสมอ ไม่มี empty state */}
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.table}>
          {renderDayHeader()}
          <View style={styles.gridArea}>
            {renderHourLines()}
            {renderDayColumns()}
            {renderBlocks()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TimeTable;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },

  buttonCard: {
    width: "90%", backgroundColor: "#ffb6c1",
    borderRadius: 20, padding: 15, marginTop: 15, alignItems: "center",
  },
  cardTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 12 },
  buttonRow: { flexDirection: "row", gap: 10 },
  tabButton: {
    flex: 1, paddingVertical: 10, paddingHorizontal: 5,
    backgroundColor: "#ffcfe0", borderRadius: 20, alignItems: "center",
  },
  activeTabButton: { backgroundColor: "#ff68b9" },
  tabButtonText: { fontSize: 14, color: "#fff", fontWeight: "bold", textAlign: "center" },

  titleRow: {
    width: "90%", flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginTop: 12, marginBottom: 6,
  },
  titleText: { fontSize: 20, fontWeight: "bold" },

  scrollArea: { width: "90%" },
  table: {
    width: TIME_WIDTH + DAY_WIDTH * 5,
    borderWidth: 1.5, borderColor: "#ccc",
    borderRadius: 12, overflow: "hidden", marginBottom: 20,
  },
  dayHeaderRow: { flexDirection: "row", height: 36 },
  dayHeader: { width: DAY_WIDTH, justifyContent: "center", alignItems: "center" },
  dayHeaderText: { fontWeight: "bold", fontSize: 12 },
  gridArea: { height: (END_HOUR - START_HOUR) * HOUR_HEIGHT, position: "relative" },
  hourLine: {
    position: "absolute", left: TIME_WIDTH, right: 0, height: 1, backgroundColor: "#e0e0e0",
  },
  hourText: {
    position: "absolute", left: 3, fontSize: 10, color: "#fff",
    backgroundColor: "#f3a6c4", paddingHorizontal: 4, paddingVertical: 1, borderRadius: 6,
  },
  dayColumn: {
    position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "#e0e0e0",
  },
  classBlock: {
    position: "absolute",
    borderRadius: 6,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },
  classBlockText: {
    fontSize: 9, fontWeight: "bold", color: "#333", textAlign: "center",
  },
});
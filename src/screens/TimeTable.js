import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ClassContext } from "../context/ClassContext";
import { useIsFocused } from "@react-navigation/native";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const DAY_BG_COLORS = ["#FFE66D", "#FFB3D1", "#B5EAD7", "#FFDAC1", "#C7CEEA"];
const DAY_TO_COL = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
//test
const DAY_WIDTH = 62;
const TIME_WIDTH = 48;
const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 50;

const ensureData = (val) => {
  if (!val) return new Date();
  return val instanceof Date ? val : new Date(val)
}

const getTopPosition = (time) => {
  const d = ensureData(time);
  return ((d.getHours() - START_HOUR) + d.getMinutes() / 60) * HOUR_HEIGHT;
};

const getHeight = (start, end) => {
  const diffMin = (new Date(end) - new Date(start)) / 60000;
  return Math.max((diffMin / 60) * HOUR_HEIGHT, 20);
};

const TimeTable = ({ navigation }) => {
  const { classes, exams } = useContext(ClassContext);
  const isFocused = useIsFocused();
  const [mode, setMode] = useState("class");

  const classData = classes.filter((i) => i.dayOfWeek !== undefined && i.starts && i.ends);
  const examData = exams.filter((i) => i.date && i.starts && i.ends);
  const displayData = mode === "exams" ? examData : classData;

  useEffect(() => {
    
  }, [isFocused]);

  const renderDayHeader = () => (
    <View style={styles.dayHeaderRow}>
      <View style={{ width: TIME_WIDTH, backgroundColor: "#f8f8f8", borderRightWidth: 1, borderColor: "#ddd" }} />
      {DAYS.map((day, i) => (
        <View key={i} style={[styles.dayHeader, { backgroundColor: DAY_BG_COLORS[i] }]}>
          <Text style={styles.dayHeaderText}>{day}</Text>
        </View>
      ))}
    </View>
  );

  const renderGrid = () => {
    const rows = [];
    const totalHours = END_HOUR - START_HOUR;
    for (let h = 0; h <= totalHours; h++) {
      const actualHour = START_HOUR + h;
      const top = h * HOUR_HEIGHT;
      rows.push(
        <View key={h} style={[styles.hourRow, { top }]}>
          <View style={styles.timeLabelBox}>
            <Text style={styles.hourText}>
              {String(actualHour).padStart(2, "0")}:00
            </Text>
          </View>
          <View style={styles.hourLine} />
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
    // รองรับทั้ง dayOfWeek ใหม่ และ date เก่า
    const dow = item.dayOfWeek !== undefined
      ? item.dayOfWeek
      : (item.date ? new Date(item.date).getDay() : null);

    const colIdx = DAY_TO_COL[dow];
    if (colIdx === undefined || colIdx === null) return null;

    const left = TIME_WIDTH + colIdx * DAY_WIDTH;
    const top = getTopPosition(item.starts);
    const height = getHeight(item.starts, item.ends);
    const blockColor = DAY_BG_COLORS[colIdx];

    return (
      <View
        key={item.id || index}
        style={[
          styles.classBlock,
          { left: left + 3, top, height, width: DAY_WIDTH - 7, backgroundColor: blockColor },
        ]}
      >
        <Text style={styles.classBlockCode} numberOfLines={1}>{item.code}</Text>
        <Text style={styles.classBlockText} numberOfLines={2}>{item.subject}</Text>
        {item.room ? (
          <Text style={styles.classBlockRoom} numberOfLines={1}>{item.room}</Text>
        ) : null}
      </View>
    );
  });

  return (
    <View style={styles.container}>
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

      <View style={styles.titleRow}>
        <Text style={styles.titleText}>
          {mode === "exams" ? "Exam Schedule" : "Class Schedule"}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(mode === "exams" ? "DetailExam" : "DetailClass")}
        >
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.tableWrapper}>
          <View style={styles.table}>
            {renderDayHeader()}
            <View style={[styles.gridArea, { height: (END_HOUR - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT }]}>
              {renderGrid()}
              {renderDayColumns()}
              {renderBlocks()}
            </View>
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

  scrollArea: { width: "100%" },

  tableWrapper: {
    alignItems: "center",
    paddingBottom: 20,
  },

  table: {
    width: TIME_WIDTH + DAY_WIDTH * 5,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
  },

  dayHeaderRow: {
    flexDirection: "row",
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  dayHeader: {
    width: DAY_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderColor: "#ddd",
  },
  dayHeaderText: { fontWeight: "bold", fontSize: 12 },

  gridArea: { position: "relative" },

  hourRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  timeLabelBox: {
    width: TIME_WIDTH,
    alignItems: "flex-end",
    paddingRight: 6,
  },
  hourText: {
    fontSize: 10,
    color: "#888",
    fontWeight: "600",
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },

  dayColumn: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#e8e8e8",
  },

  classBlock: {
    position: "absolute",
    borderRadius: 6,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    elevation: 2,
  },
  classBlockCode: {
  fontSize: 8,
  fontWeight: "bold",
  color: "#555",
  textAlign: "center",
},
classBlockText: {
  fontSize: 9,
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
},
classBlockRoom: {
  fontSize: 7,
  color: "#555",
  textAlign: "center",
  marginTop: 1,
},
}); 
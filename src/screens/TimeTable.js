import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { ClassContext } from "../context/ClassContext";
import { useIsFocused } from "@react-navigation/native";
import { FontText } from "../components/CustomFont";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const DAY_BG_COLORS = ["#FFE66D", "#FFB3D1", "#B5EAD7", "#FFDAC1", "#C7CEEA"];
const DAY_TO_COL = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };

const DAY_WIDTH = 62;
const TIME_WIDTH = 48;
const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 50;

const ensureData = (val) => {
  if (!val) return new Date();
  return val instanceof Date ? val : new Date(val);
};

const getTopPosition = (time) => {
  const d = ensureData(time);
  return ((d.getHours() - START_HOUR) + d.getMinutes() / 60) * HOUR_HEIGHT;
};

const getHeight = (start, end) => {
  const diffMin = (new Date(end) - new Date(start)) / 60000;
  return Math.max((diffMin / 60) * HOUR_HEIGHT, 20);
};

const getDayName = (date) => {
  if (!date) return "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(date).getDay()];
};

const getDayColor = (date) => {
  if (!date) return "#eee";
  const colors = ["#FFD6D6", "#FFE66D", "#FFB3D1", "#B5EAD7", "#FFDAC1", "#C7CEEA", "#E2F0CB"];
  return colors[new Date(date).getDay()];
};

const formatTime = (time) => {
  if (!time) return "--:--";
  return new Date(time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const formatDateShort = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const TimeTable = ({ navigation }) => {
  const { classes, exams } = useContext(ClassContext);
  const isFocused = useIsFocused();
  const [mode, setMode] = useState("class");

  const classData = classes.filter((i) => i.dayOfWeek !== undefined && i.starts && i.ends);
  const examData = [...exams.filter((i) => i.date && i.starts && i.ends)].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  useEffect(() => {}, [isFocused]);

  const renderDayHeader = () => (
    <View style={styles.dayHeaderRow}>
      <View style={{ width: TIME_WIDTH, backgroundColor: "#f8f8f8", borderRightWidth: 1, borderColor: "#ddd" }} />
      {DAYS.map((day, i) => (
        <View key={i} style={[styles.dayHeader, { backgroundColor: DAY_BG_COLORS[i] }]}>
          <FontText style={styles.dayHeaderText}>{day}</FontText>
        </View>
      ))}
    </View>
  );

  const renderGrid = () => {
    const rows = [];
    for (let h = 0; h <= END_HOUR - START_HOUR; h++) {
      rows.push(
        <View key={h} style={[styles.hourRow, { top: h * HOUR_HEIGHT }]}>
          <View style={styles.timeLabelBox}>
            <FontText style={styles.hourText}>{String(START_HOUR + h).padStart(2, "0")}:00</FontText>
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
    classData.map((item, index) => {
      const dow = item.dayOfWeek !== undefined ? item.dayOfWeek : (item.date ? new Date(item.date).getDay() : null);
      const colIdx = DAY_TO_COL[dow];
      if (colIdx === undefined || colIdx === null) return null;
      return (
        <View
          key={item.id || index}
          style={[styles.classBlock, {
            left: TIME_WIDTH + colIdx * DAY_WIDTH + 3,
            top: getTopPosition(item.starts),
            height: getHeight(item.starts, item.ends),
            width: DAY_WIDTH - 7,
            backgroundColor: DAY_BG_COLORS[colIdx],
          }]}
        >
          <FontText style={styles.classBlockCode} numberOfLines={1}>{item.code}</FontText>
          <FontText style={styles.classBlockText} numberOfLines={2}>{item.subject}</FontText>
          {item.room ? <FontText style={styles.classBlockRoom} numberOfLines={1}>{item.room}</FontText> : null}
        </View>
      );
    });

  const renderExamCard = ({ item }) => {
    const dayColor = getDayColor(item.date);
    return (
      <View style={[styles.examCard, { backgroundColor: dayColor + "55" }]}>
        {/* Left: day box */}
        <View style={[styles.examDayBox, { backgroundColor: dayColor }]}>
          <FontText style={styles.examDayName}>{getDayName(item.date)}</FontText>
          <FontText style={styles.examDateShort}>{formatDateShort(item.date)}</FontText>
          <View style={styles.examTimeDivider} />
          <FontText style={styles.examTime}>{formatTime(item.starts)}</FontText>
          <FontText style={styles.examTime}>{formatTime(item.ends)}</FontText>
        </View>

        {/* Right: info */}
        <View style={styles.examInfo}>
          <View style={styles.examCodeRow}>
            <View style={[styles.examCodeBadge, { backgroundColor: dayColor }]}>
              <FontText style={styles.examCodeBadgeText}>{item.code}</FontText>
            </View>
          </View>
          <FontText style={styles.examSubject}>{item.subject}</FontText>
          {item.room ? (
            <View style={styles.examRoomRow}>
              <Ionicons name="location-outline" size={13} color="#888" />
              <FontText style={styles.examRoom}> {item.room}</FontText>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top card */}
      <View style={styles.buttonCard}>
        <FontText style={styles.cardTitle}>Timetable</FontText>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.tabButton, mode === "class" && styles.activeTabButton]}
            onPress={() => setMode("class")}
          >
            <FontText style={styles.tabButtonText}>Class{"\n"}Schedule</FontText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, mode === "exams" && styles.activeTabButton]}
            onPress={() => setMode("exams")}
          >
            <FontText style={styles.tabButtonText}>Exam{"\n"}Schedule</FontText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Title row */}
      <View style={styles.titleRow}>
        <FontText style={styles.titleText}>
          {mode === "exams" ? "Exam Schedule" : "Class Schedule"}
        </FontText>
        <TouchableOpacity onPress={() => navigation.navigate(mode === "exams" ? "DetailExam" : "DetailClass")}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {mode === "exams" ? (
        <FlatList
          data={examData}
          keyExtractor={(item) => item.id?.toString()}
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={60} color="#ffb6c1" />
              <FontText style={styles.emptyText}>ยังไม่มีตารางสอบ</FontText>
              <FontText style={styles.emptySubText}>กดปุ่มแก้ไขเพื่อเพิ่มตารางสอบ</FontText>
            </View>
          }
          renderItem={renderExamCard}
        />
      ) : (
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
      )}
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
    flex: 1, paddingVertical: 10,
    backgroundColor: "#ffcfe0", borderRadius: 20, alignItems: "center",
  },
  activeTabButton: { backgroundColor: "#ff68b9" },
  tabButtonText: { fontSize: 14, color: "#fff", fontWeight: "bold", textAlign: "center" },

  titleRow: {
    width: "90%", flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginTop: 12, marginBottom: 6,
  },
  titleText: { fontSize: 20, fontWeight: "bold" },

  // ── Exam cards ──
  examCard: {
    flexDirection: "row",
    borderRadius: 20,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  examDayBox: {
    width: 78,
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  examDayName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  examDateShort: { fontSize: 12, color: "#555", fontWeight: "600", marginTop: 2 },
  examTimeDivider: { width: 40, height: 1, backgroundColor: "rgba(0,0,0,0.15)", marginVertical: 6 },
  examTime: { fontSize: 11, color: "#444", lineHeight: 16 },
  examInfo: { flex: 1, marginLeft: 14, justifyContent: "center" },
  examCodeRow: { marginBottom: 6 },
  examCodeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  examCodeBadgeText: { fontSize: 12, fontWeight: "bold", color: "#555" },
  examSubject: { fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 4 },
  examRoomRow: { flexDirection: "row", alignItems: "center" },
  examRoom: { fontSize: 13, color: "#777" },

  // ── Empty ──
  emptyContainer: { alignItems: "center", paddingTop: 60 },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#aaa", marginTop: 12 },
  emptySubText: { fontSize: 14, color: "#ccc", marginTop: 4 },

  // ── Class grid ──
  scrollArea: { width: "100%" },
  tableWrapper: { alignItems: "center", paddingBottom: 20 },
  table: {
    width: TIME_WIDTH + DAY_WIDTH * 5,
    borderWidth: 1.5, borderColor: "#ccc",
    borderRadius: 12, overflow: "hidden",
  },
  dayHeaderRow: { flexDirection: "row", height: 40, borderBottomWidth: 1, borderColor: "#ccc" },
  dayHeader: {
    width: DAY_WIDTH, justifyContent: "center", alignItems: "center",
    borderLeftWidth: 1, borderColor: "#ddd",
  },
  dayHeaderText: { fontWeight: "bold", fontSize: 12 },
  gridArea: { position: "relative" },
  hourRow: { position: "absolute", left: 0, right: 0, flexDirection: "row", alignItems: "center" },
  timeLabelBox: { width: TIME_WIDTH, alignItems: "flex-end", paddingRight: 6 },
  hourText: { fontSize: 10, color: "#888", fontWeight: "600" },
  hourLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  dayColumn: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "#e8e8e8" },
  classBlock: {
    position: "absolute", borderRadius: 6, padding: 3,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.8)", elevation: 2,
  },
  classBlockCode: { fontSize: 8, fontWeight: "bold", color: "#555", textAlign: "center" },
  classBlockText: { fontSize: 9, fontWeight: "bold", color: "#333", textAlign: "center" },
  classBlockRoom: { fontSize: 7, color: "#555", textAlign: "center", marginTop: 1 },
});
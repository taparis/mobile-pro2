import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { FontText } from "../components/CustomFont";
import { Ionicons } from "@expo/vector-icons";
import { ClassContext } from "../context/ClassContext";
import { PlannerContext } from "../context/PlannerContext";

const formatTime = (time) => {
  if (!time) return "--:--";
  return new Date(time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// time travel filter
const getFilteredData = (data, range, type = "class") => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const endOfMonth = new Date(today);
  endOfMonth.setDate(today.getDate() + 30);

  return data.filter((item) => {
    let itemDate;

    // แปลงวัน
    if (type === "task" && item.date) {
      const parts = item.date.split("/");
      if (parts.length === 3) {
        itemDate = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    } else if (item.date) {
      itemDate = new Date(item.date);
    }

    if (!itemDate) return false;
    itemDate.setHours(0, 0, 0, 0);

    if (range === "today") {
      return itemDate.getTime() === now.getTime();
    } else if (range === "week") {
      return itemDate >= now && itemDate <= endOfWeek;
    } else if (range === "month") {
      return itemDate >= now && itemDate <= endOfMonth;
    }
    return true;
  });
};

const getNextClass = (classes, range) => {
  if (!classes || classes.length === 0) return null;

  const now = new Date();
  const todayDay = now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const toMin = (t) => new Date(t).getHours() * 60 + new Date(t).getMinutes();

  if (range === "today") {
    const todayUpcoming = classes
      .filter((c) => (c.dayOfWeek === todayDay) && toMin(c.ends) > nowMin)
      .sort((a, b) => toMin(a.starts) - toMin(b.starts));

    return todayUpcoming.length > 0 ? { item: todayUpcoming[0], daysUntil: 0 } : null;
  }

  // นับจากวันต่อไป
  for (let i = 1; i <= (range === "week" ? 7 : 30); i++) {
    const targetDay = (todayDay + i) % 7;
    const found = classes
      .filter((c) => c.dayOfWeek === targetDay)
      .sort((a, b) => toMin(a.starts) - toMin(b.starts));

    if (found.length > 0) return { item: found[0], daysUntil: i };
  }
  return null;
};

const daysLabel = (d) => {
  if (d === 0) return "วันนี้";
  if (d === 1) return "พรุ่งนี้";
  return `อีก ${d} วัน`;
};

const Dashboard = ({ navigation }) => {
  const [filterMode, setFilterMode] = useState("today"); // ใช้ชื่อให้ตรงกับ UI

  const { classes = [], exams = [] } = useContext(ClassContext);
  const { tasks = [] } = useContext(PlannerContext);

  const displayClasses = getNextClass(classes, filterMode);
  const filteredExams = getFilteredData(exams, filterMode, "exam").sort((a, b) => new Date(a.date) - new Date(b.date));
  const filteredTasks = getFilteredData(tasks, filterMode, "task");

  const nextClass = displayClasses?.item || null;
  const nextDaysUntil = displayClasses?.daysUntil ?? null;
  const nextExam = filteredExams[0] || null;
  const nextTask = filteredTasks[0] || null;

  const getDaysDiff = (dateStr, isTask = false) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let target;
    if (isTask) {
      const [d, m, y] = dateStr.split("/").map(Number);
      target = new Date(y, m - 1, d);
    } else {
      target = new Date(dateStr);
    }
    target.setHours(0, 0, 0, 0);
    return Math.round((target - today) / 86400000);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* ── Filter Bar (Time Travel) ── */}
      <View style={styles.filterContainer}>
        {['today', 'week', 'month'].map((mode) => (
          <TouchableOpacity
            key={mode}
            onPress={() => setFilterMode(mode)}
            style={[styles.filterTab, filterMode === mode && styles.activeFilterTab]}
          >
            <FontText style={[styles.filterTabText, filterMode === mode && styles.activeFilterTabText]}>
              {mode === 'today' ? 'วันนี้' : mode === 'week' ? 'สัปดาห์นี้' : 'เดือนนี้'}
            </FontText>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Next Class ── */}
      <View style={styles.cardContainer}>
        <FontText style={styles.headlabel}>Next Class</FontText>
        <View style={styles.card}>
          {nextClass ? (
            <>
              <View style={styles.timeRow}>
                <View style={styles.timeBox}>
                  <FontText style={styles.timeBoxlabel}>
                    {formatTime(nextClass.starts)} - {formatTime(nextClass.ends)}
                  </FontText>
                </View>
                <FontText style={styles.daysLabel}>{daysLabel(nextDaysUntil)}</FontText>
              </View>
              <FontText style={styles.textlabel}>ชื่อวิชา : {nextClass.subject}</FontText>
              <FontText style={styles.textlabel}>ห้องที่เรียน : {nextClass.room || "-"}</FontText>
            </>
          ) : (
            <View style={styles.emptyRow}>
              <Ionicons name="calendar-outline" size={20} color="#ffb6c1" />
              <FontText style={styles.emptyText}>ไม่มีคลาสเรียนในช่วงนี้</FontText>
            </View>
          )}
        </View>
      </View>

      {/* ── Upcoming Exam ── */}
      <View style={styles.cardContainer}>
        <FontText style={styles.headlabel}>Upcoming Exam</FontText>
        <View style={styles.card}>
          {nextExam ? (
            <>
              <View style={styles.timeRow}>
                <View style={styles.timeBox}>
                  <FontText style={styles.timeBoxlabel}>
                    {formatTime(nextExam.starts)} - {formatTime(nextExam.ends)}
                  </FontText>
                </View>
                <FontText style={styles.daysLabel}>{daysLabel(getDaysDiff(nextExam.date))}</FontText>
              </View>
              <FontText style={styles.textlabel}>ชื่อวิชา : {nextExam.subject}</FontText>
              <FontText style={styles.textlabel}>ห้องสอบ : {nextExam.room || "-"}</FontText>
            </>
          ) : (
            <View style={styles.emptyRow}>
              <Ionicons name="document-text-outline" size={20} color="#ffb6c1" />
              <FontText style={styles.emptyText}>ไม่มีตารางสอบในช่วงนี้</FontText>
            </View>
          )}
        </View>
      </View>

      {/* ── Your Task ── */}
      <View style={styles.cardContainer}>
        <FontText style={styles.headlabel}>Your Task</FontText>
        <View style={styles.card}>
          {!nextTask ? (
            <View style={styles.emptyRow}>
              <Ionicons name="clipboard-outline" size={20} color="#ffb6c1" />
              <FontText style={styles.emptyText}>ยังไม่มี Task ในช่วงนี้</FontText>
            </View>
          ) : (
            <View style={styles.taskCard}>
              <View style={{ flex: 1 }}>
                <FontText style={styles.taskTitle}>{nextTask.desc}</FontText>
                <View style={styles.taskRow}>
                  <Ionicons name="calendar-outline" size={14} color="#ff6d9b" />
                  <FontText style={styles.taskSubText}>{nextTask.date}</FontText>
                </View>
                <View style={styles.taskRow}>
                  <Ionicons name="time-outline" size={14} color="#ff6d9b" />
                  <FontText style={styles.taskSubText}>{nextTask.start} - {nextTask.end}</FontText>
                </View>
              </View>
              <FontText style={styles.daysLabel}>{daysLabel(getDaysDiff(nextTask.date, true))}</FontText>
            </View>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Planner", { screen: "AddPlanner" })}
        >
          <FontText style={styles.buttonText}>Add Task</FontText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 25,
    marginTop: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 5,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeFilterTab: {
    backgroundColor: '#FF4D97',
  },
  filterTabText: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
  },
  activeFilterTabText: {
    color: '#fff',
  },
  cardContainer: { paddingHorizontal: 25, paddingTop: 20 },
  headlabel: { fontSize: 28, fontWeight: "bold", color: "#646567" },
  card: {
    backgroundColor: "#FFEAF3",
    padding: 20,
    borderRadius: 30,
    marginTop: 10,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  timeBox: {
    height: 28,
    backgroundColor: "#FF4D97",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  timeBoxlabel: { fontWeight: "bold", fontSize: 15, color: "#fff" },
  daysLabel: { fontSize: 14, fontWeight: "bold", color: "#FF4D97" },
  textlabel: { fontWeight: "bold", fontSize: 20, marginTop: 6, color: "#333" },
  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  emptyText: { fontSize: 15, color: "#bbb" },
  buttonContainer: { alignItems: "center", justifyContent: "center" },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 12,
    marginTop: 24,
    backgroundColor: "#FF4D97",
    borderRadius: 60,
  },
  buttonText: { fontWeight: "bold", color: "#fff", fontSize: 20 },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    elevation: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff3776",
    marginBottom: 5,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  taskSubText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#555",
  },
});

export default Dashboard;
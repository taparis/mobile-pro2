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
import { Ionicons } from "@expo/vector-icons";
import { ClassContext } from "../context/ClassContext";
import { PlannerContext } from "../context/PlannerContext";
import { auth } from "../service/firebaseconfig";

const formatTime = (time) => {
  if (!time) return "--:--";
  return new Date(time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getNextClass = (classes) => {
  if (!classes || classes.length === 0) return null;

  const now = new Date();
  const todayDay = now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // รองรับทั้ง dayOfWeek ใหม่ และ date เก่า
  const resolveDow = (c) =>
    c.dayOfWeek !== undefined
      ? c.dayOfWeek
      : c.date
        ? new Date(c.date).getDay()
        : null;

  const toMin = (t) => new Date(t).getHours() * 60 + new Date(t).getMinutes();

  const valid = classes.filter(
    (c) => resolveDow(c) !== null && c.starts && c.ends,
  );

  // หาวิชาวันนี้ที่ยังไม่ถึงเวลา
  const todayUpcoming = valid
    .filter((c) => resolveDow(c) === todayDay && toMin(c.starts) > nowMin)
    .sort((a, b) => toMin(a.starts) - toMin(b.starts));

  if (todayUpcoming.length > 0) return { item: todayUpcoming[0], daysUntil: 0 };

  // หาวิชาวันถัดไปใน 6 วันข้างหน้า
  for (let i = 1; i <= 6; i++) {
    const targetDay = (todayDay + i) % 7;
    const found = valid
      .filter((c) => resolveDow(c) === targetDay)
      .sort((a, b) => toMin(a.starts) - toMin(b.starts));
    if (found.length > 0) return { item: found[0], daysUntil: i };
  }

  return null;
};

const getNextExam = (exams) => {
  if (!exams || exams.length === 0) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = exams
    .filter((e) => e.date && new Date(e.date) >= today)
    .map((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return { ...e, daysUntil: Math.round((d - today) / 86400000) };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);
  return upcoming[0] || null;
};

const daysLabel = (d) => {
  if (d === 0) return "วันนี้";
  if (d === 1) return "พรุ่งนี้";
  return `อีก ${d} วัน`;
};

//หาtaskที่ใกล้ที่สุด
const getNextTask = (tasks) => {
  if (!tasks || tasks.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = tasks
    .map((t) => {
      if (!t.date) return null;

      // แปลง dd/mm/yyyy → Date object
      const [day, month, year] = t.date.split("/").map(Number);
      const taskDate = new Date(year, month - 1, day);
      taskDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((taskDate - today) / 86400000);

      return { ...t, daysUntil: diffDays };
    })
    .filter((t) => t && t.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return upcoming[0] || null;
};

const Dashboard = ({ navigation }) => {
  const context = useContext(ClassContext);
  const classes = context?.classes || [];
  const exams = context?.exams || [];

  const nextClassResult = getNextClass(classes);
  const nextClass = nextClassResult?.item || null;
  const nextDaysUntil = nextClassResult?.daysUntil ?? null;
  const nextExam = getNextExam(exams);

  const { tasks = [] } = useContext(PlannerContext);
  const nextTask = getNextTask(tasks);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* ── Next Class ── */}
      <View style={styles.cardContainer}>
        <Text style={styles.headlabel}>Next Class</Text>
        <View style={styles.card}>
          {nextClass ? (
            <>
              <View style={styles.timeRow}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeBoxlabel}>
                    {formatTime(nextClass.starts)} -{" "}
                    {formatTime(nextClass.ends)}
                  </Text>
                </View>
                {nextDaysUntil !== null && (
                  <Text style={styles.daysLabel}>
                    {daysLabel(nextDaysUntil)}
                  </Text>
                )}
              </View>
              <Text style={styles.textlabel}>
                ชื่อวิชา : {nextClass.subject}
              </Text>
              <Text style={styles.textlabel}>
                ห้องที่เรียน : {nextClass.room || "-"}
              </Text>
            </>
          ) : (
            <View style={styles.emptyRow}>
              <Ionicons name="calendar-outline" size={20} color="#ffb6c1" />
              <Text style={styles.emptyText}>ไม่มีคลาสในสัปดาห์นี้</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Upcoming Exam ── */}
      <View style={styles.cardContainer}>
        <Text style={styles.headlabel}>Upcoming Exam</Text>
        <View style={styles.card}>
          {nextExam ? (
            <>
              <View style={styles.timeRow}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeBoxlabel}>
                    {formatTime(nextExam.starts)} - {formatTime(nextExam.ends)}
                  </Text>
                </View>
                {nextExam.daysUntil !== undefined && (
                  <Text style={styles.daysLabel}>
                    {daysLabel(nextExam.daysUntil)}
                  </Text>
                )}
              </View>
              <Text style={styles.textlabel}>
                ชื่อวิชา : {nextExam.subject}
              </Text>
              <Text style={styles.textlabel}>
                ห้องสอบ : {nextExam.room || "-"}
              </Text>
            </>
          ) : (
            <View style={styles.emptyRow}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#ffb6c1"
              />
              <Text style={styles.emptyText}>ไม่มีตารางสอบที่ใกล้จะถึง</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Your Task ── */}
      <View style={styles.cardContainer}>
        <Text style={styles.headlabel}>Your Task</Text>
        <View style={styles.card}>
          {!nextTask ? (
            <View style={styles.emptyRow}>
              <Ionicons name="clipboard-outline" size={20} color="#ffb6c1" />
              <Text style={styles.emptyText}>
                ยังไม่มี Task ที่ใกล้จะถึง
              </Text>
            </View>
          ) : (
            <View style={styles.taskCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{nextTask.desc}</Text>

                <View style={styles.taskRow}>
                  <Ionicons name="calendar-outline" size={14} color="#ff6d9b" />
                  <Text style={styles.taskSubText}>
                    {nextTask.date}
                  </Text>
                </View>

                <View style={styles.taskRow}>
                  <Ionicons name="time-outline" size={14} color="#ff6d9b" />
                  <Text style={styles.taskSubText}>
                    {nextTask.start} - {nextTask.end}
                  </Text>
                </View>
              </View>

              <Text style={styles.daysLabel}>
                {daysLabel(nextTask.daysUntil)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Add Task Button ── */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Planner", {
              screen: "AddPlanner",
            })
          }
        >
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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

  taskbox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    marginTop: 8,
    height: 36,
    paddingHorizontal: 10,
  },
  taskBoxlabel: { fontSize: 16, color: "#444", flex: 1 },

  buttonContainer: { alignItems: "center", justifyContent: "center" },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 12,
    marginTop: 24,
    backgroundColor: "#FF4D97",
    borderRadius: 60,
  },
  buttonText: { fontWeight: "bold", color: "#fff", fontSize: 20 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ffb6c1",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalCancel: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    alignItems: "center",
  },
  modalCancelText: { fontWeight: "bold", color: "#555", fontSize: 15 },
  modalConfirm: {
    flex: 1,
    padding: 12,
    backgroundColor: "#FF4D97",
    borderRadius: 30,
    alignItems: "center",
  },
  modalConfirmText: { fontWeight: "bold", color: "#fff", fontSize: 15 },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff0f5",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
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

  deleteBtn: {
    paddingLeft: 10,
  },
});

export default Dashboard;

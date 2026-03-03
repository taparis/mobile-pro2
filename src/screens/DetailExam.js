import React, { useState, useContext, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClassContext } from "../context/ClassContext";

const getDayName = (date) => {
  if (!date) return "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(date).getDay()];
};

const getDayColor = (date) => {
  if (!date) return "#eee";
  const colors = ["#FFD6D6","#FFE66D","#FFB3D1","#B5EAD7","#FFDAC1","#C7CEEA","#E2F0CB"];
  return colors[new Date(date).getDay()];
};

const formatTime = (time) => {
  if (!time) return "--:--";
  return new Date(time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateShort = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const DetailExam = ({ navigation }) => {
  const { exams, dispatch } = useContext(ClassContext);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Detail Exam",
      headerStyle: { backgroundColor: "#ffb6c1" },
      headerTintColor: "#000",
      headerTitleStyle: { fontWeight: "bold" },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddExam")} style={{ marginRight: 8 }}>
          <Ionicons name="add" size={28} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // ✅ ดึงเฉพาะ exams array (เพิ่มจาก AddExam → ADD_EXAM → exams[])
  // ไม่ต้อง filter type เพราะ exams array มีแค่ exam อยู่แล้ว
  const sortedExams = [...exams].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  const handleDelete = () => {
    dispatch({ type: "DELETE_EXAM", payload: deleteTarget.id });
    setDeleteTarget(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedExams}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#ffb6c1" />
            <Text style={styles.emptyText}>ยังไม่มีตารางสอบ</Text>
            <Text style={styles.emptySubText}>กด + เพื่อเพิ่มตารางสอบ</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.frame}>
            {/* กล่องซ้าย: วันในสัปดาห์ + วันที่ + เวลา */}
            <View style={[styles.dayBox, { backgroundColor: getDayColor(item.date) }]}>
              <Text style={styles.dayText}>{getDayName(item.date)}</Text>
              <Text style={styles.dateShort}>{formatDateShort(item.date)}</Text>
              <Text style={styles.timeText}>{formatTime(item.starts)}</Text>
              <Text style={styles.timeText}>{formatTime(item.ends)}</Text>
            </View>

            {/* ข้อมูลวิชาสอบ */}
            <View style={styles.infoBox}>
              <Text style={styles.codeText}>{item.code}</Text>
              <Text style={styles.subjectText}>{item.subject}</Text>
              <Text style={styles.roomText}>
                <Ionicons name="location-outline" size={13} color="#888" /> {item.room}
              </Text>
            </View>

            {/* ปุ่ม edit / delete */}
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => navigation.navigate("EditExam", { item })}>
                <Ionicons name="create-outline" size={24} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setDeleteTarget(item)}>
                <Ionicons name="trash-outline" size={24} color="#ff3776" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal transparent visible={!!deleteTarget} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="warning-outline" size={40} color="#ff3776" style={{ marginBottom: 8 }} />
            <Text style={styles.modalTitle}>ลบตารางสอบ</Text>
            <Text style={styles.modalText}>ต้องการลบ "{deleteTarget?.subject}"?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setDeleteTarget(null)}>
                <Text style={styles.cancelBtnText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>ลบ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  emptyContainer: { alignItems: "center", paddingTop: 120 },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#aaa", marginTop: 12 },
  emptySubText: { fontSize: 14, color: "#ccc", marginTop: 4 },
  frame: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBD1D8",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 20,
  },
  dayBox: {
    width: 80,
    minHeight: 95,
    borderRadius: 16,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: { fontWeight: "bold", fontSize: 18, color: "#333" },
  dateShort: { fontSize: 12, color: "#555", fontWeight: "600", marginTop: 2 },
  timeText: { fontSize: 11, color: "#444", marginTop: 2 },
  infoBox: { marginLeft: 12, flex: 1 },
  codeText: { fontSize: 13, color: "#888", marginBottom: 2 },
  subjectText: { fontSize: 16, fontWeight: "bold", marginBottom: 3, color: "#333" },
  roomText: { fontSize: 13, color: "#666" },
  actionButtons: { alignItems: "center", justifyContent: "center", paddingLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#fff", borderRadius: 24, padding: 28, width: "78%", alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalText: { fontSize: 14, color: "#666", marginBottom: 24, textAlign: "center" },
  modalButtons: { flexDirection: "row", gap: 12, width: "100%" },
  cancelBtn: { flex: 1, padding: 13, backgroundColor: "#f0f0f0", borderRadius: 30, alignItems: "center" },
  cancelBtnText: { fontWeight: "bold", color: "#555" },
  deleteBtn: { flex: 1, padding: 13, backgroundColor: "#ff3776", borderRadius: 30, alignItems: "center" },
  deleteBtnText: { fontWeight: "bold", color: "#fff" },
});

export default DetailExam;
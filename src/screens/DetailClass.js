import React, { useState, useContext, useLayoutEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Modal,
  Alert,
} from "react-native";
import { FontText } from "../components/CustomFont";
import { Ionicons } from "@expo/vector-icons";
import { ClassContext } from "../context/ClassContext";

// รับ dayOfWeek (0-6) โดยตรง
const getDayName = (dayOfWeek) => {
  if (dayOfWeek === undefined || dayOfWeek === null) return "";
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dayOfWeek];
};

const getDayColor = (dayOfWeek) => {
  if (dayOfWeek === undefined || dayOfWeek === null) return "#eee";
  return ["#FFD6D6","#FFE66D","#FFB3D1","#B5EAD7","#FFDAC1","#C7CEEA","#E2F0CB"][dayOfWeek];
};

const formatTime = (time) => {
  if (!time) return "--:--";
  return new Date(time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

// resolve dayOfWeek รองรับทั้ง data เก่า (date) และใหม่ (dayOfWeek)
const resolveDayOfWeek = (item) => {
  if (item.dayOfWeek !== undefined) return item.dayOfWeek;
  if (item.date) return new Date(item.date).getDay();
  return null;
};

const DetailClass = ({ navigation }) => {
  const { classes, deleteClass } = useContext(ClassContext);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Detail Class",
      headerStyle: { backgroundColor: "#ffb6c1" },
      headerTintColor: "#000",
      headerTitleStyle: { fontWeight: "bold" },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddClass")} style={{ marginRight: 8 }}>
          <Ionicons name="add" size={28} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

  const sortedClasses = [...classes]
    .filter((i) => i.type !== "exams")
    .sort((a, b) => {
      const dayA = DAY_ORDER.indexOf(resolveDayOfWeek(a));
      const dayB = DAY_ORDER.indexOf(resolveDayOfWeek(b));
      if (dayA !== dayB) return dayA - dayB;
      return new Date(a.starts) - new Date(b.starts);
    });

  const handleDelete = async () => {
    try{
    await deleteClass(deleteTarget.id)
    setDeleteTarget(null)
    }catch(error){
      Alert.alert("Error", "ไม่สามารถลบข้อมูลได้")
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedClasses}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color="#ffb6c1" />
            <FontText style={styles.emptyText}>ยังไม่มีรายวิชา</FontText>
            <FontText style={styles.emptySubText}>กด + เพื่อเพิ่มรายวิชา</FontText>
          </View>
        }
        renderItem={({ item }) => {
          const dow = resolveDayOfWeek(item);
          return (
            <View style={styles.frame}>
              <View style={[styles.dayBox, { backgroundColor: getDayColor(dow) }]}>
                <FontText style={styles.dayText}>{getDayName(dow)}</FontText>
                <FontText style={styles.timeText}>{formatTime(item.starts)}</FontText>
                <FontText style={styles.timeText}>{formatTime(item.ends)}</FontText>
              </View>
              <View style={styles.infoBox}>
                <FontText style={styles.codeText}>{item.code}</FontText>
                <FontText style={styles.subjectText}>{item.subject}</FontText>
                <FontText style={styles.roomText}>
                  <Ionicons name="location-outline" size={13} color="#888" /> {item.room}
                </FontText>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => navigation.navigate("EditClass", { item })}>
                  <Ionicons name="create-outline" size={24} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setDeleteTarget(item)}>
                  <Ionicons name="trash-outline" size={24} color="#ff3776" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal transparent visible={!!deleteTarget} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="warning-outline" size={40} color="#ff3776" style={{ marginBottom: 8 }} />
            <FontText style={styles.modalTitle}>ลบรายวิชา</FontText>
            <FontText style={styles.modalText}>ต้องการลบ "{deleteTarget?.subject}"?</FontText>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setDeleteTarget(null)}>
                <FontText style={styles.cancelBtnText}>ยกเลิก</FontText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <FontText style={styles.deleteBtnText}>ลบ</FontText>
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
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#EBD1D8", marginHorizontal: 15,
    marginTop: 15, padding: 15, borderRadius: 20,
  },
  dayBox: {
    width: 80, minHeight: 85, borderRadius: 16,
    padding: 10, justifyContent: "center", alignItems: "center",
  },
  dayText: { fontWeight: "bold", fontSize: 20, color: "#333" },
  timeText: { fontSize: 12, color: "#444", fontWeight: "500", marginTop: 2 },
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

export default DetailClass;
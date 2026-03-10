import React, { useState, useContext } from "react";
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert, ScrollView,
} from "react-native";
import { FontText } from "../components/CustomFont";
import { Picker } from "@react-native-picker/picker";
import { ClassContext } from "../context/ClassContext";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../service/firebaseconfig";
import { currentTimestamp } from "firebase/firestore/pipelines";

const DAY_OPTIONS = [
  { label: "จันทร์ (Mon)", value: 1 },
  { label: "อังคาร (Tue)", value: 2 },
  { label: "พุธ (Wed)", value: 3 },
  { label: "พฤหัส (Thu)", value: 4 },
  { label: "ศุกร์ (Fri)", value: 5 },
];

const DAY_COLORS = {
  1: "#FFE66D", 2: "#FFB3D1", 3: "#B5EAD7", 4: "#FFDAC1", 5: "#C7CEEA",
};

const toMinutes = (t) => {
  const d = new Date(t);
  return d.getHours() * 60 + d.getMinutes();
};

const isTimeOverlap = (sA, eA, sB, eB) => {
  return toMinutes(sA) < toMinutes(eB) && toMinutes(sB) < toMinutes(eA);
};

const formatTime = (time) => {
  if (!time) return "--:--";
  return new Date(time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const AddClass = ({ navigation }) => {
  const { classes, addClass } = useContext(ClassContext);

  const [subject, setSubject] = useState("");
  const [code, setCode] = useState("");
  const [room, setRoom] = useState("");

  // แต่ละ row = { dayOfWeek, starts, ends }
  const [schedules, setSchedules] = useState([
    { dayOfWeek: 1, starts: null, ends: null },
  ]);

  const addRow = () => {
    setSchedules([...schedules, { dayOfWeek: 1, starts: null, ends: null }]);
  };

  const removeRow = (index) => {
    if (schedules.length === 1) return; // ต้องมีอย่างน้อย 1 row
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const showTimePicker = (index, field) => {
    DateTimePickerAndroid.open({
      value: schedules[index][field] ? new Date(schedules[index][field]) : new Date(),
      onChange: (event, selectedTime) => {
        if (selectedTime) updateRow(index, field, selectedTime);
      },
      mode: "time",
      is24Hour: true,
    });
  };

  // ตรวจ conflict ของ row นี้กับ classes ที่มีอยู่
  const getConflict = (row) => {
    if (!row.starts || !row.ends) return null;
    return classes
      .filter((c) =>
        c.type !== "exams" &&
        c.dayOfWeek !== undefined &&
        c.starts && c.ends &&
        c.code !== code  // ← exclude วิชาที่กำลังเพิ่มอยู่
      )
      .find((c) =>
        c.dayOfWeek === row.dayOfWeek &&
        isTimeOverlap(row.starts, row.ends, c.starts, c.ends)
      );
  };

  // ตรวจ conflict ระหว่าง row ใน form เดียวกัน
  const getInternalConflict = (index) => {
    const row = schedules[index];
    if (!row.starts || !row.ends) return null;
    return schedules.find((s, i) =>
      i !== index &&
      s.dayOfWeek === row.dayOfWeek &&
      s.starts && s.ends &&
      isTimeOverlap(row.starts, row.ends, s.starts, s.ends)
    );
  };

  const handleSubmit = async () => {
    if (!subject || !code) {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอก Subject และ Code");
      return;
    }

    for (let i = 0; i < schedules.length; i++) {
      const row = schedules[i];
      const dayLabel = DAY_OPTIONS.find(d => d.value === row.dayOfWeek)?.label || "";

      if (!row.starts || !row.ends) {
        Alert.alert("ข้อมูลไม่ครบ", `กรุณาเลือกเวลาในแถว "${dayLabel}"`);
        return;
      }
      if (toMinutes(row.starts) >= toMinutes(row.ends)) {
        Alert.alert("เวลาไม่ถูกต้อง", `แถว "${dayLabel}": เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด`);
        return;
      }
      const conflict = getConflict(row);
      if (conflict) {
        Alert.alert(
          "เวลาชนกัน!",
          `วิชา "${conflict.subject}" (${formatTime(conflict.starts)}–${formatTime(conflict.ends)}) ถูกลงในช่วงเวลานี้แล้ว`
        );
        return;
      }
      if (getInternalConflict(i)) {
        Alert.alert("เวลาชนกัน!", "มีวันและเวลาซ้ำกันในฟอร์มนี้");
        return;
      }
    }

    try {
      const currentUserId = auth.currentUser?.uid

      if (!currentUserId) {
        Alert.alert("Error", "กรุณาเข้าสู่ระบบใหม่")
        return
      }
      const promises = schedules.map((row) => {
        return addClass({
          subject,
          code,
          room,
          dayOfWeek: row.dayOfWeek,
          starts: row.starts,
          ends: row.ends,
          type: 'class',
          userId: currentUserId
        })
      })
      await Promise.all(promises)
      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", "ไม่สามารถบันทึกช้อมูลได้")
    }
  }



  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.inputContainer}>
        <FontText style={styles.title}>Add Class</FontText>

        <FontText style={styles.label}>Subject</FontText>
        <TextInput
          style={styles.input} placeholder="ชื่อวิชา"
          value={subject} onChangeText={setSubject}
        />

        <FontText style={styles.label}>Code</FontText>
        <TextInput
          style={styles.input} placeholder="รหัสวิชา"
          value={code} onChangeText={setCode}
        />

        <FontText style={styles.label}>Room</FontText>
        <TextInput
          style={styles.input} placeholder="ห้องเรียน"
          value={room} onChangeText={setRoom}
        />

        {/* วันที่เรียน */}
        <FontText style={styles.label}>วันที่เรียน</FontText>
        {schedules.map((row, index) => {
          const conflict = getConflict(row);
          const internalConflict = getInternalConflict(index);
          const hasConflict = !!(conflict || internalConflict);

          return (
            <View
              key={index}
              style={[styles.scheduleRow, hasConflict && styles.scheduleRowConflict]}
            >
              {/* Dropdown วัน */}
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={row.dayOfWeek}
                  onValueChange={(val) => updateRow(index, "dayOfWeek", val)}
                  style={styles.picker}
                  dropdownIconColor="#888"
                >
                  {DAY_OPTIONS.map((d) => (
                    <Picker.Item key={d.value} label={d.label} value={d.value} />
                  ))}
                </Picker>
              </View>

              {/* เวลาเริ่ม */}
              <TouchableOpacity
                style={styles.timePill}
                onPress={() => showTimePicker(index, "starts")}
              >
                <FontText style={[styles.timePillText, row.starts && styles.filledText]}>
                  {row.starts ? formatTime(row.starts) : "เริ่ม"}
                </FontText>
              </TouchableOpacity>

              <FontText style={styles.timeSep}>–</FontText>

              {/* เวลาสิ้นสุด */}
              <TouchableOpacity
                style={styles.timePill}
                onPress={() => showTimePicker(index, "ends")}
              >
                <FontText style={[styles.timePillText, row.ends && styles.filledText]}>
                  {row.ends ? formatTime(row.ends) : "สิ้นสุด"}
                </FontText>
              </TouchableOpacity>

              {/* ปุ่มลบ row */}
              <TouchableOpacity
                onPress={() => removeRow(index)}
                disabled={schedules.length === 1}
                style={{ opacity: schedules.length === 1 ? 0.3 : 1 }}
              >
                <Ionicons name="trash-outline" size={20} color="#ff3776" />
              </TouchableOpacity>

              {/* conflict warning */}
              {conflict && row.starts && row.ends && (
                <FontText style={styles.conflictText}>
                  ⚠️ ชนกับ "{conflict.subject}"
                </FontText>
              )}
              {internalConflict && (
                <FontText style={styles.conflictText}>⚠️ วันและเวลาซ้ำกันในฟอร์มนี้</FontText>
              )}
            </View>
          );
        })}

        {/* ปุ่มเพิ่มวัน */}
        <TouchableOpacity style={styles.addDayBtn} onPress={addRow}>
          <Ionicons name="add-circle-outline" size={18} color="#ff6d9b" />
          <FontText style={styles.addDayText}>เพิ่มวัน</FontText>
        </TouchableOpacity>

        {/* Cancel / Submit */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <FontText style={styles.cancelButtonText}>Cancel</FontText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <FontText style={styles.submitButtonText}>Submit</FontText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, backgroundColor: "#fff", alignItems: "center", paddingVertical: 20 },
  inputContainer: { padding: 20, backgroundColor: "pink", width: "90%", borderRadius: 30 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  label: { fontSize: 15, marginBottom: 5 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 },

  scheduleRow: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    gap: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  scheduleRowConflict: { borderColor: "#ff3776", backgroundColor: "#fff5f7" },

  pickerWrapper: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    overflow: "hidden",
    flex: 1,
    minWidth: 130,
    height: 40,
    justifyContent: "center",
  },
  picker: { height: 40, color: "#333" },

  timePill: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: "center",
    minWidth: 58,
    alignItems: "center",
  },
  timePillText: { color: "#aaa", fontSize: 13 },
  filledText: { color: "#333" },
  timeSep: { color: "#888", fontSize: 14 },

  conflictText: {
    width: "100%",
    color: "#ff3776",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },

  addDayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  addDayText: { color: "#ff6d9b", fontWeight: "bold", fontSize: 14 },

  cancelButton: {
    flex: 1, padding: 12, marginTop: 12,
    backgroundColor: "#ff9cbb", borderRadius: 60, alignItems: "center",
  },
  submitButton: {
    flex: 1, padding: 12, marginTop: 12,
    backgroundColor: "#ff6d9b", borderRadius: 60, alignItems: "center",
  },
  cancelButtonText: { fontSize: 16, fontWeight: "bold", color: "#ff3776" },
  submitButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});

export default AddClass;
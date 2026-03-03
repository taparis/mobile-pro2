import React, { useState, useContext } from "react";
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert, ScrollView,
} from "react-native";
import { ClassContext } from "../context/ClassContext";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const DAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

const DAY_COLORS = {
  0: "#FFD6D6", 1: "#FFE66D", 2: "#FFB3D1",
  3: "#B5EAD7", 4: "#C7CEEA", 5: "#FFDAC1", 6: "#E2F0CB",
};

const toMinutes = (t) => {
  const d = new Date(t);
  return d.getHours() * 60 + d.getMinutes();
};

const isTimeOverlap = (startsA, endsA, startsB, endsB) => {
  const s1 = toMinutes(startsA), e1 = toMinutes(endsA);
  const s2 = toMinutes(startsB), e2 = toMinutes(endsB);
  return s1 < e2 && s2 < e1;
};

const EditClass = ({ navigation, route }) => {
  const { classes, dispatch } = useContext(ClassContext);
  const item = route?.params?.item;

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>ไม่พบข้อมูล</Text>
      </View>
    );
  }

  const parseVal = (val) => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  };

  // รองรับ data เก่า (date) และใหม่ (dayOfWeek)
  const initialDayOfWeek =
    item.dayOfWeek !== undefined ? item.dayOfWeek
    : item.date ? new Date(item.date).getDay()
    : null;

  const [form, setForm] = useState({
    ...item,
    dayOfWeek: initialDayOfWeek,
    starts: parseVal(item.starts),
    ends: parseVal(item.ends),
  });

  // conflict check ยกเว้นตัวเอง
  const checkConflict = () => {
    if (form.dayOfWeek === null || !form.starts || !form.ends) return null;
    return classes
      .filter((c) =>
        c.type !== "exams" &&
        c.dayOfWeek !== undefined &&
        c.starts && c.ends &&
        c.id !== item.id   // ← exclude ตัวเอง
      )
      .find((c) =>
        c.dayOfWeek === form.dayOfWeek &&
        isTimeOverlap(form.starts, form.ends, c.starts, c.ends)
      );
  };

  const handleSubmit = () => {
    if (!form.subject || !form.code) {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอก Subject และ Code");
      return;
    }
    if (form.dayOfWeek === null || !form.starts || !form.ends) {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณาเลือกวันและเวลา");
      return;
    }
    if (toMinutes(form.starts) >= toMinutes(form.ends)) {
      Alert.alert("เวลาไม่ถูกต้อง", "เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
      return;
    }
    const conflict = checkConflict();
    if (conflict) {
      Alert.alert(
        "เวลาชนกัน!",
        `วิชา "${conflict.subject}" (${formatTime(conflict.starts)} - ${formatTime(conflict.ends)}) ถูกลงเรียนในช่วงเวลานี้แล้ว`
      );
      return;
    }
    dispatch({ type: "UPDATE_CLASS", payload: form });
    navigation.goBack();
  };

  const showTimePicker = (field) => {
    DateTimePickerAndroid.open({
      value: form[field] ? new Date(form[field]) : new Date(),
      onChange: (event, selectedTime) => {
        if (selectedTime) setForm({ ...form, [field]: selectedTime });
      },
      mode: "time",
      is24Hour: true,
    });
  };

  const formatTime = (time) => {
    if (!time) return "--:--";
    return new Date(time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const conflict = checkConflict();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Edit Class</Text>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input} value={form.subject}
          onChangeText={(t) => setForm({ ...form, subject: t })}
        />

        <Text style={styles.label}>Code</Text>
        <TextInput
          style={styles.input} value={form.code}
          onChangeText={(t) => setForm({ ...form, code: t })}
        />

        <Text style={styles.label}>Room</Text>
        <TextInput
          style={styles.input} value={form.room}
          onChangeText={(t) => setForm({ ...form, room: t })}
        />

        <Text style={styles.label}>Day</Text>
        <View style={styles.dayRow}>
          {DAYS.map((d) => {
            const isSelected = form.dayOfWeek === d.value;
            return (
              <TouchableOpacity
                key={d.value}
                style={[
                  styles.dayBtn,
                  isSelected && { backgroundColor: DAY_COLORS[d.value], borderColor: "transparent" },
                ]}
                onPress={() => setForm({ ...form, dayOfWeek: d.value })}
              >
                <Text style={[styles.dayBtnText, isSelected && styles.dayBtnTextSelected]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Time</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[styles.input, styles.fakeTimeInput]}
            onPress={() => showTimePicker("starts")}
          >
            <Text style={[styles.fakeInputText, form.starts && styles.filledText]}>
              {form.starts ? formatTime(form.starts) : "Starts"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.input, styles.fakeTimeInput]}
            onPress={() => showTimePicker("ends")}
          >
            <Text style={[styles.fakeInputText, form.ends && styles.filledText]}>
              {form.ends ? formatTime(form.ends) : "Ends"}
            </Text>
          </TouchableOpacity>
        </View>

        {conflict && (
          <View style={styles.conflictBanner}>
            <Text style={styles.conflictText}>
              ⚠️ เวลาชนกับ "{conflict.subject}" ({formatTime(conflict.starts)} - {formatTime(conflict.ends)})
            </Text>
          </View>
        )}

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, conflict && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!!conflict}
          >
            <Text style={styles.submitButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, backgroundColor: "#fff", alignItems: "center", paddingVertical: 20 },
  inputContainer: {
    padding: 20, backgroundColor: "pink",
    width: "85%", borderRadius: 30,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  label: { fontSize: 15, marginBottom: 5 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 },
  fakeTimeInput: { flex: 1, justifyContent: "center", marginBottom: 12 },
  fakeInputText: { color: "#aaa" },
  filledText: { color: "#000" },

  dayRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  dayBtn: {
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 20, borderWidth: 1.5, borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  dayBtnText: { fontSize: 13, color: "#aaa", fontWeight: "600" },
  dayBtnTextSelected: { color: "#333" },

  conflictBanner: {
    backgroundColor: "#fff3f3", borderWidth: 1,
    borderColor: "#ff3776", borderRadius: 10,
    padding: 10, marginBottom: 10,
  },
  conflictText: { color: "#ff3776", fontSize: 13, fontWeight: "500" },

  cancelButton: {
    flex: 1, padding: 12, marginTop: 12,
    backgroundColor: "#ff9cbb", borderRadius: 60, alignItems: "center",
  },
  submitButton: {
    flex: 1, padding: 12, marginTop: 12,
    backgroundColor: "#ff6d9b", borderRadius: 60, alignItems: "center",
  },
  disabledButton: { backgroundColor: "#ccc" },
  cancelButtonText: { fontSize: 16, fontWeight: "bold", color: "#ff3776" },
  submitButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});

export default EditClass;
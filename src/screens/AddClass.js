import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ClassContext } from "../context/ClassContext";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

// ตรวจสอบว่าวันในสัปดาห์ตรงกัน
const isSameWeekDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false;
  return new Date(dateA).getDay() === new Date(dateB).getDay();
};

// ตรวจสอบช่วงเวลาทับซ้อน
const isTimeOverlap = (startsA, endsA, startsB, endsB) => {
  const s1 = new Date(startsA).getTime();
  const e1 = new Date(endsA).getTime();
  const s2 = new Date(startsB).getTime();
  const e2 = new Date(endsB).getTime();
  return s1 < e2 && s2 < e1;
};

const AddClass = ({ navigation }) => {
  const { classes, dispatch } = useContext(ClassContext);

  const initialForm = {
    subject: "",
    code: "",
    room: "",
    date: null,
    starts: null,
    ends: null,
    type: "class",
  };

  const [form, setForm] = useState(initialForm);

  const checkConflict = () => {
    if (!form.date || !form.starts || !form.ends) return null;
    return classes
      .filter((c) => c.type !== "exams" && c.date && c.starts && c.ends)
      .find(
        (c) =>
          isSameWeekDay(form.date, c.date) &&
          isTimeOverlap(form.starts, form.ends, c.starts, c.ends)
      );
  };

  const handleSubmit = () => {
    if (!form.subject || !form.code) {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอก Subject และ Code");
      return;
    }
    if (!form.date || !form.starts || !form.ends) {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณาเลือกวันและเวลา");
      return;
    }
    if (new Date(form.starts) >= new Date(form.ends)) {
      Alert.alert("เวลาไม่ถูกต้อง", "เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
      return;
    }

    const conflict = checkConflict();
    if (conflict) {
      Alert.alert(
        "เวลาชนกัน!",
        `วิชา "${conflict.subject}" (${formatTime(conflict.starts)} - ${formatTime(conflict.ends)}) ถูกลงเรียนในช่วงเวลานี้แล้ว`,
        [{ text: "ตกลง" }]
      );
      return;
    }

    dispatch({ type: "ADD_CLASS", payload: form });
    navigation.goBack();
  };

  const handleCancel = () => navigation.goBack();

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: form.date || new Date(),
      onChange: (event, selectedDate) => {
        if (selectedDate) setForm({ ...form, date: selectedDate });
      },
      mode: "date",
      is24Hour: true,
    });
  };

  const showStartTimePicker = () => {
    DateTimePickerAndroid.open({
      value: form.starts || new Date(),
      onChange: (event, selectedTime) => {
        if (selectedTime) setForm({ ...form, starts: selectedTime });
      },
      mode: "time",
      is24Hour: true,
    });
  };

  const showEndTimePicker = () => {
    DateTimePickerAndroid.open({
      value: form.ends || new Date(),
      onChange: (event, selectedTime) => {
        if (selectedTime) setForm({ ...form, ends: selectedTime });
      },
      mode: "time",
      is24Hour: true,
    });
  };

  const formatDate = (date) => {
    if (!date) return "เลือกวัน";
    return date.toLocaleDateString("th-TH");
  };

  const formatTime = (time) => {
    if (!time) return "--:--";
    return new Date(time).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  };

  const conflict = checkConflict();

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Add Class</Text>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="ชื่อวิชา"
          value={form.subject}
          onChangeText={(t) => setForm({ ...form, subject: t })}
        />

        <Text style={styles.label}>Code</Text>
        <TextInput
          style={styles.input}
          placeholder="รหัสวิชา"
          value={form.code}
          onChangeText={(t) => setForm({ ...form, code: t })}
        />

        <Text style={styles.label}>Room</Text>
        <TextInput
          style={styles.input}
          placeholder="ห้องเรียน"
          value={form.room}
          onChangeText={(t) => setForm({ ...form, room: t })}
        />

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={[styles.input, styles.fakeInput]} onPress={showDatePicker}>
          <Text style={[styles.fakeInputText, form.date && styles.filledText]}>
            {formatDate(form.date)}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Time</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={[styles.input, styles.fakeTimeInput]} onPress={showStartTimePicker}>
            <Text style={[styles.fakeInputText, form.starts && styles.filledText]}>
              {form.starts ? formatTime(form.starts) : "เริ่ม"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.input, styles.fakeTimeInput]} onPress={showEndTimePicker}>
            <Text style={[styles.fakeInputText, form.ends && styles.filledText]}>
              {form.ends ? formatTime(form.ends) : "สิ้นสุด"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* แสดง warning เวลาชนแบบ real-time */}
        {conflict && (
          <View style={styles.conflictBanner}>
            <Text style={styles.conflictText}>
              ⚠️ เวลาชนกับ "{conflict.subject}" ({formatTime(conflict.starts)} - {formatTime(conflict.ends)})
            </Text>
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, conflict && styles.disabledButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  inputContainer: {
    padding: 20,
    backgroundColor: "pink",
    width: "85%",
    borderRadius: 30,
    marginTop: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  label: { fontSize: 15, marginBottom: 5 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 },
  fakeInput: { justifyContent: "center" },
  fakeTimeInput: { flex: 1, justifyContent: "center", marginBottom: 12 },
  fakeInputText: { color: "#aaa" },
  filledText: { color: "#000" },
  conflictBanner: {
    backgroundColor: "#fff3f3",
    borderWidth: 1,
    borderColor: "#ff3776",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
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

export default AddClass;
import React, { useState, useContext } from "react";
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert,
} from "react-native";
import { ClassContext } from "../context/ClassContext";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const toMinutes = (t) => {
  const d = new Date(t);
  return d.getHours() * 60 + d.getMinutes();
};

const isSameDate = (a, b) => {
  const da = new Date(a), db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth()   === db.getMonth()    &&
    da.getDate()    === db.getDate()
  );
};

const isTimeOverlap = (sA, eA, sB, eB) => {
  return toMinutes(sA) < toMinutes(eB) && toMinutes(sB) < toMinutes(eA);
};

const EditExam = ({ navigation, route }) => {
  const { exams, dispatch } = useContext(ClassContext);
  const item = route?.params?.item;

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>ไม่พบข้อมูล</Text>
      </View>
    );
  }

  const parseDate = (val) => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  };

  const [form, setForm] = useState({
    ...item,
    date: parseDate(item.date),
    starts: parseDate(item.starts),
    ends: parseDate(item.ends),
  });

  // conflict check ยกเว้นตัวเอง
  const checkConflict = () => {
    if (!form.date || !form.starts || !form.ends) return null;
    return exams.find((e) =>
      e.id !== item.id &&          // ← exclude ตัวเอง
      e.date && e.starts && e.ends &&
      isSameDate(form.date, e.date) &&
      isTimeOverlap(form.starts, form.ends, e.starts, e.ends)
    );
  };

  const formatDate = (date) => {
    if (!date) return "Select date";
    return new Date(date).toLocaleDateString("th-TH");
  };

  const formatTime = (time) => {
    if (!time) return "--:--";
    return new Date(time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
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
    if (toMinutes(form.starts) >= toMinutes(form.ends)) {
      Alert.alert("เวลาไม่ถูกต้อง", "เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
      return;
    }
    const conflict = checkConflict();
    if (conflict) {
      Alert.alert(
        "เวลาชนกัน!",
        `วิชา "${conflict.subject}" (${formatTime(conflict.starts)}–${formatTime(conflict.ends)}) ถูกลงในช่วงเวลานี้แล้ว`
      );
      return;
    }
    dispatch({ type: "UPDATE_EXAM", payload: form });
    navigation.goBack();
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: form.date ? new Date(form.date) : new Date(),
      onChange: (event, selectedDate) => {
        if (selectedDate) setForm({ ...form, date: selectedDate });
      },
      mode: "date",
      is24Hour: true,
    });
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

  const conflict = checkConflict();

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Edit Exam</Text>

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

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={[styles.input, styles.fakeInput]} onPress={showDatePicker}>
          <Text style={[styles.fakeInputText, form.date && styles.filledText]}>
            {formatDate(form.date)}
          </Text>
        </TouchableOpacity>

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

        {/* Real-time conflict warning */}
        {conflict && (
          <View style={styles.conflictBanner}>
            <Text style={styles.conflictText}>
              ⚠️ เวลาชนกับ "{conflict.subject}" ({formatTime(conflict.starts)}–{formatTime(conflict.ends)})
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  inputContainer: {
    padding: 20, backgroundColor: "pink",
    width: "85%", borderRadius: 30, marginTop: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  label: { fontSize: 15, marginBottom: 5 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 },
  fakeInput: { justifyContent: "center" },
  fakeTimeInput: { flex: 1, justifyContent: "center", marginBottom: 12 },
  fakeInputText: { color: "#aaa" },
  filledText: { color: "#000" },
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

export default EditExam;
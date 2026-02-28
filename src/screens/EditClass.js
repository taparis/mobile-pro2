import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ClassContext } from "../context/ClassContext";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const EditClass = ({ navigation, route }) => {
  const { dispatch } = useContext(ClassContext);
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

  const handleSubmit = () => {
    dispatch({ type: "UPDATE_CLASS", payload: form });
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

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
    if (!date) return "Select date";
    return date.toLocaleDateString("th-TH");
  };

  const formatTime = (time) => {
    if (!time) return "--:--";
    return time.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Edit Class</Text>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          value={form.subject}
          onChangeText={(t) => setForm({ ...form, subject: t })}
        />

        <Text style={styles.label}>Code</Text>
        <TextInput
          style={styles.input}
          value={form.code}
          onChangeText={(t) => setForm({ ...form, code: t })}
        />

        <Text style={styles.label}>Room</Text>
        <TextInput
          style={styles.input}
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
              {form.starts ? formatTime(form.starts) : "Starts"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.input, styles.fakeTimeInput]} onPress={showEndTimePicker}>
            <Text style={[styles.fakeInputText, form.ends && styles.filledText]}>
              {form.ends ? formatTime(form.ends) : "Ends"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  inputContainer: {
    padding: 20,
    backgroundColor: "pink",
    width: "85%",
    borderRadius: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  fakeInput: {
    justifyContent: "center",
  },
  fakeTimeInput: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 12,
  },
  fakeInputText: {
    color: "#aaa",
  },
  filledText: {
    color: "#000",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginTop: 12,
    backgroundColor: "#ff9cbb",
    borderRadius: 60,
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    padding: 12,
    marginTop: 12,
    backgroundColor: "#ff6d9b",
    borderRadius: 60,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff3776",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default EditClass;
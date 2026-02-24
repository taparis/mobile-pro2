import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Button,
} from "react-native";
import { ClassContext } from "../context/ClassContext";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const AddClass = ({ navigation, route }) => {
  const { dispatch } = useContext(ClassContext);

  dispatch({
    type: "ADD_CLASS",
    payload: { ...form, type }
  });

  const initialForm = {
    subject: "",
    code: "",
    room: "",
    date: null,
    starts: null,
    ends: null,
    type,
  }

  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    dispatch({ type: "ADD_CLASS", payload: { ...form, type: "exam" } });
    navigation.goBack();
  };

  const handleCancel = () => {
    setForm(initialForm);
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: form.date || new Date(),
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setForm({ ...form, date: selectedDate });
        }
      },
      mode: "date",
      is24Hour: true,
    });
  };

  const showStartTimePicker = () => {
    DateTimePickerAndroid.open({
      value: form.starts || new Date(),
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          setForm({ ...form, starts: selectedTime });
        }
      },
      mode: "time",
      is24Hour: true,
    });
  };

  const showEndTimePicker = () => {
    DateTimePickerAndroid.open({
      value: form.starts || new Date(),
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          setForm({ ...form, ends: selectedTime });
        }
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
    return time.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Add Class</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={form.subject}
            onChangeText={(t) => setForm({ ...form, subject: t })}
          />

          <Text style={styles.label}>Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Code"
            value={form.code}
            onChangeText={(t) => setForm({ ...form, code: t })}
          />

          <Text style={styles.label}>Room</Text>
          <TextInput
            style={styles.input}
            placeholder="Room"
            value={form.room}
            onChangeText={(t) => setForm({ ...form, room: t })}
          />

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={[styles.input, styles.fakeDateInput]}
            onPress={showDatePicker}>
            <Text style={[
              styles.fakeInputText,
              form.date && styles.filledText
            ]}>
              {form.date ? formatDate(form.date) : "Select date"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Time</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={[styles.input, styles.fakeTimeInput]}
              onPress={showStartTimePicker}
            >
              <Text style={styles.fakeInputText}>
                {form.starts ? formatTime(form.starts) : "Starts time"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.input, styles.fakeTimeInput]}
              onPress={showEndTimePicker}
            >
              <Text style={styles.fakeInputText}>
                {form.ends ? formatTime(form.ends) : "Ends time"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.summitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.summitButtonText}>Summit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: "pink",
    width: "80%",
    borderRadius: 30,
    marginTop: 20,
  },
  cancelButton: {
    width: "40%",
    padding: 10,
    marginTop: 15,
    backgroundColor: "#ff9cbb",
    borderRadius: 60,
  },
  summitButton: {
    width: "40%",
    padding: 10,
    marginTop: 15,
    backgroundColor: "#ff6d9b",
    borderRadius: 60,
    marginLeft: 20,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff3776",
    textAlign: "center",
  },
  summitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  fakeDateInput: {
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  fakeTimeInput: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  fakeInputText: {
    color: "#817b7b",
  },
  filledText: {
    color: "#000000"
  }
});

export default AddClass;

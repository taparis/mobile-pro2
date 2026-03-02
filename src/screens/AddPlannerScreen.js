import React, { useState, useContext, useEffect } from "react";
import {
    View, Text, TextInput, StyleSheet,
    TouchableOpacity, Alert, ScrollView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PlannerContext } from "../context/PlannerContext";

export default function AddPlannerScreen({ navigation, route }) {
    const { addTask, updateTask, removeTask } = useContext(PlannerContext);

    const editingTask = route?.params?.task || null;
    const isEdit = !!editingTask;

    const [desc, setDesc] = useState("");
    const [date, setDate] = useState(null);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

    const [showDate, setShowDate] = useState(false);
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);

    useEffect(() => {
        if (editingTask) {
            setDesc(editingTask.desc);
            const [d, m, y] = editingTask.date.split("/").map(Number);
            const [sh, sm] = editingTask.start.split(":").map(Number);
            const [eh, em] = editingTask.end.split(":").map(Number);
            setDate(new Date(y, m - 1, d));
            setStart(new Date(y, m - 1, d, sh, sm));
            setEnd(new Date(y, m - 1, d, eh, em));
        }
    }, []);

    const formatDate = d =>
        d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}` : "dd/mm/yyyy";

    const formatTime = t =>
        t ? `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}` : "Starts";

    const formatEnd = t =>
        t ? `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}` : "Ends";

    const submit = () => {
        if (!desc || !date || !start || !end) {
            Alert.alert("Error", "สร้างไร เอาให้ครบก่อน !");
            return;
        }
        const startDate = new Date(date);
        startDate.setHours(start.getHours(), start.getMinutes());
        const endDate = new Date(date);
        endDate.setHours(end.getHours(), end.getMinutes());

        if (!isEdit && startDate < new Date()) {
            Alert.alert("Error", "จะย้อนเวลารึไง ?");
            return;
        }
        if (endDate <= startDate) {
            Alert.alert("Error", "จบก่อนงานเริ่ม ?");
            return;
        }

        const months = ["January","February","March","April","May","June",
            "July","August","September","October","November","December"];

        const newTask = {
            id: editingTask?.id || Date.now().toString(),
            desc,
            date: formatDate(date),
            start: formatTime(start),
            end: formatEnd(end),
            month: months[date.getMonth()]
        };

        isEdit ? updateTask(newTask) : addTask(newTask);
        navigation.goBack();
    };

    const deleteTask = () => {
        Alert.alert("Delete", "ลบกิจกรรมนี้ ?", [
            { text: "Cancel" },
            { text: "Delete", onPress: () => { removeTask(editingTask.id); navigation.goBack(); } }
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>

            {/* Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{isEdit ? "Edit" : "NEW"}</Text>

                {/* Date */}
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity style={styles.pickerRow} onPress={() => setShowDate(true)}>
                    <Text style={styles.pickerText}>{formatDate(date)}</Text>
                    <Text style={styles.arrow}>▼</Text>
                </TouchableOpacity>

                {/* Time */}
                <Text style={styles.label}>Time</Text>
                <View style={styles.timeRow}>
                    <TouchableOpacity style={styles.pickerHalf} onPress={() => setShowStart(true)}>
                        <Text style={styles.pickerText}>{formatTime(start)}</Text>
                        <Text style={styles.arrow}>▼</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pickerHalf} onPress={() => setShowEnd(true)}>
                        <Text style={styles.pickerText}>{formatEnd(end)}</Text>
                        <Text style={styles.arrow}>▼</Text>
                    </TouchableOpacity>
                </View>

                {/* Description */}
                <Text style={styles.label}>Description</Text>
                <TextInput
                    placeholder="Value"
                    style={styles.input}
                    value={desc}
                    onChangeText={setDesc}
                />
            </View>

            {/* Buttons */}
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={isEdit ? deleteTask : () => navigation.goBack()}
                >
                    <Text style={styles.cancelText}>{isEdit ? "Delete" : "Cancel"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={submit}>
                    <Text style={styles.submitText}>{isEdit ? "Save" : "Submit"}</Text>
                </TouchableOpacity>
            </View>

            {showDate && (
                <DateTimePicker value={date || new Date()} mode="date" display="default"
                    onChange={(e, s) => { setShowDate(false); if (s) setDate(s); }} />
            )}
            {showStart && (
                <DateTimePicker value={start || new Date()} mode="time" is24Hour
                    onChange={(e, s) => { setShowStart(false); if (s) setStart(s); }} />
            )}
            {showEnd && (
                <DateTimePicker value={end || new Date()} mode="time" is24Hour
                    onChange={(e, s) => { setShowEnd(false); if (s) setEnd(s); }} />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    card: {
        backgroundColor: "#fce4ef",
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#000",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
        color: "#000",
    },
    pickerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    pickerHalf: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        marginRight: 8,
    },
    pickerText: {
        fontSize: 15,
        color: "#333",
    },
    arrow: {
        fontSize: 12,
        color: "#888",
    },
    timeRow: {
        flexDirection: "row",
        marginBottom: 16,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        color: "#333",
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
    },
    cancelBtn: {
        backgroundColor: "#ffb3d3",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 40,
        minWidth: "38%",
        alignItems: "center",
    },
    cancelText: {
        color: "#ff4d8d",
        fontSize: 18,
        fontWeight: "bold",
    },
    submitBtn: {
        backgroundColor: "#ff4d8d",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 40,
        minWidth: "38%",
        alignItems: "center",
    },
    submitText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
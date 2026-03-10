import React, { useState, useContext, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PlannerContext } from "../context/PlannerContext";
import { auth } from "../service/firebaseconfig";

export default function AddPlannerScreen({ navigation, route }) {

    const { tasks, addTask, updateTask, removeTask } = useContext(PlannerContext);

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

            const dateObj = new Date(y, m - 1, d);
            const startObj = new Date(y, m - 1, d, sh, sm);
            const endObj = new Date(y, m - 1, d, eh, em);

            setDate(dateObj);
            setStart(startObj);
            setEnd(endObj);
        }
    }, []);

    const formatDate = d =>
        d
            ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
            : "dd/mm/yyyy";

    const formatTime = t =>
        t
            ? `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`
            : "Start";

    const formatEnd = t =>
        t
            ? `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`
            : "End";

    const isOverlap = (newStart, newEnd, newDateStr) => {
        return tasks.some(t => {

            if (isEdit && t.id === editingTask.id) return false;

            if (t.date !== newDateStr) return false;

            const [d, m, y] = t.date.split("/").map(Number);
            const [sh, sm] = t.start.split(":").map(Number);
            const [eh, em] = t.end.split(":").map(Number);

            const oldStart = new Date(y, m - 1, d, sh, sm);
            const oldEnd = new Date(y, m - 1, d, eh, em);

            return newStart < oldEnd && newEnd > oldStart;
        });
    };

    const submit = async () => {
        const currentUserId = auth.currentUser?.uid

        if (!desc || !date || !start || !end) {
            Alert.alert("Error", "สร้างไร เอาให้ครบก่อน !");
            return;
        }

        const startDate = new Date(date);
        startDate.setHours(start.getHours(), start.getMinutes());

        const endDate = new Date(date);
        endDate.setHours(end.getHours(), end.getMinutes());

        if (startDate < new Date()) {
            Alert.alert("Error", "จะย้อนเวลารึไง ?");
            return;
        }

        if (endDate <= startDate) {
            Alert.alert("Error", "จบก่อนงานเริ่ม ?");
            return;
        }

        const dateStr = formatDate(date);

        if (isOverlap(startDate, endDate, dateStr)) {
            Alert.alert("Error", "เวลานี้มีกิจกรรมแล้ว!");
            return;
        }

        // ✅ ย้าย currentUserId มาไว้ก่อนใช้งาน
        const currentUserId = auth.currentUser?.uid;

        if (!currentUserId) {
            Alert.alert("Error", "กรุณาเข้าสู่ระบบใหม่");
            return;
        }

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const taskData = {
            id: editingTask?.id || null,
            desc,
            date: dateStr,
            start: formatTime(start),
            end: formatEnd(end),
            month: months[date.getMonth()],
            timestamp: startDate,
            userId: currentUserId  // ✅ ใช้ได้แล้ว
        };

        try {
            if (isEdit) {
                await updateTask(taskData);
            } else {
                await addTask(taskData);
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
        }
    };

    const deleteTask = () => {
        Alert.alert("Delete", "ลบกิจกรรมนี้ ?", [
            { text: "Cancel" },
            {
                text: "Delete",
                onPress: () => {
                    removeTask(editingTask.id);
                    navigation.goBack();
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>

                <Text style={styles.title}>
                    {isEdit ? "EDIT" : "NEW"}
                </Text>

                <Text style={styles.text}>Description</Text>
                <TextInput
                    placeholder="Description"
                    style={styles.input}
                    value={desc}
                    onChangeText={setDesc}
                />

                <Text style={styles.text}>Date</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
                    <Text>{formatDate(date)}</Text>
                </TouchableOpacity>

                <Text style={styles.text}>Time</Text>
                <View style={styles.rowtime}>
                    <TouchableOpacity style={styles.start} onPress={() => setShowStart(true)}>
                        <Text>{formatTime(start)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.end} onPress={() => setShowEnd(true)}>
                        <Text>{formatEnd(end)}</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={isEdit ? deleteTask : () => navigation.goBack()}
                >
                    <Text style={{ color: "#FF4D97", fontSize: 20, fontWeight: "bold" }}>
                        {isEdit ? "Delete" : "Cancel"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={submit}>
                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
                        {isEdit ? "Save" : "Submit"}
                    </Text>
                </TouchableOpacity>
            </View>

            {showDate && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="default"
                    onChange={(e, selected) => {
                        setShowDate(false);
                        if (selected) setDate(selected);
                    }}
                />
            )}

            {showStart && (
                <DateTimePicker
                    value={start || new Date()}
                    mode="time"
                    is24Hour={true}
                    onChange={(e, selected) => {
                        setShowStart(false);
                        if (selected) setStart(selected);
                    }}
                />
            )}

            {showEnd && (
                <DateTimePicker
                    value={end || new Date()}
                    mode="time"
                    is24Hour={true}
                    onChange={(e, selected) => {
                        setShowEnd(false);
                        if (selected) setEnd(selected);
                    }}
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center"
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        backgroundColor: "#fff"
    },
    start: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginRight: 10,
        backgroundColor: "#fff"
    },
    end: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10, padding: 12,
        backgroundColor: "#fff"
    },
    rowtime: {
        flexDirection: "row"
    },
    row: {
        flexDirection: "row",
        marginTop: 30,
        justifyContent: "center"
    },
    cancelBtn: {
        backgroundColor: "#ffb3d3",
        padding: 15,
        borderRadius: 40,
        marginRight: 10,
        width: "40%",
        alignItems: "center"
    },
    submitBtn: {
        backgroundColor: "#ff4d8d",
        padding: 15,
        borderRadius: 40,
        width: "40%",
        alignItems: "center"
    },
    inputContainer: {
        padding: 20,
        backgroundColor: "#f3d7e3",
        borderRadius: 40,
        marginTop: 20
    },
});

//test
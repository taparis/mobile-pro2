import React, { useState, useContext, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PlannerContext } from "../context/PlannerContext";
import { FontText } from "../components/CustomFont";

const toMinutes = (t) => {
    const d = new Date(t);
    return d.getHours() * 60 + d.getMinutes();
};

const isTimeOverlap = (sA, eA, sB, eB) => {
    return toMinutes(sA) < toMinutes(eB) && toMinutes(sB) < toMinutes(eA);
};

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

            setDate(new Date(y, m - 1, d));
            setStart(new Date(y, m - 1, d, sh, sm));
            setEnd(new Date(y, m - 1, d, eh, em));

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


    const getConflictTask = () => {

        if (!date || !start || !end) return null;

        const dateStr = formatDate(date);

        return tasks.find(t => {

            if (isEdit && t.id === editingTask.id) return false;

            if (t.date !== dateStr) return false;

            const [d, m, y] = t.date.split("/").map(Number);
            const [sh, sm] = t.start.split(":").map(Number);
            const [eh, em] = t.end.split(":").map(Number);

            const oldStart = new Date(y, m - 1, d, sh, sm);
            const oldEnd = new Date(y, m - 1, d, eh, em);

            return isTimeOverlap(start, end, oldStart, oldEnd);

        });

    };

    const conflictTask = getConflictTask();


    const submit = async () => {

        if (!desc || !date || !start || !end) {
            Alert.alert("Error", "กรอกข้อมูลให้ครบก่อน");
            return;
        }

        if (toMinutes(start) >= toMinutes(end)) {
            Alert.alert("Error", "เวลาเริ่มต้องก่อนเวลาจบ");
            return;
        }

        const months = [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
        ];

        const taskData = {
            desc,
            date: formatDate(date),
            start: formatTime(start),
            end: formatEnd(end),
            month: months[date.getMonth()]
        };

        try {

            if (isEdit) {

                await updateTask({
                    ...taskData,
                    id: editingTask.id
                });

            } else {

                await addTask(taskData);

            }

            navigation.goBack();

        } catch (error) {

            console.log("Save error", error);

        }

    };


    const deleteTask = () => {

        Alert.alert("Delete", "ลบกิจกรรมนี้ ?", [
            { text: "Cancel" },
            {
                text: "Delete",
                onPress: async () => {

                    await removeTask(editingTask.id);

                    navigation.goBack();

                }
            }
        ]);

    };


    return (

        <View style={styles.container}>

            <View style={styles.inputContainer}>

                <FontText style={styles.title}>
                    {isEdit ? "EDIT" : "NEW"}
                </FontText>

                <FontText style={styles.text}>Description</FontText>

                <TextInput
                    placeholder="Description"
                    style={styles.input}
                    value={desc}
                    onChangeText={setDesc}
                />

                <FontText style={styles.text}>Date</FontText>

                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDate(true)}
                >
                    <FontText>{formatDate(date)}</FontText>
                </TouchableOpacity>

                <FontText style={styles.text}>Time</FontText>

                <View style={styles.rowtime}>

                    <TouchableOpacity
                        style={styles.start}
                        onPress={() => setShowStart(true)}
                    >
                        <FontText>{formatTime(start)}</FontText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.end}
                        onPress={() => setShowEnd(true)}
                    >
                        <FontText>{formatEnd(end)}</FontText>
                    </TouchableOpacity>

                </View>


                {conflictTask && (

                    <View style={styles.conflictBanner}>
                        <FontText style={styles.conflictText}>
                            ⚠️ เวลาชนกับ "{conflictTask.desc}" ({conflictTask.start}-{conflictTask.end})
                        </FontText>
                    </View>

                )}

            </View>


            <View style={styles.row}>

                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={isEdit ? deleteTask : () => navigation.goBack()}
                >
                    <FontText style={styles.cancelText}>
                        {isEdit ? "Delete" : "Cancel"}
                    </FontText>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[
                        styles.submitBtn,
                        conflictTask && styles.disabledButton
                    ]}
                    onPress={submit}
                    disabled={!!conflictTask}
                >
                    <FontText style={styles.submitText}>
                        {isEdit ? "Save" : "Submit"}
                    </FontText>
                </TouchableOpacity>

            </View>


            {showDate && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    minimumDate={new Date()}
                    onChange={(e, selected) => {

                        setShowDate(false);

                        if (selected) {
                            setDate(selected);
                            setStart(null);
                            setEnd(null);
                        }

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

                        if (selected) {

                            if (start && toMinutes(selected) <= toMinutes(start)) {
                                Alert.alert("Error", "เวลาจบต้องหลังเวลาเริ่ม");
                                return;
                            }

                            setEnd(selected);

                        }

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
        borderRadius: 10,
        padding: 12,
        backgroundColor: "#fff"
    },

    rowtime: {
        flexDirection: "row"
    },

    conflictBanner: {
        backgroundColor: "#fff3f3",
        borderWidth: 1,
        borderColor: "#ff3776",
        borderRadius: 10,
        padding: 10,
        marginTop: 8
    },

    conflictText: {
        color: "#ff3776",
        fontSize: 13,
        fontWeight: "500"
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

    disabledButton: {
        backgroundColor: "#ccc"
    },

    cancelText: {
        color: "#FF4D97",
        fontSize: 20,
        fontWeight: "bold"
    },

    submitText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold"
    },

    inputContainer: {
        padding: 20,
        backgroundColor: "#f3d7e3",
        borderRadius: 40,
        marginTop: 20
    }

});
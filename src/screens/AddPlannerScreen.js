import React, { useState, useContext, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PlannerContext } from "../context/PlannerContext";
import { FontText } from "../components/CustomFont";
import { ClassContext } from "../context/ClassContext";

const toMinutes = (t) => {
    const d = new Date(t);
    return d.getHours() * 60 + d.getMinutes();
};

const isTimeOverlap = (sA, eA, sB, eB) => {
    return toMinutes(sA) < toMinutes(eB) && toMinutes(sB) < toMinutes(eA);
};

export default function AddPlannerScreen({ navigation, route }) {

    const { tasks, addTask, updateTask, removeTask } = useContext(PlannerContext);
    const classContext = useContext(ClassContext);
    const classes = classContext?.classes ?? [];

    const editingTask = route?.params?.task || null;
    const isEdit = !!editingTask;

    const [desc, setDesc] = useState("");
    const [date, setDate] = useState(null);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

    const [showDate, setShowDate] = useState(false);
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);

    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

    // "general" | "subject"
    const [activityType, setActivityType] = useState("general");
    const [subjectId, setSubjectId] = useState(null);

    useEffect(() => {
        if (editingTask) {
            setDesc(editingTask.desc);

            if (editingTask.subjectId) {
                setActivityType("subject");
                setSubjectId(editingTask.subjectId);
            } else {
                setActivityType("general");
                setSubjectId(null);
            }

            if (editingTask.date && editingTask.start && editingTask.end) {

                const [d, m, y] = editingTask.date.split("/").map(Number);
                const [sh, sm] = editingTask.start.split(":").map(Number);
                const [eh, em] = editingTask.end.split(":").map(Number);

                setDate(new Date(y, m - 1, d));
                setStart(new Date(y, m - 1, d, sh, sm));
                setEnd(new Date(y, m - 1, d, eh, em));

            }
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

    const closeAllDropdowns = () => {
        setShowTypeDropdown(false);
        setShowSubjectDropdown(false);
    };

    const submit = async () => {
        if (!desc || !date || !start || !end) {
            Alert.alert("Error", "กรอกข้อมูลให้ครบก่อน");
            return;
        }

        if (activityType === "subject" && !subjectId) {
            Alert.alert("Error", "กรุณาเลือกวิชาที่ผูก");
            return;
        }

        if (toMinutes(start) >= toMinutes(end)) {
            Alert.alert("Error", "เวลาเริ่มต้องก่อนเวลาจบ");
            return;
        }

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const selectedSubject = activityType === "subject"
            ? classes.find(c => c.id === subjectId)
            : null;

        const getSubjectName = (s) => {
            if (!s) return null;
            const n = s.name || s.subject || s.subjectName || s.title;
            return n || null;
        };

        const rawData = {
            desc,
            date: formatDate(date),
            start: formatTime(start),
            end: formatEnd(end),
            month: months[date.getMonth()],
            subjectId: selectedSubject?.id || null,
            subjectName: getSubjectName(selectedSubject),
            completed: false
        };

        // ลบ undefined ออกก่อน save (Firestore ไม่รับ undefined)
        const taskData = Object.fromEntries(
            Object.entries(rawData).map(([k, v]) => [k, v === undefined ? null : v])
        );

        try {
            if (isEdit) {
                await updateTask({ ...taskData, id: editingTask.id });
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

    const selectedSubjectName = (() => {
        const c = classes.find(c => c.id === subjectId);
        return c ? (c.subject ?? c.subjectName ?? c.title ?? "(ไม่มีชื่อ)") : null;
    })();

    return (
        <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>

                <View style={styles.inputContainer}>

                    <FontText style={styles.title}>
                        {isEdit ? "EDIT" : "NEW"}
                    </FontText>

                    {/* ── Activity Type Dropdown ── */}
                    <FontText style={styles.label}>Activity Type</FontText>

                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => {
                            setShowTypeDropdown(prev => !prev);
                            setShowSubjectDropdown(false);
                        }}
                    >
                        <View style={styles.inputRow}>
                            <FontText>
                                {activityType === "general" ? "General" : "Link to Subject"}
                            </FontText>
                            <FontText>{showTypeDropdown ? "▲" : "▼"}</FontText>
                        </View>
                    </TouchableOpacity>

                    {showTypeDropdown && (
                        <View style={styles.dropdown}>
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setActivityType("general");
                                    setSubjectId(null);
                                    setShowTypeDropdown(false);
                                }}
                            >
                                <FontText style={activityType === "general" && styles.selectedItem}>
                                    General
                                </FontText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.dropdownItem, { borderBottomWidth: 0 }]}
                                onPress={() => {
                                    setActivityType("subject");
                                    setShowTypeDropdown(false);
                                }}
                            >
                                <FontText style={activityType === "subject" && styles.selectedItem}>
                                    Link to Subject
                                </FontText>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* ── Subject Dropdown (เฉพาะ subject) ── */}
                    {activityType === "subject" && (
                        <>
                            <FontText style={styles.label}>Select Subject</FontText>

                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => {
                                    setShowSubjectDropdown(prev => !prev);
                                    setShowTypeDropdown(false);
                                }}
                            >
                                <View style={styles.inputRow}>
                                    <FontText style={!subjectId && { color: "#aaa" }}>
                                        {selectedSubjectName ?? "เลือกวิชา"}
                                    </FontText>
                                    <FontText>{showSubjectDropdown ? "▲" : "▼"}</FontText>
                                </View>
                            </TouchableOpacity>

                            {showSubjectDropdown && (
                                <View style={styles.dropdown}>
                                    {classes.length === 0 ? (
                                        <View style={[styles.dropdownItem, { borderBottomWidth: 0 }]}>
                                            <FontText style={{ color: "#aaa" }}>
                                                ไม่มีวิชาที่ลงทะเบียน
                                            </FontText>
                                        </View>
                                    ) : (
                                        classes.map((c, index) => (
                                            <TouchableOpacity
                                                key={c.id}
                                                style={[
                                                    styles.dropdownItem,
                                                    index === classes.length - 1 && { borderBottomWidth: 0 }
                                                ]}
                                                onPress={() => {
                                                    setSubjectId(c.id);
                                                    setShowSubjectDropdown(false);
                                                }}
                                            >
                                                <FontText style={subjectId === c.id && styles.selectedItem}>
                                                    {c.subject ?? c.subjectName}
                                                </FontText>
                                            </TouchableOpacity>
                                        ))
                                    )}
                                </View>
                            )}
                        </>
                    )}

                    {/* ── Description ── */}
                    <FontText style={styles.label}>Description</FontText>

                    <TextInput
                        placeholder="Description"
                        style={styles.input}
                        value={desc}
                        onChangeText={setDesc}
                        onFocus={closeAllDropdowns}
                    />

                    {/* ── Date ── */}
                    <FontText style={styles.label}>Date</FontText>

                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => {
                            closeAllDropdowns();
                            setShowDate(true);
                        }}
                    >
                        <FontText style={!date && { color: "#aaa" }}>
                            {formatDate(date)}
                        </FontText>
                    </TouchableOpacity>

                    {/* ── Time ── */}
                    <FontText style={styles.label}>Time</FontText>

                    <View style={styles.rowtime}>
                        <TouchableOpacity
                            style={styles.timeBtn}
                            onPress={() => {
                                closeAllDropdowns();
                                setShowStart(true);
                            }}
                        >
                            <FontText style={!start && { color: "#aaa" }}>
                                {formatTime(start)}
                            </FontText>
                        </TouchableOpacity>

                        <FontText style={styles.timeSep}>—</FontText>

                        <TouchableOpacity
                            style={styles.timeBtn}
                            onPress={() => {
                                closeAllDropdowns();
                                setShowEnd(true);
                            }}
                        >
                            <FontText style={!end && { color: "#aaa" }}>
                                {formatEnd(end)}
                            </FontText>
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

                {/* ── Buttons ── */}
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
                        style={[styles.submitBtn, conflictTask && styles.disabledButton]}
                        onPress={submit}
                        disabled={!!conflictTask}
                    >
                        <FontText style={styles.submitText}>
                            {isEdit ? "Save" : "Submit"}
                        </FontText>
                    </TouchableOpacity>
                </View>

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

        </ScrollView>
    );
}


const styles = StyleSheet.create({

    scrollView: {
        flex: 1,
        backgroundColor: "#fff"
    },

    container: {
        padding: 20,
        paddingBottom: 40
    },

    inputContainer: {
        padding: 20,
        backgroundColor: "#f3d7e3",
        borderRadius: 40,
        marginTop: 20
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center"
    },

    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#333"
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#fff"
    },

    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    dropdown: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginTop: -10,
        marginBottom: 12,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },

    dropdownItem: {
        padding: 13,
        borderBottomWidth: 1,
        borderColor: "#f0f0f0"
    },

    selectedItem: {
        color: "#ff4d8d",
        fontWeight: "bold"
    },

    rowtime: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },

    timeBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        backgroundColor: "#fff",
        alignItems: "center"
    },

    timeSep: {
        marginHorizontal: 10,
        fontSize: 18,
        color: "#666"
    },

    conflictBanner: {
        backgroundColor: "#fff3f3",
        borderWidth: 1,
        borderColor: "#ff3776",
        borderRadius: 10,
        padding: 10,
        marginTop: 4
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
    }

});

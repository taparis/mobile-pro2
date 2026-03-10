import React, { useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from "react-native";
import { FontText } from "../components/CustomFont";
import { PlannerContext } from "../context/PlannerContext";
import { Ionicons } from "@expo/vector-icons";


const sortTasks = (list) => {
    return [...list].sort((a, b) => {

        if (a.completed !== b.completed) return a.completed ? 1 : -1;

        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;

        const [da, ma, ya] = a.date.split("/").map(Number);
        const [db, mb, yb] = b.date.split("/").map(Number);

        const [ha, mina] = (a.start || "00:00").split(":").map(Number);
        const [hb, minb] = (b.start || "00:00").split(":").map(Number);

        const dateA = new Date(ya, ma - 1, da, ha, mina);
        const dateB = new Date(yb, mb - 1, db, hb, minb);

        return dateA.getTime() - dateB.getTime();
    });
};


const groupTasksByMonth = (tasks) => {

    const grouped = {};

    tasks.forEach(task => {

        const monthName = task.month || "ไม่ได้กำหนด";

        if (!grouped[monthName]) {
            grouped[monthName] = [];
        }

        grouped[monthName].push(task);

    });

    return grouped;

};


export default function ActivityPlannerScreen({ navigation }) {

    const { tasks, removeTask, toggleTask } = useContext(PlannerContext);

    const groupedTasks = groupTasksByMonth(tasks);

    const confirmDelete = (id) => {

        Alert.alert(
            "ลบกิจกรรม",
            "คุณจะลบกิจกรรมนี้หรือไม่ ?",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ยืนยัน",
                    style: "destructive",
                    onPress: () => removeTask(id)
                }
            ]
        );

    };


    return (

        <View style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false}>

                {Object.keys(groupedTasks).map(month => (

                    <View key={month} style={styles.monthSection}>

                        <FontText style={styles.monthTitle}>{month}</FontText>

                        {sortTasks(groupedTasks[month]).map(t => (

                            <View style={styles.card} key={t.id}>

                                <TouchableOpacity
                                    style={[
                                        styles.circle,
                                        t.completed && styles.completedCircle
                                    ]}
                                    onPress={() => toggleTask(t)}
                                >
                                    {t.completed && (
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    )}
                                </TouchableOpacity>

                                <View style={{ flex: 1 }}>

                                    <View>
                                        <Text
                                            style={[
                                                styles.task,
                                                t.completed && styles.completedTask
                                            ]}
                                        >
                                            {t.desc}
                                        </Text>

                                        {t.subjectName && (
                                            <Text style={styles.subject}>
                                                {t.subjectName}
                                            </Text>
                                        )}
                                    </View>

                                    {(t.date || t.start || t.end) && (
                                        <Text style={styles.time}>
                                            {t.date && t.date}
                                            {t.date && (t.start || t.end) && " • "}
                                            {(t.start || t.end) && `${t.start || "--:--"}-${t.end || "--:--"}`}
                                        </Text>
                                    )}

                                </View>

                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate("EditPlanner", { task: t })
                                    }
                                >
                                    <Ionicons
                                        name="create-outline"
                                        size={22}
                                        color="#444"
                                    />
                                </TouchableOpacity>

                            </View>

                        ))}

                    </View>

                ))}


                {tasks.length === 0 && (
                    <FontText style={styles.noTask}>
                        ไม่มีกิจกรรมตอนนี้
                    </FontText>
                )}

            </ScrollView>


            <View style={styles.center}>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("AddPlanner")}
                >
                    <FontText style={styles.buttonText}>
                        Add Task
                    </FontText>
                </TouchableOpacity>

            </View>

        </View>

    );

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
        paddingBottom: 80,
    },

    monthSection: {
        marginBottom: 20,
    },

    monthTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#000000",
    },

    card: {
        backgroundColor: "#ffe4ef",
        padding: 15,
        borderRadius: 20,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    circle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#ff9ac1",
        marginRight: 12,
    },

    task: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 2,
    },

    time: {
        color: "#666",
        fontSize: 13,
    },

    button: {
        backgroundColor: "#ff4d8d",
        padding: 15,
        borderRadius: 40,
        alignItems: "center",
        width: "45%",
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    center: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },

    noTask: {
        textAlign: "center",
        marginTop: 50,
        color: "#999",
        fontSize: 18,
    },
    subject: {
        fontSize: 13,
        color: "#ff4d8d",
        fontWeight: "600"
    },
    completedCircle: {
        backgroundColor: "#4CAF50",
    },
    completedTask: {
        textDecorationLine: "line-through",
        color: "#999",
        alignItems: "center",
    },

});
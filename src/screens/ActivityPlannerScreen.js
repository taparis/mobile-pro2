import React, { useContext } from "react";
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity
} from "react-native";
import { PlannerContext } from "../context/PlannerContext";
import { Ionicons } from "@expo/vector-icons";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function ActivityPlannerScreen({ navigation }) {
    const { tasks, removeTask } = useContext(PlannerContext);

    const monthsWithTasks = months.filter(m =>
        tasks.some(t => t.month === m)
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Title */}
                {/* <Text style={styles.pageTitle}>Activity & Planner</Text> */}

                {monthsWithTasks.map(month => (
                    <View key={month} style={styles.monthSection}>
                        <Text style={styles.monthTitle}>{month}</Text>

                        {tasks
                            .filter(t => t.month === month)
                            .map(t => (
                                <View style={styles.card} key={t.id}>
                                    <TouchableOpacity
                                        style={styles.circle}
                                        onPress={() => removeTask(t.id)}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.task}>{t.desc}</Text>
                                        <Text style={styles.time}>
                                            {t.date} : {t.start}-{t.end}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("EditPlanner", { task: t })}
                                    >
                                        <Ionicons name="create-outline" size={20} color="#888" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                    </View>
                ))}

                {tasks.length === 0 && (
                    <Text style={styles.noTask}>ไม่มีกิจกรรมตอนนี้</Text>
                )}
            </ScrollView>

            {/* Add Task Button */}
            <View style={styles.bottomBtn}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("AddPlanner")}
                >
                    <Text style={styles.buttonText}>Add Task</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: "bold",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        color: "#000",
    },
    monthSection: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    monthTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#000",
    },
    card: {
        backgroundColor: "#ffe4ef",
        padding: 14,
        borderRadius: 16,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#ff6bab",
        marginRight: 12,
    },
    task: {
        fontWeight: "bold",
        fontSize: 15,
        marginBottom: 2,
        color: "#000",
    },
    time: {
        color: "#666",
        fontSize: 13,
    },
    bottomBtn: {
        position: "absolute",
        bottom: 90,
        width: "100%",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#ff4d8d",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 40,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    noTask: {
        textAlign: "center",
        marginTop: 60,
        color: "#999",
        fontSize: 16,
    },
});
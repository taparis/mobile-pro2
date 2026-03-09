import React, { useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from "react-native";
import { PlannerContext } from "../context/PlannerContext";
import { Ionicons } from "@expo/vector-icons";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const sortTasks = (list) => {
    return [...list].sort((a, b) => {
        if(!a.date || !b.date || !a.start || !b.start) return 0

        const [da, ma, ya] = a.date.split("/").map(Number);
        const [db, mb, yb] = b.date.split("/").map(Number);

        const [ha, mina] = a.start.split(":").map(Number);
        const [hb, minb] = b.start.split(":").map(Number);

        const dateA = new Date(ya, ma - 1, da, ha, mina);
        const dateB = new Date(yb, mb - 1, db, hb, minb);

        return dateA - dateB;
    });
};

export default function ActivityPlannerScreen({ navigation }) {

    const { tasks, removeTask } = useContext(PlannerContext);

    const monthsWithTasks = months.filter(m =>
        tasks.some(t => t.month === m)
    );

    const confirmDelete = (id) => {
        Alert.alert("ลบกิจกรรม", "คุณจะลบกิจกรรมนี้หรือไม่ ?",
            [{text : "ยกเลิก", style : "cancel"},
                {text : "ยืนยัน", style : "destructive", onPress : () => removeTask(id)}
            ]
        )
    }

    const formatData = (dateVal) => {
        if(!dateVal) return ""
        const d = dateVal instanceof Date ? dateVal : new Date(dateVal)
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
    }

    return (
        <View style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false}>

                {monthsWithTasks.map(month => (
                    <View key={month} style={styles.monthSection}>

                        <Text style={styles.monthTitle}>{month}</Text>

                        {sortTasks
                            (tasks.filter(t => t.month === month))
                            .map(t => (
                                <View style={styles.card} key={t.id}>

                                    <TouchableOpacity
                                        style={styles.circle}
                                        onPress={() => confirmDelete(t.id)}
                                    />

                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.task}>{t.desc}</Text>
                                        <Text style={styles.time}>
                                            {formatData(t.date)}  •  {t.start}-{t.end}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate("EditPlanner", { task: t })
                                        }
                                    >
                                        <Ionicons name="create-outline" size={22} color="#444" />
                                    </TouchableOpacity>

                                </View>
                            ))}

                    </View>
                ))}

                {tasks.length === 0 && (
                    <Text style={styles.noTask}>ไม่มีกิจกรรมตอนนี้</Text>
                )}

            </ScrollView>

            <View style={styles.center}>
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
});
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { ClassContext } from "../context/ClassContext";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const DAY_WIDTH = 60;
const TIME_WIDTH = 55;

const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 40;

const TimeTable = ({ navigation }) => {
    const { classes } = useContext(ClassContext);
    const getDayIndex = (date) => {
        if (!date) return 0;

        const day = new Date(date).getDay();

        // เรียง Mon → Fri
        const map = {
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4,
        };

        return map[day] ?? 0;
    };

    const getTopPosition = (time) => {
        const d = new Date(time);
        const hour = d.getHours();
        const minute = d.getMinutes();

        return ((hour - START_HOUR) * 60 + minute) / 60 * HOUR_HEIGHT;
    };

    const getHeight = (start, end) => {
        const diff = (new Date(end) - new Date(start)) / 60000;
        return (diff / 60) * HOUR_HEIGHT;
    };

    const renderDayHeader = () => {
        return (
            <View style={styles.dayHeaderRow}>
                <View style={{ width: TIME_WIDTH }} />

                {DAYS.map((day, index) => (
                    <View key={index} style={styles.dayHeader}>
                        <Text style={styles.dayHeaderText}>{day}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderHourLines = () => {
        const hours = [];

        for (let i = START_HOUR; i <= END_HOUR; i++) {
            const top = (i - START_HOUR) * HOUR_HEIGHT;

            hours.push(
                <View key={i}>
                    <View style={[styles.hourLine, { top }]} />
                    <Text style={[styles.hourText, { top: top - 8 }]}>
                        {i}:00
                    </Text>
                </View>
            );
        }

        return hours;
    };
    const renderDayColumns = () => {
        return DAYS.map((_, i) => (
            <View
                key={i}
                style={[
                    styles.dayColumn,
                    { left: TIME_WIDTH + i * DAY_WIDTH },
                ]}
            />
        ));
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonSchedule}>
                <TouchableOpacity
                    style={styles.classButton}
                    onPress={() => { }}
                >
                    <Text style={styles.buttonClassText}>
                        Class Schedule
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.examButton}
                    onPress={() => navigation.navigate('ExamClass')}
                >
                    <Text style={styles.buttonExamText}>
                        Exam Schedule
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.titleRow}>

                {/* 🔥 header row */}
                <View style={styles.headerRow}>
                    <Text style={styles.classText}>Class Schedule</Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('DetailClass')}
                    >
                        <Ionicons name="create-outline" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.table}>
                    {renderDayHeader()}

                    <View style={styles.gridArea}>
                        {renderHourLines()}
                        {renderDayColumns()}
                        {classes.map((item, index) => {
                            const left =
                                TIME_WIDTH + getDayIndex(item.date) * DAY_WIDTH;

                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.classBlock,
                                        {
                                            left,
                                            top: getTopPosition(item.starts),
                                            height: getHeight(item.starts, item.ends),
                                        },
                                    ]}
                                >
                                    <Text style={styles.blockText}>
                                        {item.code}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                </View>


            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    buttonSchedule: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 15,

    },
    classButton: {
        width: '50%',
        padding: 10,
        marginTop: 15,
        backgroundColor: '#ff68b9',
        borderRadius: 60,
        alignItems: 'center',
    },
    examButton: {
        width: '50%',
        padding: 10,
        marginTop: 15,
        backgroundColor: 'pink',
        borderRadius: 60,
        marginLeft: 5,
        alignItems: 'center'
    },
    buttonClassText: {
        padding: 10,
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold'
    },
    buttonExamText: {
        padding: 10,
        fontSize: 18,
        color: 'black',
    },
    classText: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
    },
    titleRow: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 10,
        justifyContent: 'space-between',
        width: '90%',
    },
    table: {
        width: TIME_WIDTH + DAY_WIDTH * 5,
        borderWidth: 2,
        borderRadius: 20,
        overflow: "hidden",
    },

    dayHeaderRow: {
        flexDirection: "row",
        height: 40,
        borderBottomWidth: 1,
    },

    dayHeader: {
        width: DAY_WIDTH,
        justifyContent: "center",
        alignItems: "center",
        borderLeftWidth: 1,
        borderColor: "#E5E7EB",
    },

    dayHeaderText: {
        fontWeight: "bold",
    },

    gridArea: {
        height: (END_HOUR - START_HOUR) * HOUR_HEIGHT,
        position: "relative",
    },

    hourLine: {
        position: "absolute",
        left: TIME_WIDTH,
        right: 0,
        height: 1,
        backgroundColor: "#ccc",
    },

    hourText: {
        position: "absolute",
        left: 5,
        fontSize: 11,
        backgroundColor: "#f3a6c4",
        paddingHorizontal: 6,
        borderRadius: 6,
    },
    dayColumn: {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: "#000",
    },
    classBlock: {
        position: "absolute",
        width: DAY_WIDTH - 8,
        marginLeft: 4,
        backgroundColor: "#FFE66D",
        borderRadius: 12,
        padding: 5,
        alignItems: "center",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
})

export default TimeTable
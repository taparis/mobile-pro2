import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ClassContext } from "../context/ClassContext";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const DAY_WIDTH = 60;
const TIME_WIDTH = 55;

const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 40;

const TimeTable = ({ navigation }) => {
  const { classes } = useContext(ClassContext);

  // ⭐ mode switch
  const [mode, setMode] = useState("class");

  // ======================
  // helpers
  // ======================

  const getDayIndex = (date) => {
    if (!date) return 0;

    const map = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
    return map[new Date(date).getDay()] ?? 0;
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

  // ======================
  // filter data
  // ======================

  const classData = classes.filter(
    (i) => i.type !== "exam" && i.date && i.starts && i.ends
  );

  const examData = classes.filter(
    (i) => i.type === "exam" && i.date && i.starts && i.ends
  );

  const displayData = mode === "exam" ? examData : classData;

  // ======================
  // render parts
  // ======================

  const renderDayHeader = () => (
    <View style={styles.dayHeaderRow}>
      <View style={{ width: TIME_WIDTH }} />
      {DAYS.map((day, index) => (
        <View key={index} style={styles.dayHeader}>
          <Text style={styles.dayHeaderText}>{day}</Text>
        </View>
      ))}
    </View>
  );

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

  const renderDayColumns = () =>
    DAYS.map((_, i) => (
      <View
        key={i}
        style={[styles.dayColumn, { left: TIME_WIDTH + i * DAY_WIDTH }]}
      />
    ));

  // ======================
  // UI
  // ======================

  return (
    <View style={styles.container}>
      {/* SWITCH BUTTON */}
      <View style={styles.buttonSchedule}>
        <TouchableOpacity
          style={[
            styles.classButton,
            mode === "class" && styles.activeButton,
          ]}
          onPress={() => setMode("class")}
        >
          <Text style={styles.buttonClassText}>Class Schedule</Text>   
          
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.examButton,
            mode === "exam" && styles.activeButton,
          ]}
          onPress={() => setMode("exam")}
        >
          <Text style={styles.buttonExamText}>Exam Schedule</Text>
          
        </TouchableOpacity>
      </View>

      {/* TITLE */}
      <View style={styles.titleRow}>
        <View style={styles.headerRow}>
          <Text style={styles.classText}>
            {mode === "exam" ? "Exam Schedule" : "Class Schedule"}
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("DetailClass")
            }
          >
            <Ionicons name="add-outline" size={28} color="black" />
          </TouchableOpacity>

          
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          {renderDayHeader()}

          <View style={styles.gridArea}>
            {renderHourLines()}
            {renderDayColumns()}

            {displayData.map((item, index) => {
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
                  <Text>{item.code}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export default TimeTable;

// ======================
// STYLES
// ======================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  buttonSchedule: {
    flexDirection: "row",
    paddingHorizontal: 15,
  },

  classButton: {
    width: "50%",
    padding: 10,
    marginTop: 15,
    backgroundColor: "pink",
    borderRadius: 60,
    alignItems: "center",
  },

  examButton: {
    width: "50%",
    padding: 10,
    marginTop: 15,
    marginLeft: 5,
    backgroundColor: "pink",
    borderRadius: 60,
    alignItems: "center",
  },

  activeButton: {
    backgroundColor: "#ff68b9",
  },

  buttonClassText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },

  buttonExamText: {
    fontSize: 18,
    color: "black",
  },

  titleRow: {
    width: "90%",
    marginTop: 10,
  },

  classText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});
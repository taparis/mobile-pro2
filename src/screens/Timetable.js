import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from "react-native";

const TimeTable = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <View style={styles.buttonSchedule}>
                <TouchableOpacity 
                    style={styles.classButton}
                    onPress={() => {}}
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
                <Text style={styles.classText}>Class Schedule</Text>

                <TouchableOpacity onPress={() => navigation.navigate('DetailClass')}>
                    <Ionicons name="create-outline" size={40} color="black" />
                </TouchableOpacity>

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
        fontWeight: 'bold',
        marginTop: 20,
        alignSelf: 'flex-start',
        marginLeft: 15
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-between',
        width: '90%',
    },
})

export default TimeTable
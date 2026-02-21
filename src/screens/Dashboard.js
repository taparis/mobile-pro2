import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from "react-native";

const Dashboard = () => {
    return (
        <View style={styles.container}>
            {/* ต้องเปลี่ยนไปใช้ renderItem */}
            <View style={styles.cardContainer}>
                <Text style={styles.headlabel}>Next Class</Text>
                <View style={styles.card}>
                    <View style={styles.timeBox}>
                        <Text style={styles.timeBoxlabel}>15.00 - 19.00</Text>
                    </View>
                    <Text style={styles.textlabel}>Course : </Text>
                    <Text style={styles.textlabel}>Room : </Text>
                </View>
            </View>
            <View style={styles.cardContainer}>
                <Text style={styles.headlabel}>Upcoming Exam</Text>
                <View style={styles.card}>
                    <View style={styles.timeBox}>
                        <Text style={styles.timeBoxlabel}>13.00 - 16.00</Text>
                    </View>
                    <Text style={styles.textlabel}>Course : </Text>
                    <Text style={styles.textlabel}>Room : </Text>
                </View>
            </View>
            {/* renderItem ***** */}
            <View style={styles.cardContainer}>
                <Text style={styles.headlabel}>Your Task</Text>
                <View style={styles.card}>
                    <View style={styles.timeBox}>
                        <Text style={styles.timeBoxlabel}>Your Task</Text>
                    </View>
                    <View style={styles.taskbox}>
                        <Text style={styles.taskBoxlabel}>Seminar</Text>
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Add Task</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
    },
    cardContainer: {
        paddingHorizontal: 25,
        paddingTop: 20
    },
    headlabel: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#646567'
    },
    card: {
        backgroundColor: '#FFEAF3',
        padding: 20,
        borderRadius: 30,
        marginTop: 10
    },
    timeBox: {
        width: 130,
        height: 25,
        backgroundColor: '#FF4D97',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeBoxlabel: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#fff'
    },
    textlabel: {
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 5
    },
    taskbox: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgrey',
        marginTop: 10,
        height: 30,
        justifyContent: 'center'
    },
    taskBoxlabel: {
        fontSize: 16,
        marginLeft: 10
    },
    button: {
        paddingHorizontal : 30,
        padding: 10,
        marginTop: 30,
        backgroundColor: '#FF4D97',
        borderRadius: 60,
    },
    buttonContainer : {
        alignItems : 'center',
        justifyContent : 'center'
    },
    buttonText : {
        fontWeight : 'bold',
        color : '#fff',
        fontSize : 20
    }

})

export default Dashboard
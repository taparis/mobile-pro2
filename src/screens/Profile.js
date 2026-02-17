import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from "react-native";

const Profile = () => {

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg' }}
                    style={styles.images}></Image>
                <View style={styles.textContainer}>
                    <Text style={styles.nameText}>John Jee</Text>
                    <Text style={styles.FacultyText}>Faculty of Liberal Arts and Sciences</Text>
                    <Text>Computer Science</Text>
                    <Text>Year 3</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>
                    Edit Profile
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>
                    Delete All Data !
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 15
    },
    textContainer: {
        flexDirection: 'column',
        marginLeft: 20
    },
    images: {
        width: 80,
        height: 100,
        borderWidth: 2,
        borderRadius: 75,
        borderColor: '#ffffffff',
        marginBottom: 5
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    FacultyText: {
        fontSize: 16,
    },
    button: {
        width: '90%',
        padding: 10,
        marginTop: 15,
        backgroundColor: 'pink',
        borderRadius: 60
    },
    buttonText: {
        padding: 10,
        fontSize: 18
    }

})

export default Profile
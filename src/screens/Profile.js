import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from "react-native";

const Profile = () => {

    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg' }}
                style={styles.images}></Image>
            <Text style={styles.nameText}>John Jee</Text>
            <Text style={styles.FacultyText}>Faculty of Liberal Arts and Sciences</Text>
            <Text>Computer Science</Text>
            <Text>Year 3</Text>
            <TouchableOpacity>
                <Text style={styles.button}>
                    Edit Profile
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
        justifyContent: 'center',
        padding: 15
    },
    ProfileContainer: {
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
        padding: 10,
        backgroundColor: 'pink'
    }

})

export default Profile
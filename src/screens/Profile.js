import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { UserContext } from "../context/UserContext";
import { Ionicons } from "@expo/vector-icons";

const Profile = ({ navigation }) => {

    const { user } = useContext(UserContext);

    const handleDeleteData = () => {
        Alert.alert("Delete All Data", "Do you want to delete all the data?",
            [{ text: "Cancel" }, { text: "Confirm" }],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.imageContainer}>
                    {user.image ?
                        <Image source={{ uri: user.image }} style={styles.images} /> :
                        <Ionicons name='person' size={40} color={'#ccc'} />
                    }
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.nameText}>{user.name}</Text>
                    <Text style={styles.FacultyText}>{user.faculty}</Text>
                    <Text>{user.major}</Text>
                    <Text>Year {user.year}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('EditProfile')}
            >
                <Text style={styles.buttonText}>
                    Edit Profile
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={handleDeleteData}
            >
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
        height: 80,
        borderRadius: 75,
        marginBottom: 5
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 75,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: "center",
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
import React, { useState, useContext, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";
import * as ImagePicker from 'expo-image-picker'
import TextFormInput from "../components/TextFormInput";
import SelectFormInput from "../components/SelectFormInput";
import { FontText } from "../components/CustomFont";

const EditProfile = ({ navigation }) => {

    const { user, saveUserProfile } = useContext(UserContext);

    const [form, setForm] = useState({
        name: '',
        faculty: '',
        major: '',
        year: '',
        image: null
    });

    const FACULTIES = {
        "Agriculture": [
            "Entomology",
            "Farm Mechanics",
            "Soil Science",
            "Plant Pathology",
            "Agronomy",
            "Horticulture",
            "Animal Science",
            "Agricultural Extension and Communication",
            "Agricultural Biotechnology"
        ],
        "Engineering": [
            "Agricultural Engineering",
            "Irrigation Engineering",
            "Food Engineering",
            "Civil Engineering",
            "Mechanical Engineering",
            "Computer Engineering",
            "Industrial Engineering"
        ],
        "Sports Science": [
            "Sports Science",
            "Health and Movement Sciences",
            "Sport and Health Management"
        ],
        "Liberal Arts and Science": [
            "Science and Bioinnovation",
            "Physical and Material Sciences",
            "Computational Science and Digital Technology",
            "Business Administration and Accountancy",
            "Language Sciences and Cultures",
            "Social Sciences"
        ],
        "Education and Development Sciences": [
            "Human and Community Resource Development (HCRD)",
            "Teacher Education",
            "Physical Education and Sports"
        ]
    };

    useEffect(() => {
        setForm({
            name: user.name || '',
            faculty: user.faculty || '',
            major: user.major || '',
            year: user.year || '',
            image: user.image || null,
        });
    }, [user]);

    const handleRegister = async () => {
        const success = await saveUserProfile(form, form.image !== user.image? form.image : null)

        if(success) {
            Alert.alert("Success", "Your Profile Update Already")
            navigation.goBack()
        }else {
            Alert.alert("Error", "Cloud not update profile")
        }
    }; 

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        })

        if (!result.canceled) setForm({ ...form, image: result.assets[0].uri })
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
                onPress={pickImage}
                style={styles.imageBtn}
            >
                <View style={styles.imageContainer}>
                    {form.image ?
                        <Image source={{ uri: form.image }} style={styles.images} /> :
                        <Ionicons name='person' size={40} color={'#ccc'} />
                    }
                </View>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                <FontText style={styles.title}>Edit Profile</FontText>
                <TextFormInput
                    label="Fullname"
                    value={form.name}
                    placeholder="Please enter your fullname"
                    onChangeText={(text) => setForm({ ...form, name: text })}
                />

                <SelectFormInput
                    label="Faculty"
                    value={form.faculty}
                    placeholder="Please select your faculty"
                    onValueChange={(value) => setForm({ ...form, faculty: value, major: '' })}
                    options={Object.keys(FACULTIES)}
                />

                <SelectFormInput
                    label="Major"
                    value={form.major}
                    placeholder="Please select your major"
                    onValueChange={(value) => setForm({ ...form, major: value })}
                    options={form.faculty ? FACULTIES[form.faculty] : []}
                />

                <SelectFormInput
                    label="Year"
                    value={form.year}
                    placeholder="Please select your year"
                    onValueChange={(value) => setForm({ ...form, year: value })}
                    options={["1", "2", "3", "4"]}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <FontText style={styles.cancelButtonText}>Cancel</FontText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.summitButton}
                        onPress={handleRegister}
                    >
                        <FontText style={styles.summitButtonText}>Submit</FontText>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    images: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderRadius: 75,
        borderColor: '#ffffffff',
        marginTop: 20
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 75,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    inputContainer: {
        padding: 20,
        backgroundColor: 'pink',
        width: "80%",
        borderRadius: 30,
        marginTop: 20
    },
    cancelButton: {
        width: '40%',
        padding: 10,
        marginTop: 15,
        backgroundColor: '#ff9cbb',
        borderRadius: 60
    },
    summitButton: {
        width: '40%',
        padding: 10,
        marginTop: 15,
        backgroundColor: '#ff6d9b',
        borderRadius: 60,
        marginLeft: 20
    },
    cancelButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff3776',
        textAlign: 'center'
    },
    summitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    }

})

export default EditProfile
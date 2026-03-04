import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from '../context/UserContext';
import TextFormInput from "../components/TextFormInput";
import SelectFormInput from "../components/SelectFormInput";

import { auth, db } from "../service/firebaseconfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = ({ navigation }) => {
    const { saveUserProfile } = useContext(UserContext)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        email: '',
        name: '',
        faculty: '',
        major: '',
        year: '',
        password: '',
        confirmPassword: '',
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        })

        if (!result.canceled) setForm({ ...form, image: result.assets[0].uri })
    }

    const handleRegister = async () => {
        const { email, name, faculty, major, year, password, confirmPassword, image } = form

        if (!form.name || !form.email || !form.faculty || !form.major || !form.year || !form.password) {
            return Alert.alert('Error', 'Fill in all the required information')
        }
        if (form.password.length < 6) {
            return Alert.alert('Error', 'The password is too short')
        }
        if (form.password !== form.confirmPassword) {
            return Alert.alert('Error', 'Passwords do not match')
        }
        setLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
            const user = userCredential.user

            const userData = {
                name,
                email,
                faculty,
                major,
                year,
                image: null
            }

            const success = await saveUserProfile(userData, image)

            if (success) {
                console.log("Register and Profile Saved !")
            } else {
                Alert.alert("Error", "Save Profile Unsuccess !")
            }

        } catch (error) {
            console.error(error)
            let msg = "Fail to Register"
            if(error.code === 'auth/email-already-in-use') msg = "Email is used already !"
            Alert.alert("Register Fail !", msg)
        }finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 60 }}
            showsVerticalScrollIndicator={false}
        >

            <Text style={styles.header}>Register</Text>

            <View style={styles.imageSection}>
                <TouchableOpacity
                    onPress={pickImage}
                    style={styles.imageBtn}
                >
                    {form.image ?
                        <Image source={{ uri: form.image }} style={styles.avatar} /> :
                        <Ionicons name='person' size={40} color={'#ccc'} />
                    }
                </TouchableOpacity>
            </View>

            <TextFormInput
                label="Fullname"
                value={form.name}
                placeholder="Please enter your fullname"
                onChangeText={(text) => setForm({ ...form, name: text })}
            />

            <TextFormInput
                label="Email"
                value={form.email}
                placeholder="Please enter your email"
                onChangeText={(text) => setForm({ ...form, email: text })}
            />

            <SelectFormInput
                label="Faculty"
                value={form.faculty}
                placeholder="Please select your faculty"
                onValueChange={(value) => setForm({ ...form, faculty: value })}
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

            <TextFormInput
                label="Password"
                value={form.password}
                placeholder="Please enter your password"
                secureTextEntry
                onChangeText={(text) => setForm({ ...form, password: text })}
            />

            <TextFormInput
                label="Confirm Password"
                value={form.confirmPassword}
                placeholder="Please enter your password again"
                secureTextEntry
                onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
            >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.login}
                onPress={() => navigation.navigate("Login")}
            >
                <Text style={styles.loginText}>
                    Already have an account? Log in
                </Text>
            </TouchableOpacity>


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    imageBtn: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    imageSection: {
        padding: 15,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 75,
    },
    button: {
        backgroundColor: '#ff6d9b',
        padding: 15,
        marginTop: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    login: {
        marginTop: 15,
        alignItems: "center",
    },

    loginText: {
        color: "#555",
        fontSize: 14,
    }
})

export default Register
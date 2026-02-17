import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import TextFormInput from "../components/TextFormInput";
import SelectFormInput from "../components/SelectFormInput";

const EditProfile = () => {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [faculty, setFaculty] = useState("");
    const [branch, setBranch] = useState("");
    const [year, setYear] = useState("");

    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://img.freepik.com/premium-vector/anthropologist-vector-character-flat-style_1033579-57866.jpg' }}
                style={styles.images}>
            </Image>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Edit Profile</Text>
                <TextFormInput
                    label="Name"
                    value={name}
                    placeholder="John"
                    onChangeText={setName}
                />
                <TextFormInput
                    label="Surname"
                    value={surname}
                    placeholder="Jee"
                    onChangeText={setSurname}
                />
                <SelectFormInput
                    label="Faculty"
                    value={faculty}
                    placeholder="Liberal Arts and Sciences"
                    onValueChange={setFaculty}
                    options={[
                        "Liberal Arts and Sciences",
                        "Engineering",
                        "Science"
                    ]}
                />
                <SelectFormInput
                    label="Branch"
                    value={branch}
                    placeholder="Computer Science"
                    onValueChange={setBranch}
                    options={[
                        "Computer Science",
                    ]}
                />
                <SelectFormInput
                    label="Year"
                    value={year}
                    placeholder="3"
                    onValueChange={setYear}
                    options={["1", "2", "3", "4"]}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.summitButton}>
                        <Text style={styles.summitButtonText}>
                            Summit
                        </Text>
                    </TouchableOpacity>
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
    images: {
        width: 80,
        height: 80,
        borderWidth: 2,
        borderRadius: 75,
        borderColor: '#ffffffff',
        marginTop: 20
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
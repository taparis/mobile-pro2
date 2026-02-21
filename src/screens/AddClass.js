import React, { useContext, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextFormInput from "../components/TextFormInput";
import SelectFormInput from "../components/SelectFormInput";

const initialState = {
  subject: '', 
  code: '', 
  room: '', 
  date: '', 
  starts: '', 
  ends: '', 
  error: ''
}

const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value, error: "" };
    case "RESET":
      return initialState

    default:
      return state;
  }
};

export default function AddClass({ navigation }) {

  const [state, dispatch] = useReducer(formReducer, initialState)

  const handleSubmit = () => {
     Alert.alert('Succeed', 'เพิ่มคลาสสำเร็จแล้ว', [
      {
        text: 'ตกลง',
        onPress: () =>
          navigation.navigate('DetailClass', {
            classData: state
          })
      }
  ])
  dispatch({ type: 'RESET'})
}

 const handleCancel = () => {
  dispatch({ type: 'RESET'})
}

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Add Class</Text>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="Subject"
          value={state.subject}
          onChangeText={(t) =>
            dispatch({ type: "UPDATE_FIELD", field: "subject", value: t })
          }
        />

        <Text style={styles.label}>Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Code"
          value={state.code}
          onChangeText={(t) =>
            dispatch({ type: "UPDATE_FIELD", field: "code", value: t })
          }
        />

        <Text style={styles.label}>Room</Text>
        <TextInput
          style={styles.input}
          placeholder="Room"
          value={state.room}
          onChangeText={(t) =>
            dispatch({ type: "UPDATE_FIELD", field: "room", value: t })
          }
        />


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  images: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 75,
    borderColor: "#ffffffff",
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: "pink",
    width: "80%",
    borderRadius: 30,
    marginTop: 20,
  },
  cancelButton: {
    width: "40%",
    padding: 10,
    marginTop: 15,
    backgroundColor: "#ff9cbb",
    borderRadius: 60,
  },
  summitButton: {
    width: "40%",
    padding: 10,
    marginTop: 15,
    backgroundColor: "#ff6d9b",
    borderRadius: 60,
    marginLeft: 20,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff3776",
    textAlign: "center",
  },
  summitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

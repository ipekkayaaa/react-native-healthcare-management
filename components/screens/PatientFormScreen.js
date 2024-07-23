// PatientFormScreen.js
import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase";

const PatientFormScreen = ({ navigation, route }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    phoneNumber: "",
    weight: "",
    height: "",
    medicalCondition: "",
    userType: "patient",
    email: route.params.userEmail, // Accessing the passed userEmail parameter
  });

  const handleSaveForm = async () => {
    const colRefPatients = collection(firestore, 'patients');

    try {
      await addDoc(colRefPatients, {
        userId: route.params.userId,
        ...values,
      });

      console.log("Patient data added successfully!");

      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error("Error adding patient data: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={values.firstName}
        onChangeText={(text) => setValues({ ...values, firstName: text })}
      />
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={values.lastName}
        onChangeText={(text) => setValues({ ...values, lastName: text })}
      />
      <TextInput
        placeholder="Birthday"
        style={styles.input}
        value={values.birthday}
        onChangeText={(text) => setValues({ ...values, birthday: text })}
      />
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={values.phoneNumber}
        onChangeText={(text) => setValues({ ...values, phoneNumber: text })}
      />
      <TextInput
        placeholder="Weight"
        style={styles.input}
        value={values.weight}
        onChangeText={(text) => setValues({ ...values, weight: text })}
      />
      <TextInput
        placeholder="Height"
        style={styles.input}
        value={values.height}
        onChangeText={(text) => setValues({ ...values, height: text })}
      />
      <TextInput
        placeholder="Medical Condition"
        style={styles.input}
        value={values.medicalCondition}
        onChangeText={(text) => setValues({ ...values, medicalCondition: text })}
      />

      <Button
        containerStyle={styles.button}
        buttonStyle={[styles.button, styles.buttonOutline]}
        onPress={handleSaveForm}
        title="Submit Registration"
        titleStyle={styles.buttonOutlineText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    borderColor: "green",
    borderWidth: 1,
    width: "80%", // Adjust the width as needed
  },
  button: {
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonOutline: {
    backgroundColor: "white",
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default PatientFormScreen;
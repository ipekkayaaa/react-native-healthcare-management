
import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, Alert, Picker } from "react-native";
import { Button } from "react-native-elements";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase";
import { getAuth } from "firebase/auth";

const DoctorFormScreen = ({ navigation, route }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const email = user.email;

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    title: "",
    birthday: "",
    phoneNumber: "",
    organization: "",
    email: email,
  });

  const [organizationList, setOrganizationList] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const organizationsCollection = collection(firestore, "organizations");
        const snapshot = await getDocs(organizationsCollection);
        const organizationsData = snapshot.docs.map((doc) => {
          const { organizationName } = doc.data();
          return { id: doc.id, organizationName };
        });

        setOrganizationList(organizationsData);
      } catch (error) {
        console.error("Error getting organizations: ", error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleSaveForm = async () => {
    // Validate input
    if (
      !values.firstName ||
      !values.lastName ||
      !values.birthday ||
      !values.phoneNumber ||
      !values.organization
    ) {
      alert("Please fill out all the fields before submitting your registration.");
      return;
    }

    const colRefTherapist = collection(firestore, "therapist");

    try {
      // Add the doctor data with the organization ID
      await addDoc(colRefTherapist, {
        ...values,
        // Store the organization ID instead of the organization name
        organization: values.organization,
      });

      console.log("Doctor data added successfully!");
      window.alert('Profile successfully added!');
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Error adding doctor data: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>
        Please fill out the form to complete your registration.
      </Text>
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
        placeholder="Title"
        style={styles.input}
        value={values.title}
        onChangeText={(text) => setValues({ ...values, title: text })}
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
      <Picker
        selectedValue={values.organization}
        onValueChange={(value) => setValues({ ...values, organization: value })}
        style={styles.input}
      >
        <Picker.Item label="Select Organization" value="" />
        {organizationList.map((org) => (
          <Picker.Item key={org.id} label={org.organizationName} value={org.id} />
        ))}
      </Picker>
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
  },
  headline: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    borderColor: "green",
    borderWidth: 1,
    width: 800,
  },
  button: {
    width: "50%",
    marginTop: 20,
    borderRadius: 10,
    marginLeft: "15%",
  },
  buttonOutline: {
    backgroundColor: "#7DCEA0",
    marginTop: 5,
    borderColor: "#DAF7A6",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default DoctorFormScreen;

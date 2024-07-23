import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Picker,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";

import { Avatar, Button, SearchBar, Input, Icon } from "react-native-elements";
import { auth, firestore } from "../../firebase";
import { getDocs, addDoc, collection } from "firebase/firestore";
import UserProfile from "./UserProfile"; 

const initialExercises = [
  { name: "", sets: "", reps: "" },
  { name: "", sets: "", reps: "" },
  { name: "", sets: "", reps: "" },
  { name: "", sets: "", reps: "" },
];

export default function DoctorProfile({ navigation }) {
   // signout
   const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("LoginScreen");
      })
      .catch((err) => alert(err.message));
  };
  const [userList, setUserList] = useState([]);

  const [createWorkoutModalVisible, setCreateWorkoutModalVisible] = useState(false);

  const [newWorkout, setNewWorkout] = useState({
    workoutName: "",
    date: "",
    exercises: initialExercises,
  });

  const createWorkout = () => {
    if (newWorkout.workoutName && newWorkout.date && selectedPatientId) {
      const colRefworkout = collection(firestore, 'workoutPlan');
  
      addDoc(colRefworkout, {
        workoutName: newWorkout.workoutName,
        workoutDate: newWorkout.date,
        email: selectedPatientId, // Use selectedPatientId directly as email
        exercises: newWorkout.exercises.map((exercise, index) => ({
          name: exercise.name,
          reps: exercise.reps,
          sets: exercise.sets,
          key: `exercise${index + 1}`, // Assign a unique key for each exercise
        })),
      })
        .then(() => {
          console.log("Workout added successfully!");
          closeCreateWorkoutModal();
        })
        .catch((error) => {
          console.error("Error adding workout: ", error);
        });
    } else {
      console.warn("Incomplete workout data. Please fill in all required fields.");
    }
  };
  
  const [patientList, setPatientList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsCollection = collection(firestore, 'patients');
        const snapshot = await getDocs(patientsCollection);
        const patientsData = snapshot.docs.map((doc) => {
          const { email, firstName, lastName, medicalCondition } = doc.data();
          return { id: doc.id, name: `${firstName} ${lastName}`, medicalCondition, email };
        });

        setPatientList(patientsData);

        snapshot.forEach((doc) => {
          const { firstName, lastName } = doc.data();
          const name = `${firstName} ${lastName}`;
          console.log("Name: ", name);
        });
      } catch (error) {
        console.error("Error getting patient documents: ", error);
      }
    };

    fetchPatients();
  }, []);

  const [search, setSearch] = useState("");
  const [filteredUserList, setFilteredUserList] = useState(patientList);

  useEffect(() => {
    setFilteredUserList(patientList);
  }, [patientList]);

  const navigateToUserProfile = (user) => {
    navigation.navigate("UserProfile", { user });
  };

  const searchFilterFunction = (text) => {
    setSearch(text);
    const newData = patientList.filter((item) => {
      const itemEmail = item.email.toUpperCase();
      const searchText = text.toUpperCase();
      return itemEmail.includes(searchText);
    });
    setFilteredUserList(newData);
  };

  const openCreateWorkoutModal = () => {
    setCreateWorkoutModalVisible(true);
  };

  const closeCreateWorkoutModal = () => {
    setCreateWorkoutModalVisible(false);
  };

  const [createOrganizationModalVisible, setCreateOrganizationModalVisible] = useState(false);
  const [newOrganization, setNewOrganization] = useState({
    organizationName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
  });

  const openCreateOrganizationModal = () => {
    setCreateOrganizationModalVisible(true);
  };

  const closeCreateOrganizationModal = () => {
    setCreateOrganizationModalVisible(false);
  };

  const createOrganization = async () => {
    try {
      const organizationsCollection = collection(firestore, "organizations");

      await addDoc(organizationsCollection, {
        organizationName: newOrganization.organizationName,
        street: newOrganization.street,
        city: newOrganization.city,
        state: newOrganization.state,
        zipCode: newOrganization.zipCode,
        phoneNumber: newOrganization.phoneNumber,
        email: newOrganization.email,
      });

      console.log("Organization added successfully!");
      closeCreateOrganizationModal();
    } catch (error) {
      console.error("Error adding organization: ", error);
    }
  };
  
  return (
    <View style={styles.container}>
       <View style={styles.header}>
          <Avatar
            rounded
            size={120}
            icon={{ name: "person", type: "material" }}
            avatarStyle={styles.avatarStyle}
            activeOpacity={0.7}
          />
          <Text style={styles.emailText}>{auth.currentUser?.email}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            type="solid"
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.changePictureButton}
            titleStyle={styles.buttonTitle}
            title="Change Picture"
            onPress={() => console.log("Change this picture!")}
          />

          <Button
            type="solid"
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.editProfileButton}
            titleStyle={styles.buttonTitle}
            title="Edit Profile"
            onPress={() => navigation.navigate("EditDoctorProfileScreen")}
          />

          <Button
            type="solid"
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.createWorkoutButton}
            titleStyle={styles.buttonTitle}
            title="Workout"
            onPress={openCreateWorkoutModal}
          />
          <Button
            type="solid"
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.createOrganizationButton} 
            titleStyle={styles.buttonTitle}
            title="Create Organization"
            onPress={openCreateOrganizationModal}
          />

          <Button
            type="solid"
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.logOutButton}
            titleStyle={styles.buttonTitle}
            title="Log Out"
            onPress={handleSignOut}
          />
        </View>

        <SearchBar
          round
          searchIcon={{ size: 26 }}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          placeholder="Search user by email"
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={() => searchFilterFunction("")}
          value={search}
        />
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>User Name</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Medical Condition</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Email Address</Text>
          </View>
          <FlatList
            data={filteredUserList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.tableRow}
                onPress={() => navigateToUserProfile(item)}
              >
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.medicalCondition}</Text>
                <Text style={styles.tableCell}>{item.email}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

      <Modal
        visible={createWorkoutModalVisible}
        animationType="slide"
        transparent={true}
        style={styles.modalContainer}
      >
        <View style={styles.modalContainer}>
          <ScrollView  contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Text  style={styles.headline}>Create Workout</Text>
              <Input
                name="workoutName"
                placeholder="Workout Name"
                onChangeText={(text) => setNewWorkout({ ...newWorkout, workoutName: text })}
                value={newWorkout.workoutName}
                style={{ marginBottom: 20 }}
              />
              <Input
                placeholder="Date"
                onChangeText={(text) => setNewWorkout({ ...newWorkout, date: text })}
                value={newWorkout.date}
              />
             <Picker
                selectedValue={selectedPatientId}
                onValueChange={(value) => setSelectedPatientId(value)}
              >
                <Picker.Item label="Select Patient" value="" />
                {patientList.map((patient) => (
                  <Picker.Item key={patient.id} label={patient.email} value={patient.email} />
                ))}
              </Picker>

              <View style={styles.exercisesContainer}>
                  {/* Exercise 1 */}
                  <View style={styles.exerciseContainer}>
                    <Text style={styles.formSubtitle}>Exercise 1</Text>
                    <Input
                      name="exercise1"
                      placeholder="Exercise Name"
                      onChangeText={(text) =>
                        setNewWorkout((prev) => {
                          const updatedExercises = [...prev.exercises];
                          updatedExercises[0].name = text;
                          return { ...prev, exercises: updatedExercises };
                        })
                      }
                      value={newWorkout.exercises[0].name}
                    />

                    <Text>Sets</Text>
                    <Picker
                      selectedValue={newWorkout.exercises[0].sets}
                      onValueChange={(value) =>
                        setNewWorkout((prevWorkout) => {
                          const updatedExercises = [...prevWorkout.exercises];
                          updatedExercises[0].sets = value;
                          return { ...prevWorkout, exercises: updatedExercises };
                        })
                      }
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <Picker.Item key={i} label={(i + 1).toString()} value={i + 1} />
                      ))}
                    </Picker>

                    <Text>Reps</Text>
                    <Picker
                      selectedValue={newWorkout.exercises[0].reps}
                      onValueChange={(value) =>
                        setNewWorkout((prevWorkout) => {
                          const updatedExercises = [...prevWorkout.exercises];
                          updatedExercises[0].reps = value;
                          return { ...prevWorkout, exercises: updatedExercises };
                        })
                      }
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <Picker.Item key={i} label={(i + 1).toString()} value={(i + 1).toString()} />
                      ))}
                    </Picker>
                  </View>

                  {/* Exercise 2 */}
                  <View style={styles.exerciseContainer}>
                    <Text style={styles.formSubtitle}>Exercise 2</Text>
                    <Input
                      name="exercise2"
                      placeholder="Exercise Name"
                      onChangeText={(text) =>
                        setNewWorkout((prev) => {
                          const updatedExercises = [...prev.exercises];
                          updatedExercises[1].name = text;
                          return { ...prev, exercises: updatedExercises };
                        })
                      }
                      value={newWorkout.exercises[1].name}
                    />

                    <Text>Sets</Text>
                    <Picker
                      selectedValue={newWorkout.exercises[1].sets}
                      onValueChange={(value) =>
                        setNewWorkout((prevWorkout) => {
                          const updatedExercises = [...prevWorkout.exercises];
                          updatedExercises[1].sets = value;
                          return { ...prevWorkout, exercises: updatedExercises };
                        })
                      }
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <Picker.Item key={i} label={(i + 1).toString()} value={i + 1} />
                      ))}
                    </Picker>

                    <Text>Reps</Text>
                    <Picker
                      selectedValue={newWorkout.exercises[1].reps}
                      onValueChange={(value) =>
                        setNewWorkout((prevWorkout) => {
                          const updatedExercises = [...prevWorkout.exercises];
                          updatedExercises[1].reps = value;
                          return { ...prevWorkout, exercises: updatedExercises };
                        })
                      }
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <Picker.Item key={i} label={(i + 1).toString()} value={(i + 1).toString()} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.exercisesContainer}>
                  {/* Exercise 3 */}
                  <View style={styles.exerciseContainer}>
                    <Text style={styles.formSubtitle}>Exercise 3</Text>
                    <Input
                      name="exercise3"
                      placeholder="Exercise Name"
                      onChangeText={(text) =>
                        setNewWorkout((prev) => {
                          const updatedExercises = [...prev.exercises];
                          updatedExercises[2].name = text;
                          return { ...prev, exercises: updatedExercises };
                        })
                      }
                      value={newWorkout.exercises[2].name}
                    />

                    <Text>Sets</Text>
                    <Picker
                      selectedValue={newWorkout.exercises[2].sets}
                      onValueChange={(value) =>
                        setNewWorkout((prevWorkout) => {
                          const updatedExercises = [...prevWorkout.exercises];
                          updatedExercises[2].sets = value;
                          return { ...prevWorkout, exercises: updatedExercises };
                        })
                      }
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <Picker.Item key={i} label={(i + 1).toString()} value={i + 1} />
                      ))}
                    </Picker>

                    <Text>Reps</Text>
                    <Picker
                      selectedValue={newWorkout.exercises[2].reps}
                      onValueChange={(value) =>
                        setNewWorkout((prevWorkout) => {
                          const updatedExercises = [...prevWorkout.exercises];
                          updatedExercises[2].reps = value;
                          return { ...prevWorkout, exercises: updatedExercises };
                        })
                      }
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <Picker.Item key={i} label={(i + 1).toString()} value={(i + 1).toString()} />
                      ))}
                    </Picker>
                  </View>

                  {/* Exercise 4 */}
                  <View style={styles.exerciseContainer}>
                    <Text style={styles.formSubtitle}>Exercise 4</Text>
                    <Input
                      name="exercise4"
                      placeholder="Exercise Name"
                      onChangeText={(text) =>
                        setNewWorkout((prev) => {
                          const updatedExercises = [...prev.exercises];
                          updatedExercises[3].name = text;
                          return { ...prev, exercises: updatedExercises };
                        })
                      }
                      value={newWorkout.exercises[3].name}
                    />

                    <Text>Sets</Text>
                    <Picker
                      selectedValue={newWorkout.exercises[3].sets}
                      onValueChange={(value) =>
                        setNewWorkout((prevWorkout) => {
                          const updatedExercises = [...prevWorkout.exercises];
                          updatedExercises[3].sets = value;
                          return { ...prevWorkout, exercises: updatedExercises };
                        })
                      }
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <Picker.Item key={i} label={(i + 1).toString()} value={i + 1} />
                      ))}
                    </Picker>

                    <Text>Reps</Text>
                    <Picker
                      selectedValue={newWorkout.exercises[3].reps}
                      onValueChange={(value) =>
                        setNewWorkout((prevWorkout) => {
                          const updatedExercises = [...prevWorkout.exercises];
                          updatedExercises[3].reps = value;
                          return { ...prevWorkout, exercises: updatedExercises };
                        })
                      }
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <Picker.Item key={i} label={(i + 1).toString()} value={(i + 1).toString()} />
                      ))}
                    </Picker>
                  </View>
                </View>
              <Button
                buttonStyle={[styles.submitWorkout, { width: 150,}]} 
                title="Submit Workout"
                onPress={createWorkout}
              />
              <Button
                buttonStyle={[styles.cancelWorkout, { width: 150 }]} 
                title="Cancel"
                onPress={closeCreateWorkoutModal}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
      <Modal
        visible={createOrganizationModalVisible}
        animationType="slide"
        transparent={true}
        style={styles.modalContainer}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.headline}>Create Organization</Text>
              <Input
                name="organizationName"
                placeholder="Organization Name"
                onChangeText={(text) => setNewOrganization({ ...newOrganization, organizationName: text })}
                value={newOrganization.organizationName}
                style={{ marginBottom: 20 }}
              />
              <Input
                name="street"
                placeholder="Street"
                onChangeText={(text) => setNewOrganization({ ...newOrganization, street: text })}
                value={newOrganization.street}
                style={{ marginBottom: 20 }}
              />
              <Input
                name="city"
                placeholder="City"
                onChangeText={(text) => setNewOrganization({ ...newOrganization, city: text })}
                value={newOrganization.city}
                style={{ marginBottom: 20 }}
              />
              <Input
                name="state"
                placeholder="State"
                onChangeText={(text) => setNewOrganization({ ...newOrganization, state: text })}
                value={newOrganization.state}
                style={{ marginBottom: 20 }}
              />
              <Input
                name="zipCode"
                placeholder="Zip Code"
                onChangeText={(text) => setNewOrganization({ ...newOrganization, zipCode: text })}
                value={newOrganization.zipCode}
                style={{ marginBottom: 20 }}
              />
              <Input
                name="phoneNumber"
                placeholder="Phone Number"
                onChangeText={(text) => setNewOrganization({ ...newOrganization, phoneNumber: text })}
                value={newOrganization.phoneNumber}
                style={{ marginBottom: 20 }}
              />
              <Input
                name="email"
                placeholder="Email"
                onChangeText={(text) => setNewOrganization({ ...newOrganization, email: text })}
                value={newOrganization.email}
                style={{ marginBottom: 20 }}
              />
              <Button
                buttonStyle={[styles.submitWorkout, { width: 150 }]}
                title="Submit Organization"
                onPress={createOrganization}
              />
              <Button
                buttonStyle={[styles.cancelWorkout, { width: 150 }]}
                title="Cancel"
                onPress={closeCreateOrganizationModal}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingTop: 20,
  },
  scrollContainer2: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarStyle: {
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#3498db",
  },
  emailText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "80%",
  },
  buttonContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
  },
  changePictureButton: {
    backgroundColor: "#778899",
    borderColor: "#3498db",
    marginRight: 5,
  },
  editProfileButton: {
    backgroundColor: "#8fbc8f",
    borderColor: "#27ae60",
    marginLeft: 5,
    marginRight: 5,
  },
  logOutButton: {
    backgroundColor: "#cd5c5c",
    borderColor: "#3498db",
    marginLeft: 5,
  },
  searchContainer: {
    width: "80%",
    marginBottom: 5,
    paddingBottom: 0,
  },
  searchInputContainer: {
    backgroundColor: "#fff",
    height: 40,
    marginBottom: 10,
  },
  tableContainer: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  tableHeader: {
    fontWeight: "bold",
  },
  addUserButton: {
    backgroundColor: "#ff7f50",
    borderColor: "#ff7f50",
  },
  formContainer: {
    display: "block",
    height: 700,
    width: 700,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3498db",
    marginLeft: 250,
  },
  createWorkoutButton: {
    backgroundColor: "#b0c4de",
    borderColor: "#3498db",
    marginLeft: 5,
    marginRight: 5,
  },
  formSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#2f4f4f",
  },
  setRepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  setRepDropdown: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  exerciseContainer: {
    width: '50%', // Two exercises side by side
    paddingHorizontal: 10,
  },
  exercisesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitWorkout: {
    marginTop: 20,
    marginLeft: 250,
    justifyContent: 'center',
    alignItems: 'center',

  
  },
  cancelWorkout: {
    marginTop: 10,
    marginLeft: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#808080',
  },
  patientDropdown: {
    height: 50,
    width: "80%",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  submitWorkout: {
    marginTop: 20,
    marginLeft: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#7DCEA0",
    borderColor: "#DAF7A6",
    borderWidth: 2,
  },
  cancelWorkout: {
    marginTop: 10,
    marginLeft: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#808080',
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop:100,
    marginLeft: 250,
    color: "#3498db",
  },
  createWorkoutButton: {
    backgroundColor: "#bdb76b",
    borderColor: "#3498db",
    marginLeft: 5,
    marginRight: 5, 
    
  },
  createOrganizationButton: {
    backgroundColor: "#bc8f8f",
    borderColor: "#3498db",
    marginLeft: 5,
    marginRight: 5,
  },
  
 
});

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Picker } from "react-native";
import { Avatar, Button } from "react-native-elements";
import { auth, firestore } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";

const UserProfile = ({ route }) => {
  const { user } = route.params || {};
  const [workoutPlanList, setWorkoutPlanList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Not Completed");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const userEmail = user.email;

        if (userEmail) {
          const workoutPlanCollection = collection(firestore, "workoutPlan");
          const q = query(workoutPlanCollection, where("email", "==", userEmail));

          const snapshot = await getDocs(q);
          const workoutPlanData = snapshot.docs.map((doc) => {
            const workoutName = doc.data().workoutName;
            const workoutDate = doc.data().workoutDate;
            const status = doc.data().status;

            return { id: doc.id, workoutName, workoutDate, status };
          });

          setWorkoutPlanList(workoutPlanData);
        }
      } catch (error) {
        console.error("Error getting workout plan documents: ", error);
      }
    };

    fetchWorkoutPlans();
  }, [user]);

  const handleStatusChange = async (workoutId) => {
    try {
      const workoutDocRef = doc(firestore, "workoutPlan", workoutId);
      await updateDoc(workoutDocRef, { status: selectedStatus });

      // Update the local state to reflect the new status
      setWorkoutPlanList((prevList) =>
        prevList.map((item) =>
          item.id === workoutId ? { ...item, status: selectedStatus === "Completed" } : item
        )
      );
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const handleClose = () => {
    // Add logic to close the UserProfile screen
    navigation.goBack(); // This assumes you are using a stack navigator
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar
          rounded
          size={120}
          icon={{ name: "person", type: "material" }}
          activeOpacity={0.7}
        />
        <Text style={styles.emailText}>{user.email}</Text>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>Workout Name</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Workout Date</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Status</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Update</Text>
        </View>

        {workoutPlanList.map((rowData) => (
          <View key={rowData.id} style={styles.tableRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("WorkoutScreen", { workoutId: rowData.id })}
              style={styles.link}
            >
              <Text style={[styles.tableCell, styles.linkTitle]}>{rowData.workoutName}</Text>
            </TouchableOpacity>
            <Text style={[styles.tableCell, styles.workoutDateCell]}>
              {rowData.workoutDate
                ? typeof rowData.workoutDate === "string"
                  ? rowData.workoutDate
                  : "Invalid Date"
                : "No Date"}
            </Text>
            <Text style={styles.tableCell, styles.statusStyle}>{rowData.status ? "Completed" : "Not Completed"}</Text>

            <View style={styles.statusUpdateContainer}>
              <View style={styles.statusPickerContainer}>
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                  style={styles.statusPicker}
                >
                  <Picker.Item label="Not Completed" value="Not Completed" />
                  <Picker.Item label="Completed" value="Completed" />
                </Picker>
              </View>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleStatusChange(rowData.id)}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={handleClose} style={styles.closeButtonContainer}>
        <Text style={styles.closeButton}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#F4F4F4",
  },
  emailText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333333",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "80%",
  },
  buttonContainer: {
    flex: 1,
    color: "#333333",
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
  tableContainer: {
    backgroundColor: "#FFFFFF",
    width: "80%",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#CCCCCC",
    alignItems: "center",
    marginVertical: 10,
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
  },
  tableHeader: {
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 5,
    marginTop: 2,
    marginLeft: 5,
  },
  avatarStyle: {
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#3498db",
  },
  updateButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  linkTitle: {
    fontSize: 16,
    color: "#2196F3",
    textDecorationLine: "underline",
    marginLeft:100,
  },
  statusUpdateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusPickerContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  statusPicker: {
    width: 120,
  },
  workoutDateCell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
    marginLeft: 30,
  },
  statusStyle: {
    marginRight:190,
  },

  closeButtonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },


  closeButton: {
    fontSize: 16,
    color: "blue",
  },
});





export default UserProfile;








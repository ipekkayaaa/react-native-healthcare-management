import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase";

const firestore = getFirestore();

const WorkoutScreen = ({ route }) => {
  const { workoutId } = route.params;
  const [workoutDetails, setWorkoutDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        const workoutDocRef = doc(firestore, "workoutPlan", workoutId);
        const workoutDoc = await getDoc(workoutDocRef);

        if (workoutDoc.exists()) {
          const data = workoutDoc.data();
          console.log("Workout document data:", data);
          setWorkoutDetails(data);
        } else {
          console.error("Workout document not found!");
          setError("Workout document not found!");
        }
      } catch (error) {
        console.error("Error getting workout details: ", error);
        setError("Error getting workout details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutDetails();
  }, [workoutId, navigation]);

  const handleClose = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
      <TouchableOpacity onPress={handleClose} style={styles.closeButtonContainer}>
        <Text style={styles.closeButton}>Close</Text>
      </TouchableOpacity>
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Exercise Name</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Set</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Rep</Text>
        </View>
        {workoutDetails.exercises.map((exercise, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{exercise.name}</Text>
            <Text style={styles.tableCell}>{exercise.sets}</Text>
            <Text style={styles.tableCell}>{exercise.reps}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  tableContainer: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 10,
    marginTop: 20,
    borderRadius: 10, 
    elevation: 3, 
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    padding: 15, 
    fontSize: 14,
  },
  tableCellHeader: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontWeight: "bold",
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
  tableCellHeader: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkoutScreen;

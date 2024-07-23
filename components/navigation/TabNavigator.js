import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import DietScreen from "../screens/DietScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DoctorProfileScreen from "../screens/DoctorProfileScreen";
import {
  getAuth,
  createUserWithEmailAndPassword,
  firestore,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  length,
  get,
  async,
} from "firebase/firestore";
import app from "../../firebase";
import OrganizationListScreen from "../screens/OrganizationListScreen";

const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const user = auth.currentUser;

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
  
    </Stack.Navigator>
  );
};
const decideprofile = async () => {
  const user = auth.currentUser;
  const patientsCollection = collection(db, "patients");
  const therapistCollection = collection(db, "therapist"); // Corrected collection name
    const patientQuery = query(patientsCollection, where("email", "==", user.email));
    const patientQuerySnapshot = await getDocs(patientQuery);
    if (patientQuerySnapshot.docs && patientQuerySnapshot.docs.length > 0) {
      // User found in the "patients" collection
      console.log('User found in the "patients" collection');
      return 0;
    } else {
      // User not found in the "patients" collection, check "therapists" collection
      const therapistQuery = query(therapistCollection, where("email", "==", user.email));
      const therapistQuerySnapshot = await getDocs(therapistQuery);

      if (therapistQuerySnapshot.docs && therapistQuerySnapshot.docs.length > 0) {
        // User found in the "therapists" collection
        console.log('User found in the "therapists" collection');
        return 1;
      } else {
        // User not found in either collection
        console.log('User not found in both "patients" and "therapists" collections');
      }
    }
} 

const HomeTabNavigator = () => {
  const [userType, setUserType] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await decideprofile();
        setUserType(result);
      } catch (error) {
        console.error('Error in HomeTabNavigator:', error);
        // Handle the error as needed
      }
    };

    fetchData();
  }, []);
  if(userType == 0){
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
            iconName = "md-home-outline";
            } else if (route.name === "Organizaitons") {
            iconName = "fitness-outline";
            } else if (route.name === "Profile") {
            iconName = "person-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "white",
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{ 
            headerShown: false, 
            tabBarStyle: {
              backgroundColor: '#5f9ea0',
            },
          }}
        />

        <Tab.Screen name="Organizaitons"
          component={OrganizationListScreen} 
          options={{
            headerShown: false,
            headerTitleAlign: "center",
            tabBarStyle: {
              backgroundColor: '#5f9ea0',
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            headerTitleAlign: "center",
            tabBarStyle: {
              backgroundColor: '#5f9ea0',
            },
          }}
        />
        

      
    </Tab.Navigator>
    );
  }else if(userType == 1){
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
            iconName = "md-home-outline";
            } else if (route.name === "Organizaitons") {
            iconName = "fitness-outline";
            } else if (route.name === "Therapist Profile") {
            iconName = "person-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "white",
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{ 
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#5f9ea0',
            },
          }}
        />
    
        <Tab.Screen name="Organizaitons"
         component={OrganizationListScreen} 
         options={{
          headerShown: false,
          headerTitleAlign: "center",
          tabBarStyle: {
            backgroundColor: '#5f9ea0',
          },
        }}
         
         
        />
        <Tab.Screen
        name="Therapist Profile"
        component={DoctorProfileScreen}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          tabBarStyle: {
            backgroundColor: '#5f9ea0',
          },
        }}
      />
    </Tab.Navigator>
    )
  }
};

export default HomeTabNavigator;



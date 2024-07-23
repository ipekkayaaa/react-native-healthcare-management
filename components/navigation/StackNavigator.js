import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeTabNavigator from "./TabNavigator";
import ProfileScreen from "../screens/ProfileScreen";
import SignUpScreen from "../screens/SignUpScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import DietScreen from "../screens/DietScreen";
import DoctorProfileScreen from "../screens/DoctorProfileScreen";
import WorkoutScreen from "../screens/WorkoutScreen";
import InformationForm from "../screens/InformationForm";
import DocotorFormScreen from "../screens/DoctorFormScreen";
import UserProfile from "../screens/UserProfile";
import OrganizationListScreen from "../screens/OrganizationListScreen";
import OrganizationInfoScreen from "../screens/OrganizationInfoScreen";
import EditDoctorProfileScreen from "../screens/EditDoctorProfileScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => { 
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DietScreen"
        component={DietScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DoctorProfileScreen"
        component={DoctorProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InformationForm"
        component={InformationForm}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WorkoutScreen"
        component={WorkoutScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DoctorFormScreen"
        component={DocotorFormScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OrganizationListScreen"
        component={OrganizationListScreen}
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="OrganizationInfoScreen"
        component={OrganizationInfoScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditDoctorProfileScreen"
        component={EditDoctorProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      
    </Stack.Navigator>
  );
};

export default StackNavigator;
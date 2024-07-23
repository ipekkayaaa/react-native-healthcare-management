import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Button } from "react-native-elements";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebase"; 
import { ImageBackground } from 'react-native';


const auth = getAuth(app); // Initialize Firebase Authentication

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("HomeScreen");
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const navigateSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log("Logged in with", user.email);
      navigation.navigate("HomeScreen");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.backgroundImageContainer}>
        <ImageBackground
          source={require('../assets/back2.png')}
          style={styles.backgroundImage}
        />
      </View>
      <View style={styles.containerContent}>
        <Text style={styles.greeting}>Welcome to Flexi Track!</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            containerStyle={styles.button}
            buttonStyle={[styles.button, styles.buttonOutline]}
            onPress={handleLogin}
            title="Login"
            titleStyle={styles.buttonOutlineText}
          />
          <View style={styles.textContainer}>
            <Text>You don't have an account?</Text>
            <Button
              type="clear"
              title="Register"
              titleStyle={styles.text}
              onPress={navigateSignUp}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Use row to position the image and content side by side
  },
  backgroundImageContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  containerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 700,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 30,
  },
  inputContainer: {
    width: "70%",
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
    width: 500,
    marginLeft: 20,
  },
  buttonContainer: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginLeft: 30,
  },
  button: {
    width: "100%",
    borderRadius: 10,
  },
  buttonOutline: {
    backgroundColor: "#7DCEA0",
    marginTop: 5,
    borderColor: "#DAF7A6",
    borderWidth: 2,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    fontSize: 15,
  },
});

export default LoginScreen;
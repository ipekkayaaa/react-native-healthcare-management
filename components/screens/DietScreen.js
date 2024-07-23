import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

function DietScreen({ navigation }) {
  const goBack = () => {
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
        <Ionicons name="ios-arrow-back" size={24} color="blue" />
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
      <Text style={styles.pageTitle}>Explore Healthy Lifestyle</Text>
      <Text style={styles.pageDescription}>
        Welcome to a journey of self-improvement and well-being! Dive into a treasure trove of resources that will empower you to lead a healthier and more fulfilling life. Here, we have carefully curated an array of valuable content to uplift your mind, body, and spirit. Explore a wealth of articles, delve into transformative diets, and stay updated with the latest health news—all designed to guide you on your path to a happier, healthier you.
      </Text>

      <View style={styles.linksContainer}>
        <LinkSection title="Healthy Articles">
          <LinkButton title="Women Health" url="https://www.mayoclinic.org/healthy-lifestyle/womens-health/basics/womens-health/hlv-20049411" />
          <LinkButton title="Healthy Aging" url="https://www.mayoclinic.org/healthy-lifestyle/healthy-aging/basics/healthy-aging-over-50/hlv-20049407" />
          <LinkButton title="Focus on Mental Health" url="https://pubmed.ncbi.nlm.nih.gov/31597057/" />
        </LinkSection>

        <LinkSection title="Diets">
          <LinkButton title="Nutrition and Healthy Eating" url="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/basics/nutrition-basics/hlv-20049477" />
          <LinkButton title="Mediterranean Diet" url="https://www.example.com/healthy-diet-2https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/mediterranean-diet/art-20047801" />
          <LinkButton title="Weight Loss" url="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/basics/weightloss-basics/hlv-20049483" />
        </LinkSection>
        <LinkSection title="Health News">
          <LinkButton title="News" url="https://healthnews.com/news/" />
          <LinkButton title="Mobile Health News" url="https://www.mobihealthnews.com/" />
          <LinkButton title="Hardvard Health" url="https://www.health.harvard.edu/" />
        </LinkSection>
      </View>
    </View>
  );
}

function LinkButton({ title, url }) {
  return (
    <TouchableOpacity onPress={() => openLink(url)} style={styles.linkContainer}>
      <Text style={styles.linkTitle}>{title}</Text>
      <Ionicons name="ios-arrow-forward" size={24} color="blue" />
    </TouchableOpacity>
  );
}

function LinkSection({ title, children }) {
  return (
    <View style={styles.linkSection}>
      <Text style={styles.linkCategory}>{title}</Text>
      {children}
    </View>
  );
}

function openLink(url) {
  Linking.openURL(url); // This will open the URL in the device's default browser.
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#b0c4de', // Use a lighter background color
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    marginTop: 20,
    marginleft: 50,
    textAlign: "center",
  },
  pageDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: "black", // Darker text color
  },
  linksContainer: {
    marginTop: 20,
   // Adjusted margin-top
  },
  linkSection: {
    marginBottom: 20,
    backgroundColor: "#f0f0f0", // Use a light background for link sections
    padding: 15,
    borderRadius: 10, // Add border radius for a card-like effect
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
  },
  linkCategory: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Align title and icon to opposite ends
    marginBottom: 10, // Add margin bottom for separation
  },
  linkTitle: {
    fontSize: 16,
    color: "blue",
    marginRight: 10,
  },
  goBackButton: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  goBackText: {
    fontSize: 16,
    color: "blue",
    marginLeft: 5,
  },
});


export default DietScreen;

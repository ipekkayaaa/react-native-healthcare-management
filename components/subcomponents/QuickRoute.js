import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Text,
} from "react-native";

const { width } = Dimensions.get("screen");
const cardWidth = width / 1.2;

function QuickRoute({ page }) {
  return (
    <View style={styles.quickRoute}>
      <ImageBackground
        style={styles.quickRouteImage}
        imageStyle={{ borderRadius: 15 }}
        source={page.image}
      >
        <View style={styles.routeTag}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{page.name}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

export default QuickRoute;

const styles = StyleSheet.create({
  quickRoute: {
    flex: 1,
    aspectRatio: 1,
    elevation: 15,
    marginRight: 20,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: "white",
  },
  routeText: {
    fontSize: 20, 
    fontWeight: "bold",
    lineHeight: 24,
  },
  quickRouteImage: {
    flex: 1,
    borderRadius: 15,
    justifyContent: "center",
  },
  routeTag: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(230, 230, 250, 0.7)",
  },
});

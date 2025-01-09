import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RouteScreen = ({ route }: any) => {
  const { originLat, originLng, destLat, destLng } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Route Details</Text>
      <Text>Origin: {originLat}, {originLng}</Text>
      <Text>Destination: {destLat}, {destLng}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default RouteScreen;

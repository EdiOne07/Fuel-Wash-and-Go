import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider"; // Import slider component
import { apiUrl } from "../utils";

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [profile, setProfile] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [radius, setRadius] = useState<number>(10); // Default radius value

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionId = await AsyncStorage.getItem("sessionId");
        if (!sessionId) {
          throw new Error("No session ID found.");
        }

        const response = await fetch(`${apiUrl}/users/profile`, {
          headers: {
            "Content-Type": "application/json",
            sessionid: sessionId,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile.");
        }

        setProfile(data);

        // Fetch the human-readable address
        const { coordinates } = data.location;
        fetchAddress(coordinates[1], coordinates[0]); // Reverse geocoding uses lat, lng
      } catch (error) {
       // Alert.alert("Error", error.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch human-readable address from coordinates
  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAxJgnZdRkfjkZn8v1T_YrqU5MP16B2vas`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const address = data.results[0].formatted_address;

        // If address not found, show closest street
        const closestStreet =
          data.results.find((result: { types: string | string[]; }) =>
            result.types.includes("route")
          )?.formatted_address || address;

        setAddress(closestStreet || "Address not found");
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Address not available");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {profile && (
        <View style={styles.infoContainer}>
          <Text style={styles.label}>📧 Email:</Text>
          <Text style={styles.value}>{profile.email}</Text>

          <Text style={styles.label}>👤 Name:</Text>
          <Text style={styles.value}>{profile.name}</Text>

          <Text style={styles.label}>📍 Location:</Text>
          <Text style={styles.value}>
            {address || "Fetching address..."}
          </Text>

          <Text style={styles.label}>📏 Radius Setting:</Text>
          <View style={styles.radiusContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={20} // Maximum radius is now 20 km
              step={1}
              value={radius}
              onValueChange={(value: number) => setRadius(value)}
            />
            <Text style={styles.radiusValue}>
              Selected Radius: {radius} km
            </Text>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={async () => {
            await AsyncStorage.removeItem("sessionId");
            navigation.navigate("Login");
          }}
          color="#FF6347"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    color: "#555",
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
    color: "#777",
  },
  radiusContainer: {
    marginTop: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  radiusValue: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 16,
    paddingHorizontal: 32,
  },
});

export default ProfileScreen;

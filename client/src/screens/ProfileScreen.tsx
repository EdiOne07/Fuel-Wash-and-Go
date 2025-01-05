import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiUrl } from "../utils";
import Slider from "@react-native-community/slider";
import { useRadius } from "../components/RadiusContext";

const ProfileScreen = ({ navigation }: { navigation: any }) =>{
  const [profileData, setProfileData] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const {radius, setRadius} = useRadius(); // Default radius in km

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionId = await AsyncStorage.getItem("sessionId");
        if (!sessionId) {
          Alert.alert("Error", "Session ID not found. Please log in again.");
          return;
        }

        const response = await fetch(`${apiUrl}/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            sessionid: sessionId,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProfileData(data);
        const { coordinates } = data.location;
        fetchAddress(coordinates[1], coordinates[0]); // Reverse geocoding uses lat, lng
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", "Failed to fetch profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  const handleRadiusChange = (value: number) => {
    setRadius(value); 
  };
  const handleLogout = async () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const sessionId = await AsyncStorage.getItem("sessionId");
              if (!sessionId) {
                Alert.alert("Error", "Session ID not found. Please log in again.");
                navigation.replace("Login");
                return;
              }

              const response = await fetch(`${apiUrl}/users/logout`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  sessionid: sessionId,
                },
              });

              if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
              }

              // Clear session ID from storage
              await AsyncStorage.removeItem("sessionId");

              // Navigate to Login screen
              navigation.replace("Login");
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Error", "Failed to logout. Please try again later.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No profile data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profileData.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{profileData.name}</Text>
        </View>
        <View style={styles.row}>
        <Text style={styles.label}>Location:  </Text>
          <Text style={styles.value}>
            {address || "Fetching address..."}
          </Text>

        </View>
      </View>
      <View style={[styles.card,{marginTop:20}]}>
      <View style={styles.radiusSection}>
        <Text style={styles.radiusTitle}>Radius Setting</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={radius}
          onValueChange={handleRadiusChange}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#1E90FF"
        />
        <Text style={styles.radiusValue}>{`Selected Radius: ${radius} km`}</Text>
        </View>
      </View>
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Button
          title="Logout"
          color="#FF0000"
          onPress={handleLogout}
        />  
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  radiusSection: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  radiusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  radiusValue:{
    fontSize: 16,
    marginTop: 8,
    fontWeight: "500",
    color: "#333",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },
  value: {
    color: "#555",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
});

export default ProfileScreen;
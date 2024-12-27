import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert, Text } from "react-native";
import { apiUrl } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GasStation {
  name: string;
  location: { lat: number; lng: number };
  address: string;
}

const HomePageScreen = ({ navigation }: { navigation: any }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  // Fetch nearby gas stations
  useEffect(() => {
    if (!location) return;

    const fetchGasStations = async () => {
      setLoading(true);
      try {
        const sessionId = await AsyncStorage.getItem("sessionId"); // Retrieve session ID
    
        if (!sessionId) {
          throw new Error("Session ID not found. Please log in again.");
        }
    
        const response = await fetch(
          `${apiUrl}/maps/nearby-gas-stations?latitude=${location!.latitude}&longitude=${location!.longitude}&radius=10000`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              sessionid: sessionId, 
            },
          }
        );
    
        if (response.status === 401) {
          Alert.alert("Unauthorized", "Your session has expired. Please log in again.");
          navigation.navigate("LogIn");
          return;
        }

        
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format: Expected an array");
        }
    
        setGasStations(data);
      } catch (error) {
        console.error("Error fetching gas stations:", error);
        Alert.alert("Error", "Failed to fetch gas stations. Please try again later.");
        setGasStations([]); // Avoid issues with map()
      } finally {
        setLoading(false);
      }
    };

    fetchGasStations();
  }, [location, navigation]);

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>{errorMsg}</Text>
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location!.latitude,
          longitude: location!.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* User Location Marker */}
        <Marker
          coordinate={{ latitude: location!.latitude, longitude: location!.longitude }}
          title="You are here"
          pinColor="blue"
        />

        {/* Gas Station Markers */}
        {Array.isArray(gasStations) &&
          gasStations.map((station, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: station.location.lat, longitude: station.location.lng }}
              title={station.name}
              description={station.address}
              pinColor="red"
            />
          ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomePageScreen;

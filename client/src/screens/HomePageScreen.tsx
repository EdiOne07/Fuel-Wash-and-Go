import React, { useEffect, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert, Text, Button, Modal } from "react-native";
import { apiUrl } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRadius } from "../components/RadiusContext";

interface GasStation {
  name: string;
  location: { lat: number; lng: number };
  address: string;
  price: string;
  status: string;
  place_id: string;
}

interface WashingStation {
  name: string;
  location: { lat: number; lng: number };
  address: string;
  status: string;
  place_id: string;
}

const HomePageScreen = ({ navigation }: { navigation: any }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [washingStations, setWashingStations] = useState<WashingStation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { radius } = useRadius();
  const [selectedStation] = useState<any>(null); // State for selected station
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  // Set header button for navigation
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <Button
            title="Profile"
            onPress={() => navigation.navigate("Profile")}
            color="#000"
          />
        </View>
      ),
    });
  }, [navigation]);

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
        const sessionId = await AsyncStorage.getItem("sessionId");
        if (!sessionId) {
          throw new Error("Session ID not found. Please log in again.");
        }

        const response = await fetch(
          `${apiUrl}/maps/nearby-gas-stations?latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius * 1000}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              sessionid: sessionId,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        setGasStations(data);
      } catch (error) {
        console.error("Error fetching gas stations:", error);
        Alert.alert("Error", "Failed to fetch gas stations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGasStations();
  }, [location, radius]);

  // Fetch nearby washing stations
  useEffect(() => {
    if (!location) return;

    const fetchWashingStations = async () => {
      setLoading(true);
      try {
        const sessionId = await AsyncStorage.getItem("sessionId");
        if (!sessionId) {
          throw new Error("Session ID not found. Please log in again.");
        }

        const response = await fetch(
          `${apiUrl}/maps/nearby-washing-stations?latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius * 1000}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              sessionid: sessionId,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setWashingStations(data);
      } catch (error) {
        console.error("Error fetching washing stations:", error);
        Alert.alert("Error", "Failed to fetch washing stations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWashingStations();
  }, [location, radius]);

  const handleInfoPress = (station: GasStation | WashingStation) => {
    console.log("Selected station:", station); // Debug log
    console.log("Station place_id:", station.place_id); // Verify place_id exists
    
    if (!station.place_id) {
      Alert.alert("Error", "Station place_id is missing!");
      return;
    }

    
    const stationType = station.address.includes("Gas") ? "gas" : "washing";
  
    // Navigate to StationDetails and pass the required parameters
    navigation.navigate("StationDetails", {
      stationId: station.place_id,  // Replace with a unique identifier like station.id if available
      stationType: stationType, // "gas" or "washing"
    });
  };
  
  

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
          pinColor="green"
        />

        {/* Gas Station Markers */}
        {gasStations.map((station, index) => (
           station.location && (
          <Marker
            key={index}
            coordinate={{ latitude: station.location.lat, longitude: station.location.lng }}
            title={station.name}
            description={station.address}
            pinColor="red"
          >
            <Callout onPress={() => handleInfoPress(station)}>
              <Text>{station.name}</Text>
              <Text>{station.address}</Text>
              <Text style={styles.infoText}>Tap for info and route</Text>
            </Callout>
          </Marker>
           )
        ))}

        {/* Washing Station Markers */}
        {washingStations.map((station, index) => (
           station.location && (
          <Marker
            key={index}
            coordinate={{ latitude: station.location.lat, longitude: station.location.lng }}
            title={station.name}
            description={station.address}
            pinColor="blue"
          >
            <Callout onPress={() => handleInfoPress(station)}>
              <Text>{station.name}</Text>
              <Text>{station.address}</Text>
              <Text style={styles.infoText}>Tap for more info</Text>
            </Callout>
          </Marker>
           )
        ))}
      </MapView>

      {/* Modal for Additional Information */}
      {selectedStation && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedStation.name}</Text>
              <Text>Address: {selectedStation.address}</Text>
              <Text>Price: {selectedStation.price || "N/A"}</Text>
              <Text>Status: {selectedStation.status || "N/A"}</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
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
  infoText: {
    color: "blue",
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default HomePageScreen;

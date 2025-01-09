import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Button,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiUrl } from "../utils";
import { StackScreenProps } from "@react-navigation/stack";

type RootStackParamList = {
  StationDetails: {
    stationId: string;
    stationType: "gas" | "washing";
  };
  RouteScreen: {
    originLat: number;
    originLng: number;
    destLat: number;
    destLng: number;
  };
};

type StationDetailsScreenProps = StackScreenProps<RootStackParamList, "StationDetails">;

const StationDetailsScreen: React.FC<StationDetailsScreenProps> = ({ route, navigation }) => {
  const { stationId } = route.params;
  const [stationDetails, setStationDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );

  useEffect(() => {
    const fetchStationDetails = async () => {
      setLoading(true);
      try {
        const sessionId = await AsyncStorage.getItem("sessionId");

        if (!sessionId) {
          throw new Error("Session ID not found. Please log in again.");
        }

        const endpoint = `${apiUrl}/maps/gas-station/${stationId}`;
        console.log("Fetching station details from:", endpoint);

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            sessionid: sessionId,
          },
        });

        if (!response.ok) {
          const responseBody = await response.text();
          throw new Error(`HTTP Error! Status: ${response.status}, Body: ${responseBody}`);
        }

        const data = await response.json();
        setStationDetails(data);
      } catch (error) {
        console.error("Error fetching station details:", error);
        Alert.alert("Error", `Failed to fetch station details`);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserLocation = async () => {
      try {
        const location = await AsyncStorage.getItem("userLocation");
        if (location) {
          const { latitude, longitude } = JSON.parse(location);
          setUserLocation({ latitude, longitude });
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    fetchStationDetails();
    fetchUserLocation();
  }, [stationId]);

  const handleDrive = async () => {
    if (!userLocation || !stationDetails || !stationDetails.location) {
      Alert.alert("Error", "Unable to fetch route. Missing location data.");
      return;
    }

    const { latitude: originLat, longitude: originLng } = userLocation;
    const { lat: destLat, lng: destLng } = stationDetails.location;

    navigation.navigate("RouteScreen", { originLat, originLng, destLat, destLng });
  };

  const formatDuration = (seconds: number | undefined): string =>
    seconds ? `${Math.ceil(seconds / 60)} minutes` : "N/A";

  const formatStatus = (status: string | undefined): string => {
    switch (status) {
      case "OPERATIONAL":
        return "Open";
      case "CLOSED_TEMPORARILY":
        return "Temporarily Closed";
      case "UNKNOWN":
        return "Status Unknown";
      default:
        return status || "Unknown";
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!stationDetails) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Failed to load station details.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Photo Section */}
      {stationDetails.photo_url ? (
        <Image
          source={{ uri: stationDetails.photo_url }}
          style={styles.photo}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noPhotoContainer}>
          <Text style={styles.noPhotoText}>No Photo Available</Text>
        </View>
      )}

      {/* Title and Address */}
      <Text style={styles.title}>{stationDetails.name || "Unknown Name"}</Text>
      <Text style={styles.subtitle}>{stationDetails.address || "Address not available"}</Text>

      {/* General Information Section */}
      <View style={styles.infoBox}>
        <Text style={styles.sectionTitle}>General Information</Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Status: </Text>
          {formatStatus(stationDetails.status)}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Price: </Text>
          {stationDetails.price || "Price not available"}
        </Text>
      </View>

      {/* Opening Hours Section */}
      {stationDetails.opening_hours && (
        <View style={styles.infoBox}>
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          {stationDetails.opening_hours.map((line: string, index: number) => (
            <Text style={styles.detailText}>
              {line}
            </Text>
          ))}
        </View>
      )}

      {/* Traffic Information Section */}
      <View style={styles.infoBox}>
        <Text style={styles.sectionTitle}>Traffic Information</Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Traffic Status: </Text>
          {stationDetails.traffic_status || "N/A"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Duration: </Text>
          {formatDuration(stationDetails.duration)}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Duration in Traffic: </Text>
          {formatDuration(stationDetails.duration_in_traffic)}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Back to Map" onPress={() => navigation.goBack()} />
        <Button title="Drive" onPress={handleDrive} color="#007BFF" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  noPhotoContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 20,
  },
  noPhotoText: {
    fontSize: 16,
    color: "#757575",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40, // Add extra margin for safe area
    alignSelf: "center",
    width: "90%",
  },
});


export default StationDetailsScreen;

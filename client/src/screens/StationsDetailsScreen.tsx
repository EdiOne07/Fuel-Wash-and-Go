import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiUrl } from "../utils";
import { StackScreenProps } from "@react-navigation/stack";

type RootStackParamList = {
  StationDetails: {
    stationId: string;
    stationType: "gas" | "washing";
  };
};

type StationDetailsScreenProps = StackScreenProps<RootStackParamList, 'StationDetails'>;

const StationDetailsScreen: React.FC<StationDetailsScreenProps> = ({ route, navigation }) => {
  const { stationId, stationType } = route.params;
  const [stationDetails, setStationDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStationDetails = async () => {
      setLoading(true);
      try {
        const sessionId = await AsyncStorage.getItem("sessionId");
  
        if (!sessionId) {
          throw new Error("Session ID not found. Please log in again.");
        }
  
        const endpoint = `${apiUrl}/maps/gas-station/place_id=${stationId}`;
        console.log("Fetching station details from:", endpoint);
  
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            sessionid: sessionId,
          },
        });
  
        console.log("Response Status:", response.status);
        const responseBody = await response.text();
        console.log("Response Body:", responseBody);
  
        if (response.status === 401) {
          Alert.alert("Unauthorized", "Your session has expired. Please log in again.");
          return;
        }
  
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}, Body: ${responseBody}`);
        }
  
        const data = JSON.parse(responseBody);
        setStationDetails(data);
      } catch (error) {
        console.error("Error fetching station details:", error);
        Alert.alert("Error", `Failed to fetch station details`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStationDetails();
  }, [stationId, navigation]);
  
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{stationDetails.name}</Text>
      <Text style={styles.subtitle}>{stationDetails.address}</Text>

      {Object.keys(stationDetails).map(
        (key) =>
          key !== "name" &&
          key !== "address" && (
            <View key={key} style={styles.detailRow}>
              <Text style={styles.detailKey}>{key}:</Text>
              <Text style={styles.detailValue}>{stationDetails[key]}</Text>
            </View>
          )
      )}

      <Button title="Back to Map" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  detailKey: {
    fontWeight: "bold",
    marginRight: 10,
  },
  detailValue: {
    flexShrink: 1,
  },
});

export default StationDetailsScreen;

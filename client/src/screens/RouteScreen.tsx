import React, { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

type Props = {
  route: {
    params: {
      originLat: number;
      originLng: number;
      destLat: number;
      destLng: number;
    };
  };
};

const RouteScreen: React.FC<Props> = ({ route }) => {
  const { originLat, originLng, destLat, destLng } = route.params;

  const [userLocation, setUserLocation] = useState({
    latitude: originLat,
    longitude: originLng,
  });
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchRoute = async () => {
    try {
      const apiKey = "AIzaSyAxJgnZdRkfjkZn8v1T_YrqU5MP16B2vas";
  
      // Snap user location to the nearest road
      const snapResponse = await axios.get(
        "https://roads.googleapis.com/v1/nearestRoads",
        {
          params: {
            key: apiKey,
            points: `${originLat},${originLng}`,
          },
        }
      );
  
      // Validate snap response
      const snappedLocation =
        snapResponse.data.snappedPoints &&
        snapResponse.data.snappedPoints.length > 0
          ? snapResponse.data.snappedPoints[0].location
          : { latitude: originLat, longitude: originLng };
  
      console.log("Snapped Location:", snappedLocation);
  
      const origin = `${snappedLocation.latitude},${snappedLocation.longitude}`;
      const destination = `${destLat},${destLng}`;
  
      // Fetch the route
      const requestUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${apiKey}`;
      console.log("Request URL:", requestUrl);
  
      const response = await axios.get(requestUrl);
  
      if (!response.data.routes || response.data.routes.length === 0) {
        throw new Error("No routes found");
      }
  
      const points = decodePolyline(
        response.data.routes[0].overview_polyline.points
      );
      setRouteCoordinates(points);
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const decodePolyline = (encoded: string) => {
    let points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b, shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1 ? ~(result >> 1) : result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1 ? ~(result >> 1) : result >> 1);
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  const trackUserLocation = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setUserLocation({ latitude, longitude });
        }
      );
    } catch (error) {
      console.error("Error tracking user location:", error);
      Alert.alert("Error", "Failed to track user location.");
    }
  };

  useEffect(() => {
    fetchRoute();
    trackUserLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: originLat,
          longitude: originLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        followsUserLocation
      >
        <Marker
          coordinate={{ latitude: originLat, longitude: originLng }}
          title="Start"
          description="Your location"
        />
        <Marker
          coordinate={{ latitude: destLat, longitude: destLng }}
          title="Destination"
          description="Gas Station"
        />
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#007BFF"
          strokeWidth={4}
        />
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RouteScreen;

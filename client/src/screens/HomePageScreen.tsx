import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';

interface GasStation {
  name: string;
  location: { lat: number; lng: number };
  address: string;
}

const HomePageScreen = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch user's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // Fetch nearby gas stations
  useEffect(() => {
    if (!location) return;

    const fetchGasStations = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.161:3000/api/maps/nearby-gas-stations?latitude=${location.latitude}&longitude=${location.longitude}&radius=1000`
        ); // Adjust the radius as needed
        const data = await response.json();
        setGasStations(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch gas stations.');
      }
    };

    fetchGasStations();
  }, [location]);

  if (errorMsg) {
    return (
      <View style={styles.centered}>
      </View>
    );
  }

  if (!location) {
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
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* User Location Marker */}
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title="You are here"
          pinColor="blue"
        />

        {/* Gas Station Markers */}
        {gasStations.map((station, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: station.location.lat, longitude: station.location.lng }}
            title={station.name}
            description={station.address}
            pinColor="red" // Marker color for gas stations
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomePageScreen;

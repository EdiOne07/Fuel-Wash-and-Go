import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface GasStation {
  name: string;
  location: { lat: number; lng: number };
  address: string;
}

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  gasStations: GasStation[];
}

const GoogleMapScreen: React.FC<GoogleMapProps> = ({ latitude, longitude, gasStations }) => {
  const mapRef = useRef(null);

  // Create an HTML string with embedded Google Maps and markers for gas stations
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAxJgnZdRkfjkZn8v1T_YrqU5MP16B2vas&callback=initMap" async defer></script>
        <style>
          #map {
            height: 100%;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div id="map" style="height: 100%;"></div>
        <script>
          let map;

          function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: ${latitude}, lng: ${longitude} },
              zoom: 14
            });

            // Add markers for gas stations
            const gasStations = ${JSON.stringify(gasStations)};
            gasStations.forEach(station => {
              const marker = new google.maps.Marker({
                position: station.location,
                map: map,
                title: station.name
              });

              const infoWindow = new google.maps.InfoWindow({
                content: '<div><h3>' + station.name + '</h3><p>' + station.address + '</p></div>'
              });

              marker.addListener('click', function() {
                infoWindow.open(map, marker);
              });
            });
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={mapRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ height: 500, width: '100%' }}
      />
    </View>
  );
};

export default GoogleMapScreen;

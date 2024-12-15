import { Client, LatLngLiteral } from '@googlemaps/google-maps-services-js';
import axios from 'axios';


const client = new Client({});

export interface PlaceResult {
  name: string;
  location: LatLngLiteral;
  rating: number;
  address: string;

}

export const findNearbyPlaces = async (
  latitude: number,
  longitude: number,
  radius: number,
  keyword: string = 'gas station'
): Promise<PlaceResult[]> => {
  try {
    const response = await client.placesNearby({
      params: {
        location: { lat: latitude, lng: longitude },
        radius,
        keyword,
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    return response.data.results
      .filter(place => place.geometry?.location && place.name) // Ensure required fields exist
      .map(place => ({
        name: place.name || 'Unknown Name', // Default name if undefined
        location: place.geometry!.location, // Guaranteed by the filter above
        rating: place.rating || 0, // Default rating if undefined
        address: place.vicinity || 'Unknown Address', // Default address if undefined
      }));
  } catch (error) {
    throw new Error(`Google Maps API Error: ${(error as Error).message}`);
  }
};


export interface TrafficStatusResult {
  origin: LatLngLiteral;
  destination: LatLngLiteral;
  trafficStatus: string;
  duration: number; // Normal duration
  durationInTraffic: number; // Duration considering traffic
}

export const getTrafficStatus = async (Latitude: number, Longitude: number) => {
  try {
    const origin = `${Latitude},${Longitude}`;
    const destination = `${Latitude + 0.01},${Longitude + 0.01}`; // Small offset for testing

    const response = await client.directions({
      params: {
        origin,
        destination,
        departure_time: 'now',
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    const route = response.data.routes[0];

    const trafficDelay = route?.legs[0]?.duration_in_traffic?.value ?? 0; // Use fallback value 0
    const normalTime = route?.legs[0]?.duration?.value ?? 0;
    
    if (!trafficDelay || !normalTime) {
      console.warn('Traffic data unavailable. Returning fallback status.');
      return 'Smooth'; // Default status when no traffic data is available
    }
    
    // Calculate traffic status
    let trafficStatus = "Normal";

    if (trafficDelay > normalTime * 1.5) {
      trafficStatus = "Busy";
    } else if (trafficDelay > normalTime * 1.2) {
      trafficStatus = "AverageBusy";
    } else {
      trafficStatus = "Light";
    }
    
    return { trafficStatus };
    
  } catch (error) {
    throw new Error(`Traffic Status Error: ${(error as Error).message}`);
  }
};



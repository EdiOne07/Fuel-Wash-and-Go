import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export const findNearbyGasStations = async (
  latitude: number,
  longitude: number,
  radius: number = 5000, // Default radius: 5km
  keyword: string = 'gas station'
) => {
  try {
    const response = await client.placesNearby({
      params: {
        location: { lat: latitude, lng: longitude },
        radius,
        keyword,
        key: process.env.GOOGLE_MAPS_API_KEY!, // Add your API key in the .env file
      },
    });

    return response.data.results;
  } catch (error) {
    throw new Error(`Google Maps API Error: ${(error as Error).message}`);
  }
};

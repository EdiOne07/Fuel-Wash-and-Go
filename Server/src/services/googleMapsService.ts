import { Client, LatLngLiteral } from '@googlemaps/google-maps-services-js';

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

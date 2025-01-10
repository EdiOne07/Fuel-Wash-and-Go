import { Client, LatLngLiteral,PlaceDetailsRequest } from '@googlemaps/google-maps-services-js';

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
      .filter((place) => place.geometry?.location && place.name) // Ensure required fields exist
      .map((place) => ({
        name: place.name || 'Unknown Name', // Default name if undefined
        location: place.geometry!.location, // Guaranteed by the filter above
        rating: place.rating || 0, // Default rating if undefined
        address: place.vicinity || 'Unknown Address', // Default address if undefined
      }));
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw new Error(`Google Maps API Error: ${(error as Error).message}`);
  }
};

export const findNearbyPlacesDetailed = async ({
  latitude,
  longitude,
  radius = 1000,
  keyword = "gas station",
}: {
  latitude: number;
  longitude: number;
  radius?: number;
  keyword?: string;
}): Promise<any[]> => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured.");
  }

  const allResults: any[] = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const response = await client.placesNearby({
      params: {
        location: { lat: latitude, lng: longitude },
        radius,
        keyword,
        pagetoken: nextPageToken, // Use nextPageToken if available
        key: apiKey,
      },
      timeout: 10000,
    });

    // Add results to the array
    if (response.data.results) {
      allResults.push(...response.data.results);
    }

    // Update nextPageToken (if no more results, this will be undefined)
    nextPageToken = response.data.next_page_token;

    // Delay for pagination (API requires a short delay before using next_page_token)
    if (nextPageToken) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
    }
  } while (nextPageToken);

  return allResults.map((result) => ({
    name: result.name || "Unknown",
    location: result.geometry?.location || null,
    address: result.vicinity || "No address available",
    rating: result.rating || 0,
    business_status: result.business_status || "UNKNOWN",
    place_id: result.place_id || "",
  }));
};

export interface TrafficStatusResult {
  origin: LatLngLiteral;
  destination: LatLngLiteral;
  trafficStatus: string;
  duration: number; // Normal duration
  durationInTraffic: number; // Duration considering traffic
}

/**
 * Fetch place details using Google Maps API
 */
export const getPlaceDetails = async (placeId: string): Promise<any> => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Maps API key is not configured.');
  }

  console.log('Fetching place details for place_id:', placeId);

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
      },
      timeout: 10000, // 10 seconds timeout
    });

    console.log('Google Maps API response:', response.data.result);

    return response.data.result;
  } catch (error: any) {
    console.error('Error from Google Maps API:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error_message || 'Failed to fetch place details');
  }
};
export const getTrafficStatus = async (latitude: number, longitude: number): Promise<TrafficStatusResult> => {
  try {
    const origin = `${latitude},${longitude}`;
    const destination = `${latitude + 0.01},${longitude + 0.01}`; // Small offset for testing

    const response = await client.directions({
      params: {
        origin,
        destination,
        departure_time: 'now',
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    const route = response.data.routes[0];

    if (!route || !route.legs || route.legs.length === 0) {
      console.warn('Traffic data unavailable. Returning fallback status.');
      return {
        origin: { lat: latitude, lng: longitude },
        destination: { lat: latitude + 0.01, lng: longitude + 0.01 },
        trafficStatus: 'Smooth',
        duration: 0,
        durationInTraffic: 0,
      };
    }

    const normalTime = route.legs[0].duration?.value || 0; // Seconds
    const trafficTime = route.legs[0].duration_in_traffic?.value || 0; // Seconds

    // Calculate traffic status
    let trafficStatus = 'Smooth';

    if (trafficTime > normalTime * 1.5) {
      trafficStatus = 'Heavy';
    } else if (trafficTime > normalTime * 1.2) {
      trafficStatus = 'Moderate';
    } else {
      trafficStatus = 'Light';
    }

    return {
      origin: { lat: latitude, lng: longitude },
      destination: { lat: latitude + 0.01, lng: longitude + 0.01 },
      trafficStatus,
      duration: normalTime,
      durationInTraffic: trafficTime,
    };
  } catch (error) {
    console.error('Error fetching traffic status:', error);
    throw new Error(`Traffic Status Error: ${(error as Error).message}`);
  }
};

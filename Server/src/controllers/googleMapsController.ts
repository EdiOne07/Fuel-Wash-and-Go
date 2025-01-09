import { Request, Response } from 'express';
import { findNearbyPlaces, findNearbyPlacesDetailed, getTrafficStatus } from '../services/googleMapsService';
import { LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { getPlaceDetails } from "../services/googleMapsService";
/**
 * Fetch nearby gas stations using Google Maps API
 */
import { Client } from '@googlemaps/google-maps-services-js';
import { fetchGasPrices } from '../services/gasPriceService';
import axios from "axios";


const client = new Client();

export const getStationDetails = async (req: Request, res: Response): Promise<void> => {
  const { id: place_id } = req.params; // Extract place_id from params
  console.log('Fetching details for place_id:', place_id);

  if (!place_id) {
    res.status(400).json({ error: 'place_id is required.' });
    return;
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is not configured.');
    }

    const response = await client.placeDetails({
      params: {
        place_id,
        key: apiKey,
      },
      timeout: 10000, // 10 seconds timeout
    });
    
    const result = response.data.result;

    // Extract location
    const location = result.geometry?.location;

    // Fetch gas prices
    const gasPrice = location
      ? await fetchGasPrices({ latitude: location.lat, longitude: location.lng })
      : null;

    // Fetch traffic status
    const trafficData = location
      ? await getTrafficStatus(location.lat, location.lng)
      : null;

    // Prepare the station details
    const stationDetails = {
      name: result.name || "Unknown",
      address: result.formatted_address || "Address not available",
      status: result.business_status || "UNKNOWN",
      price: gasPrice || "Price not available",
      opening_hours: result.opening_hours?.weekday_text || null,
      traffic_status: trafficData?.trafficStatus || "Unknown",
      duration: trafficData?.duration || null,
      duration_in_traffic: trafficData?.durationInTraffic || null,
      photo_url: result.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=${apiKey}`
        : null,
    };

    res.status(200).json(stationDetails);
  } catch (error) {
    console.error('Error fetching station details:', error);
    res.status(500).json({
      error: 'Failed to fetch station details',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getTrafficStatusForLocation = async (req: Request, res: Response): Promise<void> => {
  const { latitude, longitude, radius = 1000, keyword = 'gas station' } = req.query;

  if (!latitude || !longitude) {
    res.status(400).json({ error: 'Latitude and Longitude are required' });
    return;
  }

  try {
    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);

    // Fetch nearby places
    const stations = await findNearbyPlaces(lat, lng, parseInt(radius as string, 10), keyword as string);

    // Map stations with traffic status
    const stationsWithStatus = await Promise.all(
      stations.map(async (station) => {
        const trafficStatus = await getTrafficStatus(station.location.lat, station.location.lng);
        return {
          ...station,
          trafficStatus,
        };
      })
    );

    res.status(200).json(stationsWithStatus);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const getNearbyWashingStations = async (req: Request, res: Response): Promise<void> => {
  const { latitude, longitude, radius = 1000, keyword = 'car wash' } = req.query;

  if (!latitude || !longitude) {
    res.status(400).json({ error: 'Latitude and Longitude are required' });
    return;
  }

  try {
    const stations = await findNearbyPlaces(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      parseInt(radius as string, 10),
      keyword as string
    );

    res.status(200).json(stations);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const getNearbyStations = async (req: Request, res: Response): Promise<void> => {
  const { latitude, longitude, radius = 1000, keyword = 'gas station' } = req.query;

  if (!latitude || !longitude) {
    res.status(400).json({ error: 'Latitude and Longitude are required' });
    return;
  }

  try {
    const stations = await findNearbyPlacesDetailed({
      latitude: parseFloat(latitude as string),
      longitude: parseFloat(longitude as string),
      radius: parseInt(radius as string, 10),
      keyword: keyword as string,
    });

    res.status(200).json(stations);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};
  
export const getGasStationById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  console.log('Fetching details for place_id:', id);

  if (!id) {
    res.status(400).json({ error: 'Station ID is required.' });
    return;
  }

  try {
    const stationDetails = await getPlaceDetails(id);

    res.status(200).json(stationDetails);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to fetch station details', details: errorMessage });
  }
};
  

export const getRoute = async (req: Request, res: Response): Promise<void> => {
  const { originLat, originLng, destLat, destLng } = req.query;

  if (!originLat || !originLng || !destLat || !destLng) {
    res.status(400).json({ error: "Origin and destination coordinates are required." });
    return;
  }
  
  try {
       const response = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin: `${originLat},${originLng}`,
          destination: `${destLat},${destLng}`,
          mode: "driving", 
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status === "OK") {
      res.status(200).json(response.data);
    } else {
      res.status(500).json({ error: response.data.error_message || "Failed to fetch route" });
    }
  } catch (error) {
    console.error("Error fetching route:", error);
    res.status(500).json({ error: "Failed to fetch route. Please try again later." }); 
  }
};
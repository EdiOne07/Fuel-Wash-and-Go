import { Request, Response } from 'express';
import { findNearbyPlaces, getTrafficStatus } from '../services/googleMapsService';
import { LatLngLiteral } from '@googlemaps/google-maps-services-js';
import axios from "axios";

export const getNearbyStations = async (req: Request, res: Response): Promise<void> => {
  const { latitude, longitude, radius = 1000, keyword = 'gas station' } = req.query;

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
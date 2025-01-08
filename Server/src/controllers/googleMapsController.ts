import { Request, Response } from 'express';
import { findNearbyPlaces, getTrafficStatus } from '../services/googleMapsService';
import { LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { findStationById } from "../services/googleMapsService";
/**
 * Fetch nearby gas stations using Google Maps API
 */
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

/**
 * Fetch gas stations with dynamic traffic status
 */
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
export const getGasStationById = async (req: Request, res: Response): Promise<void> => {
  const stationId = req.params.id; // Retrieve the alphanumeric ID from the route parameter

  console.log("Received Station ID:", stationId); // Debugging

  if (!stationId || !/^[a-zA-Z0-9_-]+$/.test(stationId)) { // Alphanumeric plus dashes/underscores
    res.status(400).json({ error: 'Invalid Station ID. Must be alphanumeric.' });
    return;
  }

  try {
    const station = await findStationById(stationId);

    if (!station) {
      res.status(404).json({ error: 'Station not found.' });
      return;
    }

    res.status(200).json(station);
  } catch (error) {
    console.error("Error fetching station details:", error);
    res.status(500).json({ error: 'Internal Server Error'});
  }
};
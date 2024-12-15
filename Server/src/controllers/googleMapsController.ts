import { Request, Response } from 'express';
import { findNearbyPlaces } from '../services/googleMapsService'
import { getTrafficStatus } from '../services/googleMapsService';
import { LatLngLiteral } from '@googlemaps/google-maps-services-js';

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

  // Check if latitude and longitude are provided
  if (!latitude || !longitude) {
    res.status(400).json({ error: 'Latitude and Longitude are required' });
    return;
  }

  try {
    // Convert latitude and longitude to numbers
    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);

    // 1. Get the nearby stations
    const stations = await findNearbyPlaces(lat, lng, parseInt(radius as string, 10), keyword as string);

    // 2. For each station, get the traffic status
    const stationsWithStatus = await Promise.all(
      stations.map(async (station) => {
        // Call getTrafficStatus for each station's location
        const trafficStatus = await getTrafficStatus(station.location.lat, station.location.lng);

        // Return the station with its traffic status
        return {
          ...station,
          trafficStatus: trafficStatus, // Attach the traffic status to each station
        };
      })
    );

    // 3. Send the stations with their traffic status in the response
    res.status(200).json(stationsWithStatus);
  } catch (error) {
    // Handle errors (e.g., API issues, internal errors)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

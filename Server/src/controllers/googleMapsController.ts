import { Request, Response } from 'express';
import { findNearbyPlaces } from '../services/googleMapsService';

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

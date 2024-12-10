import { Request, Response } from 'express';
import * as googleMapsService from '../services/googleMapsService';

export const getNearbyGasStations = async (req: Request, res: Response): Promise<void> => {
  const { latitude, longitude, radius, keyword } = req.query;

  if (!latitude || !longitude) {
    res.status(400).json({ error: 'Latitude and longitude are required' });
    return;
  }

  try {
    const stations = await googleMapsService.findNearbyGasStations(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      radius ? parseInt(radius as string, 10) : undefined,
      keyword as string
    );

    res.status(200).json(stations);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

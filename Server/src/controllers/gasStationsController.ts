import { Request, Response } from 'express';
import * as stationService from '../services/gasStationService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getStations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      latitude,
      longitude,
      radius,
      status,
      maxPrice,
      minRating,
    } = req.query;

    const stations = await stationService.getStations({
      latitude: latitude ? parseFloat(latitude as string) : undefined,
      longitude: longitude ? parseFloat(longitude as string) : undefined,
      radius: radius ? parseInt(radius as string, 10) : undefined,
      status: status as string,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
    });

    res.status(200).json(stations);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};


export const getStationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const station = await stationService.getStationById(id);
    if (!station) {
      res.status(404).json({ error: 'Station not found' });
      return;
    }
    res.status(200).json(station);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const createStation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const stationData = req.body;

  try {
    const newStation = await stationService.createStation(stationData);
    res.status(201).json(newStation);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const updateStation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedStation = await stationService.updateStation(id, updateData);
    if (!updatedStation) {
      res.status(404).json({ error: 'Station not found' });
      return;
    }
    res.status(200).json(updatedStation);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const deleteStation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await stationService.deleteStation(id);
    if (!deleted) {
      res.status(404).json({ error: 'Station not found' });
      return;
    }
    res.status(200).json({ message: 'Station deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

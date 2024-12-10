import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import * as washingStationService from '../services/washingStationService';

export const getWashingStations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const washingStations = await washingStationService.getWashingStations();
    res.status(200).json(washingStations);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const getWashingStationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const washingStation = await washingStationService.getWashingStationById(id);
    if (!washingStation) {
      res.status(404).json({ error: 'Washing Station not found' });
      return;
    }
    res.status(200).json(washingStation);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const createWashingStation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { user } = req;
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Only admins can create washing stations' });
    return;
  }

  const data = req.body;

  try {
    const newWashingStation = await washingStationService.createWashingStation(data);
    res.status(201).json(newWashingStation);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const updateWashingStation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { user } = req;
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Only admins can update washing stations' });
    return;
  }

  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedWashingStation = await washingStationService.updateWashingStation(id, updateData);
    if (!updatedWashingStation) {
      res.status(404).json({ error: 'Washing Station not found' });
      return;
    }
    res.status(200).json(updatedWashingStation);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const deleteWashingStation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { user } = req;
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Only admins can delete washing stations' });
    return;
  }

  const { id } = req.params;

  try {
    const deleted = await washingStationService.deleteWashingStation(id);
    if (!deleted) {
      res.status(404).json({ error: 'Washing Station not found' });
      return;
    }
    res.status(200).json({ message: 'Washing Station deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

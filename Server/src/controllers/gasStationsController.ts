

import { Request, Response } from 'express';
import * as stationService from '../services/gasStationService';

export const getStations = async (req: Request, res: Response): Promise<void> => {
  const type = req.query.type as string | undefined;
  const location = req.query.location as string | undefined;
  const price_range = req.query.price_range as string | undefined;
  const rating = req.query.rating as string | undefined;

  try {
    const stations = await stationService.getStations({ type, location, price_range, rating });
    res.status(200).json(stations);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const getStationById = async (req: Request, res: Response): Promise<void> => {
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

export const createStation = async (req: Request, res: Response): Promise<void> => {
  const stationData = req.body;

  try {
    const newStation = await stationService.createStation(stationData);
    res.status(201).json(newStation);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};

export const updateStation = async (req: Request, res: Response): Promise<void> => {
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

export const deleteStation = async (req: Request, res: Response): Promise<void> => {
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

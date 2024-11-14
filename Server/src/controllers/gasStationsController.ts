import { Request, Response } from 'express';
import * as stationService from '../services/gasStationService';
import admin from 'firebase-admin';

export const getStations = async (req: Request, res: Response): Promise<void> => {
  const { type, location, price_range, rating } = req.query;

  try {
    const stations = await stationService.getStations({ type, location, price_range, rating });
    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createStation = async (req: Request, res: Response): Promise<void> => {
  const stationData = req.body;

  try {
    const newStation = await stationService.createStation(stationData);
    res.status(201).json(newStation);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

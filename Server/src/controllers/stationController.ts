// src/controllers/stationController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Status } from 'src/models/gasStation';

const prisma = new PrismaClient();

// Retrieve a list of stations with optional filters
export const getStations = async (req: Request, res: Response): Promise<void> => {
  const { type, location, price_range, rating } = req.query;
  
  try {
    const stations = await prisma.gasStations.findMany({
      where: {
        ...(type && { status: type as Status }),
        ...(location && { location_id: parseInt(location as string, 10) }),
        ...(price_range && { gas_price: { lte: parseInt(price_range as string, 10) } }),
        ...(rating && { rating: { gte: parseInt(rating as string, 10) } }),
      },
    });
    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch details for a specific station
export const getStationById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const station = await prisma.gasStations.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!station) {
      res.status(404).json({ error: 'Station not found' });
      return;
    }
    res.status(200).json(station);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a new station (for admins or authorized users)
export const addStation = async (req: Request, res: Response): Promise<void> => {
  const { name, washing_station_available, gas_price, location_id, status, rating } = req.body;

  try {
    const newStation = await prisma.gasStations.create({
      data: {
        name,
        washing_station_available,
        gas_price,
        location_id,
        status,
        rating,
      },
    });
    res.status(201).json(newStation);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update station information (for admins)
export const updateStation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, washing_station_available, gas_price, location_id, status, rating } = req.body;

  try {
    const updatedStation = await prisma.gasStations.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        washing_station_available,
        gas_price,
        location_id,
        status,
        rating,
      },
    });
    res.status(200).json(updatedStation);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a station entry (for admins)
export const deleteStation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.gasStations.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(200).json({ message: 'Station deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

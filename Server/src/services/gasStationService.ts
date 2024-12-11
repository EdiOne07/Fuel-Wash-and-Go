import GasStation, { IGasStation } from '../models/gasStation';
import { findNearbyPlaces } from './googleMapsService';
import { fetchGasPrices } from './gasPriceService';

export const getStations = async (filters: {
  latitude?: number;
  longitude?: number;
  radius?: number;
  status?: string;
  maxPrice?: number;
  minRating?: number;
  searchTerm?: string;
}): Promise<IGasStation[]> => {
  const query: any = {};

  if (filters.status) query.status = filters.status;
  if (filters.maxPrice !== undefined) query.gasPrice = { $lte: filters.maxPrice };
  if (filters.minRating !== undefined) query.rating = { $gte: filters.minRating };
  if (filters.searchTerm) query.$text = { $search: filters.searchTerm };

  const aggregationPipeline: any[] = [];

  if (filters.latitude && filters.longitude && filters.radius) {
    aggregationPipeline.push({
      $geoNear: {
        near: { type: 'Point', coordinates: [filters.longitude, filters.latitude] },
        distanceField: 'distance',
        maxDistance: filters.radius,
        spherical: true,
      },
    });
  }

  aggregationPipeline.push({ $match: query });

  const dbStations = await GasStation.aggregate(aggregationPipeline);

  if (filters.latitude && filters.longitude && filters.radius) {
    const apiStations = await findNearbyPlaces(
      filters.latitude,
      filters.longitude,
      filters.radius,
      filters.searchTerm || 'gas station'
    );

    const uniqueStations = apiStations.filter(
      apiStation => !dbStations.some(dbStation => dbStation.name === apiStation.name)
    );

    return [...dbStations, ...uniqueStations];
  }

  return dbStations;
};



export const updateGasPriceForStation = async (stationId: string, gasPrice: number): Promise<void> => {
  const station = await GasStation.findById(stationId);
  if (station) {
    station.gasPrice = gasPrice;
    station.lastUpdated = new Date();
    await station.save();
  }
};


export const getStationById = async (id: string): Promise<IGasStation | null> => {
  return GasStation.findById(id);
};

export const createStation = async (stationData: IGasStation): Promise<IGasStation> => {
  return GasStation.create(stationData);
};

export const updateStation = async (id: string, updateData: Partial<IGasStation>): Promise<IGasStation | null> => {
  return GasStation.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteStation = async (id: string): Promise<boolean> => {
  const result = await GasStation.findByIdAndDelete(id);
  return !!result;
};

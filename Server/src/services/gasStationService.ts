import GasStation, { IGasStation } from '../models/gasStation';

export const getStations = async (filters: {
  latitude?: number;
  longitude?: number;
  radius?: number; // in meters
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

  if (filters.latitude !== undefined && filters.longitude !== undefined && filters.radius !== undefined) {
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

  return GasStation.aggregate(aggregationPipeline);
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

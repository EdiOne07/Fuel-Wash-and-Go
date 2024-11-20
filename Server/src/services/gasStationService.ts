import GasStation, { IGasStation } from '../models/gasStation';

export const getStations = async (filters: {
  type?: string;
  location?: string;
  price_range?: string;
  rating?: string;
}): Promise<IGasStation[]> => {
  const query: any = {};

  if (filters.type) query.status = filters.type;
  if (filters.location) query.locationId = filters.location;
  if (filters.price_range) query.gasPrice = { $lte: parseFloat(filters.price_range) };
  if (filters.rating) query.rating = { $gte: parseFloat(filters.rating) };

  return GasStation.find(query);
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

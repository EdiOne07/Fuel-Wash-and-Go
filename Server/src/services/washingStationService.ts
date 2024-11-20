import WashingStation, { IWashingStation } from '../models/washingStation';

export const getWashingStations = async (): Promise<IWashingStation[]> => {
  return await WashingStation.find();
};

export const getWashingStationById = async (id: string): Promise<IWashingStation | null> => {
  return await WashingStation.findById(id);
};

export const createWashingStation = async (data: IWashingStation): Promise<IWashingStation> => {
  return await WashingStation.create(data);
};

export const updateWashingStation = async (
  id: string,
  updateData: Partial<IWashingStation>
): Promise<IWashingStation | null> => {
  return await WashingStation.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteWashingStation = async (id: string): Promise<boolean> => {
  const result = await WashingStation.findByIdAndDelete(id);
  return !!result;
};

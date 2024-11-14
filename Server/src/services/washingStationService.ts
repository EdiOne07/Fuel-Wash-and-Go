import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getWashingStations = async () => {
  return await prisma.washing_station.findMany({
    include: { gas_stations: true },
  });
};

export const getWashingStationById = async (id: string) => {
  return await prisma.washing_station.findUnique({
    where: { id: parseInt(id) },
    include: { gas_stations: true },
  });
};

export const createWashingStation = async (data: any) => {
  return await prisma.washing_station.create({ data });
};

export const updateWashingStation = async (id: string, data: any) => {
  return await prisma.washing_station.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteWashingStation = async (id: string) => {
  return await prisma.washing_station.delete({
    where: { id: parseInt(id) },
  });
};

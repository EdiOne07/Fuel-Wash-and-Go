import cron from 'node-cron';
import GasStation from '../models/gasStation';
import { fetchGasPrices } from '../services/gasPriceService';
import { fetchTrafficData } from '../services/trafficService';

export const scheduleGasPriceUpdates = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Updating gas prices...');
    const stations = await GasStation.find();
    for (const station of stations) {
      const price = await fetchGasPrices({
        latitude: station.location.coordinates[1],
        longitude: station.location.coordinates[0],
      });

      if (price !== null) {
        station.gasPrice = price;
        station.lastUpdated = new Date();
        await station.save();
      }
    }
    console.log('Gas prices updated successfully.');
  });
};


export const scheduleTrafficUpdates = () => {
  cron.schedule('*/15 * * * *', async () => { // Every 15 minutes
    console.log('Updating gas station traffic statuses...');
    const stations = await GasStation.find();

    for (const station of stations) {
      const status = await fetchTrafficData({
        latitude: station.location.coordinates[1],
        longitude: station.location.coordinates[0],
      });

      station.status = status;
      await station.save();
    }

    console.log('Traffic statuses updated successfully.');
  });
};
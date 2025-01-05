import cron from 'node-cron';
import GasStation from '../models/gasStation';
import { fetchGasPrices } from '../services/gasPriceService';

export const scheduleGasPriceUpdates = () => {
  cron.schedule('0 * * * *', async () => { // Every hour
    console.log('Updating gas prices...');
    const stations = await GasStation.find();
    for (const station of stations) {
      const price = await fetchGasPrices({
        latitude: station.location.coordinates[1],
        longitude: station.location.coordinates[0],
      });

      if (price) {
        station.gasPrice = price;
        station.lastUpdated = new Date();
        await station.save();
      }
    }
    console.log('Gas prices updated successfully.');
  });
};

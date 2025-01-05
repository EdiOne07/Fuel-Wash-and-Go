import axios from 'axios';

const GAS_PRICE_API_KEY = process.env.GAS_PRICE_API_KEY;

interface Location {
  latitude: number;
  longitude: number;
}

export const fetchGasPrices = async (location: Location): Promise<number | null> => {
  try {
    const response = await axios.get('https://api.gasbuddy.com/v1/prices', {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        apiKey: GAS_PRICE_API_KEY,
      },
    });

    const prices = response.data.prices;
    if (prices && prices.length > 0) {
      return prices[0].price; // Return the first available price
    }

    return null; // No price available
  } catch (error) {
    console.error('Error fetching gas prices:', error);
    return null;
  }
};

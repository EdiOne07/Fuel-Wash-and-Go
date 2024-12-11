import axios from 'axios';
import { Status } from '../models/gasStation';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface Location {
  latitude: number;
  longitude: number;
}

export const fetchTrafficData = async (location: Location): Promise<Status> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json`,
      {
        params: {
          origins: `${location.latitude},${location.longitude}`,
          destinations: `${location.latitude},${location.longitude}`,
          departure_time: 'now',
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const trafficInfo = response.data.rows[0]?.elements[0]?.duration_in_traffic;
    const normalDuration = response.data.rows[0]?.elements[0]?.duration;

    if (!trafficInfo || !normalDuration) {
      return Status.Empty; // Default if traffic data is unavailable
    }

    const delay = (trafficInfo.value - normalDuration.value) / normalDuration.value;

    if (delay < 0.1) return Status.Empty;
    if (delay < 0.4) return Status.AverageBusy;
    return Status.VeryBusy;
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    return Status.Empty; // Default fallback
  }
};

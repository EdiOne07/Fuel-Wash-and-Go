import mongoose, { Schema, Document } from 'mongoose';

export interface IWashingStation extends Document {
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  gasStationId: mongoose.Types.ObjectId; // Reference to GasStation
  standardWashPrice: number;
  comfortWashPrice: number;
  premiumWashPrice: number;
  lastUpdated?: Date; // Timestamp of the last wash price update
  rating: number;
  place_id: string; // Google Places ID for washing station
}

const WashingStationSchema = new Schema<IWashingStation>({
  name: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  gasStationId: { type: mongoose.Schema.Types.ObjectId, ref: 'GasStation', required: true },
  standardWashPrice: { type: Number, required: true },
  comfortWashPrice: { type: Number, required: true },
  premiumWashPrice: { type: Number, required: true },
  lastUpdated: { type: Date },
  rating: { type: Number, default: 0 },
  place_id: { type: String, required: true },
});

// Enable geospatial queries
WashingStationSchema.index({ location: '2dsphere' });

export default mongoose.model<IWashingStation>('WashingStation', WashingStationSchema);

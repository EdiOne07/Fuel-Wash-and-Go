import mongoose, { Schema, Document } from 'mongoose';

export interface IWashingStation extends Document {
  gasStationId: mongoose.Types.ObjectId; // Reference to GasStation
  standardWashPrice: number;
  comfortWashPrice: number;
  premiumWashPrice: number;
}

const WashingStationSchema = new Schema<IWashingStation>({
  gasStationId: { type: mongoose.Schema.Types.ObjectId, ref: 'GasStation', required: true },
  standardWashPrice: { type: Number, required: true },
  comfortWashPrice: { type: Number, required: true },
  premiumWashPrice: { type: Number, required: true },
});

export default mongoose.model<IWashingStation>('WashingStation', WashingStationSchema);

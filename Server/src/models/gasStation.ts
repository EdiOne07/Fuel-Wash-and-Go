import mongoose, { Schema, Document } from 'mongoose';

export enum Status {
  Empty = 'Empty',
  AverageBusy = 'AverageBusy',
  VeryBusy = 'VeryBusy',
}

export interface IGasStation extends Document {
  name: string;
  locationId: mongoose.Types.ObjectId; // Reference to Location model
  gasPrice: number;
  status: Status;
  washingStationId?: mongoose.Types.ObjectId; // Optional reference to WashingStation
  rating: number;
}

const GasStationSchema = new Schema<IGasStation>({
  name: { type: String, required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  gasPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.Empty,
  },
  washingStationId: { type: mongoose.Schema.Types.ObjectId, ref: 'WashingStation' },
  rating: { type: Number, default: 0 },
});

export default mongoose.model<IGasStation>('GasStation', GasStationSchema);

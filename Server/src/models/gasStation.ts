import mongoose, { Schema, Document } from 'mongoose';

export enum Status {
  Empty = 'Empty',
  AverageBusy = 'AverageBusy',
  VeryBusy = 'VeryBusy',
}

export interface IGasStation extends Document {
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  gasPrice?: number; // Optional field for real-time gas prices
  lastUpdated?: Date; // Timestamp of the last gas price update
  status: Status;
  washingStationId?: mongoose.Types.ObjectId;
  rating: number;
}

const GasStationSchema = new Schema<IGasStation>({
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
  gasPrice: { type: Number },
  lastUpdated: { type: Date },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.Empty,
  },
  washingStationId: { type: mongoose.Schema.Types.ObjectId, ref: 'WashingStation' },
  rating: { type: Number, default: 0 },
});

GasStationSchema.index({ location: '2dsphere' });

export default mongoose.model<IGasStation>('GasStation', GasStationSchema);

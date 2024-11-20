import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  types: string[];
}

const LocationSchema = new Schema<ILocation>({
  placeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  types: { type: [String], required: true }, // Array of location types
});

export default mongoose.model<ILocation>('Location', LocationSchema);

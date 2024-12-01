import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  location: string;
  firebaseUid: string;
  favouriteStationId?: mongoose.Types.ObjectId; // Optional reference to GasStation
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  location: { type: String, required: true },
  firebaseUid: { type: String, required: true, unique: true },
  favouriteStationId: { type: mongoose.Schema.Types.ObjectId, ref: 'GasStation' },
});

export default mongoose.model<IUser>('User', UserSchema);

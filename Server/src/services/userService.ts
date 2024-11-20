import User, { IUser } from '../models/user';

export const createUser = async (
  firebaseUid: string,
  email: string,
  username: string,
  location: string
): Promise<IUser> => {
  const user = new User({ firebaseUid, email, username, location });
  return await user.save();
};

export const getUserByFirebaseUid = async (firebaseUid: string): Promise<IUser | null> => {
  return await User.findOne({ firebaseUid });
};

export const updateUserProfile = async (
  firebaseUid: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findOneAndUpdate({ firebaseUid }, updateData, { new: true });
};

export const deleteUserProfile = async (firebaseUid: string): Promise<IUser | null> => {
  return await User.findOneAndDelete({ firebaseUid });
};

export const getUserProfile = async (firebaseUid: string): Promise<IUser | null> => {
  return await User.findOne({ firebaseUid }).populate('favouriteStationId'); 
};

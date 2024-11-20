import User, { IUser } from '../models/user';

// Create a new user
export const createUser = async (
  firebaseUid: string,
  email: string,
  username: string,
  location: string
): Promise<IUser> => {
  const newUser = new User({
    firebaseUid,
    email,
    username,
    location,
  });

  return await newUser.save();
};

// Get a user by Firebase UID
export const getUserByFirebaseUid = async (firebaseUid: string): Promise<IUser | null> => {
  return await User.findOne({ firebaseUid });
};

// Update user details
export const updateUserById = async (
  userId: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

// Delete a user
export const deleteUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(userId);
};

// Get user details by ID
export const getUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId);
};

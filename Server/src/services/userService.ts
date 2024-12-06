import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import bcrypt from 'bcrypt';

interface RegisterInput {
  email: string;
  username: string;
  location: string;
  password: string;
}

export const register = async (input: RegisterInput): Promise<void> => {
  const { email, username, location, password } = input;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, username, location, password: hashedPassword });
  await newUser.save();
};

export const login = async (email: string, password: string): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return token;
};



// export const createUser = async (
//   firebaseUid: string,
//   email: string,
//   username: string,
//   location: string
// ): Promise<IUser> => {
//   const user = new User({ firebaseUid, email, username, location });
//   return await user.save();
// };

// export const getUserByFirebaseUid = async (firebaseUid: string): Promise<IUser | null> => {
//   return await User.findOne({ firebaseUid });
// };

// export const updateUserProfile = async (
//   firebaseUid: string,
//   updateData: Partial<IUser>
// ): Promise<IUser | null> => {
//   return await User.findOneAndUpdate({ firebaseUid }, updateData, { new: true });
// };

// export const deleteUserProfile = async (firebaseUid: string): Promise<IUser | null> => {
//   return await User.findOneAndDelete({ firebaseUid });
// };

// export const getUserProfile = async (firebaseUid: string): Promise<IUser | null> => {
//   return await User.findOne({ firebaseUid }).populate('favouriteStationId'); 
// };

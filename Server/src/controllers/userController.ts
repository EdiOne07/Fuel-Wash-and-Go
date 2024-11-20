import { Request, Response } from 'express';
import User from '../models/user';
import admin from 'firebase-admin';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, username, location, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const newUser = new User({ email, username, location, password });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};


export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.body; // Ensure UID is passed in request

  try {
    await admin.auth().revokeRefreshTokens(uid); // Revoke Firebase tokens if applicable
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout user' });
  }
};


export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Expect `id` in request params
  const { username, location } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, location },
      { new: true }
    );
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

export const deleteUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user profile' });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

import { Request, Response } from 'express';
import * as userService from '../services/userService';
import admin from 'firebase-admin';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, username, location } = req.body;

  try {
    // Verify Firebase token to get UID
    const decodedToken = await admin.auth().verifyIdToken(req.headers.authorization?.split('Bearer ')[1] || '');
    const firebaseUid = decodedToken.uid;

    const existingUser = await userService.getUserByFirebaseUid(firebaseUid);
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const user = await userService.createUser(firebaseUid, email, username, location);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error'});
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const firebaseUid = res.locals.uid; // Set in authentication middleware

  try {
    const user = await userService.getUserProfile(firebaseUid);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error'});
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const firebaseUid = res.locals.uid;
  const updateData = req.body;

  try {
    const updatedUser = await userService.updateUserProfile(firebaseUid, updateData);
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error'});
  }
};

export const deleteUserProfile = async (req: Request, res: Response): Promise<void> => {
  const firebaseUid = res.locals.uid;

  try {
    const deletedUser = await userService.deleteUserProfile(firebaseUid);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const firebaseUid = res.locals.uid;

  try {
    await admin.auth().revokeRefreshTokens(firebaseUid);
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
};


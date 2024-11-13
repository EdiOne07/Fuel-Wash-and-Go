import { Request, Response } from 'express';
import * as userService from '../services/userService';
import admin from 'firebase-admin';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, username, location } = req.body;
  const firebaseUid = res.locals.firebaseUid;

  try {
    const existingUser = await userService.getUserByFirebaseUid(firebaseUid);
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
    const user = await userService.createUser(firebaseUid, email, username, location);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.body; // Ensure the UID is provided in the request body

  if (!uid) {
    res.status(400).json({ error: 'User UID is required' });
    return;
  }

  try {
    await admin.auth().revokeRefreshTokens(uid);
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { uid } = res.locals; // Ensure the UID is set in res.locals by your authentication middleware
  const { displayName, photoURL } = req.body;

  if (!uid) {
    res.status(400).json({ error: 'User UID is required' });
    return;
  }

  try {
    const updatedUser = await admin.auth().updateUser(uid, {
      displayName,
      photoURL,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { uid } = res.locals; // Ensure the UID is set in res.locals by your authentication middleware

  if (!uid) {
    res.status(400).json({ error: 'User UID is required' });
    return;
  }

  try {
    await admin.auth().deleteUser(uid);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const firebaseUid = res.locals.firebaseUid;

  try {
    const user = await userService.getUserByFirebaseUid(firebaseUid);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

import { Request, Response } from 'express';
import * as userService from '../services/userService';
import admin from '../config/firebase';
import * as UserService from '../services/userService';





export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, username, location, password } = req.body;
  try {
    await UserService.register({ email, username, location, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user', details: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const token = await UserService.login(email, password);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in', details: (error as Error).message });
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
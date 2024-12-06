import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  try {
    await userService.registerUser({ name, email, password, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const sessionId = await userService.loginUser(email, password);
    res.status(200).json({ message: 'Login successful', sessionId });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const promoteUserToAdmin = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const updatedUser = await userService.promoteToAdmin(userId);
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User promoted to admin', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
};


export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { sessionid } = req.headers;

  if (!sessionid || typeof sessionid !== 'string') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const user = await userService.getUserProfile(sessionid);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { sessionid } = req.headers;
  const updateData = req.body;

  if (!sessionid || typeof sessionid !== 'string') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const updatedUser = await userService.updateUserProfile(sessionid, updateData);
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
};

export const deleteUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { sessionid } = req.headers;

  if (!sessionid || typeof sessionid !== 'string') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const deletedUser = await userService.deleteUserProfile(sessionid);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const { sessionid } = req.headers;

  if (!sessionid || typeof sessionid !== 'string') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    await userService.logoutUser(sessionid);
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
};

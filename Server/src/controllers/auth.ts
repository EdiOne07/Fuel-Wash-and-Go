import { Request, Response } from 'express';
import admin from 'firebase-admin';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      username: userRecord.displayName,
    });
  } catch (error) {
    res.status(400).json({error});
  }
};

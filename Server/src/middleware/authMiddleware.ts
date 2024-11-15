import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';



export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.locals.uid = decodedToken.uid;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};


export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (res.locals.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  next();
};
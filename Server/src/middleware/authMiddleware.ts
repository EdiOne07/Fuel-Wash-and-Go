import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}



export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const sessionId = req.headers.sessionid as string;
  console.log(sessionId);

  if (!sessionId) {
    res.status(401).json({ error: 'Unauthorized: Missing session ID' });
    return;
  }

  try {
    const user = await User.findOne({ sessionId });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized: Invalid session ID' });
      return;
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
};

export const authorize = (roles: Array<'admin' | 'user'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};

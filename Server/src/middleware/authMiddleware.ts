// import { Request, Response, NextFunction } from 'express';
// import { UserRecord } from 'firebase-admin/auth';
// import admin from 'firebase-admin';

// export const authenticate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     res.status(401).json({ error: 'Unauthorized' });
//     return;
//   }

//   const idToken = authHeader.split('Bearer ')[1];
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const uid = decodedToken.uid;
//     const userRecord: UserRecord = await admin.auth().getUser(uid);

//     // Attach the user record to the request object for downstream use
//     (req as any).user = userRecord;

//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Unauthorized', details: (error as Error).message });
//   }
// };

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.user = user;
    next();
  });
};


// import { Request, Response, NextFunction } from 'express';
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
//     // Verify the ID token and decode its claims
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const uid = decodedToken.uid;

//     // Retrieve the full user record using the uid
//     const userRecord = await admin.auth().getUser(uid);

//     // Attach the user record to the request object for downstream use
//     (req as any).user = userRecord;

//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Unauthorized'});
//   }
// };
import { Request, Response, NextFunction } from 'express';
import { UserRecord } from 'firebase-admin/auth';
import admin from 'firebase-admin';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userRecord: UserRecord = await admin.auth().getUser(uid);

    // Attach the user record to the request object for downstream use
    (req as any).user = userRecord;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized', details: (error as Error).message });
  }
};




import { UserRecord } from 'firebase-admin/auth';
declare global {
  namespace Express {
    interface Request {
      user?: UserRecord; // Adjust the type based on your application's requirements
    }
  }
}

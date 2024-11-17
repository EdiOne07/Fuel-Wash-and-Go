// src/routes/testRoute.ts
import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/test-auth', authenticate, (req, res) => {
  res.status(200).json({ message: 'Firebase Authentication works!', uid: res.locals.firebaseUid });
});

export default router;

// src/routes/userRoutes.ts
import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/api/register', authenticate, userController.registerUser);
router.get('/api/profile', authenticate, userController.getUserProfile);
router.put('/api/profile', authenticate, userController.updateUserProfile);
router.delete('profile', authenticate, userController.deleteUserProfile);
// In your userRoutes.ts
router.get('/test-auth', (req, res) => {
    res.send('Auth route is working!');
  });
  

export default router;

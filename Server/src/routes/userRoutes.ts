import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/update-location', authenticate, userController.updateLocation);
router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, userController.updateUserProfile);
router.delete('/profile', authenticate, userController.deleteUserProfile);
router.post('/logout', authenticate, userController.logoutUser);
router.put('/promote/:userId', authenticate, authorize(['admin']), userController.promoteUserToAdmin);

export default router;

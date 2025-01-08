import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/update-location', authMiddleware.authenticate, userController.updateLocation);
router.get('/profile', authMiddleware.authenticate, userController.getUserProfile);
router.put('/profile', authMiddleware.authenticate, userController.updateUserProfile);
router.delete('/profile', authMiddleware.authenticate, userController.deleteUserProfile);
router.post('/logout', authMiddleware.authenticate, userController.logoutUser);
router.put('/promote/:userId', authMiddleware.authenticate, authMiddleware.authorizeAdmin(['admin']), userController.promoteUserToAdmin);

export default router;

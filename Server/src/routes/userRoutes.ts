import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile',authenticateToken , userController.getUserProfile); 
router.put('/profile', authenticateToken, userController.updateUserProfile); 
router.delete('/profile', authenticateToken, userController.deleteUserProfile); 
router.post('/logout', authenticateToken, userController.logoutUser); 


export default router;

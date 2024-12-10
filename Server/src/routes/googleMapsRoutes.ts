import { Router } from 'express';
import * as googleMapsController from '../controllers/googleMapsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/nearby-gas-stations', authenticate, googleMapsController.getNearbyGasStations);

export default router;

import { Router } from 'express';
import * as googleMapsController from '../controllers/googleMapsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/nearby-gas-stations', authenticate, googleMapsController.getNearbyStations);
router.get('/traffic-status',authenticate,googleMapsController.getTrafficStatusForLocation);
router.get('/nearby-washing-stations',authenticate,googleMapsController.getNearbyWashingStations);

export default router;

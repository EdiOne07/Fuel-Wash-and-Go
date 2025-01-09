import { Router } from 'express';
import * as googleMapsController from '../controllers/googleMapsController';
import * as authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/nearby-gas-stations', authMiddleware.authenticate, googleMapsController.getNearbyStations);
router.get('/traffic-status',authMiddleware.authenticate,googleMapsController.getTrafficStatusForLocation);
router.get('/nearby-washing-stations',authMiddleware.authenticate,googleMapsController.getNearbyWashingStations);
router.get('/gas-station/:id',authMiddleware.authenticate,googleMapsController.getStationDetails);

export default router;

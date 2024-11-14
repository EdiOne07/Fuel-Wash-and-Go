import { Router } from 'express';
import * as washingStationController from '../controllers/washingStationsController';
import { authenticate } from '../middleware/authMiddleware';


const router = Router();

router.get('/washing-stations', authenticate, washingStationController.getWashingStations);
router.get('/washing-stations/:id', authenticate, washingStationController.getWashingStationById);
router.post('/washing-stations', authenticate, washingStationController.createWashingStation);
router.put('/washing-stations/:id', authenticate, washingStationController.updateWashingStation);
router.delete('/washing-stations/:id', authenticate, washingStationController.deleteWashingStation);

export default router;

import { Router } from 'express';
import * as gasStationController from '../controllers/gasStationsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/stations', authenticate, gasStationController.getStations);
router.get('/stations/:id', authenticate, gasStationController.getStationById);
router.post('/stations', authenticate, gasStationController.createStation);
router.put('/stations/:id', authenticate, gasStationController.updateStation);
router.delete('/stations/:id', authenticate, gasStationController.deleteStation);

export default router;

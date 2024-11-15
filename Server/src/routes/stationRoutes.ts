// src/routes/stationRoutes.ts
import { Router } from 'express';
import * as stationController from '../controllers/stationController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/stations', stationController.getStations);
router.get('/stations/:id', stationController.getStationById);
router.post('/stations', authenticate, authorizeAdmin, stationController.addStation);
router.put('/stations/:id', authenticate, authorizeAdmin, stationController.updateStation);
router.delete('/stations/:id', authenticate, authorizeAdmin, stationController.deleteStation);

export default router;

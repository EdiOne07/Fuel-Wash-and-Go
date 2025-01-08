// src/routes/stationRoutes.ts
import { Router } from 'express';
import * as stationController from '../controllers/stationController';
import * as authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/stations', stationController.getStations);
router.get('/stations/:id', stationController.getStationById);
router.post('/stations', authMiddleware.authenticate, authMiddleware.authorizeAdmin(['admin']), stationController.addStation);
router.put('/stations/:id', authMiddleware.authenticate, authMiddleware.authorizeAdmin(['admin']), stationController.updateStation);
router.delete('/stations/:id', authMiddleware.authenticate, authMiddleware.authorizeAdmin(['admin']), stationController.deleteStation);

export default router;

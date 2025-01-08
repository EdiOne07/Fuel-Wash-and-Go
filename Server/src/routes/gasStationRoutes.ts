import { Router } from 'express';
import * as gasStationController from '../controllers/gasStationsController';
import * as authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/stations', authMiddleware.authenticate, gasStationController.getStations);
router.get('/stations/:id', authMiddleware.authenticate, gasStationController.getStationById);
router.post('/stations',authMiddleware.authenticate,authMiddleware.authorizeAdmin(['admin']), gasStationController.createStation);
router.put('/stations/:id',authMiddleware.authenticate,authMiddleware.authorizeAdmin(['admin']),gasStationController.updateStation);
router.delete('/stations/:id',authMiddleware.authenticate,authMiddleware.authorizeAdmin(['admin']),gasStationController.deleteStation);

export default router;

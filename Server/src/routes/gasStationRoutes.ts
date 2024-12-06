import { Router } from 'express';
import * as gasStationController from '../controllers/gasStationsController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/stations', authenticate, gasStationController.getStations);
router.get('/stations/:id', authenticate, gasStationController.getStationById);
router.post('/stations',authenticate,authorize(['admin']), gasStationController.createStation);
router.put('/stations/:id',authenticate,authorize(['admin']),gasStationController.updateStation);
router.delete('/stations/:id',authenticate,authorize(['admin']),gasStationController.deleteStation);

export default router;

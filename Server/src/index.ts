import express from 'express';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import gasStationRoutes from './routes/gasStationRoutes';
import googleMapsRoutes from './routes/googleMapsRoutes';
import washingStationRoutes from './routes/washingStationRoutes';
import { scheduleGasPriceUpdates } from './utils/cronJobs';
import { limiter } from './middleware/reqLimiterGoogleMiddleware';

const app = express();
connectDB();

app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/gas-stations',gasStationRoutes);
app.use("/api/washing-stations", washingStationRoutes);
app.use('/api/maps', googleMapsRoutes, limiter);
scheduleGasPriceUpdates();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
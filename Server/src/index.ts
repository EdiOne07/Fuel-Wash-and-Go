import express from 'express';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import gasStationRoutes from './routes/gasStationRoutes'

const app = express();
connectDB();

app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/gas-stations',gasStationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from 'express';
import userRoutes from './routes/userRoutes';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });


const app = express();

app.use(express.json());


app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
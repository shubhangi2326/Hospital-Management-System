import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js'; 
import userRoutes from './routes/userRoutes.js'; 
import appointmentRoutes from './routes/appointmentRoutes.js'; 

connectDB();

const app = express();

const frontendURL = process.env.FRONTEND_URL;
app.use(cors({
    origin: frontendURL,
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));
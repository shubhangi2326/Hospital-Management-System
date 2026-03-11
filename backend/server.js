import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js'; 
import userRoutes from './routes/userRoutes.js'; 
import appointmentRoutes from './routes/appointmentRoutes.js'; 

connectDB();

const app = express();

// --- FIXED CORS CONFIGURATION ---
const allowedOrigins = [
    process.env.FRONTEND_URL,          // Your production URL from .env
    'http://localhost:5173',           // Your local Vite development URL
    'http://127.0.0.1:5173'            // Alternative local URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// ---------------------------------

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
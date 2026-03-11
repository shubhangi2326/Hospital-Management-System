import express from 'express';
import { 
    bookAppointment, 
    getAppointments, 
    cancelAppointment,
    updateAppointment,
    deleteAppointment 
} from '../controllers/appointmentController.js'; 
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get appointments based on role (Admin sees all, others see theirs)
router.route('/')
    .get(protect, getAppointments);

// Patient books appointment
router.post('/book', protect, bookAppointment);

// Cancel (Soft Delete/Status change)
router.put('/cancel/:id', protect, cancelAppointment);

// Hard Update and Delete (For Admin and specific users)
router.route('/:id')
    .put(protect, updateAppointment)
    .delete(protect, deleteAppointment);

export default router;
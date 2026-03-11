import express from 'express';
import { 
    bookAppointment, 
    getAppointments, 
    cancelAppointment 
} from '../controllers/appointmentController.js'; 
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.route('/')
    .get(protect, getAppointments);

router.route('/book')
    .post(protect, bookAppointment);
router.route('/:id').put(protect, updateAppointment);
router.route('/cancel/:id')
    .put(protect, cancelAppointment);
router.route('/:id').put(protect, updateAppointment).delete(protect, deleteAppointment);
export default router;
import express from 'express';
import { 
    registerUser, 
    authUser, 
    getDoctors, 
    getPatients,
    adminCreateUser,
    updateUser,
    deleteUser 
} from '../controllers/userController.js'; 
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/doctors', getDoctors);
router.get('/patients', getPatients);

// Admin Only Routes - For managing Doctors and Patients
router.route('/')
    .post(protect, admin, adminCreateUser);

router.route('/:id')
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;
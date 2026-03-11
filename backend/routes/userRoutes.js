import express from 'express';
import { 
    registerUser, 
    authUser, 
    getDoctors, 
    getPatients 
} from '../controllers/userController.js'; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/:id').put(protect, updateUser).delete(protect, deleteUser);
router.route('/')
    .post(protect, admin, adminCreateUser); // Add New Doctor/Patient

router.route('/:id')
    .put(protect, admin, updateUser)        // Update Doctor/Patient
    .delete(protect, admin, deleteUser);  
router.route('/:id')
    .put(protect, updateUser)   
    .delete(protect, deleteUser); 
router.get('/doctors', getDoctors);
router.get('/patients', getPatients);

export default router;
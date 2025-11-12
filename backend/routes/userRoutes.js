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
router.get('/doctors', getDoctors);
router.get('/patients', getPatients);

export default router;
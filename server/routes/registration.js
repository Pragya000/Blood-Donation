import {Router} from 'express';
import { create, listHospitalRegistrations, listUserRegistrations, update } from '../controllers/register.js';

const router = Router();

router.post('/create/:postId', create)
router.get('/list-users', listUserRegistrations)
router.get('/list-hospitals', listHospitalRegistrations)
router.post('/update/:registrationId', update)

export default router;
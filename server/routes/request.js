import {Router} from 'express';
import { createRequest, listRequests, updateRequestStatus } from '../controllers/request.js';

const router = Router();

router.post('/create', createRequest)
router.get('/list', listRequests)
router.post('/update/:id', updateRequestStatus)

export default router;
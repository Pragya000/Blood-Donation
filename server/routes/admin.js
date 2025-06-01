import { Router } from "express";
import { changeHospitalStatus, getHospitalsList, populateUser, getAdminStats } from "../controllers/admin.js";

const router = Router();

router.get('/get-hospitals-list', getHospitalsList)
router.post('/populate-user', populateUser)
router.post('/change-hospital-status/:id', changeHospitalStatus)
router.get('/get-stats', getAdminStats)

export default router;
import { Router } from "express";
import { createHospitalDetails, getHospitalReviews } from "../controllers/hospital.js";

const router = Router();

router.post('/create-hospital-details', createHospitalDetails)
router.get('/get-hospital-reviews', getHospitalReviews)

export default router;
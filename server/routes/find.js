import { Router } from "express";
import { findDonors, findHospitalDetails, findHospitals } from "../controllers/find.js";

const router = Router();

router.get('/donors', findDonors)
router.get('/hospitals', findHospitals)
router.get('/hospitals/:hospitalId', findHospitalDetails)

export default router;
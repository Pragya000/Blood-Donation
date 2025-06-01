import { Router } from "express";
import { createUserDetails, getUserDetails, listCertificates } from "../controllers/user.js";

const router = Router();

router.get('/user-details', getUserDetails)
router.post('/create-user-details', createUserDetails)
router.get('/list-certificates', listCertificates)

export default router;
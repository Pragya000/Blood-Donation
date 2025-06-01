import { Router } from "express";
import limiter from "../utils/apiRateLimiter.js";
import { login,  signUp, logout, verifyCertificate } from "../controllers/auth.js";

const router = Router();

// router.post("/send-otp", limiter, sendOtp);
router.post("/signup", signUp);
router.post("/login", login)
router.post("/logout", logout);
router.get('/verify/:cert_id', verifyCertificate)

export default router;
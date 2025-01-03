import { Router } from "express";
import { generateOTP, loginUser, register, verifyOTP } from "../../controllers/user/auth";

const router = Router();

router.post('/register', register);
router.post('/generateOtp', generateOTP);
router.post('/verifyOtp', verifyOTP);
router.post('/userLogin',loginUser)
router.post('/forgotPassword',forgotPassword)

export default router;

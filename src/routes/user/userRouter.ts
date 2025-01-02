import { Router } from "express";
import { generateOTP, register, verifyOTP } from "../../controllers/user/auth";

const router = Router();

router.post('/register', register);
router.post('/generateOtp', generateOTP);
// console.log("Type of verifyOtp : ",typeof verifyOTP)
router.post('/verifyOtp', verifyOTP);

export default router;

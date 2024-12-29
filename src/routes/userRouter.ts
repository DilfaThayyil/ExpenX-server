import express from 'express';
import { registerUser, sendOtp, verifyOTP } from '../controllers/user/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/sendOTP',sendOtp)
router.post('/verifyOTP',verifyOTP)

export default router;
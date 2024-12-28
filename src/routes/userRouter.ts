import express from 'express';
import { registerUser, sendOtp } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/sendOTP',sendOtp)
// router.post('/verifyOTP',verifyOtp)

export default router;
import { Router } from 'express';
import { container } from 'tsyringe';
import 'reflect-metadata';
import { IAdvisorController } from '../../controllers/Interface/IAdvisorController';


const advisorController = container.resolve<IAdvisorController>('IAdvisorController');
const router = Router();

router.post('/register', (req, res) => advisorController.register(req, res));
router.post('/generateOtp', (req, res) => advisorController.generateOTP(req, res));
router.post('/verifyOtp', (req, res) => advisorController.verifyOTP(req, res));
router.post('/userLogin', (req, res) => advisorController.loginUser(req, res));
router.post('/resendOtp',(req,res)=>advisorController.resendOTP(req,res))
router.post('/forgetPassword', (req, res) => advisorController.forgotPassword(req, res));
router.post('/forgetPassOtp', (req, res) => advisorController.verifyForgotPasswordOtp(req, res));
router.post('/resetPassword', (req, res) => advisorController.resetPassword(req, res));
router.post('/googleAuth', (req, res) => advisorController.googleAuth(req, res));

export default router;

import { Router } from 'express';
import { container } from 'tsyringe';
import 'reflect-metadata';
import { IAuthAdvisorController } from '../../controllers/Interface/advisor/IAuthAdvisorController';


const authAdvisorController = container.resolve<IAuthAdvisorController>('IAuthAdvisorController');
const router = Router();

router.post('/register', (req, res) => authAdvisorController.register(req, res));
router.post('/generateOtp', (req, res) => authAdvisorController.generateOTP(req, res));
router.post('/verifyOtp', (req, res) => authAdvisorController.verifyOTP(req, res));
router.post('/userLogin', (req, res) => authAdvisorController.loginUser(req, res));
router.post('/resendOtp',(req,res)=>authAdvisorController.resendOTP(req,res))
router.post('/forgetPassword', (req, res) => authAdvisorController.forgotPassword(req, res));
router.post('/forgetPassOtp', (req, res) => authAdvisorController.verifyForgotPasswordOtp(req, res));
router.post('/resetPassword', (req, res) => authAdvisorController.resetPassword(req, res));
router.post('/googleAuth', (req, res) => authAdvisorController.googleAuth(req, res));

export default router;

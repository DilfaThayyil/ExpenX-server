import { Router } from 'express';
import { container } from 'tsyringe';
import { IAuthUserController } from '../../controllers/Interface/user/IAuthUserController';
import 'reflect-metadata';


const authuserController = container.resolve<IAuthUserController>('IAuthUserController')
const router = Router()

router.post('/register', (req, res) => authuserController.register(req, res))
router.post('/generateOtp', (req, res) => authuserController.generateOTP(req, res))
router.post('/verifyOtp', (req, res) => authuserController.verifyOTP(req, res))
router.post('/userLogin', (req, res) => authuserController.loginUser(req, res))
router.post('/refresh-token',(req,res)=>authuserController.setNewAccessToken(req,res))
router.post('/resendOtp',(req,res)=>authuserController.resendOTP(req,res))
router.post('/forgetPassword', (req, res) => authuserController.forgotPassword(req, res));
router.post('/forgetPassOtp', (req, res) => authuserController.verifyForgotPasswordOtp(req, res));
router.post('/resetPassword', (req, res) => authuserController.resetPassword(req, res));
router.post('/googleAuth', (req, res) => authuserController.googleAuth(req, res));

export default router
import { Router } from 'express';
import { container } from 'tsyringe';
import { IAuthUserController } from '../../controllers/Interface/user/IAuthUserController';
import 'reflect-metadata';


const authUserController = container.resolve<IAuthUserController>('IAuthUserController')
const router = Router()

router.post('/register', (req, res) => authUserController.register(req, res))
router.post('/generateOtp', (req, res) => authUserController.generateOTP(req, res))
router.post('/verifyOtp', (req, res) => authUserController.verifyOTP(req, res))
router.post('/userLogin', (req, res) => authUserController.loginUser(req, res))
router.post('/refresh-token',(req,res)=>authUserController.setNewAccessToken(req,res))
router.post('/resendOtp',(req,res)=>authUserController.resendOTP(req,res))
router.post('/forgetPassword', (req, res) => authUserController.forgotPassword(req, res));
router.post('/forgetPassOtp', (req, res) => authUserController.verifyForgotPasswordOtp(req, res));
router.post('/resetPassword', (req, res) => authUserController.resetPassword(req, res));
router.post('/googleAuth', (req, res) => authUserController.googleAuth(req, res));
router.post('/logout',(req,res)=> authUserController.logout(req,res))

export default router
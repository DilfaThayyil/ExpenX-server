import { Router } from 'express';
import { container } from 'tsyringe';
import { IUserController } from '../../controllers/Interface/IUserController';
import 'reflect-metadata';


const userController = container.resolve<IUserController>('IUserController');
const router = Router();

router.post('/register', (req, res) => userController.register(req, res));
router.post('/generateOtp', (req, res) => userController.generateOTP(req, res));
router.post('/verifyOtp', (req, res) => userController.verifyOTP(req, res));
router.post('/userLogin', (req, res) => userController.loginUser(req, res));
router.post('/forgetPassword', (req, res) => userController.forgotPassword(req, res));
router.post('/forgetPassOtp', (req, res) => userController.verifyForgotPasswordOtp(req, res));
router.post('/resetPassword', (req, res) => userController.resetPassword(req, res));
router.post('/googleAuth', (req, res) => userController.googleAuth(req, res));

export default router;

import { Router } from 'express';
import {uploadProfile} from '../../middleware/multer';
import { container } from 'tsyringe';
import { IAdvisorController } from '../../controllers/Interface/advisor/IAdvisorController';
import { AuthMiddleware } from '../../middleware/authMiddleware';

const advisorController = container.resolve<IAdvisorController>('IAdvisorController');
const router = Router()


router.post('/upload',AuthMiddleware.authorizeUser, uploadProfile.single('profilePic'), (req, res) =>{advisorController.uploadProfileImage(req, res)})
router.patch('/editProfile',AuthMiddleware.authorizeUser, (req, res) =>advisorController.updateUser(req, res))
router.post('/createSlot',AuthMiddleware.authorizeUser,(req,res)=>advisorController.createSlot(req,res))
router.get('/fetchSlots/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.fetchSlots(req,res))
router.patch('/updateSlot/:slotId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.updateSlot(req,res))
router.delete('/deleteSlot/:slotId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.deleteSlot(req,res))
router.get('/fetchSlotsAdvisor/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.getBookedSlotsForAdvisor(req,res))
router.get('/getReviews/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.fetchReviews(req,res))
router.post('/addReply/:reviewId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.addReplyToReview(req,res))
router.get('/fetchDashboard/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.fetchDashboard(req,res))
router.get('/fetchRevenue/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.fetchRevenue(req,res))
router.get('/fetchClientGoals/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.fetchClientGoals(req,res))
router.get('/getUpcomingAppointments/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.getUpcomingAppointments(req,res))
router.get('/getRecentClients/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.getRecentClients(req,res))
router.get('/getAdvisors',AuthMiddleware.authorizeUser,(req,res)=>advisorController.getAdvisors(req,res))


export default router
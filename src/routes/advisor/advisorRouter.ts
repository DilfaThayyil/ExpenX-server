import { Router } from 'express';
import {uploadProfile} from '../../middleware/multer';
import { container } from 'tsyringe';
import { IAdvisorController } from '../../controllers/Interface/advisor/IAdvisorController';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { ISlotController } from '../../controllers/Interface/slot/ISlotController';
import { IReviewController } from '../../controllers/Interface/review/IReviewController';
import { IExpenseController } from '../../controllers/Interface/user/IExpenseController';

const advisorController = container.resolve<IAdvisorController>('IAdvisorController');
const slotController = container.resolve<ISlotController>('ISlotController')
const reviewController = container.resolve<IReviewController>('IReviewController')
const expenseController = container.resolve<IExpenseController>('IExpenseController')
const router = Router()


router.post('/upload',AuthMiddleware.authorizeUser, uploadProfile.single('profilePic'), (req, res) =>{advisorController.uploadProfileImage(req, res)})
router.patch('/editProfile',AuthMiddleware.authorizeUser, (req, res) =>advisorController.updateUser(req, res))
router.post('/createSlot',AuthMiddleware.authorizeUser,(req,res)=>slotController.createSlot(req,res))
router.get('/fetchSlots/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>slotController.fetchSlots(req,res))
router.patch('/updateSlot/:slotId',AuthMiddleware.authorizeUser,(req,res)=>slotController.updateSlot(req,res))
router.delete('/deleteSlot/:slotId',AuthMiddleware.authorizeUser,(req,res)=>slotController.deleteSlot(req,res))
router.get('/fetchSlotsAdvisor/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>slotController.getBookedSlotsForAdvisor(req,res))
router.get('/getReviews/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>reviewController.fetchReviews(req,res))
router.post('/addReply/:reviewId',AuthMiddleware.authorizeUser,(req,res)=>reviewController.addReplyToReview(req,res))
router.get('/fetchDashboard/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.fetchDashboard(req,res))
router.get('/fetchRevenue/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.fetchRevenue(req,res))
router.get('/fetchClientGoals/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.fetchClientGoals(req,res))
router.get('/getUpcomingAppointments/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.getUpcomingAppointments(req,res))
router.get('/getRecentClients/:advisorId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.getRecentClients(req,res))
router.get('/getAdvisors',AuthMiddleware.authorizeUser,(req,res)=>advisorController.getAdvisors(req,res))
router.get('/getClientMeetings/:clientId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.getClientMeetings(req,res))
router.get('/getClient/:clientId',AuthMiddleware.authorizeUser,(req,res)=>advisorController.getClient(req,res))
router.get('/getExpenseByCategory',AuthMiddleware.authorizeUser,(req,res)=>expenseController.getExpenseByCategory(req,res))

export default router
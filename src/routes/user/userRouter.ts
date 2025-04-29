import { Router } from 'express';
import {uploadProfile,uploadChatFile} from '../../middleware/multer';
import { container } from 'tsyringe';
import { IUserController } from '../../controllers/Interface/user/IUserController';
import { IChatController } from '../../controllers/Interface/chat/IChatController';
import { IPaymentController } from '../../controllers/Interface/user/IPaymentController';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { IExpenseController } from '../../controllers/Interface/user/IExpenseController';
import { ICategoryController } from '../../controllers/Interface/category/ICategoryController';
import { ISlotController } from '../../controllers/Interface/slot/ISlotController';
import { IGoalController } from '../../controllers/Interface/goal/IGoalController';
import { IComplaintController } from '../../controllers/Interface/complaint/IComplaintController';
import { IReviewController } from '../../controllers/Interface/review/IReviewController';

const userController = container.resolve<IUserController>('IUserController');
const chatController = container.resolve<IChatController>('IChatController')
const paymentController = container.resolve<IPaymentController>('IPaymentController')
const expenseController = container.resolve<IExpenseController>('IExpenseController')
const categoryController = container.resolve<ICategoryController>('ICategoryController')
const slotController = container.resolve<ISlotController>('ISlotController')
const goalController = container.resolve<IGoalController>('IGoalController')
const complaintController = container.resolve<IComplaintController>('IComplaintController')
const reviewController = container.resolve<IReviewController>('IReviewController')
const router = Router()

router.post('/upload',AuthMiddleware.authorizeUser,uploadProfile.single('profilePic'), (req, res) =>{userController.uploadProfileImage(req, res)})
router.patch('/editProfile',AuthMiddleware.authorizeUser, (req, res) =>userController.updateUser(req, res))
router.get('/getExpenses/:userId', AuthMiddleware.authorizeUser,(req,res)=>expenseController.getExpenses(req,res))
router.post('/createExpense/:userId',AuthMiddleware.authorizeUser,(req,res)=>expenseController.createExpense(req,res))
router.get('/getCategories',AuthMiddleware.authorizeUser,(req,res)=>categoryController.getCategories(req,res))
router.patch('/bookslot',AuthMiddleware.authorizeUser,(req,res)=>slotController.bookslot(req,res))
router.post('/sendMessage',AuthMiddleware.authorizeUser,(req,res)=>chatController.sendMessage(req,res))
router.get('/fetchMessages/:senderId/:receiverId',AuthMiddleware.authorizeUser,(req,res)=>chatController.fetchMessages(req,res))
router.get('/fetchUsers/:id',AuthMiddleware.authorizeUser,(req,res)=>chatController.fetchUsers(req,res))
router.get('/fetchAdvisors/:id',AuthMiddleware.authorizeUser,(req,res)=>chatController.fetchAdvisors(req,res))
router.get('/fetchChats/:id',AuthMiddleware.authorizeUser,(req,res)=>chatController.fetchChats(req,res))
router.get('/fetchAllChats',AuthMiddleware.authorizeUser,(req,res)=>chatController.fetchAllChats(req,res))
router.post('/createChat',AuthMiddleware.authorizeUser,(req,res)=>chatController.createChat(req,res))
router.post('/uploadChatFile',AuthMiddleware.authorizeUser,uploadChatFile.single('file'),(req,res)=>{chatController.uploadChatFile(req,res)})
router.post('/paymentInitiate',AuthMiddleware.authorizeUser,(req,res)=>paymentController.initiatePayment(req,res))
router.post('/confirmPayment',AuthMiddleware.authorizeUser,(req,res)=>paymentController.confirmPayment(req,res))
router.post('/reportAdvisor/:slotId',AuthMiddleware.authorizeUser,(req,res)=>complaintController.reportAdvisor(req,res))
router.get('/fetchSlotsByUser/:userId',AuthMiddleware.authorizeUser,(req,res)=>slotController.fetchSlotsByUser(req,res))
router.post('/createReview',AuthMiddleware.authorizeUser,(req,res)=>reviewController.createReview(req,res))
router.post('/createGoals/:userId',AuthMiddleware.authorizeUser,(req,res)=>goalController.createGoal(req,res))
router.get('/getGoals/:userId',AuthMiddleware.authorizeUser,(req,res)=>goalController.getGoalsById(req,res))
router.patch('/updateGoal/:id',AuthMiddleware.authorizeUser,(req,res)=>goalController.updateGoal(req,res))
router.delete('/deleteGoal/:id',AuthMiddleware.authorizeUser,(req,res)=>goalController.deleteGoal(req,res))
router.patch('/updateGoalProgress/:id',AuthMiddleware.authorizeUser,(req,res)=>goalController.updateGoalProgress(req,res))
router.get('/getDashboardData/:userId',AuthMiddleware.authorizeUser,(req,res)=>userController.getDashboardData(req,res))
router.get('/exportExpense',AuthMiddleware.authorizeUser,(req,res)=>expenseController.exportExpense(req,res))
router.get('/getNotification/:userId',AuthMiddleware.authorizeUser,(req, res) => chatController.getNotifications(req, res));
router.patch('/markRead/:notificationId',AuthMiddleware.authorizeUser,(req, res) => chatController.markAsRead(req, res));
router.patch('/markAllRead/:userId',AuthMiddleware.authorizeUser,(req, res) => chatController.markAllAsRead(req, res));
router.delete('/deleteNotification/:notificationId',AuthMiddleware.authorizeUser,(req, res) => chatController.deleteNotification(req, res));

export default router
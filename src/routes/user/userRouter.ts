import { Router } from 'express';
import {uploadProfile,uploadChatFile} from '../../middleware/multer';
import { container } from 'tsyringe';
import { IUserController } from '../../controllers/Interface/user/IUserController';
import { IChatController } from '../../controllers/Interface/chat/IChatController';
import { IPaymentController } from '../../controllers/Interface/user/IPaymentController';
import { AuthMiddleware } from '../../middleware/authMiddleware';

const userController = container.resolve<IUserController>('IUserController');
const chatController = container.resolve<IChatController>('IChatController')
const paymentController = container.resolve<IPaymentController>('IPaymentController')
const router = Router()


router.post('/upload',AuthMiddleware.authorizeUser,uploadProfile.single('profilePic'), (req, res) =>{userController.uploadProfileImage(req, res)})
router.patch('/editProfile',AuthMiddleware.authorizeUser, (req, res) =>userController.updateUser(req, res))
router.get('/getExpenses/:userId', AuthMiddleware.authorizeUser,(req,res)=>userController.getExpenses(req,res))
router.post('/createExpense/:userId',AuthMiddleware.authorizeUser,(req,res)=>userController.createExpense(req,res))
router.post('/createGroup',AuthMiddleware.authorizeUser,(req,res)=>userController.createGroup(req,res))
router.get('/getUserGroups/:userId',AuthMiddleware.authorizeUser,(req,res)=>userController.getUserGroups(req,res))
router.post('/addMember/:groupId',AuthMiddleware.authorizeUser,(req,res)=>userController.addMember(req,res))
router.post('/addExpenseInGroup/:groupId',AuthMiddleware.authorizeUser,(req,res)=>userController.addExpenseInGroup(req,res))
router.patch('/bookslot',AuthMiddleware.authorizeUser,(req,res)=>userController.bookslot(req,res))
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
router.post("/reportAdvisor",AuthMiddleware.authorizeUser,(req,res)=>userController.reportAdvisor(req,res))
router.get("/fetchSlotsByUser/:userId",AuthMiddleware.authorizeUser,(req,res)=>userController.fetchSlotsByUser(req,res))
router.get("/getAdvisors",(req,res)=>userController.getAdvisors(req,res))
router.post("/createReview",(req,res)=>userController.createReview(req,res))

export default router
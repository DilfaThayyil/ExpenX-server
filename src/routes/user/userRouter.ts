import { Router } from 'express';
import {uploadProfile,uploadChatFile} from '../../middleware/multer';
import { container } from 'tsyringe';
import { IUserController } from '../../controllers/Interface/user/IUserController';
import { IChatController } from '../../controllers/Interface/chat/IChatController';
import { IPaymentController } from '../../controllers/Interface/user/IPaymentController';

const userController = container.resolve<IUserController>('IUserController');
const chatController = container.resolve<IChatController>('IChatController')
const paymentController = container.resolve<IPaymentController>('IPaymentController')
const router = Router()


router.post('/upload', uploadProfile.single('profilePic'), (req, res) =>{userController.uploadProfileImage(req, res)})
router.patch('/editProfile', (req, res) =>userController.updateUser(req, res))
router.get('/getExpenses/:userId', (req,res)=>userController.getExpenses(req,res))
router.post('/createExpense/:userId',(req,res)=>userController.createExpense(req,res))
router.post('/createGroup',(req,res)=>userController.createGroup(req,res))
router.get('/getUserGroups/:userId',(req,res)=>userController.getUserGroups(req,res))
router.post('/addMember/:groupId',(req,res)=>userController.addMember(req,res))
router.post('/addExpenseInGroup/:groupId',(req,res)=>userController.addExpenseInGroup(req,res))
router.patch('/bookslot',(req,res)=>userController.bookslot(req,res))
router.post('/sendMessage',(req,res)=>chatController.sendMessage(req,res))
router.get('/fetchMessages/:senderId/:receiverId',(req,res)=>chatController.fetchMessages(req,res))
router.get('/fetchUsers/:id',(req,res)=>chatController.fetchUsers(req,res))
router.get('/fetchAdvisors/:id',(req,res)=>chatController.fetchAdvisors(req,res))
router.get('/fetchChats/:id',(req,res)=>chatController.fetchChats(req,res))
router.get('/fetchAllChats',(req,res)=>chatController.fetchAllChats(req,res))
router.post('/createChat',(req,res)=>chatController.createChat(req,res))
router.post('/uploadChatFile',uploadChatFile.single('file'),(req,res)=>{chatController.uploadChatFile(req,res)})
router.post('/paymentInitiate',(req,res)=>paymentController.initiatePayment(req,res))
router.post('/confirmPayment',(req,res)=>paymentController.confirmPayment(req,res))

export default router
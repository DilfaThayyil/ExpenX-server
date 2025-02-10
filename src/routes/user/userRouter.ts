import { Router } from 'express';
import upload from '../../middleware/multer';
import { container } from 'tsyringe';
import { IUserController } from '../../controllers/Interface/user/IUserController';
import { IChatController } from '../../controllers/Interface/chat/IChatController';

const userController = container.resolve<IUserController>('IUserController');
const chatController = container.resolve<IChatController>('IChatController')
const router = Router()


router.post('/upload', upload.single('profilePic'), (req, res) =>{userController.uploadProfileImage(req, res)})
router.patch('/editProfile', (req, res) =>userController.updateUser(req, res))
router.get('/getExpenses/:userId', (req,res)=>userController.getExpenses(req,res))
router.post('/createExpense/:userId',(req,res)=>userController.createExpense(req,res))
router.post('/createGroup',(req,res)=>userController.createGroup(req,res))
router.get('/getUserGroups/:email',(req,res)=>userController.getUserGroups(req,res))
router.post('/addMember/:groupId',(req,res)=>userController.addMember(req,res))
router.post('/addExpenseInGroup/:groupId',(req,res)=>userController.addExpenseInGroup(req,res))
router.patch('/bookslot',(req,res)=>userController.bookslot(req,res))
// router.get('/findMyFriends/:id',(req,res)=>chatController.findMyFriends(req,res))
router.get('/getMessage/:conversationId',(req,res)=>chatController.getMessage(req,res))
router.post('/postImage',upload.single('chatImage'),(req,res)=>chatController.postImage(req,res))


export default router
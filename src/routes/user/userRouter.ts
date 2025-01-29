import { Router } from 'express';
import upload from '../../middleware/multer';
import { container } from 'tsyringe';
import { IUserController } from '../../controllers/Interface/user/IUserController';

const userController = container.resolve<IUserController>('IUserController');
const router = Router()


router.post('/upload', upload.single('profilePic'), (req, res) =>{userController.uploadProfileImage(req, res)})
router.patch('/editProfile', (req, res) =>userController.updateUser(req, res))
router.get('/getExpenses/:userId', (req,res)=>userController.getExpenses(req,res))
router.post('/createExpense/:userId',(req,res)=>userController.createExpense(req,res))
router.post('/createGroup',(req,res)=>userController.createGroup(req,res))
router.get('/getUserGroups/:email',(req,res)=>userController.getUserGroups(req,res))
router.post('/addMember/:groupId',(req,res)=>userController.addMember(req,res))


export default router
import { Router } from 'express';
import upload from '../../middleware/multer';
import { container } from 'tsyringe';
import { IAdvisorController } from '../../controllers/Interface/advisor/IAdvisorController';
import { validateSlot } from '../../middleware/slotValidate';

const advisorController = container.resolve<IAdvisorController>('IAdvisorController');
const router = Router()


router.post('/upload', upload.single('profilePic'), (req, res) =>{advisorController.uploadProfileImage(req, res)})
router.patch('/editProfile', (req, res) =>advisorController.updateUser(req, res))
router.post('/createSlot',validateSlot,(req,res)=>advisorController.createSlot(req,res))
router.get('/fetchSlots',(req,res)=>advisorController.fetchSlots(req,res))
router.patch('/updateSlot/:slotId',(req,res)=>advisorController.updateSlot(req,res))


export default router
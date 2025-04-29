import { Router } from "express";
import { container } from 'tsyringe';
import { IGroupController } from '../../controllers/Interface/group/IGroupController';
import { AuthMiddleware } from '../../middleware/authMiddleware';

const groupController = container.resolve<IGroupController>('IGroupController')
const router = Router()

router.post('/createGroup',AuthMiddleware.authorizeUser,(req,res)=>groupController.createGroup(req,res))
router.get('/getUserGroups/:userId',AuthMiddleware.authorizeUser,(req,res)=>groupController.getUserGroups(req,res))
router.post('/addMember/:groupId',AuthMiddleware.authorizeUser,(req,res)=>groupController.addMember(req,res))
router.post('/addExpenseInGroup/:groupId',AuthMiddleware.authorizeUser,(req,res)=>groupController.addExpenseInGroup(req,res))
// router.post('/removeMember/:groupId',AuthMiddleware.authorizeUser,(req,res)=>groupController.removeMember(req,res))
// router.post('/leaveGroup/:groupId',AuthMiddleware.authorizeUser,(req,res)=>groupController.leaveGroup(req,res))
// router.post('/settleDebt/:groupId',AuthMiddleware.authorizeUser,(req,res)=>groupController.settleDebt(req,res))
// router.get('/group-invite/:groupId',AuthMiddleware.authorizeUser,(req,res)=>groupController.groupInvite(req,res))

export default router
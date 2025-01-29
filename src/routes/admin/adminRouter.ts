import { Router } from "express";
import { container } from "tsyringe";
import { IAdminController } from "../../controllers/Interface/admin/IAdminController";

const adminController = container.resolve<IAdminController>('IAdminController')
const router = Router()

router.post("/login", (req,res)=>adminController.adminLogin(req,res))
router.get("/users", (req,res)=>adminController.fetchUsers(req,res))
router.get("/advisors", (req,res)=>adminController.fetchAdvisors(req,res))
router.post("/updateAdmin", (req,res)=>adminController.updateAdmin(req,res))
router.patch("/updateUserBlockStatus", (req,res)=>adminController.updateUserBlockStatus(req,res))
router.patch("/updateAdvisorBlockStatus", (req,res)=>adminController.updateAdvisorBlockStatus(req,res))


export default router;

import { Router } from "express";
import { container } from "tsyringe";
import { IAdminController } from "../../controllers/Interface/admin/IAdminController";
import { AdminAuthMiddleware } from "../../middleware/adminAuthMiddleware";

const adminController = container.resolve<IAdminController>('IAdminController')
const router = Router()

router.post("/login",(req,res)=>adminController.adminLogin(req,res))
router.get("/users",AdminAuthMiddleware.authorizeAdmin, (req,res)=>adminController.fetchUsers(req,res))
router.get("/advisors",AdminAuthMiddleware.authorizeAdmin, (req,res)=>adminController.fetchAdvisors(req,res))
router.post("/updateAdmin",AdminAuthMiddleware.authorizeAdmin, (req,res)=>adminController.updateAdmin(req,res))
router.patch("/updateUserBlockStatus",AdminAuthMiddleware.authorizeAdmin, (req,res)=>adminController.updateUserBlockStatus(req,res))
router.patch("/updateAdvisorBlockStatus",AdminAuthMiddleware.authorizeAdmin, (req,res)=>adminController.updateAdvisorBlockStatus(req,res))
router.get("/categories",AdminAuthMiddleware.authorizeAdmin,(req,res)=>adminController.fetchCategories(req,res))
router.post("/addCategory",AdminAuthMiddleware.authorizeAdmin, (req,res)=>adminController.addCategory(req,res))
router.patch("/updateCategory/:id",AdminAuthMiddleware.authorizeAdmin, (req,res)=>adminController.updateCategory(req,res))
router.delete("/deleteCategory/:id",AdminAuthMiddleware.authorizeAdmin, (req,res)=>adminController.deleteCategory(req,res))
router.post("/logout",(req,res)=>adminController.adminLogout(req,res))

export default router;

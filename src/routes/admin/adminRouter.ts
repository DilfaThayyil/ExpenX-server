import { Router } from "express";
import { container } from "tsyringe";
import { IAdminController } from "../../controllers/Interface/admin/IAdminController";
import { AdminAuthMiddleware } from "../../middleware/adminAuthMiddleware";
import { IUserController } from "../../controllers/Interface/user/IUserController";
import { IAdvisorController } from "../../controllers/Interface/advisor/IAdvisorController";
import { ICategoryController } from "../../controllers/Interface/category/ICategoryController";
import { IComplaintController } from "../../controllers/Interface/complaint/IComplaintController";

const adminController = container.resolve<IAdminController>('IAdminController')
const userController = container.resolve<IUserController>('IUserController')
const advisorController = container.resolve<IAdvisorController>('IAdvisorController')
const categoryController = container.resolve<ICategoryController>('ICategoryController')
const complaintController = container.resolve<IComplaintController>('IComplaintController')
const router = Router()

router.post("/login",(req,res)=>adminController.adminLogin(req,res))
router.get("/users",AdminAuthMiddleware.authorizeAdmin, (req,res)=>userController.fetchUsers(req,res))
router.get("/advisors",AdminAuthMiddleware.authorizeAdmin, (req,res)=>advisorController.fetchAdvisors(req,res))
router.post("/updateAdmin",AdminAuthMiddleware.authorizeAdmin, (req,res)=>adminController.updateAdmin(req,res))
router.patch("/updateUserBlockStatus",AdminAuthMiddleware.authorizeAdmin, (req,res)=>userController.updateUserBlockStatus(req,res))
router.patch("/updateAdvisorBlockStatus",AdminAuthMiddleware.authorizeAdmin, (req,res)=>advisorController.updateAdvisorBlockStatus(req,res))
router.get("/categories",AdminAuthMiddleware.authorizeAdmin,(req,res)=>categoryController.fetchCategories(req,res))
router.post("/addCategory",AdminAuthMiddleware.authorizeAdmin, (req,res)=>categoryController.addCategory(req,res))
router.patch("/updateCategory/:id",AdminAuthMiddleware.authorizeAdmin, (req,res)=>categoryController.updateCategory(req,res))
router.delete("/deleteCategory/:id",AdminAuthMiddleware.authorizeAdmin, (req,res)=>categoryController.deleteCategory(req,res))
router.post("/logout",(req,res)=>adminController.adminLogout(req,res))
router.get("/reports",AdminAuthMiddleware.authorizeAdmin, (req,res)=>complaintController.fetchReports(req,res))
router.get("/getMonthlyTrends",AdminAuthMiddleware.authorizeAdmin,(req,res)=>adminController.getMonthlyTrends(req,res))
router.get("/getExpenseCategories",AdminAuthMiddleware.authorizeAdmin,(req,res)=>adminController.getExpenseCategories(req,res))
router.get("/getDashboardStats",AdminAuthMiddleware.authorizeAdmin,(req,res)=>adminController.getDashboardStats(req,res))
router.get("/getUserGrowth",AdminAuthMiddleware.authorizeAdmin,(req,res)=>adminController.getUserGrowth(req,res))

export default router;

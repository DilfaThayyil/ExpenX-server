import { Router } from 'express'
import authUserRoutes from './user/authUserRouter'
import userRoutes from './user/userRouter'
import groupRoutes from './user/groupRouter'
import authAdvisorRoutes from './advisor/authAdvisorRouter'
import advisorRoutes from './advisor/advisorRouter'
import adminRoutes from './admin/adminRouter'

const router = Router()

router.use("/user/auth", authUserRoutes);
router.use("/user",userRoutes)
router.use("/user/group",groupRoutes)
router.use("/advisor/auth",authAdvisorRoutes)
router.use("/advisor",advisorRoutes)
router.use("/admin",adminRoutes)

export default router
import { Router } from "express";
import { adminLogin } from "../../controllers/Implementation/admin/adminController";

const router = Router();

router.post("/login", adminLogin);
// router.post("/refreshToken",adminRefreshToken)

export default router;

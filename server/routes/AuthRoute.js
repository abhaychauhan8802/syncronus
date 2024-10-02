import { Router } from "express";
import { login, signup, getUserInfo, updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user-info", verifyToken, getUserInfo)
router.put("/update-profile", verifyToken, updateProfile)

export default router;

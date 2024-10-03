import { Router } from "express";
import {
  login,
  signup,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import multer from "multer";

const router = Router();

const upload = multer({
  dest: "uploads/profiles/",
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/user-info", verifyToken, getUserInfo);
router.put("/update-profile", verifyToken, updateProfile);
router.put(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage
);
router.delete("/remove-profile-image", verifyToken, removeProfileImage);

export default router;

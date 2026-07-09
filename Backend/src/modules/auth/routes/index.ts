import { Router } from "express";
import { register, login } from "../controllers/index.js";
import { updateProfile, getProfile } from "../controllers/profile.js";
import { authenticate } from "../../../middleware/auth.js";
import { catchAsync } from "../../../utils/catchAsync.js";

const router = Router();

router.post("/register", catchAsync(register));
router.post("/login", catchAsync(login));
router.get("/me", authenticate, catchAsync(getProfile));
router.put("/profile", authenticate, catchAsync(updateProfile));

export default router;

import { Router } from "express";
import { register, login, verifyOtp } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verifyOtp", verifyOtp)
// router.post("/logout", logout);

export default router;

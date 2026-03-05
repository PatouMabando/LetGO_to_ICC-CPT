import { Router } from "express";
import auth, { requireAdmin } from "../middleware/auth.js";
import {
    listMembers,
    listDrivers,
    addUser,
    editUser,
    removeUser,
    setUserStatus,
    setDriverAvailability,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(auth, requireAdmin); 

router.get("/members", listMembers);
router.get("/drivers", listDrivers);
router.post("/user", addUser);
router.put("/user/:id", editUser);
router.delete("/user/:id", removeUser);
router.patch("/user/:id/status", setUserStatus);
router.patch("/driver/:id/availability", setDriverAvailability);

export default router;

import express from "express";
import auth from "../middleware/auth.js";
import {
    createDriverAssignment,
    listDriversByArea,
} from "../controllers/driverAssignment.controller.js";

const router = express.Router();

router.post("/", auth, createDriverAssignment);
router.get("/:tripId", auth, listDriversByArea);

export default router;

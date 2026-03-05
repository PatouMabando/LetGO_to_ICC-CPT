import express from "express";
import auth from "../middleware/auth.js";
import { driverBookings, startTrip, updateAvailability } from "../controllers/driver.controller.js";

const router = express.Router();

router.use(auth);

router.get("/bookings", driverBookings);
router.post("/start-trip", startTrip);
router.patch("/availability", updateAvailability);

export default router;

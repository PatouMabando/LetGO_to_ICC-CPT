import express from "express";
import auth from "../middleware/auth.js";
import { bookTrip, bookingHistory, getAddress, setAddress, trackDriver } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", bookTrip);
router.get("/history", bookingHistory);
router.get("/address", getAddress);
router.post("/address", setAddress);
router.get("/track/:bookingId", trackDriver);

export default router;



import express from "express";
import auth from "../middleware/auth.js";
import { bookTrip, cancelBooking } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", bookTrip);
router.delete("/:bookingId", cancelBooking);

export default router;


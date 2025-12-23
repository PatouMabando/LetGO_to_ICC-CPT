import express from "express";
import auth from "../middleware/auth.js";
import {
    createTrip,
    listTrips,
    closeTrip,
} from "../controllers/trip.controller.js";

const router = express.Router();


router.post("/", auth, createTrip);
router.get("/", auth, listTrips);


router.patch("/:id/close", auth, closeTrip);

export default router;

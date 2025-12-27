import { Response } from "express";
import DriverAssignment from "../models/DriverAssignment.js";
import Trip from "../models/Trip.js";
import { AuthRequest } from "../middleware/auth.js";


export const createDriverAssignment = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (req.user?.role !== "driver") {
            return res.status(403).json({ error: "Only drivers allowed" });
        }

        const { tripId, area, availableSeats } = req.body as {
            tripId?: string;
            area?: string;
            availableSeats?: number;
        };

        if (!tripId || !area || !availableSeats) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const trip = await Trip.findById(tripId);
        if (!trip || trip.status !== "open") {
            return res.status(400).json({ error: "Trip not available" });
        }

        const assignment = await DriverAssignment.create({
            tripId,
            driverId: req.user.id,
            area,
            availableSeats,
        });

        return res.status(201).json(assignment);
    } catch (error) {
        console.error("DriverAssignment error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


export const listDriversByArea = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { tripId } = req.params;
        const { area } = req.query as { area?: string };

        if (!area) {
            return res.status(400).json({ error: "Area required" });
        }

        const drivers = await DriverAssignment.find({
            tripId,
            area,
            availableSeats: { $gt: 0 },
        }).populate("driverId", "name lastName");

        return res.status(200).json(drivers);
    } catch (error) {
        console.error("List drivers error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

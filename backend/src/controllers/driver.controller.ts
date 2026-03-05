import { Request, Response } from "express";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";

// View number of bookings (pending/confirmed and completed/cancelled)
export const driverBookings = async (req: AuthRequest, res: Response) => {
    try {
        const driverId = req.user?.id;
        if (!driverId) return res.status(401).json({ error: "Unauthorized" });
        const confirmed = await Booking.countDocuments({ driverId, status: "confirmed" });
        const completed = await Booking.countDocuments({ driverId, status: "cancelled" });
        return res.status(200).json({ confirmed, completed });
    } catch (error) {
        console.error("Driver bookings error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

// Start a trip (map route logic placeholder)
export const startTrip = async (req: AuthRequest, res: Response) => {
    try {
        // This would trigger map logic in the frontend
        return res.status(200).json({ message: "Trip started. Open map to follow route." });
    } catch (error) {
        console.error("Start trip error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

// Update availability status
export const updateAvailability = async (req: AuthRequest, res: Response) => {
    try {
        const driverId = req.user?.id;
        const { availability } = req.body;
        if (!driverId || !availability || !["available", "not_available"].includes(availability)) {
            return res.status(400).json({ error: "Invalid request" });
        }
        const driver = await User.findById(driverId);
        if (!driver || driver.role !== "driver") return res.status(404).json({ error: "Driver not found" });
        driver.availability = availability;
        await driver.save();
        return res.status(200).json({ message: `Availability updated to ${availability}` });
    } catch (error) {
        console.error("Update availability error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

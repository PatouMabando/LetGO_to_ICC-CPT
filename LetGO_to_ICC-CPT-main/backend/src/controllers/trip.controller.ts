import { Request, Response } from "express";
import Trip from "../models/Trip.js";
import { AuthRequest } from "../middleware/auth.js";


export const createTrip = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { title, date, totalSeats } = req.body as {
            title?: string;
            date?: string;
            totalSeats?: number;
        };

        if (!title || !date || !totalSeats) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const trip = await Trip.create({
            title,
            date: new Date(date),
            totalSeats,
            bookedSeats: 0,
            status: "open",
        });

        return res.status(201).json(trip);
    } catch (error) {
        console.error("Create trip error:", error);
        return res.status(500).json({ error: "Server error creating trip" });
    }
};


export const listTrips = async (_req: Request, res: Response) => {
    try {
        const trips = await Trip.find().sort({ date: 1 });
        return res.status(200).json(trips);
    } catch (error) {
        console.error("List trips error:", error);
        return res.status(500).json({ error: "Server error fetching trips" });
    }
};


export const closeTrip = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { id } = req.params;

        const trip = await Trip.findById(id);
        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }

        trip.status = "closed";
        await trip.save();

        return res.status(200).json({ message: "Trip closed", trip });
    } catch (error) {
        console.error("Close trip error:", error);
        return res.status(500).json({ error: "Server error closing trip" });
    }
};

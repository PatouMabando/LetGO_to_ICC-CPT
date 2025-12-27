import { Response } from "express";
import Booking from "../models/Booking.js";
import DriverAssignment from "../models/DriverAssignment.js";
import Trip from "../models/Trip.js";
import { AuthRequest } from "../middleware/auth.js";

export const bookTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { tripId, driverAssignmentId } = req.body as {
      tripId?: string;
      driverAssignmentId?: string;
    };

    if (!userId || !tripId || !driverAssignmentId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip || trip.status !== "open") {
      return res.status(400).json({ error: "Trip not available" });
    }

    const assignment = await DriverAssignment.findById(driverAssignmentId);
    if (!assignment || assignment.availableSeats <= 0) {
      return res.status(400).json({ error: "Driver not available" });
    }

    const exists = await Booking.findOne({
      tripId,
      userId,
    });
    if (exists) {
      return res.status(400).json({ error: "Already booked" });
    }

    assignment.availableSeats -= 1;
    await assignment.save();

    const booking = await Booking.create({
      tripId,
      userId,
      driverAssignmentId,
    });

    return res.status(201).json({
      message: "Seat booked",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bookingId } = req.params;

    if (!userId || !bookingId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Only owner can cancel
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking already cancelled" });
    }

    // Restore seat
    const assignment = await DriverAssignment.findById(
      booking.driverAssignmentId
    );
    if (assignment) {
      assignment.availableSeats += 1;
      await assignment.save();
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
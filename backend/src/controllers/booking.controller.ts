import { Response } from "express";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";

// Book a trip (one-way/round trip) with all fields
export const bookTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      type,
      time,
      address,
      pickupLocation,
      dropoffLocation,
      notes,
      driverId
    } = req.body;
   
    if (!userId || !type || !time || !address || !pickupLocation || !dropoffLocation || !driverId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save address to user profile if provided
    await User.findByIdAndUpdate(userId, { address });

    // Create booking
    const booking = await Booking.create({
      userId,
      driverId,
      type,
      time,
      address,
      pickupLocation,
      dropoffLocation,
      notes: notes || "",
      status: "confirmed",
    });

    return res.status(201).json({
      message: "Trip booked successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// View booking history
export const bookingHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const bookings = await Booking.find({ userId }).populate("driverId");
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Booking history error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Register/view address with Cape Town map integration
export const getAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await User.findById(userId);
    return res.status(200).json({ address: user?.address || "" });
  } catch (error) {
    console.error("Get address error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const setAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { address } = req.body;
    if (!userId || !address) return res.status(400).json({ error: "Missing address" });
    await User.findByIdAndUpdate(userId, { address });
    return res.status(200).json({ message: "Address updated" });
  } catch (error) {
    console.error("Set address error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Track driver for active trips
export const trackDriver = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bookingId } = req.params;
    if (!userId || !bookingId) return res.status(400).json({ error: "Missing bookingId" });
    const booking = await Booking.findById(bookingId).populate("driverId");
    if (!booking || booking.userId.toString() !== userId) {
      return res.status(404).json({ error: "Booking not found" });
    }
    // Assume driver has a location field
    const driver = booking.driverId as any;
    return res.status(200).json({ location: driver.location });
  } catch (error) {
    console.error("Track driver error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
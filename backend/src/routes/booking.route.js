import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

function getNextSunday() {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  const diff = (7 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// GET next Sunday booking
router.get("/next/:memberId", async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const sunday = getNextSunday();
    const start = new Date(sunday);
    const end = new Date(sunday);
    end.setHours(23, 59, 59, 999);

    const booking = await Booking.findOne({
      member: memberId,
      serviceDate: { $gte: start, $lte: end },
    }).populate("member driver");

    res.json(booking || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create next Sunday booking
router.post("/next", async (req, res) => {
  try {
    const { memberId, selectedTime, pickupAddress } = req.body;
    if (!memberId || !selectedTime || !pickupAddress) {
      return res
        .status(400)
        .json({ error: "memberId, selectedTime and pickupAddress are required" });
    }

    const sunday = getNextSunday();
    let booking = await Booking.findOne({
      member: memberId,
      serviceDate: sunday,
    });

    if (!booking) {
      booking = await Booking.create({
        member: memberId,
        serviceDate: sunday,
        selectedTime,
        pickupAddress,
        destination: "ICC Cape Town",
      });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET recent bookings
router.get("/recent/:memberId", async (req, res) => {
  try {
    const bookings = await Booking.find({ member: req.params.memberId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("member driver");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
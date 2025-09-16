import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      default: "ICC Cape Town",
    },
    serviceDate: {
      type: Date,
      required: true,
    },
    selectedTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "assigned", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;

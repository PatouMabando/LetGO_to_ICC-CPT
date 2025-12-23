import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  tripId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  driverAssignmentId: mongoose.Types.ObjectId;
  status: "confirmed" | "cancelled";
}

const BookingSchema = new Schema<IBooking>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverAssignmentId: {
      type: Schema.Types.ObjectId,
      ref: "DriverAssignment",
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);

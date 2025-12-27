
import mongoose, { Schema, Document } from "mongoose";

export interface ITrip extends Document {
  title: string;
  date: Date;
  totalSeats: number;
  bookedSeats: number;
  status: "open" | "closed";
}

const TripSchema = new Schema<ITrip>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
});

export default mongoose.model<ITrip>("Trip", TripSchema);

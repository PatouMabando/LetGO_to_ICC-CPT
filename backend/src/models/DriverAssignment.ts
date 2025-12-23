import mongoose, { Schema, Document } from "mongoose";

export interface IDriverAssignment extends Document {
    tripId: mongoose.Types.ObjectId;
    driverId: mongoose.Types.ObjectId;
    area: string;
    availableSeats: number;
}

const DriverAssignmentSchema = new Schema<IDriverAssignment>(
    {
        tripId: {
            type: Schema.Types.ObjectId,
            ref: "Trip",
            required: true,
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        area: {
            type: String,
            required: true,
        },
        availableSeats: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IDriverAssignment>(
    "DriverAssignment",
    DriverAssignmentSchema
);

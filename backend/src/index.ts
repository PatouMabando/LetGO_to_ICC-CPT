
import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.route.js"
import bookingRoutes from "./routes/booking.route.js"
import tripRoutes from "./routes/trip.route.js"
import driverAssignmentRoutes from "./routes/driverAssignment.route.js"
import { connectDB } from "./config/db.js";


dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes); //Authentication
app.use("/api/bookings", bookingRoutes); //Bookings
app.use("/api/trips", tripRoutes); //Trips
app.use("/api/driver-assignments", driverAssignmentRoutes);


// Database
connectDB();

// Server
const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

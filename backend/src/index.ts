import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.route.js"
import bookingRoutes from "./routes/booking.route.js"
import adminRoutes from "./routes/admin.route.js"
import driverRoutes from "./routes/driver.route.js"
import { connectDB } from "./config/db.js";

dotenv.config();

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes); //Authentication
app.use("/api/bookings", bookingRoutes); //Bookings
app.use("/api/admin", adminRoutes); // Admin management endpoints
app.use("/api/driver", driverRoutes); // Driver endpoints


// Database
connectDB();

// Server
const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

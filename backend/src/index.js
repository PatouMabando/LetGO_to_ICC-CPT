import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import bookingRoutes from "./routes/booking.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json()); 

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
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


app.use("/api/auth", authRoutes);

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

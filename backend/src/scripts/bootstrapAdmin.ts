import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your-db-name";

const admins = [
    {
        name: "Mehdi",
        lastName: "Kiona",
        phoneNumber: "+27659546977",
        role: "admin",
        status: "approved",
    },
    // Add more admin objects here as needed
    // {
    //   name: "Second",
    //   lastName: "Admin",
    //   phoneNumber: "+27820000001",
    //   role: "admin",
    //   status: "approved",
    // },
];

async function createAdmins() {
    await mongoose.connect(MONGO_URI);
    for (const admin of admins) {
        const existing = await User.findOne({ phoneNumber: admin.phoneNumber });
        if (existing) {
            console.log(`Admin with phone ${admin.phoneNumber} already exists.`);
        } else {
            await User.create(admin);
            console.log(`Admin user ${admin.phoneNumber} created!`);
        }
    }
    process.exit();
}

createAdmins().catch((err) => {
    console.error("Error creating admins:", err);
    process.exit(1);
});

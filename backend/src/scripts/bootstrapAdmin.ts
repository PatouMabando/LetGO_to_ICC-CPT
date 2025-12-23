
import "dotenv/config";
import mongoose from "mongoose";
import User  from "../models/User.js";

async function main() {
    const uri = process.env.MONGO_URI || process.env.MONGO_URI;
    const phoneNumber = process.env.ADMIN_PHONE_NUMBER!;
    const firstName = process.env.ADMIN_FIRST_NAME || "Admin";
    const lastName = process.env.ADMIN_LAST_NAME || "User";
    const email = process.env.ADMIN_EMAIL;

    if (!uri || !phoneNumber) {
        console.error("Missing MONGO_URI/MONGODB_URI or ADMIN_PHONE_NUMBER in env.");
        process.exit(1);
    }

    await mongoose.connect(uri);

    const existing =
        (await User.findOne({ phoneNumber }).lean()) ||
        (await User.findOne({ phone: phoneNumber }).lean());

    if (existing) {
        if (existing.role === "admin") {
            console.log(`User ${phoneNumber} is already admin. Nothing to do.`);
        } else {
            await User.updateOne({ _id: existing._id }, { $set: { role: "admin" } });
            console.log(`Promoted existing user ${phoneNumber} to admin.`);
        }
    } else {
        const payload: any = { firstName, lastName, phoneNumber, role: "admin" };
        if (email) payload.email = email;
        await User.create(payload);
        console.log(`Created new admin user ${phoneNumber}.`);
    }

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

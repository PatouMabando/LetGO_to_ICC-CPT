import { Request, Response } from "express";
import User from "../models/User.js";

// List all members
export const listMembers = async (_req: Request, res: Response) => {
    try {
        const members = await User.find({ role: "member" });
        return res.status(200).json(members);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

// List all drivers
export const listDrivers = async (_req: Request, res: Response) => {
    try {
        const drivers = await User.find({ role: "driver" });
        return res.status(200).json(drivers);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

// Add member or driver
export const addUser = async (req: Request, res: Response) => {
    try {
        const { name, lastName, phoneNumber, role } = req.body;
        if (!name || !lastName || !phoneNumber || !role) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const existing = await User.findOne({ phoneNumber });
        if (existing) {
            return res.status(400).json({ error: "Phone number already exists" });
        }
        const user = new User({ name, lastName, phoneNumber, role });
        await user.save();
        return res.status(201).json({ message: "User added", user });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

// Edit member or driver
export const editUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, lastName, phoneNumber, status, availability } = req.body;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (name) user.name = name;
        if (lastName) user.lastName = lastName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (status) user.status = status;
        if (availability && user.role === "driver") user.availability = availability;
        await user.save();
        return res.status(200).json({ message: "User updated", user });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

// Remove (delete) member or driver
export const removeUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        await user.deleteOne();
        return res.status(200).json({ message: "User removed" });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

// Approve or block user
export const setUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status || !["approved", "blocked", "pending"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.status = status;
        await user.save();
        return res.status(200).json({ message: `User status set to ${status}` });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

// Toggle driver availability
export const setDriverAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { availability } = req.body;
        if (!availability || !["available", "not_available"].includes(availability)) {
            return res.status(400).json({ error: "Invalid availability" });
        }
        const user = await User.findById(id);
        if (!user || user.role !== "driver") return res.status(404).json({ error: "Driver not found" });
        user.availability = availability;
        await user.save();
        return res.status(200).json({ message: `Driver availability set to ${availability}` });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

import express from "express";
import Attendance from "../Models/Attendance.js";
import User from "../Models/UserModel.js";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Mark attendance
router.post("/mark-attendance", verifyToken, async (req, res) => {
  const { userId, date, status, notes } = req.body;

  try {
    const attendance = new Attendance({ userId, date, status, notes });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

// Get all users except admin
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get monthly attendance
router.get("/monthly-attendance", verifyToken, async (req, res) => {
  const { month, year } = req.query;

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("userId", "username email"); // Populate the userId field

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch monthly attendance" });
  }
});

export default router;

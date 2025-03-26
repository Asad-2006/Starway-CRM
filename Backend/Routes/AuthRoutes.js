import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// FILES IMPORTS
import UserModel from "../Models/UserModel.js";
import { verifyToken, isAdmin } from "../Middlewares/AuthMiddleware.js";

dotenv.config();

const router = express.Router();

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) res.status(404).json({ message: "User Not Found" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch) res.status(400).json({ message: "Invalid Credendials" });

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    //User ko token diya hai yaha
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Register
router.post("/register", verifyToken, isAdmin, async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already Exists" });

    user = new UserModel({ username, email, password, role });
    await user.save();
    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Pakdo Sare Users Ko
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await UserModel.find(
      {},
      "username email role joiningDate leaveBalance leaveRecords"
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// User ko kick kar do
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// user update
router.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
  const { username, role, joiningDate } = req.body;

  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.role = role || user.role;
    user.joiningDate = joiningDate || user.joiningDate;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// get only users with managera and admin role
router.get("/admins-managers", verifyToken, async (req, res) => {
  try {
    const users = await UserModel.find({
      role: { $in: ["admin", "manager"] },
    }).select("username email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;

// get only users with developer role
router.get("/developers", verifyToken, async (req, res) => {
  try {
    const developers = await UserModel.find({ role: "developer" }).select(
      "username email"
    );
    res.json(developers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch developers" });
  }
});

// get only users with caller role
router.get("/callers", verifyToken, async (req, res) => {
  try {
    const callers = await UserModel.find({ role: "caller" }).select(
      "username email"
    );
    res.json(callers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch callers" });
  }
});

// fetches the username of the user
router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("username");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get leave history of a user
router.get(
  "/users/:id/leave-history",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id).select(
        "leaveRecords leaveBalance"
      );
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({
        leaveRecords: user.leaveRecords,
        leaveBalance: user.leaveBalance,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// add leave record function
router.post(
  "/users/:id/leave-records",
  verifyToken,
  isAdmin,
  async (req, res) => {
    const { startDate, endDate, type, note } = req.body;

    if (!startDate || !endDate || !note) {
      return res.status(400).json({
        message: "All fields (startDate, endDate, note) are required.",
      });
    }

    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const leaveDuration =
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
      const leaveDays = type === "half" ? leaveDuration * 0.5 : leaveDuration;

      user.leaveRecords.push({ startDate, endDate, type, note });

      user.leaveBalance -= leaveDays;

      await user.save();

      res.json({ message: "Leave record added successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Uupdate leave balance function
router.put(
  "/users/:id/leave-balance",
  verifyToken,
  isAdmin,
  async (req, res) => {
    const { leaveBalance } = req.body;

    if (typeof leaveBalance !== "number" || isNaN(leaveBalance)) {
      return res
        .status(400)
        .json({ message: "Leave balance must be a valid number." });
    }

    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.leaveBalance = leaveBalance;
      await user.save();

      res.json({ message: "Leave balance updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// delete leave record function
router.delete(
  "/users/:userId/leave-records/:recordId",
  verifyToken,
  isAdmin,
  async (req, res) => {
    const { userId, recordId } = req.params;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const recordIndex = user.leaveRecords.findIndex(
        (record) => record._id.toString() === recordId
      );

      if (recordIndex === -1) {
        return res.status(404).json({ message: "Leave record not found" });
      }

      user.leaveRecords.splice(recordIndex, 1);

      await user.save();

      res.json({ message: "Leave record deleted successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

import express from "express";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// redirecting to dashboards according to role
router.get("/", verifyToken, (req, res) => {
  const role = req.user.role;

  if (role === "admin") {
    res.json({ dashboard: "Admin Dashboard" });
  } else if (role === "caller") {
    res.json({ dashboard: "Caller Dashboard" });
  } else if (role === "developer") {
    res.json({ dashboard: "Developer Dashboard" });
  } else if (role === "manager") {
    res.json({ dashboard: "Team Manager Dashboard" });
  } else {
    res.status(403).json({ message: "Cannot Verify The User" });
  }
});

export default router;

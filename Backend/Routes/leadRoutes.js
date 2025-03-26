import express from "express";
import { verifyToken, isAdmin } from "../Middlewares/AuthMiddleware.js";
import {
  deleteLead,
  addLead,
  getAllLeads,
  assignLead,
  getAssignedLeads,
  unassignLead,
  getNewLeads,
  getAllAssignedLeads,
  updateLeadStatus,
  getClosedLeads,
  getTotalLeads,
  getTotalClosedLeads,
  getNewLeadsThisMonth,
  getRecentLeads,
  getClosedLeadsByDate,
} from "../Controllers/leadController.js";
import Lead from "../Models/Lead.js";

const router = express.Router();

// just the routes
router.post("/add", verifyToken, addLead);
router.get("/all", verifyToken, getAllLeads);
router.delete("/delete/:id", verifyToken, deleteLead);
router.put("/assign/:leadId", verifyToken, assignLead);
router.get("/assigned", verifyToken, getAssignedLeads);
router.get("/all-assigned", verifyToken, isAdmin, getAllAssignedLeads);
router.put("/unassign/:leadId", verifyToken, unassignLead);
router.get("/new", verifyToken, getNewLeads);
router.put("/update-status/:leadId", verifyToken, updateLeadStatus);
router.get("/closed", verifyToken, getClosedLeads);
router.get("/total-leads", getTotalLeads);
router.get("/total-closed-leads", getTotalClosedLeads);
router.get("/new-leads-this-month", getNewLeadsThisMonth);
router.get("/recent-leads", getRecentLeads);
router.get("/closed-leads-by-date", getClosedLeadsByDate);

// routes with controller
router.get("/lead-trends", async (req, res) => {
  try {
    const leads = await Lead.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(leads);
  } catch (error) {
    console.error("Error fetching lead trends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/leads-by-user", async (req, res) => {
  try {
    const leadsByUser = await Lead.aggregate([
      {
        $group: {
          _id: "$leadOwner",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(leadsByUser);
  } catch (error) {
    console.error("Error fetching leads by user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/closed-leads-count", async (req, res) => {
  try {
    const closedLeads = await Lead.find({
      status: "closed",
      closedAt: { $ne: null },
    });

    const closedLeadsData = {};

    closedLeads.forEach((lead) => {
      const month = new Date(lead.closedAt).toLocaleString("default", {
        month: "long",
      });
      if (!closedLeadsData[month]) {
        closedLeadsData[month] = 0;
      }
      closedLeadsData[month]++;
    });

    res.json(closedLeadsData);
  } catch (error) {
    console.error("Error fetching closed leads count:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// get this week lead of the logged user
router.get("/leads-this-week", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);
    const leads = await Lead.find({
      userId,
      createdAt: { $gte: firstDayOfWeek, $lte: lastDayOfWeek },
    });

    res.status(200).json({ leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get this months lead of the logged user
router.get("/leads-this-month", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    lastDayOfMonth.setHours(23, 59, 59, 999);

    const leads = await Lead.find({
      userId,
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });

    res.status(200).json({ leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get this years lead of the logged user
router.get("/leads-this-year", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
    lastDayOfYear.setHours(23, 59, 59, 999);

    const leads = await Lead.find({
      userId,
      createdAt: { $gte: firstDayOfYear, $lte: lastDayOfYear },
    });

    res.status(200).json({ leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get total lead with status closed of the logged user
router.get("/closed-leads", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const closedLeads = await Lead.find({
      userId,
      status: "closed",
    });

    res.status(200).json({ closedLeads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/leads-performance", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe } = req.query;

    const today = new Date();
    let startDate;

    if (timeframe === "week") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (timeframe === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (timeframe === "year") {
      startDate = new Date(today.getFullYear(), 0, 1);
    } else {
      return res.status(400).json({ message: "Invalid timeframe" });
    }

    const totalLeads = await Lead.find({
      userId: userId,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    const closedLeads = await Lead.find({
      userId: userId,
      status: "closed",
      closedAt: { $gte: startDate },
    }).sort({ closedAt: 1 });

    const formatData = (leads, key) => {
      return leads.map((lead) => ({
        date: lead[key]?.toISOString().slice(0, 7),
        [key === "createdAt" ? "leads" : "closedLeads"]: 1,
      }));
    };

    const totalLeadsFormatted = formatData(totalLeads, "createdAt");
    const closedLeadsFormatted = formatData(closedLeads, "closedAt");

    res.status(200).json({
      totalLeads: totalLeadsFormatted,
      closedLeads: closedLeadsFormatted,
    });
  } catch (error) {
    console.error("Error fetching performance data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get the recently added leads from here
router.get("/recent", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const leads = await Lead.find({ userId }).sort({ createdAt: -1 }).limit(20);

    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching recent leads:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;

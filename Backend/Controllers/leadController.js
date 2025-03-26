import Lead from "../Models/Lead.js";
import UserModel from "../Models/UserModel.js";

export const addLead = async (req, res) => {
  try {
    const {
      leadName,
      email,
      website,
      phoneNumber,
      designation,
      country,
      packages,
      leadType,
      note,
      pitchedAmount,
      currencySymbol,
    } = req.body;

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newLead = new Lead({
      leadName,
      email,
      website,
      phoneNumber,
      designation,
      country,
      packages,
      leadType,
      note,
      pitchedAmount,
      currencySymbol,
      userId: req.user.id,
      leadOwner: user.username,
    });

    await newLead.save();
    res.status(201).json({ message: "Lead added successfully", lead: newLead });
  } catch (error) {
    console.error("Error in addLead:", error);
    res
      .status(500)
      .json({ message: "Error adding lead", error: error.message });
  }
};

// by date
export const getClosedLeadsByDate = async (req, res) => {
  try {
    const closedLeads = await Lead.find({ status: "closed" })
      .select("closedAt")
      .sort("closedAt");

    const dailyData = closedLeads.reduce((acc, lead) => {
      if (!lead.closedAt) return acc;

      const date = lead.closedAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.entries(dailyData).map(([date, count]) => ({
      date,
      count,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching closed leads by date:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ userId: req.user.id })
      .populate("assignedTo", "username email")
      .populate("assignedBy", "username email");

    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//unassign lead function
export const unassignLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.assignedTo = null;
    lead.assignedBy = null;
    await lead.save();

    res.status(200).json(lead);
  } catch (error) {
    console.error("Error unassigning lead:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a lead
// export const deleteLead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const lead = await Lead.findById(id);

//     if (!lead) {
//       return res.status(404).json({ message: "Lead not found" });
//     }

//     if (lead.userId.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     await Lead.findByIdAndDelete(id);
//     res.status(200).json({ message: "Lead deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error deleting lead", error: error.message });
//   }
// };

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (lead.status === "Closed") {
      return res
        .status(403)
        .json({ message: "Closed leads cannot be deleted" });
    }

    await Lead.findByIdAndDelete(id);
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead", error });
  }
};

// // Assign lead to an Admin/Manager
// export const assignLead = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const { leadId } = req.params;

//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const updatedLead = await Lead.findByIdAndUpdate(
//       leadId,
//       {
//         assignedTo: userId,
//         assignedBy: req.user.id,
//       },
//       { new: true }
//     )
//       .populate("assignedTo", "username email")
//       .populate("assignedBy", "username email");

//     if (!updatedLead) {
//       return res.status(404).json({ message: "Lead not found" });
//     }

//     res.status(200).json(updatedLead);
//   } catch (error) {
//     console.error("Error assigning lead:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const assignLead = async (req, res) => {
  const { leadId } = req.params;
  const { userId, assignedAt } = req.body;

  try {
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.assignedTo = userId;
    lead.assignedAt = assignedAt || new Date();

    await lead.save();

    res.status(200).json(lead);
  } catch (error) {
    console.error("Error assigning lead:", error);
    res.status(500).json({ message: "Error assigning lead" });
  }
};

// assigned lead for the manager dashboard
export const getAssignedLeads = async (req, res) => {
  try {
    const managerId = req.user.id;

    const assignedLeads = await Lead.find({ assignedTo: managerId })
      .populate("assignedTo", "username email")
      .populate("assignedBy", "username email");

    res.json(assignedLeads);
  } catch (error) {
    console.error("Error fetching assigned leads:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNewLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "username email")
      .populate("assignedBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching new leads:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAssignedLeads = async (req, res) => {
  try {
    const assignedLeads = await Lead.find({ assignedTo: { $ne: null } })
      .populate("assignedTo", "username email")
      .populate("assignedBy", "username email")
      .sort({ assignedAt: -1 });
    res.json(assignedLeads);
  } catch (error) {
    console.error("Error fetching all assigned leads:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const updateLeadStatus = async (req, res) => {
//   try {
//     const { leadId } = req.params;
//     const { status } = req.body;

//     const lead = await Lead.findById(leadId);
//     if (!lead) {
//       return res.status(404).json({ message: "Lead not found" });
//     }

//     if (!lead.leadOwner) {
//       const user = await UserModel.findById(lead.userId);
//       if (user) {
//         lead.leadOwner = user.username;
//       }
//     }

//     lead.status = status;
//     await lead.save();

//     res.status(200).json(lead);
//   } catch (error) {
//     console.error("Error updating lead status:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const updateLeadStatus = async (req, res) => {
//   try {
//     const { leadId } = req.params;
//     const { status } = req.body;

//     const lead = await Lead.findById(leadId);
//     if (!lead) {
//       return res.status(404).json({ message: "Lead not found" });
//     }

//     if (!lead.leadOwner) {
//       const user = await UserModel.findById(lead.userId);
//       if (user) {
//         lead.leadOwner = user.username;
//       }
//     }

//     // ✅ If the lead is being closed, set the closedAt date
//     if (status === "closed" && lead.status !== "closed") {
//       lead.closedAt = new Date();
//     } else if (status !== "closed") {
//       lead.closedAt = null; // Reset if reopened
//     }

//     lead.status = status;
//     await lead.save();

//     res.status(200).json(lead);
//   } catch (error) {
//     console.error("Error updating lead status:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const updateLeadStatus = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status, currencySymbol } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (!lead.leadOwner) {
      const user = await UserModel.findById(lead.userId);
      if (user) {
        lead.leadOwner = user.username;
      }
    }

    if (status === "closed" && lead.status !== "closed") {
      lead.closedAt = new Date();
    } else if (status !== "closed") {
      lead.closedAt = null;
    }

    if (currencySymbol) {
      lead.currencySymbol = currencySymbol;
    }

    lead.status = status;
    await lead.save();

    res.status(200).json(lead);
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClosedLeads = async (req, res) => {
  try {
    const userId = req.user.id;

    const closedLeads = await Lead.find({ status: "closed", userId })
      .populate("assignedTo", "username email")
      .populate("assignedBy", "username email");

    res.status(200).json(closedLeads || []);
  } catch (error) {
    console.error("Error fetching closed leads:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTotalLeads = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    res.json({ totalLeads });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads count", error });
  }
};

export const getTotalClosedLeads = async (req, res) => {
  try {
    const closedLeads = await Lead.countDocuments({ status: "closed" });
    res.json({ totalClosedLeads: closedLeads });
  } catch (error) {
    console.error("Error fetching closed leads count:", error);
    res
      .status(500)
      .json({ message: "Error fetching closed leads count", error });
  }
};

export const getNewLeadsThisMonth = async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const newLeads = await Lead.countDocuments({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });

    res.json({ totalNewLeads: newLeads });
  } catch (error) {
    console.error("Error fetching new leads count:", error);
    res.status(500).json({ message: "Error fetching new leads count", error });
  }
};

export const getRecentLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(15);
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads", error });
  }
};

export const getClosedLeadsSales = async (req, res) => {
  try {
    const closedLeads = await Lead.find({ status: "closed" });

    const salesData = {};

    closedLeads.forEach((lead) => {
      const month = moment(lead.createdAt).format("MMMM YYYY");
      const date = moment(lead.createdAt).format("YYYY-MM-DD");

      if (!salesData[month]) {
        salesData[month] = [];
      }

      salesData[month].push({ date, sales: lead.pitchedAmount || 0 });
    });

    Object.keys(salesData).forEach((month) => {
      salesData[month].sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    res.status(200).json(salesData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales data", error });
  }
};

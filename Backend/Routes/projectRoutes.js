import express from "express";
import {
  createProject,
  getProjects,
  deleteProject,
  updateUpsaleData,
  updateProject,
  getOneTimeProjects,
  getSubscriptionBasedProjects,
  getWebsiteBasedProjects,
  getActiveOneTimeProjects,
  getActiveSubscriptionBasedProjects,
  getActiveWebsiteBasedProjects,
  getTotalActiveProjects,
  getUserProjects,
  getProjectUpdates,
  addProjectUpdate,
} from "../Controllers/projectController.js";
import { isAdmin, verifyToken } from "../Middlewares/AuthMiddleware.js";
import Project from "../Models/ProjectModel.js";

const router = express.Router();

router.post("/projects", verifyToken, createProject);

router.get("/projects", getProjects);

router.delete("/projects/:id", deleteProject);

router.put("/projects/:id", verifyToken, updateProject);

router.get("/projects/one-time", verifyToken, getOneTimeProjects);

router.get("/projects/website-based", verifyToken, getWebsiteBasedProjects);

router.get("/projects/active-one-time", verifyToken, getActiveOneTimeProjects);

router.get("/projects/total-active", verifyToken, getTotalActiveProjects);

router.get("/projects/my-projects", verifyToken, getUserProjects);

router.post("/projects/:id/updates", verifyToken, addProjectUpdate);

router.get("/projects/:id/updates", verifyToken, getProjectUpdates);

router.get("/projects/:id/updates", verifyToken, getProjectUpdates);

router.get(
  "/projects/subscription-based",
  verifyToken,
  getSubscriptionBasedProjects
);

router.get(
  "/projects/active-subscription-based",
  verifyToken,
  getActiveSubscriptionBasedProjects
);

router.get(
  "/projects/active-website-based",
  verifyToken,
  getActiveWebsiteBasedProjects
);

// get active projects counts
router.get("/active-projects-count", async (req, res) => {
  try {
    const activeProjectsCount = await Project.countDocuments({
      status: "Active",
    });
    res.json({ count: activeProjectsCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching active projects count", error });
  }
});
router.get(
  "/projects/subscription-based",
  verifyToken,
  getSubscriptionBasedProjects
);

router.put(
  "/projects/:projectId/upsale/:upsaleId",
  verifyToken,
  updateUpsaleData
);

router.put("/projects/:id/up-sale", verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    console.log("Project ID received:", projectId);

    const { upSale } = req.body;
    console.log("New upSale value:", upSale);

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { upSale },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Up-sale status updated", updatedProject });
  } catch (error) {
    console.error("Error updating up-sale:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/projects/:id/upsale", verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { serviceType, amount, details, comments } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $push: { upsaleData: { serviceType, amount, details, comments } } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Upsale data added", updatedProject });
  } catch (error) {
    console.error("Error adding upsale data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/projects/:id/status", verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { status } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { status },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project status updated", updatedProject });
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get the active project with data
router.get("/active-projects", async (req, res) => {
  try {
    const activeProjects = await Project.find({ status: "Active" })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(activeProjects);
  } catch (error) {
    console.error("Error fetching active projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

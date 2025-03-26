import Project from "../Models/ProjectModel.js";
import UserModel from "../Models/UserModel.js";

export const createProject = async (req, res) => {
  try {
    const {
      projectName,
      projectDetails,
      clientName,
      clientEmail,
      clientNumber,
      amount,
      assignedDeveloper,
      serviceType,
      referenceSite,
      businessNiche,
      comments,
      subscriptionType,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User information is missing" });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const createdBy = user.username;

    console.log("Received data:", req.body);
    const newProject = new Project({
      projectName,
      projectDetails,
      clientName,
      clientEmail,
      clientNumber,
      amount,
      assignedDeveloper: {
        id: assignedDeveloper.id,
        username: assignedDeveloper.username,
      },
      serviceType,
      referenceSite,
      businessNiche,
      comments,
      subscriptionType,
      createdBy,
      createdDate: new Date(),
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdDate: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProjectSubscriptionType = async (req, res) => {
  try {
    const { id } = req.params;
    const { subscriptionType } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { subscriptionType },
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUpsaleData = async (req, res) => {
  try {
    const { projectId, upsaleId } = req.params;
    const { serviceType, amount, details, comments } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const upsaleEntry = project.upsaleData.id(upsaleId);
    if (!upsaleEntry) {
      return res.status(404).json({ message: "Upsale entry not found" });
    }

    upsaleEntry.serviceType = serviceType || upsaleEntry.serviceType;
    upsaleEntry.amount = amount || upsaleEntry.amount;
    upsaleEntry.details = details || upsaleEntry.details;
    upsaleEntry.comments = comments || upsaleEntry.comments;

    const updatedProject = await project.save();

    res.status(200).json({
      message: "Upsale data updated successfully",
      updatedProject,
    });
  } catch (error) {
    console.error("Error updating upsale data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProject = await Project.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOneTimeProjects = async (req, res) => {
  try {
    const developerId = req.user.id;

    const oneTimeProjects = await Project.find({
      subscriptionType: "One-Time",
      "assignedDeveloper.id": developerId,
    });

    res.status(200).json(oneTimeProjects);
  } catch (error) {
    console.error("Error fetching one-time projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSubscriptionBasedProjects = async (req, res) => {
  try {
    const developerId = req.user.id;

    const subscriptionBasedProjects = await Project.find({
      subscriptionType: "Subscription-Based",
      "assignedDeveloper.id": developerId,
    });

    res.status(200).json(subscriptionBasedProjects);
  } catch (error) {
    console.error("Error fetching subscription-based projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getWebsiteBasedProjects = async (req, res) => {
  try {
    const developerId = req.user.id;

    const subscriptionBasedProjects = await Project.find({
      subscriptionType: "Website-Based",
      "assignedDeveloper.id": developerId,
    });

    res.status(200).json(subscriptionBasedProjects);
  } catch (error) {
    console.error("Error fetching website-based projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getActiveProjectsCount = async (req, res) => {
  try {
    const activeProjects = await Project.countDocuments({ status: "Active" });

    res.json({ totalActiveProjects: activeProjects });
  } catch (error) {
    console.error("Error fetching active projects count:", error);
    res
      .status(500)
      .json({ message: "Error fetching active projects count", error });
  }
};

export const getActiveOneTimeProjects = async (req, res) => {
  try {
    const developerId = req.user.id;

    const activeOneTimeProjects = await Project.find({
      subscriptionType: "One-Time",
      status: "Active",
      "assignedDeveloper.id": developerId,
    });

    res.status(200).json(activeOneTimeProjects);
  } catch (error) {
    console.error("Error fetching active one-time projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getActiveSubscriptionBasedProjects = async (req, res) => {
  try {
    const developerId = req.user.id;

    const activeSubscriptionBasedProjects = await Project.find({
      subscriptionType: "Subscription-Based",
      status: "Active",
      "assignedDeveloper.id": developerId,
    });

    res.status(200).json(activeSubscriptionBasedProjects);
  } catch (error) {
    console.error("Error fetching active subscription-based projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getActiveWebsiteBasedProjects = async (req, res) => {
  try {
    const developerId = req.user.id;

    const websiteBasedProjects = await Project.find({
      subscriptionType: "Website-Based",
      status: "Active",
      "assignedDeveloper.id": developerId,
    });

    res.status(200).json(websiteBasedProjects);
  } catch (error) {
    console.error("Error fetching Website-Based projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTotalActiveProjects = async (req, res) => {
  try {
    const developerId = req.user.id;

    const totalActiveProjects = await Project.find({
      status: "Active",
      "assignedDeveloper.id": developerId,
    });

    res.status(200).json(totalActiveProjects);
  } catch (error) {
    console.error("Error fetching total active projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({ "assignedDeveloper.id": userId })
      .sort({ createdDate: -1 })
      .limit(15)
      .select("-amount -clientNumber");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getProjectUpdates = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     const project = await Project.findOne({
//       _id: id,
//       "assignedDeveloper.id": userId,
//     }).select("updates");

//     if (!project) {
//       return res
//         .status(404)
//         .json({ message: "Project not found or not assigned to you" });
//     }

//     res.status(200).json(project.updates);
//   } catch (error) {
//     console.error("Error fetching project updates:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// In your getProjectUpdates controller:
export const getProjectUpdates = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user; // Added by verifyToken middleware

    // First validate the project exists
    const project = await Project.findById(id)
      .select("updates assignedDeveloper")
      .lean(); // Using lean() for better performance

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check permissions - admin or assigned developer
    const isAdmin = user?.role === "admin";
    const isAssigned = project.assignedDeveloper?.id?.toString() === user?.id;

    if (!isAdmin && !isAssigned) {
      return res
        .status(403)
        .json({ message: "Not authorized to view updates" });
    }

    // Process updates with proper error handling
    let updates = [];
    if (project.updates && project.updates.length > 0) {
      updates = await Promise.all(
        project.updates.map(async (update) => {
          try {
            // Handle cases where createdBy might be string (ID) or object
            let creatorInfo = { id: "unknown", username: "Unknown" };

            if (update.createdBy) {
              if (typeof update.createdBy === "string") {
                const creator = await User.findById(update.createdBy)
                  .select("username")
                  .lean();
                if (creator) {
                  creatorInfo = {
                    id: creator._id.toString(),
                    username: creator.username,
                  };
                }
              } else if (update.createdBy.id) {
                creatorInfo = {
                  id: update.createdBy.id.toString(),
                  username: update.createdBy.username || "Unknown",
                };
              }
            }

            return {
              ...update,
              _id: update._id?.toString() || Math.random().toString(),
              createdAt: update.createdAt || new Date(),
              createdBy: creatorInfo,
            };
          } catch (error) {
            console.error("Error processing update:", error);
            return {
              ...update,
              _id: update._id?.toString() || Math.random().toString(),
              createdAt: update.createdAt || new Date(),
              createdBy: { id: "error", username: "Error loading user" },
            };
          }
        })
      );
    }

    res.status(200).json(updates);
  } catch (error) {
    console.error("Error in getProjectUpdates:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const addProjectUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.findOne({
      _id: id,
      "assignedDeveloper.id": userId,
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or not assigned to you" });
    }

    const newUpdate = {
      text,
      createdBy: {
        id: user._id,
        username: user.username,
      },
    };

    project.updates.push(newUpdate);
    await project.save();

    res.status(200).json({
      message: "Update added successfully",
      update: newUpdate,
    });
  } catch (error) {
    console.error("Error adding project update:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

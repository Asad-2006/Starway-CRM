import React, { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  UsersIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

function App() {
  const [activeOneTimeProjectsCount, setActiveOneTimeProjectsCount] =
    useState(0);
  const [
    activeSubscriptionBasedProjectsCount,
    setActiveSubscriptionBasedProjectsCount,
  ] = useState(0);
  const [websiteBasedCount, setWebsiteBasedCount] = useState(0);
  const [totalActiveProjectsCount, setTotalActiveProjectsCount] = useState(0);
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${API_BASE}/api/newproject/projects/my-projects`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch projects");
      }

      const data = await response.json();
      setProjectsData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchActiveOneTimeProjectsCount = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/newproject/projects/active-one-time`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setActiveOneTimeProjectsCount(response.data.length);
      } catch (error) {
        console.error("Error fetching active one-time projects count:", error);
      }
    };

    fetchActiveOneTimeProjectsCount();
  }, []);

  useEffect(() => {
    const fetchActiveSubscriptionBasedProjectsCount = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/newproject/projects/active-subscription-based`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setActiveSubscriptionBasedProjectsCount(response.data.length);
      } catch (error) {
        console.error(
          "Error fetching active subscription-based projects count:",
          error
        );
      }
    };

    fetchActiveSubscriptionBasedProjectsCount();
  }, []);

  useEffect(() => {
    const fetchWebsiteBasedCount = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/newproject/projects/active-website-based`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setWebsiteBasedCount(response.data.length); // Set count based on array length
      } catch (error) {
        console.error("Error fetching Website-Based projects:", error);
      }
    };

    fetchWebsiteBasedCount();
  }, []);

  useEffect(() => {
    const fetchTotalActiveProjectsCount = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/newproject/projects/total-active`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTotalActiveProjectsCount(response.data.length); // Set count based on array length
      } catch (error) {
        console.error("Error fetching total active projects:", error);
      }
    };

    fetchTotalActiveProjectsCount();
  }, []);

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const handleRowClick = (project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
  };

  return (
    <div className="bg-gray-50 font-sans antialiased">
      <header className="bg-white ">
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">Welcome Back, Dev</p>
        </div>
      </header>
      <main className="mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 md:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-200">One-Time Projects</p>
                <p className="text-3xl md:text-4xl font-bold mt-2">
                  {activeOneTimeProjectsCount}
                </p>
              </div>
              <UsersIcon className="h-10 w-10 md:h-12 md:w-12 text-indigo-300" />
            </div>
            <div className="mt-4 flex items-center text-indigo-200">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <Link to="/dashboard-developer/one-time">
                <span className="hover:text-white hover:border-b">
                  View Projects
                </span>
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 md:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100">Subscription Based Projects</p>
                <p className="text-3xl md:text-4xl font-bold mt-2">
                  {activeSubscriptionBasedProjectsCount}
                </p>
              </div>
              <CheckCircleIcon className="h-10 w-10 md:h-12 md:w-12 text-orange-300" />
            </div>
            <div className="mt-4 flex items-center text-orange-100">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <Link to="/dashboard-developer/subscription">
                <span className="hover:text-white hover:border-b">
                  View Projects
                </span>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-4 md:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-200">Website Based Projects</p>
                <p className="text-3xl md:text-4xl font-bold mt-2">
                  {websiteBasedCount}
                </p>
              </div>
              <ChartBarIcon className="h-10 w-10 md:h-12 md:w-12 text-indigo-300" />
            </div>
            <div className="mt-4 flex items-center text-indigo-200">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <Link to="/dashboard-developer/website-based">
                <span className="hover:text-white hover:border-b">
                  View Projects
                </span>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 md:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-100">Total Active Projects</p>
                <p className="text-3xl md:text-4xl font-bold mt-2">
                  {totalActiveProjectsCount}
                </p>
              </div>
              <CurrencyDollarIcon className="h-10 w-10 md:h-12 md:w-12 text-red-300" />
            </div>
            <div className="mt-4 flex items-center text-red-100">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <Link to="/dashboard-admin/projects">
                <span className="hover:text-white hover:border-b">
                  View Projects
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto shadow-lg rounded-lg overflow-hidden">
          <div className="relative w-full max-h-[400px] overflow-y-auto bg-white">
            <div className="min-w-full">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr className="animate-pulse">
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Loading your projects...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : projectsData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No projects assigned to you
                      </td>
                    </tr>
                  ) : (
                    projectsData.map((project, index) => (
                      <tr
                        key={project._id || index}
                        className="hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                        onClick={() => handleRowClick(project)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                            {project.projectName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {project.clientName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 capitalize">
                            {project.subscriptionType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusStyles(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {project.createdBy}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Improved MUI Dialog for Project Details */}
          {selectedProject && (
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle sx={{ bgcolor: "grey.100", py: 2 }}>
                <Typography variant="h5" component="span" color="textPrimary">
                  {selectedProject.projectName}
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ py: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Project Details Section */}
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Project Details
                  </Typography>
                  <TextField
                    label="Description"
                    value={selectedProject.projectDetails || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    multiline
                    minRows={2}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Client Name"
                    value={selectedProject.clientName || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Client Email"
                    value={selectedProject.clientEmail || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Assigned Developer"
                    value={selectedProject.assignedDeveloper?.username || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Service Type"
                    value={
                      Array.isArray(selectedProject.serviceType)
                        ? selectedProject.serviceType.join(", ")
                        : "N/A"
                    }
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Reference Site"
                    value={selectedProject.referenceSite || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Business Niche"
                    value={selectedProject.businessNiche || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Comments"
                    value={selectedProject.comments || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    multiline
                    minRows={2}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Subscription Type"
                    value={selectedProject.subscriptionType || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Status"
                    value={selectedProject.status || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Created By"
                    value={selectedProject.createdBy || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Created Date"
                    value={
                      selectedProject.createdDate
                        ? new Date(
                            selectedProject.createdDate
                          ).toLocaleDateString()
                        : "N/A"
                    }
                    fullWidth
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                  />

                  {/* Upsale Data Section */}
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Upsale Data
                  </Typography>
                  {selectedProject.upSale &&
                  selectedProject.upsaleData?.length > 0 ? (
                    <List sx={{ bgcolor: "grey.50", borderRadius: 1, p: 1 }}>
                      {selectedProject.upsaleData.map((upsale, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            py: 2,
                            bgcolor: "white",
                            borderRadius: 1,
                            mb:
                              index < selectedProject.upsaleData.length - 1
                                ? 2
                                : 0,
                            boxShadow: 1,
                          }}
                        >
                          <ListItemText
                            primaryTypographyProps={{
                              variant: "subtitle2",
                              color: "textPrimary",
                            }}
                            primary={`Service Type: ${
                              upsale.serviceType || "N/A"
                            }`}
                          />
                          <ListItemText
                            primaryTypographyProps={{
                              variant: "body2",
                              color: "textSecondary",
                            }}
                            primary={`Details: ${upsale.details || "N/A"}`}
                          />
                          <ListItemText
                            primaryTypographyProps={{
                              variant: "body2",
                              color: "textSecondary",
                            }}
                            primary={`Comments: ${upsale.comments || "N/A"}`}
                          />
                          <ListItemText
                            primaryTypographyProps={{
                              variant: "body2",
                              color: "textSecondary",
                            }}
                            primary={`Date: ${
                              upsale.date
                                ? new Date(upsale.date).toLocaleDateString()
                                : "N/A"
                            }`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                    >
                      No upsale data available
                    </Typography>
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={handleCloseDialog}
                  variant="contained"
                  color="primary"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

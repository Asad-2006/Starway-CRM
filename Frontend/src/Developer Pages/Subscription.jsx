import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Grid,
  TextField,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { Folder, Eye, Send, Edit } from "lucide-react";
import { format } from "date-fns";
import { indigo } from "@mui/material/colors";

const OneTime = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [updates, setUpdates] = useState([]);
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  const messagesEndRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    // Frontend - Fetching one-time projects
    const fetchSubscriptionProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE}/api/newproject/projects/subscription-based`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching one-time projects:", error);
        setError("Failed to fetch one-time projects. Please try again later.");
        setLoading(false);
      }
    };

    const fetchServiceTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/api/servicetypes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServiceTypes(response.data);
      } catch (error) {
        console.error("Error fetching service types:", error);
        setError("Failed to fetch service types.");
      }
    };

    fetchSubscriptionProjects();
    fetchServiceTypes();
  }, []);

  // Open modal and set the selected project
  const handleViewClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Filter projects based on search query, status filter and service type filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.projectName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "" || project.status === statusFilter;
    const matchesServiceType =
      serviceTypeFilter === "" ||
      (project.serviceType && project.serviceType.includes(serviceTypeFilter));

    return matchesSearch && matchesStatus && matchesServiceType;
  });

  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 border-yellow-500";
      case "in progress":
        return "text-blue-500 border-blue-500";
      case "completed":
        return "text-green-500 border-green-500";
      case "cancelled":
        return "text-red-500 border-red-500";
      default:
        return "text-gray-500 border-gray-500";
    }
  };

  // Open chat modal and load updates
  const handleUpdateClick = async (project) => {
    setSelectedProject(project);
    setIsChatOpen(true);
    setIsLoadingUpdates(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE}/api/newproject/projects/${project._id}/updates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdates(response.data || []);
    } catch (error) {
      console.error("Error fetching updates:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch updates. Please try again."
      );
      setUpdates([]);
    } finally {
      setIsLoadingUpdates(false);
    }
  };

  // Close chat modal
  const handleCloseChat = () => {
    setIsChatOpen(false);
    setUpdates([]);
    setMessage("");
  };

  // Send new update
  const handleSendUpdate = async () => {
    if (!message.trim() || !selectedProject) return;

    const tempId = Date.now().toString();
    const newUpdate = {
      _id: tempId,
      text: message,
      createdAt: new Date(),
      createdBy: {
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username") || "You",
      },
    };

    setUpdates((prev) => [...prev, newUpdate]);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/api/newproject/projects/${selectedProject._id}/updates`,
        { text: message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await axios.get(
        `${API_BASE}/api/newproject/projects/${selectedProject._id}/updates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdates(response.data || []);
    } catch (error) {
      console.error("Error sending update:", error);
      setError(
        error.response?.data?.message ||
          "Failed to send update. Please try again."
      );
      setUpdates((prev) => prev.filter((update) => update._id !== tempId));
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [updates]);

  // Avatar color generator
  function stringToColor(string) {
    if (!string) return "#000000";
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  return (
    <Box sx={{ width: "100%", px: 3 }}>
      {/* Search Bar and Filters */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 5, mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Search by Project Name"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="status-filter-label">Filter by Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="service-type-filter-label">
              Filter by Service Type
            </InputLabel>
            <Select
              labelId="service-type-filter-label"
              id="service-type-filter"
              value={serviceTypeFilter}
              label="Filter by Service Type"
              onChange={(e) => setServiceTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {serviceTypes.map((type) => (
                <MenuItem key={type._id} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : filteredProjects.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No one-time projects assigned to you matching your search.
        </Alert>
      ) : (
        <div>
          {filteredProjects.map((project) => (
            <Card key={project._id} sx={{ mb: 3 }}>
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box display="flex" alignItems="center">
                  <FolderIcon style={{ color: "#ffbf00", fontSize: "6rem" }} />
                  <Box ml={2}>
                    <Typography className="pb-1" variant="h6" component="h2">
                      {project.projectName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Client Name:</strong> {project.clientName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Client Email:</strong> {project.clientEmail}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Service Type:</strong>{" "}
                      {project.serviceType?.join(", ")}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    className={`border rounded-sm px-3 py-2 ${
                      project.status === "active"
                        ? "text-green-500 border-green-500"
                        : project.status === "closed"
                        ? "text-red-500 border-red-500"
                        : project.status === "pending"
                        ? "text-yellow-500 border-yellow-500"
                        : project.status === "in progress"
                        ? "text-blue-500 border-blue-500"
                        : project.status === "completed"
                        ? "text-green-500 border-green-500"
                        : project.status === "cancelled"
                        ? "text-red-500 border-red-500"
                        : "text-gray-500 border-gray-500"
                    }`}
                  >
                    {project.status ? project.status : "N/A"}
                  </Box>
                  <Box
                    className={`border rounded-sm px-3 py-2 ${
                      project.upSale
                        ? "text-green-500 border-green-500"
                        : "text-red-500 border-red-500"
                    }`}
                  >
                    {project.upSale ? "Upsale - Yes" : "Upsale - No"}
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      paddingTop: 1,
                      paddingBottom: 1,
                      bgcolor: "#2636ee",
                      "&:hover": {
                        bgcolor: "#212ec5", // indigo-700 for hover
                      },
                      textTransform: "capitalize",
                      fontSize: "15px",
                    }}
                    onClick={() => handleUpdateClick(project)}
                    startIcon={<Edit className="h-5 w-5" />}
                  >
                    Updates
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      paddingTop: 1,
                      paddingBottom: 1,
                      bgcolor: "#2636ee",
                      "&:hover": {
                        bgcolor: "#212ec5", // indigo-700 for hover
                      },
                      textTransform: "capitalize",
                      fontSize: "15px",
                    }}
                    onClick={() => handleViewClick(project)}
                    startIcon={<Eye className="h-5 w-5" />}
                  >
                    View
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for Project Details */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedProject?.projectName}</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client Name"
                  defaultValue={selectedProject.clientName}
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client Email"
                  defaultValue={selectedProject.clientEmail}
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Service Type"
                  defaultValue={selectedProject.serviceType.join(", ")}
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Assigned Developer"
                  defaultValue={selectedProject.assignedDeveloper.username}
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Business Niche"
                  defaultValue={selectedProject.businessNiche}
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Details"
                  defaultValue={selectedProject.projectDetails}
                  fullWidth
                  margin="dense"
                  multiline
                  rows={4}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Reference Site"
                  defaultValue={selectedProject.referenceSite}
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Created By"
                  defaultValue={selectedProject.createdBy}
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Divider and Upsale Data Section */}
              <Grid item xs={12}>
                <Box sx={{ my: 3, borderBottom: 1, borderColor: "divider" }} />
                <Typography variant="h6" gutterBottom>
                  Upsale Information
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Upsale Status: {selectedProject.upSale ? "Yes" : "No"}
                </Typography>

                {selectedProject.upSale &&
                selectedProject.upsaleData?.length > 0 ? (
                  selectedProject.upsaleData.map((upsale, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 3,
                        p: 2,
                        border: 1,
                        borderColor: "grey.300",
                        borderRadius: 1,
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Service Type"
                            defaultValue={upsale.serviceType}
                            fullWidth
                            margin="dense"
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            label="Details"
                            defaultValue={upsale.details}
                            fullWidth
                            margin="dense"
                            multiline
                            rows={2}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Comments"
                            defaultValue={upsale.comments}
                            fullWidth
                            margin="dense"
                            multiline
                            rows={2}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Date"
                            defaultValue={new Date(
                              upsale.date
                            ).toLocaleDateString()}
                            fullWidth
                            margin="dense"
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No upsale data available
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chat-like Updates Modal */}
      <Dialog
        open={isChatOpen}
        onClose={handleCloseChat}
        maxWidth="sm"
        fullWidth
        fullScreen={window.innerWidth < 600}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              height: "80vh",
              maxHeight: "800px",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <DialogTitle>
          Updates for {selectedProject?.projectName}
          <Button
            onClick={handleCloseChat}
            color="primary"
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            Close
          </Button>
        </DialogTitle>
        <DialogContent sx={{ flex: 1, overflow: "auto", p: 0 }}>
          {isLoadingUpdates ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : updates.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Typography variant="body1" color="textSecondary">
                No updates yet. Add the first one!
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {updates.map((update) => (
                <ListItem key={update._id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: stringToColor(update.createdBy?.username),
                      }}
                    >
                      {(update.createdBy?.username || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={update.createdBy?.username || "Unknown"}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {update.text}
                        </Typography>
                        <br />
                        {update.createdAt &&
                          format(
                            new Date(update.createdAt),
                            "MMM dd, yyyy hh:mm a"
                          )}
                      </>
                    }
                  />
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          )}
        </DialogContent>
        <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your update..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendUpdate()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={handleSendUpdate}
                    disabled={!message.trim()}
                  >
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default OneTime;

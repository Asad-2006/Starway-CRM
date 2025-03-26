import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Dialog as MUIDialog,
  DialogActions as MUIDialogActions,
  DialogContent as MUIDialogContent,
  DialogContentText as MUIDialogContentText,
  DialogTitle as MUIDialogTitle,
  Tooltip,
  IconButton,
  Pagination,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Drawer,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  Delete,
  Visibility,
  Search,
  Add,
  Edit,
  FilterList,
  Close as CloseIcon,
} from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FolderIcon from "@mui/icons-material/Folder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

const MobileProjectCard = ({
  project,
  onView,
  onDelete,
  onToggleUpSale,
  onUpsaleInfo,
  onStatusChange,
}) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FolderIcon className="text-[#ffbf00]" sx={{ fontSize: 40 }} />
            <Typography variant="h6" noWrap>
              {project.projectName}
            </Typography>
          </Box>

          <Typography variant="body2">
            Assigned: {project.assignedDeveloper.username}
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
            Service: {project.serviceType.join(", ")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2">Status:</Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={project.status}
                onChange={(e) => onStatusChange(project._id, e.target.value)}
                variant="outlined"
              >
                <MenuItem value="Active">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon sx={{ color: "green", fontSize: 20 }} />
                    <Typography variant="body2">Active</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="Closed">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CancelIcon sx={{ color: "red", fontSize: 20 }} />
                    <Typography variant="body2">Closed</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Up-Sale</Typography>
              <Switch
                checked={project.upSale}
                onChange={() => onToggleUpSale(project._id, project.upSale)}
                size="small"
              />
            </Box>
            {project.upSale && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                onClick={() => onUpsaleInfo(project._id)}
              >
                Add Info
              </Button>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Visibility />}
              onClick={() => onView(project)}
            >
              View
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Delete />}
              onClick={() => onDelete(project._id)}
            >
              Delete
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const FilterDrawer = ({
  open,
  onClose,
  subscriptionFilter,
  createdByFilter,
  assignedToFilter,
  serviceTypeFilter,
  onSubscriptionChange,
  onCreatedByChange,
  onAssignedToChange,
  onServiceTypeChange,
  subscriptionTypes,
  createdByValues,
  assignedToValues,
  serviceTypeValues,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: "80%", maxWidth: 360, p: 2 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Stack spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Subscription</InputLabel>
          <Select
            value={subscriptionFilter}
            label="Subscription"
            onChange={onSubscriptionChange}
          >
            <MenuItem value="">All</MenuItem>
            {subscriptionTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Created By</InputLabel>
          <Select
            value={createdByFilter}
            label="Created By"
            onChange={onCreatedByChange}
          >
            <MenuItem value="">All</MenuItem>
            {createdByValues.map((creator) => (
              <MenuItem key={creator} value={creator}>
                {creator}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Assigned To</InputLabel>
          <Select
            value={assignedToFilter}
            label="Assigned To"
            onChange={onAssignedToChange}
          >
            <MenuItem value="">All</MenuItem>
            {assignedToValues.map((assignedTo) => (
              <MenuItem key={assignedTo} value={assignedTo}>
                {assignedTo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Service Type</InputLabel>
          <Select
            value={serviceTypeFilter}
            label="Service Type"
            onChange={onServiceTypeChange}
          >
            <MenuItem value="">All</MenuItem>
            {serviceTypeValues.map((serviceType) => (
              <MenuItem key={serviceType} value={serviceType}>
                {serviceType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Drawer>
  );
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [createdByFilter, setCreatedByFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState(null);
  const [upsaleDialogOpen, setUpsaleDialogOpen] = useState(false);
  const [upsaleData, setUpsaleData] = useState({
    serviceType: "",
    amount: "",
    details: "",
    comments: "",
  });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [editUpsaleDialogOpen, setEditUpsaleDialogOpen] = useState(false);
  const [selectedUpsaleId, setSelectedUpsaleId] = useState(null);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [editProjectData, setEditProjectData] = useState({
    projectName: "",
    clientName: "",
    clientEmail: "",
    clientNumber: "",
    amount: "",
    assignedDeveloper: "",
    serviceType: [],
    referenceSite: "",
    businessNiche: "",
    projectDetails: "",
    comments: "",
    subscriptionType: "",
    createdBy: "",
  });
  const [serviceTypes, setServiceTypes] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const projectsPerPage = 5;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [updates, setUpdates] = useState([]);
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/api/auth/developers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDevelopers(response.data);
      } catch (error) {
        console.error("Failed to fetch developers:", error);
      }
    };

    fetchDevelopers();
  }, []);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/api/servicetypes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServiceTypes(response.data.map((st) => st.name));
      } catch (error) {
        console.error("Failed to fetch service types:", error);
      }
    };

    fetchServiceTypes();
  }, []);

  const handleEditProjectClick = (project) => {
    setEditProjectData(project);
    setEditProjectDialogOpen(true);
  };

  const handleEditProjectDialogClose = () => {
    setEditProjectDialogOpen(false);
    setEditProjectData({
      projectName: "",
      clientName: "",
      clientEmail: "",
      clientNumber: "",
      amount: "",
      assignedDeveloper: "",
      serviceType: [],
      referenceSite: "",
      businessNiche: "",
      projectDetails: "",
      comments: "",
      subscriptionType: "",
      createdBy: "",
    });
  };

  const handleEditProjectSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.put(
        `${API_BASE}/api/newproject/projects/${selectedProject._id}`,
        editProjectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Project data updated:", response.data);
      fetchProjects();
      handleEditProjectDialogClose();
      setSnackbarMessage("Project updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating project data:", error);
      setSnackbarMessage("Failed to update project.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/newproject/projects`);
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewClick = (project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
  };

  const handleSubscriptionFilterChange = (event) => {
    setSubscriptionFilter(event.target.value);
  };

  const handleCreatedByFilterChange = (event) => {
    setCreatedByFilter(event.target.value);
  };

  const handleAssignedToFilterChange = (event) => {
    setAssignedToFilter(event.target.value);
  };

  const handleServiceTypeFilterChange = (event) => {
    setServiceTypeFilter(event.target.value);
  };

  const filteredProjects = Array.isArray(projects)
    ? projects.filter((project) => {
        const searchMatch = project.projectName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const subscriptionMatch = subscriptionFilter
          ? project.subscriptionType === subscriptionFilter
          : true;
        const createdByMatch = createdByFilter
          ? project.createdBy === createdByFilter
          : true;
        const assignedToMatch = assignedToFilter
          ? project.assignedDeveloper.username === assignedToFilter
          : true;
        const serviceTypeMatch = serviceTypeFilter
          ? project.serviceType.includes(serviceTypeFilter)
          : true;
        return (
          searchMatch &&
          subscriptionMatch &&
          createdByMatch &&
          assignedToMatch &&
          serviceTypeMatch
        );
      })
    : [];

  const handleDeleteClick = (projectId) => {
    setProjectToDeleteId(projectId);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE}/api/newproject/projects/${projectToDeleteId}`
      );
      fetchProjects();
      setSnackbarMessage("Project deleted successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error deleting project:", error);
      setSnackbarMessage("Failed to delete project.");
      setSnackbarSeverity("error");
    } finally {
      setDeleteConfirmationOpen(false);
      setProjectToDeleteId(null);
      setSnackbarOpen(true);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setProjectToDeleteId(null);
  };

  const subscriptionTypes = [
    ...new Set(projects.map((project) => project.subscriptionType)),
  ];
  const createdByValues = [
    ...new Set(projects.map((project) => project.createdBy)),
  ];
  const assignedToValues = [
    ...new Set(projects.map((project) => project.assignedDeveloper.username)),
  ];
  const serviceTypeValues = [
    ...new Set(
      projects.reduce((acc, project) => {
        return acc.concat(project.serviceType);
      }, [])
    ),
  ];

  const handleToggleUpSale = async (projectId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, upSale: newStatus }
            : project
        )
      );

      await axios.put(
        `${API_BASE}/api/newproject/projects/${projectId}/up-sale`,
        { upSale: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating up-sale status:", error);
    }
  };

  const handleUpsaleDialogOpen = (projectId) => {
    setSelectedProjectId(projectId);
    setUpsaleDialogOpen(true);
  };

  const handleUpsaleDialogClose = () => {
    setUpsaleDialogOpen(false);
    setUpsaleData({
      serviceType: "",
      amount: "",
      details: "",
      comments: "",
    });
  };

  const handleUpsaleDataChange = (event) => {
    const { name, value } = event.target;
    setUpsaleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpsaleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${API_BASE}/api/newproject/projects/${selectedProjectId}/upsale`,
        upsaleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProjects();
      handleUpsaleDialogClose();
      setSnackbarMessage("Upsale info added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding upsale data:", error);
      setSnackbarMessage("Failed to add upsale info.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEditUpsaleClick = (projectId, upsaleId, upsale) => {
    setSelectedProjectId(projectId);
    setSelectedUpsaleId(upsaleId);
    setUpsaleData(upsale);
    setEditUpsaleDialogOpen(true);
  };

  const handleEditUpsaleDialogClose = () => {
    setEditUpsaleDialogOpen(false);
    setUpsaleData({
      serviceType: "",
      amount: "",
      details: "",
      comments: "",
    });
  };

  const handleEditUpsaleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.put(
        `${API_BASE}/api/newproject/projects/${selectedProjectId}/upsale/${selectedUpsaleId}`,
        upsaleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProjects();
      handleEditUpsaleDialogClose();
    } catch (error) {
      console.error("Error updating upsale data:", error);
    }
  };

  const handleServiceTypeChange = (event) => {
    const { value } = event.target;
    setEditProjectData({
      ...editProjectData,
      serviceType: value,
    });
  };

  const handleStatusChange = async (projectId, status) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.put(
        `${API_BASE}/api/newproject/projects/${projectId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedProject = response.data.updatedProject;
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        )
      );
    } catch (error) {
      console.error("Error updating project status:", error.message);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  };

  const indexOfLastProject = page * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  //handleUpdateClick functio
  const handleUpdateClick = async (project) => {
    setSelectedProject(project);
    setIsChatOpen(true);
    setIsLoadingUpdates(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE}/api/newproject/projects/${project._id}/updates`,
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500,
        }
      );

      // Transform to ensure consistent structure
      const safeUpdates = (response.data || []).map((update) => ({
        ...update,
        _id: update._id || Math.random().toString(),
        createdAt: update.createdAt ? new Date(update.createdAt) : new Date(),
        createdBy: {
          id: update.createdBy?.id || "unknown",
          username: update.createdBy?.username || "Unknown",
        },
      }));

      setUpdates(safeUpdates);
    } catch (error) {
      console.error("Update fetch error:", error);
      setUpdates([]);
      setSnackbarMessage(
        error.response?.status === 403
          ? "You don't have permission to view updates"
          : "Failed to load updates"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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

    // Optimistic update
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

      // Refresh updates
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
      setSnackbarMessage(
        error.response?.data?.message ||
          "Failed to send update. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
    <Box className="px-18" sx={{ width: "100%", p: { xs: 1, sm: 2 } }}>
      {/*filters */}
      <Grid container className="sm:pl-25" spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={isMobile ? 9 : 6} md={3}>
          <TextField
            fullWidth
            placeholder="Search projects..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </Grid>

        {isMobile ? (
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setFilterDrawerOpen(true)}
              sx={{ height: "100%" }}
            >
              <FilterList />
            </Button>
          </Grid>
        ) : (
          <>
            <Grid item sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Subscription</InputLabel>
                <Select
                  value={subscriptionFilter}
                  label="Subscription"
                  onChange={handleSubscriptionFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {subscriptionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Created By</InputLabel>
                <Select
                  value={createdByFilter}
                  label="Created By"
                  onChange={handleCreatedByFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {createdByValues.map((creator) => (
                    <MenuItem key={creator} value={creator}>
                      {creator}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={assignedToFilter}
                  label="Assigned To"
                  onChange={handleAssignedToFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {assignedToValues.map((assignedTo) => (
                    <MenuItem key={assignedTo} value={assignedTo}>
                      {assignedTo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={serviceTypeFilter}
                  label="Service Type"
                  onChange={handleServiceTypeFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {serviceTypeValues.map((serviceType) => (
                    <MenuItem key={serviceType} value={serviceType}>
                      {serviceType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
      </Grid>

      {/* projects card  */}
      {currentProjects.map((project) =>
        isMobile ? (
          <MobileProjectCard
            key={project._id}
            project={project}
            onView={handleViewClick}
            onDelete={handleDeleteClick}
            onToggleUpSale={handleToggleUpSale}
            onUpsaleInfo={handleUpsaleDialogOpen}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <Card
            key={project._id}
            sx={{ marginBottom: 4, marginLeft: 9, marginRight: 9 }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FolderIcon
                  className="text-[#ffbf00]"
                  sx={{ marginRight: 4, fontSize: 80 }}
                />
                <Box>
                  <Typography className="pb-1" variant="h6">
                    {project.projectName}
                  </Typography>
                  <Typography variant="body2">
                    Assigned to: {project.assignedDeveloper.username}
                  </Typography>
                  <Typography variant="body2">
                    Service Type: {project.serviceType.join(", ")}
                  </Typography>
                  <Typography variant="body2">
                    Created By: {project.createdBy}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Switch
                  checked={project.upSale}
                  onChange={() =>
                    handleToggleUpSale(project._id, project.upSale)
                  }
                  color="primary"
                />
                <Typography sx={{ marginRight: 2 }}>Up-Sale</Typography>

                {project.upSale && (
                  <Button
                    variant="outlined"
                    color="#fff"
                    startIcon={<Add />}
                    sx={{
                      mr: 2,
                      border: "1px solid #ccc",
                      fontSize: 13,
                      fontWeight: "500",
                    }}
                    onClick={() => handleUpsaleDialogOpen(project._id)}
                  >
                    Add Info
                  </Button>
                )}

                <Box
                  sx={{
                    minWidth: 150,
                    padding: "8px 16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    textAlign: "center",
                    marginRight: 2,
                  }}
                >
                  <Typography variant="body2">
                    {project.subscriptionType}
                  </Typography>
                </Box>

                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ width: "150px", marginRight: 2 }}
                >
                  <Select
                    value={project.status}
                    onChange={(e) =>
                      handleStatusChange(project._id, e.target.value)
                    }
                    renderValue={(selected) => (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {selected === "Active" ? (
                          <>
                            <CheckCircleIcon sx={{ color: "green" }} />
                            <Typography>Active</Typography>
                          </>
                        ) : (
                          <>
                            <CancelIcon sx={{ color: "red" }} />
                            <Typography>Closed</Typography>
                          </>
                        )}
                      </Box>
                    )}
                  >
                    <MenuItem value="Active">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CheckCircleIcon sx={{ color: "green" }} />
                        <Typography>Active</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="Closed">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CancelIcon sx={{ color: "red" }} />
                        <Typography>Closed</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                <Tooltip title="Project Updates">
                  <IconButton
                    sx={{
                      color: "#2636ee",
                      "&:hover": {
                        color: "#212ec5", // indigo-700 for hover
                      },
                    }}
                    onClick={() => handleUpdateClick(project)}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="View">
                  <IconButton
                    className="ml-3"
                    sx={{
                      color: "#2636ee",
                      "&:hover": {
                        color: "#212ec5", // indigo-700 for hover
                      },
                    }}
                    onClick={() => handleViewClick(project)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(project._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        )
      )}

      {/* pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredProjects.length / projectsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size={isMobile ? "small" : "medium"}
        />
      </Box>

      {/* drawer opens with the filter icon  */}
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        subscriptionFilter={subscriptionFilter}
        createdByFilter={createdByFilter}
        assignedToFilter={assignedToFilter}
        serviceTypeFilter={serviceTypeFilter}
        onSubscriptionChange={handleSubscriptionFilterChange}
        onCreatedByChange={handleCreatedByFilterChange}
        onAssignedToChange={handleAssignedToFilterChange}
        onServiceTypeChange={handleServiceTypeFilterChange}
        subscriptionTypes={subscriptionTypes}
        createdByValues={createdByValues}
        assignedToValues={assignedToValues}
        serviceTypeValues={serviceTypeValues}
      />

      {/* popup modal for project details */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: { xs: "95%", sm: "80%", md: "900px" },
            m: { xs: 1, sm: 2 },
          },
        }}
      >
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Box sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: { xs: 1, sm: 2 },
                  marginBottom: 2,
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  Project Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Project Name"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.projectName}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Client"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.clientName}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Client Email"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.clientEmail}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Client Number"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.clientNumber}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Amount"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.amount}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Assigned Developer"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.assignedDeveloper.username}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Service Type"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.serviceType.join(", ")}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Reference Site"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.referenceSite}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Business Niche"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.businessNiche}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Details"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={selectedProject.projectDetails}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Comments"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={selectedProject.comments}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Subscription Type"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.subscriptionType}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Created By"
                      variant="outlined"
                      fullWidth
                      value={selectedProject.createdBy}
                      InputProps={{ readOnly: true }}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => handleEditProjectClick(selectedProject)}
                  sx={{ mt: 2 }}
                >
                  Edit
                </Button>
              </Box>

              {selectedProject.upsaleData &&
                selectedProject.upsaleData.length > 0 && (
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: { xs: 1, sm: 2 },
                      marginBottom: 2,
                      marginTop: { xs: 2, sm: 4 },
                    }}
                  >
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                      Upsale Information
                    </Typography>
                    {selectedProject.upsaleData.map((upsale, index) => (
                      <Box key={index} sx={{ marginBottom: 4 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ marginBottom: 2 }}
                        >
                          Upsale {index + 1}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Service Type"
                              variant="outlined"
                              fullWidth
                              value={upsale.serviceType}
                              InputProps={{ readOnly: true }}
                              sx={{ marginBottom: 2 }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Amount"
                              variant="outlined"
                              fullWidth
                              value={upsale.amount}
                              InputProps={{ readOnly: true }}
                              sx={{ marginBottom: 2 }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Details"
                              variant="outlined"
                              fullWidth
                              value={upsale.details}
                              InputProps={{ readOnly: true }}
                              sx={{ marginBottom: 2 }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Comments"
                              variant="outlined"
                              fullWidth
                              value={upsale.comments}
                              InputProps={{ readOnly: true }}
                              sx={{ marginBottom: 2 }}
                            />
                          </Grid>
                        </Grid>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Edit />}
                          onClick={() =>
                            handleEditUpsaleClick(
                              selectedProject._id,
                              upsale._id,
                              upsale
                            )
                          }
                          sx={{ mt: 1 }}
                        >
                          Edit
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* add upsale data  */}
      <Dialog
        open={upsaleDialogOpen}
        onClose={handleUpsaleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Upsale Info</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Upsale Service Type"
                name="serviceType"
                value={upsaleData.serviceType}
                onChange={handleUpsaleDataChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Upsale Amount"
                name="amount"
                value={upsaleData.amount}
                onChange={handleUpsaleDataChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Upsale Details"
                name="details"
                value={upsaleData.details}
                onChange={handleUpsaleDataChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comments"
                name="comments"
                value={upsaleData.comments}
                onChange={handleUpsaleDataChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpsaleDialogClose}>Cancel</Button>
          <Button
            onClick={handleUpsaleSubmit}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* edit  project popup */}
      <Dialog
        open={editProjectDialogOpen}
        onClose={handleEditProjectDialogClose}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: { xs: "95%", sm: "80%", md: "900px" },
            m: { xs: 1, sm: 2 },
          },
        }}
      >
        <DialogTitle>Edit Project Information</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={editProjectData.projectName}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    projectName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Name"
                name="clientName"
                value={editProjectData.clientName}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    clientName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Email"
                name="clientEmail"
                value={editProjectData.clientEmail}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    clientEmail: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Number"
                name="clientNumber"
                value={editProjectData.clientNumber}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    clientNumber: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                value={editProjectData.amount}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    amount: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assigned Developer</InputLabel>
                <Select
                  label="Assigned Developer"
                  value={editProjectData.assignedDeveloper.id || ""}
                  onChange={(e) => {
                    const selectedDeveloper = developers.find(
                      (dev) => dev._id === e.target.value
                    );
                    setEditProjectData({
                      ...editProjectData,
                      assignedDeveloper: {
                        id: selectedDeveloper._id,
                        username: selectedDeveloper.username,
                      },
                    });
                  }}
                >
                  {developers.map((dev) => (
                    <MenuItem key={dev._id} value={dev._id}>
                      {dev.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  multiple
                  label="Service Type"
                  name="serviceType"
                  value={editProjectData.serviceType}
                  onChange={handleServiceTypeChange}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {serviceTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reference Site"
                name="referenceSite"
                value={editProjectData.referenceSite}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    referenceSite: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Niche"
                name="businessNiche"
                value={editProjectData.businessNiche}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    businessNiche: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Details"
                name="projectDetails"
                value={editProjectData.projectDetails}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    projectDetails: e.target.value,
                  })
                }
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comments"
                name="comments"
                value={editProjectData.comments}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    comments: e.target.value,
                  })
                }
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subscription Type</InputLabel>
                <Select
                  label="Subscription Type"
                  name="subscriptionType"
                  value={editProjectData.subscriptionType}
                  onChange={(e) =>
                    setEditProjectData({
                      ...editProjectData,
                      subscriptionType: e.target.value,
                    })
                  }
                >
                  <MenuItem value="Subscription-Based">
                    Subscription-Based
                  </MenuItem>
                  <MenuItem value="One-Time">One-Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Created By"
                name="createdBy"
                value={editProjectData.createdBy}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditProjectDialogClose}>Cancel</Button>
          <Button
            onClick={handleEditProjectSubmit}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* upsale edit popup*/}
      <Dialog
        open={editUpsaleDialogOpen}
        onClose={handleEditUpsaleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Upsale Information</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Type"
                name="serviceType"
                value={upsaleData.serviceType}
                onChange={(e) =>
                  setUpsaleData({ ...upsaleData, serviceType: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                value={upsaleData.amount}
                onChange={(e) =>
                  setUpsaleData({ ...upsaleData, amount: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Details"
                name="details"
                value={upsaleData.details}
                onChange={(e) =>
                  setUpsaleData({ ...upsaleData, details: e.target.value })
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comments"
                name="comments"
                value={upsaleData.comments}
                onChange={(e) =>
                  setUpsaleData({ ...upsaleData, comments: e.target.value })
                }
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditUpsaleDialogClose}>Cancel</Button>
          <Button
            onClick={handleEditUpsaleSubmit}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chat-like Updates Modal */}
      <Dialog
        open={isChatOpen}
        onClose={handleCloseChat}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
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
              <Typography>No updates yet. Be the first to add one!</Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {updates.map((update) => {
                return (
                  <ListItem
                    key={update._id || update.createdAt}
                    alignItems="flex-start"
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: stringToColor(update.createdBy.username),
                        }}
                      >
                        {update.createdBy.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={update.createdBy.username}
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
                          {format(
                            new Date(update.createdAt),
                            "MMM dd, yyyy hh:mm a"
                          )}
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
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

      {/* delete confirm popup  */}
      <MUIDialog
        open={deleteConfirmationOpen}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <MUIDialogTitle id="alert-dialog-title">Confirm Delete</MUIDialogTitle>
        <MUIDialogContent>
          <MUIDialogContentText id="alert-dialog-description">
            Are you sure you want to delete this project?
          </MUIDialogContentText>
        </MUIDialogContent>
        <MUIDialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </MUIDialogActions>
      </MUIDialog>

      {/* snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectList;

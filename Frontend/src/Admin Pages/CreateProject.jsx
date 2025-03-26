import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { ListChecks, X } from "lucide-react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";

// Swiper js imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
    },
    gray: {
      main: "#4b5563",
    },
    background: {
      default: "#f3f4f6",
    },
  },
});

const StyledToggleButton = styled(ToggleButton)(({ theme, selected }) => ({
  "&.MuiToggleButton-root": {
    border: "1px solid #6366f1",
    borderRadius: "4px",
    margin: theme.spacing(0.5),
    color: "#6366f1",
    minWidth: "150px",
    "&.Mui-selected": {
      backgroundColor: "#4a55a3",
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: "#343e7a",
      },
    },
    "&:hover": {
      backgroundColor: "#d1d5db",
    },
  },
}));

function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [assignedDeveloper, setAssignedDeveloper] = useState({
    id: "",
    username: "",
  });
  const [serviceType, setServiceType] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [referenceSite, setReferenceSite] = useState("");
  const [businessNiche, setBusinessNiche] = useState("");
  const [comments, setComments] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState("One-Time");
  const [newServiceType, setNewServiceType] = useState("");
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [serviceTypeToDelete, setServiceTypeToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
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
      createdDate: new Date(),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.post(
        `${API_BASE}/api/newproject/projects`,
        projectData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        console.log("Project created successfully:");
        setProjectName("");
        setProjectDetails("");
        setClientName("");
        setClientEmail("");
        setClientNumber("");
        setAmount("");
        setAssignedDeveloper("");
        setServiceType([]);
        setReferenceSite("");
        setBusinessNiche("");
        setComments("");
        setSubscriptionType("One-Time");

        setSnackbarMessage("Project created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        console.error("Failed to create project:");
        setSnackbarMessage("Failed to create project.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleServiceTypeChange = (event, newServiceType) => {
    if (newServiceType) {
      setServiceType(newServiceType);
    } else {
      setServiceType([]);
    }
  };

  const handleCreateServiceType = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE}/api/servicetypes`,
        { name: newServiceType },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setServiceTypes([...serviceTypes, newServiceType]);
        setNewServiceType("");
      }
    } catch (error) {
      console.error("Failed to create service type:", error);
    }
  };

  const handleDeleteServiceType = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE}/api/servicetypes/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setServiceTypes(serviceTypes.filter((st) => st !== type));
      }
    } catch (error) {
      console.error("Failed to delete service type:", error);
    }
  };

  const handleDeleteClick = (type) => {
    setServiceTypeToDelete(type);
    setDeletePopupOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (serviceTypeToDelete) {
      handleDeleteServiceType(serviceTypeToDelete);
      setDeletePopupOpen(false);
      setServiceTypeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeletePopupOpen(false);
    setServiceTypeToDelete(null);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // const developers = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown"];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-8xl"
        >
          {/* <Typography
            variant="h4"
            component="h2"
            align="center"
            mb={3}
            color="primary"
          >
            Create New Project
          </Typography> */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Project Name"
                variant="outlined"
                fullWidth
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Client Name"
                variant="outlined"
                fullWidth
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Client Email"
                variant="outlined"
                fullWidth
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Client Number"
                variant="outlined"
                fullWidth
                value={clientNumber}
                onChange={(e) => setClientNumber(e.target.value)}
                required
                InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Project Details"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Enter Service Type"
                variant="outlined"
                fullWidth
                value={newServiceType}
                onChange={(e) => setNewServiceType(e.target.value)}
                InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2636ee",
                  "&:hover": {
                    bgcolor: "#212ec5",
                  },
                }}
                onClick={handleCreateServiceType}
                style={{ marginTop: "10px" }}
              >
                Add Service Type
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography component="legend">Service Type</Typography>
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={0}
                modules={[Navigation]}
                style={{ padding: "8px 0" }}
              >
                {serviceTypes.map((type) => (
                  <SwiperSlide key={type} style={{ width: "220px" }}>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <StyledToggleButton
                        value={type}
                        selected={serviceType.includes(type)}
                        onChange={() => {
                          const newSelection = serviceType.includes(type)
                            ? serviceType.filter((t) => t !== type)
                            : [...serviceType, type];
                          setServiceType(newSelection);
                        }}
                        style={{
                          width: "100%",
                          paddingRight: "24px",
                          position: "relative",
                        }}
                      >
                        {type}
                      </StyledToggleButton>
                      <IconButton
                        size="small"
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: 4,
                          transform: "translateY(-50%)",
                          color: "red",
                          zIndex: 2,
                        }}
                        onClick={() => handleDeleteClick(type)}
                      >
                        <X size={16} />
                      </IconButton>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Reference Site"
                variant="outlined"
                fullWidth
                value={referenceSite}
                onChange={(e) => setReferenceSite(e.target.value)}
                InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Business Niche"
                variant="outlined"
                fullWidth
                value={businessNiche}
                onChange={(e) => setBusinessNiche(e.target.value)}
                InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel style={{ color: "#4b5563" }}>
                  Assign a Developer
                </InputLabel>
                <Select
                  value={assignedDeveloper.username}
                  onChange={(e) => {
                    const selectedDev = developers.find(
                      (dev) => dev.username === e.target.value
                    );
                    setAssignedDeveloper({
                      id: selectedDev._id,
                      username: selectedDev.username,
                    });
                  }}
                  displayEmpty
                  style={{ color: "#4b5563", backgroundColor: "#f3f4f6" }}
                >
                  {developers.map((dev) => (
                    <MenuItem
                      key={dev._id}
                      value={dev.username}
                      style={{ color: "#4b5563" }}
                    >
                      {dev.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel style={{ color: "#4b5563" }}>
                  Subscription Type
                </InputLabel>
                <Select
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}
                  displayEmpty
                  style={{ color: "#4b5563", backgroundColor: "#f3f4f6" }}
                >
                  <MenuItem value="One-Time">One-Time</MenuItem>
                  <MenuItem value="Subscription-Based">
                    Subscription-Based
                  </MenuItem>
                  <MenuItem value="Website-Based">Website-Based</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Comments"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#2636ee",
                  "&:hover": {
                    bgcolor: "#212ec5",
                  },
                }}
                size="large"
              >
                <ListChecks className="mr-2" size={20} />
                Create Project
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* popup modal for deleting  */}
        <Dialog
          open={deletePopupOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Do you want to delete the "{serviceTypeToDelete}" service?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
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
      </div>
    </ThemeProvider>
  );
}

export default CreateProject;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Search } from "lucide-react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WebIcon from "@mui/icons-material/Web";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import NoteIcon from "@mui/icons-material/Note";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

function ClosedLeads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const leadsPerPage = 10;
  const [selectedLead, setSelectedLead] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editedLead, setEditedLead] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [assignedByFilter, setAssignedByFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [assignedByUsers, setAssignedByUsers] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    const fetchClosedLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const leadsResponse = await axios.get(
          `${API_BASE}/api/leads/all-assigned`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        let closedLeads = leadsResponse.data.filter(
          (lead) => lead.status === "closed"
        );

        const assignedToUsers = [
          ...new Set(
            closedLeads.map((lead) => lead.assignedTo?.username).filter(Boolean)
          ),
        ];
        setAssignedUsers(assignedToUsers);

        const assignedByUsers = [
          ...new Set(
            closedLeads.map((lead) => lead.assignedBy?.username).filter(Boolean)
          ),
        ];
        setAssignedByUsers(assignedByUsers);

        closedLeads = closedLeads.sort(
          (a, b) => new Date(b.closedAt) - new Date(a.closedAt)
        );

        setLeads(closedLeads);
        setFilteredLeads(closedLeads);
      } catch (error) {
        console.error("Error fetching closed leads:", error);
        setError("Failed to fetch closed leads. Please try again later.");
      }
    };

    const fetchServiceTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/api/servicetypes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServiceTypes(response.data);
      } catch (error) {
        console.error("Error fetching service types:", error);
        setError("Failed to fetch service types.");
      } finally {
        setLoading(false);
      }
    };

    fetchClosedLeads();
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    let filtered = leads;

    if (selectedDate) {
      const formattedSelectedDate = new Date(selectedDate)
        .toISOString()
        .split("T")[0];
      filtered = filtered.filter((lead) => {
        if (!lead.closedAt) return false;
        const closedAtDate = new Date(lead.closedAt)
          .toISOString()
          .split("T")[0];
        return closedAtDate === formattedSelectedDate;
      });
    }

    if (assignedToFilter) {
      filtered = filtered.filter(
        (lead) => lead.assignedTo?.username === assignedToFilter
      );
    }

    if (assignedByFilter) {
      filtered = filtered.filter(
        (lead) => lead.assignedBy?.username === assignedByFilter
      );
    }

    if (serviceTypeFilter) {
      console.log("Service Type Filter:", serviceTypeFilter);
      filtered = filtered.filter((lead) => {
        console.log("Lead Packages:", lead.packages);
        return lead.packages.includes(serviceTypeFilter);
      });
    }

    if (searchQuery) {
      filtered = filtered.filter((lead) =>
        lead.leadName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.sort(
      (a, b) => new Date(b.closedAt) - new Date(a.closedAt)
    );
    setFilteredLeads(filtered);
    setPage(1);
  }, [
    selectedDate,
    assignedToFilter,
    assignedByFilter,
    serviceTypeFilter,
    leads,
    searchQuery,
  ]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const indexOfLastLead = page * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handleViewClick = (lead) => {
    setSelectedLead(lead);
    setEditedLead({ ...lead });
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedLead(null);
    setEditedLead(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedLead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE}/api/leads/${selectedLead._id}`,
        editedLead,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let updatedLeads = leads.map((lead) =>
        lead._id === selectedLead._id ? response.data : lead
      );
      updatedLeads = updatedLeads.sort(
        (a, b) => new Date(b.closedAt) - new Date(a.closedAt)
      );
      setLeads(updatedLeads);

      let updatedFilteredLeads = filteredLeads.map((lead) =>
        lead._id === selectedLead._id ? response.data : lead
      );
      updatedFilteredLeads = updatedFilteredLeads.sort(
        (a, b) => new Date(b.closedAt) - new Date(a.closedAt)
      );
      setFilteredLeads(updatedFilteredLeads);

      handleClosePopup();
    } catch (error) {
      console.error("Error updating lead:", error);
      setError("Failed to update lead. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div className="container sm:px-18 py-6">
      <TextField
        fullWidth
        placeholder="Search Leads"
        variant="outlined"
        sx={{ mb: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
        value={searchQuery}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {/* filter */}
      <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            type="date"
            label="Filter by Date"
            variant="outlined"
            sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl
            fullWidth
            sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
          >
            <InputLabel id="assigned-to-filter-label">Assigned To</InputLabel>
            <Select
              labelId="assigned-to-filter-label"
              id="assigned-to-filter"
              value={assignedToFilter}
              onChange={(e) => setAssignedToFilter(e.target.value)}
              label="Assigned To"
            >
              <MenuItem value="">All</MenuItem>
              {assignedUsers.map((user) => (
                <MenuItem key={user} value={user}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl
            fullWidth
            sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
          >
            <InputLabel id="assigned-by-filter-label">Assigned By</InputLabel>
            <Select
              labelId="assigned-by-filter-label"
              id="assigned-by-filter"
              value={assignedByFilter}
              onChange={(e) => setAssignedByFilter(e.target.value)}
              label="Assigned By"
            >
              <MenuItem value="">All</MenuItem>
              {assignedByUsers.map((user) => (
                <MenuItem key={user} value={user}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl
            fullWidth
            sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
          >
            <InputLabel id="service-type-filter-label">Service Type</InputLabel>
            <Select
              labelId="service-type-filter-label"
              id="service-type-filter"
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              label="Service Type"
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

      {/* cards , lead card */}
      {currentLeads.length > 0 ? (
        currentLeads.map((lead, index) => (
          <Card
            key={index}
            className="mb-4 rounded-md shadow-md hover:shadow-lg transition duration-300"
            sx={{
              ...(index % 2 === 0 && {
                width: { xs: "100%", sm: "auto" },
                maxWidth: { xs: "100%", sm: "none" },
                height: { xs: "auto", sm: "auto" },
                aspectRatio: { xs: "unset", sm: "unset" },
                paddingX: { xs: 2, sm: 0 },
              }),
            }}
          >
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar className="w-30 h-30 text-xl font-bold bg-blue-500 text-white">
                        {lead.leadName?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          variant="h6"
                          className="text-lg font-semibold text-gray-800"
                        >
                          {lead.leadName}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          Email: {lead.email}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          Phone: {lead.phoneNumber}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          Location: {lead.country}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#2636ee",
                        "&:hover": {
                          bgcolor: "#212ec5",
                        },
                      }}
                      onClick={() => handleViewClick(lead)}
                    >
                      View
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography
                        variant="body2"
                        className="text-gray-700 py-1 flex items-center"
                      >
                        Assigned To -{" "}
                        {lead.assignedTo?.username || "Unassigned"}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-gray-700 flex items-center"
                      >
                        Created At: {new Date(lead.createdAt).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-gray-700 flex items-center"
                      >
                        Closed At:{" "}
                        {lead.closedAt
                          ? new Date(lead.closedAt).toLocaleString()
                          : "Not Closed"}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-gray-700 py-1 flex items-center"
                      >
                        Assigned By - {lead.assignedBy?.username || "Unknown"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" align="center">
          No closed leads found.
        </Typography>
      )}

      {/* pagination */}
      <Box display="flex" justifyContent="center" mt={4} className="bg-white">
        <Pagination
          count={Math.ceil(filteredLeads.length / leadsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* popup modal for lead detail */}
      <Dialog
        open={popupOpen}
        onClose={handleClosePopup}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Lead Details
          <IconButton
            aria-label="close"
            onClick={handleClosePopup}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editedLead && (
            <Box p={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Lead Name"
                    name="leadName"
                    fullWidth
                    margin="normal"
                    value={editedLead.leadName || ""}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    margin="normal"
                    value={editedLead.email || ""}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    fullWidth
                    margin="normal"
                    value={editedLead.phoneNumber || ""}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Website"
                    name="website"
                    fullWidth
                    margin="normal"
                    value={editedLead.website || ""}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Designation"
                    name="designation"
                    fullWidth
                    margin="normal"
                    value={editedLead.designation || ""}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Packages"
                    name="packages"
                    fullWidth
                    margin="normal"
                    value={editedLead.packages || ""}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Country"
                    name="country"
                    fullWidth
                    margin="normal"
                    value={editedLead.country || ""}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Lead Type"
                    name="leadType"
                    fullWidth
                    margin="normal"
                    value={editedLead.leadType || ""}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Note"
                    name="note"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={editedLead.note || ""}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Pitched Amount"
                    name="pitchedAmount"
                    fullWidth
                    margin="normal"
                    value={`${editedLead?.currencySymbol || ""} ${
                      editedLead?.pitchedAmount || ""
                    }`}
                    onChange={handleInputChange}
                  />

                  <TextField
                    label="Lead Owner"
                    name="leadOwner"
                    fullWidth
                    margin="normal"
                    value={editedLead.leadOwner || ""}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Status"
                    name="status"
                    fullWidth
                    margin="normal"
                    value={editedLead.status || ""}
                    onChange={handleInputChange}
                  />
                  <Typography variant="body2" className="text-gray-600">
                    Closed At:{" "}
                    {editedLead.closedAt
                      ? new Date(editedLead.closedAt).toLocaleString()
                      : "Not Closed"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ClosedLeads;

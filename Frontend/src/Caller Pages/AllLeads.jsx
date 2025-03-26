import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Modal,
  Avatar,
  IconButton,
  Pagination,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  User2,
  Phone,
  Mail,
  Globe,
  Package,
  Edit,
  Trash2,
  X,
} from "lucide-react";

const AllLeads = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserByLeadId, setSelectedUserByLeadId] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [leadsPerPage, setLeadsPerPage] = useState(5);

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchLeads(), fetchUsers()]);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/leads/all`, {
        headers: { Authorization: "Bearer " + token },
      });

      const leadsData = Array.isArray(response.data)
        ? response.data
        : response.data.leads || [];

      const sortedLeads = leadsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLeads(sortedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      setError("Error fetching leads. Please try again later.");
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        setError("No token found. Please log in.");
        return;
      }

      const response = await axios.get(`${API_BASE}/api/auth/admins-managers`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
      setError("Error fetching users.");
    } finally {
      setUsersLoading(false);
    }
  };

  const assignLead = async (leadId, userId) => {
    try {
      const token = localStorage.getItem("token");
      const assignedAt = new Date().toISOString();
      if (!leadId || !userId || userId === "select") {
        console.error("Lead ID or User ID is missing or invalid!", {
          leadId,
          userId,
        });
        setError("Lead ID or User ID is missing or invalid!");
        return;
      }

      const url = `${API_BASE}/api/leads/assign/${leadId}`;
      const response = await axios.put(
        url,
        { userId, assignedAt },
        { headers: { Authorization: "Bearer " + token } }
      );

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === leadId
            ? { ...response.data, assignedAt: assignedAt }
            : lead
        )
      );
    } catch (error) {
      console.error("Error assigning lead:", error.response?.data || error);
      setError("Error assigning lead.");
    }
  };

  const handleDelete = async () => {
    if (!leadToDelete) {
      console.error("No lead selected for deletion.");
      setError("No lead selected for deletion.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = `${API_BASE}/api/leads/delete/${leadToDelete}`;
      await axios.delete(url, {
        headers: { Authorization: "Bearer " + token },
      });
      setLeads((prev) => prev.filter((lead) => lead._id !== leadToDelete));
      setToastMessage("Lead deleted successfully");
      setToastSeverity("success");
    } catch (error) {
      console.error("Error deleting lead:", error);
      setError("Error deleting lead. Please try again later.");
      setToastMessage("Error deleting lead. Please try again later.");
      setToastSeverity("error");
    } finally {
      setOpenConfirmation(false);
      setLeadToDelete(null);
      setToastOpen(true);
    }
  };

  const handleOpenConfirmation = (leadId, e) => {
    e.stopPropagation();
    setLeadToDelete(leadId);
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
    setLeadToDelete(null);
  };

  const openLeadDetailsModal = (lead, e) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeLeadDetailsModal = () => {
    setSelectedLead(null);
    setIsModalOpen(false);
  };

  const LeadDetailItem = ({ title, value, icon: Icon }) => (
    <div className="flex items-center p-4 rounded-lg bg-gray-50 space-x-2">
      {Icon && <Icon size={20} className="text-gray-500" />}
      <div>
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-gray-900">{value}</p>
      </div>
    </div>
  );

  const getAssignedUserName = (lead) => {
    if (!lead.assignedTo) return "Not Assigned";
    return lead.assignedTo.username || "Unknown User";
  };

  const indexOfLastLead = page * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = useMemo(() => {
    return leads
      .filter((lead) =>
        lead.leadName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(indexOfFirstLead, indexOfLastLead);
  }, [leads, searchTerm, page, leadsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  const MobileLeadCard = ({ lead }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 56,
              height: 56,
              mr: 2,
            }}
          >
            {lead.leadName?.[0]?.toUpperCase() || "?"}
          </Avatar>
          <Box>
            <Typography variant="h6" className="font-semibold">
              {lead.leadName}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="text-sm"
            >
              {lead.email}
            </Typography>
            {lead.assignedTo ? (
              <Typography
                variant="body2"
                sx={{ color: "primary.main", fontWeight: 500, mt: 0.5 }}
                className="text-sm"
              >
                Assigned to: {lead.assignedTo.username}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5 }}
                className="text-sm"
              >
                Not Assigned
              </Typography>
            )}
          </Box>
        </Box>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Assign User</InputLabel>
          <Select
            value={selectedUserByLeadId[lead._id] || "select"}
            onChange={(e) => {
              setSelectedUserByLeadId((prev) => ({
                ...prev,
                [lead._id]: e.target.value,
              }));
            }}
            label="Assign User"
          >
            <MenuItem value="select" disabled>
              Select User
            </MenuItem>
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          onClick={() => assignLead(lead._id, selectedUserByLeadId[lead._id])}
          disabled={
            !selectedUserByLeadId[lead._id] ||
            selectedUserByLeadId[lead._id] === "select"
          }
          sx={{
            mb: 2,
            bgcolor: "#2636ee",
            "&:hover": {
              bgcolor: "#212ec5",
            },
          }}
        >
          Assign Lead
        </Button>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <IconButton
          size="small"
          onClick={(e) => openLeadDetailsModal(lead, e)}
          color="primary"
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => handleOpenConfirmation(lead._id, e)}
          color="error"
          disabled={lead.status === "closed"}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  const DesktopLeadCard = ({ lead }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent>
        <Box className="flex items-start justify-between gap-4">
          <Box className="flex gap-4">
            <Box className="relative h-16 w-16 mr-5 mb-6">
              <Avatar
                sx={{
                  bgcolor: "grey",
                  width: 88,
                  height: 88,
                }}
              >
                {lead.leadName ? lead.leadName[0].toUpperCase() : "?"}
              </Avatar>
            </Box>
            <Box className="space-y-2">
              <Typography variant="h6" className="font-semibold tracking-tight">
                {lead.leadName}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {lead.email}
              </Typography>
              {lead.assignedTo ? (
                <Typography
                  variant="body2"
                  sx={{ color: "primary.main", fontWeight: 500, mt: 0.5 }}
                >
                  Assigned to: {lead.assignedTo.username}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.5 }}
                >
                  Not Assigned
                </Typography>
              )}
            </Box>
          </Box>
          <Box className="flex items-center gap-2 z-10 pt-6">
            <FormControl variant="outlined" size="small">
              <InputLabel id={"assign-user-label-" + lead._id}>
                Assign User
              </InputLabel>
              <Select
                labelId={"assign-user-label-" + lead._id}
                id={"assign-user-" + lead._id}
                value={selectedUserByLeadId[lead._id] || "select"}
                onChange={(e) => {
                  setSelectedUserByLeadId((prev) => ({
                    ...prev,
                    [lead._id]: e.target.value,
                  }));
                }}
                label="Assign User"
              >
                <MenuItem value="select" disabled>
                  Select User
                </MenuItem>
                {usersLoading ? (
                  <MenuItem disabled>Loading Users...</MenuItem>
                ) : users.length === 0 ? (
                  <MenuItem disabled>No users available</MenuItem>
                ) : (
                  users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.username}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() =>
                assignLead(lead._id, selectedUserByLeadId[lead._id])
              }
              sx={{
                bgcolor: "#2636ee",
                "&:hover": {
                  bgcolor: "#212ec5",
                },
                py: 1,
              }}
            >
              Assign Lead
            </Button>

            <IconButton
              onClick={(e) => openLeadDetailsModal(lead, e)}
              aria-label="view"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={(e) => handleOpenConfirmation(lead._id, e)}
              aria-label="delete"
              color="error"
              disabled={lead.status === "closed"}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <Typography variant="h6">Loading leads...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="w-full max-w-9xl mx-auto p-4 md:p-6 space-y-6">
      <Box className="relative">
        <SearchIcon
          style={{
            position: "absolute",
            left: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "grey",
          }}
        />
        <TextField
          fullWidth
          placeholder="Search leads..."
          variant="outlined"
          size="small"
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          sx={{}}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            style: { paddingLeft: "30px" },
          }}
        />
      </Box>

      <Box className="space-y-4">
        {Array.isArray(currentLeads) &&
          currentLeads.map((lead) =>
            isMobile ? (
              <MobileLeadCard key={lead._id} lead={lead} />
            ) : (
              <DesktopLeadCard key={lead._id} lead={lead} />
            )
          )}
      </Box>

      <Stack alignItems="center" mt={3}>
        <Pagination
          count={Math.ceil(leads.length / leadsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
          size={isMobile ? "small" : "medium"}
        />
      </Stack>

      <Modal
        open={isModalOpen && selectedLead !== null}
        onClose={closeLeadDetailsModal}
        aria-labelledby="lead-details-modal"
        aria-describedby="lead-details"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : "80%",
            maxWidth: "800px",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box className="flex items-center justify-between mb-4">
            <Typography
              id="lead-details-modal"
              variant="h6"
              component="h2"
              className="font-semibold"
            >
              Lead Details
            </Typography>
            <IconButton onClick={closeLeadDetailsModal}>
              <X size={24} />
            </IconButton>
          </Box>
          {selectedLead && (
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LeadDetailItem
                title="Lead Name"
                value={selectedLead.leadName}
                icon={User2}
              />
              <LeadDetailItem
                title="Email"
                value={selectedLead.email}
                icon={Mail}
              />
              <LeadDetailItem
                title="Website"
                value={selectedLead.website}
                icon={Globe}
              />
              <LeadDetailItem
                title="Phone"
                value={selectedLead.phoneNumber}
                icon={Phone}
              />
              <LeadDetailItem
                title="Designation"
                value={selectedLead.designation}
              />
              <LeadDetailItem title="Country" value={selectedLead.country} />
              <LeadDetailItem title="Lead Type" value={selectedLead.leadType} />
              <LeadDetailItem
                title="Pitched Amount"
                value={
                  selectedLead.currencySymbol + " " + selectedLead.pitchedAmount
                }
              />
              <LeadDetailItem
                title="Packages"
                value={selectedLead.packages?.join(", ") || "None specified"}
                className="col-span-2"
                icon={Package}
              />
              <LeadDetailItem
                title="Note"
                value={selectedLead.note}
                className="col-span-2"
              />
            </Box>
          )}
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              onClick={closeLeadDetailsModal}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={openConfirmation}
        onClose={handleCloseConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-semibold">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this lead? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllLeads;

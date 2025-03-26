import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Search,
  Visibility,
  Edit,
  Delete,
  Save,
  Close,
  FilterList,
} from "@mui/icons-material";

export default function UserTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    role: "",
    joiningDate: "",
  });
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [leaveNote, setLeaveNote] = useState("");
  const [leaveType, setLeaveType] = useState("full");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = (id) => {
    setOpen(true);
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/auth/users/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== deleteId));
      setOpen(false);
      setDeleteId(null);
      setSnackbarMessage("User deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response?.data || error.message
      );
      setSnackbarMessage("Failed to delete user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleEdit = (user) => {
    setEditMode(user._id);
    setEditData({
      username: user.username,
      email: user.email,
      role: user.role,
      joiningDate: user.joiningDate,
    });
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/auth/users/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, ...editData } : user
        )
      );

      setEditMode(null);
      setSnackbarMessage("User updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
      setSnackbarMessage("Failed to update user.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) &&
      (roleFilter ? user.role === roleFilter : true)
  );

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchLeaveHistory = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE}/api/auth/users/${userId}/leave-history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaveHistory(response.data.leaveRecords);
      setLeaveBalance(response.data.leaveBalance);
    } catch (error) {
      console.error("Error fetching leave history:", error);
    }
  };

  const handleSaveLeaveBalance = async () => {
    if (isNaN(leaveBalance)) {
      setSnackbarMessage("Leave balance must be a valid number.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/api/auth/users/${selectedUser._id}/leave-balance`,
        { leaveBalance: parseFloat(leaveBalance) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setSnackbarMessage("Leave balance updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchUsers();
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to update leave balance.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAddLeaveRecord = async () => {
    if (!leaveStartDate || !leaveEndDate || !leaveNote) {
      setSnackbarMessage("All fields are required.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const payload = {
        startDate: new Date(leaveStartDate).toISOString().split("T")[0],
        endDate: new Date(leaveEndDate).toISOString().split("T")[0],
        type: leaveType,
        note: leaveNote,
      };

      await axios.post(
        `${API_BASE}/api/auth/users/${selectedUser._id}/leave-records`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setSnackbarMessage("Leave record added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchLeaveHistory(selectedUser._id);
    } catch (error) {
      console.error(
        "Error adding leave record:",
        error.response?.data || error.message
      );
      setSnackbarMessage("Failed to add leave record.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteLeaveRecord = async (recordId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE}/api/auth/users/${selectedUser._id}/leave-records/${recordId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSnackbarMessage("Leave record deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchLeaveHistory(selectedUser._id);
    } catch (error) {
      console.error(
        "Error deleting leave record:",
        error.response?.data || error.message
      );
      setSnackbarMessage("Failed to delete leave record.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const renderMobileCard = (user, index) => (
    <Card key={user._id} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{user.username}</Typography>
        <Typography color="textSecondary" gutterBottom>
          {user.email}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">Role: {user.role}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              Joined:{" "}
              {user.joiningDate
                ? new Date(user.joiningDate).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              Leave Balance: {user.leaveBalance}
            </Typography>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={1} mt={2} justifyContent="flex-end">
          <IconButton
            size="small"
            onClick={() => {
              setSelectedUser(user);
              fetchLeaveHistory(user._id);
              setLeaveModalOpen(true);
            }}
          >
            <Visibility />
          </IconButton>
          <IconButton size="small" onClick={() => handleEdit(user)}>
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(user._id)}
          >
            <Delete />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Stack spacing={2}>
        {/* filter */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Search sx={{ mr: 1, color: "text.secondary" }} />
            <TextField
              size="small"
              label="Search users..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <FilterList sx={{ mr: 1, color: "text.secondary" }} />
            <Select
              size="small"
              value={roleFilter}
              displayEmpty
              onChange={(e) => setRoleFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="caller">Caller</MenuItem>
              <MenuItem value="developer">Developer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Team Manager</MenuItem>
            </Select>
          </Box>
        </Stack>

        {/* card   */}
        {isMobile ? (
          <Box>
            {filteredUsers.map((user, index) => renderMobileCard(user, index))}
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table size={isTablet ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  {!isTablet && <TableCell>Joining Date</TableCell>}
                  <TableCell>Leave Balance</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {editMode === user._id ? (
                        <TextField
                          value={editData.username}
                          size="small"
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              username: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.username
                      )}
                    </TableCell>
                    <TableCell>
                      {editMode === user._id ? (
                        <TextField
                          type="email"
                          value={editData.email}
                          size="small"
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                        />
                      ) : (
                        user.email
                      )}
                    </TableCell>
                    <TableCell>
                      {editMode === user._id ? (
                        <Select
                          value={editData.role}
                          size="small"
                          onChange={(e) =>
                            setEditData({ ...editData, role: e.target.value })
                          }
                        >
                          <MenuItem value="caller">Caller</MenuItem>
                          <MenuItem value="developer">Developer</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="manager">Team Manager</MenuItem>
                        </Select>
                      ) : (
                        user.role
                      )}
                    </TableCell>
                    {!isTablet && (
                      <TableCell>
                        {editMode === user._id ? (
                          <TextField
                            type="date"
                            value={
                              editData.joiningDate
                                ? new Date(editData.joiningDate)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            size="small"
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                joiningDate: e.target.value,
                              })
                            }
                          />
                        ) : user.joiningDate ? (
                          new Date(user.joiningDate).toLocaleDateString()
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    )}
                    <TableCell>{user.leaveBalance}</TableCell>
                    <TableCell align="center">
                      {editMode === user._id ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            color="success"
                            onClick={() => handleSave(user._id)}
                          >
                            <Save />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => setEditMode(null)}
                          >
                            <Close />
                          </IconButton>
                        </Stack>
                      ) : (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            onClick={() => {
                              setSelectedUser(user);
                              fetchLeaveHistory(user._id);
                              setLeaveModalOpen(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(user._id)}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>

      {/* popup model  */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Leave Management for {selectedUser?.username}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* balance */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Leave Balance
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
              >
                <TextField
                  label="Leave Balance"
                  type="number"
                  fullWidth
                  value={leaveBalance}
                  onChange={(e) => setLeaveBalance(parseFloat(e.target.value))}
                />
                <Button variant="contained" onClick={handleSaveLeaveBalance}>
                  Update Balance
                </Button>
              </Stack>
            </Box>

            {/* history */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Leave History
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveHistory.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(record.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(record.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.note}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteLeaveRecord(record._id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* add leave  */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Add Leave Record
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                />
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                />
                <TextField
                  label="Note"
                  fullWidth
                  value={leaveNote}
                  onChange={(e) => setLeaveNote(e.target.value)}
                />
                <Select
                  value={leaveType}
                  fullWidth
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <MenuItem value="full">Full Day</MenuItem>
                  <MenuItem value="half">Half Day</MenuItem>
                </Select>
                <Button variant="contained" onClick={handleAddLeaveRecord}>
                  Add Leave Record
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

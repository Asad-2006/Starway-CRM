import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Avatar,
  Button,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  useMediaQuery,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import { Eye, User } from "lucide-react";

const AssignedLeads = () => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leadIdToUnassign, setLeadIdToUnassign] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    fetchAssignedLeads();
    fetchUsers();
  }, []);

  const fetchAssignedLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/leads/all-assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedLeads = response.data.sort(
        (a, b) => new Date(b.assignedAt) - new Date(a.assignedAt)
      );
      setAssignedLeads(sortedLeads);
    } catch (error) {
      console.error("Error fetching assigned leads:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/auth/admins-managers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUnassign = (leadId) => {
    setLeadIdToUnassign(leadId);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setLeadIdToUnassign(null);
  };

  const handleUnassignConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/api/leads/unassign/${leadIdToUnassign}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAssignedLeads();
    } catch (error) {
      console.error("Error unassigning lead:", error);
    } finally {
      handleConfirmClose();
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      let updateData = { status: newStatus };
      if (newStatus === "closed") {
        updateData = { ...updateData, closedAt: new Date() };
      } else if (newStatus === "ongoing") {
        updateData = { ...updateData, closedAt: null };
      }

      await axios.put(
        `${API_BASE}/api/leads/update-status/${leadId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAssignedLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === leadId
            ? { ...lead, status: newStatus, closedAt: updateData.closedAt }
            : lead
        )
      );
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  const handleOpen = (lead) => {
    setSelectedLead(lead);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedLead(null);
    setOpen(false);
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "?"
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLeads = assignedLeads
    .filter((lead) =>
      selectedUser ? lead.assignedTo?._id === selectedUser : true
    )
    .filter((lead) =>
      selectedStatus !== "all" ? lead.status === selectedStatus : true
    )
    .filter(
      (lead) =>
        lead.leadName &&
        lead.leadName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <TextField
            size="small"
            label="Search by Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2, width: "100%" }}
          />

          <div className="flex flex-row md:flex-row gap-2 mt-3 space-y-2 sm:mt-0 md:space-y-0 md:space-x-2">
            <FormControl size="small" className="min-w-[120px] ">
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                displayEmpty
                className="text-sm"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" className="min-w-[120px]">
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                displayEmpty
                className="text-sm"
              >
                <MenuItem value="">All Users</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Mobile screen */}
        {isSmallScreen ? (
          paginatedLeads.map((lead) => (
            <div
              key={lead._id}
              className="bg-white rounded-lg shadow-md p-4 mb-4"
            >
              <div className="flex items-center mb-2">
                <Avatar className="mr-2">{getInitials(lead.leadName)}</Avatar>
                <Typography className="text-lg font-medium">
                  {lead.leadName || "N/A"}
                </Typography>
              </div>
              <Typography className="text-sm text-gray-500 mb-2">
                Email: {lead.email || "N/A"}
              </Typography>
              <Typography className="text-sm ml-2 text-gray-500 mb-2">
                Assigned To: {lead.assignedTo?.username || "Not Assigned"}
              </Typography>
              <Chip
                label={lead.status || "N/A"}
                className={`text-sm mt-3 font-medium ${getStatusColor(
                  lead.status
                )} mb-2`}
              />
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between gap-12 mt-2 pb-2 space-x-2">
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#2636ee",
                      "&:hover": {
                        bgcolor: "#212ec5",
                      },
                    }}
                    onClick={() => handleOpen(lead)}
                    className=" h-10 sm:mr-2 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleUnassign(lead._id)}
                    className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Unassign
                  </Button>
                </div>
                <FormControl size="small" className="min-w-[100px]">
                  <Select
                    value={lead.status}
                    onChange={(e) =>
                      handleStatusChange(lead._id, e.target.value)
                    }
                    className="text-xs"
                  >
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="closed">Close Lead</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          ))
        ) : (
          // Desktop screen
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Name
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">
                    Email
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">
                    Assigned To
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">
                    Assigned By
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="mr-2">
                          {getInitials(lead.leadName)}
                        </Avatar>
                        <Typography className="text-sm font-medium text-gray-900">
                          {lead.leadName || "N/A"}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap md:table-cell">
                      <Typography className="text-sm text-gray-500">
                        {lead.email || "N/A"}
                      </Typography>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap md:table-cell">
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4 text-gray-400" />
                        <Typography className="text-sm text-gray-700">
                          {lead.assignedTo?.username || "Not Assigned"}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap md:table-cell">
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4 text-gray-400" />
                        <Typography className="text-sm text-gray-700">
                          {lead.assignedBy?.username || "Unknown"}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <Chip
                        label={lead.status || "N/A"}
                        className={`text-sm font-medium ${getStatusColor(
                          lead.status
                        )}`}
                      />
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="flex gap-1 space-x-1">
                        <Button
                          variant="contained"
                          onClick={() => handleOpen(lead)}
                          className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-1 rounded focus:outline-none focus:shadow-outline"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleUnassign(lead._id)}
                          className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-1 rounded focus:outline-none focus:shadow-outline"
                        >
                          Unassign
                        </Button>
                        <Select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead._id, e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="ongoing">Ongoing</MenuItem>
                          <MenuItem value="closed">Close Lead</MenuItem>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          count={Math.ceil(filteredLeads.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          className="mt-4 flex justify-center"
        />

        {/* Pop up modal */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="lead-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
        >
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-[90%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] m-4 overflow-hidden"
            style={{ maxHeight: "80vh" }}
          >
            <div className="py-4 px-4 overflow-y-auto">
              <Typography
                variant="h5"
                component="h3"
                className="text-lg font-semibold mb-4 text-center"
              >
                Lead Details
              </Typography>
              {selectedLead && (
                <div
                  className="grid grid-cols-1 gap-4 overflow-y-auto"
                  style={{ maxHeight: "calc(80vh - 100px)" }}
                >
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Lead Name:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.leadName || "N/A"}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Website:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.website || "N/A"}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Email:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.email || "N/A"}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Phone:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.phoneNumber || "N/A"}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Designation:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.designation || "N/A"}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Country:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.country || "N/A"}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Packages:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.packages?.join(", ") || "N/A"}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Lead Type:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.leadType || "N/A"}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Pitched Amount:
                    </Typography>
                    <Typography className="text-gray-900">
                      {`${selectedLead?.currencySymbol} ${selectedLead?.pitchedAmount}`}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Assigned By:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.assignedBy?.username || "Unknown"}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Assigned To:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.assignedTo?.username || "Unassigned"}
                    </Typography>
                  </div>
                  <div className="py-2 border-b border-gray-200">
                    <Typography className="font-medium text-gray-700">
                      Note:
                    </Typography>
                    <Typography className="text-gray-900">
                      {selectedLead?.note || "N/A"}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>

        <Dialog
          open={confirmOpen}
          onClose={handleConfirmClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Unassign Lead?"}</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to unassign this lead?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnassignConfirm} color="error">
              Unassign
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default AssignedLeads;

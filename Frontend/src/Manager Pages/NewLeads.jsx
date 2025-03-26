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
  IconButton,
} from "@mui/material";
import { Eye, User, X } from "lucide-react";

const AssignedLeads = () => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [open, setOpen] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    fetchAssignedLeads();
    fetchUsers();
  }, []);

  const fetchAssignedLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/leads/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignedLeads(response.data);
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

  const handleUnassign = async (leadId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/api/leads/unassign/${leadId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAssignedLeads();
    } catch (error) {
      console.error("Error unassigning lead:", error);
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

  return (
    <div className="px-18">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <div className="flex items-center justify-between mb-4">
          <Typography
            variant="h4"
            component="h2"
            className="font-bold text-2xl"
          >
            Assigned Leads
          </Typography>

          <div className="flex space-x-2">
            <FormControl size="small">
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

            <FormControl size="small">
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

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignedLeads
                .filter((lead) =>
                  selectedUser ? lead.assignedTo?._id === selectedUser : true
                )
                .filter((lead) =>
                  selectedStatus !== "all"
                    ? lead.status === selectedStatus
                    : true
                )
                .map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="mr-2">
                          {getInitials(lead.leadName)}
                        </Avatar>
                        <Typography className="text-sm font-medium text-gray-900">
                          {lead.leadName || "N/A"}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Typography className="text-sm text-gray-500">
                        {lead.email || "N/A"}
                      </Typography>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4 text-gray-400" />
                        <Typography className="text-sm text-gray-700">
                          {lead.assignedTo?.username || "Not Assigned"}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4 text-gray-400" />
                        <Typography className="text-sm text-gray-700">
                          {lead.assignedBy?.username || "Unknown"}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Chip
                        label={lead.status || "N/A"}
                        className={`text-sm font-medium ${getStatusColor(
                          lead.status
                        )}`}
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex gap-2 space-x-2">
                        <Button
                          variant="contained"
                          onClick={() => handleOpen(lead)}
                          className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleUnassign(lead._id)}
                          className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        >
                          Unassign
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Viewing Lead Details */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="lead-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
        >
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[80%] m-4 overflow-hidden flex">
            {/* <IconButton
            className="absolute top-2 right-2 z-10"
            onClick={handleClose}
          >
            <X />
          </IconButton> */}
            <div className="py-4 px-6 w-1/2">
              <Typography
                variant="h5"
                component="h3"
                className="text-lg font-semibold mb-4 text-center"
              >
                Lead Details
              </Typography>
              {selectedLead && (
                <div className="grid grid-cols-1 gap-4">
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
                </div>
              )}
            </div>
            <div className="py-4 px-6 w-1/2">
              {selectedLead && (
                <div className="grid grid-cols-1 gap-4">
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
                      $ {selectedLead?.pitchedAmount?.toFixed(2) || "N/A"}
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
      </Container>
    </div>
  );
};

export default AssignedLeads;

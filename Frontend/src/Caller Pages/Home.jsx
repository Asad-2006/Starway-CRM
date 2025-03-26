import React, { useState, useEffect } from "react";
import { CalendarMonth as CalendarIcon } from "@mui/icons-material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

function CallerDashboard() {
  const [leads, setLeads] = useState([]);
  const [closedLeads, setClosedLeads] = useState([]);
  const [data, setData] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [open, setOpen] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE}/api/leads/leads-this-week`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeads(response.data.leads);
      } catch (error) {
        console.error("Error fetching leads", error);
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE}/api/leads/leads-this-month`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeads(response.data.leads);
      } catch (error) {
        console.error("Error fetching leads", error);
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE}/api/leads/leads-this-year`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeads(response.data.leads);
      } catch (error) {
        console.error("Error fetching leads", error);
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchClosedLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/api/leads/closed-leads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClosedLeads(response.data.closedLeads);
      } catch (error) {
        console.error("Error fetching closed leads", error);
      }
    };

    fetchClosedLeads();
  }, []);

  // useEffect(() => {
  //   const fetchLeads = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(
  //         `http://localhost:7000/api/leads/leads-overview?timeframe=${timeframe}`,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );

  //       console.log("Fetched leads:", response.data.leads);
  //       setData(response.data.leads);
  //     } catch (error) {
  //       console.error("Error fetching leads data:", error);
  //     }
  //   };

  //   fetchLeads();
  // }, [timeframe]);

  useEffect(() => {
    const fetchRecentLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/api/leads/recent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecentLeads(response.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchRecentLeads();
  }, []);

  // pop up for lead details
  const handleOpen = (lead) => {
    setSelectedLead(lead);
    setOpen(true);
  };

  // Close popup
  const handleClose = () => {
    setOpen(false);
    setSelectedLead(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-8xl mx-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* this week Leads Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-200">Leads This Week</p>
                <p className="text-4xl font-bold mt-2">{leads.length}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-indigo-200">
              <span className="hover:text-white hover:border-b">
                View Leads
              </span>
            </div>
          </div>

          {/* This month Leads Card */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100">Leads This Month</p>
                <p className="text-4xl font-bold mt-2">{leads.length}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-orange-100">
              <span className="hover:text-white hover:border-b">
                View Leads
              </span>
            </div>
          </div>

          {/* New This year Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-200">Leads This Year</p>
                <p className="text-4xl font-bold mt-2">{leads.length}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-indigo-200">
              <span className="hover:text-white hover:border-b">
                View Leads
              </span>
            </div>
          </div>

          {/* closed lead Card */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100">Closed Leads</p>
                <p className="text-4xl font-bold mt-2">{closedLeads.length}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-orange-100">
              <span className="hover:text-white hover:border-b">
                View Closed Leads
              </span>
            </div>
          </div>
        </div>

        {/* Performance Overview Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-indigo-900 mb-6">
            Recent Leads
          </h3>

          {/* Table Container - Fixed scroll */}
          <div className="max-h-[450px] overflow-y-auto border rounded-lg relative">
            <table className="w-full table-auto">
              <thead className="sticky top-0 bg-indigo-50 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider whitespace-nowrap">
                    Lead Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider whitespace-nowrap">
                    Lead Owner
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="hover:bg-indigo-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => handleOpen(lead)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUserCircle className="h-8 w-8 text-indigo-400 mr-3 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {lead.leadName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                            lead.leadType === "Hot Lead"
                              ? "bg-red-100 text-red-800"
                              : lead.leadType === "New Lead"
                              ? "bg-green-200 text-green-800"
                              : lead.leadType === "Contacted"
                              ? "bg-yellow-100 text-yellow-800"
                              : lead.leadType === "Callback"
                              ? "bg-yellow-100 text-yellow-800"
                              : lead.leadType === "Contact in Future"
                              ? "bg-purple-200 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {lead.leadType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {lead.leadOwner}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No recent leads available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/*popup modal for lead details  */}
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              style: {
                maxHeight: "80vh",
                overflowY: "auto",
              },
            }}
          >
            <DialogTitle>Lead Details</DialogTitle>
            <DialogContent>
              {selectedLead ? (
                <div className="grid grid-cols-2 gap-4 p-4">
                  <TextField
                    label="Lead Name"
                    fullWidth
                    value={selectedLead.leadName}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    value={selectedLead.email}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Website"
                    fullWidth
                    value={selectedLead.website || "N/A"}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth
                    value={selectedLead.phoneNumber}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Designation"
                    fullWidth
                    value={selectedLead.designation || "N/A"}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Country"
                    fullWidth
                    value={selectedLead.country}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Lead Type"
                    fullWidth
                    value={selectedLead.leadType}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Lead Owner"
                    fullWidth
                    value={selectedLead.leadOwner}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Status"
                    fullWidth
                    value={selectedLead.status}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Pitched Amount"
                    fullWidth
                    value={`${selectedLead.currencySymbol || ""} ${
                      selectedLead.pitchedAmount
                    }`}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Packages"
                    fullWidth
                    value={selectedLead.packages.join(", ")}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Assigned By"
                    fullWidth
                    value={selectedLead.assignedBy || "N/A"}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Assigned To"
                    fullWidth
                    value={selectedLead.assignedTo || "N/A"}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Created At"
                    fullWidth
                    value={new Date(selectedLead.createdAt).toLocaleString()}
                    variant="outlined"
                    disabled
                  />
                  {selectedLead.closedAt && (
                    <TextField
                      label="Closed At"
                      fullWidth
                      value={new Date(selectedLead.closedAt).toLocaleString()}
                      variant="outlined"
                      disabled
                    />
                  )}
                  <TextField
                    label="Notes"
                    fullWidth
                    multiline
                    rows={3}
                    value={selectedLead.note}
                    variant="outlined"
                    disabled
                  />
                </div>
              ) : (
                <p>No lead selected</p>
              )}
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleClose}
                  variant="contained"
                  color="primary"
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default CallerDashboard;

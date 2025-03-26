import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Divider,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Visibility } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const NewLeads = () => {
  const [leads, setLeads] = useState([]);
  const [callers, setCallers] = useState([]);
  const [adminsManagers, setAdminsManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilterType, setDateFilterType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAssignedTo, setSelectedAssignedTo] = useState("");
  const [selectedAssignedBy, setSelectedAssignedBy] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [uniqueLeadOwners, setUniqueLeadOwners] = useState([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const leadsResponse = await axios.get(`${API_BASE}/api/leads/new`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(leadsResponse.data);

        const owners = [
          ...new Set(leadsResponse.data.map((lead) => lead.leadOwner)),
        ];
        setUniqueLeadOwners(owners);

        const adminsManagersResponse = await axios.get(
          `${API_BASE}/api/auth/admins-managers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdminsManagers(adminsManagersResponse.data);

        const callersResponse = await axios.get(
          `${API_BASE}/api/auth/callers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCallers(callersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getDateRange = () => {
    const today = dayjs();
    switch (dateFilterType) {
      case "today":
        return { start: today.startOf("day"), end: today.endOf("day") };
      case "thisMonth":
        return { start: today.startOf("month"), end: today.endOf("month") };
      case "lastMonth":
        return {
          start: today.subtract(1, "month").startOf("month"),
          end: today.subtract(1, "month").endOf("month"),
        };
      case "custom":
        return selectedDate
          ? {
              start: selectedDate.startOf("day"),
              end: selectedDate.endOf("day"),
            }
          : null;
      default:
        return null;
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAssignedToChange = (e) => {
    setSelectedAssignedTo(e.target.value);
  };

  const handleAssignedByChange = (e) => {
    setSelectedAssignedBy(e.target.value);
  };

  const filteredLeads = leads.filter((lead) => {
    const searchMatch = lead.leadName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const dateRange = getDateRange();
    const leadDate = dayjs(lead.createdAt);
    const dateMatch = dateRange
      ? leadDate.isBetween(dateRange.start, dateRange.end, "day", "[]")
      : true;

    const assignedToMatch = selectedAssignedTo
      ? lead.assignedTo?._id === selectedAssignedTo
      : true;
    const assignedByMatch = selectedAssignedBy
      ? lead.assignedBy?._id === selectedAssignedBy
      : true;
    const createdByMatch = selectedCreatedBy
      ? lead.leadOwner === selectedCreatedBy
      : true;

    return (
      searchMatch &&
      dateMatch &&
      assignedToMatch &&
      assignedByMatch &&
      createdByMatch
    );
  });

  const handleOpenModal = (lead) => {
    setSelectedLead(lead);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLead(null);
  };

  const handleCreatedByChange = (e) => {
    setSelectedCreatedBy(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const paginatedLeads = filteredLeads.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="max-w-full mx-4 md:mx-18 p-2 md:p-6 space-y-6">
        <div className="mb-4 md:mb-6">
          <TextField
            fullWidth
            label="Search Leads"
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <Grid container spacing={2} className="mb-4">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Date Filter</InputLabel>
              <Select
                value={dateFilterType}
                onChange={(e) => setDateFilterType(e.target.value)}
                label="Date Filter"
              >
                <MenuItem value="">All Dates</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="custom">Custom Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/*date picker  */}
          {dateFilterType === "custom" && (
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{
                  textField: { fullWidth: true, variant: "outlined" },
                }}
              />
            </Grid>
          )}

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={selectedAssignedTo}
                onChange={handleAssignedToChange}
                label="Assigned To"
              >
                <MenuItem value="">All</MenuItem>
                {adminsManagers.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Created By</InputLabel>
              <Select
                value={selectedCreatedBy}
                onChange={handleCreatedByChange}
                label="Created By"
              >
                <MenuItem value="">All</MenuItem>
                {uniqueLeadOwners.map((owner) => (
                  <MenuItem key={owner} value={owner}>
                    {owner}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {paginatedLeads.map((lead, index) => (
          <div className="mt-4 md:mt-10" key={lead._id}>
            <Card className="p-4 md:p-8 mb-4 md:mb-6 shadow-xl rounded-lg hover:shadow-2xl transition-shadow w-full">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-0">
                  <Avatar
                    className="w-20 h-20 md:w-24 md:h-24 bg-red-500"
                    sx={{ width: 80, height: 80 }}
                  >
                    {lead.leadName.charAt(0)}
                  </Avatar>
                  <div className="space-y-1 md:space-y-2">
                    <Typography
                      variant="h6"
                      className="font-semibold text-lg md:text-base"
                    >
                      {lead.leadName}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-600 text-sm md:text-base"
                    >
                      {lead.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-600 text-sm md:text-base"
                    >
                      {lead.phoneNumber}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-600 text-sm md:text-base"
                    >
                      {lead.designation} / {lead.company} / {lead.country}
                    </Typography>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                  <div className="text-left md:text-right space-y-1 md:space-y-2">
                    <Typography
                      variant="body2"
                      className="text-gray-600 font-semibold text-sm md:text-base"
                    >
                      Assigned to:{" "}
                      {lead.assignedTo
                        ? lead.assignedTo.username
                        : "Unassigned"}
                    </Typography>
                    {/* <Typography
                      variant="body2"
                      className="text-gray-600 font-semibold text-sm md:text-base"
                    >
                      Assigned by:{" "}
                      {lead.assignedBy
                        ? lead.assignedBy.username
                        : "Unassigned"}
                    </Typography> */}
                    {/* <Typography variant="caption" className="text-gray-500">
                      Created At
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {new Date(lead.createdAt).toLocaleString()}
                    </Typography> */}
                    <Typography
                      variant="body2"
                      className="text-gray-600 font-semibold text-sm md:text-base"
                    >
                      Lead Creator: {lead.leadOwner}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-600 font-semibold text-sm md:text-base"
                    >
                      Pitched Amount:{" "}
                      {`${lead.currencySymbol} ${lead.pitchedAmount}`}
                    </Typography>
                  </div>
                  <IconButton onClick={() => handleOpenModal(lead)}>
                    <Visibility />
                  </IconButton>
                </div>
              </div>
            </Card>
            {index < paginatedLeads.length - 1 && (
              <Divider className="my-4 md:my-6" />
            )}
          </div>
        ))}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="mt-4"
        >
          <FormControl>
            <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              label="Rows per page"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={Math.ceil(filteredLeads.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Stack>

        {/* popup modal for lead details  */}
        <Dialog
          className="bg-blur backdrop-blur bg-opacity-50 rounded-lg transition-all"
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="font-semibold text-lg">
            Lead Details
          </DialogTitle>
          <DialogContent dividers className="max-h-[80vh] overflow-y-auto">
            {selectedLead && (
              <div className="space-y-4">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      className="text-gray-500 font-semibold"
                    >
                      Lead Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedLead.leadName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      className="text-gray-500 font-semibold"
                    >
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {selectedLead.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      className="text-gray-500 font-semibold"
                    >
                      Website
                    </Typography>
                    <Typography variant="body1">
                      {selectedLead.website || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      className="text-gray-500 font-semibold"
                    >
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {selectedLead.phoneNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      className="text-gray-500 font-semibold"
                    >
                      Designation
                    </Typography>
                    <Typography variant="body1">
                      {selectedLead.designation || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      className="text-gray-500 font-semibold"
                    >
                      Country
                    </Typography>
                    <Typography variant="body1">
                      {selectedLead.country || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      className="text-gray-500 font-semibold"
                    >
                      Lead Type
                    </Typography>
                    <Typography variant="body1">
                      {selectedLead.leadType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      className="text-gray-500 font-semibold"
                    >
                      Pitched Amount
                    </Typography>
                    <Typography variant="body1">
                      {`${selectedLead.currencySymbol} ${selectedLead.pitchedAmount}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      className="text-gray-500 font-semibold"
                    >
                      Packages
                    </Typography>
                    <Typography variant="body1">
                      {selectedLead.packages.join(", ")}
                    </Typography>
                  </Grid>
                </Grid>

                <div>
                  <Typography
                    variant="body2"
                    className="text-gray-500 font-semibold"
                  >
                    Note
                  </Typography>
                  <Typography variant="body1">
                    {selectedLead.note || "No notes available"}
                  </Typography>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default NewLeads;

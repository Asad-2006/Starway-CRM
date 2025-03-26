import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Modal,
  Box,
  Pagination,
  Stack,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { User } from "lucide-react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflow: "auto",
};

const FullWidthContainer = styled("div")({
  width: "100%",
  padding: "24px",
});

const ClosedLeads = () => {
  const [closedLeads, setClosedLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [leadsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    const fetchClosedLeads = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/leads/closed`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClosedLeads(response.data || []);
      } catch (error) {
        console.error("Error fetching closed leads:", error);
        setClosedLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClosedLeads();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewClick = (lead) => {
    console.log("View button clicked", lead);
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const filteredLeads = closedLeads.filter((lead) =>
    lead.leadName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const indexOfLastLead = page * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  return (
    <div className="px-3  ">
      <FullWidthContainer>
        <TextField
          fullWidth
          label="Search Lead Name"
          variant="outlined"
          margin="normal"
          onChange={handleSearch}
          value={searchTerm}
          sx={{ mb: 4 }}
        />
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : currentLeads.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {currentLeads.map((lead) => (
                <Grid item xs={12} key={lead._id}>
                  <Card style={{ width: "100%" }}>
                    <CardContent
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          style={{
                            height: "88px",
                            width: "88px",
                            marginRight: "16px",
                            backgroundColor: "#808080",
                          }}
                        >
                          {lead.leadName.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                          <Typography variant="h6" component="h6">
                            {lead.leadName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {lead.email}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {lead.phoneNumber}
                          </Typography>
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{ marginRight: "16px", textAlign: "right" }}
                        >
                          <Typography variant="body2" color="textSecondary">
                            Assigned To:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {lead.assignedTo
                                ? lead.assignedTo.username
                                : "Not Assigned"}
                            </span>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Assigned By:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {lead.assignedBy
                                ? lead.assignedBy.username
                                : "Unknown"}
                            </span>
                          </Typography>
                        </div>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#2636ee",
                            "&:hover": {
                              bgcolor: "#212ec5",
                            },
                            px: 3,
                          }}
                          onClick={() => handleViewClick(lead)}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Stack
              spacing={2}
              style={{ marginTop: "20px", alignItems: "center" }}
            >
              <Pagination
                count={Math.ceil(filteredLeads.length / leadsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
              />
            </Stack>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Typography variant="subtitle1" color="textSecondary">
              No closed leads found.
            </Typography>
          </div>
        )}

        {/*popup modal */}
        <Modal
          open={isModalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              gutterBottom
            >
              Lead Details
            </Typography>
            {selectedLead && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Lead Name"
                    defaultValue={selectedLead.leadName}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Email"
                    defaultValue={selectedLead.email}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Phone"
                    defaultValue={selectedLead.phoneNumber}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Website"
                    defaultValue={selectedLead.website || "N/A"}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Designation"
                    defaultValue={selectedLead.designation || "N/A"}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Country"
                    defaultValue={selectedLead.country}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Lead Type"
                    defaultValue={selectedLead.leadType}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Pitched Amount"
                    defaultValue={`${selectedLead.currencySymbol} ${selectedLead.pitchedAmount}`}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Packages"
                    defaultValue={selectedLead.packages.join(", ")}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Note"
                    defaultValue={selectedLead.note}
                    fullWidth
                    margin="dense"
                    multiline
                    rows={4}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Assigned To"
                    defaultValue={
                      selectedLead.assignedTo
                        ? selectedLead.assignedTo.username
                        : "Not Assigned"
                    }
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Assigned By"
                    defaultValue={
                      selectedLead.assignedBy
                        ? selectedLead.assignedBy.username
                        : "Unknown"
                    }
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Status"
                    defaultValue={selectedLead.status}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            )}
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={handleClose} variant="contained" color="primary">
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      </FullWidthContainer>
    </div>
  );
};

export default ClosedLeads;

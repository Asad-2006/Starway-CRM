//
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  Typography,
  Grid,
  Box,
  Container,
  Paper,
  Divider,
  Stack,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { Users, Package, DollarSign } from "lucide-react";

const countries = [
  "USA",
  "India",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Brazil",
  "South Africa",
  "Mexico",
];

const currencySymbols = ["$", "€", "₹", "£", "¥", "₽", "₺", "₩", "₱"];

const leadTypes = [
  { value: "Hot Lead", color: "#B9360F" },
  { value: "Contacted", color: "#2379CF" },
  { value: "Contact in Future", color: "#502881" },
  { value: "Callback", color: "#f59e0b" },
  { value: "New Lead", color: "#418742" },
];

function AddLeadForm() {
  const theme = useTheme();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [formData, setFormData] = useState({
    leadName: "",
    email: "",
    website: "",
    phoneNumber: "",
    designation: "",
    country: "",
    packages: [],
    leadType: "",
    note: "",
    pitchedAmount: "",
    currencySymbol: "$",
  });

  const [selectedCurrency, setSelectedCurrency] = useState("$");
  const [packagesList, setPackagesList] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/api/servicetypes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackagesList(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "pitchedAmount") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.replace(/[^0-9.]/g, ""),
      }));
    } else if (type === "checkbox") {
      const checked = e.target.checked;
      setFormData((prev) => ({
        ...prev,
        packages: checked
          ? [...prev.packages, value]
          : prev.packages.filter((pkg) => pkg !== value),
      }));
    } else if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCurrencySelect = (symbol) => {
    setSelectedCurrency(symbol);
    setFormData((prev) => ({
      ...prev,
      currencySymbol: symbol,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE}/api/leads/add`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage("Lead added successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setFormData({
        leadName: "",
        email: "",
        website: "",
        phoneNumber: "",
        designation: "",
        country: "",
        packages: [],
        leadType: "",
        note: "",
        pitchedAmount: "",
        currencySymbol: "$",
      });
    } catch (error) {
      console.error("Error adding lead:", error);
      setSnackbarMessage(`Error adding lead: ${error.message}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: 1,
          borderColor: theme.palette.divider,
        }}
      >
        <Box
          sx={{
            p: 3,
            background: "linear-gradient(45deg, #2636ee 30%, #212ec5 90%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Users />
          <Typography variant="h5" component="h2">
            Add New Lead
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="leadName"
                value={formData.leadName}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={countries}
                value={formData.country}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    country: newValue || "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    required
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Package size={20} />
                  <Typography variant="h6" color="primary">
                    Available Packages
                  </Typography>
                </Stack>
              </Divider>
              <Grid container spacing={2}>
                {packagesList.map((pkg) => (
                  <Grid item xs={12} sm={6} md={3} key={pkg.name}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderColor: formData.packages.includes(pkg.name)
                          ? "primary.main"
                          : "divider",
                        bgcolor: formData.packages.includes(pkg.name)
                          ? "primary.light"
                          : "background.paper",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.packages.includes(pkg.name)}
                            onChange={handleChange}
                            name="packages"
                            value={pkg.name}
                          />
                        }
                        label={pkg.name}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Lead Type</InputLabel>
                <Select
                  name="leadType"
                  value={formData.leadType}
                  onChange={handleChange}
                  label="Lead Type"
                  required
                >
                  {leadTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note"
                name="note"
                multiline
                rows={4}
                value={formData.note}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  label="Pitched Amount"
                  name="pitchedAmount"
                  value={formData.pitchedAmount}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                  sx={{ mr: 1 }}
                />
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    label="Currency"
                    value={selectedCurrency}
                    onChange={(e) => handleCurrencySelect(e.target.value)}
                  >
                    {currencySymbols.map((symbol) => (
                      <MenuItem key={symbol} value={symbol}>
                        {symbol}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
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
              >
                Add Lead
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
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
    </Container>
  );
}

function App() {
  return <AddLeadForm />;
}

export default App;

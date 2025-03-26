import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  WhatsApp as WhatsAppIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
} from "@mui/icons-material";

function App() {
  const theme = useTheme();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [toNumber, setToNumber] = useState("");
  const [isTemplateMode, setIsTemplateMode] = useState(true);
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const clearForm = () => {
    setToNumber("");
    setSelectedTemplate("");
    setCustomMessage("");
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:7000/templates");
      setTemplates(response.data.data);
      showSnackbar("Templates refreshed successfully!", "success");
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      showSnackbar("Failed to fetch templates", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendTemplate = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:7000/send-template", {
        to: toNumber,
        templateName: selectedTemplate,
      });
      console.log(response.data);
      showSnackbar("Template sent successfully!", "success");
      clearForm();
    } catch (error) {
      console.error("Failed to send template:", error);
      showSnackbar("Failed to send template", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendCustomMessage = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:7000/send-custom", {
        to: toNumber,
        message: customMessage,
      });
      console.log(response.data);
      showSnackbar("Custom message sent successfully!", "success");
      clearForm();
    } catch (error) {
      console.error("Failed to send custom message:", error);
      showSnackbar("Failed to send custom message", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box className="min-h-screen bg-gray-50 py-12">
      <Container maxWidth="md">
        <Paper elevation={3} className="p-8 rounded-xl">
          {/* Header */}
          <Box className="flex items-center justify-center mb-8">
            <Box className="bg-green-500 p-3 rounded-full mr-4">
              <WhatsAppIcon className="text-white text-4xl" />
            </Box>
            <Typography variant="h4" className="font-bold text-gray-800">
              WhatsApp Message Sender
            </Typography>
          </Box>

          {/* Mode Toggle */}
          <Box className="flex justify-center mb-8">
            <FormControlLabel
              control={
                <Switch
                  checked={isTemplateMode}
                  onChange={() => setIsTemplateMode(!isTemplateMode)}
                  color="primary"
                />
              }
              label={
                <Typography className="text-gray-700 font-medium">
                  {isTemplateMode ? "Template Mode" : "Custom Message Mode"}
                </Typography>
              }
            />
          </Box>

          {/* Recipient Phone Number */}
          <Box className="mb-6">
            <TextField
              label="Recipient Phone Number"
              value={toNumber}
              onChange={(e) => setToNumber(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Enter phone number with country code"
              className="bg-white"
              InputProps={{
                className: "rounded-lg",
              }}
            />
          </Box>

          {/* Template Mode */}
          {isTemplateMode ? (
            <Box className="space-y-6">
              <Box className="flex gap-4">
                <Select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  disabled={loading}
                  className="bg-white rounded-lg"
                >
                  <MenuItem value="" disabled>
                    Select a Template
                  </MenuItem>
                  {templates.map((template) => (
                    <MenuItem key={template.name} value={template.name}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
                <Tooltip title="Refresh Templates">
                  <IconButton
                    onClick={fetchTemplates}
                    disabled={loading}
                    className="bg-blue-50 hover:bg-blue-100"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendTemplate}
                disabled={loading || !selectedTemplate || !toNumber}
                fullWidth
                className="h-12 bg-green-600 hover:bg-green-700"
                endIcon={
                  loading ? <CircularProgress size={24} /> : <SendIcon />
                }
              >
                Send Template
              </Button>
            </Box>
          ) : (
            /* Custom Message Mode */
            <Box className="space-y-6">
              <TextField
                label="Custom Message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                placeholder="Enter your custom message"
                disabled={loading}
                className="bg-white"
                InputProps={{
                  className: "rounded-lg",
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendCustomMessage}
                disabled={loading || !customMessage || !toNumber}
                fullWidth
                className="h-12 bg-green-600 hover:bg-green-700"
                endIcon={
                  loading ? <CircularProgress size={24} /> : <SendIcon />
                }
              >
                Send Custom Message
              </Button>
            </Box>
          )}
        </Paper>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            variant="filled"
            className="rounded-lg"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;

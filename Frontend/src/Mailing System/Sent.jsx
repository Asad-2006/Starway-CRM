import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Link,
  Pagination,
} from "@mui/material";
import { Visibility, Close } from "@mui/icons-material";

const SentMails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const emailsPerPage = 10;

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    const fetchSentEmails = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/sent-emails`);
        setEmails(response.data);
      } catch (error) {
        console.error("Failed to fetch sent emails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentEmails();
  }, []);

  const handleViewEmail = (email) => {
    setSelectedEmail(email);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmail(null);
  };

  const isImage = (filename) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImagePopup = () => {
    setSelectedImage(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Filter emails based on the search term (sender name)
  const filteredEmails = emails.filter(
    (email) =>
      email.sender &&
      email.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the number of pages based on filtered emails
  const pageCount = Math.ceil(filteredEmails.length / emailsPerPage);

  // Get the emails for the current page
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = filteredEmails.slice(
    indexOfFirstEmail,
    indexOfLastEmail
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ p: 3, maxWidth: "1400px", margin: "0 auto" }}
      className="container mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 4, fontWeight: "400" }}
        className="text-2xl font-semibold mb-4"
      >
        Mails Sent
      </Typography> */}

      {/* Search Bar */}
      <TextField
        label="Search by Sender"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        className="mb-3"
      />

      {/* Mobile Card Layout */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {currentEmails.map((email, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{ p: 2, mb: 2, borderRadius: 2 }}
            className="mb-2 rounded-lg shadow-md"
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600" }}
              className="font-medium"
            >
              From: {email.sender}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600" }}
              className="font-medium"
            >
              To: {email.to}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Subject: {email.subject}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Date:{" "}
              {new Date(email.sentAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <IconButton
                onClick={() => handleViewEmail(email)}
                color="primary"
              >
                <Visibility />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Desktop Table Layout */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ display: { xs: "none", md: "block" } }}
        className="shadow-md rounded-lg overflow-hidden"
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "600", backgroundColor: "#f5f5f5" }}
                className="font-medium bg-gray-100"
              >
                From
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", backgroundColor: "#f5f5f5" }}
                className="font-medium bg-gray-100"
              >
                To
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", backgroundColor: "#f5f5f5" }}
                className="font-medium bg-gray-100"
              >
                Subject
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", backgroundColor: "#f5f5f5" }}
                className="font-medium bg-gray-100"
              >
                Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "600", backgroundColor: "#f5f5f5" }}
                className="font-medium bg-gray-100"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentEmails.map((email, index) => (
              <TableRow key={index} hover>
                <TableCell>{email.sender}</TableCell>
                <TableCell>{email.to}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  className="max-w-[300px] overflow-hidden text-ellipsis"
                >
                  {email.subject}
                </TableCell>
                <TableCell>
                  {new Date(email.sentAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleViewEmail(email)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{ display: "flex", justifyContent: "center", mt: 3 }}
        className="flex justify-center mt-3"
      >
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Email Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ fontWeight: "600", borderBottom: "1px solid #eee" }}
          className="font-medium border-b border-gray-200"
        >
          Email Details
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }} className="pt-3">
          {selectedEmail && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
              className="flex flex-col gap-3"
            >
              <TextField
                label="From"
                value={selectedEmail.sender}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />

              <TextField
                label="To"
                value={selectedEmail.to}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />

              <TextField
                label="Subject"
                value={selectedEmail.subject}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />

              <TextField
                label="Message"
                value={selectedEmail.text}
                fullWidth
                multiline
                rows={28}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />

              {selectedEmail.attachments?.length > 0 && (
                <Box sx={{ mt: 2 }} className="mt-2">
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: "500" }}
                    className="mb-1 font-medium"
                  >
                    Attachments:
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
                    className="flex gap-2 flex-wrap"
                  >
                    {selectedEmail.attachments.map((file, index) => {
                      const fileUrl = `${API_BASE}/${file.path}`;
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            alignItems: "center",
                          }}
                          className="flex flex-col gap-1 items-center"
                        >
                          {/* Image Preview */}
                          {isImage(file.filename) && (
                            <Box
                              component="img"
                              src={fileUrl}
                              alt={file.filename}
                              sx={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                cursor: "pointer",
                              }}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-300 cursor-pointer"
                              onClick={() => handleImageClick(fileUrl)}
                            />
                          )}

                          {/* Download Link */}
                          <Link
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              padding: "6px 12px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              textDecoration: "none",
                              "&:hover": {
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                          >
                            {file.filename}
                          </Link>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ borderTop: "1px solid #eee", p: 2 }}
          className="border-t border-gray-200 p-2"
        >
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Popup Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseImagePopup}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{ fontWeight: "600", borderBottom: "1px solid #eee" }}
          className="font-medium border-b border-gray-200"
        >
          Image Preview
          <IconButton
            onClick={handleCloseImagePopup}
            sx={{ position: "absolute", right: 8, top: 8 }}
            className="absolute top-2 right-2"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ textAlign: "center" }}
          className="text-center"
        >
          {selectedImage && (
            <Box
              component="img"
              src={selectedImage}
              alt="Full Preview"
              sx={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SentMails;

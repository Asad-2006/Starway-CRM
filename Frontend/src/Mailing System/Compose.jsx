import React, { useState, useRef } from "react";
import axios from "axios";
import { X, Paperclip, ImagePlus, Send } from "lucide-react";
import {
  TextField,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Input = styled("input")({
  clip: "rect(0, 0, 0, 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ComposeMail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const generateEmail = async () => {
    if (!prompt.trim()) {
      setSnackbarMessage("Please enter a prompt");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post(
        "http://localhost:7000/generate-email",
        {
          prompt,
        }
      );

      const generatedText =
        response.data.text || response.data.response?.text || "";

      if (!generatedText) {
        throw new Error("No text received from API");
      }

      const subjectMatch = generatedText.match(/Subject: (.+)/);
      const subject = subjectMatch ? subjectMatch[1].trim() : "No Subject";
      const body = generatedText.replace(/Subject: .*\n/, "").trim();

      setSubject(subject);
      setText(body);
      setSnackbarMessage("Email generated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to generate email");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("text", text);
    files.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:7000/send-email`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSnackbarMessage("Email sent successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTo("");
      setSubject("");
      setText("");
      setFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setSnackbarMessage("Failed to send email");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleImageClick = (imageSrc, index) => {
    setSelectedImage(imageSrc);
    setSelectedImageIndex(index);
  };

  const handleClosePopup = () => {
    setSelectedImage(null);
    setSelectedImageIndex(null);
  };

  const handleRemoveImage = () => {
    if (selectedImageIndex !== null) {
      removeImage(selectedImageIndex);
      handleClosePopup();
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto p-8 flex-grow">
        {/* <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Compose Mail
        </h1> */}

        {/* Prompt Section */}
        <Box className="mb-6 flex items-center space-x-4">
          <TextField
            fullWidth
            placeholder="Enter prompt (e.g., 'a follow-up email to a client')"
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={generateEmail}
            disabled={isGenerating}
            sx={{
              padding: "15px 20px",
              marginLeft: "20px",
              width: "200px",
              bgcolor: "#2636ee",
              "&:hover": {
                bgcolor: "#212ec5", // indigo-700 for hover
              },
            }}
          >
            {isGenerating ? "Generating..." : "Generate Email"}
          </Button>
        </Box>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="To"
            type="email"
            variant="outlined"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={12}
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          {/* Attachments */}
          <div>
            <label
              htmlFor="file-upload"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Attachments:
            </label>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{ borderColor: "#2636ee", color: "#2636ee" }}
                  startIcon={<ImagePlus className="text-[#2636ee]" />}
                >
                  Upload Images
                </Button>
              </label>
              <Paperclip className="h-5 w-5 text-gray-500" />
              <span>{files.length} files attached</span>
            </div>

            {/* Image Previews */}
            <div className="mt-4 flex space-x-4 overflow-x-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-md overflow-hidden shadow-md cursor-pointer border border-gray-300"
                  onClick={() =>
                    handleImageClick(URL.createObjectURL(file), index)
                  }
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#2636ee",
                "&:hover": {
                  bgcolor: "#212ec5", // indigo-700 for hover
                },
              }}
              startIcon={
                isSending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Send />
                )
              }
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </form>
      </div>

      {/* Image Popup Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleClosePopup}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <img src={selectedImage} alt="Full Preview" className="w-full" />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveImage} color="error">
            Remove
          </Button>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
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
    </div>
  );
};

export default ComposeMail;

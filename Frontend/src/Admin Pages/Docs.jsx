import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Modal,
  Box,
  Button,
  TextField,
  InputAdornment,
  styled,
  Stack,
  Skeleton,
} from "@mui/material";
import {
  Folder,
  Visibility,
  Delete,
  Search,
  Upload,
  Image as ImageIcon,
} from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const DocsGallery = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/docs/folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(response.data);
    } catch (error) {
      console.error("Failed to fetch folders", error);
    }
  };

  const fetchImages = async (folderId) => {
    setImageLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE}/api/docs/folders/${folderId}/images`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setImages(response.data);
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    fetchImages(folder._id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFolder(null);
    setImages([]);
    setPreviewImage(null);
  };

  const handleCreateFolder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE}/api/docs/folders`,
        { name: newFolderName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFolders([...folders, response.data]);
      setNewFolderName("");
    } catch (error) {
      console.error("Failed to create folder", error);
    }
  };

  const handleImageUpload = async (e, folderId) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const response = await axios.post(
        `${API_BASE}/api/docs/folders/${folderId}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImages([...images, ...response.data]);
    } catch (error) {
      console.error("Failed to upload images", error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/docs/images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImages((prevImages) =>
        prevImages.filter((image) => image._id !== imageId)
      );
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/docs/folders/${folderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder._id !== folderId)
      );
      if (selectedFolder && selectedFolder._id === folderId) {
        handleCloseModal();
      }
    } catch (error) {
      console.error("Failed to delete folder", error);
    }
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="Search Folders"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          label="New Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          sx={{ width: 200 }}
        />
        <Button
          sx={{
            py: 2,
            px: 4,
            bgcolor: "#2636ee",
            "&:hover": {
              bgcolor: "#212ec5",
            },
          }}
          variant="contained"
          onClick={handleCreateFolder}
        >
          Create
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredFolders.map((folder) => (
          <Grid item xs={12} sm={6} md={4} key={folder._id}>
            <StyledCard>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Folder sx={{ fontSize: 40, color: "#ffbf00" }} />
                    <Typography variant="h6" sx={{ textAlign: "center" }}>
                      {folder.name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleFolderClick(folder)}>
                      <Visibility />
                    </IconButton>
                    <IconButton
                      sx={{ color: "error.main" }}
                      onClick={() => handleDeleteFolder(folder._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Folder Images Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 800, md: 1200 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedFolder?.name}
          </Typography>
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <input
              type="file"
              accept="image/*"
              multiple
              id="upload-images"
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, selectedFolder._id)}
            />
            <label htmlFor="upload-images">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload />}
              >
                Upload Images
              </Button>
            </label>
          </Box>
          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item xs={6} sm={4} md={3} key={image._id}>
                <Box sx={{ position: "relative" }}>
                  {imageLoading ? (
                    <Skeleton variant="rectangular" width="100%" height={150} />
                  ) : (
                    <img
                      src={`${API_BASE}/${image.path}`}
                      alt={image.filename}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        cursor: "pointer",
                        border: "1px solid grey",
                      }}
                      onClick={() => setPreviewImage(image)}
                    />
                  )}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "error.main",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    }}
                    onClick={() => handleDeleteImage(image._id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>

      {/* Image Preview Modal */}
      <Modal open={!!previewImage} onClose={() => setPreviewImage(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: "100%",
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          {previewImage && (
            <img
              src={`${API_BASE}/${previewImage.path}`}
              alt={previewImage.filename}
              style={{ width: "100%", height: "auto", maxHeight: "80vh" }}
            />
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default DocsGallery;

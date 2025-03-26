// DocumentRoutes.js
import express from "express";
import Folder from "../Models/FolderModel.js";
import Image from "../Models/ImageModel.js";
import { verifyToken } from "../Middlewares/AuthMiddleware.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create a folder
router.post("/folders", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const folder = new Folder({ name });
    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create folder" });
  }
});

// Get all folders
router.get("/folders", verifyToken, async (req, res) => {
  try {
    const folders = await Folder.find();
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch folders" });
  }
});

// // Upload images to a folder
// router.post(
//   "/folders/:folderId/images",
//   verifyToken,
//   upload.array("images"),
//   async (req, res) => {
//     try {
//       const { folderId } = req.params;
//       const files = req.files;

//       const images = files.map((file) => ({
//         folderId,
//         filename: file.originalname,
//         path: file.path,
//       }));

//       const savedImages = await Image.insertMany(images);
//       res.status(201).json(savedImages);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to upload images" });
//     }
//   }
// );

router.post(
  "/folders/:folderId/images",
  verifyToken,
  upload.array("images"),
  async (req, res) => {
    try {
      const { folderId } = req.params;
      const files = req.files;

      const images = files.map((file) => ({
        folderId,
        filename: file.originalname,
        path: `uploads/${file.filename}`, // Store relative path
      }));

      const savedImages = await Image.insertMany(images);
      res.status(201).json(savedImages);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload images" });
    }
  }
);

// Get images in a folder
router.get("/folders/:folderId/images", verifyToken, async (req, res) => {
  try {
    const { folderId } = req.params;
    const images = await Image.find({ folderId });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// DocumentRoutes.js
router.delete("/images/:imageId", verifyToken, async (req, res) => {
  try {
    const { imageId } = req.params;

    // Find the image in the database
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Log the file path
    console.log("Deleting file:", path.join(__dirname, "../", image.path));

    // Delete the image file from the server
    fs.unlinkSync(path.join(__dirname, "../", image.path)); // Delete the file

    // Delete the image record from the database
    await Image.findByIdAndDelete(imageId);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Failed to delete image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

router.delete("/folders/:folderId", verifyToken, async (req, res) => {
  try {
    const { folderId } = req.params;

    // Find the folder in the database
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Delete all images associated with the folder
    const images = await Image.find({ folderId });
    images.forEach((image) => {
      fs.unlinkSync(path.join(__dirname, "../", image.path)); // Delete the file
    });

    // Delete the folder and its images from the database
    await Image.deleteMany({ folderId });
    await Folder.findByIdAndDelete(folderId);

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Failed to delete folder:", error);
    res.status(500).json({ error: "Failed to delete folder" });
  }
});

export default router;

// FolderModel.js
import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Folder", FolderSchema);

import mongoose from "mongoose";

const ServiceTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceType", ServiceTypeSchema);

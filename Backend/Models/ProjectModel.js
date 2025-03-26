import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectDetails: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    assignedDeveloper: {
      id: { type: String, required: true },
      username: { type: String, required: true },
    },
    serviceType: { type: [String], required: true },
    referenceSite: { type: String },
    businessNiche: { type: String },
    comments: { type: String },
    subscriptionType: { type: String, default: "select" },
    createdBy: { type: String, required: true },
    upSale: { type: Boolean, default: false },
    status: { type: String, default: "Active" },
    upsaleData: [
      {
        serviceType: { type: String },
        amount: { type: Number },
        details: { type: String },
        comments: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    createdDate: { type: Date, default: Date.now },
    updates: [
      {
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        createdBy: {
          id: { type: String, required: true },
          username: { type: String, required: true },
        },
      },
    ],
  },

  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);

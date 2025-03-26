import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  attachments: [
    {
      filename: String,
      path: String,
    },
  ],
  sentAt: { type: Date, default: Date.now },
  sender: { type: String, required: true },
});

const Email = mongoose.model("Email", emailSchema);

export default Email;

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AttendanceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["present", "absent", "on leave", "holiday"],
    required: true,
  },
  notes: { type: String, required: false },
});

export default model("Attendance", AttendanceSchema);

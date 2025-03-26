import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TaskSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  column: { type: String, enum: ["TODO", "DOING", "DONE"], required: true },
  text: { type: String, required: true },
  subtasks: { type: Number, default: 0 },
});

export default model("Task", TaskSchema);

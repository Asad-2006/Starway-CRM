import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ToDoListSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  todos: { type: [String], default: [] },
  inProgress: { type: [String], default: [] },
  done: { type: [String], default: [] },
});

export default model("ToDoList", ToDoListSchema);

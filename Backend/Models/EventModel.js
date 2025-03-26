import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EventSchema = new Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default model("Event", EventSchema);

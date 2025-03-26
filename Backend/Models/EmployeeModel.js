import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.model("Employee", employeeSchema);

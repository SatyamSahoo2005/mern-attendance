import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // like "CSE-A"
  year: { type: Number } // optional: 2025 (now, I'm leaving it blank)
}, { timestamps: true });

export default mongoose.model("Class", classSchema);

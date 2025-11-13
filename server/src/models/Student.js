import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  roll: { type: String, required: true },
  name: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }
}, { timestamps: true });

// Preventing duplicate roll numbers within same class
studentSchema.index({ roll: 1, classId: 1 }, { unique: true });

export default mongoose.model("Student", studentSchema);

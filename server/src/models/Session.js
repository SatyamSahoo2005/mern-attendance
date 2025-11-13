import mongoose from "mongoose";

const markSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  status: { type: String, enum: ["PRESENT", "ABSENT", "LATE"], default: "ABSENT" },
  remark: { type: String }
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  marks: [markSchema]
}, { timestamps: true });

// Preventing taking attendance twice for same class on same date
sessionSchema.index({ classId: 1, date: 1 }, { unique: true });

export default mongoose.model("Session", sessionSchema);

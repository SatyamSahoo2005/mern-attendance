import { Router } from "express";
import Student from "../models/Student.js";

const router = Router();

// Get students (optionally filtered by classId)
router.get("/", async (req, res) => {
  const { classId } = req.query;
  const query = classId ? { classId } : {};
  const students = await Student.find(query).populate("classId").sort({ roll: 1 });
  res.json(students);
});

// Add a student
router.post("/", async (req, res) => {
  const { roll, name, classId } = req.body;
  try {
    const student = await Student.create({ roll, name, classId });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a student
router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted ✅" });
});

// Update student (roll or name)
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// BULK IMPORT STUDENTS
router.post("/import", async (req, res) => {
  try {
    const { classId, students } = req.body;

    if (!classId || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: "Invalid import format" });
    }

    // Clean input
    const cleanStudents = students
      .map(s => ({
        roll: s.roll?.trim(),
        name: s.name?.trim(),
        classId,
      }))
      .filter(s => s.roll && s.name);

    // Find existing students in class
    const existing = await Student.find({ classId });
    const existingRolls = new Set(existing.map(s => s.roll));

    // Filter out duplicates
    const newStudents = cleanStudents.filter(s => !existingRolls.has(s.roll));

    // Insert only new ones
    if (newStudents.length > 0) {
      await Student.insertMany(newStudents);
    }

    return res.json({
      imported: newStudents.length,
      skipped: cleanStudents.length - newStudents.length,
      totalAfterImport: existing.length + newStudents.length
    });

  } catch (err) {
    console.error("IMPORT ERROR:", err);
    return res.status(500).json({ error: "Server error during import" });
  }
});

export default router;
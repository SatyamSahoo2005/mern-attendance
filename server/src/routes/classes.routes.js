import { Router } from "express";
import ClassModel from "../models/Class.js";

const router = Router();

// Get all classes
router.get("/", async (req, res) => {
  const classes = await ClassModel.find().sort({ name: 1 });
  res.json(classes);
});

// Add a class
router.post("/", async (req, res) => {
  const { name, year } = req.body;
  try {
    const newClass = await ClassModel.create({ name, year });
    res.json(newClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Bulk add multiple classes
router.post("/bulk", async (req, res) => {
    try {
      const inserted = await ClassModel.insertMany(req.body);
      res.json(inserted);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Delete class
router.delete("/:id", async (req, res) => {
  await ClassModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Class deleted ✅" });
});

export default router;

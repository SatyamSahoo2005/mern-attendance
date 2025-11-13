import { Router } from "express";
import Session from "../models/Session.js";
import Student from "../models/Student.js";

const router = Router();

// Create a session for a specific class & date
router.post("/", async (req, res) => {
  const { classId, date } = req.body;

  // Get students of that class
  const students = await Student.find({ classId }).sort({ roll: 1 });

  // Create default marks: all absent initially
  const marks = students.map(s => ({ studentId: s._id, status: "ABSENT" }));

  try {
    const session = await Session.create({ classId, date, marks });
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get sessions (these are optional filters)
router.get("/", async (req, res) => {
  const { classId, date } = req.query;
  const query = {};
  if (classId) query.classId = classId;
  if (date) query.date = date;
  const sessions = await Session.find(query).populate("classId");
  res.json(sessions);
});

// Get one session with student names
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("classId", "name year")
      .populate("marks.studentId", "name roll"); // ✅ This is the key

    if (!session) return res.status(404).json({ error: "Session not found" });

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Toggle a student's attendance status
router.patch("/:id/toggle", async (req, res) => {
  const { studentId } = req.body;

  const session = await Session.findById(req.params.id);

  const mark = session.marks.find(m => String(m.studentId) === studentId);

  const order = ["ABSENT", "PRESENT", "LATE"];
  const next = order[(order.indexOf(mark.status) + 1) % order.length];

  mark.status = next;
  await session.save();

  res.json({ ok: true, newStatus: next });
});

// Get attendance report for a class
router.get("/report/:classId", async (req, res) => {
  const { classId } = req.params;

  const sessions = await Session.find({ classId }).populate("marks.studentId", "name roll");

  const studentStats = {};

  sessions.forEach(session => {
    session.marks.forEach(mark => {
      const id = mark.studentId._id;
      if (!studentStats[id]) {
        studentStats[id] = {
          student: mark.studentId,
          present: 0,
          late: 0,
          absent: 0,
          total: 0,
        };
      }

      studentStats[id][mark.status.toLowerCase()]++;
      studentStats[id].total++;
    });
  });

  const result = Object.values(studentStats).map(r => ({
    roll: r.student.roll,
    name: r.student.name,
    present: r.present,
    late: r.late,
    absent: r.absent,
    total: r.total,
    percentage: ((r.present + r.late * 0.5) / r.total * 100).toFixed(1),
  }));

  res.json(result);
});

export default router;

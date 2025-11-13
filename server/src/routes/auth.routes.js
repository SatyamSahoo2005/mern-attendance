import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const r = Router();

// (One-time) register a teacher account
r.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "Email already registered" });
  const user = await User.create({ email, password, name });
  res.json({ ok: true, id: user._id });
});

// Login -> returns JWT token
r.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.compare(password))) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "dev_secret_change_me", { expiresIn: "7d" });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
});

// Get all teachers (for admin or listing)
r.get("/teachers", async (req, res) => {
    const teachers = await User.find({}, "-password"); // exclude password
    res.json(teachers);
  });
  
export default r;

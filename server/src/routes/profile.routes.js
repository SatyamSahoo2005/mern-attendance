import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

// Get current teacher info
r.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// Update name or password
r.patch("/update", requireAuth, async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (password) user.password = password; // will auto hash because model has .pre('save')

  await user.save();

  res.json({ ok: true, message: "Profile updated successfully" });
});

export default r;

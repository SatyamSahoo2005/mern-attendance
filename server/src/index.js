import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import classRoutes from "./routes/classes.routes.js";
import studentRoutes from "./routes/students.routes.js";
import sessionRoutes from "./routes/sessions.routes.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import { requireAuth } from "./middleware/auth.js";

console.log("➡️ Starting server...");

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://mern-attendance-seven.vercel.app"],
  credentials: true
}));

app.use(express.json());

// AUTH (Login/Register)
app.use("/api/auth", authRoutes);

// PROTECTED ROUTES
app.use("/api/classes", requireAuth, classRoutes);
app.use("/api/students", requireAuth, studentRoutes);
app.use("/api/sessions", requireAuth, sessionRoutes);
app.use("/api/profile", requireAuth, profileRoutes);

app.get("/", (req, res) => {
  res.send("Server + Database setup ✅");
});

const startServer = async () => {
  console.log("⏳ Connecting to DB...");
  await connectDB();
  console.log("✅ DB connected, starting server...");
  app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
    console.log("🚀 Server running at http://localhost:" + (process.env.PORT || 5000));
  });
};

startServer();

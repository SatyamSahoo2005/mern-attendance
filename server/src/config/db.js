import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("🔌 Attempting MongoDB connection..."); // debug line
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "attendance_db",
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

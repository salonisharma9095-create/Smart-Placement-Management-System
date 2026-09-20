const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// ===== Routes =====
app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/companies", companyRoutes);

app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Placement Management System API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server chal raha hai: http://localhost:${PORT}`);
});
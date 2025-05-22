const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const typeMarchesRoutes = require("./routes/typeMarchesRoutes");
const purchaseRequestsRoutes = require("./routes/purchaseRequestsRoutes");
const departmentsRoutes = require("./routes/departmentsRoutes");
const statusRoutes = require("./routes/statusRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const roleRoutes = require("./routes/roleRoutes");
const statisticsRoutes = require("./routes/statistics");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/type-marches", typeMarchesRoutes);
app.use("/api/purchase-requests", purchaseRequestsRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/statistics", statisticsRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "University Budget Management API is running!",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});

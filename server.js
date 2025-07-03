// 3rd party imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Cogniflow Mongoose DB
const cogniflowDB = require("./config/db");

// Custom imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect DB
cogniflowDB();

// Middleware
app.use(express.json());


// Routes
// app.use("/cogniflow/api/v1/auth", authRoutes);
// app.use("/cogniflow/api/v1/user", userRoutes);
// app.use("/cogniflow/api/v1/workspace", workspaceRoutes);
// app.use("/cogniflow/api/v1/task", taskRoutes);
// app.use("/cogniflow/api/v1/report", reportRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

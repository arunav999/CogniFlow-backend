// 3rd party imports
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";

// Cogniflow Mongoose DB
import cogniflowDB from "./config/db.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import workspaceRoutes from "./routes/workspaceRoutes.js";
// import taskRoutes from "./routes/taskRoutes.js";
// import reportRoutes from "./routes/reportRoutes.js";

// Error handler
import errorHandler from "./errors/errorHandler.js";

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect DB
cogniflowDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/workspace", workspaceRoutes);
// app.use("/api/v1/task", taskRoutes);
// app.use("/api/v1/report", reportRoutes);

// Error
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// ==================== 3rd-party imports ====================
// External libraries and environment setup
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ==================== Database Connection ====================
// Connect to MongoDB using Mongoose
import cogniflowDB from "./config/db.js";

// ==================== Import Routes ====================
// Modular route imports for different features
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// ==================== Error Handler ====================
// Centralized error handling middleware
import errorHandler from "./errors/errorHandler.js";

// ==================== Express App Setup ====================
const app = express();

// ==================== CORS Middleware ====================
// Allow cross-origin requests from client
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ==================== Connect to Database ====================
cogniflowDB();

// ==================== Global Middlewares ====================
// Parse JSON and cookies for all requests
app.use(express.json());
app.use(cookieParser());

// ==================== API Routes ====================
// Mount feature routes under /api/v1
const baseRoute = "/api/v1";

app.use(`${baseRoute}/auth`, authRoutes); // Auth routes
app.use(`${baseRoute}/upload`, uploadRoutes); // File upload routes
app.use(`${baseRoute}/workspace`, workspaceRoutes); // Workspace routes
app.use(`${baseRoute}/project`, projectRoutes); // Project routes
app.use(`${baseRoute}/ticket`, ticketRoutes); // Ticket routes
app.use(`${baseRoute}/dashboard`, dashboardRoutes); // Dashboard Routes

// ==================== Error Middleware ====================
// Handle errors from all routes and controllers
app.use(errorHandler);

// ==================== Start Server ====================
// Start listening for incoming requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

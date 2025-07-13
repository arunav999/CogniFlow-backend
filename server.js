/* ========== 3rd-party imports ========== */
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

/* ========== COGNIFLOW-DB MONGO / MONGOOSE ========== */
import cogniflowDB from "./config/db.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

/* ========== ERROR HANDLER ========== */
import errorHandler from "./errors/errorHandler.js";

const app = express();

/* ========== CORS - MIDDLEWARE ========== */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* ========== CONNECT DB ========== */
cogniflowDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

/* ========== ROUTES ========== */
const baseRoute = "/api/v1";

app.use(`${baseRoute}/auth`, authRoutes);
app.use(`${baseRoute}/upload`, uploadRoutes);
app.use(`${baseRoute}/workspace`, workspaceRoutes);
app.use(`${baseRoute}/project`, projectRoutes);
app.use(`${baseRoute}/ticket`, ticketRoutes);

/* ========== ERROR MIDDLEWARE ========== */
app.use(errorHandler);

/* ========== START SERVER ========== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// ==================== Upload Routes ====================
// Handles user avatar uploads and file size error handling

import "dotenv/config";

// ==================== Express Router ====================
import { Router } from "express";

// ==================== Multer Config ====================
// Multer for handling file uploads (memory storage, 2MB limit)
import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

// ==================== Models & Error Classes ====================
import User from "../models/User.js";
import ApiError from "../errors/Apierror.js";
import { STATUS_CODES } from "../constants/statusCodes.js";

// ==================== Middleware ====================
import { verifyToken } from "../middlewares/verifyToken.js";

// Create router instance
const router = Router();

// Multer configuration for avatar uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

// Cloudinary configuration for storing avatars
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// ==================== Avatar Upload Route ====================
// PATCH /avatar: Uploads user avatar to Cloudinary and updates user profile
router.patch(
  "/avatar",
  verifyToken,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      // Check if user exists
      if (!user)
        return next(new ApiError(STATUS_CODES.NOT_FOUND, "User not found", ""));

      // Check if file is uploaded
      if (!req.file)
        return next(
          new ApiError(STATUS_CODES.BAD_REQUEST, "No file uploaded", "")
        );

      // Upload file to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `users/${userId}`,
            use_filename: true,
            unique_filename: false,
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      // Save avatar info to user document
      user.avatar = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      await user.save();

      // Respond with avatar URL
      res.json({ avatar: result.secure_url });
    } catch (error) {
      next(error);
    }
  }
);

// ==================== Multer File Size Error Handler ====================
// Handles file size errors from Multer
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE")
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "File size should not exceed 2MB",
        "avatar"
      )
    );

  next(err);
});

// Export the router for use in the main server
export default router;

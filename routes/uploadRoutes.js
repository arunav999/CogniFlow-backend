import { Router } from "express";

import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/User.js";

import ApiError from "../errors/Apierror.js";
import { STATUS_CODES } from "../constants/statusCodes.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// Multer
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Patch
router.patch(
  "/avatar",
  verifyToken,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user)
        return next(new ApiError(STATUS_CODES.NOT_FOUND, "User not found", ""));

      if (!req.file)
        return next(
          new ApiError(STATUS_CODES.BAD_REQUEST, "No file uploaded", "")
        );

      // upload to Cloudinary
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

      // save to user db
      user.avatar = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      await user.save();

      res.json({ avatar: result.secure_url });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

// ==================== Patch Attachment Controller ====================
// Handles updating attachments for a ticket, including file uploads

// Cloudinary and streamifier for file uploads
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Status code constants and regex
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { REGX } from "../../constants/regx.js";

// Ticket model
import Ticket from "../../models/Ticket.js";

// Main patchAttachmentController function
export const patchAttachmentController = async (req, res, next) => {
  // Extract ticket ID and attachment URL from request
  const ticketId = req.params.id;
  const { attachmentUrl } = req.body;

  try {
    // === 1. Validate ticket existence ===
    const ticket = await Ticket.findById(ticketId);
    if (!ticket)
      return next(
        new ApiError(STATUS_CODES.BAD_REQUEST, "Ticket not found", "")
      );

    // === 2. Enforce max 5 file attachments ===
    const currentFileCount = ticket.attachments.filter(
      (att) => att.type === "file"
    ).length;
    if (req.files && currentFileCount + req.files.length > 5)
      return next(
        new ApiError(
          STATUS_CODES.BAD_REQUEST,
          "Cannot upload more than 5 files per ticket",
          ""
        )
      );

    // === 3. FILE UPLOAD LOGIC ===
    if (req.files && req.files.length > 0) {
      // ===== FILE FLOW =====
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `tickets/${ticketId}`,
              use_filename: true,
              unique_filename: false,
            },
            (err, result) => (err ? reject(err) : resolve(result))
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });

      const uploadedResults = await Promise.all(uploadPromises);

      const attachmentsToAdd = uploadedResults.map((file) => ({
        url: file.secure_url,
        type: "file",
        public_id: file.public_id,
      }));

      await Ticket.updateOne(
        { _id: ticketId },
        { $push: { attachments: { $each: attachmentsToAdd } } }
      );

      // === 4. LINK ATTACHMENT LOGIC ===
    } else if (attachmentUrl) {
      // ===== LINK FLOW =====
      if (!REGX.URL.test(attachmentUrl))
        return next(new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid URL", ""));

      await Ticket.updateOne(
        { _id: ticketId },
        { $push: { attachments: { url: attachmentUrl, type: "link" } } }
      );

      // === 5. NO FILE OR LINK ===
    } else {
      return next(
        new ApiError(
          STATUS_CODES.BAD_REQUEST,
          "No file or attachmentUrl provided",
          ""
        )
      );
    }

    // === 6. Response ===
    const updatedTicket = await Ticket.findById(ticketId).select("attachments");
    res.status(STATUS_CODES.OK).json({
      success: true,
      attachments: updatedTicket.attachments,
    });
  } catch (error) {
    next(error);
  }
};

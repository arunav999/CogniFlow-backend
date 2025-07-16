// ==================== Delete Attachment Controller ====================
// Handles deletion of an attachment from a ticket

// Error handling utility
import ApiError from "../../errors/Apierror.js";

// Cloudinary for file management
import { v2 as cloudinary } from "cloudinary";

// Models
import Ticket from "../../models/Ticket.js";
import Project from "../../models/Project.js";

// Constants
import { STATUS_CODES } from "../../constants/statusCodes.js";

// Roles Constants
import { ROLE_PERMISSIONS } from "../../constants/roleDefinitions.js";

export const deleteAttachmentController = async (req, res, next) => {
  
};

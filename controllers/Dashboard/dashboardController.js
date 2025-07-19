// ==================== Get Admin Dashboard Controller ====================

import { ROLES } from "../../constants/roles.js";

export const dashboardController = async (req, res, next) => {
  const getUserRole = req.user.role;

  try {
    // If user role is admin
    if (getUserRole === ROLES.ADMIN) {
      return; 
    }
  } catch (error) {}
};

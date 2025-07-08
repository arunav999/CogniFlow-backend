import User from "../models/User";

import { ROLES } from "../constants/roles";
import { STATUS_CODES } from "../constants/statusCodes";

const registerUser = async (req, res, next) => {
  const {
    profilePhoto,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role,
    company,
  } = req.body;

  if (
    !firstName ||
    !email ||
    !password ||
    !confirmPassword ||
    !role ||
    !company
  ) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }
};

import ApiError from "../errors/Apierror.js";
import { STATUS_CODES } from "../constants/statusCodes.js";

const loginUserValidator = async (req, res, next) => {
  const { email, password } = req.body;
};

import { STATUS_CODES } from "../constants/statusCodes.js";

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || STATUS_CODES.SERVER_ERROR;

  const errorResponse = {
    success: false,
    message: err.message || "Somenting went wrong",
  };

  if (err.field) {
    errorResponse.field = err.field;
  }

  res.status(status).json(errorResponse);
};

export default errorHandler;

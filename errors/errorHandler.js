import { STATUS_CODES } from "../constants/statusCodes";

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || STATUS_CODES.SERVER_ERROR;

  const errorResponse = {
    message: err.message || "Somenting went wrong",
  };

  if (err.field) {
    errorResponse.field = err.field;
  }

  res.status(status).json(errorResponse);
};

export default errorHandler;

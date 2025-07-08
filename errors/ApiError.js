class ApiError extends Error {
  constructor(statusCode, message, field) {
    super(message);
    this.statusCode = statusCode;
    this.field = field;
  }
}

export default ApiError;

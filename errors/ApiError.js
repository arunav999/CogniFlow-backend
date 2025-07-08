class ApiError extends Error {
  constructor(statuscode, message, field = null) {
    super(message);
    this.statuscode = statuscode;
    this.field = field;
  }
}

export default ApiError;

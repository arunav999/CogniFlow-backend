// ==================== Status Codes ====================
// Centralized HTTP status codes for API responses

export const STATUS_CODES = {
  OK: 200, // Success
  CREATED: 201, // Resource created
  BAD_REQUEST: 400, // Invalid request
  UNAUTHORIZED: 401, // Authentication required
  FORBIDDEN: 403, // No permission
  NOT_FOUND: 404, // Resource not found
  CONFLICT: 409, // Conflict in request
  UNPROCESSABLE_ENTITY: 422, // Validation error
  SERVER_ERROR: 500, // Internal server error
};

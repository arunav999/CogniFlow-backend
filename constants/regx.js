// ==================== Regex Constants ====================
// Centralized regex patterns for validation

export const REGX = {
  // Name: only letters
  NAME: /^[a-zA-Z]+$/,
  // Email: basic email format
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Password: 8-15 chars, upper, lower, digit, special
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/,
  // URL: must start with http/https
  URL: /^https?:\/\/.+/i,
};

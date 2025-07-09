export const REGX = {
  NAME: /^[a-zA-Z]+$/,
  INVALID_COMPANY_CHARS: /[^a-zA-Z0-9&.,'’\- ]/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/,
};

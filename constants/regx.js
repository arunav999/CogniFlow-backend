export const REGX = {
  NAME: /^[a-zA-Z]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/,
  URL: /^https?:\/\/.+/i,
};

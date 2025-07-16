import rateLimiter from "express-rate-limiter";

// Rate limiter middleware to limit repeated requests
const rateLimiterMiddleware = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests, please try again later.",
});

export default rateLimiterMiddleware;
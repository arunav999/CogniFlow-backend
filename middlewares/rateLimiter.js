import rateLimit from "express-rate-limit";

// Rate limiter middleware to limit repeated requests
const rateLimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

export default rateLimiterMiddleware;

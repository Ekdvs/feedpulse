import rateLimit, { Options } from "express-rate-limit";

export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // max 5 requests per IP
  standardHeaders: true, // return rate limit info in headers
  legacyHeaders: false,  // disable old headers

  message: {
    success: false,
    error: true,
    message: "Too many submissions. Try again later."
  }
} as Options);
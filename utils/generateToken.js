// ==================== Token Utilities ====================
// Provides functions for generating JWT and refresh tokens

// JWT for token generation
import jwt from "jsonwebtoken";

// Generate a JWT token for a user (expires in 24h)
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Generate a refresh token for a user (expires in 30 days)
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

// Generate an invite token for a workspace (expires in 15 minutes)
export const generateInviteToken = (inviteCode) => {
  return jwt.sign({ code: inviteCode }, process.env.INVITE_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

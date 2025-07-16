// ==================== Hash Utilities ====================
// Provides functions for hashing values using bcrypt and crypto

// Bcrypt for password hashing
import bcrypt from "bcryptjs";

// Crypto for general-purpose hashing
import crypto from "crypto";

// Hash a value using bcrypt (asynchronously)
export const bcryptHash = async (value) => {
  const hashedBcrypt = await bcrypt.hash(value, 12);
  return hashedBcrypt;
};

// Hash a value using crypto (synchronously)
export const cryptoHash = (value) => {
  const hashedCrypto = crypto
    .createHash("sha3-256")
    .update(value)
    .digest("hex");
  return hashedCrypto;
};

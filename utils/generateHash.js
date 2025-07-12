import bcrypt from "bcryptjs";
import crypto from "crypto";

// Hash using BCRYPT
export const bcryptHash = async (value) => {
  const hashedBcrypt = await bcrypt.hash(value, 12);

  return hashedBcrypt;
};

// Hash using CRYPTO
export const cryptoHash = (value) => {
  const hashedCrypto = crypto
    .createHash("sha3-256")
    .update(value)
    .digest("hex");

  return hashedCrypto;
};

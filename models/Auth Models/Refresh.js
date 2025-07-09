import mongoose from "mongoose";

const RefreshSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "30d" },
});

const RefreshToken = mongoose.model("Refresh Token", RefreshSchema);
export default RefreshToken;

// export const refreshTokenHandler = async (req, res, next) => {
//   const token = req.cookies.refreshToken;

//   if (!token) return next(new ApiError(401, "Refresh token missing"));

//   try {
//     const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

//     // Check DB
//     const existingToken = await RefreshToken.findOne({ token, user: payload.userId });
//     if (!existingToken || existingToken.expiresAt < new Date())
//       return next(new ApiError(401, "Invalid or expired refresh token"));

//     // Issue new access token
//     const newAccessToken = generateToken(payload.userId);

//     // Optional: rotate refresh token
//     res.cookie("loginToken", newAccessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({ message: "Token refreshed", loginToken: newAccessToken });
//   } catch (err) {
//     return next(new ApiError(401, "Invalid refresh token"));
//   }
// };

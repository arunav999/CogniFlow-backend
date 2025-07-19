// Cookie options
export const cookieOptions = (maxAge) => {
  const checkData =
    maxAge !== undefined && maxAge !== null && maxAge.trim() !== "";

  // If max age is defined
  if (checkData) {
    // Expiry times for cookies
    const fifteenMinutes = 15 * 60 * 1000; // Expires in 15 minutes
    const OneDay = 24 * 60 * 60 * 1000; // Expires in 24 hours
    const ThirtyDays = 30 * 24 * 60 * 60 * 1000; // Expires in 30 days

    let validity;
    // For 15 minutes
    if (maxAge === "15m") {
      validity = fifteenMinutes;
    }

    // For 24 hours
    if (maxAge === "24hr") {
      validity = OneDay;
    }

    // For 30days
    if (maxAge === "30d") {
      validity = ThirtyDays;
    }

    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
      path: "/",
      maxAge: validity,
    };
  }

  //  If max age not there
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
    path: "/",
  };
};

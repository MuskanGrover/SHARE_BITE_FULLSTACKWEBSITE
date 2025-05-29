const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = (req, res, next) => {
  const token = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken; // Store refresh token in cookies

  if (!token) {
    return res.status(403).render("login", {
      title: "Login",
      error: "You must be logged in to access this page.",
    });
  }

  try {
    // Verify access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" && refreshToken) {
      try {
        // Verify refresh token
        const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Set new access token in cookies
        res.cookie("authToken", newAccessToken, { httpOnly: true, secure: true });

        req.user = refreshDecoded;
        return next(); // Proceed with the request
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        return res.status(403).render("login", { title: "Login", error: "Session expired, please log in again." });
      }
    }

    console.error("Authentication error:", error);
    return res.status(403).render("login", { title: "Login", error: "Invalid or expired token." });
  }
};

module.exports = authenticateUser;

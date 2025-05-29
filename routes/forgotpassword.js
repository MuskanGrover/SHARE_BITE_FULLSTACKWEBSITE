// // routes/forgotPassword.js
// const express = require("express");
// const router = express.Router();
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const User = require("../models/User");
// const PasswordReset = require("../models/passwordreset");

// router.post("/forgotpassword", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "No account with that email found." });
//     }

//     // Generate token and expiration
//     const token = crypto.randomBytes(32).toString("hex");
//     const expiresAt = Date.now() + 3600000; // Token valid for 1 hour

//     // Create a password reset record
//     await PasswordReset.create({
//       email,
//       resetToken: token,
//       expiresAt,
//       used: false,
//     });

//     // Configure and send email (ensure you replace credentials and settings accordingly)
//     const resetURL = `http://your-domain.com/reset-password/${token}`;
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: "YOUR_EMAIL@gmail.com",
//         pass: "YOUR_EMAIL_PASSWORD",
//       },
//     });
//     await transporter.sendMail({
//       to: email,
//       from: "YOUR_EMAIL@gmail.com",
//       subject: "Password Reset",
//       text: `You requested a password reset. Click here to reset: ${resetURL}`,
//     });

//     res.json({ message: "Password reset link sent to your email." });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// });



// In routes/forgotPassword.js (continuing)
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs"); // Use bcryptjs for better compatibility
const User = require("../models/User");
const PasswordReset = require("../models/passwordreset");

// ✅ Route: Render Forgot Password Form
router.get("/forgotpassword", (req, res) => {
  const email = req.query.email || "";
  res.render("forgotpassword", { email });
});

// ✅ Route: Handle Forgot Password Request
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("No account with that email found.");
    }

    // 2️⃣ Generate Reset Token (Valid for 1 Hour)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 3600000; // 1 hour

    // 3️⃣ Store Token in Database
    await PasswordReset.create({
      email,
      resetToken: token,
      expiresAt,
      used: false,
    });

    // 4️⃣ Set Up Nodemailer Transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "m34701910@gmail.com",
        pass: "lavqxldecgiwyxrc", // Use an app password
      },
    });

    // 5️⃣ Send Password Reset Email
    const resetURL = `http://localhost:3000/resetpassword/${token}`;
    await transporter.sendMail({
      to: email,
      from: "m34701910@gmail.com",
      subject: "Password Reset",
      text: `You requested a password reset. Click this link to reset your password: ${resetURL}`,
    });

    res.send("Password reset link sent to your email.");
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).send("Server error.");
  }
});

// ✅ Route: Render Password Reset Form
router.get("/resetpassword/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Find a valid, unused, non-expired token
    const resetRecord = await PasswordReset.findOne({
      resetToken: token,
      used: false,
      expiresAt: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!resetRecord) {
      return res.status(400).send("Password reset token is invalid or has expired.");
    }

    res.render("resetPasswordForm", { token });
  } catch (error) {
    console.error("Reset password page error:", error);
    res.status(500).send("Server error.");
  }
});

// ✅ Route: Handle Password Reset
router.post("/resetpassword", async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");
    }

    try {
        const resetRequest = await PasswordReset.findOne({ resetToken: token });

        if (!resetRequest || resetRequest.expiresAt < Date.now()) {
            return res.status(400).send("Invalid or expired token.");
        }

        const user = await User.findOne({ email: resetRequest.email });

        if (!user) {
            return res.status(400).send("User not found.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔥 Force updating the password directly in DB
        const updateResult = await User.updateOne(
            { email: resetRequest.email },
            { $set: { password: hashedPassword } }
        );

        console.log("Password Update Result:", updateResult);

        if (updateResult.modifiedCount === 0) {
            return res.status(500).send("Failed to update password.");
        }

        await PasswordReset.deleteOne({ resetToken: token });

        res.send("Password has been reset successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error.");
    }
});

module.exports = router;

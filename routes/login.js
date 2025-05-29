const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

require('dotenv').config();  // Load environment variables

// Render login page
router.get('/login', (req, res) => {
  res.render('login.ejs', { title: 'Login' });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(400).render("loginreport", { 
        title: "Login Failed", 
        error: "Invalid email or password." 
      });
    }

    console.log("Stored Hashed Password in DB:", user.password); // Debugging

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Password does not match");
      return res.status(400).render("loginreport", { 
        title: "Login Failed", 
        error: "Invalid email or password." 
      });
    }

    console.log("Password Matched, Generating JWT");

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30m" });

    // Store the token in a secure cookie
    res.cookie("authToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    // Redirect user to the login success page
    res.render("loginreport", {
      title: "Login Successful",
      message: "You have successfully logged in!",
      links: {
        home: "/" // Link to the Home page after successful login
      },
      error: "" // Pass an empty error to avoid issues in the template
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).render("loginreport", { 
      title: "Login Failed", 
      error: "An error occurred. Please try again later." 
    });
  }
});
module.exports=router;
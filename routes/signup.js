const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const User = require("../models/Usersign"); // Import the User model
const app = express();
const router = express.Router();

// Middleware for parsing form data and serving static files
router.use(express.static(path.join(__dirname, "public")));
router.use(express.urlencoded({ extended: true }));

router.get("/signup", (req, res) => {
  res.render("signup.ejs", { title: "Signup" });
});

// Handle signup form submission
router.post("/signup", async (req, res) => {
  const { name, email, password, confirmpassword, usertype } = req.body;

  // Validation
  if (!name || !email || !password || !confirmpassword || !usertype) {
    return res.status(400).send("All fields are required.");
  }

  if (password !== confirmpassword) {
    return res.status(400).send("Passwords do not match.");
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("registerStatus.ejs", {
        title: "Registration Failed",
        message: "Email is already registered. Please use another email.",
        data: {
          name,
          email,
          usertype,
        },
      });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password, // The password will be hashed using the pre-save hook in userSchema
      usertype,
    });

    // Save the user and return a success message
    await newUser.save();
    res.render("registerStatus.ejs", {
      title: "Registration Successful",
      message: "Your account has been successfully created!",
      data: {
        name,
        email,
        usertype,
      },
    });
  } catch (err) {
    // Handle validation and server errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((error) => error.message);
      return res.status(400).send(messages.join(", "));
    }

    console.error(err);
    res.render("registerStatus.ejs", {
      title: "Registration Failed",
      message: "There was an error while creating your account. Please try again later.",
      data: {
        name,
        email,
        usertype,
      },
    });
  }
});

module.exports = router;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (v) {
        // Password should contain at least:
        // 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return regex.test(v);
      },
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    },
  },
  usertype: {
    type: String,
    required: true,
    enum: {
      values: ["donor", "recipient", "volunteer"],
      message: "User type must be 'donor', 'recipient', or 'volunteer'",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to hash passwords before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password hasn't changed
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Email is already registered. Please use another email."));
  } else {
    next(error);
  }
});

// Export the model
const User=mongoose.models.User || mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);

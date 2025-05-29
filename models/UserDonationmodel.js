const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
},
  foodType: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Snacks', 'Fruits', 'Bakery Items', 'Beverages', 'Other'], // Allowed categories
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => value > 0, // Ensure quantity is greater than 0
      message: 'Quantity should be a valid number greater than 0',
    },
  },
  pickupDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > new Date(); // Ensure the pickup date is in the future
      },
      message: 'Pickup date should be in the future',
    },
  }, completeAddress: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON type must be 'Point'
    },
    coordinates: {
      type: [Number], // Expecting an array [longitude, latitude]
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length === 2 &&
            value.every((num) => typeof num === 'number')
          );
        },
        message: 'Coordinates must be an array of two numbers [longitude, latitude].',
      },
    },
  },
  contactInfo: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[0-9]{10}$/.test(value), // Validate 10-digit phone number
      message: 'Contact information should be a valid 10-digit phone number.',
    },
  },
  isFeatured: {
    type: Boolean,
    default: false, // Default is false
  },
});

// **Pre-save middleware to set `isFeatured` automatically**
donationSchema.pre('save', function (next) {
  const currentDate = new Date();
  const daysUntilPickup = Math.ceil((this.pickupDate - currentDate) / (1000 * 60 * 60 * 24)); // Calculate days until pickup

  if (this.quantity > 1000 || daysUntilPickup <= 3) {
    this.isFeatured = true; // Auto-feature based on conditions
  }

  next();
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;

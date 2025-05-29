const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  foodType: { 
    type: String, 
    required: true,
    enum: [
      'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Snacks', 
      'Fruits', 'Bakery Items', 'Beverages', 'Other'
    ],
    message: 'Invalid food type selected'
  },
  quantity: { 
    type: String, 
    required: true, 
    validate: {
      validator: (value) => {
        return !isNaN(value) && value > 0; // Ensure quantity is a positive number
      },
      message: 'Quantity should be a valid number greater than 0'
    }
  },
  pickupDate: { 
    type: Date, 
    required: true, 
    validate: {
      validator: (value) => {
        return value > new Date(); // Ensure the pickup date is in the future
      },
      message: 'Pickup date should be in the future'
    }
  },
  location: { 
    type: String, 
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  contactInfo: { 
    type: String, 
    required: true,
    validate: {
      validator: (value) => {
        return /^[0-9]{10}$/.test(value);  // Ensure it's a 10-digit phone number
      },
      message: 'Contact information should be a valid 10-digit phone number'
    }
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  }
});

// Automatically set 'isFeatured' before saving
donationSchema.pre('save', function(next) {
    if (this.quantity > 2000) {
        this.isFeatured = true; 
    } else {
        this.isFeatured = false; 
    }
    next();
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;

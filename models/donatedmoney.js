const mongoose = require('mongoose');

const donationmoneySchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: (props) => `${props.value} is not a valid email!`,
        }
    },
    amount: {
        type: Number, // Ensure "Number" has a capital N
        required: true
    },
    // New field to mark if the donation is completed (after payment)
    isDonated: {
        type: Boolean,
        default: false
    }
});

const DonationMoney = mongoose.model('DonationMoney', donationmoneySchema);
module.exports = DonationMoney;

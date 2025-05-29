
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const Donation = require('../models/UserDonationmodel');
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
});

// GET request to render the donation form
router.get('/', authenticateUser, (req, res) => {
  res.render('donatefood.ejs', {
    title: 'Donate Food',
    errorMessage: null,
    successMessage: null,
    data: {},
  });
});

// POST request to handle donation form submission
router.post('/', authenticateUser, async (req, res) => {
  console.log("Received data:", req.body);  // Debugging line

  const { email, foodType, quantity, pickupDate, completeAddress, contactInfo } = req.body;

  if (!email || !foodType || !quantity || !pickupDate || !completeAddress || !contactInfo) {
    return res.render('errorPage.ejs', {
      title: 'Donation Error',
      message: 'All fields are required.',
    });
  }


  if (parseFloat(quantity) <= 0) {
    return res.render('errorPage.ejs', {
      title: 'Donation Error',
      message: 'Quantity must be a positive number.',
    });
  }

  if (new Date(pickupDate) <= new Date()) {
    return res.render('errorPage.ejs', {
      title: 'Donation Error',
      message: 'Pickup date must be in the future.',
    });
  }

  // Validate the address format
 
  if (!completeAddress) {
    return res.render('errorPage.ejs', {
      title: 'Donation Error',
      message: 'Invalid location format. Please enter a valid address.',
    });
  }

  if (!/^[0-9]{10}$/.test(contactInfo)) {
    return res.render('errorPage.ejs', {
      title: 'Donation Error',
      message: 'Contact info must be a valid 10-digit phone number.',
    });
  }

  try {
    // Geocode the location to get latitude and longitude
    const geocodeResult = await geocoder.geocode(completeAddress);
    if (!geocodeResult.length) {
      return res.render('errorPage.ejs', {
        title: 'Donation Error',
        message: 'Unable to locate the specified address. Please try again.',
      });
    }

    const { latitude, longitude, formattedAddress } = geocodeResult[0];

    // Save the donation to the database
    const newDonation = new Donation({
      email,
      foodType,
      quantity,
      pickupDate,
      completeAddress, // Store complete address in the correct field
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // Store lat/lng for mapping
      },
      contactInfo,
    });

    await newDonation.save();

    return res.render('errorPage.ejs', {
      title: 'Donation Success',
      message: 'Your donation was successfully created!',
      data: {
        email,
        foodType,
        quantity,
        pickupDate,
        completeAddress,
        location: `Lat: ${latitude}, Lng: ${longitude}`,
        contactInfo,
      },
    });
  } catch (error) {
    console.error(error);
    return res.render('errorPage.ejs', {
      title: 'Donation Error',
      message: 'An error occurred while creating the donation. Please try again.',
      data: {
        foodType,
        quantity,
        pickupDate,
        completeAddress,
        contactInfo,
      },
    });    
  }
});

module.exports = router;

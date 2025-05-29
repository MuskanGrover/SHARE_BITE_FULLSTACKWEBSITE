const express = require("express");
const router = express.Router();
const Donation = require("../models/UserDonationmodel");
const geocoder = require("node-geocoder")({ provider: "openstreetmap" });

// GET route to find donations by location
router.get("/finddonation/search", async (req, res) => {
  const { location, radius = 50000, page = 1, limit = 10 } = req.query;

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  try {
    // Geocode the provided location
    const geocodeResult = await geocoder.geocode(location);
    if (!geocodeResult.length) {
      return res.status(404).json({ error: "Unable to find the specified location" });
    }

    const { latitude, longitude } = geocodeResult[0];

    // Fetch donations within the specified radius
    const nearbyDonations = await Donation.find({
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: parseInt(radius), // Radius in meters
        },
      },
    })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // Return results with metadata
    return res.json({
      metadata: {
        total: nearbyDonations.length,
        page: parseInt(page),
        limit: parseInt(limit),
        radius: parseInt(radius),
      },
      donations: nearbyDonations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while fetching donations" });
  }
});

module.exports = router;

const express = require("express");
const path = require("path");
const router = express.Router();
const Donation = require("../models/UserDonationmodel"); // Import the Donation model
const mongoose = require("mongoose");

router.use(express.static(path.join(__dirname, "public")));


// Use dynamic import for node-fetch
router.get("/finddonation", (req, res) => {
    res.render("finddonation"); // Renders the search page
});

// ✅ 2. Route to Fetch Nearby Donations Based on Location
router.get("/finddonation/search", async (req, res) => {
    try {
        let { latitude, longitude } = req.query;

        // Validate input
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: "Invalid latitude or longitude values" });
        }

        // Find donations within a 20 km radius
        const donations = await Donation.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [longitude, latitude] },
                    $maxDistance: 20000 // 20 km
                }
            }
        }).limit(50);

        if (donations.length === 0) {
            return res.status(404).json({ message: "No donation centers found nearby" });
        }

        res.json({ donations });

    } catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;

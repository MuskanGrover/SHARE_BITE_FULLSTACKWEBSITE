const express = require("express");
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Function to calculate distance (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Predefined donation locations (Hardcoded for all 5 featured donations)
    const donationLocations = {
     "haryana": { lat: 28.6818, lon: 76.9226 },
        "CP Delhi": { lat: 28.6315, lon: 77.2167 },                // Connaught Place, Delhi
        "KiitChowk": { lat: 20.3557, lon:85.8155 },                  // Mumbai, Maharashtra
        "Bangalore": { lat: 12.9716, lon: 77.5946 },               // Bangalore, Karnataka
        "KIIT Campus": { lat: 20.3224, lon: 85.8210 },             // Bhubaneswar, Odisha (Same as before)
                     
    
};

router.get("/claimdonation", (req, res) => {
    const { userLat, userLon, location } = req.query;

    if (!userLat || !userLon || !location || !donationLocations[location]) {
        return res.render("enablelocation", { message: "Invalid location. Please try again." });
    }

    const userLatitude = parseFloat(userLat);
    const userLongitude = parseFloat(userLon);

    if (isNaN(userLatitude) || isNaN(userLongitude)) {
        return res.render("enablelocation", { message: "Invalid location. Please try again." });
    }

    const donorLocation = donationLocations[location];
    const distance = getDistance(userLatitude, userLongitude, donorLocation.lat, donorLocation.lon);

    if (distance <= 20) {
        return res.redirect(`/tracking?userLat=${userLatitude}&userLon=${userLongitude}&donorLat=${donorLocation.lat}&donorLon=${donorLocation.lon}`);
    } else {
        return res.render("error", { message: "Your location (The Delievery Location)is too far for delivery.The Delievery Location must be under 20 km of range from The Donation Centre. Try a nearby one!" });
    }
});

module.exports = router;

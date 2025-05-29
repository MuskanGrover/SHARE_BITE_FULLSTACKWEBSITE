const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/tracking", (req, res) => {
    let { userLat, userLon, donorLat, donorLon } = req.query;

    // Convert to numbers
    userLat = parseFloat(userLat);
    userLon = parseFloat(userLon);
    donorLat = parseFloat(donorLat);
    donorLon = parseFloat(donorLon);

    if (isNaN(userLat) || isNaN(userLon) || isNaN(donorLat) || isNaN(donorLon)) {
        return res.render("error", { message: "Invalid location data." });
    }

    res.render("tracking", { userLat, userLon, donorLat, donorLon });
});
module.exports=router;
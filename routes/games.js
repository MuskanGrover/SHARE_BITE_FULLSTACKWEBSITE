
const express = require("express");
const router = express.Router();
const session = require("express-session");
const Game = require("../models/gamesmodel");
const Donation = require("../models/UserDonationmodel");
const UserBadge = require("../models/userbadge");
const path = require("path");

router.use(express.static(path.join(__dirname, "../public")));

router.use(
    session({
        secret: "a9b8f9c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5g6",
        resave: false,
        saveUninitialized: true,
    })
);

// --------------------- User Form Page ---------------------
router.get("/games", (req, res) => {
    res.render("userform.ejs", { title: "Enter Your Details" });
});

router.post("/games", async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

        let user = await Game.findOne({ email });
        if (!user) {
            user = new Game({ name, email, score: 0 });
            await user.save();
        }

        const badgeData = await UserBadge.findOne({ email });
        const badge = badgeData ? badgeData.badge : "None";

        req.session.userEmail = email;
        req.session.userName = name;
        req.session.badge = badge;

        res.render("games.ejs", { badge });
    } catch (error) {
        console.error("Error storing user info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// --------------------- Game One ---------------------
router.get("/gameone", async (req, res) => {
    if (!req.session.userEmail) return res.redirect("/games");
    const badgeData = await UserBadge.findOne({ email: req.session.userEmail });
    const badge = badgeData ? badgeData.badge : "None";
    res.render("quiztrivia.ejs", { email: req.session.userEmail, badge });
});

router.post("/gameone", async (req, res) => {
    await updateGameScore(req, res);
});

// --------------------- Game Two ---------------------
router.get("/gametwo", async (req, res) => {
    if (!req.session.userEmail) return res.redirect("/games");
    const badgeData = await UserBadge.findOne({ email: req.session.userEmail });
    const badge = badgeData ? badgeData.badge : "None";
    res.render("herogame.ejs", { email: req.session.userEmail, badge });
});

router.post("/gametwo", async (req, res) => {
    await updateGameScore(req, res);
});

// --------------------- Game Three ---------------------
router.get("/gamethree", async (req, res) => {
    if (!req.session.userEmail) return res.redirect("/games");
    const badgeData = await UserBadge.findOne({ email: req.session.userEmail });
    const badge = badgeData ? badgeData.badge : "None";
    res.render("snakefoodgame.ejs", { email: req.session.userEmail, badge });
});

router.post("/gamethree", async (req, res) => {
    await updateGameScore(req, res);
});

// --------------------- Game Four ---------------------
router.get("/gamefour", async (req, res) => {
    if (!req.session.userEmail) return res.redirect("/games");
    const badgeData = await UserBadge.findOne({ email: req.session.userEmail });
    const badge = badgeData ? badgeData.badge : "None";
    res.render("hidegame.ejs", { email: req.session.userEmail, badge });
});

router.post("/gamefour", async (req, res) => {
    await updateGameScore(req, res);
});

// --------------------- Badge Assignment Logic ---------------------
const assignBadge = async (email) => {
    try {
        const totalGamePoints = await Game.aggregate([
            { $match: { email } },
            { $group: { _id: null, totalScore: { $sum: "$score" } } }
        ]);

        const totalDonations = await Donation.aggregate([
            { $match: { email } },
            { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
        ]);

        const gamePoints = totalGamePoints.length > 0 ? totalGamePoints[0].totalScore : 0;
        const donationQuantity = totalDonations.length > 0 ? totalDonations[0].totalQuantity : 0;
        const totalContribution = gamePoints + donationQuantity;

        let badge = null;
        if (totalContribution >= 150000) badge = "Gold";
        else if (totalContribution >= 120000) badge = "Silver";
        else if (totalContribution >= 100) badge = "Bronze";

        if (badge) {
            await UserBadge.findOneAndUpdate(
                { email },
                { $set: { email, badge } },
                { upsert: true, new: true }
            );
        }
    } catch (error) {
        console.error("Error assigning badge:", error);
    }
};

// --------------------- Game Score Update Logic ---------------------
const updateGameScore = async (req, res) => {
    const { score, winner } = req.body;
    const email = req.session.userEmail;
    if (!email) return res.status(400).json({ message: "User email is required. Please log in." });

    try {
        let user = await Game.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });

        let numericScore = score !== undefined ? Number(score) : 0;
        if (isNaN(numericScore)) return res.status(400).json({ message: "Score must be a valid number." });

        if (winner === true && !req.session.winnerBonusApplied) {
            user.score += 100;
            req.session.winnerBonusApplied = true;
        } else {
            user.score += numericScore;
        }

        await user.save();
        await assignBadge(email);

        res.json({ message: "Score updated successfully!", totalScore: user.score });

    } catch (error) {
        console.error("Error updating score:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
router.get("/mealreward", async (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect("/games");
  }

  // Check if badge is stored in session; if not, fetch from DB
  let badge = req.session.badge;

  if (!badge) {
    // Fetch badge from DB if not in session
    const badgeData = await UserBadge.findOne({ email: req.session.userEmail });
    badge = badgeData ? badgeData.badge : "None";
    req.session.badge = badge; // Cache it in session
  }

  if (badge === "Gold") {
    return res.render("mealreward.ejs");
  } else {
    return res.status(403).send("Access denied. You do Not have a Gold badge.");
  }
});
router.get("/eventinvite", async (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect("/games");
  }

  let badge = req.session.badge;

  if (!badge) {
    const badgeData = await UserBadge.findOne({ email: req.session.userEmail });
    badge = badgeData ? badgeData.badge : "None";
    req.session.badge = badge;
  }

  if (badge === "Gold") {
    // Random event locations
    const eventLocations = [
      {
        name: "Central Park Community Hall, NYC",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.8502514481153!2d-73.97762068459254!3d40.785091179324465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2589d87a99a23%3A0x61e9b7a9d415a478!2sCentral%20Park!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus"
      },
      {
        name: "Grand Ballroom, The Plaza Hotel, NYC",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.187436871584!2d-73.97418708459455!3d40.76435637932607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258f9db66a7bb%3A0x9f88bcaba8ca420d!2sThe%20Plaza%20Hotel!5e0!3m2!1sen!2sus!4v1600000000001!5m2!1sen!2sus"
      },
      {
        name: "Skyline Terrace, Chicago",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2968.784755745786!2d-87.62317748455091!3d41.88183297922125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca6e7e385af%3A0x29cc465a46a6afeb!2sChicago%20Skyline!5e0!3m2!1sen!2sus!4v1600000000002!5m2!1sen!2sus"
      }
    ];

    // Pick one randomly
    const randomEvent = eventLocations[Math.floor(Math.random() * eventLocations.length)];

    // Set date/time for the event (fixed or dynamic)
    const eventDate = "June 15, 2025";
    const eventTime = "6:00 PM - 9:00 PM";

    return res.render("eventinvite.ejs", {
      eventName: "Meal of Happiness VIP Celebration",
      locationName: randomEvent.name,
      mapEmbed: randomEvent.mapEmbed,
      date: eventDate,
      time: eventTime,
      description: "Join us for an exclusive evening full of joy, food, and fun activities specially curated for our Gold Badge heroes!"
    });
  } else {
    return res.status(403).send("Access denied. This invitation is exclusive to Gold badge holders.");
  }
});


module.exports = router;

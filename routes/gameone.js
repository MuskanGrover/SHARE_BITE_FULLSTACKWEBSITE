const express = require("express");
const router = express.Router();
const QuizScore = require("../models/gamesmodel"); // Import the correct model

// Route to render the quiz trivia game page
router.get("/gameone", async (req, res) => {
    if (!req.session.userEmail) {
        return res.redirect("/login"); // Redirect if not logged in
    }

    const email = req.session.userEmail;

    try {
        // Fetch the current score from the database
        let userScore = await QuizScore.findOne({ email });

        // If no score entry exists, initialize it
        if (!userScore) {
            userScore = new QuizScore({ email, score: 0 });
            await userScore.save();
        }

        res.render("quiztrivia.ejs", { userEmail: email, userScore: userScore.score });

    } catch (error) {
        console.error("Error fetching score:", error);
        res.render("quiztrivia.ejs", { userEmail: email, userScore: 0 });
    }
});

// Route to save the quiz score
router.post("/gameone", async (req, res) => {
    try {
        if (!req.session.userEmail) {
            return res.status(401).json({ message: "User not logged in." });
        }

        const email = req.session.userEmail;
        let { score } = req.body;

        // Ensure score is a valid number
        score = Number(score);
        if (isNaN(score) || score < 0) {
            return res.status(400).json({ message: "Invalid score." });
        }

        // Find or create the user's score entry
        let userScore = await QuizScore.findOne({ email });

        if (userScore) {
            userScore.score += score; // Add to existing score
        } else {
            userScore = new QuizScore({ email, score });
        }

        await userScore.save(); // Save updated score

        req.session.totalScore = userScore.score; // Update session

        res.status(200).json({ message: "Score updated successfully.", totalScore: userScore.score });

    } catch (error) {
        console.error("Error saving score:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;

const express = require("express");
const path = require("path");
const router = express.Router();

const DonationMoney = require("../models/donatedmoney");
const authMiddleware = require("../middleware/authMiddleware");

router.use(express.static(path.join(__dirname, "public")));

// Render the donation page
router.get("/donatemoney", authMiddleware, (req, res) => {
    res.render("donatemoney.ejs", { title: "Donate Money" });
});

router.post('/donate/upi', async (req, res) => {
  const { name, email, amount } = req.body;

  try {
    await Donation.create({
      name,
      email,
      amount,
      method: 'UPI',
      date: new Date()
    });
    res.status(200).send('UPI donation logged.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving UPI donation.');
  }
});

router.post('/donate/card', async (req, res) => {
  const { name, email, amount } = req.body;

  try {
    await Donation.create({
      name,
      email,
      amount,
      method: 'Card',
      date: new Date()
    });
    res.status(200).send('Card donation logged.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving card donation.');
  }
});

module.exports = router;

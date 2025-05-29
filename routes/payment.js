const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route for UPI confirmation
router.post("/donate/upi", upload.single("screenshot"), async (req, res) => {
  const { name, email, amount, transactionId } = req.body;
  const screenshotPath = req.file?.path;

  if (!name || !email || !amount || !transactionId || !screenshotPath) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Save to DB or log
  try {
    // Example: save to MongoDB
    // await Donation.create({ name, email, amount, transactionId, screenshotPath });

    res.status(200).json({ message: "Donation confirmation received" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Donation = require('../models/UserDonationmodel'); // Your Donation model

// In routes/trackdonation.js (or your relevant route file)
router.get('/donationtracker', async (req, res) => {
    try {
      const donationGoal = 90000; // e.g., 1000 kg is the goal
  
      // 1) Aggregate total donation for the progress bar
      const result = await Donation.aggregate([
        { $group: { _id: null, totalDonation: { $sum: '$quantity' } } }
      ]);
      const donationSoFar = result.length > 0 ? result[0].totalDonation : 0;
      const donationProgressPercent = Math.min((donationSoFar / donationGoal) * 100, 100);
  
      // 2) Get the top 3 donors by total quantity
      //    Replace `donorName` with whatever field you store the donor’s name in your `Donation` schema.
      const topDonorsRaw = await Donation.aggregate([
        {
          $group: {
            _id: '$donorName', // or '$email', if that's how you track donors
            totalDonation: { $sum: '$quantity' }
          }
        },
        { $sort: { totalDonation: -1 } },
        { $limit: 3 }
      ]);
  
      // 3) Map the aggregator result to a simpler array for the EJS template
      const topDonors = topDonorsRaw.map(d => ({
        name: d._id,
        totalDonation: d.totalDonation
      }));
  
      // 4) Render the EJS template
      res.render('donationtracker', { 
        donationGoal, 
        donationSoFar, 
        donationProgressPercent,
        topDonors
      });
    } catch (error) {
      console.error("Error aggregating donation data:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
module.exports=router;  
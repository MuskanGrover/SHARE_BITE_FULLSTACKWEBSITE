const express=require("express");
const path=require("path");
const router=express.Router();
const app=express();

router.use(express.static(path.join(__dirname, "public")));
router.get("/contactus", (req, res) => {
    res.render("contactus.ejs", { title: "ContactUs" });
  });
const ContactMessage = require('../models/contactus');
const nodemailer = require('nodemailer');

router.post('/contactus', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Save to database
        const newMessage = new ContactMessage({ name, email, message });
        await newMessage.save();

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: "m34701910@gmail.com",
              pass: "lavqxldecgiwyxrc", 
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Message Received',
            text: `Hello ${name},\n\nThank you for contacting us. We have received your message and will respond soon.\n\nBest Regards,\nFood Donation Team`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Your message has been sent. Thank you!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

module.exports = router;


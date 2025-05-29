const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
//const authenticateUser = require("./middleware/authMiddleware"); // Include the authentication middleware



// Middleware setup
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
      }
  }
}));


// Static files
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
const privacyRoutes = require("./routes/privacypolicy");
app.use(privacyRoutes);

const termsofService = require("./routes/termsofservice");
app.use(termsofService);

const contactUs = require("./routes/contactus");
app.use(contactUs);

const donateMoney = require("./routes/donatemoney");
app.use( donateMoney); // Apply the authenticateUser middleware to the /donatemoney route

const Partners = require("./routes/partners");
app.use(Partners);

const faq = require("./routes/faq");
app.use(faq);

// Routes for user-related actions
const signupRoutes = require("./routes/signup");
app.use(signupRoutes);

const loginRoutes = require("./routes/login");
app.use(loginRoutes);

const aboutRoutes = require("./routes/about");
app.use(aboutRoutes);

const claimdonation=require("./routes/claimdonation");
app.use(claimdonation);

const donateRoutes = require("./routes/donate");
app.use("/donate", donateRoutes);

const trackRoutes=require("./routes/tracking");
app.use(trackRoutes);

const findDonationRoutes = require("./routes/finddonate");
app.use( findDonationRoutes);

const forgotpass=require("./routes/forgotpassword");
app.use(forgotpass);


const trackDonationRoutes = require("./routes/trackdonation");
app.use(trackDonationRoutes);

const gamesRoutes = require("./routes/games");

if (typeof gamesRoutes === "function" || gamesRoutes.router) {
    app.use(gamesRoutes);
} else {
    console.error("Error: gamesRoutes is not a valid middleware function.");
}


const searchRoutes = require("./routes/searchDonation");
app.use(searchRoutes);

const chatbotRoutes = require('./routes/chatbotRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(chatbotRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("indexnew.ejs", { title: "HomePage" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong! Please try again later." });
});

// MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

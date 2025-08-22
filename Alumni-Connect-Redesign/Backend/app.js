const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookiesParser = require("cookie-parser");
const app = express();
const rateLimiter = require('./src/middlewares/rateLimiter');
const router = require("./src/routes");

const passport = require("./passport");
const session = require('express-session');

app.use(rateLimiter);
app.use(express.json());

app.use(cors());
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static(`${__dirname}/public`));
app.use(cookiesParser());
app.use("/", router);

// Session and passport setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    // Successful authentication, redirect to frontend dashboard
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173/dashboard');
  }
);

const PORT = process.env.PORT || 5000;

// mongoose.set("useFindAndModify", false);
async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      autoIndex: true,
    });
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
}
connectDB();

const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB connection established successfully.");
});

app.listen(PORT, function () {
  console.log("Server is running on port : ", PORT);
});

module.exports = app;

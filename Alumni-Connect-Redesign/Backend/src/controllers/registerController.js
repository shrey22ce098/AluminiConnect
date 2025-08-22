// controllers/registerController.js
const Alumni = require("../models/alumniModel");
const Professor = require("../models/professorModel");
const { User } = require("../models/user");
const bcrypt = require('bcryptjs');

const registerController = async (req, res) => {
  try {
    const {
      email,
      password,
      startYear,
      endYear,
      degree,
      branch,
      rollNumber,
      firstName,
      lastName,
      role,
    } = req.body;
    console.log("registerController 1");
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email is already registered. Please use a different email.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    let profile;
    if (role === "alumni") {
      profile = await Alumni.create({
        user: newUser._id,
        email,
        password: hashedPassword,
        startYear,
        endYear,
        degree,
        branch,
        rollNumber,
        firstName,
        lastName,
      });
    } else if (role === "professor") {
      profile = await Professor.create({
        user: newUser._id,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        department: req.body.department,
      });
    } else {
      // fallback for other roles, just return user
      profile = newUser;
    }

    res.status(201).json({
      status: "success",
      data: {
        profile,
      },
    });
  } catch (error) {
    console.log("registerController 2");
    console.error("Error during alumni registration:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = registerController;

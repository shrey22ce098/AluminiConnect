const Meeting = require("../models/meetingModel");

// Create a new meeting (Alumni only)
const createMeeting = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({ message: "Only alumni can create meetings." });
    }
    const { title, description, meetingLink, date, participants } = req.body;
    const meeting = await Meeting.create({
      title,
      description,
      meetingLink,
      date,
      participants,
      createdBy: req.user._id,
    });
    res.status(201).json({ meeting });
  } catch (error) {
    res.status(500).json({ message: "Error creating meeting", error });
  }
};

// Get all meetings (students, professors, alumni)
const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().populate("createdBy participants");
    res.status(200).json({ meetings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching meetings", error });
  }
};

module.exports = { createMeeting, getMeetings };

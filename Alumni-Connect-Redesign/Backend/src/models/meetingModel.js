const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  meetingLink: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

module.exports = Meeting;

const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const { createMeeting, getMeetings } = require("../controllers/meetingController");

// Alumni create meeting
router.post("/", checkAuth, createMeeting);
// All users get meetings
router.get("/", checkAuth, getMeetings);

module.exports = router;

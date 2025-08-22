const { User } = require("../models/userModel");

// Function to fetch all users
async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.error("Error during fetching all users:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
}

// Function to fetch alumni users whose isApproved is false
async function getUnapprovedAlumni(req, res) {
  try {
    const alumni = await User.find({ role: "alumni", isApproved: false });

    res.status(200).json({
      status: "success",
      data: {
        alumni,
      },
    });
  } catch (error) {
    console.error("Error during fetching unapproved alumni:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
}


const fs = require('fs');
const path = require('path');

// Audit log helper
function logAdminAction(adminId, action, details) {
  const logPath = path.join(__dirname, '../../admin_audit.log');
  const logEntry = `${new Date().toISOString()} | Admin: ${adminId} | Action: ${action} | Details: ${JSON.stringify(details)}\n`;
  fs.appendFileSync(logPath, logEntry);
}

// Approve user (alumni/professor)
async function approveUser(req, res) {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    user.isApproved = true;
    await user.save();
    logAdminAction(req.user._id, 'APPROVE_USER', { userId });
    res.status(200).json({ status: 'success', message: 'User approved' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
}

module.exports = {
  getAllUsers,
  getUnapprovedAlumni,
  approveUser,
};

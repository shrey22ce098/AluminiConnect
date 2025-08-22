const express = require('express');
const router = express.Router();
const { getAllUsers, getUnapprovedAlumni, approveUser } = require('../controllers/userController');
// Approve user (admin only)
router.post('/approve', checkAuth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Only admin can approve users.'
    });
  }
  next();
}, approveUser);
const checkAuth = require('../middlewares/checkAuth');

// Only admin can access user management endpoints
router.get('/all', checkAuth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Only admin can access all users.'
    });
  }
  next();
}, getAllUsers);

router.get('/unapproved-alumni', checkAuth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Only admin can access unapproved alumni.'
    });
  }
  next();
}, getUnapprovedAlumni);

module.exports = router;

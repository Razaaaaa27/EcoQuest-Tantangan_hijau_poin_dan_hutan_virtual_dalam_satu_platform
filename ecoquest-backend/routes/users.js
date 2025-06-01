const express = require('express');
const User = require('../models/User');
const { authenticate, optionalAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * @route   GET /api/users/profile/:username
 * @desc    Get user profile by username
 * @access  Public
 */
router.get('/profile/:username', optionalAuth, asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .select('-password -email');

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User tidak ditemukan'
    });
  }

  // Check privacy settings
  if (user.preferences.privacy.profileVisibility === 'private' && 
      (!req.user || req.user.id !== user._id.toString())) {
    return res.status(403).json({
      status: 'error',
      message: 'Profile ini bersifat privat'
    });
  }

  const userProfile = user.toObject();
  
  // Hide real name if user preference is set to false
  if (!user.preferences.privacy.showRealName && 
      (!req.user || req.user.id !== user._id.toString())) {
    userProfile.profile.fullName = undefined;
  }

  res.status(200).json({
    status: 'success',
    data: { user: userProfile }
  });
}));

/**
 * @route   GET /api/users/search
 * @desc    Search users
 * @access  Public
 */
router.get('/search', asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      status: 'error',
      message: 'Query pencarian minimal 2 karakter'
    });
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: 'i' } },
      { 'profile.fullName': { $regex: q, $options: 'i' } }
    ],
    'preferences.privacy.profileVisibility': { $ne: 'private' }
  })
    .select('username avatar gameStats.level profile.fullName')
    .sort('username')
    .skip(skip)
    .limit(limitNum);

  const total = await User.countDocuments({
    $or: [
      { username: { $regex: q, $options: 'i' } },
      { 'profile.fullName': { $regex: q, $options: 'i' } }
    ],
    'preferences.privacy.profileVisibility': { $ne: 'private' }
  });

  res.status(200).json({
    status: 'success',
    data: {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}));

module.exports = router;
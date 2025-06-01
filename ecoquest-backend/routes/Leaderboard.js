const express = require('express');
const User = require('../models/User');
const { optionalAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * @route   GET /api/leaderboard
 * @desc    Get leaderboard
 * @access  Public
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    timeFrame = 'all-time',
    page = 1,
    limit = 50
  } = req.query;

  // Build query based on timeFrame
  let dateFilter = {};
  const now = new Date();

  if (timeFrame === 'weekly') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = { updatedAt: { $gte: weekAgo } };
  } else if (timeFrame === 'monthly') {
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    dateFilter = { updatedAt: { $gte: monthAgo } };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get users sorted by points
  const users = await User.find(dateFilter)
    .select('username avatar gameStats statistics profile.fullName')
    .sort('-gameStats.totalPoints')
    .skip(skip)
    .limit(limitNum);

  // Add rank to each user
  const usersWithRank = users.map((user, index) => ({
    ...user.toObject(),
    rank: skip + index + 1
  }));

  // Get current user rank if authenticated
  let currentUserRank = null;
  if (req.user) {
    const allUsers = await User.find(dateFilter)
      .select('_id gameStats.totalPoints')
      .sort('-gameStats.totalPoints');
    
    const userIndex = allUsers.findIndex(user => user._id.toString() === req.user.id);
    if (userIndex !== -1) {
      currentUserRank = {
        rank: userIndex + 1,
        user: await User.findById(req.user.id)
          .select('username avatar gameStats statistics profile.fullName')
      };
    }
  }

  const total = await User.countDocuments(dateFilter);

  res.status(200).json({
    status: 'success',
    data: {
      users: usersWithRank,
      currentUserRank,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      timeFrame
    }
  });
}));

/**
 * @route   GET /api/leaderboard/top
 * @desc    Get top 3 users
 * @access  Public
 */
router.get('/top', asyncHandler(async (req, res) => {
  const topUsers = await User.find()
    .select('username avatar gameStats statistics profile.fullName')
    .sort('-gameStats.totalPoints')
    .limit(3);

  const topUsersWithRank = topUsers.map((user, index) => ({
    ...user.toObject(),
    rank: index + 1
  }));

  res.status(200).json({
    status: 'success',
    data: { users: topUsersWithRank }
  });
}));

module.exports = router;

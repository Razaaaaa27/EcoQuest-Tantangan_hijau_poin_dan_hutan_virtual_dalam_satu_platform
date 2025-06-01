// ecoquest-backend/routes/admin.js - Extended version

const express = require('express');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Post = require('../models/Post');
const EduContent = require('../models/EduContent');
const Forest = require('../models/Forest');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateChallenge, validateEduContent } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authenticate);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Private/Admin
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalChallenges,
    totalPosts,
    totalEduContent,
    activeUsers,
    activeChallenges,
    completedChallenges,
    totalForests
  ] = await Promise.all([
    User.countDocuments(),
    Challenge.countDocuments(),
    Post.countDocuments(),
    EduContent.countDocuments(),
    User.countDocuments({ 
      updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    }),
    Challenge.countDocuments({ status: 'active' }),
    Challenge.countDocuments({ status: 'completed' }),
    Forest.countDocuments()
  ]);

  // Calculate growth percentages (mock data for now)
  const stats = {
    totalUsers,
    totalChallenges,
    totalPosts,
    totalEduContent,
    activeUsers,
    activeChallenges,
    completedChallenges,
    totalForests,
    // Growth metrics (you can implement real calculations)
    userGrowth: 12.5,
    challengeGrowth: 8.3,
    postGrowth: 15.2,
    contentGrowth: 5.1
  };

  res.status(200).json({
    status: 'success',
    data: stats
  });
}));

/**
 * @route   GET /api/admin/analytics
 * @desc    Get analytics data
 * @access  Private/Admin
 */
router.get('/analytics', asyncHandler(async (req, res) => {
  const { period = '7d' } = req.query;
  
  let dateFilter = {};
  const now = new Date();
  
  switch (period) {
    case '24h':
      dateFilter = { $gte: new Date(now - 24 * 60 * 60 * 1000) };
      break;
    case '7d':
      dateFilter = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
      break;
    case '30d':
      dateFilter = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
      break;
    case '90d':
      dateFilter = { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
      break;
    default:
      dateFilter = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
  }

  // User registrations over time
  const userRegistrations = await User.aggregate([
    {
      $match: { createdAt: dateFilter }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  // Challenge completions over time
  const challengeCompletions = await Challenge.aggregate([
    {
      $unwind: "$participants"
    },
    {
      $match: {
        "participants.status": "completed",
        "participants.completedAt": dateFilter
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$participants.completedAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  // Most popular categories
  const popularCategories = await Challenge.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalParticipants: { $sum: { $size: "$participants" } }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // User levels distribution
  const userLevels = await User.aggregate([
    {
      $group: {
        _id: "$gameStats.level",
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      userRegistrations,
      challengeCompletions,
      popularCategories,
      userLevels,
      period
    }
  });
}));

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filters
 * @access  Private/Admin
 */
router.get('/users', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    sort = '-createdAt',
    level,
    status
  } = req.query;

  // Build query
  const query = {};
  
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { 'profile.fullName': { $regex: search, $options: 'i' } }
    ];
  }
  
  if (role) query.role = role;
  if (level) query['gameStats.level'] = parseInt(level);
  
  // Status filtering (active users in last 30 days)
  if (status === 'active') {
    query.updatedAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  } else if (status === 'inactive') {
    query.updatedAt = { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(query)
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await User.countDocuments(query);

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

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private/Admin
 */
router.put('/users/:id/role', asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({
      status: 'error',
      message: 'Role tidak valid'
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User tidak ditemukan'
    });
  }

  // Don't allow changing own role
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      status: 'error',
      message: 'Tidak dapat mengubah role diri sendiri'
    });
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: `Role user berhasil diubah menjadi ${role}`,
    data: { user }
  });
}));

/**
 * @route   PUT /api/admin/users/:id/suspend
 * @desc    Suspend/unsuspend user
 * @access  Private/Admin
 */
router.put('/users/:id/suspend', asyncHandler(async (req, res) => {
  const { suspended, reason } = req.body;
  
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User tidak ditemukan'
    });
  }

  // Don't allow suspending other admins
  if (user.role === 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Tidak dapat menangguhkan admin lain'
    });
  }

  user.suspended = suspended;
  if (suspended && reason) {
    user.suspensionReason = reason;
    user.suspendedAt = new Date();
  } else if (!suspended) {
    user.suspensionReason = undefined;
    user.suspendedAt = undefined;
  }

  await user.save();

  res.status(200).json({
    status: 'success',
    message: suspended ? 'User berhasil ditangguhkan' : 'Penangguhan user berhasil dicabut',
    data: { user }
  });
}));

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user and all related data
 * @access  Private/Admin
 */
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User tidak ditemukan'
    });
  }

  // Don't allow deleting other admins or self
  if (user.role === 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Tidak dapat menghapus admin lain'
    });
  }

  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      status: 'error',
      message: 'Tidak dapat menghapus akun sendiri'
    });
  }

  // Delete related data
  await Promise.all([
    Forest.findOneAndDelete({ user: req.params.id }),
    Post.deleteMany({ author: req.params.id }),
    Challenge.updateMany(
      { 'participants.user': req.params.id },
      { $pull: { participants: { user: req.params.id } } }
    ),
    EduContent.updateMany(
      { likes: req.params.id },
      { $pull: { likes: req.params.id } }
    ),
    EduContent.updateMany(
      { bookmarks: req.params.id },
      { $pull: { bookmarks: req.params.id } }
    )
  ]);

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'User dan semua data terkait berhasil dihapus'
  });
}));

/**
 * @route   GET /api/admin/challenges
 * @desc    Get all challenges for admin management
 * @access  Private/Admin
 */
router.get('/challenges', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    category,
    difficulty,
    sort = '-createdAt',
    search
  } = req.query;

  // Build query
  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (search) {
    query.$text = { $search: search };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const challenges = await Challenge.find(query)
    .populate('createdBy', 'username avatar')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await Challenge.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      challenges,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}));

/**
 * @route   POST /api/admin/challenges
 * @desc    Create new challenge
 * @access  Private/Admin
 */
router.post('/challenges', validateChallenge, asyncHandler(async (req, res) => {
  const challengeData = {
    ...req.body,
    createdBy: req.user._id
  };

  const challenge = await Challenge.create(challengeData);
  await challenge.populate('createdBy', 'username avatar');

  res.status(201).json({
    status: 'success',
    message: 'Challenge berhasil dibuat',
    data: { challenge }
  });
}));

/**
 * @route   PUT /api/admin/challenges/:id
 * @desc    Update challenge
 * @access  Private/Admin
 */
router.put('/challenges/:id', validateChallenge, asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge tidak ditemukan'
    });
  }

  Object.assign(challenge, req.body);
  await challenge.save();
  await challenge.populate('createdBy', 'username avatar');

  res.status(200).json({
    status: 'success',
    message: 'Challenge berhasil diupdate',
    data: { challenge }
  });
}));

/**
 * @route   PUT /api/admin/challenges/:id/featured
 * @desc    Toggle featured status of challenge
 * @access  Private/Admin
 */
router.put('/challenges/:id/featured', asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge tidak ditemukan'
    });
  }

  // If setting as featured, remove featured from other challenges
  if (!challenge.featured) {
    await Challenge.updateMany({}, { featured: false });
  }

  challenge.featured = !challenge.featured;
  await challenge.save();

  res.status(200).json({
    status: 'success',
    message: challenge.featured ? 'Challenge berhasil dijadikan featured' : 'Status featured challenge berhasil dihapus',
    data: { challenge }
  });
}));

/**
 * @route   DELETE /api/admin/challenges/:id
 * @desc    Delete challenge
 * @access  Private/Admin
 */
router.delete('/challenges/:id', asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge tidak ditemukan'
    });
  }

  await Challenge.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Challenge berhasil dihapus'
  });
}));

/**
 * @route   GET /api/admin/challenges/:id/participants
 * @desc    Get challenge participants with details
 * @access  Private/Admin
 */
router.get('/challenges/:id/participants', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  
  const challenge = await Challenge.findById(req.params.id)
    .populate({
      path: 'participants.user',
      select: 'username avatar email gameStats createdAt'
    });

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge tidak ditemukan'
    });
  }

  let participants = challenge.participants;
  
  // Filter by status if provided
  if (status) {
    participants = participants.filter(p => p.status === status);
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  const paginatedParticipants = participants.slice(skip, skip + limitNum);

  res.status(200).json({
    status: 'success',
    data: {
      participants: paginatedParticipants,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: participants.length,
        pages: Math.ceil(participants.length / limitNum)
      },
      challenge: {
        _id: challenge._id,
        title: challenge.title,
        totalParticipants: challenge.participants.length
      }
    }
  });
}));

/**
 * @route   GET /api/admin/edu-content
 * @desc    Get all educational content for admin
 * @access  Private/Admin
 */
router.get('/edu-content', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    type,
    status,
    sort = '-createdAt',
    search
  } = req.query;

  // Build query
  const query = {};
  if (category) query.category = category;
  if (type) query.type = type;
  if (status) query.status = status;
  if (search) {
    query.$text = { $search: search };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const eduContent = await EduContent.find(query)
    .populate('createdBy', 'username avatar')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await EduContent.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      eduContent,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}));

/**
 * @route   POST /api/admin/edu-content
 * @desc    Create new educational content
 * @access  Private/Admin
 */
router.post('/edu-content', validateEduContent, asyncHandler(async (req, res) => {
  const eduContentData = {
    ...req.body,
    createdBy: req.user._id
  };

  const eduContent = await EduContent.create(eduContentData);
  await eduContent.populate('createdBy', 'username avatar');

  res.status(201).json({
    status: 'success',
    message: 'Konten edukasi berhasil dibuat',
    data: { eduContent }
  });
}));

/**
 * @route   PUT /api/admin/edu-content/:id
 * @desc    Update educational content
 * @access  Private/Admin
 */
router.put('/edu-content/:id', validateEduContent, asyncHandler(async (req, res) => {
  const eduContent = await EduContent.findById(req.params.id);

  if (!eduContent) {
    return res.status(404).json({
      status: 'error',
      message: 'Konten edukasi tidak ditemukan'
    });
  }

  Object.assign(eduContent, req.body);
  await eduContent.save();
  await eduContent.populate('createdBy', 'username avatar');

  res.status(200).json({
    status: 'success',
    message: 'Konten edukasi berhasil diupdate',
    data: { eduContent }
  });
}));

/**
 * @route   PUT /api/admin/edu-content/:id/featured
 * @desc    Toggle featured status of educational content
 * @access  Private/Admin
 */
router.put('/edu-content/:id/featured', asyncHandler(async (req, res) => {
  const eduContent = await EduContent.findById(req.params.id);

  if (!eduContent) {
    return res.status(404).json({
      status: 'error',
      message: 'Konten edukasi tidak ditemukan'
    });
  }

  eduContent.featured = !eduContent.featured;
  await eduContent.save();

  res.status(200).json({
    status: 'success',
    message: eduContent.featured ? 'Konten berhasil dijadikan featured' : 'Status featured konten berhasil dihapus',
    data: { eduContent }
  });
}));

/**
 * @route   PUT /api/admin/edu-content/:id/status
 * @desc    Update content status (published/draft/archived)
 * @access  Private/Admin
 */
router.put('/edu-content/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['published', 'draft', 'archived'].includes(status)) {
    return res.status(400).json({
      status: 'error',
      message: 'Status tidak valid'
    });
  }

  const eduContent = await EduContent.findById(req.params.id);

  if (!eduContent) {
    return res.status(404).json({
      status: 'error',
      message: 'Konten edukasi tidak ditemukan'
    });
  }

  eduContent.status = status;
  await eduContent.save();

  res.status(200).json({
    status: 'success',
    message: `Status konten berhasil diubah menjadi ${status}`,
    data: { eduContent }
  });
}));

/**
 * @route   DELETE /api/admin/edu-content/:id
 * @desc    Delete educational content
 * @access  Private/Admin
 */
router.delete('/edu-content/:id', asyncHandler(async (req, res) => {
  const eduContent = await EduContent.findById(req.params.id);

  if (!eduContent) {
    return res.status(404).json({
      status: 'error',
      message: 'Konten edukasi tidak ditemukan'
    });
  }

  await EduContent.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Konten edukasi berhasil dihapus'
  });
}));

/**
 * @route   GET /api/admin/posts
 * @desc    Get all community posts for moderation
 * @access  Private/Admin
 */
router.get('/posts', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = '-createdAt',
    search,
    reported = false
  } = req.query;

  // Build query
  const query = {};
  if (search) {
    query.$text = { $search: search };
  }
  if (reported === 'true') {
    query.reported = { $gt: 0 };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const posts = await Post.find(query)
    .populate('author', 'username avatar')
    .populate('challenge', 'title')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await Post.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}));

/**
 * @route   DELETE /api/admin/posts/:id
 * @desc    Delete a community post
 * @access  Private/Admin
 */
router.delete('/posts/:id', asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post tidak ditemukan'
    });
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Post berhasil dihapus'
  });
}));

/**
 * @route   GET /api/admin/reports
 * @desc    Get system reports and exports
 * @access  Private/Admin
 */
router.get('/reports/:type', asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { startDate, endDate, format = 'json' } = req.query;

  let dateFilter = {};
  if (startDate && endDate) {
    dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
  }

  let reportData = {};

  switch (type) {
    case 'users':
      reportData = await User.find(dateFilter)
        .select('username email createdAt gameStats.level gameStats.totalPoints role')
        .sort('-createdAt');
      break;

    case 'challenges':
      reportData = await Challenge.find(dateFilter)
        .populate('createdBy', 'username')
        .select('title category difficulty points participants status createdAt')
        .sort('-createdAt');
      break;

    case 'user-activity':
      reportData = await User.aggregate([
        { $match: dateFilter },
        {
          $lookup: {
            from: 'challenges',
            localField: '_id',
            foreignField: 'participants.user',
            as: 'challengesJoined'
          }
        },
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'author',
            as: 'posts'
          }
        },
        {
          $project: {
            username: 1,
            email: 1,
            createdAt: 1,
            'gameStats.level': 1,
            'gameStats.totalPoints': 1,
            challengesCount: { $size: '$challengesJoined' },
            postsCount: { $size: '$posts' }
          }
        }
      ]);
      break;

    case 'engagement':
      const totalUsers = await User.countDocuments(dateFilter);
      const activeUsers = await User.countDocuments({
        ...dateFilter,
        updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });
      const totalPosts = await Post.countDocuments(dateFilter);
      const totalChallengeParticipations = await Challenge.aggregate([
        { $unwind: '$participants' },
        { $match: { 'participants.joinedAt': dateFilter.createdAt || {} } },
        { $count: 'total' }
      ]);

      reportData = {
        totalUsers,
        activeUsers,
        totalPosts,
        totalChallengeParticipations: totalChallengeParticipations[0]?.total || 0,
        engagementRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0
      };
      break;

    default:
      return res.status(400).json({
        status: 'error',
        message: 'Tipe report tidak valid'
      });
  }

  // Handle different export formats
  if (format === 'csv') {
    // You can implement CSV export here using a library like csv-writer or json2csv
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-report.csv"`);
    // For now, return JSON (implement CSV conversion as needed)
  }

  res.status(200).json({
    status: 'success',
    data: {
      report: reportData,
      type,
      dateRange: { startDate, endDate },
      generatedAt: new Date().toISOString()
    }
  });
}));

/**
 * @route   POST /api/admin/bulk-actions
 * @desc    Perform bulk actions on multiple items
 * @access  Private/Admin
 */
router.post('/bulk-actions', asyncHandler(async (req, res) => {
  const { action, type, ids, data } = req.body;

  if (!action || !type || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Parameter bulk action tidak valid'
    });
  }

  let result = {};

  try {
    switch (type) {
      case 'users':
        if (action === 'delete') {
          // Don't delete admins
          const nonAdminIds = await User.find({
            _id: { $in: ids },
            role: { $ne: 'admin' }
          }).select('_id');
          
          const idsToDelete = nonAdminIds.map(u => u._id);
          
          // Delete related data
          await Promise.all([
            Forest.deleteMany({ user: { $in: idsToDelete } }),
            Post.deleteMany({ author: { $in: idsToDelete } }),
            Challenge.updateMany(
              { 'participants.user': { $in: idsToDelete } },
              { $pull: { participants: { user: { $in: idsToDelete } } } }
            )
          ]);
          
          await User.deleteMany({ _id: { $in: idsToDelete } });
          result.deletedCount = idsToDelete.length;
          
        } else if (action === 'updateRole' && data?.role) {
          await User.updateMany(
            { _id: { $in: ids }, _id: { $ne: req.user._id } },
            { role: data.role }
          );
          result.modifiedCount = ids.length;
        }
        break;

      case 'challenges':
        if (action === 'delete') {
          await Challenge.deleteMany({ _id: { $in: ids } });
          result.deletedCount = ids.length;
        } else if (action === 'updateStatus' && data?.status) {
          await Challenge.updateMany(
            { _id: { $in: ids } },
            { status: data.status }
          );
          result.modifiedCount = ids.length;
        }
        break;

      case 'edu-content':
        if (action === 'delete') {
          await EduContent.deleteMany({ _id: { $in: ids } });
          result.deletedCount = ids.length;
        } else if (action === 'updateStatus' && data?.status) {
          await EduContent.updateMany(
            { _id: { $in: ids } },
            { status: data.status }
          );
          result.modifiedCount = ids.length;
        }
        break;

      case 'posts':
        if (action === 'delete') {
          await Post.deleteMany({ _id: { $in: ids } });
          result.deletedCount = ids.length;
        }
        break;

      default:
        return res.status(400).json({
          status: 'error',
          message: 'Tipe bulk action tidak valid'
        });
    }

    res.status(200).json({
      status: 'success',
      message: `Bulk action ${action} berhasil dilakukan pada ${type}`,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal melakukan bulk action',
      error: error.message
    });
  }
}));

/**
 * @route   GET /api/admin/system-health
 * @desc    Get system health and performance metrics
 * @access  Private/Admin
 */
router.get('/system-health', asyncHandler(async (req, res) => {
  const systemHealth = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      status: 'connected',
      collections: {
        users: await User.countDocuments(),
        challenges: await Challenge.countDocuments(),
        posts: await Post.countDocuments(),
        eduContent: await EduContent.countDocuments(),
        forests: await Forest.countDocuments()
      }
    },
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    }
  };

  res.status(200).json({
    status: 'success',
    data: systemHealth
  });
}));

module.exports = router;
const express = require('express');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { authenticate, optionalAuth, requireAdmin } = require('../middleware/auth');
const { validateChallenge } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * @route   GET /api/challenges
 * @desc    Get all challenges with filters
 * @access  Public
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    category,
    difficulty,
    status = 'active',
    search,
    page = 1,
    limit = 10,
    sort = '-createdAt'
  } = req.query;

  // Build query
  const query = {};
  
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (status) query.status = status;
  if (search) {
    query.$text = { $search: search };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get challenges
  const challenges = await Challenge.find(query)
    .populate('createdBy', 'username avatar')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  // Get total count for pagination
  const total = await Challenge.countDocuments(query);

  // Add user participation status if authenticated
  const challengesWithStatus = challenges.map(challenge => {
    const challengeObj = challenge.toObject();
    
    if (req.user) {
      const userParticipation = challenge.participants.find(
        p => p.user.toString() === req.user.id
      );
      challengeObj.userStatus = userParticipation ? userParticipation.status : 'not-joined';
      challengeObj.userJoinedAt = userParticipation?.joinedAt;
    } else {
      challengeObj.userStatus = 'guest';
    }

    return challengeObj;
  });

  res.status(200).json({
    status: 'success',
    data: {
      challenges: challengesWithStatus,
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
 * @route   GET /api/challenges/featured
 * @desc    Get featured challenge
 * @access  Public
 */
router.get('/featured', optionalAuth, asyncHandler(async (req, res) => {
  const featuredChallenge = await Challenge.findOne({ 
    featured: true, 
    status: 'active' 
  })
    .populate('createdBy', 'username avatar');

  if (!featuredChallenge) {
    // If no featured challenge, get the most recent active challenge
    const challenge = await Challenge.findOne({ status: 'active' })
      .populate('createdBy', 'username avatar')
      .sort('-createdAt');

    if (challenge) {
      challenge.featured = true;
      await challenge.save();
      
      return res.status(200).json({
        status: 'success',
        data: { challenge }
      });
    }

    return res.status(404).json({
      status: 'error',
      message: 'Tidak ada challenge aktif'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { challenge: featuredChallenge }
  });
}));

/**
 * @route   GET /api/challenges/:id
 * @desc    Get single challenge
 * @access  Public
 */
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id)
    .populate('createdBy', 'username avatar')
    .populate('participants.user', 'username avatar');

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge tidak ditemukan'
    });
  }

  const challengeObj = challenge.toObject();

  // Add user status if authenticated
  if (req.user) {
    const userParticipation = challenge.participants.find(
      p => p.user._id.toString() === req.user.id
    );
    challengeObj.userStatus = userParticipation ? userParticipation.status : 'not-joined';
    challengeObj.userParticipation = userParticipation;
  } else {
    challengeObj.userStatus = 'guest';
  }

  res.status(200).json({
    status: 'success',
    data: { challenge: challengeObj }
  });
}));

/**
 * @route   POST /api/challenges
 * @desc    Create new challenge (Admin only)
 * @access  Private/Admin
 */
router.post('/', authenticate, requireAdmin, validateChallenge, asyncHandler(async (req, res) => {
  const challengeData = {
    ...req.body,
    createdBy: req.user.id
  };

  const challenge = await Challenge.create(challengeData);

  res.status(201).json({
    status: 'success',
    message: 'Challenge berhasil dibuat',
    data: { challenge }
  });
}));

/**
 * @route   PUT /api/challenges/:id
 * @desc    Update challenge (Admin only)
 * @access  Private/Admin
 */
router.put('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge tidak ditemukan'
    });
  }

  const updatedChallenge = await Challenge.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Challenge berhasil diperbarui',
    data: { challenge: updatedChallenge }
  });
}));

/**
 * @route   DELETE /api/challenges/:id
 * @desc    Delete challenge (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
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
 * @route   POST /api/challenges/:id/join
 * @desc    Join a challenge
 * @access  Private
 */
router.post('/:id/join', authenticate, asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge tidak ditemukan'
    });
  }

  if (challenge.status !== 'active') {
    return res.status(400).json({
      status: 'error',
      message: 'Challenge tidak aktif'
    });
  }

  // Check if user already joined
  const existingParticipation = challenge.participants.find(
    p => p.user.toString() === req.user.id
  );

  if (existingParticipation) {
    return res.status(400).json({
      status: 'error',
      message: 'Anda sudah bergabung dengan challenge ini'
    });
  }

  // Add user to participants
  challenge.participants.push({
    user: req.user.id,
    status: 'joined'
  });

  await challenge.save();

  res.status(200).json({
    status: 'success',
    message: 'Berhasil bergabung dengan challenge!',
    data: { challengeId: challenge._id }
  });
}));

/**
 * @route   POST /api/challenges/:id/complete
 * @desc    Complete a challenge
 * @access  Private
 */
router.post('/:id/complete', authenticate, asyncHandler(async (req, res) => {
  const { submissionText, submissionImages, location } = req.body;
  
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge tidak ditemukan'
    });
  }

  // Find user participation
  const participationIndex = challenge.participants.findIndex(
    p => p.user.toString() === req.user.id
  );

  if (participationIndex === -1) {
    return res.status(400).json({
      status: 'error',
      message: 'Anda harus bergabung dengan challenge ini terlebih dahulu'
    });
  }

  const participation = challenge.participants[participationIndex];

  if (participation.status === 'completed') {
    return res.status(400).json({
      status: 'error',
      message: 'Anda sudah menyelesaikan challenge ini'
    });
  }

  // Update participation
  challenge.participants[participationIndex] = {
    ...participation,
    status: 'completed',
    completedAt: new Date(),
    submissionData: {
      text: submissionText,
      images: submissionImages || [],
      location: location || null
    }
  };

  await challenge.save();

  // Update user stats
  const user = await User.findById(req.user.id);
  user.gameStats.totalPoints += challenge.points;
  user.statistics.challengesCompleted += 1;

  // Update specific stats based on challenge category
  switch (challenge.category) {
    case 'plantation':
      user.statistics.treesPlanted += 1;
      break;
    case 'recycle':
      user.statistics.wasteRecycled += 1;
      break;
    case 'water':
      user.statistics.waterSaved += 10; // Example: 10 liters saved
      break;
  }

  // Check for new badges
  const newBadges = [];
  
  if (user.statistics.challengesCompleted >= 5 && !user.gameStats.badges.some(b => b.name === 'Challenge Starter')) {
    newBadges.push({
      name: 'Challenge Starter',
      description: 'Menyelesaikan 5 challenge',
      earnedAt: new Date()
    });
  }

  if (user.statistics.challengesCompleted >= 20 && !user.gameStats.badges.some(b => b.name === 'Challenge Master')) {
    newBadges.push({
      name: 'Challenge Master',
      description: 'Menyelesaikan 20 challenge',
      earnedAt: new Date()
    });
  }

  if (user.statistics.treesPlanted >= 10 && !user.gameStats.badges.some(b => b.name === 'Tree Lover')) {
    newBadges.push({
      name: 'Tree Lover',
      description: 'Menanam 10 pohon',
      earnedAt: new Date()
    });
  }

  user.gameStats.badges.push(...newBadges);
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Challenge berhasil diselesaikan!',
    data: {
      pointsEarned: challenge.points,
      newBadges,
      totalPoints: user.gameStats.totalPoints,
      level: user.gameStats.level
    }
  });
}));

/**
 * @route   GET /api/challenges/:id/participants
 * @desc    Get challenge participants
 * @access  Public
 */
router.get('/:id/participants', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const challenge = await Challenge.findById(req.params.id)
    .populate('participants.user', 'username avatar gameStats.level')
    .select('participants');

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge tidak ditemukan'
    });
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const participants = challenge.participants
    .slice(skip, skip + limitNum)
    .map(p => ({
      user: p.user,
      status: p.status,
      joinedAt: p.joinedAt,
      completedAt: p.completedAt
    }));

  res.status(200).json({
    status: 'success',
    data: {
      participants,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: challenge.participants.length,
        pages: Math.ceil(challenge.participants.length / limitNum)
      }
    }
  });
}));

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/submissions';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF, WebP)'));
    }
  }
});

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route   POST /api/submissions
 * @desc    Create new submission - FIXED VERSION
 * @access  Private
 */
router.post('/', upload.array('images', 5), asyncHandler(async (req, res) => {
  try {
    // Enhanced logging untuk debugging
    console.log('📝 Creating new submission:');
    console.log('- Body:', JSON.stringify(req.body, null, 2));
    console.log('- Files:', req.files?.map(f => ({ 
      fieldname: f.fieldname, 
      originalname: f.originalname, 
      size: f.size 
    })) || 'No files');
    console.log('- User ID:', req.user._id);
    console.log('- Request headers:', {
      'content-type': req.headers['content-type'],
      'authorization': req.headers.authorization ? 'Present' : 'Missing'
    });

    const { challengeId, submissionText, location } = req.body;

    // Detailed validation logging
    console.log('🔍 Validation check:');
    console.log('- challengeId:', challengeId, '(type:', typeof challengeId, ')');
    console.log('- submissionText:', submissionText, '(type:', typeof submissionText, ')');
    console.log('- location:', location, '(type:', typeof location, ')');

    // Validate required fields with detailed error messages
    if (!challengeId) {
      console.log('❌ Missing challengeId');
      return res.status(400).json({
        status: 'error',
        message: 'Challenge ID is required',
        debug: { 
          receivedFields: Object.keys(req.body),
          challengeId: challengeId
        }
      });
    }

    if (!submissionText) {
      console.log('❌ Missing submissionText');
      return res.status(400).json({
        status: 'error',
        message: 'Submission text is required',
        debug: { 
          receivedFields: Object.keys(req.body),
          submissionText: submissionText
        }
      });
    }

    // Trim whitespace from submissionText
    const trimmedSubmissionText = submissionText.trim();
    if (!trimmedSubmissionText) {
      console.log('❌ Empty submissionText after trimming');
      return res.status(400).json({
        status: 'error',
        message: 'Submission text cannot be empty',
        debug: { 
          originalLength: submissionText.length, 
          trimmedLength: trimmedSubmissionText.length 
        }
      });
    }

    // Validate challengeId format (must be valid ObjectId)
    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
      console.log('❌ Invalid challengeId format');
      return res.status(400).json({
        status: 'error',
        message: 'Invalid challenge ID format',
        debug: { challengeId }
      });
    }

    // Check if challenge exists and is active
    console.log('🔍 Checking if challenge exists:', challengeId);
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      console.log('❌ Challenge not found:', challengeId);
      return res.status(404).json({
        status: 'error',
        message: 'Challenge not found'
      });
    }

    // Check if challenge is active
    if (challenge.status !== 'active') {
      console.log('❌ Challenge is not active:', challenge.status);
      return res.status(400).json({
        status: 'error',
        message: 'Challenge is not active'
      });
    }

    console.log('✅ Challenge found:', challenge.title);

    // Check if user has joined the challenge
    const userParticipation = challenge.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!userParticipation) {
      console.log('❌ User has not joined this challenge');
      return res.status(400).json({
        status: 'error',
        message: 'You must join the challenge before submitting'
      });
    }

    // Check if user already submitted for this challenge
    console.log('🔍 Checking for existing submission...');
    const existingSubmission = await Submission.findOne({
      challenge: challengeId,
      user: req.user._id
    });

    if (existingSubmission) {
      console.log('❌ User already submitted for this challenge');
      return res.status(400).json({
        status: 'error',
        message: 'You have already submitted for this challenge',
        debug: { existingSubmissionId: existingSubmission._id }
      });
    }
    console.log('✅ No existing submission found');

    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      console.log('📸 Processing', req.files.length, 'uploaded images');
      req.files.forEach(file => {
        images.push({
          url: `/uploads/submissions/${file.filename}`,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        });
      });
    }

    // Parse location if provided
    let parsedLocation = null;
    if (location) {
      try {
        parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
        console.log('📍 Location parsed successfully');
      } catch (e) {
        console.warn('⚠️ Failed to parse location:', e.message);
      }
    }

    // Create submission
    console.log('💾 Creating submission...');
    const submissionData = {
      challenge: challengeId,
      user: req.user._id,
      title: trimmedSubmissionText.substring(0, 100),
      description: trimmedSubmissionText,
      images,
      status: 'pending',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        location: parsedLocation
      }
    };

    console.log('📋 Submission data:', JSON.stringify(submissionData, null, 2));

    const submission = await Submission.create(submissionData);

    // Update challenge participant status
    await Challenge.updateOne(
      { 
        _id: challengeId,
        'participants.user': req.user._id
      },
      {
        $set: {
          'participants.$.status': 'submitted',
          'participants.$.submittedAt': new Date()
        }
      }
    );

    // Populate challenge and user data
    await submission.populate([
      { path: 'challenge', select: 'title category points difficulty' },
      { path: 'user', select: 'username avatar email' }
    ]);

    console.log('✅ Submission created successfully:', submission._id);

    res.status(201).json({
      status: 'success',
      message: 'Submission created successfully',
      data: {
        submission
      }
    });

  } catch (error) {
    console.error('❌ Error creating submission:', error);
    
    // Check for specific database errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate submission detected'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create submission',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : 'Internal server error'
    });
  }
}));

/**
 * @route   GET /api/submissions/admin
 * @desc    Get all submissions for admin review - FIXED VERSION
 * @access  Private/Admin
 */
router.get('/admin', requireAdmin, asyncHandler(async (req, res) => {
  console.log('🔍 Admin fetching submissions:', req.query);

  const {
    page = 1,
    limit = 20,
    status = '',
    sort = '-submittedAt',
    challengeId,
    userId
  } = req.query;

  // Build query
  const query = {};
  if (status && status !== '') {
    query.status = status;
  }
  if (challengeId) {
    query.challenge = challengeId;
  }
  if (userId) {
    query.user = userId;
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  try {
    console.log('📊 Query:', query);
    console.log('📄 Pagination:', { page: pageNum, limit: limitNum, skip });

    // Get submissions with populated data
    const submissions = await Submission.find(query)
      .populate({
        path: 'challenge',
        select: 'title category points difficulty status'
      })
      .populate({
        path: 'user',
        select: 'username avatar email gameStats'
      })
      .populate({
        path: 'adminReview.reviewedBy',
        select: 'username avatar'
      })
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Submission.countDocuments(query);

    console.log(`📋 Found ${submissions.length} submissions (${total} total)`);

    // Get submission stats
    const stats = await Submission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const submissionStats = {
      pending: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      submissionStats[stat._id] = stat.count;
    });

    // Transform submissions to match frontend expectations
    const transformedSubmissions = submissions.map(submission => ({
      _id: submission._id,
      challenge: submission.challenge,
      user: submission.user,
      title: submission.title,
      submissionText: submission.description,
      submissionImages: submission.images,
      status: submission.status,
      submittedAt: submission.submittedAt,
      adminReview: submission.adminReview,
      metadata: submission.metadata,
      imageCount: submission.images?.length || 0,
      submissionAge: Date.now() - new Date(submission.submittedAt).getTime()
    }));

    console.log('✅ Sending response with', transformedSubmissions.length, 'submissions');

    res.status(200).json({
      status: 'success',
      data: {
        submissions: transformedSubmissions,
        stats: submissionStats,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching admin submissions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch submissions',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : 'Internal server error'
    });
  }
}));

/**
 * @route   GET /api/submissions/user
 * @desc    Get current user's submissions
 * @access  Private
 */
router.get('/user', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    sort = '-submittedAt'
  } = req.query;

  // Build query
  const query = { user: req.user._id };
  if (status) {
    query.status = status;
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  try {
    const submissions = await Submission.find(query)
      .populate('challenge', 'title category points difficulty status')
      .populate('user', 'username avatar')
      .populate('adminReview.reviewedBy', 'username avatar')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Submission.countDocuments(query);

    // Get stats
    const stats = await Submission.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const submissionStats = {
      pending: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      submissionStats[stat._id] = stat.count;
    });

    res.status(200).json({
      status: 'success',
      data: {
        submissions,
        stats: submissionStats,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user submissions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

/**
 * @route   GET /api/submissions/:id
 * @desc    Get single submission by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('challenge', 'title category points difficulty')
      .populate('user', 'username avatar email')
      .populate('adminReview.reviewedBy', 'username avatar');

    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found'
      });
    }

    // Check if user can access this submission
    if (submission.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        submission
      }
    });

  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch submission'
    });
  }
}));

/**
 * @route   PUT /api/submissions/:id/review
 * @desc    Review submission (approve/reject)
 * @access  Private/Admin
 */
router.put('/:id/review', requireAdmin, asyncHandler(async (req, res) => {
  const { status, comment, rating } = req.body;

  // Validate status
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      status: 'error',
      message: 'Status must be either approved or rejected'
    });
  }

  // Validate rating for approved submissions
  if (status === 'approved' && rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({
      status: 'error',
      message: 'Rating must be between 1 and 5'
    });
  }

  try {
    const submission = await Submission.findById(req.params.id)
      .populate('challenge', 'title points')
      .populate('user', 'username gameStats');

    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found'
      });
    }

    // Check if already reviewed
    if (submission.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'This submission has already been reviewed'
      });
    }

    // Update submission
    submission.status = status;
    submission.adminReview = {
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      comment: comment || '',
      rating: status === 'approved' ? (rating || 5) : undefined
    };

    await submission.save();

    // If approved, award points to user
    if (status === 'approved') {
      const user = await User.findById(submission.user._id);
      if (user) {
        const pointsToAward = submission.challenge.points || 0;
        const bonusPoints = rating === 5 ? Math.floor(pointsToAward * 0.1) : 0;
        const totalPoints = pointsToAward + bonusPoints;

        user.gameStats.totalPoints += totalPoints;
        user.gameStats.completedChallenges += 1;

        // Calculate new level
        const newLevel = Math.floor(user.gameStats.totalPoints / 1000) + 1;
        if (newLevel > user.gameStats.level) {
          user.gameStats.level = newLevel;
        }

        await user.save();

        // Update challenge participant status
        await Challenge.updateOne(
          { 
            _id: submission.challenge._id,
            'participants.user': submission.user._id
          },
          {
            $set: {
              'participants.$.status': 'completed',
              'participants.$.completedAt': new Date(),
              'participants.$.pointsEarned': totalPoints
            }
          }
        );
      }
    }

    // Populate the updated submission
    await submission.populate([
      { path: 'challenge', select: 'title category points' },
      { path: 'user', select: 'username avatar email' },
      { path: 'adminReview.reviewedBy', select: 'username avatar' }
    ]);

    res.status(200).json({
      status: 'success',
      message: `Submission ${status} successfully`,
      data: {
        submission
      }
    });

  } catch (error) {
    console.error('Error reviewing submission:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to review submission'
    });
  }
}));

// Error handling middleware for multer
router.use((error, req, res, next) => {
  console.error('❌ Route Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 10MB per file.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
  }
  
  if (error.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
  
  // Generic error
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = router;
const express = require('express');
const EduContent = require('../models/EduContent');
const { authenticate, optionalAuth, requireAdmin } = require('../middleware/auth');
const { validateEduContent } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * @route   GET /api/ecoedu
 * @desc    Get all educational content
 * @access  Public
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    type,
    category,
    search,
    difficulty,
    page = 1,
    limit = 12,
    sort = '-createdAt'
  } = req.query;

  // Build query
  const query = { status: 'published' };
  
  if (type) query.type = type;
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (search) {
    query.$text = { $search: search };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const content = await EduContent.find(query)
    .select('-fullContent') // Don't include full content in list
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await EduContent.countDocuments(query);

  // Add user interaction status if authenticated
  const contentWithStatus = content.map(item => {
    const itemObj = item.toObject();
    
    if (req.user) {
      itemObj.isLiked = item.likes.includes(req.user.id);
      itemObj.isBookmarked = item.bookmarks.includes(req.user.id);
    } else {
      itemObj.isLiked = false;
      itemObj.isBookmarked = false;
    }

    return itemObj;
  });

  res.status(200).json({
    status: 'success',
    data: {
      content: contentWithStatus,
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
 * @route   GET /api/ecoedu/featured
 * @desc    Get featured educational content
 * @access  Public
 */
router.get('/featured', asyncHandler(async (req, res) => {
  const featuredContent = await EduContent.find({ 
    featured: true, 
    status: 'published' 
  })
    .select('-fullContent')
    .sort('-createdAt')
    .limit(6);

  res.status(200).json({
    status: 'success',
    data: { content: featuredContent }
  });
}));

/**
 * @route   GET /api/ecoedu/:id
 * @desc    Get single educational content
 * @access  Public
 */
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const content = await EduContent.findById(req.params.id);

  if (!content || content.status !== 'published') {
    return res.status(404).json({
      status: 'error',
      message: 'Konten tidak ditemukan'
    });
  }

  // Increment view count
  content.views += 1;
  await content.save();

  // Get related content
  const relatedContent = await EduContent.find({
    _id: { $ne: content._id },
    $or: [
      { category: content.category },
      { type: content.type }
    ],
    status: 'published'
  })
    .select('-fullContent')
    .limit(3);

  const contentObj = content.toObject();
  
  if (req.user) {
    contentObj.isLiked = content.likes.includes(req.user.id);
    contentObj.isBookmarked = content.bookmarks.includes(req.user.id);
  } else {
    contentObj.isLiked = false;
    contentObj.isBookmarked = false;
  }

  res.status(200).json({
    status: 'success',
    data: {
      content: contentObj,
      relatedContent
    }
  });
}));

/**
 * @route   POST /api/ecoedu/:id/like
 * @desc    Toggle like on educational content
 * @access  Private
 */
router.post('/:id/like', authenticate, asyncHandler(async (req, res) => {
  const content = await EduContent.findById(req.params.id);

  if (!content) {
    return res.status(404).json({
      status: 'error',
      message: 'Konten tidak ditemukan'
    });
  }

  const likeIndex = content.likes.indexOf(req.user.id);
  let action;

  if (likeIndex > -1) {
    // Unlike
    content.likes.splice(likeIndex, 1);
    action = 'unliked';
  } else {
    // Like
    content.likes.push(req.user.id);
    action = 'liked';
  }

  await content.save();

  res.status(200).json({
    status: 'success',
    message: action === 'liked' ? 'Konten disukai' : 'Like dibatalkan',
    data: {
      action,
      likeCount: content.likes.length
    }
  });
}));

/**
 * @route   POST /api/ecoedu/:id/bookmark
 * @desc    Toggle bookmark on educational content
 * @access  Private
 */
router.post('/:id/bookmark', authenticate, asyncHandler(async (req, res) => {
  const content = await EduContent.findById(req.params.id);

  if (!content) {
    return res.status(404).json({
      status: 'error',
      message: 'Konten tidak ditemukan'
    });
  }

  const bookmarkIndex = content.bookmarks.indexOf(req.user.id);
  let action;

  if (bookmarkIndex > -1) {
    // Remove bookmark
    content.bookmarks.splice(bookmarkIndex, 1);
    action = 'unbookmarked';
  } else {
    // Add bookmark
    content.bookmarks.push(req.user.id);
    action = 'bookmarked';
  }

  await content.save();

  res.status(200).json({
    status: 'success',
    message: action === 'bookmarked' ? 'Konten disimpan' : 'Bookmark dibatalkan',
    data: {
      action,
      bookmarkCount: content.bookmarks.length
    }
  });
}));

/**
 * @route   POST /api/ecoedu/:id/comments
 * @desc    Add comment to educational content
 * @access  Private
 */
router.post('/:id/comments', authenticate, asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Komentar tidak boleh kosong'
    });
  }

  const content = await EduContent.findById(req.params.id);

  if (!content) {
    return res.status(404).json({
      status: 'error',
      message: 'Konten tidak ditemukan'
    });
  }

  const newComment = {
    text: text.trim(),
    author: req.user.id
  };

  content.comments.push(newComment);
  await content.save();

  // Get the populated comment
  const updatedContent = await EduContent.findById(req.params.id)
    .populate('comments.author', 'username avatar');

  const addedComment = updatedContent.comments[updatedContent.comments.length - 1];

  res.status(201).json({
    status: 'success',
    message: 'Komentar berhasil ditambahkan',
    data: { comment: addedComment }
  });
}));

module.exports = router;

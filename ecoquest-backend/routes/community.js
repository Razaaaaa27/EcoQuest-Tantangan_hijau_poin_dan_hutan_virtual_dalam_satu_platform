const express = require('express');
const Post = require('../models/Post');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validatePost, validateComment } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * @route   GET /api/community/posts
 * @desc    Get all posts
 * @access  Public
 */
router.get('/posts', optionalAuth, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    filter = 'all',
    sort = '-createdAt'
  } = req.query;

  // Build query based on filter
  let query = { visibility: 'public' };
  
  if (filter === 'challenges') {
    query.challenge = { $ne: null };
  } else if (filter === 'following' && req.user) {
    // In a real app, you'd have a following system
    // For now, we'll show posts from other users
    query.author = { $ne: req.user.id };
  } else if (filter === 'mine' && req.user) {
    query.author = req.user.id;
    delete query.visibility; // Show all user's posts regardless of visibility
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const posts = await Post.find(query)
    .populate('author', 'username avatar gameStats.level')
    .populate('challenge', 'title category')
    .populate('comments.author', 'username avatar')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await Post.countDocuments(query);

  // Add user interaction status
  const postsWithStatus = posts.map(post => {
    const postObj = post.toObject();
    
    if (req.user) {
      postObj.isLiked = post.likes.includes(req.user.id);
      postObj.isOwner = post.author._id.toString() === req.user.id;
    } else {
      postObj.isLiked = false;
      postObj.isOwner = false;
    }

    return postObj;
  });

  res.status(200).json({
    status: 'success',
    data: {
      posts: postsWithStatus,
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
 * @route   GET /api/community/posts/:id
 * @desc    Get single post
 * @access  Public
 */
router.get('/posts/:id', optionalAuth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username avatar gameStats.level')
    .populate('challenge', 'title category')
    .populate('comments.author', 'username avatar');

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post tidak ditemukan'
    });
  }

  // Check visibility
  if (post.visibility === 'private' && (!req.user || post.author._id.toString() !== req.user.id)) {
    return res.status(403).json({
      status: 'error',
      message: 'Anda tidak memiliki akses ke post ini'
    });
  }

  const postObj = post.toObject();
  
  if (req.user) {
    postObj.isLiked = post.likes.includes(req.user.id);
    postObj.isOwner = post.author._id.toString() === req.user.id;
  } else {
    postObj.isLiked = false;
    postObj.isOwner = false;
  }

  res.status(200).json({
    status: 'success',
    data: { post: postObj }
  });
}));

/**
 * @route   POST /api/community/posts
 * @desc    Create new post
 * @access  Private
 */
router.post('/posts', authenticate, validatePost, asyncHandler(async (req, res) => {
  const postData = {
    ...req.body,
    author: req.user.id
  };

  const post = await Post.create(postData);
  
  const populatedPost = await Post.findById(post._id)
    .populate('author', 'username avatar gameStats.level')
    .populate('challenge', 'title category');

  res.status(201).json({
    status: 'success',
    message: 'Post berhasil dibuat',
    data: { post: populatedPost }
  });
}));

/**
 * @route   PUT /api/community/posts/:id
 * @desc    Update post
 * @access  Private
 */
router.put('/posts/:id', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post tidak ditemukan'
    });
  }

  // Check ownership
  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Anda tidak memiliki izin untuk mengubah post ini'
    });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('author', 'username avatar gameStats.level')
   .populate('challenge', 'title category');

  res.status(200).json({
    status: 'success',
    message: 'Post berhasil diperbarui',
    data: { post: updatedPost }
  });
}));

/**
 * @route   DELETE /api/community/posts/:id
 * @desc    Delete post
 * @access  Private
 */
router.delete('/posts/:id', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post tidak ditemukan'
    });
  }

  // Check ownership
  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Anda tidak memiliki izin untuk menghapus post ini'
    });
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Post berhasil dihapus'
  });
}));

/**
 * @route   POST /api/community/posts/:id/like
 * @desc    Toggle like on post
 * @access  Private
 */
router.post('/posts/:id/like', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post tidak ditemukan'
    });
  }

  const likeIndex = post.likes.indexOf(req.user.id);
  let action;

  if (likeIndex > -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
    action = 'unliked';
  } else {
    // Like
    post.likes.push(req.user.id);
    action = 'liked';
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    message: action === 'liked' ? 'Post disukai' : 'Like dibatalkan',
    data: {
      action,
      likeCount: post.likes.length
    }
  });
}));

/**
 * @route   POST /api/community/posts/:id/comments
 * @desc    Add comment to post
 * @access  Private
 */
router.post('/posts/:id/comments', authenticate, validateComment, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post tidak ditemukan'
    });
  }

  const newComment = {
    text: req.body.text,
    author: req.user.id
  };

  post.comments.push(newComment);
  await post.save();

  // Get the populated comment
  const updatedPost = await Post.findById(req.params.id)
    .populate('comments.author', 'username avatar');

  const addedComment = updatedPost.comments[updatedPost.comments.length - 1];

  res.status(201).json({
    status: 'success',
    message: 'Komentar berhasil ditambahkan',
    data: { comment: addedComment }
  });
}));

module.exports = router;